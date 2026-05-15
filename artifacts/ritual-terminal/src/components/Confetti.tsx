import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ConfettiPiece {
  id: number
  x: number
  color: string
  delay: number
  duration: number
  rotation: number
}

const colors = ['#ff7b72', '#7ee787', '#d2b4ff', '#ffd166', '#ff9ecd', '#7ecfff']

let confettiId = 0

export function useConfetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  const burst = () => {
    const newPieces: ConfettiPiece[] = []
    for (let i = 0; i < 40; i++) {
      newPieces.push({
        id: confettiId++,
        x: 20 + Math.random() * 60,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.3,
        duration: 0.8 + Math.random() * 0.8,
        rotation: Math.random() * 360,
      })
    }
    setPieces(newPieces)
    setTimeout(() => setPieces([]), 2500)
  }

  return { pieces, burst }
}

export default function Confetti({ pieces }: { pieces: ConfettiPiece[] }) {
  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {pieces.map((piece) => (
          <motion.div
            key={piece.id}
            initial={{
              x: `${piece.x}vw`,
              y: '-10vh',
              rotate: 0,
              opacity: 1,
              scale: 1,
            }}
            animate={{
              y: '110vh',
              rotate: piece.rotation + 720,
              opacity: [1, 1, 0],
              scale: [1, 1, 0.5],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: piece.duration,
              delay: piece.delay,
              ease: 'easeIn',
            }}
            className="absolute top-0"
            style={{
              width: 8 + Math.random() * 6,
              height: 8 + Math.random() * 6,
              backgroundColor: piece.color,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
