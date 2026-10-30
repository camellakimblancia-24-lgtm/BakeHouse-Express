import { NavLink } from 'react-router-dom'
import { useRole } from '../../types/roles'

const tabs = [
  { to: '/pantry', label: 'Pantry & Ingredients' },
  { to: '/recipes', label: 'Recipe Batching' },
  { to: '/counter', label: 'Display Counter & POS' },
  { to: '/logs', label: 'Operations Logs' },
  { to: '/staff', label: 'Staff' },
]

export default function NavTabs() {
  const { canAccess } = useRole()

  return (
    <nav>
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