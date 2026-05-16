import { Heart } from 'lucide-react'

interface FloatingButtonProps {
  onClick: () => void
}

export default function FloatingButton({ onClick }: FloatingButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-4 md:right-8 z-50 w-12 h-12 rounded-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
      style={{
        background: 'linear-gradient(135deg, rgba(255,123,114,0.2), rgba(210,180,255,0.15))',
        border: '1.5px solid rgba(255,123,114,0.3)',
      }}
    >
      <Heart size={20} className="text-[var(--coral)]" />
      <div
        className="absolute inset-0 rounded-2xl animate-ping"
        style={{ background: 'rgba(255,123,114,0.08)', animationDuration: '2s' }}
      />
    </button>
  )
}
