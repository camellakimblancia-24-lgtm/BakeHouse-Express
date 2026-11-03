import { useEffect, useMemo, useState } from 'react'
import { getLogs } from '../../api/logs'
import type { LogEntry, LogType } from '../../types/logs'

const filters: { value: 'all' | LogType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'stock', label: 'Stock' },
  { value: 'batch', label: 'Batches' },
  { value: 'sale', label: 'Sales' },
  { value: 'waste', label: 'Waste' },
]

const badgeStyles: Record<LogType, string> = {
  stock: 'bg-amber-100 text-amber-800',
  batch: 'bg-orange-100 text-orange-800',
  sale: 'bg-emerald-100 text-emerald-800',
  waste: 'bg-red-100 text-red-700',
}

const badgeLabels: Record<LogType, string> = {
  stock: 'Stock',
  batch: 'Batch',
  sale: 'Sale',
  waste: 'Waste',
}

export default function OperationsLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | LogType>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    getLogs()
      .then(setLogs)
      .finally(() => setLoading(false))
  }, [])

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase()
    return logs.filter((log) => {
      const matchesType = filter === 'all' || log.type === filter
      const matchesSearch =
        term === '' ||
        log.description.toLowerCase().includes(term) ||
        log.user.toLowerCase().includes(term)
      return matchesType && matchesSearch
    })
  }, [logs, filter, search])

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold text-brown">Operations Logs</h1>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search logs..."
          className="w-64 rounded-full bg-white/60 px-5 py-3 text-sm text-brown shadow-sm ring-1 ring-brown/10 outline-none placeholder:text-brown/50 focus:bg-white"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              filter === f.value
                ? 'bg-brown text-cream'
                : 'bg-white/60 text-brown hover:bg-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-3xl bg-white/60 shadow-sm ring-1 ring-brown/10">
        <table className="w-full text-left text-sm text-brown">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-brown/70">
              <th className="px-6 py-4">Time</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Activity</th>
              <th className="px-6 py-4">By</th>
              <th className="px-6 py-4 text-right">Change</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((log) => (
              <tr key={log.id} className="border-t border-brown/10">
                <td className="whitespace-nowrap px-6 py-4 text-brown/70">
                  {new Date(log.time).toLocaleString('en-PH', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeStyles[log.type]}`}>
                    {badgeLabels[log.type]}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold">{log.description}</td>
                <td className="px-6 py-4 text-brown/70">{log.user}</td>
                <td className="whitespace-nowrap px-6 py-4 text-right font-semibold">{log.change}</td>
              </tr>
            ))}
            {loading && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-brown/60">
                  Loading logs...
                </td>
              </tr>
            )}
            {!loading && visible.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-brown/60">
                  No logs match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}