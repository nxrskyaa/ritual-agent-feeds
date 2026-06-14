import { ExternalLink, Check, Loader2 } from 'lucide-react'
import { useProfiles } from '@/hooks/useProfiles'
import { truncateAddress, timeAgo, getExplorerUrl } from '@/lib/utils'
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

  const isAgent = entry.type === 'agent'

  const statusIcon =
    entry.status === 'confirmed' ? (
      <Check size={12} style={{ color: 'var(--success)' }} />
    ) : entry.status === 'pending' ? (
      <Loader2 size={12} style={{ color: 'var(--signal)' }} className="animate-spin" />
    ) : null

  return (
    <div
      className="card p-5 relative"
      style={isNew ? { borderColor: 'var(--signal-dim)', borderLeftWidth: 2, borderLeftColor: 'var(--signal)' } : undefined}
    >
      <div className="flex items-start gap-3">
        {/* Avatar — mono square with dot-matrix initial */}
        <button
          onClick={() => onViewProfile?.(entry.address)}
          className="w-10 h-10 shrink-0 flex items-center justify-center text-sm font-bold transition-colors overflow-hidden font-mono"
          style={{
            background: avatarUrl ? undefined : 'var(--surface-2)',
            color: 'var(--ink-display)',
            border: '1px solid var(--line-strong)',
            borderRadius: 'var(--radius)',
          }}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="w-full h-full object-cover" style={{ filter: 'grayscale(1)' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
          ) : (
            displayName[0].toUpperCase()
          )}
        </button>

        {/* Name + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onViewProfile?.(entry.address)}
              className="text-sm font-semibold transition-colors font-heading"
              style={{ color: 'var(--ink-display)' }}
            >
              {displayName}
            </button>
            {/* type badge — monochrome with bracket label */}
            <span
              className="font-mono text-[10px] px-1.5 py-0.5 uppercase tracking-wider"
              style={{
                color: isAgent ? 'var(--signal)' : 'var(--ink-tertiary)',
                border: `1px solid ${isAgent ? 'var(--signal-dim)' : 'var(--line-strong)'}`,
                borderRadius: 2,
              }}
            >
              {isAgent ? 'AGENT' : 'HUMAN'}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap mt-0.5">
            <span className="tag">{truncateAddress(entry.address)}</span>
            <span style={{ color: 'var(--line-strong)' }}>·</span>
            <span className="tag">{timeAgo(entry.timestamp)}</span>
          </div>
        </div>

        {/* Status + explorer */}
        <div className="flex items-center gap-2 shrink-0">
          {statusIcon}
          {getExplorerUrl(RITUAL_CHAIN_CONFIG.blockExplorers?.default.url, `/address/${entry.address}`) && (
            <a
              href={getExplorerUrl(RITUAL_CHAIN_CONFIG.blockExplorers?.default.url, `/address/${entry.address}`)!}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[var(--ink-display)]"
              style={{ color: 'var(--ink-tertiary)' }}
              title="View on Ritual Explorer"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={13} />
            </a>
          )}
        </div>
      </div>

      {/* Message */}
      <p className="text-sm leading-relaxed mt-3 break-words" style={{ color: 'var(--ink-primary)' }}>
        {entry.message}
      </p>
    </div>
  )
}
