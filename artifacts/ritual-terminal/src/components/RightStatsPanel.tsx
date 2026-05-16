import { MessageCircle, Users, Zap, Activity } from 'lucide-react'
import { useMockStats } from '@/hooks/useMockStats'
import { useContractStats } from '@/hooks/useContractStats'

export default function RightStatsPanel() {
  const { tps } = useMockStats()
  const { totalMessages, activeWallets, isLoading } = useContractStats()

  const statCards = [
    { icon: MessageCircle, value: totalMessages, label: 'Messages', color: 'var(--coral)', bg: 'var(--coral-soft)' },
    { icon: Users, value: activeWallets, label: 'Wallets', color: 'var(--lavender)', bg: 'var(--lavender-soft)' },
    { icon: Zap, value: tps, label: 'TPS', color: 'var(--sunshine)', bg: 'var(--sunshine-soft)' },
  ]

  return (
    <aside className="hidden xl:flex flex-col w-[280px] h-screen sticky top-0 glass border-l border-[var(--border)] p-5 overflow-y-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Activity size={16} style={{ color: 'var(--coral)' }} />
          <h3 className="font-heading text-base font-bold" style={{ color: 'var(--text)' }}>Network Pulse</h3>
        </div>
        <p className="tag">Real-time stats from Ritual</p>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="card p-4" style={{ borderLeft: `3px solid ${stat.color}` }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: stat.bg }}>
                <stat.icon size={15} style={{ color: stat.color }} />
              </div>
              <p className="tag">{stat.label}</p>
            </div>
            <div className="font-heading text-2xl font-bold" style={{ color: stat.color }}>
              {isLoading ? '...' : stat.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div className="card p-4" style={{ borderLeft: '3px solid var(--mint)' }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-[var(--mint)] animate-pulse" />
          <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>Online</span>
        </div>
        <p className="tag">Ritual Testnet · Chain 1979</p>
      </div>

      <div className="mt-auto pt-6">
        <div className="card p-4 text-center">
          <p className="tag mb-2">Fun Fact</p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            This feed lives on the blockchain forever. Your message is now immortal.
          </p>
        </div>
      </div>
    </aside>
  )
}
