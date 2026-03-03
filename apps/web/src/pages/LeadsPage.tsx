import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, X } from 'lucide-react'
import { useState } from 'react'
import { api } from '../lib/api'

interface Lead {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  company?: string
  source?: string
  stage: string
  assignee?: { name: string }
  createdAt: string
}

const STAGE_LABELS: Record<string, string> = {
  NEW: 'New', CONTACTED: 'Contacted', CALL_BOOKED: 'Call Booked',
  CALL_COMPLETED: 'Call Completed', INTAKE_COMPLETED: 'Intake Done',
  PROPOSAL: 'Proposal', NEGOTIATIONS: 'Negotiations',
  CONTRACT_AND_PAYMENT: 'Contract & Payment', CLOSED_WON: 'Closed Won', CLOSED_LOST: 'Closed Lost',
}

export function LeadsPage() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', company: '', source: '' })

  const { data: leads = [], isLoading } = useQuery<Lead[]>({
    queryKey: ['leads'],
    queryFn: () => api.get('/leads').then((r) => r.data),
  })

  const createMutation = useMutation({
    mutationFn: (data: typeof form) => api.post('/leads', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['leads'] }); setShowForm(false); setForm({ firstName: '', lastName: '', email: '', phone: '', company: '', source: '' }) },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/leads/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  })

  const filtered = leads.filter((l) => {
    const q = search.toLowerCase()
    return `${l.firstName} ${l.lastName} ${l.email} ${l.company}`.toLowerCase().includes(q)
  })

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Leads</h1>
          <p className="text-sm text-slate-500">{leads.length} total leads</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> New Lead
        </button>
      </div>

      <div className="px-6 py-3 bg-white border-b border-slate-100">
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input pl-9"
            placeholder="Search leads…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {isLoading ? (
          <div className="text-center text-slate-500 py-12">Loading…</div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th className="px-4 py-3 font-medium text-slate-600">Name</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Company</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Contact</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Stage</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Source</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Assignee</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium">{lead.firstName} {lead.lastName}</td>
                    <td className="px-4 py-3 text-slate-600">{lead.company || '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{lead.email || lead.phone || '—'}</td>
                    <td className="px-4 py-3">
                      <span className="bg-lgp-100 text-lgp-700 text-xs font-medium px-2 py-0.5 rounded-full">
                        {STAGE_LABELS[lead.stage] || lead.stage}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{lead.source || '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{lead.assignee?.name || '—'}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => { if (confirm('Delete this lead?')) deleteMutation.mutate(lead.id) }}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">No leads found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Lead Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-900">New Lead</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); createMutation.mutate(form) }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">First Name *</label>
                  <input className="input" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Last Name *</label>
                  <input className="input" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
                <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Phone</label>
                  <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Company</label>
                  <input className="input" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Source</label>
                <select className="input" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>
                  <option value="">Select source…</option>
                  <option value="Referral">Referral</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Website">Website</option>
                  <option value="Cold Call">Cold Call</option>
                  <option value="Event">Event</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Creating…' : 'Create Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
