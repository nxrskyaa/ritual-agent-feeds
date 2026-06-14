import { useMockStats } from '@/hooks/useMockStats'
import { useContractStats } from '@/hooks/useContractStats'

export default function RightStatsPanel() {
  const { tps } = useMockStats()
  const { totalMessages, activeWallets, isLoading } = useContractStats()

  const statCards = [
    { value: totalMessages, label: 'MESSAGES', code: 'MSG' },
    { value: activeWallets, label: 'WALLETS', code: 'WAL' },
    { value: tps, label: 'TPS', code: 'TPS' },
  ]

  return (
    <aside className="hidden xl:flex flex-col w-[280px] h-screen sticky top-0 glass p-5 overflow-y-auto" style={{ borderLeft: '1px solid var(--line)' }}>
      <div className="mb-6 pb-4 border-b" style={{ borderColor: 'var(--line)' }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs" style={{ color: 'var(--signal)' }}>{'>'}</span>
          <h3 className="font-mono text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--ink-display)' }}>Network Pulse</h3>
        </div>
        <p className="tag ml-5">Real-time · Ritual</p>
      </div>

      <div className="flex flex-col gap-3 mb-6 stagger">
        {statCards.map((stat) => (
          <div key={stat.label} className="card-static p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="tag">{stat.label}</p>
              <span className="font-mono text-[10px]" style={{ color: 'var(--signal)' }}>{stat.code}</span>
            </div>
            <div className="font-mono text-3xl font-bold" style={{ color: 'var(--ink-display)' }}>
              {isLoading ? '—' : stat.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div className="card-static p-4" style={{ borderLeft: '2px solid var(--signal)' }}>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--signal)' }} />
          <span className="font-mono text-xs uppercase tracking-wider" style={{ color: 'var(--ink-display)' }}>Online</span>
        </div>
        <p className="tag typing-cursor">Ritual Testnet · Chain 1979</p>
      </div>

      <div className="mt-auto pt-6">
        <div className="card-static p-4 dot-grid-subtle">
          <p className="tag mb-2">// FUN FACT</p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            This feed lives on the blockchain forever. Your message is now immortal.
          </p>
        </div>
      </div>
    </aside>
  )
}
