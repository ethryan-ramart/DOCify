import { chunkAndEmbedFile, processFile, upsertDocument } from "./fileProcessor";

export async function upsertNewDocumenToPinecone(documentId: string, fileData: Buffer, documentUrl: string, fileType: string, namespace: string) {
  // 1. Get the document file from the URL provided.
  // 2. processs the document
  // 2.1 Get the document text content
  // console.log("Getting document content")
  const { documentContent } = await processFile(documentId, fileData, fileType);
  // console.log("Document content ok")

  // console.log("Chunking and embedding document")
  // 2.2 Chunk the document content into smaller parts and embed them
  const document = await chunkAndEmbedFile(documentId, documentUrl, documentContent);
  // console.log("Document chunking and embedding ok", document.document)

  // 3. upsert the document embeddings into pinecone
  await upsertDocument(document.document, namespace);
}