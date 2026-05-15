import { useEffect, useRef } from 'react'

function PixelParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const particles: Array<{
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      opacity: number
      life: number
      maxLife: number
    }> = []

    const colors = [
      'rgba(255,123,114,',
      'rgba(210,180,255,',
      'rgba(126,231,135,',
      'rgba(255,209,102,',
    ]

    function resize() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    function spawnParticle() {
      if (particles.length > 60) return
      const colorBase = colors[Math.floor(Math.random() * colors.length)]
      particles.push({
        x: Math.random() * (canvas?.width || 0),
        y: Math.random() * (canvas?.height || 0),
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        color: colorBase,
        opacity: 0,
        life: 0,
        maxLife: 200 + Math.random() * 300,
      })
    }

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (Math.random() < 0.05) spawnParticle()

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life++
        p.x += p.speedX
        p.y += p.speedY

        const lifeRatio = p.life / p.maxLife
        if (lifeRatio < 0.1) {
          p.opacity = lifeRatio / 0.1
        } else if (lifeRatio > 0.8) {
          p.opacity = (1 - lifeRatio) / 0.2
        } else {
          p.opacity = 1
        }

        ctx.fillStyle = p.color + (p.opacity * 0.6) + ')'
        ctx.fillRect(p.x, p.y, p.size, p.size)

        if (p.life >= p.maxLife) {
          particles.splice(i, 1)
        }
      }

      animId = requestAnimationFrame(animate)
    }

    resize()
    window.addEventListener('resize', resize)
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.8 }}
    />
  )
}

export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Base warm dark */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #141428 0%, #1a1a2e 50%, #141428 100%)',
        }}
      />

      {/* Dot grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Warm ambient glow top */}
      <div
        className="absolute top-0 left-0 right-0 h-[50vh]"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,123,114,0.08) 0%, transparent 60%)',
        }}
      />

      {/* Lavender ambient glow bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[40vh]"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(210,180,255,0.06) 0%, transparent 60%)',
        }}
      />

      {/* Floating pixel particles */}
      <PixelParticles />

      {/* Subtle scanlines */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }}
      />

      {/* Corner decorations */}
      <div className="absolute top-6 left-6 w-16 h-16 opacity-20">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[var(--coral)] to-transparent" />
        <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-[var(--coral)] to-transparent" />
      </div>
      <div className="absolute top-6 right-6 w-16 h-16 opacity-20">
        <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-l from-[var(--lavender)] to-transparent" />
        <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-[var(--lavender)] to-transparent" />
      </div>
      <div className="absolute bottom-6 left-6 w-16 h-16 opacity-20">
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-[var(--mint)] to-transparent" />
        <div className="absolute bottom-0 left-0 w-[1px] h-full bg-gradient-to-t from-[var(--mint)] to-transparent" />
      </div>
      <div className="absolute bottom-6 right-6 w-16 h-16 opacity-20">
        <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-l from-[var(--sunshine)] to-transparent" />
        <div className="absolute bottom-0 right-0 w-[1px] h-full bg-gradient-to-t from-[var(--sunshine)] to-transparent" />
      </div>
    </div>
  )
}
