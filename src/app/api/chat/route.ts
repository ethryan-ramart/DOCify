import { getContext } from '@/lib/context';
import { createPrompt } from '@/lib/prompt';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
// import { Message } from 'ai/react';

export async function POST(req: Request) {
  const { messages, documentId } = await req.json();
  // console.log("Document Id", documentId);
  const lastMessage = messages[messages.length - 1].content;
  const context = await getContext(lastMessage, documentId);
  const prompt = createPrompt(context);
  const result = await streamText({
    model: openai('gpt-3.5-turbo-0125'),
    messages: [
      // prompt, ...messages.filter((message: Message) => message.role === 'user') 
      prompt, ...messages
  ],
  });

  return result.toAIStreamResponse();
}