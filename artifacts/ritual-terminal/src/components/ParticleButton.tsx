import { useState, useCallback } from 'react'

interface ParticleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'success' | 'ghost'
}

const particles = [
  { tx: -30, ty: -25, color: '#8b5cf6', size: 5, delay: 0, dur: 0.6 },
  { tx: 25, ty: -30, color: '#22d3ee', size: 4, delay: 0.05, dur: 0.7 },
  { tx: 35, ty: -10, color: '#f472b6', size: 3, delay: 0.1, dur: 0.5 },
  { tx: -25, ty: 15, color: '#a78bfa', size: 4, delay: 0.08, dur: 0.65 },
  { tx: 20, ty: 20, color: '#22d3ee', size: 3, delay: 0.12, dur: 0.55 },
  { tx: -35, ty: -5, color: '#f472b6', size: 5, delay: 0.03, dur: 0.75 },
  { tx: 5, ty: -35, color: '#8b5cf6', size: 3, delay: 0.15, dur: 0.5 },
  { tx: -15, ty: -30, color: '#a78bfa', size: 4, delay: 0.07, dur: 0.6 },
]

export default function ParticleButton({ children, variant = 'primary', className = '', ...props }: ParticleButtonProps) {
  const [hovered, setHovered] = useState(false)
  const [burst, setBurst] = useState(false)

  const handleMouseEnter = useCallback(() => setHovered(true), [])
  const handleMouseLeave = useCallback(() => {
    setHovered(false)
    setBurst(false)
  }, [])
  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    setBurst(true)
    setTimeout(() => setBurst(false), 600)
    props.onClick?.(e)
  }, [props])

  const baseClass = variant === 'primary'
    ? 'btn-playful'
    : variant === 'success'
    ? 'btn-playful btn-playful-success'
    : 'btn-playful btn-playful-ghost'

  return (
    <span
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        {...props}
        onClick={handleClick}
        className={`${baseClass} ${className}`}
      >
        {children}
      </button>

      {/* Burst particles on click — actual DOM elements, pointer-events:none */}
      {burst && particles.map((p, i) => (
        <span
          key={`burst-${i}`}
          className="particle-dot"
          style={{
            left: '50%',
            top: '50%',
            width: p.size,
            height: p.size,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            ['--tx' as string]: `${p.tx}px`,
            ['--ty' as string]: `${p.ty}px`,
          }}
        />
      ))}

      {/* Hover glow ring — actual DOM element */}
      {hovered && (
        <span
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow: '0 0 20px rgba(139,92,246,0.3), 0 0 40px rgba(139,92,246,0.15)',
            animation: 'glow-ring-pulse 1.5s ease-in-out infinite',
          }}
        />
      )}
    </span>
  )
}
