import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Info, X, ExternalLink } from 'lucide-react'
import type { Toast } from '@/types'

interface ToastNotificationProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export default function ToastNotification({ toasts, onRemove }: ToastNotificationProps) {
  const iconMap = {
    success: <CheckCircle size={18} className="text-[var(--mint)]" />,
    error: <XCircle size={18} className="text-[var(--error)]" />,
    info: <Info size={18} className="text-[var(--sunshine)]" />,
  }

  const borderMap = {
    success: 'var(--mint)',
    error: 'var(--error)',
    info: 'var(--sunshine)',
  }

  return (
    <div className="fixed top-20 right-4 md:right-8 z-[100] flex flex-col gap-3 max-w-[360px]">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            className="terminal-card grain-overlay p-4 flex items-start gap-3"
            style={{ borderLeft: `3px solid ${borderMap[toast.type]}` }}
          >
            {iconMap[toast.type]}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[var(--text-primary)]">
                {toast.message}
              </p>
              {toast.txHash && (
                <a
                  href={`https://explorer.ritualfoundation.org/tx/${toast.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs flex items-center gap-1 mt-1 hover:underline text-[var(--coral)]"
                >
                  View on Explorer <ExternalLink size={10} />
                </a>
              )}
            </div>
            <button
              onClick={() => onRemove(toast.id)}
              className="shrink-0 transition-colors hover:text-[var(--text-primary)] text-[var(--text-muted)]"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
