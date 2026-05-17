import { useState, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ExternalLink, MessageCircle, Hash, Link2, Twitter, Check, Sparkles } from 'lucide-react'
import { useProfiles } from '@/hooks/useProfiles'
import { getAddressGradient, truncateAddress, timeAgo, getExplorerUrl } from '@/lib/utils'
import { RITUAL_CHAIN_CONFIG } from '@/lib/constants'
import type { FeedEntry } from '@/types'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  address: string | null
  entries: FeedEntry[]
}

export default function ProfileModal({ isOpen, onClose, address, entries }: ProfileModalProps) {
  const { getProfile, setProfile, getDisplayName, getAvatarUrl } = useProfiles()
  const [xHandleInput, setXHandleInput] = useState('')
  const [isLinkingX, setIsLinkingX] = useState(false)
  const [linkedSuccess, setLinkedSuccess] = useState(false)

  const profile = address ? getProfile(address) : null
  const displayName = address ? getDisplayName(address) : ''
  const avatarUrl = address ? getAvatarUrl(address) : null

  const userEntries = useMemo(() => {
    if (!address) return []
    return entries
      .filter((e) => e.address.toLowerCase() === address.toLowerCase())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [address, entries])

  const handleLinkX = () => {
    if (!address || !xHandleInput.trim()) return
    const handle = xHandleInput.trim().replace(/^@/, '')
    setProfile(address, {
      ...profile,
      name: handle,
      xHandle: handle,
    })
    setLinkedSuccess(true)
    setTimeout(() => {
      setLinkedSuccess(false)
      setIsLinkingX(false)
      setXHandleInput('')
    }, 2000)
  }

  const handleUnlinkX = () => {
    if (!address) return
    setProfile(address, {
      ...profile,
      name: '',
      xHandle: undefined,
      avatarUrl: undefined,
    })
  }

  if (!address) return null

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
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="card relative w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col"
            style={{ border: '1px solid rgba(139,92,246,0.2)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top glow line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--violet)] via-[var(--cyan)] to-[var(--purple)]" />

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full transition-all hover:bg-white/10 z-10 text-[var(--text-muted)] hover:text-[var(--text)] hover:rotate-90"
            >
              <X size={16} />
            </button>

            {/* Scrollable content */}
            <div className="overflow-y-auto">
              {/* Header with avatar */}
              <div className="relative pt-8 pb-6 px-8 text-center">
                {/* Background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, var(--violet) 0%, transparent 70%)', filter: 'blur(40px)' }} />

                {/* Avatar */}
                <div className="relative mx-auto mb-4">
                  {avatarUrl ? (
                    <div className="relative inline-block">
                      <div className="pulse-ring w-24 h-24 rounded-2xl overflow-hidden border-2 border-[var(--violet)]/30">
                        <img
                          src={avatarUrl}
                          alt={displayName}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-black flex items-center justify-center border border-[var(--border)]">
                        <Twitter size={14} style={{ color: '#1DA1F2' }} />
                      </div>
                    </div>
                  ) : (
                    <div className="relative inline-block">
                      <div
                        className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold logo-glow"
                        style={{ background: getAddressGradient(address), color: '#fff' }}
                      >
                        {(displayName?.[0] || address[2]).toUpperCase()}
                      </div>
                    </div>
                  )}
                </div>

                {/* Name */}
                <h2 className="font-heading text-xl font-bold mb-1" style={{ color: 'var(--text)' }}>
                  {displayName}
                </h2>
                <p className="tag">{truncateAddress(address)}</p>

                {/* X Badge */}
                {profile?.xHandle && (
                  <a
                    href={`https://x.com/${profile.xHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105"
                    style={{ background: 'rgba(29,161,242,0.1)', border: '1px solid rgba(29,161,242,0.2)', color: '#1DA1F2' }}
                  >
                    <Twitter size={12} />
                    @{profile.xHandle}
                  </a>
                )}
              </div>

              {/* X Linking Section */}
              <div className="px-8 mb-6">
                {!profile?.xHandle ? (
                  <div className="card-static p-4 text-center">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: 'rgba(29,161,242,0.1)' }}>
                      <Link2 size={18} style={{ color: '#1DA1F2' }} />
                    </div>
                    <p className="text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>Link X Account</p>
                    <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                      Sync your X identity on-chain. Your name & avatar become your on-chain profile.
                    </p>
                    {isLinkingX ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={xHandleInput}
                          onChange={(e) => setXHandleInput(e.target.value)}
                          placeholder="@username"
                          autoFocus
                          className="input flex-1 text-sm"
                          maxLength={20}
                          onKeyDown={(e) => e.key === 'Enter' && handleLinkX()}
                        />
                        <button
                          onClick={handleLinkX}
                          disabled={!xHandleInput.trim() || linkedSuccess}
                          className="btn text-xs py-2 px-3 shrink-0"
                        >
                          {linkedSuccess ? (
                            <Check size={14} />
                          ) : (
                            <Sparkles size={14} />
                          )}
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setIsLinkingX(true)} className="btn text-xs py-2 px-4">
                        <Twitter size={14} />
                        Connect X
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="card-static p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(29,161,242,0.1)' }}>
                          <Twitter size={16} style={{ color: '#1DA1F2' }} />
                        </div>
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>X Account Linked</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>@{profile.xHandle}</p>
                        </div>
                      </div>
                      <button
                        onClick={handleUnlinkX}
                        className="text-xs px-3 py-1.5 rounded-full transition-all hover:bg-red-500/10 hover:text-red-400"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        Unlink
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex justify-center gap-8 mb-6 px-8">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <MessageCircle size={14} style={{ color: 'var(--violet)' }} />
                    <span className="font-heading text-xl font-bold" style={{ color: 'var(--text)' }}>
                      {userEntries.length}
                    </span>
                  </div>
                  <p className="tag">Posts</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <Hash size={14} style={{ color: 'var(--cyan)' }} />
                    <span className="font-heading text-xl font-bold" style={{ color: 'var(--text)' }}>
                      #{address.slice(2, 6).toUpperCase()}
                    </span>
                  </div>
                  <p className="tag">Agent ID</p>
                </div>
              </div>

              {/* Explorer link */}
              {getExplorerUrl(RITUAL_CHAIN_CONFIG.blockExplorers?.default.url, `/address/${address}`) && (
                <div className="px-8 mb-6">
                  <a
                    href={getExplorerUrl(RITUAL_CHAIN_CONFIG.blockExplorers?.default.url, `/address/${address}`)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost w-full text-xs flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={12} />
                    View on Ritual Explorer
                  </a>
                </div>
              )}

              {/* Divider */}
              <div className="glow-line mx-8 mb-4" />

              {/* Posts list */}
              <div className="px-8 pb-8">
                <h3 className="font-heading text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                  <Sparkles size={14} style={{ color: 'var(--violet)' }} />
                  On-chain Posts ({userEntries.length})
                </h3>

                {userEntries.length === 0 ? (
                  <div className="card-static p-6 text-center">
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      No posts yet — time to make some noise!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 stagger">
                    {userEntries.map((entry) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="card-static p-3 group cursor-pointer"
                        style={{ borderLeft: '3px solid var(--violet)' }}
                      >
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
                          {entry.message}
                        </p>
                        <span className="tag mt-2 block">{timeAgo(entry.timestamp)}</span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
