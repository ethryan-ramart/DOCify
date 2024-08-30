import { Pinecone } from "@pinecone-database/pinecone";
// import { converToAscii } from "./utils";
import { getEmbeddings } from "./embeddings";
import { ScoredPineconeRecord } from "@pinecone-database/pinecone";

type Metadata = {
  text: string;
  number: number;
}

export async function getMatchesFromEmbeddings(embeddings: number[], topK: number, namespace: string) {

  const pinecone = new Pinecone({ apiKey: process.env.NEXT_PINECONE_API_KEY as string }); // instance pinecone

  let indexName: string = process.env.NEXT_PINECONE_INDEX_NAME || "";

  // Retrieve list of indexes to check if expected index exists
  const indexes = (await pinecone.listIndexes())?.indexes;
  if (!indexes || indexes.filter((i) => i.name === indexName).length !== 1) {
    throw new Error(`Index ${indexName} does not exist. 
    Create an index called "${indexName}" in your project.`);
  }

  // const namespace = converToAscii(fileName) // convert the filename to ascii
  const pineconeNamespace = pinecone.Index(process.env.NEXT_PINECONE_INDEX_NAME as string).namespace(namespace ?? ""); // get the index

  try {
    // Query the index with the defined request
    const queryResult = await pineconeNamespace.query({
      vector: embeddings,
      topK,
      includeMetadata: true,
    });

    return queryResult.matches || [] // return the matches array or an empty array
  } catch (error) {
    console.log("Error querying the embedings", error)
    throw error
  }
}

// The function `getContext` is used to retrieve the context of a given message
export const getContext = async (
  message: string,
  namespace: string,
  maxCharacters = 3000,
  minScore = 0.15,
  getOnlyText = true
): Promise<string | ScoredPineconeRecord[]> => {
  try {
    const embeddings = await getEmbeddings(message);

    const matches = await getMatchesFromEmbeddings(embeddings, 5, namespace);
    const qualifyingDocs = matches.filter((m) => m.score && m.score > minScore);

    if (!getOnlyText) {
      return qualifyingDocs;
    }

    // Deduplicate and get text
    const documentTexts = qualifyingDocs.map((match) => {
      const metadata = match.metadata as Metadata;
      // return `REFERENCE URL: ${metadata.referenceURL} CONTENT: ${metadata.text}`;
      return `CONTENT: ${metadata.text}`;
    });

    // Concatenate, then truncate by maxCharacters
    const concatenatedDocs = documentTexts.join(" ");
    return concatenatedDocs.length > maxCharacters
      ? concatenatedDocs.substring(0, maxCharacters)
      : concatenatedDocs;
  } catch (error) {
    console.error("Failed to get context:", error);
    throw error;
  }
};