import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Loader2 } from 'lucide-react'
import { useWalletAddress } from '@/hooks/useViemClient'
import { getAddressGradient, truncateAddress } from '@/lib/utils'

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { address, isConnected, connect, disconnect, isConnecting } = useWalletAddress()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  const navLinks = [
    { label: 'Feed', href: '/feed' },
    { label: 'Docs', href: 'https://docs.ritualfoundation.org', external: true },
  ]

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 md:px-8 transition-all duration-300 ${
          scrolled ? 'glass' : ''
        }`}
      >
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="logo-glow w-8 h-8 flex items-center justify-center">
            <img src="/logo-64.png" alt="Ritual" className="w-7 h-7 logo-img relative z-10" />
          </div>
          <span className="font-heading text-sm font-semibold tracking-tight" style={{ color: 'var(--text)' }}>
            Ritual Feeds
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className={`nav-link ${location.pathname === link.href ? 'nav-link-active' : ''}`}
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        <div className="flex items-center gap-3">
          {isConnected && address ? (
            <div className="hidden md:flex items-center gap-2">
              <div className="glass rounded-full px-3 py-1.5 flex items-center gap-2">
                <div className="w-4 h-4 rounded-full shrink-0" style={{ background: getAddressGradient(address) }} />
                <span className="tag">{truncateAddress(address)}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)] animate-pulse" />
              </div>
              <button onClick={disconnect} className="text-xs transition-colors hover:text-[var(--violet)]" style={{ color: 'var(--text-muted)' }}>
                Exit
              </button>
            </div>
          ) : (
            <button onClick={connect} disabled={isConnecting} className="hidden md:flex btn text-sm py-2 px-4">
              {isConnecting ? (
                <><Loader2 size={14} className="animate-spin" /> Connecting...</>
              ) : (
                <><Sparkles size={14} /> Connect</>
              )}
            </button>
          )}

          <button className="md:hidden p-2 rounded-lg transition-colors" style={{ color: 'var(--text)' }} onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 md:hidden"
          style={{ background: 'rgba(8,6,14,0.97)' }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="logo-glow w-10 h-10 flex items-center justify-center">
              <img src="/logo-64.png" alt="Ritual" className="w-9 h-9 logo-img relative z-10" />
            </div>
            <span className="font-heading text-xl font-semibold" style={{ color: 'var(--text)' }}>Ritual Feeds</span>
          </div>

          {isConnected && address ? (
            <div className="flex flex-col items-center gap-3 mb-4">
              <div className="glass rounded-full px-4 py-2 flex items-center gap-2">
                <div className="w-5 h-5 rounded-full" style={{ background: getAddressGradient(address) }} />
                <span className="tag">{truncateAddress(address)}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)] animate-pulse" />
              </div>
              <button onClick={disconnect} className="btn-ghost text-sm">Disconnect</button>
            </div>
          ) : (
            <button onClick={connect} disabled={isConnecting} className="btn mb-4">
              {isConnecting ? (
                <><Loader2 size={14} className="animate-spin" /> Connecting...</>
              ) : (
                <><Sparkles size={14} /> Connect Wallet</>
              )}
            </button>
          )}

          {navLinks.map((link) =>
            link.external ? (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="font-heading text-2xl font-light transition-colors hover:text-[var(--violet)]" style={{ color: 'var(--text)' }}>
                {link.label}
              </a>
            ) : (
              <Link key={link.label} to={link.href} className="font-heading text-2xl font-light transition-colors hover:text-[var(--violet)]" style={{ color: 'var(--text)' }}>
                {link.label}
              </Link>
            )
          )}
        </div>
      )}
    </>
  )
}
