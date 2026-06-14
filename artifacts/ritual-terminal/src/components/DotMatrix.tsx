import { useEffect, useMemo, useState } from 'react'

/* ============================================================
   DotMatrix — renders text as a 5x7 dot-matrix glyph grid.
   The signature motif: the site's name lit dot-by-dot.
   ============================================================ */

// 5 wide x 7 tall. Each string row = 5 chars ('1' lit, '0' off).
const FONT: Record<string, string[]> = {
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
  C: ['01111', '10000', '10000', '10000', '10000', '10000', '01111'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
  G: ['01111', '10000', '10000', '10111', '10001', '10001', '01111'],
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  J: ['00111', '00010', '00010', '00010', '00010', '10010', '01100'],
  K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
  Q: ['01110', '10001', '10001', '10001', '10101', '10010', '01101'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  V: ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
  W: ['10001', '10001', '10001', '10101', '10101', '11011', '10001'],
  X: ['10001', '10001', '01010', '00100', '01010', '10001', '10001'],
  Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
  Z: ['11111', '00001', '00010', '00100', '01000', '10000', '11111'],
  '0': ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
  '1': ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
  '2': ['01110', '10001', '00001', '00110', '01000', '10000', '11111'],
  '3': ['11111', '00010', '00100', '00010', '00001', '10001', '01110'],
  '4': ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
  '5': ['11111', '10000', '11110', '00001', '00001', '10001', '01110'],
  '6': ['00110', '01000', '10000', '11110', '10001', '10001', '01110'],
  '7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  '8': ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
  '9': ['01110', '10001', '10001', '01111', '00001', '00010', '01100'],
  ':': ['00000', '00100', '00100', '00000', '00100', '00100', '00000'],
  '.': ['00000', '00000', '00000', '00000', '00000', '01100', '01100'],
  '-': ['00000', '00000', '00000', '11111', '00000', '00000', '00000'],
  '/': ['00001', '00010', '00010', '00100', '01000', '01000', '10000'],
  ' ': ['00000', '00000', '00000', '00000', '00000', '00000', '00000'],
}

interface DotMatrixProps {
  text: string
  /** dot size in px */
  cell?: number
  /** gap between dots in px */
  gap?: number
  className?: string
  /** lit dot color */
  color?: string
  /** unlit dot color */
  off?: string
  /** stagger-reveal the dots on mount (slam-in) */
  animate?: boolean
  /** keep a slow scan shimmer running */
  scan?: boolean
}

export default function DotMatrix({
  text,
  cell = 6,
  gap = 2,
  className = '',
  color = 'var(--ink-display)',
  off = 'var(--line)',
  animate = true,
  scan = false,
}: DotMatrixProps) {
  const chars = text.toUpperCase().split('')
  const [revealed, setRevealed] = useState(!animate)

  useEffect(() => {
    if (!animate) return
    const t = setTimeout(() => setRevealed(true), 40)
    return () => clearTimeout(t)
  }, [animate])

  const step = cell + gap

  return (
    <div className={`inline-flex items-start ${className}`} style={{ gap: step }} aria-label={text} role="img">
      {chars.map((ch, ci) => {
        const glyph = FONT[ch] ?? FONT[' ']
        return (
          <div
            key={ci}
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(5, ${cell}px)`,
              gridTemplateRows: `repeat(7, ${cell}px)`,
              gap: `${gap}px`,
            }}
          >
            {glyph.flatMap((row, ri) =>
              row.split('').map((bit, bi) => {
                const lit = bit === '1'
                const delay = animate ? (ci * 60 + (ri + bi) * 14) : 0
                return (
                  <span
                    key={`${ri}-${bi}`}
                    style={{
                      width: cell,
                      height: cell,
                      borderRadius: '50%',
                      background: lit ? color : off,
                      opacity: lit ? (revealed ? 1 : 0) : 0.5,
                      transform: revealed ? 'scale(1)' : 'scale(0.3)',
                      transition: `opacity 0.32s var(--ease) ${delay}ms, transform 0.32s var(--ease) ${delay}ms`,
                      animation: lit && scan ? `glyph-scan 3.2s var(--ease) ${(ci * 5 + ri + bi) * 60}ms infinite` : undefined,
                    }}
                  />
                )
              })
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ---------- Live dot-matrix clock (nullframe-style telemetry) ---------- */
export function DotMatrixClock({ cell = 4, gap = 1 }: { cell?: number; gap?: number }) {
  const [time, setTime] = useState(() => fmt(new Date()))
  useEffect(() => {
    const id = setInterval(() => setTime(fmt(new Date())), 1000)
    return () => clearInterval(id)
  }, [])
  return <DotMatrix text={time} cell={cell} gap={gap} animate={false} color="var(--ink-display)" off="var(--line)" />
}

function fmt(d: Date) {
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}
