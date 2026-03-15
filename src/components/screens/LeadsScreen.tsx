import { useState } from 'react'
import { Plus, Search, Filter, ChevronDown, Mail, Phone, Globe, MapPin, ArrowRight } from 'lucide-react'
import Header from '@/components/layout/Header'
import StatusBadge from '@/components/shared/StatusBadge'
import { mockLeads, mockApprovals } from '@/data/mock'
import { LEAD_STATUS_CONFIG } from '@/config/constants'
import { formatRelativeTime } from '@/utils/format'
import { cn } from '@/utils/cn'
import type { Lead, LeadStatus } from '@/types'

const PIPELINE_COLUMNS: { id: LeadStatus; title: string }[] = [
  { id: 'new', title: 'New' },
  { id: 'contacted', title: 'Contacted' },
  { id: 'qualified', title: 'Qualified' },
  { id: 'proposal_sent', title: 'Proposal Sent' },
  { id: 'negotiation', title: 'Negotiation' },
  { id: 'won', title: 'Won' },
]

export default function LeadsScreen() {
  const [view, setView] = useState<'pipeline' | 'table'>('pipeline')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const pendingApprovals = mockApprovals.filter(a => a.status === 'pending').length

  const filteredLeads = mockLeads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.business_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getLeadsByStatus = (status: LeadStatus) =>
    filteredLeads.filter((lead) => lead.status === status)

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400'
    if (score >= 60) return 'text-cyan-400'
    if (score >= 40) return 'text-amber-400'
    return 'text-rose-400'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-400'
    if (score >= 60) return 'bg-cyan-400'
    if (score >= 40) return 'bg-amber-400'
    return 'bg-rose-400'
  }

  return (
    <div className="min-h-screen">
      <Header title="Lead Management" subtitle={`${mockLeads.length} leads in pipeline`} pendingApprovals={pendingApprovals} />

      <div className="p-6">
        {/* Toolbar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                aria-label="Search leads"
              />
            </div>
            <button className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-300 hover:border-slate-600">
              <Filter className="h-4 w-4" />
              Filter
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex rounded-lg border border-slate-700 bg-slate-800">
              <button
                onClick={() => setView('pipeline')}
                className={cn('px-3 py-1.5 text-sm', view === 'pipeline' ? 'bg-cyan-400/10 text-cyan-400' : 'text-slate-400 hover:text-slate-300')}
              >
                Pipeline
              </button>
              <button
                onClick={() => setView('table')}
                className={cn('px-3 py-1.5 text-sm', view === 'table' ? 'bg-cyan-400/10 text-cyan-400' : 'text-slate-400 hover:text-slate-300')}
              >
                Table
              </button>
            </div>
            <button className="flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-300">
              <Plus className="h-4 w-4" />
              Add Lead
            </button>
          </div>
        </div>

        {/* Pipeline View */}
        {view === 'pipeline' && (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {PIPELINE_COLUMNS.map((column) => {
              const leads = getLeadsByStatus(column.id)
              const statusConfig = LEAD_STATUS_CONFIG[column.id]
              return (
                <div key={column.id} className="w-72 shrink-0">
                  <div className="mb-3 flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <h3 className={cn('text-sm font-semibold', statusConfig?.color)}>{column.title}</h3>
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-xs text-slate-400">{leads.length}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {leads.map((lead) => (
                      <button
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 p-4 text-left transition-all hover:border-slate-700 hover:bg-slate-800/80"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-white">{lead.name}</p>
                            <p className="mt-0.5 text-xs text-slate-400">{lead.business_name}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className={cn('h-2 w-2 rounded-full', getScoreBg(lead.score))} />
                            <span className={cn('text-sm font-bold', getScoreColor(lead.score))}>{lead.score}</span>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          <span className="rounded bg-slate-800 px-1.5 py-0.5 text-xs text-slate-400">{lead.industry}</span>
                          <span className="rounded bg-slate-800 px-1.5 py-0.5 text-xs text-slate-400">{lead.location}</span>
                        </div>
                        {lead.budget_range && (
                          <p className="mt-2 text-xs text-slate-500">Budget: {lead.budget_range}</p>
                        )}
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs text-slate-600">{formatRelativeTime(lead.updated_at)}</span>
                          {lead.next_follow_up && (
                            <span className="text-xs text-amber-400">Follow-up scheduled</span>
                          )}
                        </div>
                      </button>
                    ))}
                    {leads.length === 0 && (
                      <div className="rounded-xl border border-dashed border-slate-800 p-6 text-center">
                        <p className="text-sm text-slate-600">No leads</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Table View */}
        {view === 'table' && (
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-400">Lead</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-400">Business</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-400">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-400">Score</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-400">Budget</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-400">Source</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-400">Updated</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => {
                  const statusConfig = LEAD_STATUS_CONFIG[lead.status]
                  return (
                    <tr key={lead.id} className="border-b border-slate-800/50 transition-colors hover:bg-slate-800/30">
                      <td className="px-4 py-3">
                        <button onClick={() => setSelectedLead(lead)} className="text-left">
                          <p className="text-sm font-medium text-white">{lead.name}</p>
                          <p className="text-xs text-slate-400">{lead.email}</p>
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-300">{lead.business_name}</td>
                      <td className="px-4 py-3">
                        <StatusBadge label={statusConfig?.label ?? ''} color={statusConfig?.color ?? ''} bg={statusConfig?.bg} />
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('text-sm font-bold', getScoreColor(lead.score))}>{lead.score}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-400">{lead.budget_range}</td>
                      <td className="px-4 py-3 text-sm text-slate-400 capitalize">{lead.source.replace('_', ' ')}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{formatRelativeTime(lead.updated_at)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Lead Detail Drawer */}
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Lead details">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedLead(null)} onKeyDown={(e) => e.key === 'Escape' && setSelectedLead(null)} />
            <div className="relative w-full max-w-lg overflow-y-auto border-l border-slate-800 bg-slate-950 p-6">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedLead.name}</h2>
                  <p className="mt-1 text-sm text-slate-400">{selectedLead.business_name}</p>
                </div>
                <div className="text-right">
                  <div className={cn('text-3xl font-bold', getScoreColor(selectedLead.score))}>{selectedLead.score}</div>
                  <p className="text-xs text-slate-500">Lead Score</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                  <h3 className="mb-3 text-sm font-semibold text-white">Contact Info</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-300"><Mail className="h-4 w-4 text-slate-500" />{selectedLead.email}</div>
                    <div className="flex items-center gap-2 text-sm text-slate-300"><Phone className="h-4 w-4 text-slate-500" />{selectedLead.phone}</div>
                    {selectedLead.website_url && <div className="flex items-center gap-2 text-sm text-slate-300"><Globe className="h-4 w-4 text-slate-500" />{selectedLead.website_url}</div>}
                    <div className="flex items-center gap-2 text-sm text-slate-300"><MapPin className="h-4 w-4 text-slate-500" />{selectedLead.location}</div>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                  <h3 className="mb-3 text-sm font-semibold text-white">Details</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div><p className="text-xs text-slate-500">Industry</p><p className="text-sm text-slate-200">{selectedLead.industry}</p></div>
                    <div><p className="text-xs text-slate-500">Budget</p><p className="text-sm text-slate-200">{selectedLead.budget_range}</p></div>
                    <div><p className="text-xs text-slate-500">Urgency</p><p className="text-sm text-slate-200">{selectedLead.urgency}</p></div>
                    <div><p className="text-xs text-slate-500">Source</p><p className="text-sm text-slate-200 capitalize">{selectedLead.source.replace('_', ' ')}</p></div>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                  <h3 className="mb-2 text-sm font-semibold text-white">Notes</h3>
                  <p className="text-sm leading-relaxed text-slate-300">{selectedLead.notes}</p>
                </div>

                <div className="flex gap-3">
                  <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-cyan-400 px-4 py-2.5 text-sm font-medium text-slate-950 hover:bg-cyan-300">
                    <Mail className="h-4 w-4" />
                    Draft Email
                  </button>
                  <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-300 hover:border-slate-600">
                    <ArrowRight className="h-4 w-4" />
                    Move Stage
                  </button>
                </div>
              </div>

              <button onClick={() => setSelectedLead(null)} className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white" aria-label="Close">✕</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
