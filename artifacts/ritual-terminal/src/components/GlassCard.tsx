import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
}

export default function GlassCard({ children, className = '', style, onClick }: GlassCardProps) {
  return (
    <div onClick={onClick} className={cn('card', className)} style={style}>
      {children}
    </div>
  )
}
