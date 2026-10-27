import type { ReactNode } from 'react'

export default function StatCard({ icon, value, label }: { icon: ReactNode; value: number | string; label: string }) {
  return (
    <div className="rounded-3xl bg-white/60 px-4 py-4 shadow-sm ring-1 ring-brown/10">
      <div className="flex items-center gap-2">
        <span className="shrink-0 text-brown">{icon}</span>
        <span className="text-2xl font-bold">{value}</span>
        <span className="whitespace-nowrap text-sm font-semibold text-brown/70">{label}</span>
      </div>
    </div>
  )
}