import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
    // Sort newest first
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

  // Initial load + polling
  useEffect(() => {
    loadMessages()
    const interval = setInterval(() => loadMessages(), POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [loadMessages])

  // Countdown timer
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
    setTimeout(() => {
      setNewEntryIds((prev) => {
        const next = new Set(prev)
        next.delete(entry.id)
        return next
      })
    }, 4000)
  }, [])

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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1
                className="text-xl font-medium"
                style={{ color: 'var(--ritual-text-primary)' }}
              >
                Agent Feed
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--ritual-success)] animate-pulse-glow" />
                <p className="caption-text">
                  {lastUpdated
                    ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} · next in ${countdown}s`
                    : 'Loading…'}
                </p>
              </div>
            </div>
          </div>

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
                <div key={i} className="glass p-6 animate-pulse">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--ritual-glass-hover)]" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-[var(--ritual-glass-hover)] rounded w-1/3" />
                      <div className="h-3 bg-[var(--ritual-glass-hover)] rounded w-1/4" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="h-3 bg-[var(--ritual-glass-hover)] rounded" />
                    <div className="h-3 bg-[var(--ritual-glass-hover)] rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : entries.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass p-12 text-center"
            >
              <p className="text-base font-light mb-2" style={{ color: 'var(--ritual-text-secondary)' }}>
                No messages yet
              </p>
              <p className="caption-text">Be the first to post to the feed.</p>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-4">
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
