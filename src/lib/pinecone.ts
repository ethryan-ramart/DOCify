import { Pinecone } from '@pinecone-database/pinecone';
// import { Pinecone, PineconeRecord, RecordMetadata } from '@pinecone-database/pinecone';
// import {Document, RecursiveCharacterTextSplitter as pineconeCharSplitter} from '@pinecone-database/doc-splitter';
// import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
// import { getEmbeddings } from './embeddings';
let pinecone: Pinecone | null = null;
// import md5 from 'md5';
// import { converToAscii } from '@/lib/utils';
// import fs from "fs/promises"

export const getPineconeClient = async () => {
  if (!pinecone) {
    pinecone = new Pinecone({ apiKey: process.env.NEXT_PINECONE_API_KEY as string });
  }

  return pinecone;
}

// type PDFPage = {
//   pageContent: string;
//   metadata: {
//     loc: {pageNumber: number}
//   };
// }
// export async function loadPDFIntoPinecone(fileUrl: string) {
//   // 1. Obtain the pdf file from supabase storage -> download and read the file
//   // const fileUrl = 'chang.pdf'
  
//   // 1.1 manage errors
//   if (!fileUrl) {
//     throw new Error('No file url provided');
//   }

//   const loader = new PDFLoader(fileUrl);
//   const splitter = new RecursiveCharacterTextSplitter();
//   const docs = await loader.load();
//   // Use this.load() and splitter.splitDocuments() individually. Loads the documents and splits them using a specified text splitter.
//   const pages = (await splitter.splitDocuments(docs)) as PDFPage[];
//   console.log({ pages });

//   // 2. split and segment the pdf into smaller parts
//   // pages = Array(15)
//   const documents = await Promise.all(pages.map(prepareDocument)); // prepareDocument is a function that splits the document into smaller parts

//   // documents = Array(100)

//   // 3. vectorize and embed individual documents
//   const vectors: PineconeRecord<RecordMetadata>[] = await Promise.all(documents.flat().map(embedDocument));

//   // 4. upload the vectors to pinecone
//   const pinecone = await getPineconeClient();
//   const pineconeIndex = pinecone.Index(process.env.NEXT_PINECONE_INDEX as string);

//   console.log('Uploading vectors to pinecone');
//   //! 2:21:50 https://www.youtube.com/watch?v=bZFedu-0emE
//   // convert this fileName into ascii characters
//   const namespace = converToAscii(fileUrl)

//   await pineconeIndex.namespace(namespace).upsert(vectors);

//   return documents[0]
// }

// async function embedDocument(document: Document) {
//   try {
//     const embeddings = await getEmbeddings(document.pageContent);
//     // to id the vector within pinecone
//     const hash = md5(document.pageContent)

//     return {
//       id: hash,
//       values: embeddings,
//       metadata: {
//         text: document.metadata.text,
//         pageNumber: document.metadata.pageNumber
//       }
//     };
//   } catch (error) {
//     console.log("Error embedding document", error);
//     throw error;
//   }
// }

// export const truncateStringByBytes = (str: string, bytes: number) => {
//   const enc = new TextEncoder();
//   return new TextDecoder('utf-8').decode(enc.encode(str).slice(0, bytes))
// }

// async function prepareDocument(page: PDFPage) {
//   // pineconeCharSplitter
//   let {pageContent, metadata} = page;
//   pageContent = pageContent.replace(/\n/g, " ");

//   // split the docs
//   const splitter = new pineconeCharSplitter()
//   const docs = await splitter.splitDocuments([
//     new Document({
//       pageContent,
//       metadata: {
//         pageNumber: metadata.loc.pageNumber,
//         text: truncateStringByBytes(pageContent, 36000) // pinecone has a limit of 36k bytes
//       }
//     })
//   ]);
//   return docs;
// }

