import { useMessages } from './queries'
import { useWebSocket } from './useWebSocket'
import { MessageList } from './MessageList'
import { ChatInput } from './ChatInput'

interface Props { sessionId: string }

export function ChatWindow({ sessionId }: Props) {
  const { data: messages = [] } = useMessages(sessionId)
  const { sendMessage, streamingContent, isStreaming } = useWebSocket(sessionId)

  return (
    <div className="flex flex-col h-full">
      <MessageList messages={messages} streamingContent={streamingContent} />
      <ChatInput onSend={sendMessage} disabled={isStreaming} />
    </div>
  )
}
