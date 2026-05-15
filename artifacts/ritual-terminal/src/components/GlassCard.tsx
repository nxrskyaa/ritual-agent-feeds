import { useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hoverable?: boolean
  color?: 'coral' | 'mint' | 'lavender' | 'sunshine' | 'default'
  onClick?: () => void
}

export default function GlassCard({
  children,
  className = '',
  hoverable = true,
  color = 'default',
  onClick,
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current || !hoverable) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    cardRef.current.style.setProperty('--mouse-x', `${x}%`)
    cardRef.current.style.setProperty('--mouse-y', `${y}%`)
  }, [hoverable])

  const glowColors = {
    coral: 'rgba(255,123,114,0.12)',
    mint: 'rgba(126,231,135,0.12)',
    lavender: 'rgba(210,180,255,0.12)',
    sunshine: 'rgba(255,209,102,0.12)',
    default: 'rgba(255,123,114,0.08)',
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className={cn(
        'rounded-2xl p-[1px] transition-all duration-300',
        hoverable && 'cursor-pointer hover:scale-[1.02] hover:-translate-y-1',
        className
      )}
      style={{
        background: `linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      <div
        className="relative rounded-2xl h-full overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget
          el.style.boxShadow = `inset 0 0 60px ${glowColors[color]}`
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget
          el.style.boxShadow = 'none'
        }}
      >
        {children}
      </div>
    </div>
  )
}
