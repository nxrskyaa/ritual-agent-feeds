import { useState, useCallback } from 'react'
import { Loader2, Check, Send, Wallet, Terminal } from 'lucide-react'
import { useAgentFeed } from '@/hooks/useAgentFeed'
import { FEED_PLACEHOLDERS, MAX_MESSAGE_LENGTH } from '@/lib/constants'
import type { Toast, FeedEntry } from '@/types'
import { generateId } from '@/lib/utils'

interface MessageComposerProps {
  walletConnected: boolean
  walletAddress: string | null
  onSubmit: (entry: FeedEntry) => void
  onToast: (toast: Toast) => void
  connectWallet: () => Promise<string | null>
}

export default function MessageComposer({
  walletConnected,
  walletAddress,
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

  // Static placeholder — no rotation, no AnimatePresence, no flicker
  const placeholder = FEED_PLACEHOLDERS[0]

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return

    if (!walletConnected || !walletAddress) {
      try {
        const addr = await connectWallet()
        if (!addr) {
          onToast({ id: generateId(), type: 'info', message: 'Connect your wallet to post.' })
          return
        }
      } catch (err: unknown) {
        onToast({ id: generateId(), type: 'error', message: (err as Error).message || 'Failed to connect.' })
        return
      }
    }

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
  }, [canSubmit, walletConnected, walletAddress, connectWallet, message, postMessage, onSubmit, onToast])

  return (
    <div className="card p-5 mb-6" style={{ border: '1px solid rgba(255,123,114,0.12)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(255,123,114,0.15), rgba(210,180,255,0.15))' }}>
            <Terminal size={13} className="text-[var(--coral)]" />
          </div>
          <h3 className="font-heading text-sm font-semibold" style={{ color: 'var(--text)' }}>Compose</h3>
        </div>
        <span className="tag" style={{ color: isOverLimit ? 'var(--coral)' : 'var(--text-muted)' }}>
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
            border: `1px solid ${isOverLimit ? 'rgba(255,123,114,0.4)' : 'rgba(255,255,255,0.06)'}`,
          }}
          onFocus={(e) => {
            if (!isOverLimit) e.currentTarget.style.borderColor = 'rgba(255,123,114,0.25)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = isOverLimit ? 'rgba(255,123,114,0.4)' : 'rgba(255,255,255,0.06)'
          }}
        />
      </div>

      {/* Submit button */}
      <div className="flex items-center justify-end mt-4">
        {!walletConnected ? (
          <button onClick={connectWallet} className="btn text-sm py-2 px-5 flex items-center gap-2">
            <Wallet size={14} />
            Connect to Post
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
