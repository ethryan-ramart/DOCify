import { cn } from "@/lib/utils";
import { Message } from "ai/react";

type Props = {
  messages: Message[];
}
export default function MessageList({ messages }: Props) {
  if (!messages) return <div></div>
  return (
    <div className="flex flex-col gap-2 px-4 pt-8 pb-20 md:pb-12">
      {
        messages.map((message, i) => {
          return (
            <div key={i} className={cn('flex', {
              'justify-end pl-10': message.role === 'user',
              'justify-start pr-10': message.role === 'assistant',
            })}>
              <div className={
                cn('rounded-xl p-4 text-sm py-1 shadow-md ring-1 ring-foreground-900/10', {
                  'bg-foreground text-background': message.role === 'user',
                  'bg-bakground': message.role === 'assistant',
                })
              }>
                <p>{message.content}</p>
              </div>
            </div>
          )
        })
      }
    </div>
  );
}