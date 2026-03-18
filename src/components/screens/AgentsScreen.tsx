import { useState, useEffect } from 'react'
import { Bot, Zap, Clock, CheckCircle2, Settings, Play, Pause } from 'lucide-react'
import Header from '@/components/layout/Header'
import StatusBadge from '@/components/shared/StatusBadge'
import { useToast } from '@/components/ui/Toast'
import { mockAgents, mockApprovals, mockActivities } from '@/data/mock'
import { AGENT_STATUS_CONFIG } from '@/config/constants'
import { formatRelativeTime } from '@/utils/format'
import { cn } from '@/utils/cn'
import type { AgentConfig } from '@/types'

export default function AgentsScreen() {
  const { showToast } = useToast()
  const [selectedAgent, setSelectedAgent] = useState<AgentConfig | null>(null)
  const [agentStatus, setAgentStatus] = useState<Record<string, boolean>>({})
  const pendingApprovals = mockApprovals.filter(a => a.status === 'pending').length

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedAgent(null) }
    if (selectedAgent) { document.addEventListener('keydown', handleEsc); return () => document.removeEventListener('keydown', handleEsc) }
  }, [selectedAgent])

  const totalTasksToday = mockAgents.reduce((sum, a) => sum + a.tasks_completed_today, 0)
  const activeCount = mockAgents.filter(a => a.status === 'working' || a.status === 'waiting_approval').length

  return (
    <div className="min-h-screen">
      <Header title="Agent Control Panel" subtitle={`${activeCount} active · ${totalTasksToday} tasks today`} pendingApprovals={pendingApprovals} />

      <div className="p-6">
        {/* Summary Cards */}
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-medium">Active</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-white">{activeCount}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <div className="flex items-center gap-2 text-amber-400">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Awaiting Approval</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-white">{mockAgents.filter(a => a.status === 'waiting_approval').length}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <div className="flex items-center gap-2 text-cyan-400">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm font-medium">Tasks Today</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-white">{totalTasksToday}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Bot className="h-4 w-4" />
              <span className="text-sm font-medium">Total Agents</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-white">{mockAgents.length}</p>
          </div>
        </div>

        {/* Agent Grid */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {mockAgents.map((agent) => {
            const statusConfig = AGENT_STATUS_CONFIG[agent.status]
            return (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={cn(
                  'rounded-xl border bg-slate-900 p-5 text-left transition-all hover:border-slate-700',
                  agent.status === 'working' ? 'border-emerald-400/20' :
                  agent.status === 'waiting_approval' ? 'border-amber-400/20' :
                  'border-slate-800'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn('flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br', agent.avatar_color)}>
                      <span className="text-sm font-bold text-white">{agent.avatar_initials}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-white">{agent.code_name}</p>
                      <p className="text-xs text-slate-400">{agent.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={cn('h-2 w-2 rounded-full', statusConfig?.dot)} />
                  </div>
                </div>

                <div className="mt-4">
                  {agent.current_task ? (
                    <div className="rounded-lg bg-slate-800/50 px-3 py-2">
                      <p className="text-xs text-slate-500">Current Task</p>
                      <p className="mt-0.5 text-sm text-slate-300 line-clamp-2">{agent.current_task}</p>
                    </div>
                  ) : (
                    <div className="rounded-lg bg-slate-800/30 px-3 py-2">
                      <p className="text-sm text-slate-500">Standing by</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">{agent.tasks_completed_today}</p>
                    <p className="text-[10px] text-slate-500">Today</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">{agent.tasks_completed_total}</p>
                    <p className="text-[10px] text-slate-500">Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">{agent.approvals_pending}</p>
                    <p className="text-[10px] text-slate-500">Pending</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <StatusBadge label={statusConfig?.label ?? ''} color={statusConfig?.color ?? ''} />
                  <span className="text-xs text-slate-600">{formatRelativeTime(agent.last_active)}</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Agent Detail Modal */}
        {selectedAgent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Agent details">
            <div className="absolute inset-0 bg-black/60" onClick={() => setSelectedAgent(null)} />
            <div className="relative w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn('flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br', selectedAgent.avatar_color)}>
                    <span className="text-lg font-bold text-white">{selectedAgent.avatar_initials}</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedAgent.code_name}</h2>
                    <p className="text-sm text-slate-400">{selectedAgent.name} · {selectedAgent.role}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedAgent(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white" aria-label="Close">✕</button>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                  <h3 className="mb-2 text-sm font-semibold text-white">Configuration</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-slate-400">Model</span><span className="text-slate-200">{selectedAgent.model}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Status</span><StatusBadge label={AGENT_STATUS_CONFIG[selectedAgent.status]?.label ?? ''} color={AGENT_STATUS_CONFIG[selectedAgent.status]?.color ?? ''} /></div>
                    <div className="flex justify-between"><span className="text-slate-400">Last Active</span><span className="text-slate-200">{formatRelativeTime(selectedAgent.last_active)}</span></div>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                  <h3 className="mb-2 text-sm font-semibold text-white">Performance</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-slate-400">Tasks Today</span><span className="text-slate-200">{selectedAgent.tasks_completed_today}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Tasks Total</span><span className="text-slate-200">{selectedAgent.tasks_completed_total}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Approvals Pending</span><span className="text-slate-200">{selectedAgent.approvals_pending}</span></div>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900 p-4">
                <h3 className="mb-2 text-sm font-semibold text-white">Tools</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedAgent.tools.map((tool) => (
                    <span key={tool} className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300">{tool}</span>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900 p-4">
                <h3 className="mb-2 text-sm font-semibold text-white">Recent Activity</h3>
                <div className="space-y-2">
                  {mockActivities
                    .filter(a => a.agent_name === selectedAgent.code_name)
                    .slice(0, 5)
                    .map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between py-1">
                        <div>
                          <p className="text-sm text-slate-300">{activity.action}</p>
                          <p className="text-xs text-slate-500">{activity.description}</p>
                        </div>
                        <span className="shrink-0 text-xs text-slate-600">{formatRelativeTime(activity.timestamp)}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button onClick={() => showToast('Task assignment dialog opened', 'info')} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-cyan-400 px-4 py-2.5 text-sm font-medium text-slate-950 hover:bg-cyan-300">
                  <Play className="h-4 w-4" />
                  Assign Task
                </button>
                <button onClick={() => showToast('Agent config panel opened', 'info')} className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-300 hover:border-slate-600">
                  <Settings className="h-4 w-4" />
                  Configure
                </button>
                <button
                  onClick={() => {
                    const newStatus = !agentStatus[selectedAgent.id]
                    setAgentStatus(prev => ({ ...prev, [selectedAgent.id]: newStatus }))
                    showToast(newStatus ? 'Agent paused' : 'Agent resumed', 'success')
                  }}
                  className="flex items-center gap-2 rounded-lg border border-amber-400/30 bg-amber-400/5 px-4 py-2.5 text-sm font-medium text-amber-400 hover:bg-amber-400/10"
                >
                  {agentStatus[selectedAgent.id] ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  {agentStatus[selectedAgent.id] ? 'Resume' : 'Pause'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
