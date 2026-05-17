import { useState, useEffect, useCallback, useRef } from 'react'
import { Radio } from 'lucide-react'
import AmbientBackground from '@/components/AmbientBackground'
import CosmicBackground from '@/components/CosmicBackground'
import Sidebar from '@/components/Sidebar'
import RightStatsPanel from '@/components/RightStatsPanel'
import Navigation from '@/components/Navigation'
import MessageComposer from '@/components/MessageComposer'
import FeedEntry from '@/components/FeedEntry'
import ToastNotification from '@/components/ToastNotification'
import ProfileModal from '@/components/ProfileModal'
import SettingsModal from '@/components/SettingsModal'
import WalletCard from '@/components/WalletCard'
import Footer from '@/components/Footer'
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
  const [isLive, setIsLive] = useState(false)

  const knownIdsRef = useRef<Set<string>>(new Set())
  const countdownRef = useRef<HTMLSpanElement>(null)

  const { getMessages } = useAgentFeed()
  const { address, isConnected, isConnecting, connect } = useWalletAddress()

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
    try {
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

      setIsLive(true)
    } catch {
      // silent fail
    }
  }, [getMessages, markNew])

  useEffect(() => {
    loadMessages()
    const interval = setInterval(() => loadMessages(), POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [loadMessages])

  // Countdown via ref (NO React state = NO re-render flicker)
  useEffect(() => {
    let lastPoll = Date.now()
    const tick = setInterval(() => {
      if (countdownRef.current) {
        const elapsed = (Date.now() - lastPoll) / 1000
        const remaining = Math.max(0, Math.round(POLL_INTERVAL / 1000 - elapsed))
        countdownRef.current.textContent = remaining > 0 ? `refresh in ${remaining}s` : 'refreshing...'
      }
    }, 1000)
    const resetTick = setInterval(() => {
      lastPoll = Date.now()
    }, POLL_INTERVAL)
    return () => {
      clearInterval(tick)
      clearInterval(resetTick)
    }
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
    } catch (err: unknown) {
      const msg = (err as Error).message || 'Failed to connect wallet.'
      handleToast({ id: generateId(), type: 'error', message: msg })
      return null
    }
  }, [connect, handleToast])

  return (
    <div className="min-h-screen relative flex flex-col">
      <AmbientBackground />
      <CosmicBackground />

      <div className="flex flex-1">
        <Sidebar
          onSettingsClick={() => setSettingsOpen(true)}
          onProfileClick={() => {
            if (address) {
              setProfileAddress(address)
              setProfileOpen(true)
            }
          }}
        />

        <main className="flex-1 min-w-0 flex flex-col">
          {/* Mobile nav */}
          <div className="lg:hidden">
            <Navigation />
          </div>

          <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 pt-20 lg:pt-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center orbital" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(167,139,250,0.15))' }}>
                  <Radio size={16} style={{ color: 'var(--violet)' }} className="animate-bounce-soft" />
                </div>
                <h1 className="font-heading text-xl font-bold neon-flicker" style={{ color: 'var(--text)' }}>The Feed</h1>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-[var(--cyan)] opacity-75" />
                  <span className="relative rounded-full h-2 w-2 bg-[var(--cyan)]" />
                </span>
                <span className="tag flex items-center gap-1.5 typing-cursor">
                  {isLive ? 'Live · ' : 'Warming up · '}
                  <span ref={countdownRef} />
                </span>
              </div>
            </div>
          </div>

          {/* Mobile wallet card */}
          <div className="lg:hidden mb-6">
            <WalletCard />
          </div>

          {/* Composer */}
          <MessageComposer
            walletConnected={isConnected}
            walletAddress={address}
            isConnecting={isConnecting}
            onSubmit={handleNewEntry}
            onToast={handleToast}
            connectWallet={handleConnect}
          />

          {/* Feed entries */}
          {entries.length === 0 && !isLive ? (
            <div className="flex flex-col gap-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="card p-6 animate-pulse scanner">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 morph-blob" />
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
            <div className="card p-12 text-center floating-orb">
              <p className="text-base font-light mb-2" style={{ color: 'var(--text-secondary)' }}>No messages yet</p>
              <p className="tag typing-cursor">Be the pioneer. Drop the first message.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {entries.map((entry) => (
                <FeedEntry
                  key={entry.id}
                  entry={entry}
                  isNew={newEntryIds.has(entry.id)}
                  onViewProfile={handleViewProfile}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <RightStatsPanel />
      </div>
      <Footer />
      <ToastNotification toasts={toasts} onRemove={removeToast} />
      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} address={profileAddress} entries={entries} />
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}
