import { Users, FolderKanban, ShieldCheck, DollarSign, Clock, Calendar, Bot, CheckCircle2 } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import Header from '@/components/layout/Header'
import KPICard from '@/components/shared/KPICard'
import StatusBadge from '@/components/shared/StatusBadge'
import { mockStats, mockRevenue, mockActivities, mockApprovals, mockAgents } from '@/data/mock'
import { AGENT_STATUS_CONFIG, APPROVAL_CATEGORY_CONFIG, PRIORITY_CONFIG } from '@/config/constants'
import { formatRelativeTime } from '@/utils/format'
import { cn } from '@/utils/cn'
import { useNavigate } from 'react-router-dom'

export default function OverviewScreen() {
  const navigate = useNavigate()
  const pendingApprovals = mockApprovals.filter(a => a.status === 'pending')
  const activeAgents = mockAgents.filter(a => a.status === 'working' || a.status === 'waiting_approval')

  return (
    <div className="min-h-screen">
      <Header
        title="Command Center"
        subtitle={`${activeAgents.length} agents active · ${pendingApprovals.length} approvals pending`}
        pendingApprovals={pendingApprovals.length}
      />

      <div className="space-y-6 p-6">
        {/* KPI Row */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KPICard title="Total Leads" value={mockStats.total_leads} change={33} changeLabel="vs last month" icon={<Users className="h-5 w-5" />} />
          <KPICard title="Active Projects" value={mockStats.active_projects} change={100} changeLabel="vs last month" icon={<FolderKanban className="h-5 w-5" />} />
          <KPICard title="Monthly Revenue" value={`$${mockStats.monthly_revenue.toLocaleString()}`} change={66} changeLabel="vs last month" icon={<DollarSign className="h-5 w-5" />} />
          <KPICard title="Pending Approvals" value={mockStats.pending_approvals} icon={<ShieldCheck className="h-5 w-5" />} />
        </div>

        {/* Second KPI Row */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KPICard title="Conversion Rate" value={`${mockStats.conversion_rate}%`} change={5.2} changeLabel="vs last month" icon={<CheckCircle2 className="h-5 w-5" />} />
          <KPICard title="Avg Response Time" value={mockStats.avg_response_time} change={-15} changeLabel="faster" icon={<Clock className="h-5 w-5" />} />
          <KPICard title="Upcoming Bookings" value={mockStats.upcoming_bookings} icon={<Calendar className="h-5 w-5" />} />
          <KPICard title="Tasks Today" value={mockStats.tasks_completed_today} change={12} changeLabel="vs yesterday" icon={<Bot className="h-5 w-5" />} />
        </div>

        {/* Charts + Approvals Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Revenue Chart */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Revenue Trend</h2>
              <span className="text-xs text-slate-400">Last 6 months</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockRevenue}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}K`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0' }}
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#22d3ee" fill="url(#revenueGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Pending Approvals</h2>
              <button onClick={() => navigate('/approvals')} className="text-xs text-cyan-400 hover:text-cyan-300">View all</button>
            </div>
            <div className="space-y-3">
              {pendingApprovals.map((approval) => {
                const priorityConfig = PRIORITY_CONFIG[approval.priority]
                const categoryConfig = APPROVAL_CATEGORY_CONFIG[approval.category]
                return (
                  <button
                    key={approval.id}
                    onClick={() => navigate('/approvals')}
                    className="w-full rounded-lg border border-slate-800 bg-slate-800/50 p-3 text-left transition-colors hover:border-slate-700 hover:bg-slate-800"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-200">{approval.title}</p>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {approval.agent_name} · {categoryConfig?.label}
                        </p>
                      </div>
                      <StatusBadge label={priorityConfig?.label ?? ''} color={priorityConfig?.color ?? ''} bg={priorityConfig?.bg} />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Pipeline + Agent Status Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Pipeline Chart */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Pipeline Value by Month</h2>
              <button onClick={() => navigate('/analytics')} className="text-xs text-cyan-400 hover:text-cyan-300">Details</button>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}K`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0' }}
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Pipeline']}
                  />
                  <Bar dataKey="pipeline_value" fill="#334155" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="revenue" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Agent Status */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Agent Status</h2>
              <button onClick={() => navigate('/agents')} className="text-xs text-cyan-400 hover:text-cyan-300">Manage</button>
            </div>
            <div className="space-y-2.5">
              {mockAgents.map((agent) => {
                const statusConfig = AGENT_STATUS_CONFIG[agent.status]
                return (
                  <div key={agent.id} className="flex items-center gap-3 rounded-lg px-2 py-1.5">
                    <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br', agent.avatar_color)}>
                      <span className="text-xs font-bold text-white">{agent.avatar_initials}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-200">{agent.code_name}</p>
                      <p className="truncate text-xs text-slate-500">{agent.current_task ?? 'Standby'}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className={cn('h-2 w-2 rounded-full', statusConfig?.dot)} />
                      <span className={cn('text-xs', statusConfig?.color)}>{statusConfig?.label}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">Recent Activity</h2>
          <div className="space-y-3">
            {mockActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 rounded-lg px-2 py-2">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-800">
                  <Bot className="h-3.5 w-3.5 text-slate-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-300">
                    <span className="font-medium text-cyan-400">{activity.agent_name}</span>{' '}
                    {activity.action}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">{activity.description}</p>
                </div>
                <span className="shrink-0 text-xs text-slate-600">{formatRelativeTime(activity.timestamp)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
