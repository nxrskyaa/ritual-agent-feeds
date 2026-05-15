import { useWalletAddress } from '@/hooks/useViemClient'
import { getAddressGradient, truncateAddress } from '@/lib/utils'
import { Wallet, LogOut, Zap } from 'lucide-react'

interface WalletCardProps {
  className?: string
}

export default function WalletCard({ className = '' }: WalletCardProps) {
  const { address, isConnected, connect, disconnect } = useWalletAddress()

  if (!isConnected || !address) {
    return (
      <div className={`terminal-card grain-overlay p-5 ${className}`}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-[var(--text-muted)]" />
          <p className="caption-text">Offline</p>
        </div>
        <p className="text-sm mb-4 text-[var(--text-secondary)]">
          Connect your wallet to drop messages onchain
        </p>
        <button onClick={connect} className="terminal-btn w-full text-sm py-2.5">
          <Wallet size={15} />
          Connect Wallet
        </button>
      </div>
    )
  }

  return (
    <div className={`terminal-card grain-overlay p-5 ${className}`}>
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
          style={{
            background: getAddressGradient(address),
            color: '#fff',
          }}
        >
          {address.slice(2, 4).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-mono-label text-xs truncate">{truncateAddress(address)}</p>
        </div>
        <div className="w-2 h-2 rounded-full bg-[var(--mint)] animate-pulse" />
      </div>
      <div className="flex items-center gap-1.5 mb-4">
        <Zap size={12} className="text-[var(--sunshine)]" />
        <p className="caption-text text-[var(--mint)]">Ritual Testnet</p>
      </div>
      <button
        onClick={disconnect}
        className="terminal-btn-ghost w-full text-xs py-2 flex items-center justify-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--coral)]"
      >
        <LogOut size={13} />
        Disconnect
      </button>
    </div>
  )
}

// Standalone connect button for inline use
export function ConnectButton({ className = '' }: { className?: string }) {
  const { isConnected, connect, address } = useWalletAddress()

  if (isConnected && address) {
    return (
      <div className={`flex items-center gap-2 terminal-glass rounded-full px-3 py-1.5 ${className}`}>
        <div
          className="w-5 h-5 rounded-lg"
          style={{ background: getAddressGradient(address) }}
        />
        <span className="font-mono-label text-[0.65rem] text-[var(--text-secondary)]">{truncateAddress(address)}</span>
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--mint)] animate-pulse" />
      </div>
    )
  }

  return (
    <button onClick={connect} className={`terminal-btn text-xs py-1.5 px-3 ${className}`}>
      <Wallet size={13} />
      Connect
    </button>
  )
}
