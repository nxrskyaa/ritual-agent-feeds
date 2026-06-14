import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Loader2, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWalletAddress } from '@/hooks/useViemClient'
import { truncateAddress } from '@/lib/utils'

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { address, isConnected, connect, disconnect, isConnecting } = useWalletAddress()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location])

  const isFeed = location.pathname === '/feed'

  return (
    <>
      {/* Main Nav — floating pill */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-[calc(100%-2rem)] max-w-3xl">
        <div className={`nav-pill flex items-center gap-1 px-2.5 py-2 transition-all duration-300 ${scrolled ? 'shadow-glow-intense' : 'shadow-glow'}`}>
          {/* Logo block — mono square mark */}
          <Link to="/" className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 group">
            <div className="relative w-7 h-7 flex items-center justify-center" style={{ border: '1px solid var(--line-strong)', borderRadius: 3 }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--signal)', boxShadow: '0 0 6px var(--signal)' }} />
            </div>
            <span className="font-mono text-xs font-bold tracking-widest uppercase hidden sm:block" style={{ color: 'var(--ink-display)' }}>
              Ritual<span style={{ color: 'var(--ink-tertiary)' }}>·Feeds</span>
            </span>
          </Link>

          <div className="w-px h-5 mx-1" style={{ background: 'var(--line)' }} />

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-0.5">
            <Link
              to="/feed"
              className={`nav-pill-link relative px-4 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider transition-colors duration-300 ${isFeed ? '' : 'hover:text-white'}`}
              style={{ color: isFeed ? 'var(--ink-display)' : 'var(--ink-tertiary)' }}
            >
              {isFeed && (
                <motion.span
                  layoutId="nav-pill-active"
                  className="absolute inset-0 rounded-full"
                  style={{ border: '1px solid var(--line-strong)', background: 'var(--surface-2)' }}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative">Feed</span>
            </Link>
            <a
              href="https://docs.ritualfoundation.org"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider transition-colors duration-300 hover:text-white"
              style={{ color: 'var(--ink-tertiary)' }}
            >
              Docs
            </a>
          </div>

          {/* Wallet */}
          <div className="flex items-center gap-2 ml-auto md:ml-1">
            {isConnected && address ? (
              <div className="hidden md:flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'var(--surface-1)', border: '1px solid var(--line-strong)' }}>
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--signal)' }} />
                  <span className="tag" style={{ color: 'var(--ink-secondary)' }}>{truncateAddress(address)}</span>
                </div>
                <button
                  onClick={disconnect}
                  className="p-2 rounded-full transition-colors duration-200"
                  style={{ color: 'var(--ink-tertiary)' }}
                  title="Disconnect"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <button onClick={connect} disabled={isConnecting} className="hidden md:flex btn-shiny" style={{ minHeight: 36, padding: '0.5rem 1.25rem' }}>
                {isConnecting ? <Loader2 size={13} className="animate-spin" /> : null}
                {isConnecting ? 'CONNECTING' : 'CONNECT'}
              </button>
            )}

            <button
              className="md:hidden p-2 rounded-full transition-all"
              style={{ color: 'var(--ink-display)' }}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 md:hidden dot-grid-bg"
            style={{ background: 'rgba(0,0,0,0.97)', backdropFilter: 'blur(12px)' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center" style={{ border: '1px solid var(--line-strong)', borderRadius: 4 }}>
                <span className="w-2 h-2 rounded-full" style={{ background: 'var(--signal)', boxShadow: '0 0 8px var(--signal)' }} />
              </div>
              <span className="font-mono text-sm font-bold tracking-widest uppercase" style={{ color: 'var(--ink-display)' }}>Ritual Feeds</span>
            </div>

            {isConnected && address ? (
              <div className="flex flex-col items-center gap-4 mb-2">
                <div className="flex items-center gap-3 px-5 py-2.5 rounded-full" style={{ background: 'var(--surface-1)', border: '1px solid var(--line-strong)' }}>
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--signal)' }} />
                  <span className="tag">{truncateAddress(address)}</span>
                </div>
                <button onClick={disconnect} className="btn-ghost flex items-center gap-2">
                  <LogOut size={14} /> DISCONNECT
                </button>
              </div>
            ) : (
              <button onClick={connect} disabled={isConnecting} className="btn-shiny mb-2">
                {isConnecting ? <><Loader2 size={16} className="animate-spin" /> CONNECTING</> : 'CONNECT WALLET'}
              </button>
            )}

            <div className="flex flex-col items-center gap-6">
              <Link to="/feed" className="font-heading text-3xl font-bold transition-colors" style={{ color: 'var(--ink-display)' }}>Feed</Link>
              <Link to="/" className="font-heading text-3xl font-bold transition-colors" style={{ color: 'var(--ink-display)' }}>Home</Link>
              <a href="https://docs.ritualfoundation.org" target="_blank" rel="noopener noreferrer" className="font-heading text-3xl font-bold transition-colors" style={{ color: 'var(--ink-display)' }}>Docs</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
