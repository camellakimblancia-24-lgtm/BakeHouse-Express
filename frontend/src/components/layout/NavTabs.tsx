import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useRole } from '../../types/roles'

const tabs = [
  { to: '/pantry', label: 'Pantry & Ingredients' },
  { to: '/recipes', label: 'Recipe Batching' },
  { to: '/counter', label: 'Display Counter & POS' },
  { to: '/logs', label: 'Operations Logs' },
  { to: '/admin/workers', label: 'Workers' },
]

export function MobileNavMenu() {
  const { canAccess } = useRole()
  const [open, setOpen] = useState(false)

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/60 text-brown shadow-sm ring-1 ring-brown/10 backdrop-blur transition hover:bg-white"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {open && (
        <>
          <button
            aria-label="Close navigation"
            className="fixed inset-0 z-20 cursor-default"
            onClick={() => setOpen(false)}
          />
          <nav className="fixed inset-x-4 top-[4.5rem] z-30 rounded-2xl bg-white p-2 shadow-lg ring-1 ring-brown/10">
            {tabs.filter((tab) => canAccess(tab.to)).map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive ? 'bg-brown text-cream' : 'text-brown hover:bg-cream'
                  }`
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </nav>
        </>
      )}
    </div>
  )
}

export default function NavTabs() {
  const { canAccess } = useRole()

  return (
    <nav className="hidden lg:block">
      <div className="flex gap-1 rounded-full bg-white/60 p-1.5 shadow-sm ring-1 ring-brown/10">
        {tabs.filter((tab) => canAccess(tab.to)).map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-brown text-cream shadow-md'
                  : 'text-brown/70 hover:bg-brown/10 hover:text-brown'
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}