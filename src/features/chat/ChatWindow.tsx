import { useMessages } from './queries'
import { useWebSocket } from './useWebSocket'
import { MessageList } from './MessageList'
import { ChatInput } from './ChatInput'

interface Props { sessionId: string }

export function ChatWindow({ sessionId }: Props) {
  const { data: messages = [], isError } = useMessages(sessionId)
  const { sendMessage, streamingContent, isStreaming, isConnecting, error: wsError } = useWebSocket(sessionId)

  return (
    <div className="flex flex-col h-full">
      {isError && (
        <div className="px-4 py-2 text-sm text-destructive bg-destructive/10 border-b border-destructive/20">
          Failed to load message history. Refresh to retry.
        </div>
      )}
      {wsError && (
        <div className="px-4 py-2 text-sm text-destructive bg-destructive/10 border-b border-destructive/20">
          {wsError}
        </div>
      )}
      <MessageList messages={messages} streamingContent={streamingContent} />
      <ChatInput onSend={sendMessage} disabled={isStreaming || isConnecting} />
    </div>
  )
}
