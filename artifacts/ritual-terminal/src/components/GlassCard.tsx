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

  const borderColors = {
    coral: 'rgba(255,123,114,0.25)',
    mint: 'rgba(126,231,135,0.25)',
    lavender: 'rgba(210,180,255,0.25)',
    sunshine: 'rgba(255,209,102,0.25)',
    default: 'rgba(255,123,114,0.15)',
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className={cn(
        'relative rounded-2xl transition-all duration-500',
        hoverable && 'cursor-pointer',
        className
      )}
      style={
        {
          '--mouse-x': '50%',
          '--mouse-y': '50%',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
          border: `1px solid ${borderColors[color]}`,
          boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)',
        } as React.CSSProperties
      }
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.borderColor = color === 'coral' ? 'rgba(255,123,114,0.4)' : color === 'mint' ? 'rgba(126,231,135,0.4)' : color === 'lavender' ? 'rgba(210,180,255,0.4)' : 'rgba(255,209,102,0.4)' || 'rgba(255,123,114,0.35)'
        el.style.transform = 'translateY(-3px) scale(1.01)'
        el.style.boxShadow = `0 16px 48px rgba(0,0,0,0.25), 0 0 40px ${glowColors[color]}, inset 0 1px 0 rgba(255,255,255,0.06)`
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.borderColor = borderColors[color]
        el.style.transform = 'translateY(0) scale(1)'
        el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)'
      }}
    >
      {/* Spotlight glow - mouse tracking */}
      {hoverable && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500 opacity-0 hover:opacity-100"
          style={{
            background: `radial-gradient(circle at var(--mouse-x) var(--mouse-y), ${glowColors[color]} 0%, transparent 60%)`,
          }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
