'use client'

import { Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useChat } from 'ai/react';
import MessageList from "./MessageList";
import { useEffect } from "react";

export default function ChatWithPDF({ documentId }: { documentId: string | undefined }) {
  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: '/api/chat',
    body: {
      documentId: documentId, // pass the name of the document to the route that handles the chatbot responses
    }
  });

  useEffect(() => {
    const messageContainer = document.getElementById('message-container');
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [messages])

  return (
    <div id="message-container" className="relative overflow-y-hidden border border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-md h-full">
      {/* Header */}
      <div className="insert-x-0 p-2 h-fit sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <h1 className="text-xl font-bold">Chat with this document</h1>
      </div>

      {/* Message list */}
      <div className="h-[70vh] max-h-[70vh] overflow-y-auto">
        <MessageList messages={messages} />
      </div>

      <form onSubmit={handleSubmit} className="fixed bottom-0 insert-x-0 px-2 py-4 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex space-x-2">
          <Input type="text" placeholder="Ask any question about the pdf..." value={input} onChange={handleInputChange} />
          <Button type="submit"><Send className="h-4 w-4 mr-2" />Send</Button>
        </div>
      </form>
    </div>
  );
}