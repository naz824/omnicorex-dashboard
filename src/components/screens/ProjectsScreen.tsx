import { useState } from 'react'
import { Plus, Clock, User } from 'lucide-react'
import Header from '@/components/layout/Header'
import StatusBadge from '@/components/shared/StatusBadge'
import { mockProjects, mockTasks, mockApprovals } from '@/data/mock'
import { PROJECT_STATUS_CONFIG, PRIORITY_CONFIG } from '@/config/constants'
import { formatDate, formatCurrency } from '@/utils/format'
import { cn } from '@/utils/cn'
import type { ProjectTask, TaskStatus } from '@/types'

const TASK_COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
]

export default function ProjectsScreen() {
  const [selectedProject, setSelectedProject] = useState(mockProjects[0]?.id ?? '')
  const pendingApprovals = mockApprovals.filter(a => a.status === 'pending').length

  const project = mockProjects.find(p => p.id === selectedProject)
  const tasks = mockTasks.filter(t => t.project_id === selectedProject)
  const getTasksByStatus = (status: TaskStatus): ProjectTask[] => tasks.filter(t => t.status === status)

  return (
    <div className="min-h-screen">
      <Header title="Project Tracker" subtitle={`${mockProjects.length} active projects`} pendingApprovals={pendingApprovals} />

      <div className="p-6">
        {/* Project Selector */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          {mockProjects.map((p) => {
            const statusConfig = PROJECT_STATUS_CONFIG[p.status]
            return (
              <button
                key={p.id}
                onClick={() => setSelectedProject(p.id)}
                className={cn(
                  'rounded-xl border px-4 py-3 text-left transition-all',
                  selectedProject === p.id
                    ? 'border-cyan-400/30 bg-cyan-400/5'
                    : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                )}
              >
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{p.name}</p>
                    <p className="text-xs text-slate-400">{p.client_name} · {formatCurrency(p.budget)}</p>
                  </div>
                  <StatusBadge label={statusConfig?.label ?? ''} color={statusConfig?.color ?? ''} bg={statusConfig?.bg} />
                </div>
                {/* Progress bar */}
                <div className="mt-2 h-1.5 w-48 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-cyan-400 transition-all" style={{ width: `${p.progress}%` }} />
                </div>
                <p className="mt-1 text-xs text-slate-500">{p.progress}% complete</p>
              </button>
            )
          })}
          <button className="flex h-24 w-48 items-center justify-center rounded-xl border border-dashed border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300">
            <Plus className="mr-2 h-4 w-4" />
            <span className="text-sm">New Project</span>
          </button>
        </div>

        {/* Project Details */}
        {project && (
          <div className="mb-6 grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <p className="text-xs text-slate-500">Start Date</p>
              <p className="text-sm font-medium text-white">{formatDate(project.start_date)}</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <p className="text-xs text-slate-500">Target Completion</p>
              <p className="text-sm font-medium text-white">{formatDate(project.estimated_end_date)}</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <p className="text-xs text-slate-500">Package</p>
              <p className="text-sm font-medium text-white capitalize">{project.package_tier} · {formatCurrency(project.budget)}</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <p className="text-xs text-slate-500">Current Phase</p>
              <p className="text-sm font-medium text-white">{project.current_phase}</p>
            </div>
          </div>
        )}

        {/* Kanban Board */}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {TASK_COLUMNS.map((column) => {
            const columnTasks = getTasksByStatus(column.id)
            return (
              <div key={column.id} className="w-72 shrink-0">
                <div className="mb-3 flex items-center gap-2 px-1">
                  <h3 className="text-sm font-semibold text-slate-300">{column.title}</h3>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-xs text-slate-400">{columnTasks.length}</span>
                </div>
                <div className="space-y-3">
                  {columnTasks.map((task) => {
                    const priorityConfig = PRIORITY_CONFIG[task.priority]
                    return (
                      <div key={task.id} className="rounded-xl border border-slate-800 bg-slate-900 p-4 transition-colors hover:border-slate-700">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-white">{task.title}</p>
                          <StatusBadge label={priorityConfig?.label ?? ''} color={priorityConfig?.color ?? ''} bg={priorityConfig?.bg} />
                        </div>
                        <p className="mt-1 text-xs text-slate-400 line-clamp-2">{task.description}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <User className="h-3 w-3" />
                            {task.assigned_agent}
                          </div>
                          {task.due_date && (
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <Clock className="h-3 w-3" />
                              {formatDate(task.due_date)}
                            </div>
                          )}
                        </div>
                        {task.estimated_hours > 0 && (
                          <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-800">
                            <div
                              className="h-full rounded-full bg-cyan-400/50"
                              style={{ width: `${Math.min((task.actual_hours / task.estimated_hours) * 100, 100)}%` }}
                            />
                          </div>
                        )}
                      </div>
                    )
                  })}
                  {columnTasks.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-800 p-6 text-center">
                      <p className="text-sm text-slate-600">No tasks</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
