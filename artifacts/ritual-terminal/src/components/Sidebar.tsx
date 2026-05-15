import { Link, useLocation } from 'react-router-dom'
import { Radio, Globe, Settings, Sparkles, User } from 'lucide-react'
import { useWalletAddress } from '@/hooks/useViemClient'
import { useProfiles } from '@/hooks/useProfiles'
import { getAddressGradient, truncateAddress } from '@/lib/utils'

const navItems = [
  { icon: Radio, label: 'Feed', href: '/feed' },
  {
    icon: Globe,
    label: 'Explore',
    href: 'https://docs.ritualfoundation.org',
    external: true,
  },
]

interface SidebarProps {
  onSettingsClick?: () => void
  onProfileClick?: () => void
}

export default function Sidebar({ onSettingsClick, onProfileClick }: SidebarProps) {
  const location = useLocation()
  const { address, isConnected } = useWalletAddress()
  const { getDisplayName } = useProfiles()
  const displayName = address ? getDisplayName(address) : null

  return (
    <aside className="hidden lg:flex flex-col w-[260px] h-screen sticky top-0 terminal-glass border-r border-[var(--terminal-border)] p-5">
      {/* Brand */}
      <div className="mb-8">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-gradient-to-br from-[var(--coral)]/20 to-[var(--lavender)]/20 group-hover:from-[var(--coral)]/30 group-hover:to-[var(--lavender)]/30 transition-all">
            <Sparkles size={14} className="text-[var(--coral)]" />
          </div>
          <span className="font-heading text-sm font-bold tracking-tight text-[var(--text-primary)]">
            Ritual Feeds
          </span>
        </Link>
        <p className="caption-text mt-1 ml-10">Agent Terminal</p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = !item.external && location.pathname === item.href
          return item.external ? (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 text-[var(--text-secondary)] hover:text-[var(--coral)] hover:bg-[var(--coral-dim)]"
            >
              <item.icon size={17} />
              {item.label}
            </a>
          ) : (
            <Link
              key={item.label}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                isActive
                  ? 'text-[var(--coral)] bg-[var(--coral-dim)] font-medium'
                  : 'text-[var(--text-secondary)] hover:text-[var(--coral)] hover:bg-[var(--coral-dim)]'
              }`}
            >
              <item.icon size={17} />
              {item.label}
            </Link>
          )
        })}

        {/* Settings */}
        <button
          onClick={onSettingsClick}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 w-full text-left text-[var(--text-secondary)] hover:text-[var(--coral)] hover:bg-[var(--coral-dim)]"
        >
          <Settings size={17} />
          Settings
        </button>
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Wallet / Profile section */}
      {isConnected && address && (
        <button
          onClick={onProfileClick}
          className="w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-white/5 group text-left terminal-card"
        >
          {/* Avatar */}
          <div
            className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold"
            style={{ background: getAddressGradient(address), color: '#fff' }}
          >
            {(displayName?.[0] || address[2]).toUpperCase()}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate leading-tight font-heading text-[var(--text-primary)]">
              {displayName}
            </p>
            <p className="font-mono-label text-[0.65rem] truncate text-[var(--text-muted)]">{truncateAddress(address)}</p>
          </div>

          {/* Edit hint */}
          <User
            size={14}
            className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--coral)]"
          />
        </button>
      )}
    </aside>
  )
}
