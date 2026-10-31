import { useState } from 'react'
import { Bell, ChevronDown, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import NavTabs from './NavTabs'
import { DEFAULT_ROUTE, ROLE_LABELS, STAFF, useRole } from '../../types/roles'

const iconButton =
  'flex h-11 w-11 items-center justify-center rounded-full bg-white/60 text-brown shadow-sm ring-1 ring-brown/10 backdrop-blur transition hover:bg-white'

export default function Header() {
  const { user, setUser } = useRole()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  return (
    <header className="flex items-center gap-4 px-8 py-5">
      <div className="flex shrink-0 items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-300 to-orange-500" />
        <span className="whitespace-nowrap text-xl font-extrabold uppercase tracking-wide text-brown">
          BakeHouse Express
        </span>
      </div>

      <div className="flex flex-1 justify-center">
        <NavTabs />
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <button className={iconButton} aria-label="Search"><Search size={18} /></button>
        <button className={`${iconButton} relative`} aria-label="Notifications">
          <Bell size={18} />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-3 rounded-full bg-white/60 py-1.5 pl-1.5 pr-4 shadow-sm ring-1 ring-brown/10 backdrop-blur transition hover:bg-white"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brown text-sm font-bold text-cream">
              {user.initials}
            </span>
            <span className="text-left leading-tight">
              <span className="block text-sm font-semibold text-brown">{user.name}</span>
              <span className="block text-xs text-brown/60">{ROLE_LABELS[user.role]}</span>
            </span>
            <ChevronDown size={16} className="text-brown/60" />
          </button>

          {open && (
            <>
              <button
                aria-label="Close menu"
                className="fixed inset-0 z-10 cursor-default"
                onClick={() => setOpen(false)}
              />
              <div className="absolute right-0 z-20 mt-2 w-64 rounded-2xl bg-white p-2 shadow-lg ring-1 ring-brown/10">
                <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-brown/60">
                  Switch staff
                </p>
                {STAFF.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => {
                      setUser(s)
                      setOpen(false)
                      navigate(DEFAULT_ROUTE[s.role])
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-cream ${
                      s.name === user.name ? 'bg-cream' : ''
                    }`}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brown text-xs font-bold text-cream">
                      {s.initials}
                    </span>
                    <span className="leading-tight">
                      <span className="block text-sm font-semibold text-brown">{s.name}</span>
                      <span className="block text-xs text-brown/60">{ROLE_LABELS[s.role]}</span>
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}