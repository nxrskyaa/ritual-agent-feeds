import { Link, useLocation } from 'react-router-dom'
import { Radio, Settings, User, LogOut } from 'lucide-react'
import { useWalletAddress } from '@/hooks/useViemClient'
import { useProfiles } from '@/hooks/useProfiles'
import { getAddressGradient, truncateAddress } from '@/lib/utils'

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
    <aside className="hidden lg:flex flex-col w-[260px] h-screen sticky top-0 glass border-r border-[var(--border)] p-5">
      {/* Brand */}
      <div className="mb-8">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="logo-glow w-7 h-7 flex items-center justify-center">
            <img src="/logo-64.png" alt="Ritual" className="w-6 h-6 logo-img relative z-10" />
          </div>
          <span className="font-heading text-sm font-bold tracking-tight" style={{ color: 'var(--text)' }}>Ritual Feeds</span>
        </Link>
        <p className="tag mt-1 ml-10 typing-cursor">Agent Terminal</p>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link key={item.label} to={item.href} className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}>
              <item.icon size={17} />
              {item.label}
            </Link>
          )
        })}

        <div className="h-px mx-2 my-1" style={{ background: 'linear-gradient(90deg, transparent, var(--border), transparent)' }} />
        <button onClick={onSettingsClick} className="sidebar-link">
          <Settings size={17} />
          Settings
        </button>
      </nav>

      <div className="flex-1" />

      {/* Profile */}
      {isConnected && address && (
        <div className="flex flex-col gap-2">
          <button onClick={onProfileClick} className="w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-white/5 group text-left card-static breathe-border">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="w-9 h-9 rounded-xl shrink-0 object-cover border border-[var(--border)]" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
            ) : (
              <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold" style={{ background: getAddressGradient(address), color: '#fff' }}>
                {(displayName?.[0] || address[2]).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate leading-tight font-heading" style={{ color: 'var(--text)' }}>{displayName}</p>
              <p className="tag truncate">{truncateAddress(address)}</p>
            </div>
            <User size={14} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity bouncy" style={{ color: 'var(--violet)' }} />
          </button>
          <button onClick={disconnect} className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium transition-all duration-200 hover:bg-red-500/10 hover:text-red-400 gravity-pull" style={{ color: 'var(--text-muted)' }}>
            <LogOut size={13} />
            Disconnect
          </button>
        </div>
      )}
    </aside>
  )
}
