import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ExternalLink, Copy, Check, Globe, Database, Radio, Trash2, Sparkles } from 'lucide-react'
import { CONTRACT_ADDRESS, RITUAL_CHAIN_CONFIG } from '@/lib/constants'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [copied, setCopied] = useState(false)
  const [copiedRpc, setCopiedRpc] = useState(false)

  const copyContract = useCallback(async () => {
    await navigator.clipboard.writeText(CONTRACT_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  const copyRpc = useCallback(async () => {
    await navigator.clipboard.writeText(RITUAL_CHAIN_CONFIG.rpcUrls.default.http[0])
    setCopiedRpc(true)
    setTimeout(() => setCopiedRpc(false), 2000)
  }, [])

  const clearLocalData = useCallback(() => {
    localStorage.removeItem('ritual_wallet_address')
    window.location.reload()
  }, [])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/60" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            className="card relative w-full max-w-md overflow-hidden"
            style={{ border: '1px solid rgba(139,92,246,0.15)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top gradient line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--coral)] via-[var(--lavender)] to-[var(--mint)]" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full transition-colors hover:bg-white/5 text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              <X size={18} />
            </button>

            {/* Content */}
            <div className="p-8">
              {/* Title */}
              <div className="flex items-center gap-2 mb-6">
                <Sparkles size={18} style={{ color: 'var(--violet)' }} />
                <h2 className="font-heading text-xl font-bold" style={{ color: 'var(--text)' }}>
                  Settings
                </h2>
              </div>

              {/* Contract Section */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Database size={16} style={{ color: 'var(--violet)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Contract
                  </span>
                </div>

                <div className="card-static p-3 rounded-xl mb-3">
                  <p className="tag mb-1">Contract Address</p>
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-xs break-all flex-1" style={{ color: 'var(--text)' }}>{CONTRACT_ADDRESS}</code>
                    <button
                      onClick={copyContract}
                      className="p-1.5 rounded-lg transition-colors hover:bg-white/5 shrink-0 text-[var(--text-muted)] hover:text-[var(--coral)]"
                      title="Copy address"
                    >
                      {copied ? <Check size={14} style={{ color: 'var(--mint)' }} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                <a
                  href={`https://explorer.ritualfoundation.org/address/${CONTRACT_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost w-full text-sm flex items-center justify-center gap-2"
                >
                  <ExternalLink size={14} />
                  View Contract on Explorer
                </a>
              </div>

              {/* Network Section */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Radio size={16} style={{ color: 'var(--lavender)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Network
                  </span>
                </div>

                <div className="card-static p-3 rounded-xl space-y-2">
                  <div className="flex justify-between">
                    <span className="tag">Network</span>
                    <span className="text-sm" style={{ color: 'var(--text)' }}>
                      {RITUAL_CHAIN_CONFIG.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="tag">Chain ID</span>
                    <span className="text-sm" style={{ color: 'var(--text)' }}>
                      {RITUAL_CHAIN_CONFIG.id}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="tag">RPC URL</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs truncate max-w-[180px]" style={{ color: 'var(--text)' }}>
                        {RITUAL_CHAIN_CONFIG.rpcUrls.default.http[0]}
                      </span>
                      <button
                        onClick={copyRpc}
                        className="p-1 rounded transition-colors hover:bg-white/5 text-[var(--text-muted)] hover:text-[var(--coral)]"
                      >
                        {copiedRpc ? <Check size={12} style={{ color: 'var(--mint)' }} /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="tag">Currency</span>
                    <span className="text-sm" style={{ color: 'var(--text)' }}>
                      {RITUAL_CHAIN_CONFIG.nativeCurrency.symbol}
                    </span>
                  </div>
                </div>
              </div>

              {/* Explorer Section */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Globe size={16} style={{ color: 'var(--mint)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Explorer
                  </span>
                </div>
                <a
                  href="https://explorer.ritualfoundation.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost w-full text-sm flex items-center justify-center gap-2"
                >
                  <ExternalLink size={14} />
                  Open Ritual Explorer
                </a>
              </div>

              {/* Danger Zone */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Trash2 size={16} style={{ color: 'var(--violet)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--violet)' }}>
                    Reset
                  </span>
                </div>
                <button
                  onClick={clearLocalData}
                  className="w-full py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200 border border-[var(--coral)]/30 text-[var(--coral)] hover:bg-[var(--coral)]/10 hover:border-[var(--coral)]/50"
                >
                  Clear Wallet & Reset
                </button>
                <p className="tag mt-2">
                  This will disconnect your wallet and refresh the page.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
