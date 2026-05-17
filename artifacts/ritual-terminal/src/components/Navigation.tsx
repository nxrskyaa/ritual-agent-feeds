import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Loader2, Sparkles, LogOut, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWalletAddress } from '@/hooks/useViemClient'
import { getAddressGradient, truncateAddress } from '@/lib/utils'

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [sparkles, setSparkles] = useState<{id:number;x:number;y:number}[]>([])
  const location = useLocation()
  const { address, isConnected, connect, disconnect, isConnecting } = useWalletAddress()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location])

  const burstSparkles = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const baseX = rect.left + rect.width / 2
    const baseY = rect.top + rect.height / 2
    const newSparkles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: baseX + (Math.random() - 0.5) * 80,
      y: baseY + (Math.random() - 0.5) * 80,
    }))
    setSparkles(prev => [...prev, ...newSparkles])
    setTimeout(() => setSparkles(prev => prev.filter(s => !newSparkles.find(ns => ns.id === s.id))), 800)
  }

  const isFeed = location.pathname === '/feed'

  return (
    <>
      {/* Sparkle burst particles */}
      {sparkles.map(s => (
        <div
          key={s.id}
          className="fixed z-[100] pointer-events-none sparkle-particle"
          style={{ left: s.x, top: s.y }}
        />
      ))}

      {/* Main Nav — floating glass pill */}
      <nav className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
        scrolled ? 'top-3 scale-[0.94]' : 'top-5 scale-100'
      }`}>
        <div className={`nav-pill flex items-center gap-1 px-2 py-2 transition-all duration-500 ${
          scrolled ? 'shadow-glow-intense' : 'shadow-glow'
        }`}>
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 pl-3 pr-4 py-1.5 rounded-full hover:bg-white/5 transition-all duration-300 group"
            onClick={burstSparkles}
          >
            <div className="relative w-7 h-7 flex items-center justify-center">
              <div className="absolute inset-0 rounded-lg bg-[var(--violet)]/20 animate-ping" style={{ animationDuration: '3s' }} />
              <img src="/logo-64.png" alt="Ritual" className="w-6 h-6 logo-img relative z-10 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="font-heading text-sm font-bold tracking-tight hidden sm:block" style={{ color: 'var(--text)' }}>
              Ritual Feeds
            </span>
          </Link>

          {/* Divider */}
          <div className="w-px h-5 mx-1" style={{ background: 'var(--border)' }} />

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-0.5">
            <Link
              to="/feed"
              className={`nav-pill-link relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                isFeed ? 'text-white' : 'text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              {isFeed && (
                <motion.span
                  layoutId="nav-pill-active"
                  className="absolute inset-0 rounded-full bg-[var(--violet)]/20 border border-[var(--violet)]/30"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative flex items-center gap-1.5">
                <Zap size={13} className={isFeed ? 'text-[var(--violet)]' : ''} />
                Feed
              </span>
            </Link>
            <a
              href="https://docs.ritualfoundation.org"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-pill-link px-4 py-1.5 rounded-full text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-all duration-300"
            >
              Docs
            </a>
          </div>

          {/* Wallet */}
          <div className="flex items-center gap-2 ml-1">
            {isConnected && address ? (
              <div className="hidden md:flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}>
                  <div className="w-3.5 h-3.5 rounded-full shrink-0 animate-pulse" style={{ background: getAddressGradient(address) }} />
                  <span className="tag text-[10px]">{truncateAddress(address)}</span>
                </div>
                <button
                  onClick={disconnect}
                  className="p-2 rounded-full text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 hover:rotate-12"
                  title="Disconnect"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <button
                onClick={connect}
                disabled={isConnecting}
                className="hidden md:flex btn-shiny text-sm py-2 px-5 gap-2"
              >
                {isConnecting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Sparkles size={14} className="animate-bounce-soft" />
                )}
                {isConnecting ? 'Connecting...' : 'Connect'}
              </button>
            )}

            <button
              className="md:hidden p-2 rounded-full text-[var(--text)] hover:bg-white/5 transition-all hover:rotate-90"
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
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 md:hidden"
            style={{ background: 'rgba(8,6,14,0.98)', backdropFilter: 'blur(20px)' }}
          >
            <div className="absolute w-64 h-64 rounded-full opacity-20" style={{ top: '10%', left: '10%', background: 'radial-gradient(circle, var(--violet), transparent)', filter: 'blur(60px)', animation: 'float-slow 6s ease-in-out infinite' }} />
            <div className="absolute w-48 h-48 rounded-full opacity-15" style={{ bottom: '20%', right: '10%', background: 'radial-gradient(circle, var(--cyan), transparent)', filter: 'blur(50px)', animation: 'float-slow 8s ease-in-out infinite reverse' }} />

            <div className="flex items-center gap-3 mb-8">
              <div className="logo-glow w-12 h-12 flex items-center justify-center">
                <img src="/logo-64.png" alt="Ritual" className="w-10 h-10 logo-img relative z-10" />
              </div>
              <span className="font-heading text-2xl font-bold" style={{ color: 'var(--text)' }}>Ritual Feeds</span>
            </div>

            {isConnected && address ? (
              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="flex items-center gap-3 px-5 py-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}>
                  <div className="w-5 h-5 rounded-full animate-pulse" style={{ background: getAddressGradient(address) }} />
                  <span className="tag">{truncateAddress(address)}</span>
                </div>
                <button onClick={disconnect} className="btn-ghost text-sm flex items-center gap-2 hover:text-red-400 hover:border-red-500/20">
                  <LogOut size={14} /> Disconnect
                </button>
              </div>
            ) : (
              <button onClick={connect} disabled={isConnecting} className="btn-shiny mb-6 text-base py-3 px-8">
                {isConnecting ? (
                  <><Loader2 size={16} className="animate-spin" /> Connecting...</>
                ) : (
                  <><Sparkles size={16} className="animate-bounce-soft" /> Connect Wallet</>
                )}
              </button>
            )}

            <Link to="/feed" className="font-heading text-3xl font-bold transition-all hover:text-[var(--violet)] hover:scale-110" style={{ color: 'var(--text)' }}>
              Feed
            </Link>
            <Link to="/" className="font-heading text-3xl font-bold transition-all hover:text-[var(--violet)] hover:scale-110" style={{ color: 'var(--text)' }}>
              Home
            </Link>
            <a href="https://docs.ritualfoundation.org" target="_blank" rel="noopener noreferrer" className="font-heading text-3xl font-bold transition-all hover:text-[var(--violet)] hover:scale-110" style={{ color: 'var(--text)' }}>
              Docs
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
