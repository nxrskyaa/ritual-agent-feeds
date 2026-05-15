import { MessageCircle, Users, Zap, Activity } from 'lucide-react'
import { useMockStats } from '@/hooks/useMockStats'
import { useContractStats } from '@/hooks/useContractStats'

export default function RightStatsPanel() {
  const { tps } = useMockStats()
  const { totalMessages, activeWallets, isLoading } = useContractStats()

  const statCards = [
    {
      icon: MessageCircle,
      value: totalMessages,
      label: 'Messages',
      color: 'var(--coral)',
      bg: 'var(--coral-dim)',
      isLoading,
    },
    {
      icon: Users,
      value: activeWallets,
      label: 'Wallets',
      color: 'var(--lavender)',
      bg: 'var(--lavender-dim)',
      isLoading,
    },
    {
      icon: Zap,
      value: tps,
      label: 'TPS',
      color: 'var(--sunshine)',
      bg: 'var(--sunshine-dim)',
      isLoading: false,
    },
  ]

  return (
    <aside className="hidden xl:flex flex-col w-[280px] h-screen sticky top-0 terminal-glass border-l border-[var(--terminal-border)] p-5 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Activity size={16} className="text-[var(--coral)]" />
          <h3 className="font-heading text-base font-bold text-[var(--text-primary)]">
            Network Pulse
          </h3>
        </div>
        <p className="caption-text">Real-time stats from Ritual</p>
      </div>

      {/* Stat Cards */}
      <div className="flex flex-col gap-3 mb-6">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="terminal-card grain-overlay p-4"
            style={{ borderLeft: `3px solid ${stat.color}` }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: stat.bg }}>
                <stat.icon size={15} style={{ color: stat.color }} />
              </div>
              <p className="caption-text">{stat.label}</p>
            </div>
            <div className="font-heading text-2xl font-bold" style={{ color: stat.color }}>
              {stat.isLoading ? '...' : stat.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Network Status */}
      <div className="terminal-card grain-overlay p-4" style={{ borderLeft: '3px solid var(--mint)' }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-[var(--mint)] animate-pulse" />
          <span className="text-sm font-medium text-[var(--text-primary)]">
            Online
          </span>
        </div>
        <p className="caption-text">Ritual Testnet · Chain 1979</p>
      </div>

      {/* Fun decoration */}
      <div className="mt-auto pt-6">
        <div className="terminal-card grain-overlay p-4 text-center">
          <p className="font-mono-label text-xs text-[var(--text-muted)] mb-2">Fun Fact</p>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            This feed lives on the blockchain forever. Your message is now immortal. 🧬
          </p>
        </div>
      </div>
    </aside>
  )
}
