import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Header from '@/components/layout/Header'
import KPICard from '@/components/shared/KPICard'
import { mockRevenue, mockLeads, mockApprovals } from '@/data/mock'
// Config constants available for future status breakdown charts
import { DollarSign, TrendingUp, Users, Target } from 'lucide-react'

const COLORS = ['#22d3ee', '#60a5fa', '#a78bfa', '#fbbf24', '#f97316', '#34d399', '#fb7185']

export default function AnalyticsScreen() {
  const pendingApprovals = mockApprovals.filter(a => a.status === 'pending').length
  const totalRevenue = mockRevenue.reduce((sum, m) => sum + m.revenue, 0)
  const totalDeals = mockRevenue.reduce((sum, m) => sum + m.deals_closed, 0)
  const avgDealSize = totalDeals > 0 ? totalRevenue / totalDeals : 0
  const currentPipeline = mockRevenue[mockRevenue.length - 1]?.pipeline_value ?? 0

  // Lead source distribution
  const sourceData = Object.entries(
    mockLeads.reduce<Record<string, number>>((acc, lead) => {
      const source = lead.source.replace('_', ' ')
      acc[source] = (acc[source] ?? 0) + 1
      return acc
    }, {})
  ).map(([name, value]) => ({ name, value }))

  // Lead status distribution — reserved for future status breakdown chart

  // Conversion funnel
  const funnelData = [
    { stage: 'Leads', count: mockLeads.length, rate: 100 },
    { stage: 'Contacted', count: mockLeads.filter(l => l.status !== 'new').length, rate: Math.round((mockLeads.filter(l => l.status !== 'new').length / mockLeads.length) * 100) },
    { stage: 'Qualified', count: mockLeads.filter(l => ['qualified', 'proposal_sent', 'negotiation', 'won'].includes(l.status)).length, rate: Math.round((mockLeads.filter(l => ['qualified', 'proposal_sent', 'negotiation', 'won'].includes(l.status)).length / mockLeads.length) * 100) },
    { stage: 'Proposal', count: mockLeads.filter(l => ['proposal_sent', 'negotiation', 'won'].includes(l.status)).length, rate: Math.round((mockLeads.filter(l => ['proposal_sent', 'negotiation', 'won'].includes(l.status)).length / mockLeads.length) * 100) },
    { stage: 'Won', count: mockLeads.filter(l => l.status === 'won').length, rate: Math.round((mockLeads.filter(l => l.status === 'won').length / mockLeads.length) * 100) },
  ]

  return (
    <div className="min-h-screen">
      <Header title="Analytics & Revenue" subtitle="Performance metrics and insights" pendingApprovals={pendingApprovals} />

      <div className="space-y-6 p-6">
        {/* Revenue KPIs */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KPICard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} change={66} changeLabel="vs prior period" icon={<DollarSign className="h-5 w-5" />} />
          <KPICard title="Pipeline Value" value={`$${currentPipeline.toLocaleString()}`} change={37} changeLabel="vs prior month" icon={<TrendingUp className="h-5 w-5" />} />
          <KPICard title="Deals Closed" value={totalDeals} change={40} changeLabel="vs prior period" icon={<Target className="h-5 w-5" />} />
          <KPICard title="Avg Deal Size" value={`$${avgDealSize.toLocaleString()}`} change={15} changeLabel="vs prior period" icon={<Users className="h-5 w-5" />} />
        </div>

        {/* Revenue + Pipeline Chart */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="mb-4 text-sm font-semibold text-white">Revenue Over Time</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockRevenue}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}K`} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0' }} formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#22d3ee" fill="url(#revGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="mb-4 text-sm font-semibold text-white">Deals Closed per Month</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0' }} />
                  <Bar dataKey="deals_closed" fill="#22d3ee" radius={[4, 4, 0, 0]} name="Deals" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Conversion Funnel + Distributions */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Conversion Funnel */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 lg:col-span-2">
            <h2 className="mb-4 text-sm font-semibold text-white">Conversion Funnel</h2>
            <div className="space-y-3">
              {funnelData.map((stage, i) => (
                <div key={stage.stage} className="flex items-center gap-4">
                  <span className="w-20 text-sm text-slate-400">{stage.stage}</span>
                  <div className="flex-1">
                    <div className="h-8 overflow-hidden rounded-lg bg-slate-800">
                      <div
                        className="flex h-full items-center rounded-lg bg-cyan-400/20 px-3 transition-all"
                        style={{ width: `${stage.rate}%` }}
                      >
                        <span className="text-xs font-medium text-cyan-400">{stage.count}</span>
                      </div>
                    </div>
                  </div>
                  <span className="w-12 text-right text-sm font-medium text-slate-300">{stage.rate}%</span>
                  {i > 0 && (
                    <span className="w-16 text-right text-xs text-slate-500">
                      {Math.round((stage.count / (funnelData[i - 1]?.count ?? 1)) * 100)}% conv.
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Lead Sources */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="mb-4 text-sm font-semibold text-white">Lead Sources</h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sourceData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">
                    {sourceData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-1">
              {sourceData.map((item, i) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-xs capitalize text-slate-400">{item.name}</span>
                  </div>
                  <span className="text-xs font-medium text-slate-300">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
