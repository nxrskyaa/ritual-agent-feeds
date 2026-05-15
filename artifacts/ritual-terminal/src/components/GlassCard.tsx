import { useRef, useCallback, useState } from 'react'
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
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current || !hoverable) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    cardRef.current.style.setProperty('--mouse-x', `${x}%`)
    cardRef.current.style.setProperty('--mouse-y', `${y}%`)
  }, [hoverable])

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
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={cn(
        'relative rounded-2xl transition-all duration-500',
        hoverable && 'cursor-pointer',
        className
      )}
      style={{
        '--mouse-x': '50%',
        '--mouse-y': '50%',
      } as React.CSSProperties}
    >
      {/* Background layer */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01]" />

      {/* Animated gradient border - only visible on hover */}
      {hoverable && (
        <div
          className="absolute -inset-[1px] rounded-2xl transition-opacity duration-500 pointer-events-none"
          style={{
            opacity: isHovered ? 0.5 : 0,
            background: `linear-gradient(90deg, ${borderColors[color]}, ${borderColors[color === 'coral' ? 'lavender' : color === 'mint' ? 'sunshine' : 'coral']}, ${borderColors[color]})`,
            backgroundSize: '200% 100%',
            animation: isHovered ? 'border-flow 3s linear infinite' : 'none',
          }}
        />
      )}

      {/* Spotlight glow - only visible on hover */}
      {hoverable && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(circle at var(--mouse-x) var(--mouse-y), ${glowColors[color]} 0%, transparent 60%)`,
          }}
        />
      )}

      {/* Top highlight line */}
      <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
