import { Link, useLocation } from 'react-router-dom'
import { Radio, Globe, Settings, User } from 'lucide-react'
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
    <aside className="hidden lg:flex flex-col w-[280px] h-screen sticky top-0 glass border-r border-[var(--ritual-glass-border)] p-6">
      {/* Brand */}
      <div className="mb-10">
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="w-6 h-6 object-contain"
            style={{ filter: 'drop-shadow(0 0 6px rgba(57,255,20,0.4))' }}
          />
          <span
            className="text-sm font-semibold tracking-[0.04em]"
            style={{ color: 'var(--ritual-text-primary)' }}
          >
            Ritual Agent Feeds
          </span>
        </Link>
        <p className="caption-text mt-1">Agent Terminal</p>
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
              className="flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-all duration-200"
              style={{ color: 'var(--ritual-text-secondary)' }}
            >
              <item.icon size={18} />
              {item.label}
            </a>
          ) : (
            <Link
              key={item.label}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-all duration-200 ${
                isActive
                  ? 'text-[var(--ritual-neon)] border-l-[3px] border-l-[var(--ritual-neon)]'
                  : 'text-[var(--ritual-text-secondary)] hover:text-[var(--ritual-text-primary)] hover:bg-[var(--ritual-glass-hover)]'
              }`}
              style={
                isActive
                  ? {
                      background: 'linear-gradient(135deg, rgba(57,255,20,0.08), rgba(34,197,94,0.05))',
                    }
                  : undefined
              }
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          )
        })}

        {/* Settings */}
        <button
          onClick={onSettingsClick}
          className="flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-all duration-200 w-full text-left text-[var(--ritual-text-secondary)] hover:text-[var(--ritual-text-primary)] hover:bg-[var(--ritual-glass-hover)]"
        >
          <Settings size={18} />
          Settings
        </button>
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Wallet / Profile section */}
      {isConnected && address && (
        <button
          onClick={onProfileClick}
          className="w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-[var(--ritual-glass-hover)] group text-left"
          style={{ border: '1px solid var(--ritual-glass-border)' }}
          title="Edit your profile"
        >
          {/* Avatar */}
          <div
            className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-xs font-bold"
            style={{ background: getAddressGradient(address), color: '#fff' }}
          >
            {(displayName?.[0] || address[2]).toUpperCase()}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p
              className="text-sm font-medium truncate leading-tight"
              style={{ color: 'var(--ritual-text-primary)' }}
            >
              {displayName}
            </p>
            <p className="mono-label text-[0.65rem] truncate">{truncateAddress(address)}</p>
          </div>

          {/* Edit hint */}
          <User
            size={14}
            className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color: 'var(--ritual-neon)' }}
          />
        </button>
      )}
    </aside>
  )
}
