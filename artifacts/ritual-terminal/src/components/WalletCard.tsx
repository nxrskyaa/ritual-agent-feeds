import { useWalletAddress } from '@/hooks/useViemClient'
import { truncateAddress } from '@/lib/utils'
import { Wallet, LogOut, Loader2 } from 'lucide-react'

interface WalletCardProps {
  className?: string
}

export default function WalletCard({ className = '' }: WalletCardProps) {
  const { address, isConnected, isConnecting, connect, disconnect } = useWalletAddress()

  if (!isConnected || !address) {
    return (
      <div className={`card-static p-5 ${className}`}>
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-1.5 h-1.5 rounded-full ${isConnecting ? 'animate-pulse' : ''}`} style={{ background: isConnecting ? 'var(--signal)' : 'var(--ink-tertiary)' }} />
          <p className="tag">{isConnecting ? 'CONNECTING…' : 'OFFLINE'}</p>
        </div>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          Connect your wallet to drop messages onchain
        </p>
        <button
          onClick={connect}
          disabled={isConnecting}
          className="btn-shiny w-full"
        >
          {isConnecting ? (
            <><Loader2 size={15} className="animate-spin" /> CONNECTING…</>
          ) : (
            <><Wallet size={15} /> CONNECT WALLET</>
          )}
        </button>
      </div>
    )
  }

  return (
    <div className={`card-static p-5 ${className}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 flex items-center justify-center text-sm font-bold font-mono" style={{ background: 'var(--surface-2)', color: 'var(--ink-display)', border: '1px solid var(--line-strong)', borderRadius: 'var(--radius)' }}>
          {address.slice(2, 4).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="tag truncate">{truncateAddress(address)}</p>
        </div>
        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--signal)' }} />
      </div>
      <div className="flex items-center gap-1.5 mb-4">
        <span className="font-mono text-[10px]" style={{ color: 'var(--signal)' }}>◇</span>
        <p className="tag" style={{ color: 'var(--ink-secondary)' }}>Ritual Testnet</p>
      </div>
      <button onClick={disconnect} className="btn-ghost w-full flex items-center justify-center gap-1.5">
        <LogOut size={13} />
        DISCONNECT
      </button>
    </div>
  )
}

export function ConnectButton({ className = '' }: { className?: string }) {
  const { isConnected, isConnecting, connect, address } = useWalletAddress()

  if (isConnected && address) {
    return (
      <div className={`flex items-center gap-2 glass rounded-full px-3 py-1.5 ${className}`}>
        <div className="w-4 h-4" style={{ background: 'var(--surface-2)', border: '1px solid var(--line-strong)', borderRadius: 3 }} />
        <span className="tag">{truncateAddress(address)}</span>
        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--signal)' }} />
      </div>
    )
  }

  return (
    <button onClick={connect} disabled={isConnecting} className={`btn-shiny ${className}`} style={{ minHeight: 34, padding: '0.4rem 1rem' }}>
      {isConnecting ? (
        <><Loader2 size={13} className="animate-spin" /> CONNECTING…</>
      ) : (
        <><Wallet size={13} /> CONNECT</>
      )}
    </button>
  )
}
