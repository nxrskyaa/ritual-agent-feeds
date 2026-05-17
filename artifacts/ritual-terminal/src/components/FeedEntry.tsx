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
  const { getDisplayName, getAvatarUrl } = useProfiles()
  const displayName = getDisplayName(entry.address)
  const avatarUrl = getAvatarUrl(entry.address)

  const statusIcon =
    entry.status === 'confirmed' ? (
      <CheckCircle size={13} style={{ color: 'var(--cyan)' }} />
    ) : entry.status === 'pending' ? (
      <Loader2 size={13} style={{ color: 'var(--pink)' }} className="animate-spin" />
    ) : null

  const TypeIcon = entry.type === 'agent' ? Bot : User
  const typeColor = entry.type === 'agent' ? 'var(--purple)' : 'var(--text-muted)'
  const typeBg = entry.type === 'agent' ? 'var(--purple-soft)' : 'rgba(255,255,255,0.04)'

  const cardStyle = isNew
    ? { borderLeft: '3px solid var(--violet)', boxShadow: '0 0 20px rgba(139,92,246,0.08)' }
    : undefined

  return (
    <div className={`card p-5 ${isNew ? 'scanner' : ''}`} style={cardStyle}>
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <button
          onClick={() => onViewProfile?.(entry.address)}
          className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold transition-transform hover:scale-110 overflow-hidden"
          style={avatarUrl ? undefined : { background: getAddressGradient(entry.address), color: '#fff' }}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
          ) : (
            displayName[0].toUpperCase()
          )}
        </button>

        {/* Name + meta */}
        <div className="flex-1 min-w-0">
          <button
            onClick={() => onViewProfile?.(entry.address)}
            className="text-sm font-semibold block transition-colors hover:text-[var(--violet)] font-heading"
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
          <TypeIcon size={12} style={{ color: typeColor }} className={entry.type === 'agent' ? 'animate-bounce-soft' : ''} />
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
            className="shrink-0 transition-colors hover:text-[var(--violet)]"
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
