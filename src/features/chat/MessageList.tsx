import { useEffect, useRef } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageBubble } from './MessageBubble'
import type { Message } from './queries'

interface Props {
  messages: Message[]
  streamingContent: string
}

export function MessageList({ messages, streamingContent }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, streamingContent])

  return (
    <ScrollArea className="flex-1 px-4 py-6">
      <div className="space-y-4 max-w-2xl mx-auto">
        {messages.length === 0 && !streamingContent && (
          <p className="text-center text-sm text-muted-foreground pt-8">
            Send a message to start the conversation
          </p>
        )}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {streamingContent && (
          <MessageBubble message={{ role: 'assistant', content: streamingContent, streaming: true }} />
        )}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  )
}
