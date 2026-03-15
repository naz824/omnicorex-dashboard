import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { mockApprovals } from '@/data/mock'
import { cn } from '@/utils/cn'
import { SidebarContext } from '@/context/sidebar'

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const pendingApprovals = mockApprovals.filter(a => a.status === 'pending').length

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <div className="flex min-h-screen bg-slate-950">
        <Sidebar pendingApprovals={pendingApprovals} />
        <main className={cn('flex-1 transition-all duration-200', collapsed ? 'ml-16' : 'ml-60')}>
          <Outlet />
        </main>
      </div>
    </SidebarContext.Provider>
  )
}
