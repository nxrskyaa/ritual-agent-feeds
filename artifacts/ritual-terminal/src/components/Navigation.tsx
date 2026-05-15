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
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 md:px-8 transition-all duration-300 ${
          scrolled ? 'terminal-nav' : 'bg-transparent'
        }`}
      >
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[var(--coral)] to-[var(--lavender)] opacity-20 group-hover:opacity-30 transition-opacity" />
            <Sparkles size={18} className="relative text-[var(--coral)] group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <span className="font-heading text-sm font-semibold tracking-tight text-[var(--text-primary)]">
            Ritual Feeds
          </span>
        </Link>

        {/* Center nav links - desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full text-sm font-normal text-[var(--text-secondary)] hover:text-[var(--coral)] hover:bg-[var(--coral-dim)] transition-all duration-200"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className={`px-4 py-2 rounded-full text-sm font-normal transition-all duration-200 ${
                  location.pathname === link.href
                    ? 'text-[var(--coral)] bg-[var(--coral-dim)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--coral)] hover:bg-[var(--coral-dim)]'
                }`}
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* Right side - Wallet Button */}
        <div className="flex items-center gap-3">
          {isConnected && address ? (
            <div className="hidden md:flex items-center gap-2">
              <div className="terminal-glass rounded-full px-3 py-1.5 flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full shrink-0 ring-2 ring-white/10"
                  style={{ background: getAddressGradient(address) }}
                />
                <span className="font-mono-label text-[0.7rem] text-[var(--text-secondary)]">{truncateAddress(address)}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--mint)] animate-pulse" />
              </div>
              <button
                onClick={disconnect}
                className="text-xs text-[var(--text-tertiary)] hover:text-[var(--coral)] transition-colors px-2 py-1"
              >
                Exit
              </button>
            </div>
          ) : (
            <button
              onClick={connect}
              disabled={isConnecting}
              className="hidden md:flex terminal-btn text-sm py-2 px-4 items-center gap-2"
            >
              {isConnecting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  Connect
                </>
              )}
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X size={20} className="text-[var(--text-primary)]" />
            ) : (
              <Menu size={20} className="text-[var(--text-primary)]" />
            )}
          </button>
        </div>
      </motion.nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(24px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[var(--terminal-bg)]/90 flex flex-col items-center justify-center gap-6 md:hidden"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-[var(--coral)]/20 to-[var(--lavender)]/20">
                <Sparkles size={20} className="text-[var(--coral)]" />
              </div>
              <span className="font-heading text-xl font-semibold text-[var(--text-primary)]">
                Ritual Feeds
              </span>
            </div>

            {/* Mobile wallet button */}
            {isConnected && address ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-3 mb-4"
              >
                <div className="flex items-center gap-2 terminal-glass rounded-full px-4 py-2">
                  <div className="w-5 h-5 rounded-full" style={{ background: getAddressGradient(address) }} />
                  <span className="font-mono-label text-sm text-[var(--text-secondary)]">{truncateAddress(address)}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--mint)] animate-pulse" />
                </div>
                <button onClick={disconnect} className="terminal-btn-ghost text-sm">
                  Disconnect
                </button>
              </motion.div>
            ) : (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={connect}
                disabled={isConnecting}
                className="terminal-btn mb-4 flex items-center gap-2"
              >
                {isConnecting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    Connect Wallet
                  </>
                )}
              </motion.button>
            )}

            {navLinks.map((link, i) =>
              link.external ? (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.3 }}
                  className="font-heading text-2xl font-light text-[var(--text-primary)] hover:text-[var(--coral)] transition-colors"
                >
                  {link.label}
                </motion.a>
              ) : (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.3 }}
                >
                  <Link to={link.href} className="font-heading text-2xl font-light text-[var(--text-primary)] hover:text-[var(--coral)] transition-colors">
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
