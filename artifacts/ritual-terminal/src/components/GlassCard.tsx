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
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    cardRef.current.style.setProperty('--mouse-x', `${x}%`)
    cardRef.current.style.setProperty('--mouse-y', `${y}%`)
  }, [])

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
      onMouseMove={hoverable ? handleMouseMove : undefined}
      onClick={onClick}
      className={cn(
        'terminal-card grain-overlay relative overflow-hidden',
        hoverable && 'cursor-pointer',
        className
      )}
      style={
        hoverable
          ? {
              '--mouse-x': '50%',
              '--mouse-y': '50%',
            } as React.CSSProperties
          : undefined
      }
    >
      {hoverable && (
        <div
          className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at var(--mouse-x) var(--mouse-y), ${glowColors[color]} 0%, transparent 60%)`,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = '1'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = '0'
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
