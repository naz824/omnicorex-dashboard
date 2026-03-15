import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { mockApprovals } from '@/data/mock'

export default function DashboardLayout() {
  const pendingApprovals = mockApprovals.filter(a => a.status === 'pending').length

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar pendingApprovals={pendingApprovals} />
      <main className="ml-60 flex-1">
        <Outlet />
      </main>
    </div>
  )
}
