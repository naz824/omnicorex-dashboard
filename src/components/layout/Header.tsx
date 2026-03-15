import { Bell, Search, User, Database, Wifi } from 'lucide-react'
import { useState, useEffect } from 'react'
import { isSupabaseConfigured } from '@/lib/supabase'

interface HeaderProps {
  title: string
  subtitle?: string
  pendingApprovals: number
}

export default function Header({ title, subtitle, pendingApprovals }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const liveMode = isSupabaseConfigured()

  // ⌘K / Ctrl+K keyboard shortcut to open search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true) }
      if (e.key === 'Escape') setSearchOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-lg font-semibold text-white">{title}</h1>
          {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
        </div>
        {/* Data mode indicator */}
        <div className={`ml-2 flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${liveMode ? 'bg-emerald-400/10 text-emerald-400' : 'bg-amber-400/10 text-amber-400'}`}>
          {liveMode ? <Wifi className="h-3 w-3" /> : <Database className="h-3 w-3" />}
          {liveMode ? 'Live' : 'Demo'}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        {searchOpen ? (
          <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search leads, projects..."
              className="w-48 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
              autoFocus
              onBlur={() => setSearchOpen(false)}
              aria-label="Search"
            />
          </div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-sm text-slate-400 hover:border-slate-600 hover:text-slate-300"
            aria-label="Open search"
          >
            <Search className="h-4 w-4" />
            <span className="hidden md:inline">Search...</span>
            <kbd className="hidden rounded border border-slate-600 px-1.5 text-xs text-slate-500 md:inline">⌘K</kbd>
          </button>
        )}

        {/* Notifications */}
        <button
          className="relative rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          aria-label={`Notifications${pendingApprovals > 0 ? `, ${pendingApprovals} pending` : ''}`}
        >
          <Bell className="h-5 w-5" />
          {pendingApprovals > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
              {pendingApprovals}
            </span>
          )}
        </button>

        {/* Profile */}
        <button className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-800" aria-label="User menu">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500">
            <User className="h-4 w-4 text-slate-950" />
          </div>
          <span className="hidden text-sm font-medium text-slate-300 md:inline">Nasir</span>
        </button>
      </div>
    </header>
  )
}
