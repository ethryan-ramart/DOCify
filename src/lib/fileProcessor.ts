import pdfParse from "pdf-parse";
import { embedChunks, getEmbeddings } from "./embeddings";
import { PineconeRecord, RecordMetadata } from "@pinecone-database/pinecone";
import { getPineconeClient } from "./pinecone";

export interface Chunk {
  id: string; // Composite ID: 'documentId#chunkId'
  values: number[]; // Embedding vector
  text: string; // Raw text of the chunk
}

export interface Document {
  documentId: string;
  documentUrl: string;
  chunks: Chunk[];
}

async function processFile(
  /**
   * Processes a file and extracts its content and word count.
   * @param fileName - The name of the file.
   * @param fileData - The file data as a Buffer.
   * @param fileType - The type of the file.
   * @returns An object containing the document content, word count, and an optional error message.
   */
  fileName: string,
  fileData: Buffer,
  fileType: string
): Promise<{ documentContent: string; wordCount: number; error?: string }> {
  try {
    let documentContent = "";
    if (fileType === "application/pdf") {
      const pdfData = await pdfParse(fileData, {
        pagerender: function (page: any) {
          return page
            .getTextContent({
              normalizeWhitespace: true,
            })
            .then(function (textContent: { items: any[] }) {
              return textContent.items
                .map(function (item) {
                  return item.str;
                })
                .join(" ");
            });
        },
      });
      documentContent = pdfData.text;
      // console.log("Processing file ", fileName);
    } else {
      documentContent = fileData.toString("utf8");
    }

    const wordCount = documentContent.split(/\s+/).length;

    return { documentContent, wordCount };
  } catch (error: any) {
    console.error(
      "An error occurred while processing the document:",
      error.message
    );
    throw error;
  }
}

async function chunkAndEmbedFile(
  /**
   * Chunks the content into smaller pieces and embeds them using the embedChunks function.
   * @param documentId - The ID of the document.
   * @param documentUrl - The URL of the document.
   * @param content - The content to be chunked and embedded.
   * @returns A promise that resolves to an object containing the processed document.
   * @throws If there is an error in chunking and embedding the document.
   */
  documentId: string,
  documentUrl: string,
  content: string
): Promise<{ document: Document }> {
  try {
    const document: Document = {
      documentId,
      documentUrl,
      chunks: [],
    };

    // Pick a chunking strategy (this will depend on the use case and the desired chunk size!)
    const chunks = chunkTextByMultiParagraphs(content);

    // Embed the chunks using the embedChunks function
    const embeddings = await embedChunks(chunks);
    // console.log("Embeddings", embeddings);

    // Combine the chunks and their corresponding embeddings
    // Construct the id prefix using the documentId and the chunk index
    for (let i = 0; i < chunks.length; i++) {
      document.chunks.push({
        id: `${document.documentId}:${i}`,
        values: embeddings[i].embedding,
        text: chunks[i],
      });
    }

    return { document };
  } catch (error) {
    console.error("Error in chunking and embedding document:", error);
    throw error;
  }
}

/**
 * Splits a given text into chunks of 1 to many paragraphs.
 *
 * @param text - The input text to be chunked.
 * @param maxChunkSize - The maximum size (in characters) allowed for each chunk. Default is 1000.
 * @param minChunkSize - The minimum size (in characters) required for each chunk. Default is 100.
 * @returns An array of chunked text, where each chunk contains 1 or multiple "paragraphs"
 */
function chunkTextByMultiParagraphs(
  text: string,
  maxChunkSize = 1500,
  minChunkSize = 500
): string[] {
  const chunks: string[] = [];
  let currentChunk = "";

  let startIndex = 0;
  while (startIndex < text.length) {
    let endIndex = startIndex + maxChunkSize;
    if (endIndex >= text.length) {
      endIndex = text.length;
    } else {
      // Just using this to find the nearest paragraph boundary
      const paragraphBoundary = text.indexOf("\n\n", endIndex);
      if (paragraphBoundary !== -1) {
        endIndex = paragraphBoundary;
      }
    }

    const chunk = text.slice(startIndex, endIndex).trim();
    if (chunk.length >= minChunkSize) {
      chunks.push(chunk);
      currentChunk = "";
    } else {
      currentChunk += chunk + "\n\n";
    }

    startIndex = endIndex + 1;
  }

  if (currentChunk.length >= minChunkSize) {
    chunks.push(currentChunk.trim());
  } else if (chunks.length > 0) {
    chunks[chunks.length - 1] += "\n\n" + currentChunk.trim();
  } else {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

async function upsertDocument(document: Document, namespaceId: string) {
  if (typeof namespaceId !== 'string') {
    throw new Error('namespaceId must be a string');
  }

  const pinecone = await getPineconeClient();
  const pineconeIndex = pinecone.Index(process.env.NEXT_PINECONE_INDEX_NAME as string);
  await pinecone.describeIndex(process.env.NEXT_PINECONE_INDEX_NAME as string);

  // Adjust to use namespaces if you're organizing data that way
  const namespace = pineconeIndex.namespace(namespaceId as string);
  
  // console.log("Generating vectors for document chunks")
    const vectors: PineconeRecord<RecordMetadata>[] = document.chunks.map(
      (chunk) => ({
        id: chunk.id,
        values: chunk.values,
        metadata: {
          text: chunk.text.replace(/\n/g, " "),
          referenceURL: document.documentUrl,
        },
      })
    );

    // console.log(vectors)

    await pineconeIndex.namespace(namespaceId).upsert(vectors);
    // // Batch the upsert operation
    // const batchSize = 200;
    // for (let i = 0; i < vectors.length; i += batchSize) {
    //   const batch = vectors.slice(i, i + batchSize);
    //   await namespace.upsert(batch);
    // }
  }
export { chunkAndEmbedFile, processFile, upsertDocument };