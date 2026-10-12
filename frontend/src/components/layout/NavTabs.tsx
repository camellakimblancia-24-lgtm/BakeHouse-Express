import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/pantry', label: 'Pantry & Ingredients' },
  { to: '/recipes', label: 'Recipe Batching' },
  { to: '/counter', label: 'Display Counter & POS' },
  { to: '/logs', label: 'Operations Logs' },
]

export default function NavTabs() {
  return (
    <nav className="flex items-center gap-1 rounded-full bg-white/50 p-1.5 shadow-sm ring-1 ring-brown/10 backdrop-blur">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            `rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
              isActive
                ? 'bg-white text-brown shadow-md'
                : 'text-brown/60 hover:bg-white/60 hover:text-brown'
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}