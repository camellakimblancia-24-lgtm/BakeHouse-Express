import type { ReactNode } from 'react'

export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children?: ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cream via-orange-50 to-rose-100 px-4">
      <div className="w-full max-w-md space-y-5 rounded-3xl bg-white/70 p-8 shadow-sm ring-1 ring-brown/10">
        <div className="space-y-1">
          <p className="text-sm font-extrabold uppercase tracking-wide text-brown/70">BakeHouse Express</p>
          <h1 className="text-2xl font-extrabold text-brown">{title}</h1>
          {subtitle && <p className="text-sm text-brown/70">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  )
}