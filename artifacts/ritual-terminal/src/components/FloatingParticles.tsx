export default function FloatingParticles() {
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 10,
    duration: Math.random() * 8 + 6,
    color: ['var(--violet)', 'var(--cyan)', 'var(--purple)', 'var(--pink)'][Math.floor(Math.random() * 4)],
    shape: Math.random() > 0.7 ? 'star' : 'circle',
  }))

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
            opacity: p.shape === 'star' ? 0.25 : 0.2,
            boxShadow: p.shape === 'star' ? `0 0 ${p.size * 3}px ${p.color}` : `0 0 ${p.size * 2}px ${p.color}`,
            animation: `float-particle ${p.duration}s ease-in-out ${p.delay}s infinite`,
            transform: p.shape === 'star' ? 'rotate(45deg)' : undefined,
          }}
        />
      ))}
    </div>
  )
}
