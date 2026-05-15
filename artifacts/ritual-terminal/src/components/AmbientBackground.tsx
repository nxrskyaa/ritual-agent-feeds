import { useEffect, useRef } from 'react'

function FloatingShapes() {
  return (
    <>
      <div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          top: '-10%',
          left: '-10%',
          background: 'radial-gradient(circle, rgba(255,123,114,0.12) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'float-slow 20s ease-in-out infinite',
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          top: '40%',
          right: '-15%',
          background: 'radial-gradient(circle, rgba(210,180,255,0.1) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'float-slow 25s ease-in-out infinite reverse',
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          bottom: '-5%',
          left: '30%',
          background: 'radial-gradient(circle, rgba(126,231,135,0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'float-slow 18s ease-in-out infinite',
          animationDelay: '-5s',
        }}
      />
      <div
        className="absolute w-[350px] h-[350px] rounded-full"
        style={{
          top: '20%',
          left: '50%',
          background: 'radial-gradient(circle, rgba(255,209,102,0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'float-slow 22s ease-in-out infinite reverse',
          animationDelay: '-8s',
        }}
      />
    </>
  )
}

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      color: string
      alpha: number
      pulse: number
      pulseSpeed: number
      originalX: number
      originalY: number
    }> = []

    const colors = [
      '255,123,114',
      '210,180,255',
      '126,231,135',
      '255,209,102',
      '255,255,255',
    ]

    function resize() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    function initParticles() {
      particles.length = 0
      const count = Math.min(60, Math.floor((canvas?.width || 1000) * (canvas?.height || 800) / 20000))
      for (let i = 0; i < count; i++) {
        const x = Math.random() * (canvas?.width || 1000)
        const y = Math.random() * (canvas?.height || 800)
        particles.push({
          x,
          y,
          originalX: x,
          originalY: y,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 2 + 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.5 + 0.2,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.02 + 0.01,
        })
      }
    }

    function drawConnections() {
      if (!ctx || particles.length < 2) return
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.06
            ctx.beginPath()
            ctx.strokeStyle = `rgba(${particles[i].color},${alpha})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const mouse = mouseRef.current

      particles.forEach((p) => {
        // Mouse repel effect
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 150 && dist > 0) {
          const force = (150 - dist) / 150 * 0.5
          p.vx += (dx / dist) * force
          p.vy += (dy / dist) * force
        }

        // Return to original position slowly
        const homeDx = p.originalX - p.x
        const homeDy = p.originalY - p.y
        p.vx += homeDx * 0.001
        p.vy += homeDy * 0.001

        // Damping
        p.vx *= 0.98
        p.vy *= 0.98

        p.x += p.vx
        p.y += p.vy
        p.pulse += p.pulseSpeed

        const pulseAlpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse))
        const pulseRadius = p.radius * (0.8 + 0.2 * Math.sin(p.pulse))

        ctx.beginPath()
        ctx.arc(p.x, p.y, pulseRadius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color},${pulseAlpha})`
        ctx.fill()

        // Glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, pulseRadius * 3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color},${pulseAlpha * 0.12})`
        ctx.fill()
      })

      drawConnections()
      animId = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 }
    }

    resize()
    initParticles()
    animate()

    window.addEventListener('resize', () => {
      resize()
      initParticles()
    })
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  )
}

export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Deep base */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #080810 0%, #0c0c20 30%, #0a0a1a 60%, #080810 100%)',
        }}
      />

      {/* Animated gradient mesh */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(255,123,114,0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(210,180,255,0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(126,231,135,0.06) 0%, transparent 50%)
          `,
        }}
      />

      {/* Floating blurred orbs */}
      <FloatingShapes />

      {/* Particle network */}
      <ParticleField />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Heavy grain */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}
