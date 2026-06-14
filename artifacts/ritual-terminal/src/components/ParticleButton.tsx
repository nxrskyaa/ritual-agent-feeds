import { useState, useCallback } from 'react'

interface ParticleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

const particles = [
  { tx: -30, ty: -25, size: 4, delay: 0, dur: 0.6 },
  { tx: 25, ty: -30, size: 3, delay: 0.05, dur: 0.7 },
  { tx: 35, ty: -10, size: 3, delay: 0.1, dur: 0.5 },
  { tx: -25, ty: 15, size: 3, delay: 0.08, dur: 0.65 },
  { tx: 20, ty: 20, size: 2, delay: 0.12, dur: 0.55 },
  { tx: -35, ty: -5, size: 4, delay: 0.03, dur: 0.75 },
  { tx: 5, ty: -35, size: 3, delay: 0.15, dur: 0.5 },
  { tx: -15, ty: -30, size: 3, delay: 0.07, dur: 0.6 },
]

export default function ParticleButton({ children, className = '', ...props }: ParticleButtonProps) {
  const [burst, setBurst] = useState(false)

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    setBurst(true)
    setTimeout(() => setBurst(false), 600)
    props.onClick?.(e)
  }, [props])

  return (
    <span className="relative inline-block">
      <button
        {...props}
        onClick={handleClick}
        className={`btn-shiny ${className}`}
      >
        {children}
      </button>

      {burst && particles.map((p, i) => (
        <span
          key={`burst-${i}`}
          className="particle-dot"
          style={{
            left: '50%',
            top: '40%',
            width: p.size,
            height: p.size,
            background: i % 3 === 0 ? 'var(--signal)' : 'var(--ink-display)',
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            ['--tx' as string]: `${p.tx}px`,
            ['--ty' as string]: `${p.ty}px`,
          }}
        />
      ))}
    </span>
  )
}
