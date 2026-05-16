export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* Base dark */}
      <div className="absolute inset-0" style={{ background: 'var(--bg)' }} />

      {/* Violet gradient orbs — CSS only, no canvas, no mouse interaction */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full opacity-20"
        style={{
          top: '-20%',
          left: '-10%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 60%)',
          filter: 'blur(100px)',
        }}
      />
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-15"
        style={{
          top: '30%',
          right: '-15%',
          background: 'radial-gradient(circle, rgba(167,139,250,0.25) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-10"
        style={{
          bottom: '-10%',
          left: '40%',
          background: 'radial-gradient(circle, rgba(34,211,238,0.2) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Dot grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(rgba(139,92,246,0.15) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          opacity: 0.4,
        }}
      />

      {/* Subtle top gradient line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent)' }}
      />
    </div>
  )
}
