import { useState } from 'react'
import { useToast } from '@/components/ui/Toast'
import type { Lead } from '@/types'

interface LeadFormProps {
  onSubmit: (data: Partial<Lead>) => void
  onClose: () => void
  initialData?: Partial<Lead>
}

export default function LeadForm({ onSubmit, onClose, initialData }: LeadFormProps) {
  const { showToast } = useToast()
  const [formData, setFormData] = useState<Partial<Lead>>({
    name: initialData?.name ?? '',
    email: initialData?.email ?? '',
    phone: initialData?.phone ?? '',
    business_name: initialData?.business_name ?? '',
    industry: initialData?.industry ?? '',
    location: initialData?.location ?? '',
    source: initialData?.source ?? 'website',
    budget_range: initialData?.budget_range ?? '',
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
    if (!formData.business_name?.trim()) newErrors.business_name = 'Business name is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit(formData)
    showToast('Lead saved successfully', 'success')
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
          placeholder="Lead name"
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
        <label className="text-sm font-medium text-slate-300">Business Name *</label>
        <input
          type="text"
          name="business_name"
          value={formData.business_name ?? ''}
          onChange={handleChange}
          className={`mt-1 w-full rounded-lg border bg-slate-800 px-3 py-2 text-sm text-white focus:outline-none ${
            errors.business_name ? 'border-rose-400 focus:border-rose-400' : 'border-slate-700 focus:border-cyan-400'
          }`}
          placeholder="Company name"
        />
        {errors.business_name && <p className="mt-1 text-xs text-rose-400">{errors.business_name}</p>}
      </div>

      <div>
        <label className="text-sm font-medium text-slate-300">Industry</label>
        <input
          type="text"
          name="industry"
          value={formData.industry ?? ''}
          onChange={handleChange}
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
          placeholder="e.g., Technology"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-300">Location</label>
        <input
          type="text"
          name="location"
          value={formData.location ?? ''}
          onChange={handleChange}
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
          placeholder="City, State"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-300">Source</label>
        <select
          name="source"
          value={formData.source ?? 'website'}
          onChange={handleChange}
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
        >
          <option value="website">Website</option>
          <option value="referral">Referral</option>
          <option value="google">Google</option>
          <option value="social_media">Social Media</option>
          <option value="cold_outreach">Cold Outreach</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-slate-300">Budget Range</label>
        <input
          type="text"
          name="budget_range"
          value={formData.budget_range ?? ''}
          onChange={handleChange}
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
          placeholder="e.g., $10k-$25k"
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
          rows={3}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-300"
        >
          Save Lead
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
