import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

interface FloatingButtonProps {
  onClick: () => void
}

export default function FloatingButton({ onClick }: FloatingButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.3 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-20 right-4 md:right-8 z-50 w-12 h-12 rounded-2xl flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, rgba(255,123,114,0.2), rgba(210,180,255,0.15))',
        border: '1.5px solid rgba(255,123,114,0.35)',
        boxShadow: '0 4px 20px rgba(255,123,114,0.15), 0 0 30px rgba(210,180,255,0.08)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <Heart size={20} className="text-[var(--coral)]" />
      {/* Pulse ring */}
      <div
        className="absolute inset-0 rounded-2xl animate-ping"
        style={{
          background: 'rgba(255,123,114,0.1)',
          animationDuration: '2s',
        }}
      />
    </motion.button>
  )
}
