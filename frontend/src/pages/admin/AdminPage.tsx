import { useMemo, useState } from 'react'
import type { LogEntry, LogType } from '../../types/logs'

const logs: LogEntry[] = [
  { id: 1, time: '2026-10-27T08:15:00', type: 'stock', description: 'Adjusted Butter stock', user: 'Kim Blancia', change: '+5 kg' },
  { id: 2, time: '2026-10-27T09:40:00', type: 'batch', description: 'Logged 3 batches of Pandesal', user: 'Kim Blancia', change: '-6 kg Flour' },
  { id: 3, time: '2026-10-27T10:05:00', type: 'sale', description: 'Sold 4 Ensaymada', user: 'Counter', change: '-4 pcs' },
  { id: 4, time: '2026-10-27T11:30:00', type: 'stock', description: 'Marked Milk as low stock', user: 'Kim Blancia', change: '-2 L' },
  { id: 5, time: '2026-10-27T13:10:00', type: 'sale', description: 'Sold 2 Cinnamon Rolls', user: 'Counter', change: '-2 pcs' },
]

const filters: { value: 'all' | LogType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'stock', label: 'Stock' },
  { value: 'batch', label: 'Batches' },
  { value: 'sale', label: 'Sales' },
]

const badgeStyles: Record<LogType, string> = {
  stock: 'bg-amber-100 text-amber-800',
  batch: 'bg-orange-100 text-orange-800',
  sale: 'bg-emerald-100 text-emerald-800',
}

const badgeLabels: Record<LogType, string> = {
  stock: 'Stock',
  batch: 'Batch',
  sale: 'Sale',
}

export default function AdminPage() {
  const [filter, setFilter] = useState<'all' | LogType>('all')
  const [search, setSearch] = useState('')

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
  }, [filter, search])

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold text-brown">Admin</h1>
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
            {visible.length === 0 && (
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