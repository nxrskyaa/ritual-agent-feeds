import { Info } from 'lucide-react'

interface FloatingButtonProps {
  onClick: () => void
}

export default function FloatingButton({ onClick }: FloatingButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-4 md:right-8 z-50 w-12 h-12 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
      style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--line-strong)',
        borderRadius: 'var(--radius)',
      }}
    >
      <Info size={18} style={{ color: 'var(--ink-display)' }} />
      <div
        className="absolute inset-0 animate-ping"
        style={{ background: 'transparent', border: '1px solid var(--signal-dim)', borderRadius: 'var(--radius)', animationDuration: '2.5s' }}
      />
    </button>
  )
}
