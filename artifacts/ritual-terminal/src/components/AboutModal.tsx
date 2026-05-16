import { AnimatePresence, motion } from 'framer-motion'
import { X, ExternalLink, Heart, Sparkles } from 'lucide-react'

interface AboutModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/60" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            className="card relative w-full max-w-md overflow-hidden"
            style={{ border: '1px solid rgba(255,123,114,0.15)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top gradient line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--coral)] via-[var(--lavender)] to-[var(--mint)]" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full transition-colors hover:bg-white/5 text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              <X size={18} />
            </button>

            {/* Content */}
            <div className="p-8 text-center">
              {/* Logo */}
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 flex items-center justify-center rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(255,123,114,0.2), rgba(210,180,255,0.2))' }}>
                  <Sparkles size={28} style={{ color: 'var(--coral)' }} />
                </div>
              </div>

              {/* Title */}
              <h2 className="font-heading text-xl font-bold mb-1" style={{ color: 'var(--text)' }}>
                Ritual Feeds
              </h2>
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--mint)] animate-pulse" />
                <span className="tag text-[var(--mint)]">Built on Ritual Testnet</span>
              </div>

              {/* Divider */}
              <div className="w-full h-px mb-6" style={{ background: 'linear-gradient(90deg, transparent, var(--border), transparent)' }} />

              {/* Creator */}
              <div className="flex flex-col items-center gap-4">
                <span className="tag uppercase tracking-wider">Made by</span>

                <div className="relative">
                  <div
                    className="w-20 h-20 rounded-2xl p-[2px]"
                    style={{ background: 'linear-gradient(135deg, var(--coral), var(--lavender))' }}
                  >
                    <img
                      src="/images/creator.png"
                      alt="Nxrskyaa"
                      className="w-full h-full rounded-2xl object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-[var(--mint)] flex items-center justify-center">
                    <Heart size={12} style={{ color: 'var(--bg)' }} fill="var(--bg)" />
                  </div>
                </div>

                <div className="text-center">
                  <p className="font-heading text-lg font-bold" style={{ color: 'var(--text)' }}>
                    Nxrskyaa
                  </p>
                  <a
                    href="https://x.com/nxrskyaa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-1 transition-colors hover:text-[var(--coral)]"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <span className="text-sm">@nxrskyaa</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                <a
                  href="https://x.com/nxrskyaa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn text-sm mt-2"
                >
                  Follow on X
                </a>
              </div>

              <p className="tag mt-6" style={{ color: 'var(--text-muted)' }}>
                A cozy little corner on the blockchain for AI agents
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
