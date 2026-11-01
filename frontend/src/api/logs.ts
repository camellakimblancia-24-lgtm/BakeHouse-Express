import type { LogEntry } from '../types/logs'

const KEY = 'bakehouse-logs'

const seed: LogEntry[] = [
  { id: 1, time: '2026-10-27T08:15:00', type: 'stock', description: 'Adjusted Butter stock', user: 'Kim Blancia', change: '+5 kg' },
  { id: 2, time: '2026-10-27T09:40:00', type: 'batch', description: 'Logged 3 batches of Pandesal', user: 'Kim Blancia', change: '-6 kg Flour' },
  { id: 3, time: '2026-10-27T10:05:00', type: 'sale', description: 'Sold 4 Ensaymada', user: 'Counter', change: '-4 pcs' },
  { id: 4, time: '2026-10-27T11:30:00', type: 'stock', description: 'Marked Milk as low stock', user: 'Kim Blancia', change: '-2 L' },
  { id: 5, time: '2026-10-27T13:10:00', type: 'sale', description: 'Sold 2 Cinnamon Rolls', user: 'Counter', change: '-2 pcs' },
]

function load(): LogEntry[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as LogEntry[]
  } catch {
  }
  return seed
}

function save(list: LogEntry[]) {
  localStorage.setItem(KEY, JSON.stringify(list))
}

export async function getLogs(): Promise<LogEntry[]> {
  return [...load()].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
}

export async function addLog(entry: Omit<LogEntry, 'id' | 'time'>): Promise<LogEntry> {
  const list = load()
  const log: LogEntry = {
    ...entry,
    id: Math.max(0, ...list.map((l) => l.id)) + 1,
    time: new Date().toISOString(),
  }
  save([log, ...list])
  return log
}