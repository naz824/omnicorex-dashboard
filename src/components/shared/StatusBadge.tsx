import { cn } from '@/utils/cn'

interface StatusBadgeProps {
  label: string
  color: string
  bg?: string
  size?: 'sm' | 'md'
}

export default function StatusBadge({ label, color, bg, size = 'sm' }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        color,
        bg ?? 'bg-slate-800',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      )}
    >
      {label}
    </span>
  )
}
