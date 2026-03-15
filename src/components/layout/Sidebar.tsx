import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, Calendar, FolderKanban, Bot, ShieldCheck, BarChart3, Settings, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/utils/cn'

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, Users, Calendar, FolderKanban, Bot, ShieldCheck, BarChart3, Settings,
}

const navItems = [
  { title: 'Overview', href: '/', icon: 'LayoutDashboard' },
  { title: 'Leads', href: '/leads', icon: 'Users' },
  { title: 'Bookings', href: '/bookings', icon: 'Calendar' },
  { title: 'Projects', href: '/projects', icon: 'FolderKanban' },
  { title: 'Agents', href: '/agents', icon: 'Bot' },
  { title: 'Approvals', href: '/approvals', icon: 'ShieldCheck' },
  { title: 'Analytics', href: '/analytics', icon: 'BarChart3' },
  { title: 'Settings', href: '/settings', icon: 'Settings' },
]

interface SidebarProps {
  pendingApprovals: number
}

export default function Sidebar({ pendingApprovals }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-slate-800 bg-slate-950 transition-all duration-200',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-slate-800 px-4">
        {!collapsed && (
          <button onClick={() => navigate('/')} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500">
              <span className="text-sm font-bold text-slate-950">OX</span>
            </div>
            <span className="text-sm font-semibold text-white">OmnicoreX</span>
          </button>
        )}
        {collapsed && (
          <button onClick={() => navigate('/')} className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500">
            <span className="text-sm font-bold text-slate-950">OX</span>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon]
          const isActive = location.pathname === item.href
          const badge = item.href === '/approvals' ? pendingApprovals : undefined

          return (
            <button
              key={item.href}
              onClick={() => navigate(item.href)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-cyan-400/10 text-cyan-400'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              {Icon && <Icon className="h-5 w-5 shrink-0" />}
              {!collapsed && <span className="truncate">{item.title}</span>}
              {!collapsed && badge !== undefined && badge > 0 && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-xs font-semibold text-white">
                  {badge}
                </span>
              )}
              {collapsed && badge !== undefined && badge > 0 && (
                <span className="absolute right-1 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                  {badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-slate-800 p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!collapsed && <span className="ml-2 text-sm">Collapse</span>}
        </button>
      </div>
    </aside>
  )
}
