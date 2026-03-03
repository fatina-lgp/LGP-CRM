import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { api } from '../lib/api'

const STAGES = [
  { key: 'NEW', label: 'New', color: 'bg-slate-200 text-slate-700' },
  { key: 'CONTACTED', label: 'Contacted', color: 'bg-blue-100 text-blue-700' },
  { key: 'CALL_BOOKED', label: 'Call Booked', color: 'bg-violet-100 text-violet-700' },
  { key: 'CALL_COMPLETED', label: 'Call Completed', color: 'bg-indigo-100 text-indigo-700' },
  { key: 'INTAKE_COMPLETED', label: 'Intake Done', color: 'bg-sky-100 text-sky-700' },
  { key: 'PROPOSAL', label: 'Proposal', color: 'bg-amber-100 text-amber-700' },
  { key: 'NEGOTIATIONS', label: 'Negotiations', color: 'bg-orange-100 text-orange-700' },
  { key: 'CONTRACT_AND_PAYMENT', label: 'Contract & Payment', color: 'bg-emerald-100 text-emerald-700' },
  { key: 'CLOSED_WON', label: 'Closed Won ✓', color: 'bg-green-100 text-green-700' },
]

interface Lead {
  id: string
  firstName: string
  lastName: string
  email?: string
  company?: string
  stage: string
  assignee?: { name: string }
}

interface Column {
  stage: string
  leads: Lead[]
  count: number
}

export function PipelinePage() {
  const qc = useQueryClient()
  const { data: columns = [], isLoading } = useQuery<Column[]>({
    queryKey: ['pipeline'],
    queryFn: () => api.get('/leads/pipeline').then((r) => r.data),
  })

  const moveMutation = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: string }) =>
      api.patch(`/leads/${id}/stage`, { stage }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pipeline'] }),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-slate-500">Loading pipeline…</div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Pipeline</h1>
          <p className="text-sm text-slate-500">{columns.reduce((a, c) => a + c.count, 0)} leads total</p>
        </div>
        <a href="/leads" className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Add Lead
        </a>
      </div>

      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-4 h-full min-w-max">
          {STAGES.map((stageInfo) => {
            const col = columns.find((c) => c.stage === stageInfo.key)
            const leads = col?.leads || []
            return (
              <div key={stageInfo.key} className="w-64 flex-shrink-0 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${stageInfo.color}`}>
                    {stageInfo.label}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{leads.length}</span>
                </div>
                <div className="flex-1 space-y-2 overflow-y-auto">
                  {leads.map((lead) => (
                    <KanbanCard
                      key={lead.id}
                      lead={lead}
                      stages={STAGES}
                      onMove={(stage) => moveMutation.mutate({ id: lead.id, stage })}
                    />
                  ))}
                  {leads.length === 0 && (
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center">
                      <p className="text-xs text-slate-400">No leads</p>
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

function KanbanCard({
  lead,
  stages,
  onMove,
}: {
  lead: Lead
  stages: typeof STAGES
  onMove: (stage: string) => void
}) {
  const initials = `${lead.firstName[0]}${lead.lastName[0]}`.toUpperCase()

  return (
    <div className="card p-3 cursor-pointer hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-lgp-100 text-lgp-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              {lead.firstName} {lead.lastName}
            </p>
            {lead.company && <p className="text-xs text-slate-500 truncate">{lead.company}</p>}
          </div>
        </div>

        <select
          className="opacity-0 group-hover:opacity-100 text-xs border border-slate-200 rounded px-1 py-0.5 bg-white text-slate-700 flex-shrink-0 transition-opacity"
          value={lead.stage}
          onChange={(e) => onMove(e.target.value)}
          onClick={(e) => e.stopPropagation()}
        >
          {stages.map((s) => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>
      </div>
      {lead.assignee && (
        <p className="text-xs text-slate-400 mt-2 truncate">👤 {lead.assignee.name}</p>
      )}
    </div>
  )
}
