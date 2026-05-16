import { motion } from 'framer-motion'

interface ScrollRevealProps {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}

export default function ScrollReveal({ children, delay = 0, direction = 'up' }: ScrollRevealProps) {
  const distance = direction === 'up' || direction === 'down' ? 16 : 12
  const y = direction === 'up' ? distance : direction === 'down' ? -distance : 0
  const x = direction === 'left' ? distance : direction === 'right' ? -distance : 0

  return (
    <motion.div
      initial={{ opacity: 0.92, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
