export type LogType = 'stock' | 'batch' | 'sale'

export interface LogEntry {
  id: number
  time: string
  type: LogType
  description: string
  user: string
  change: string
}