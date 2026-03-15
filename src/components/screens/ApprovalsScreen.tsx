import { useState, useEffect } from 'react'
import { Check, X, Edit3, Mail, FileText, Rocket, Palette, DollarSign, GitBranch, Clock } from 'lucide-react'
import Header from '@/components/layout/Header'
import StatusBadge from '@/components/shared/StatusBadge'
import { mockApprovals } from '@/data/mock'
import { PRIORITY_CONFIG, APPROVAL_CATEGORY_CONFIG } from '@/config/constants'
import { formatRelativeTime } from '@/utils/format'
import { cn } from '@/utils/cn'
import type { Approval, ApprovalStatus } from '@/types'

const categoryIcons: Record<string, React.ElementType> = {
  Mail, FileText, Rocket, Palette, DollarSign, GitBranch,
}

export default function ApprovalsScreen() {
  const [approvals, setApprovals] = useState(mockApprovals)
  const [filter, setFilter] = useState<ApprovalStatus | 'all'>('all')
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null)
  const [reviewNotes, setReviewNotes] = useState('')

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedApproval(null) }
    if (selectedApproval) { document.addEventListener('keydown', handleEsc); return () => document.removeEventListener('keydown', handleEsc) }
  }, [selectedApproval])

  const pendingCount = approvals.filter(a => a.status === 'pending').length
  const filtered = filter === 'all' ? approvals : approvals.filter(a => a.status === filter)

  const handleApprove = (id: string) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' as const, reviewed_at: new Date().toISOString(), reviewer_notes: reviewNotes } : a))
    setSelectedApproval(null)
    setReviewNotes('')
  }

  const handleReject = (id: string) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' as const, reviewed_at: new Date().toISOString(), reviewer_notes: reviewNotes } : a))
    setSelectedApproval(null)
    setReviewNotes('')
  }

  const handleRequestRevision = (id: string) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'revision_requested' as const, reviewed_at: new Date().toISOString(), reviewer_notes: reviewNotes } : a))
    setSelectedApproval(null)
    setReviewNotes('')
  }

  return (
    <div className="min-h-screen">
      <Header title="Approval Queue" subtitle={`${pendingCount} items awaiting your review`} pendingApprovals={pendingCount} />

      <div className="p-6">
        {/* Filter Tabs */}
        <div className="mb-6 flex items-center gap-2">
          {(['all', 'pending', 'approved', 'rejected', 'revision_requested'] as const).map((status) => {
            const count = status === 'all' ? approvals.length : approvals.filter(a => a.status === status).length
            const label = status === 'all' ? 'All' : status === 'revision_requested' ? 'Revisions' : status.charAt(0).toUpperCase() + status.slice(1)
            return (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                  filter === status ? 'bg-cyan-400/10 text-cyan-400' : 'text-slate-400 hover:bg-slate-800'
                )}
              >
                {label}
                <span className="rounded-full bg-slate-800 px-1.5 text-xs">{count}</span>
              </button>
            )
          })}
        </div>

        {/* Approval Cards */}
        <div className="space-y-4">
          {filtered.map((approval) => {
            const priorityConfig = PRIORITY_CONFIG[approval.priority]
            const categoryConfig = APPROVAL_CATEGORY_CONFIG[approval.category]
            const CategoryIcon = categoryIcons[categoryConfig?.icon ?? 'Mail'] ?? Mail
            const isPending = approval.status === 'pending'

            return (
              <div
                key={approval.id}
                className={cn(
                  'rounded-xl border bg-slate-900 p-5 transition-colors',
                  isPending ? 'border-amber-400/20 hover:border-amber-400/40' : 'border-slate-800 hover:border-slate-700'
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                      isPending ? 'bg-amber-400/10 text-amber-400' : 'bg-slate-800 text-slate-400'
                    )}>
                      <CategoryIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{approval.title}</h3>
                      <p className="mt-0.5 text-sm text-slate-400">{approval.description}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="text-xs text-slate-500">From: <span className="text-cyan-400">{approval.agent_name}</span></span>
                        <StatusBadge label={priorityConfig?.label ?? ''} color={priorityConfig?.color ?? ''} bg={priorityConfig?.bg} />
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="h-3 w-3" />
                          {formatRelativeTime(approval.submitted_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isPending ? (
                      <>
                        <button
                          onClick={() => setSelectedApproval(approval)}
                          className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700"
                        >
                          Review
                        </button>
                        <button
                          onClick={() => handleApprove(approval.id)}
                          className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-500/20"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleReject(approval.id)}
                          className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm font-medium text-rose-400 hover:bg-rose-500/20"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <StatusBadge
                        label={approval.status === 'approved' ? 'Approved' : approval.status === 'rejected' ? 'Rejected' : 'Revision Requested'}
                        color={approval.status === 'approved' ? 'text-emerald-400' : approval.status === 'rejected' ? 'text-rose-400' : 'text-amber-400'}
                        bg={approval.status === 'approved' ? 'bg-emerald-400/10' : approval.status === 'rejected' ? 'bg-rose-400/10' : 'bg-amber-400/10'}
                        size="md"
                      />
                    )}
                  </div>
                </div>

                {/* Content Preview */}
                <div className="mt-4 rounded-lg bg-slate-800/50 p-4">
                  <pre className="whitespace-pre-wrap text-sm text-slate-300">{approval.content}</pre>
                </div>

                {approval.reviewer_notes && (
                  <div className="mt-3 rounded-lg border border-slate-700 bg-slate-800/30 p-3">
                    <p className="text-xs text-slate-500">Your notes:</p>
                    <p className="mt-1 text-sm text-slate-300">{approval.reviewer_notes}</p>
                  </div>
                )}
              </div>
            )
          })}

          {filtered.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-800 py-16 text-center">
              <Check className="mx-auto h-10 w-10 text-emerald-400/30" />
              <p className="mt-3 text-sm text-slate-500">No items to review</p>
            </div>
          )}
        </div>

        {/* Review Modal */}
        {selectedApproval && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Review approval">
            <div className="absolute inset-0 bg-black/60" onClick={() => setSelectedApproval(null)} />
            <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-950 p-6">
              <h2 className="text-lg font-bold text-white">{selectedApproval.title}</h2>
              <p className="mt-1 text-sm text-slate-400">{selectedApproval.description}</p>

              <div className="mt-4 max-h-80 overflow-y-auto rounded-lg bg-slate-900 p-4">
                <pre className="whitespace-pre-wrap text-sm text-slate-300">{selectedApproval.content}</pre>
              </div>

              <div className="mt-4">
                <label htmlFor="review-notes" className="text-sm font-medium text-slate-300">Notes (optional)</label>
                <textarea
                  id="review-notes"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add feedback or instructions..."
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                  rows={3}
                />
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => handleApprove(selectedApproval.id)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-400"
                >
                  <Check className="h-4 w-4" />
                  Approve
                </button>
                <button
                  onClick={() => handleRequestRevision(selectedApproval.id)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-amber-400/30 bg-amber-400/5 px-4 py-2.5 text-sm font-medium text-amber-400 hover:bg-amber-400/10"
                >
                  <Edit3 className="h-4 w-4" />
                  Request Revision
                </button>
                <button
                  onClick={() => handleReject(selectedApproval.id)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-rose-500/10 px-4 py-2.5 text-sm font-medium text-rose-400 hover:bg-rose-500/20"
                >
                  <X className="h-4 w-4" />
                  Reject
                </button>
              </div>

              <button onClick={() => setSelectedApproval(null)} className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white" aria-label="Close">✕</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
