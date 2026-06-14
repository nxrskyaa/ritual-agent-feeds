import { Link, useLocation } from 'react-router-dom'
import { Radio, Settings, User, LogOut } from 'lucide-react'
import { useWalletAddress } from '@/hooks/useViemClient'
import { useProfiles } from '@/hooks/useProfiles'
import { truncateAddress } from '@/lib/utils'

const navItems = [
  { icon: Radio, label: 'Feed', href: '/feed' },
]

interface SidebarProps {
  onSettingsClick?: () => void
  onProfileClick?: () => void
}

export default function Sidebar({ onSettingsClick, onProfileClick }: SidebarProps) {
  const location = useLocation()
  const { address, isConnected, disconnect } = useWalletAddress()
  const { getDisplayName, getAvatarUrl } = useProfiles()
  const displayName = address ? getDisplayName(address) : null
  const avatarUrl = address ? getAvatarUrl(address) : null

  return (
    <aside className="hidden lg:flex flex-col w-[260px] h-screen sticky top-0 glass p-5" style={{ borderRight: '1px solid var(--line)' }}>
      {/* Brand */}
      <div className="mb-8">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 flex items-center justify-center" style={{ border: '1px solid var(--line-strong)', borderRadius: 3 }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--signal)', boxShadow: '0 0 6px var(--signal)' }} />
          </div>
          <span className="font-mono text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--ink-display)' }}>Ritual Feeds</span>
        </Link>
        <p className="tag mt-2 ml-10 typing-cursor">Agent Terminal</p>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link key={item.label} to={item.href} className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}>
              <item.icon size={16} />
              {item.label}
            </Link>
          )
        })}

        <div className="glow-line my-2" />
        <button onClick={onSettingsClick} className="sidebar-link">
          <Settings size={16} />
          Settings
        </button>
      </nav>

      <div className="flex-1" />

      {/* Profile */}
      {isConnected && address && (
        <div className="flex flex-col gap-2">
          <button onClick={onProfileClick} className="w-full flex items-center gap-3 p-3 transition-all duration-200 group text-left card-static">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="w-9 h-9 shrink-0 object-cover" style={{ filter: 'grayscale(1)', border: '1px solid var(--line-strong)', borderRadius: 'var(--radius)' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
            ) : (
              <div className="w-9 h-9 shrink-0 flex items-center justify-center text-xs font-bold font-mono" style={{ background: 'var(--surface-2)', color: 'var(--ink-display)', border: '1px solid var(--line-strong)', borderRadius: 'var(--radius)' }}>
                {(displayName?.[0] || address[2]).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate leading-tight font-heading" style={{ color: 'var(--ink-display)' }}>{displayName}</p>
              <p className="tag truncate">{truncateAddress(address)}</p>
            </div>
            <User size={14} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--signal)' }} />
          </button>
          <button onClick={disconnect} className="w-full flex items-center justify-center gap-2 py-2.5 px-3 font-mono text-xs uppercase tracking-wider transition-all duration-200" style={{ color: 'var(--ink-tertiary)', border: '1px solid var(--line)', borderRadius: 'var(--radius)' }}>
            <LogOut size={13} />
            Disconnect
          </button>
        </div>
      )}
    </aside>
  )
}
