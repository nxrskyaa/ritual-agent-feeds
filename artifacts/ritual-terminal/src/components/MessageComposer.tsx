import { useState, useCallback } from 'react'
import { Loader2, Check, Send, Wallet, Terminal } from 'lucide-react'
import { useAgentFeed } from '@/hooks/useAgentFeed'
import { FEED_PLACEHOLDERS, MAX_MESSAGE_LENGTH } from '@/lib/constants'
import type { Toast, FeedEntry } from '@/types'
import { generateId } from '@/lib/utils'

interface MessageComposerProps {
  walletConnected: boolean
  walletAddress: string | null
  isConnecting: boolean
  onSubmit: (entry: FeedEntry) => void
  onToast: (toast: Toast) => void
  connectWallet: () => Promise<string | null>
}

export default function MessageComposer({
  walletConnected,
  walletAddress,
  isConnecting,
  onSubmit,
  onToast,
  connectWallet,
}: MessageComposerProps) {
  const [message, setMessage] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const { postMessage, isPosting } = useAgentFeed()

  const charCount = message.length
  const isOverLimit = charCount > MAX_MESSAGE_LENGTH
  const canSubmit = walletConnected && message.trim().length > 0 && !isOverLimit && !isPosting

  const placeholder = FEED_PLACEHOLDERS[0]

  const handleConnectClick = useCallback(async () => {
    if (isConnecting) return
    try {
      const addr = await connectWallet()
      if (!addr) {
        onToast({ id: generateId(), type: 'info', message: 'Connect your wallet to post.' })
      }
    } catch (err: unknown) {
      const msg = (err as Error).message || 'Failed to connect wallet.'
      onToast({ id: generateId(), type: 'error', message: msg })
    }
  }, [isConnecting, connectWallet, onToast])

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return

    try {
      const { hash, entry } = await postMessage(message.trim())
      onSubmit(entry)
      onToast({ id: generateId(), type: 'success', message: 'Posted onchain!', txHash: hash })
      setMessage('')
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 1500)
    } catch (err: unknown) {
      onToast({ id: generateId(), type: 'error', message: (err as Error).message || 'Transaction failed.' })
    }
  }, [canSubmit, message, postMessage, onSubmit, onToast])

  return (
    <div className="card p-5 mb-6 breathe-border" style={{ border: '1px solid rgba(139,92,246,0.12)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(167,139,250,0.15))' }}>
            <Terminal size={13} style={{ color: 'var(--violet)' }} />
          </div>
          <h3 className="font-heading text-sm font-semibold typing-cursor" style={{ color: 'var(--text)' }}>Compose</h3>
        </div>
        <span className="tag" style={{ color: isOverLimit ? 'var(--pink)' : 'var(--text-muted)' }}>
          {charCount} / {MAX_MESSAGE_LENGTH}
        </span>
      </div>

      {/* Textarea */}
      <div className="relative">
        {!message && (
          <div
            className="absolute top-3 left-4 pointer-events-none text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            {placeholder}
          </div>
        )}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full min-h-[100px] rounded-xl p-3.5 text-sm resize-y focus:outline-none transition-colors duration-200"
          style={{
            background: 'rgba(255,255,255,0.03)',
            color: 'var(--text)',
            border: `1px solid ${isOverLimit ? 'rgba(244,114,182,0.4)' : 'rgba(255,255,255,0.06)'}`,
          }}
          onFocus={(e) => {
            if (!isOverLimit) e.currentTarget.style.borderColor = 'rgba(139,92,246,0.25)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = isOverLimit ? 'rgba(244,114,182,0.4)' : 'rgba(255,255,255,0.06)'
          }}
        />
      </div>

      {/* Submit button */}
      <div className="flex items-center justify-end mt-4">
        {!walletConnected ? (
          <button
            onClick={handleConnectClick}
            disabled={isConnecting}
            className="btn text-sm py-2 px-5 flex items-center gap-2"
          >
            {isConnecting ? (
              <><Loader2 size={14} className="animate-spin" /> Connecting...</>
            ) : (
              <><Wallet size={14} /> Connect to Post</>
            )}
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={!canSubmit} className="btn text-sm py-2 px-5 flex items-center gap-2">
            {isPosting ? (
              <><Loader2 size={14} className="animate-spin" /> Sending...</>
            ) : showSuccess ? (
              <><Check size={14} /> Sent!</>
            ) : (
              <><Send size={14} /> Post Message</>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
