import { useMemo } from 'react'

/* ============================================================
   GridBackground — Nothing-style OLED canvas.
   Pure black, dot-matrix grid, faint scanline, signal ticks.
   Replaces the old cosmic/ambient purple backgrounds.
   ============================================================ */
export default function GridBackground() {
  // a few randomly placed "signal" ticks that glow faintly
  const ticks = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        id: i,
        left: `${8 + Math.random() * 84}%`,
        top: `${8 + Math.random() * 84}%`,
        delay: Math.random() * 6,
        dur: 3 + Math.random() * 4,
      })),
    []
  )

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" style={{ background: '#000' }}>
      {/* fine dot-matrix grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      {/* coarser anchor grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)',
          backgroundSize: '120px 120px',
        }}
      />

      {/* top + bottom vignette so content floats on pure black */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 120% 80% at 50% -10%, transparent 40%, rgba(0,0,0,0.85) 100%)',
        }}
      />

      {/* corner registration marks (Nothing engineering detail) */}
      {[
        { top: 16, left: 16 },
        { top: 16, right: 16 },
        { bottom: 16, left: 16 },
        { bottom: 16, right: 16 },
      ].map((pos, i) => (
        <div key={i} className="absolute" style={{ ...pos, width: 10, height: 10, opacity: 0.25 }}>
          <div className="absolute" style={{ top: '50%', left: 0, width: '100%', height: 1, background: '#555' }} />
          <div className="absolute" style={{ left: '50%', top: 0, height: '100%', width: 1, background: '#555' }} />
        </div>
      ))}

      {/* faint signal ticks */}
      {ticks.map((t) => (
        <div
          key={t.id}
          className="absolute"
          style={{
            left: t.left,
            top: t.top,
            width: 3,
            height: 3,
            background: 'var(--signal)',
            opacity: 0.35,
            animation: `glyph-scan ${t.dur}s var(--ease) ${t.delay}s infinite`,
          }}
        />
      ))}

      {/* moving scanline */}
      <div
        className="absolute left-0 right-0"
        style={{
          height: 140,
          background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.018), transparent)',
          animation: 'scanline 9s linear infinite',
        }}
      />
      <style>{`@keyframes scanline { 0% { top: -140px } 100% { top: 100% } }`}</style>
    </div>
  )
}
