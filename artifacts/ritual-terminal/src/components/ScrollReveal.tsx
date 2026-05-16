import type { ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  delay?: number
}

// Simplified — no framer-motion, no opacity trap
export default function ScrollReveal({ children }: ScrollRevealProps) {
  return <div>{children}</div>
}
