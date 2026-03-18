import { useState } from 'react'
import { Calendar, Clock, Video, Check, X, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import Header from '@/components/layout/Header'
import StatusBadge from '@/components/shared/StatusBadge'
import Modal from '@/components/ui/Modal'
import BookingForm from '@/components/forms/BookingForm'
import { useToast } from '@/components/ui/Toast'
import { mockBookings, mockApprovals } from '@/data/mock'
import { BOOKING_STATUS_CONFIG } from '@/config/constants'
import { formatDate } from '@/utils/format'
import { cn } from '@/utils/cn'
import type { BookingStatus } from '@/types'

const TIME_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

export default function BookingsScreen() {
  const { showToast } = useToast()
  const [view, setView] = useState<'list' | 'calendar'>('list')
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const pendingApprovals = mockApprovals.filter(a => a.status === 'pending').length

  const filteredBookings = statusFilter === 'all'
    ? mockBookings
    : mockBookings.filter(b => b.status === statusFilter)

  return (
    <div className="min-h-screen">
      <Header title="Bookings & Calendar" subtitle={`${mockBookings.length} upcoming bookings`} pendingApprovals={pendingApprovals} />

      <div className="p-6">
        {/* Toolbar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {(['all', 'pending', 'confirmed', 'completed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                  statusFilter === status ? 'bg-cyan-400/10 text-cyan-400' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-300'
                )}
              >
                {status === 'all' ? 'All' : BOOKING_STATUS_CONFIG[status]?.label ?? status}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex rounded-lg border border-slate-700 bg-slate-800">
              <button onClick={() => setView('list')} className={cn('px-3 py-1.5 text-sm', view === 'list' ? 'bg-cyan-400/10 text-cyan-400' : 'text-slate-400')}>List</button>
              <button onClick={() => setView('calendar')} className={cn('px-3 py-1.5 text-sm', view === 'calendar' ? 'bg-cyan-400/10 text-cyan-400' : 'text-slate-400')}>Calendar</button>
            </div>
            <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-300">
              <Plus className="h-4 w-4" />
              New Booking
            </button>
          </div>
        </div>

        {/* List View */}
        {view === 'list' && (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const statusConfig = BOOKING_STATUS_CONFIG[booking.status]
              return (
                <button key={booking.id} onClick={() => showToast(`Opened booking: ${booking.name}`, 'info')} className="w-full rounded-xl border border-slate-800 bg-slate-900 p-5 text-left transition-colors hover:border-slate-700">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-slate-800">
                        <span className="text-lg font-bold text-white">{parseInt(booking.preferred_date.split('-')[2], 10)}</span>
                        <span className="text-xs text-slate-400">{new Date(booking.preferred_date + 'T00:00:00').toLocaleString('en-US', { month: 'short' })}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{booking.name}</h3>
                        <p className="text-sm text-slate-400">{booking.business_name}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{booking.preferred_time}</span>
                          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formatDate(booking.preferred_date)}</span>
                          {booking.meeting_link && <span className="flex items-center gap-1"><Video className="h-3.5 w-3.5 text-cyan-400" />Google Meet</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge label={statusConfig?.label ?? ''} color={statusConfig?.color ?? ''} size="md" />
                      {booking.status === 'pending' && (
                        <div className="flex gap-2">
                          <button onClick={(e) => { e.stopPropagation(); showToast('Booking confirmed', 'success') }} className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400 hover:bg-emerald-500/20" aria-label="Confirm booking">
                            <Check className="h-4 w-4" />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); showToast('Booking cancelled', 'info') }} className="rounded-lg bg-rose-500/10 p-2 text-rose-400 hover:bg-rose-500/20" aria-label="Cancel booking">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {booking.goal && (
                    <div className="mt-3 rounded-lg bg-slate-800/50 px-3 py-2">
                      <p className="text-xs text-slate-500">Goal</p>
                      <p className="text-sm text-slate-300">{booking.goal}</p>
                    </div>
                  )}
                  <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                    <span>{booking.email}</span>
                    <span>{booking.phone}</span>
                    {booking.notes && <span>Note: {booking.notes}</span>}
                  </div>
                </button>
              )
            })}
            {filteredBookings.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-800 py-16 text-center">
                <Calendar className="mx-auto h-10 w-10 text-slate-600" />
                <p className="mt-3 text-sm text-slate-500">No bookings found</p>
              </div>
            )}
          </div>
        )}

        {/* Calendar View */}
        {view === 'calendar' && (
          <div className="rounded-xl border border-slate-800 bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3">
              <button onClick={() => showToast('Previous week', 'info')} className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white" aria-label="Previous week">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h3 className="text-sm font-semibold text-white">March 17 – 21, 2026</h3>
              <button onClick={() => showToast('Next week', 'info')} className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white" aria-label="Next week">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <div className="grid min-w-[640px] grid-cols-6">
                {/* Time column */}
                <div className="border-r border-slate-800">
                  <div className="h-10 border-b border-slate-800" />
                  {TIME_SLOTS.map((time) => (
                    <div key={time} className="flex h-16 items-start justify-end border-b border-slate-800/50 px-2 pt-1">
                      <span className="text-xs text-slate-500">{time}</span>
                    </div>
                  ))}
                </div>
                {/* Day columns */}
                {DAYS.map((day, i) => (
                  <div key={day} className={cn(i < DAYS.length - 1 && 'border-r border-slate-800')}>
                    <div className="flex h-10 items-center justify-center border-b border-slate-800">
                      <span className="text-xs font-medium text-slate-400">{day} {17 + i}</span>
                    </div>
                    {TIME_SLOTS.map((time) => {
                      const booking = mockBookings.find(
                        (b) => b.preferred_date === `2026-03-${17 + i}` && b.preferred_time === time
                      )
                      return (
                        <div key={time} className="h-16 border-b border-slate-800/50 p-1">
                          {booking && (
                            <div className="h-full rounded-md bg-cyan-400/10 border border-cyan-400/20 p-1.5">
                              <p className="truncate text-xs font-medium text-cyan-400">{booking.name}</p>
                              <p className="truncate text-[10px] text-slate-400">{booking.business_name}</p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add Booking Modal */}
        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="New Booking">
          <BookingForm
            onSubmit={() => {
              showToast('Booking created successfully', 'success')
              setShowAddModal(false)
            }}
            onClose={() => setShowAddModal(false)}
          />
        </Modal>
      </div>
    </div>
  )
}
