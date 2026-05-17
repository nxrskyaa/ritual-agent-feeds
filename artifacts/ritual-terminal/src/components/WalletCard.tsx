import { useWalletAddress } from '@/hooks/useViemClient'
import { getAddressGradient, truncateAddress } from '@/lib/utils'
import { Wallet, LogOut, Zap, Loader2 } from 'lucide-react'

interface WalletCardProps {
  className?: string
}

export default function WalletCard({ className = '' }: WalletCardProps) {
  const { address, isConnected, isConnecting, connect, disconnect } = useWalletAddress()

  if (!isConnected || !address) {
    return (
      <div className={`card p-5 ${className}`}>
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-2 h-2 rounded-full ${isConnecting ? 'animate-pulse' : ''}`} style={{ background: isConnecting ? 'var(--violet)' : 'var(--text-muted)' }} />
          <p className="tag">{isConnecting ? 'Connecting...' : 'Offline'}</p>
        </div>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          Connect your wallet to drop messages onchain
        </p>
        <button
          onClick={connect}
          disabled={isConnecting}
          className="btn w-full text-sm py-2.5"
        >
          {isConnecting ? (
            <><Loader2 size={15} className="animate-spin" /> Connecting...</>
          ) : (
            <><Wallet size={15} /> Connect Wallet</>
          )}
        </button>
      </div>
    )
  }

  return (
    <div className={`card p-5 ${className}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold" style={{ background: getAddressGradient(address), color: '#fff' }}>
          {address.slice(2, 4).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="tag truncate">{truncateAddress(address)}</p>
        </div>
        <div className="w-2 h-2 rounded-full bg-[var(--cyan)] animate-pulse" />
      </div>
      <div className="flex items-center gap-1.5 mb-4">
        <Zap size={12} style={{ color: 'var(--pink)' }} className="animate-bounce-soft" />
        <p className="tag" style={{ color: 'var(--cyan)' }}>Ritual Testnet</p>
      </div>
      <button onClick={disconnect} className="btn-ghost w-full text-xs py-2 flex items-center justify-center gap-1.5 shake">
        <LogOut size={13} />
        Disconnect
      </button>
    </div>
  )
}

export function ConnectButton({ className = '' }: { className?: string }) {
  const { isConnected, isConnecting, connect, address } = useWalletAddress()

  if (isConnected && address) {
    return (
      <div className={`flex items-center gap-2 glass rounded-full px-3 py-1.5 ${className}`}>
        <div className="w-5 h-5 rounded-lg" style={{ background: getAddressGradient(address) }} />
        <span className="tag">{truncateAddress(address)}</span>
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)] animate-pulse" />
      </div>
    )
  }

  return (
    <button onClick={connect} disabled={isConnecting} className={`btn text-xs py-1.5 px-3 ${className}`}>
      {isConnecting ? (
        <><Loader2 size={13} className="animate-spin" /> Connecting...</>
      ) : (
        <><Wallet size={13} /> Connect</>
      )}
    </button>
  )
}
