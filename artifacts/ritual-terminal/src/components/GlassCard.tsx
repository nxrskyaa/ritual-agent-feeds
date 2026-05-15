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
    coral: 'rgba(255,123,114,0.15)',
    mint: 'rgba(126,231,135,0.15)',
    lavender: 'rgba(210,180,255,0.15)',
    sunshine: 'rgba(255,209,102,0.15)',
    default: 'rgba(255,123,114,0.1)',
  }

  const borderColors = {
    coral: 'rgba(255,123,114,0.3)',
    mint: 'rgba(126,231,135,0.3)',
    lavender: 'rgba(210,180,255,0.3)',
    sunshine: 'rgba(255,209,102,0.3)',
    default: 'rgba(255,123,114,0.2)',
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={hoverable ? handleMouseMove : undefined}
      onClick={onClick}
      className={cn(
        'relative overflow-hidden rounded-2xl transition-all duration-500',
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
      {/* Animated gradient border */}
      <div 
        className="absolute -inset-[1px] rounded-2xl opacity-0 transition-opacity duration-500"
        style={{
          background: `linear-gradient(90deg, ${borderColors[color]}, ${borderColors[color === 'coral' ? 'lavender' : color === 'mint' ? 'sunshine' : 'coral']}, ${borderColors[color]})`,
          backgroundSize: '200% 100%',
          animation: 'border-flow 3s linear infinite',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.opacity = '0.6'
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.opacity = '0'
        }}
      />
      
      {/* Glass background */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.01] backdrop-blur-xl" />
      
      {/* Spotlight glow */}
      {hoverable && (
        <div
          className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500"
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
      
      {/* Top highlight line */}
      <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="relative z-10">{children}</div>
    </div>
  )
}
