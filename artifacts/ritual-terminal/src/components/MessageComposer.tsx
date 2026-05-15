import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Check, Send, Wallet, Terminal } from 'lucide-react'
import { useRotatingPlaceholder } from '@/hooks/useRotatingPlaceholder'
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
  const { placeholder, isVisible } = useRotatingPlaceholder(FEED_PLACEHOLDERS, 4000)

  const charCount = message.length
  const isOverLimit = charCount > MAX_MESSAGE_LENGTH
  const canSubmit = walletConnected && message.trim().length > 0 && !isOverLimit && !isPosting

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      id="compose"
      className="card p-5 md:p-6 mb-8"
      style={{ border: '1px solid rgba(255,123,114,0.12)' }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[var(--coral)]/20 to-[var(--lavender)]/20 flex items-center justify-center">
            <Terminal size={13} className="text-[var(--coral)]" />
          </div>
          <h3 className="font-heading text-base font-semibold text-[var(--text-primary)]">
            Compose
          </h3>
        </div>
        <span className={`label text-xs ${isOverLimit ? 'text-[var(--error)]' : 'text-[var(--text-muted)]'}`}>
          {charCount} / {MAX_MESSAGE_LENGTH}
        </span>
      </div>

      {/* Textarea */}
      <div className="relative">
        <div className="absolute left-3.5 top-3.5 text-[var(--text-muted)] text-sm font-mono">$</div>
        <AnimatePresence mode="wait">
          {!message && (
            <motion.div
              key={placeholder}
              initial={{ opacity: 0 }}
              animate={{ opacity: isVisible ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-3.5 left-8 pointer-events-none text-sm font-light"
              style={{ color: 'var(--text-muted)' }}
            >
              {placeholder}
            </motion.div>
          )}
        </AnimatePresence>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full min-h-[100px] bg-[rgba(255,255,255,0.03)] border rounded-xl pl-8 pr-3.5 py-3.5 text-sm resize-vertical focus:outline-none transition-all duration-200 font-mono"
          style={{
            color: 'var(--text-primary)',
            borderColor: isOverLimit ? 'rgba(255,123,114,0.4)' : 'rgba(255,255,255,0.06)',
          }}
          onFocus={(e) => {
            if (!isOverLimit) {
              e.currentTarget.style.borderColor = 'rgba(255,123,114,0.3)'
              e.currentTarget.style.boxShadow = '0 0 20px rgba(255,123,114,0.06)'
            }
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = isOverLimit ? 'rgba(255,123,114,0.4)' : 'rgba(255,255,255,0.06)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        />
      </div>

      {/* Post button */}
      <div className="flex items-center justify-end mt-4">
        {!walletConnected ? (
          <button
            onClick={connectWallet}
            className="btn-primary text-sm py-2 px-5 flex items-center gap-2"
          >
            <Wallet size={14} />
            Connect to Post
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="btn-primary text-sm py-2 px-5 flex items-center gap-2"
          >
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
    </motion.div>
  )
}
