import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { Message } from './queries'

type StreamingMessage = { role: 'assistant'; content: string; streaming: true }

interface Props {
  message: Message | StreamingMessage
}

export function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <Avatar className="h-8 w-8 shrink-0 mt-1">
        <AvatarFallback className={isUser ? 'bg-primary text-primary-foreground text-xs' : 'bg-muted text-xs'}>
          {isUser ? 'You' : 'AI'}
        </AvatarFallback>
      </Avatar>
      <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
        isUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
      }`}>
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        {'streaming' in message && message.streaming && (
          <span className="inline-block w-0.5 h-3.5 ml-0.5 bg-current opacity-70 animate-pulse align-middle" />
        )}
      </div>
    </div>
  )
}
