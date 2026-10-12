import type { ReactNode } from 'react'

export default function StatCard({ icon, value, label }: { icon: ReactNode; value: string | number; label: string }) {
  return (
    <div className="rounded-3xl bg-white/60 p-5 shadow-sm ring-1 ring-brown/10 backdrop-blur">
      <div className="mb-3 text-brown">{icon}</div>
      <p className="text-3xl font-bold text-brown">{value}</p>
      <p className="text-sm text-brown/60">{label}</p>
    </div>
  )
}