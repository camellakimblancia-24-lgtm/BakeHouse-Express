import { NavLink } from 'react-router-dom'
import { useRole } from '../../types/roles'

const tabs = [
  { to: '/pantry', label: 'Pantry & Ingredients' },
  { to: '/recipes', label: 'Recipe Batching' },
  { to: '/counter', label: 'Display Counter & POS' },
  { to: '/logs', label: 'Operations Logs' },
  { to: '/staff', label: 'Staff' },
  { to: '/admin', label: 'Admin' },
]

export default function NavTabs() {
  const { canAccess } = useRole()

  return (
    <nav className="flex justify-center">
      <div className="flex max-w-full items-center gap-1 rounded-full bg-white/60 p-1.5 shadow-sm ring-1 ring-brown/10">
        {tabs.filter((tab) => canAccess(tab.to)).map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `group relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-brown text-cream shadow-md'
                  : 'text-brown/60 hover:bg-brown/10 hover:text-brown'
                  : 'text-brown/70 hover:bg-brown/10 hover:text-brown'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="relative z-10">{tab.label}</span>
                <span
                  className={`absolute left-1/2 top-full h-1.5 w-1.5 -translate-x-1/2 rounded-full transition-all ${
                    isActive ? 'translate-y-1 bg-cream' : 'translate-y-0 bg-transparent group-hover:bg-brown/20'
                  }`}
                />
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}