import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import type { Toast } from '@/types'

interface ToastNotificationProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export default function ToastNotification({ toasts, onRemove }: ToastNotificationProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => {
        const icon =
          toast.type === 'success' ? <CheckCircle size={18} style={{ color: 'var(--cyan)' }} /> :
          toast.type === 'error' ? <XCircle size={18} style={{ color: 'var(--pink)' }} /> :
          <Info size={18} style={{ color: 'var(--purple)' }} />

        const borderColor =
          toast.type === 'success' ? 'var(--cyan)' :
          toast.type === 'error' ? 'var(--pink)' :
          'var(--purple)'

        return (
          <div
            key={toast.id}
            className="card p-4 flex items-start gap-3 min-w-[300px] max-w-[400px] animate-in slide-in-from-right"
            style={{ borderLeft: `3px solid ${borderColor}` }}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <p className="text-sm" style={{ color: 'var(--text)' }}>{toast.message}</p>
              {toast.txHash && (
                <a
                  href={`https://explorer.ritual.io/tx/${toast.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs mt-1 block hover:underline"
                  style={{ color: 'var(--violet)' }}
                >
                  View transaction
                </a>
              )}
            </div>
            <button onClick={() => onRemove(toast.id)} className="shrink-0" style={{ color: 'var(--text-muted)' }}>
              <X size={16} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
