import { motion } from 'framer-motion'
import { ExternalLink, CheckCircle, Loader2, Bot, User, MessageSquare } from 'lucide-react'
import { useProfiles } from '@/hooks/useProfiles'
import { getAddressGradient, truncateAddress, timeAgo, getExplorerUrl } from '@/lib/utils'
import { RITUAL_CHAIN_CONFIG } from '@/lib/constants'
import { useLiveTime } from '@/hooks/useLiveTime'
import type { FeedEntry as FeedEntryType } from '@/types'

interface FeedEntryProps {
  entry: FeedEntryType
  isNew?: boolean
  onViewProfile?: (address: string) => void
}

export default function FeedEntry({
  entry,
  isNew = false,
  onViewProfile,
}: FeedEntryProps) {
  const { getDisplayName } = useProfiles()
  const displayName = getDisplayName(entry.address)
  const now = useLiveTime()

  const statusIcon =
    entry.status === 'confirmed' ? (
      <CheckCircle size={13} className="text-[var(--mint)]" />
    ) : entry.status === 'pending' ? (
      <Loader2 size={13} className="text-[var(--sunshine)] animate-spin" />
    ) : null

  const TypeIcon = entry.type === 'agent' ? Bot : User
  const typeColor = entry.type === 'agent' ? 'var(--lavender)' : 'var(--text-tertiary)'
  const typeBg = entry.type === 'agent' ? 'var(--lavender-dim)' : 'rgba(255,255,255,0.04)'

  return (
    <motion.div
      initial={isNew ? { opacity: 0, y: -20, scale: 0.97 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      className="terminal-card p-5 md:p-6 relative group"
      style={
        isNew
          ? {
              borderLeft: '3px solid var(--coral)',
              boxShadow: '0 0 30px rgba(255,123,114,0.08), 0 4px 20px rgba(0,0,0,0.2)',
            }
          : undefined
      }
    >
      {/* Top row */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <button
          onClick={() => onViewProfile?.(entry.address)}
          className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold transition-all duration-300 hover:scale-110 hover:rotate-3 hover:shadow-lg"
          style={{
            background: getAddressGradient(entry.address),
            color: '#fff',
            boxShadow: isNew ? '0 0 20px rgba(255,123,114,0.2)' : 'none',
          }}
        >
          {displayName[0].toUpperCase()}
        </button>

        {/* Identity */}
        <div className="flex-1 min-w-0">
          <button
            onClick={() => onViewProfile?.(entry.address)}
            className="text-sm font-semibold block transition-colors hover:text-[var(--coral)] font-heading"
          >
            {displayName}
          </button>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono-label text-[0.7rem] text-[var(--text-tertiary)]">{truncateAddress(entry.address)}</span>
            <span className="text-[var(--text-muted)]">·</span>
            <span className="caption-text">{timeAgo(entry.timestamp, now)}</span>
          </div>
        </div>

        {/* Type badge */}
        <div
          className="rounded-lg px-2.5 py-1 flex items-center gap-1.5 shrink-0 transition-all duration-300 group-hover:scale-105"
          style={{ background: typeBg, border: `1px solid ${typeColor}20` }}
        >
          <TypeIcon size={12} style={{ color: typeColor }} />
          <span className="font-mono-label text-[0.65rem]" style={{ color: typeColor }}>
            {entry.type === 'agent' ? 'Agent' : 'Human'}
          </span>
        </div>

        {/* Status */}
        <div className="shrink-0">{statusIcon}</div>

        {/* Explorer */}
        {getExplorerUrl(RITUAL_CHAIN_CONFIG.blockExplorers?.default.url, `/address/${entry.address}`) && (
          <a
            href={getExplorerUrl(RITUAL_CHAIN_CONFIG.blockExplorers?.default.url, `/address/${entry.address}`)!}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 transition-all duration-200 hover:text-[var(--coral)] text-[var(--text-muted)] hover:scale-110"
            title="View on Ritual Explorer"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={14} />
          </a>
        )}
      </div>

      {/* Message */}
      <div className="mt-4 flex gap-2">
        <MessageSquare size={14} className="text-[var(--text-muted)] mt-0.5 flex-shrink-0 opacity-50" />
        <p className="text-sm leading-relaxed break-words text-[var(--text-primary)]">
          {entry.message}
        </p>
      </div>
    </motion.div>
  )
}
