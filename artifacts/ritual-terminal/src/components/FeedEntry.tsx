import { ExternalLink, CheckCircle, Loader2, Bot, User } from 'lucide-react'
import { useProfiles } from '@/hooks/useProfiles'
import { getAddressGradient, truncateAddress, timeAgo, getExplorerUrl } from '@/lib/utils'
import { RITUAL_CHAIN_CONFIG } from '@/lib/constants'
import type { FeedEntry as FeedEntryType } from '@/types'

interface FeedEntryProps {
  entry: FeedEntryType
  isNew?: boolean
  onViewProfile?: (address: string) => void
}

export default function FeedEntry({ entry, isNew = false, onViewProfile }: FeedEntryProps) {
  const { getDisplayName } = useProfiles()
  const displayName = getDisplayName(entry.address)

  const statusIcon =
    entry.status === 'confirmed' ? (
      <CheckCircle size={13} className="text-[var(--mint)]" />
    ) : entry.status === 'pending' ? (
      <Loader2 size={13} className="text-[var(--sunshine)] animate-spin" />
    ) : null

  const TypeIcon = entry.type === 'agent' ? Bot : User
  const typeColor = entry.type === 'agent' ? 'var(--lavender)' : 'var(--text-muted)'
  const typeBg = entry.type === 'agent' ? 'var(--lavender-soft)' : 'rgba(255,255,255,0.04)'

  const cardStyle = isNew
    ? { borderLeft: '3px solid var(--coral)', boxShadow: '0 0 20px rgba(255,123,114,0.06)' }
    : undefined

  return (
    <div className="card p-5" style={cardStyle}>
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <button
          onClick={() => onViewProfile?.(entry.address)}
          className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold transition-transform hover:scale-110"
          style={{ background: getAddressGradient(entry.address), color: '#fff' }}
        >
          {displayName[0].toUpperCase()}
        </button>

        {/* Name + meta */}
        <div className="flex-1 min-w-0">
          <button
            onClick={() => onViewProfile?.(entry.address)}
            className="text-sm font-semibold block transition-colors hover:text-[var(--coral)] font-heading"
            style={{ color: 'var(--text)' }}
          >
            {displayName}
          </button>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="tag">{truncateAddress(entry.address)}</span>
            <span style={{ color: 'var(--text-muted)' }}>·</span>
            <span className="tag">{timeAgo(entry.timestamp)}</span>
          </div>
        </div>

        {/* Type badge */}
        <div className="rounded-lg px-2.5 py-1 flex items-center gap-1.5 shrink-0" style={{ background: typeBg }}>
          <TypeIcon size={12} style={{ color: typeColor }} />
          <span className="tag" style={{ color: typeColor }}>
            {entry.type === 'agent' ? 'Agent' : 'Human'}
          </span>
        </div>

        {/* Status icon */}
        <div className="shrink-0">{statusIcon}</div>

        {/* Explorer link */}
        {getExplorerUrl(RITUAL_CHAIN_CONFIG.blockExplorers?.default.url, `/address/${entry.address}`) && (
          <a
            href={getExplorerUrl(RITUAL_CHAIN_CONFIG.blockExplorers?.default.url, `/address/${entry.address}`)!}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 transition-colors hover:text-[var(--coral)]"
            style={{ color: 'var(--text-muted)' }}
            title="View on Ritual Explorer"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={14} />
          </a>
        )}
      </div>

      {/* Message */}
      <p className="text-sm leading-relaxed mt-3 break-words" style={{ color: 'var(--text)' }}>
        {entry.message}
      </p>
    </div>
  )
}
