import { useState, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Edit2, Check, ExternalLink, MessageCircle, Hash } from 'lucide-react'
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
  const { getProfile, setProfile, getDisplayName } = useProfiles()
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editBio, setEditBio] = useState('')

  const profile = address ? getProfile(address) : null
  const displayName = address ? getDisplayName(address) : ''

  const userEntries = useMemo(() => {
    if (!address) return []
    return entries
      .filter((e) => e.address.toLowerCase() === address.toLowerCase())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [address, entries])

  const handleSave = () => {
    if (!address || !editName.trim()) return
    setProfile(address, {
      name: editName.trim(),
      bio: editBio.trim() || undefined,
    })
    setIsEditing(false)
  }

  const startEdit = () => {
    setEditName(profile?.name || '')
    setEditBio(profile?.bio || '')
    setIsEditing(true)
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
          <div className="absolute inset-0 bg-black/60" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            className="card relative w-full max-w-lg overflow-hidden max-h-[85vh] flex flex-col"
            style={{ border: '1px solid rgba(139,92,246,0.15)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top gradient line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--coral)] via-[var(--lavender)] to-[var(--mint)]" />

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full transition-colors hover:bg-white/5 z-10 text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              <X size={18} />
            </button>

            {/* Scrollable content */}
            <div className="overflow-y-auto p-8">
              {/* Avatar */}
              <div className="flex justify-center mb-4">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold"
                  style={{ background: getAddressGradient(address), color: '#fff' }}
                >
                  {(profile?.name?.[0] || address[2]).toUpperCase()}
                </div>
              </div>

              {/* Name */}
              {isEditing ? (
                <div className="mb-4 space-y-3">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Your display name..."
                    autoFocus
                    className="input"
                    maxLength={20}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  />
                  <input
                    type="text"
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Short bio (optional)..."
                    className="input"
                    maxLength={60}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  />
                  <div className="flex gap-2">
                    <button onClick={handleSave} className="btn text-xs py-2 px-4 flex items-center gap-1">
                      <Check size={12} /> Save
                    </button>
                    <button onClick={() => setIsEditing(false)} className="btn-ghost text-xs py-2 px-4">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center mb-4 relative">
                  <h2 className="font-heading text-xl font-bold" style={{ color: 'var(--text)' }}>
                    {displayName}
                  </h2>
                  {profile?.bio && (
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                      {profile.bio}
                    </p>
                  )}
                  <p className="tag mt-1">{truncateAddress(address)}</p>
                  <button
                    onClick={startEdit}
                    className="absolute -right-1 top-0 p-1.5 rounded-full transition-colors hover:bg-white/5 text-[var(--text-muted)] hover:text-[var(--coral)]"
                    title="Edit profile"
                  >
                    <Edit2 size={14} />
                  </button>
                </div>
              )}

              {/* Stats */}
              <div className="flex justify-center gap-8 mb-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <MessageCircle size={14} style={{ color: 'var(--coral)' }} />
                    <span className="font-heading text-lg font-bold" style={{ color: 'var(--text)' }}>
                      {userEntries.length}
                    </span>
                  </div>
                  <p className="tag">Posts</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Hash size={14} style={{ color: 'var(--lavender)' }} />
                    <span className="font-heading text-lg font-bold" style={{ color: 'var(--text)' }}>
                      #{address.slice(2, 6).toUpperCase()}
                    </span>
                  </div>
                  <p className="tag">ID</p>
                </div>
              </div>

              {/* Explorer link */}
              {getExplorerUrl(RITUAL_CHAIN_CONFIG.blockExplorers?.default.url, `/address/${address}`) && (
                <a
                  href={getExplorerUrl(RITUAL_CHAIN_CONFIG.blockExplorers?.default.url, `/address/${address}`)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost w-full text-xs flex items-center justify-center gap-2 mb-6"
                >
                  <ExternalLink size={12} />
                  View on Ritual Explorer
                </a>
              )}

              {/* Divider */}
              <div className="h-px w-full mb-4" style={{ background: 'linear-gradient(90deg, transparent, var(--border), transparent)' }} />

              {/* Posts list */}
              <h3 className="font-heading text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                Posts ({userEntries.length})
              </h3>

              {userEntries.length === 0 ? (
                <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>
                  No posts yet — time to make some noise!
                </p>
              ) : (
                <div className="space-y-3">
                  {userEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="card-static p-3"
                      style={{ borderLeft: '3px solid var(--violet)' }}
                    >
                      <p className="text-sm" style={{ color: 'var(--text)' }}>
                        {entry.message}
                      </p>
                      <span className="tag mt-2 block">{timeAgo(entry.timestamp)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
