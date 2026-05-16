import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Loader2, Sparkles } from 'lucide-react'
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
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 md:px-8 transition-all duration-300 ${
          scrolled ? 'glass' : ''
        }`}
      >
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-lg opacity-20 group-hover:opacity-30 transition-opacity" style={{ background: 'linear-gradient(135deg, var(--coral), var(--lavender))' }} />
            <Sparkles size={18} className="relative group-hover:rotate-12 transition-transform duration-300" style={{ color: 'var(--coral)' }} />
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
                className="px-4 py-2 rounded-full text-sm font-normal transition-all duration-200"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--coral)'; e.currentTarget.style.background = 'var(--coral-soft)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent' }}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className="px-4 py-2 rounded-full text-sm font-normal transition-all duration-200"
                style={{
                  color: location.pathname === link.href ? 'var(--coral)' : 'var(--text-secondary)',
                  background: location.pathname === link.href ? 'var(--coral-soft)' : 'transparent',
                }}
                onMouseEnter={(e) => { if (location.pathname !== link.href) { e.currentTarget.style.color = 'var(--coral)'; e.currentTarget.style.background = 'var(--coral-soft)' }}}
                onMouseLeave={(e) => { if (location.pathname !== link.href) { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent' }}}
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
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--mint)] animate-pulse" />
              </div>
              <button onClick={disconnect} className="text-xs transition-colors hover:text-[var(--coral)]" style={{ color: 'var(--text-muted)' }}>
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
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 md:hidden"
            style={{ background: 'rgba(12,12,29,0.95)' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(255,123,114,0.2), rgba(210,180,255,0.2))' }}>
                <Sparkles size={20} style={{ color: 'var(--coral)' }} />
              </div>
              <span className="font-heading text-xl font-semibold" style={{ color: 'var(--text)' }}>Ritual Feeds</span>
            </div>

            {isConnected && address ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-3 mb-4">
                <div className="glass rounded-full px-4 py-2 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full" style={{ background: getAddressGradient(address) }} />
                  <span className="tag">{truncateAddress(address)}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--mint)] animate-pulse" />
                </div>
                <button onClick={disconnect} className="btn-ghost text-sm">Disconnect</button>
              </motion.div>
            ) : (
              <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onClick={connect} disabled={isConnecting} className="btn mb-4">
                {isConnecting ? (
                  <><Loader2 size={14} className="animate-spin" /> Connecting...</>
                ) : (
                  <><Sparkles size={14} /> Connect Wallet</>
                )}
              </motion.button>
            )}

            {navLinks.map((link, i) =>
              link.external ? (
                <motion.a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="font-heading text-2xl font-light transition-colors hover:text-[var(--coral)]" style={{ color: 'var(--text)' }}>
                  {link.label}
                </motion.a>
              ) : (
                <motion.div key={link.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <Link to={link.href} className="font-heading text-2xl font-light transition-colors hover:text-[var(--coral)]" style={{ color: 'var(--text)' }}>
                    {link.label}
                  </Link>
                </motion.div>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
