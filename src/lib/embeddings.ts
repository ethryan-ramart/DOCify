import {Configuration, OpenAIApi} from 'openai-edge'

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function getEmbeddings(text: string) {
  try {
    const response = await openai.createEmbedding({
      model: 'text-embedding-3-small',
      input: text.replace(/\n/g, " "),
    });
    
    const result = await response.json();
    
    // Extract the embedding from the response
    return result.data[0].embedding as number[];
  } catch (error) {
    console.log('error calling the open AI embeddings API:', error);
    throw error;
  }
}

export async function embedChunks(chunks: string[]): Promise<any> {
  // You can use any embedding model or service here.
  // In this example, we use OpenAI's text-embedding-3-small model.
  try {
    const response = await openai.createEmbedding({
      model: "text-embedding-3-small",
      input: chunks
    });
    const result = await response.json();

    return result.data;
  } catch (error) {
    console.error("Error embedding text with OpenAI:", error);
    throw error;
  }
}
