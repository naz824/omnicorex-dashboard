import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/utils/cn'

interface KPICardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: React.ReactNode
}

export default function KPICard({ title, value, change, changeLabel, icon }: KPICardProps) {
  const isPositive = change !== undefined && change > 0
  const isNegative = change !== undefined && change < 0
  const isNeutral = change !== undefined && change === 0

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-slate-400">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-slate-400">
          {icon}
        </div>
      </div>
      {change !== undefined && (
        <div className="mt-3 flex items-center gap-1.5">
          {isPositive && <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />}
          {isNegative && <TrendingDown className="h-3.5 w-3.5 text-rose-400" />}
          {isNeutral && <Minus className="h-3.5 w-3.5 text-slate-400" />}
          <span
            className={cn(
              'text-xs font-medium',
              isPositive && 'text-emerald-400',
              isNegative && 'text-rose-400',
              isNeutral && 'text-slate-400'
            )}
          >
            {isPositive && '+'}
            {change}%
          </span>
          {changeLabel && <span className="text-xs text-slate-500">{changeLabel}</span>}
        </div>
      )}
    </div>
  )
}
