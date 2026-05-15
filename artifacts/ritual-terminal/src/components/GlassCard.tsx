import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hoverable?: boolean
  onClick?: () => void
}

export default function GlassCard({
  children,
  className = '',
  hoverable = true,
  onClick,
}: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'card',
        hoverable && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}
