import { useState } from 'react'
import { useToast } from '@/components/ui/Toast'
import type { Project } from '@/types'

interface ProjectFormProps {
  onSubmit: (data: Partial<Project>) => void
  onClose: () => void
  initialData?: Partial<Project>
}

export default function ProjectForm({ onSubmit, onClose, initialData }: ProjectFormProps) {
  const { showToast } = useToast()
  const [formData, setFormData] = useState<Partial<Project>>({
    name: initialData?.name ?? '',
    client_name: initialData?.client_name ?? '',
    client_email: initialData?.client_email ?? '',
    package_tier: initialData?.package_tier ?? 'growth',
    budget: initialData?.budget ?? 0,
    start_date: initialData?.start_date ?? '',
    notes: initialData?.notes ?? '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const finalValue = name === 'budget' ? parseFloat(value) || 0 : value
    setFormData(prev => ({ ...prev, [name]: finalValue }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!formData.name?.trim()) newErrors.name = 'Project name is required'
    if (!formData.client_name?.trim()) newErrors.client_name = 'Client name is required'
    if (!formData.client_email?.trim()) newErrors.client_email = 'Client email is required'
    if (!formData.start_date?.trim()) newErrors.start_date = 'Start date is required'
    if (!formData.budget || formData.budget <= 0) newErrors.budget = 'Budget must be greater than 0'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit(formData)
    showToast('Project created successfully', 'success')
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-300">Project Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name ?? ''}
          onChange={handleChange}
          className={`mt-1 w-full rounded-lg border bg-slate-800 px-3 py-2 text-sm text-white focus:outline-none ${
            errors.name ? 'border-rose-400 focus:border-rose-400' : 'border-slate-700 focus:border-cyan-400'
          }`}
          placeholder="Project name"
        />
        {errors.name && <p className="mt-1 text-xs text-rose-400">{errors.name}</p>}
      </div>

      <div>
        <label className="text-sm font-medium text-slate-300">Client Name *</label>
        <input
          type="text"
          name="client_name"
          value={formData.client_name ?? ''}
          onChange={handleChange}
          className={`mt-1 w-full rounded-lg border bg-slate-800 px-3 py-2 text-sm text-white focus:outline-none ${
            errors.client_name ? 'border-rose-400 focus:border-rose-400' : 'border-slate-700 focus:border-cyan-400'
          }`}
          placeholder="Client name"
        />
        {errors.client_name && <p className="mt-1 text-xs text-rose-400">{errors.client_name}</p>}
      </div>

      <div>
        <label className="text-sm font-medium text-slate-300">Client Email *</label>
        <input
          type="email"
          name="client_email"
          value={formData.client_email ?? ''}
          onChange={handleChange}
          className={`mt-1 w-full rounded-lg border bg-slate-800 px-3 py-2 text-sm text-white focus:outline-none ${
            errors.client_email ? 'border-rose-400 focus:border-rose-400' : 'border-slate-700 focus:border-cyan-400'
          }`}
          placeholder="client@example.com"
        />
        {errors.client_email && <p className="mt-1 text-xs text-rose-400">{errors.client_email}</p>}
      </div>

      <div>
        <label className="text-sm font-medium text-slate-300">Package Tier</label>
        <select
          name="package_tier"
          value={formData.package_tier ?? 'growth'}
          onChange={handleChange}
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
        >
          <option value="starter">Starter</option>
          <option value="growth">Growth</option>
          <option value="premium">Premium</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-slate-300">Budget *</label>
        <input
          type="number"
          name="budget"
          value={formData.budget ?? 0}
          onChange={handleChange}
          className={`mt-1 w-full rounded-lg border bg-slate-800 px-3 py-2 text-sm text-white focus:outline-none ${
            errors.budget ? 'border-rose-400 focus:border-rose-400' : 'border-slate-700 focus:border-cyan-400'
          }`}
          placeholder="0"
          min="0"
          step="100"
        />
        {errors.budget && <p className="mt-1 text-xs text-rose-400">{errors.budget}</p>}
      </div>

      <div>
        <label className="text-sm font-medium text-slate-300">Start Date *</label>
        <input
          type="date"
          name="start_date"
          value={formData.start_date ?? ''}
          onChange={handleChange}
          className={`mt-1 w-full rounded-lg border bg-slate-800 px-3 py-2 text-sm text-white focus:outline-none ${
            errors.start_date ? 'border-rose-400 focus:border-rose-400' : 'border-slate-700 focus:border-cyan-400'
          }`}
        />
        {errors.start_date && <p className="mt-1 text-xs text-rose-400">{errors.start_date}</p>}
      </div>

      <div>
        <label className="text-sm font-medium text-slate-300">Notes</label>
        <textarea
          name="notes"
          value={formData.notes ?? ''}
          onChange={handleChange}
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
          placeholder="Project notes and details"
          rows={3}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-300"
        >
          Create Project
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
