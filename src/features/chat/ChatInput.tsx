import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  onSend: (content: string) => void
  disabled: boolean
}

export function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState('')

  function handleSend() {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
  }

  return (
    <div className="border-t px-4 py-4 bg-background">
      <div className="flex gap-2 max-w-2xl mx-auto">
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
          placeholder="Message… (Enter to send, Shift+Enter for new line)"
          disabled={disabled}
          rows={1}
          className="resize-none min-h-[44px] max-h-32"
        />
        <Button onClick={handleSend} disabled={disabled || !value.trim()} className="shrink-0">
          Send
        </Button>
      </div>
    </div>
  )
}
