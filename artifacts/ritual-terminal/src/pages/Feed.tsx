import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Radio, Clock } from 'lucide-react'

import AmbientBackground from '@/components/AmbientBackground'
import Sidebar from '@/components/Sidebar'
import RightStatsPanel from '@/components/RightStatsPanel'
import Navigation from '@/components/Navigation'
import MessageComposer from '@/components/MessageComposer'
import FeedEntry from '@/components/FeedEntry'
import ToastNotification from '@/components/ToastNotification'
import ProfileModal from '@/components/ProfileModal'
import SettingsModal from '@/components/SettingsModal'
import WalletCard from '@/components/WalletCard'
import ClickSparkles from '@/components/ClickSparkles'
import Confetti from '@/components/Confetti'
import { useConfetti } from '@/components/Confetti'
import { useAgentFeed } from '@/hooks/useAgentFeed'
import { useWalletAddress } from '@/hooks/useViemClient'
import { generateId } from '@/lib/utils'
import type { FeedEntry as FeedEntryType, Toast } from '@/types'

const POLL_INTERVAL = 15000

export default function Feed() {
  const [entries, setEntries] = useState<FeedEntryType[]>([])
  const [toasts, setToasts] = useState<Toast[]>([])
  const [profileAddress, setProfileAddress] = useState<string | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [newEntryIds, setNewEntryIds] = useState<Set<string>>(new Set())
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [countdown, setCountdown] = useState(POLL_INTERVAL / 1000)
  const { pieces: confettiPieces, burst: confettiBurst } = useConfetti()

  const knownIdsRef = useRef<Set<string>>(new Set())
  const lastPollRef = useRef<number>(Date.now())

  const { getMessages } = useAgentFeed()
  const { address, isConnected, connect } = useWalletAddress()

  const markNew = useCallback((ids: string[]) => {
    if (ids.length === 0) return
    setNewEntryIds((prev) => new Set([...prev, ...ids]))
    setTimeout(() => {
      setNewEntryIds((prev) => {
        const next = new Set(prev)
        ids.forEach((id) => next.delete(id))
        return next
      })
    }, 4000)
  }, [])

  const loadMessages = useCallback(async () => {
    const msgs = await getMessages(0, 50)
    const sorted = [...msgs].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )

    setEntries(() => {
      const incomingIds = new Set(sorted.map((m) => m.id))
      const genuinelyNew = sorted
        .filter((m) => !knownIdsRef.current.has(m.id))
        .map((m) => m.id)

      if (knownIdsRef.current.size > 0 && genuinelyNew.length > 0) {
        markNew(genuinelyNew)
      }

      knownIdsRef.current = incomingIds
      return sorted
    })

    setLastUpdated(new Date())
    lastPollRef.current = Date.now()
    setCountdown(POLL_INTERVAL / 1000)
  }, [getMessages, markNew])

  useEffect(() => {
    loadMessages()
    const interval = setInterval(() => loadMessages(), POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [loadMessages])

  useEffect(() => {
    const tick = setInterval(() => {
      const elapsed = (Date.now() - lastPollRef.current) / 1000
      setCountdown(Math.max(0, Math.round(POLL_INTERVAL / 1000 - elapsed)))
    }, 1000)
    return () => clearInterval(tick)
  }, [])

  const handleNewEntry = useCallback((entry: FeedEntryType) => {
    setEntries((prev) => [entry, ...prev])
    knownIdsRef.current.add(entry.id)
    setNewEntryIds((prev) => new Set([...prev, entry.id]))
    confettiBurst()
    setTimeout(() => {
      setNewEntryIds((prev) => {
        const next = new Set(prev)
        next.delete(entry.id)
        return next
      })
    }, 4000)
  }, [confettiBurst])

  const handleToast = useCallback((toast: Toast) => {
    setToasts((prev) => [...prev, toast])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id))
    }, 5000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const handleViewProfile = useCallback((addr: string) => {
    setProfileAddress(addr)
    setProfileOpen(true)
  }, [])

  const handleConnect = useCallback(async (): Promise<string | null> => {
    try {
      return await connect()
    } catch {
      handleToast({ id: generateId(), type: 'error', message: 'Failed to connect wallet.' })
      return null
    }
  }, [connect, handleToast])

  return (
    <div className="min-h-screen relative flex">
      <AmbientBackground />
      <ClickSparkles />
      <Confetti pieces={confettiPieces} />

      {/* Sidebar - desktop only */}
      <Sidebar
        onSettingsClick={() => setSettingsOpen(true)}
        onProfileClick={() => {
          if (address) {
            setProfileAddress(address)
            setProfileOpen(true)
          }
        }}
      />

      {/* Main content */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Mobile nav */}
        <div className="lg:hidden">
          <Navigation />
        </div>

        <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 lg:pt-8 pt-20">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--coral)]/20 to-[var(--lavender)]/20 flex items-center justify-center relative overflow-hidden">
                  <Radio size={16} className="text-[var(--coral)] relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--coral)]/10 to-[var(--lavender)]/10 animate-pulse" />
                </div>
                <h1 className="font-heading text-xl font-bold text-[var(--text-primary)]">
                  The Feed
                </h1>
              </div>
              <div className="flex items-center gap-2 mt-1 ml-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--mint)] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--mint)]" />
                </span>
                <p className="label flex items-center gap-1.5">
                  <Clock size={11} />
                  {lastUpdated
                    ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} · refresh in ${countdown}s`
                    : 'Warming up…'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Wallet card - mobile */}
          <div className="lg:hidden mb-6">
            <WalletCard />
          </div>

          {/* Compose */}
          <MessageComposer
            walletConnected={isConnected}
            walletAddress={address}
            onSubmit={handleNewEntry}
            onToast={handleToast}
            connectWallet={handleConnect}
          />

          {/* Feed */}
          {entries.length === 0 && lastUpdated === null ? (
            <div className="flex flex-col gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/5" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-white/5 rounded w-1/3" />
                      <div className="h-3 bg-white/5 rounded w-1/4" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="h-3 bg-white/5 rounded" />
                    <div className="h-3 bg-white/5 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : entries.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card p-12 text-center"
            >
              <p className="text-base font-light mb-2 text-[var(--text-secondary)]">
                No messages yet
              </p>
              <p className="label">Be the pioneer. Drop the first message.</p>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-3">
              <AnimatePresence initial={false}>
                {entries.map((entry) => (
                  <FeedEntry
                    key={entry.id}
                    entry={entry}
                    isNew={newEntryIds.has(entry.id)}
                    onViewProfile={handleViewProfile}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      {/* Right panel - xl only */}
      <RightStatsPanel />

      {/* Toasts */}
      <ToastNotification toasts={toasts} onRemove={removeToast} />

      {/* Profile modal */}
      <ProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        address={profileAddress}
        entries={entries}
      />

      {/* Settings modal */}
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}
