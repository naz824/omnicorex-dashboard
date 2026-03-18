import { useState } from 'react'
import { useToast } from '@/components/ui/Toast'
import type { Booking } from '@/types'

interface BookingFormProps {
  onSubmit: (data: Partial<Booking>) => void
  onClose: () => void
  initialData?: Partial<Booking>
}

export default function BookingForm({ onSubmit, onClose, initialData }: BookingFormProps) {
  const { showToast } = useToast()
  const [formData, setFormData] = useState<Partial<Booking>>({
    name: initialData?.name ?? '',
    email: initialData?.email ?? '',
    phone: initialData?.phone ?? '',
    business_name: initialData?.business_name ?? '',
    preferred_date: initialData?.preferred_date ?? '',
    preferred_time: initialData?.preferred_time ?? '',
    goal: initialData?.goal ?? '',
    notes: initialData?.notes ?? '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!formData.name?.trim()) newErrors.name = 'Name is required'
    if (!formData.email?.trim()) newErrors.email = 'Email is required'
    if (!formData.phone?.trim()) newErrors.phone = 'Phone is required'
    if (!formData.preferred_date?.trim()) newErrors.preferred_date = 'Date is required'
    if (!formData.preferred_time?.trim()) newErrors.preferred_time = 'Time is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit(formData)
    showToast('Booking created successfully', 'success')
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-300">Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name ?? ''}
          onChange={handleChange}
          className={`mt-1 w-full rounded-lg border bg-slate-800 px-3 py-2 text-sm text-white focus:outline-none ${
            errors.name ? 'border-rose-400 focus:border-rose-400' : 'border-slate-700 focus:border-cyan-400'
          }`}
          placeholder="Client name"
        />
        {errors.name && <p className="mt-1 text-xs text-rose-400">{errors.name}</p>}
      </div>

      <div>
        <label className="text-sm font-medium text-slate-300">Email *</label>
        <input
          type="email"
          name="email"
          value={formData.email ?? ''}
          onChange={handleChange}
          className={`mt-1 w-full rounded-lg border bg-slate-800 px-3 py-2 text-sm text-white focus:outline-none ${
            errors.email ? 'border-rose-400 focus:border-rose-400' : 'border-slate-700 focus:border-cyan-400'
          }`}
          placeholder="email@example.com"
        />
        {errors.email && <p className="mt-1 text-xs text-rose-400">{errors.email}</p>}
      </div>

      <div>
        <label className="text-sm font-medium text-slate-300">Phone *</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone ?? ''}
          onChange={handleChange}
          className={`mt-1 w-full rounded-lg border bg-slate-800 px-3 py-2 text-sm text-white focus:outline-none ${
            errors.phone ? 'border-rose-400 focus:border-rose-400' : 'border-slate-700 focus:border-cyan-400'
          }`}
          placeholder="+1 (555) 000-0000"
        />
        {errors.phone && <p className="mt-1 text-xs text-rose-400">{errors.phone}</p>}
      </div>

      <div>
        <label className="text-sm font-medium text-slate-300">Business Name</label>
        <input
          type="text"
          name="business_name"
          value={formData.business_name ?? ''}
          onChange={handleChange}
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
          placeholder="Company name"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-300">Date *</label>
        <input
          type="date"
          name="preferred_date"
          value={formData.preferred_date ?? ''}
          onChange={handleChange}
          className={`mt-1 w-full rounded-lg border bg-slate-800 px-3 py-2 text-sm text-white focus:outline-none ${
            errors.preferred_date ? 'border-rose-400 focus:border-rose-400' : 'border-slate-700 focus:border-cyan-400'
          }`}
        />
        {errors.preferred_date && <p className="mt-1 text-xs text-rose-400">{errors.preferred_date}</p>}
      </div>

      <div>
        <label className="text-sm font-medium text-slate-300">Time *</label>
        <select
          name="preferred_time"
          value={formData.preferred_time ?? ''}
          onChange={handleChange}
          className={`mt-1 w-full rounded-lg border bg-slate-800 px-3 py-2 text-sm text-white focus:outline-none ${
            errors.preferred_time ? 'border-rose-400 focus:border-rose-400' : 'border-slate-700 focus:border-cyan-400'
          }`}
        >
          <option value="">Select time</option>
          <option value="9:00 AM">9:00 AM</option>
          <option value="10:00 AM">10:00 AM</option>
          <option value="11:00 AM">11:00 AM</option>
          <option value="12:00 PM">12:00 PM</option>
          <option value="1:00 PM">1:00 PM</option>
          <option value="2:00 PM">2:00 PM</option>
          <option value="3:00 PM">3:00 PM</option>
          <option value="4:00 PM">4:00 PM</option>
          <option value="5:00 PM">5:00 PM</option>
        </select>
        {errors.preferred_time && <p className="mt-1 text-xs text-rose-400">{errors.preferred_time}</p>}
      </div>

      <div>
        <label className="text-sm font-medium text-slate-300">Goal</label>
        <textarea
          name="goal"
          value={formData.goal ?? ''}
          onChange={handleChange}
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
          placeholder="Meeting goal"
          rows={2}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-300">Notes</label>
        <textarea
          name="notes"
          value={formData.notes ?? ''}
          onChange={handleChange}
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
          placeholder="Additional notes"
          rows={2}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-300"
        >
          Create Booking
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 hover:border-slate-600"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
