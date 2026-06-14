import { useState, useCallback } from 'react'
import { Loader2, Check, ArrowRight, Wallet } from 'lucide-react'
import { useAgentFeed } from '@/hooks/useAgentFeed'
import { FEED_PLACEHOLDERS, MAX_MESSAGE_LENGTH } from '@/lib/constants'
import type { Toast, FeedEntry } from '@/types'
import { generateId } from '@/lib/utils'
import ParticleButton from './ParticleButton'

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
  isConnecting,
  onSubmit,
  onToast,
  connectWallet,
}: MessageComposerProps) {
  const [message, setMessage] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [focused, setFocused] = useState(false)
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

  const pct = Math.min((charCount / MAX_MESSAGE_LENGTH) * 100, 100)

  return (
    <div className="card-static p-5 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b" style={{ borderColor: 'var(--line)' }}>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs" style={{ color: 'var(--signal)' }}>{'>'}</span>
          <h3 className="font-mono text-xs font-bold uppercase tracking-widest typing-cursor" style={{ color: 'var(--ink-display)' }}>Compose</h3>
        </div>
        <span className="tag" style={{ color: isOverLimit ? 'var(--signal)' : 'var(--ink-tertiary)' }}>
          {charCount} / {MAX_MESSAGE_LENGTH}
        </span>
      </div>

      {/* Textarea */}
      <div className="relative">
        {!message && (
          <div className="absolute top-3 left-3.5 pointer-events-none text-sm font-mono" style={{ color: 'var(--ink-disabled)' }}>
            {placeholder}
          </div>
        )}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full min-h-[100px] p-3.5 text-sm resize-y focus:outline-none transition-colors duration-200 font-mono"
          style={{
            background: 'var(--surface-0)',
            color: 'var(--ink-primary)',
            borderRadius: 'var(--radius)',
            border: `1px solid ${isOverLimit ? 'var(--signal)' : focused ? 'var(--ink-tertiary)' : 'var(--line-strong)'}`,
          }}
        />
      </div>

      {/* char meter */}
      <div className="h-px w-full mt-3 mb-4" style={{ background: 'var(--line)' }}>
        <div className="h-px transition-all duration-200" style={{ width: `${pct}%`, background: isOverLimit ? 'var(--signal)' : 'var(--ink-secondary)' }} />
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end">
        {!walletConnected ? (
          <ParticleButton onClick={handleConnectClick} disabled={isConnecting}>
            {isConnecting ? (
              <><Loader2 size={14} className="animate-spin" /> CONNECTING…</>
            ) : (
              <><Wallet size={14} /> CONNECT TO POST</>
            )}
          </ParticleButton>
        ) : (
          <ParticleButton onClick={handleSubmit} disabled={!canSubmit}>
            {isPosting ? (
              <><Loader2 size={14} className="animate-spin" /> SENDING…</>
            ) : showSuccess ? (
              <><Check size={14} className="pop-check" /> SENT</>
            ) : (
              <>POST MESSAGE <ArrowRight size={14} /></>
            )}
          </ParticleButton>
        )}
      </div>
    </div>
  )
}
