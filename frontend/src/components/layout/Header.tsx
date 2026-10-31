import { useEffect, useState } from 'react'
import { Bell, ChevronDown } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import NavTabs from './NavTabs'
import { getIngredients } from '../../api/ingredients'
import type { Ingredient } from '../../types/ingredients'
import { DEFAULT_ROUTE, ROLE_LABELS, STAFF, useRole } from '../../types/roles'

const iconButton =
  'flex h-11 w-11 items-center justify-center rounded-full bg-white/60 text-brown shadow-sm ring-1 ring-brown/10 backdrop-blur transition hover:bg-white'

type StockAlert = { ingredient: Ingredient; level: 'out' | 'low' }

function getAlerts(ingredients: Ingredient[]): StockAlert[] {
  const alerts: StockAlert[] = []
  for (const ingredient of ingredients) {
    if (ingredient.quantity <= 0) alerts.push({ ingredient, level: 'out' })
    else if (ingredient.quantity <= ingredient.reorder_level) alerts.push({ ingredient, level: 'low' })
  }
  return alerts.sort((a, b) => (a.level === b.level ? 0 : a.level === 'out' ? -1 : 1))
}

export default function Header() {
  const { user, setUser, canAccess } = useRole()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const [alerts, setAlerts] = useState<StockAlert[]>([])

  useEffect(() => {
    let active = true
    getIngredients()
      .then((list) => {
        if (active) setAlerts(getAlerts(list))
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  function toggleBell() {
    const next = !bellOpen
    setBellOpen(next)
    setMenuOpen(false)
    if (next) {
      getIngredients()
        .then((list) => setAlerts(getAlerts(list)))
        .catch(() => {})
    }
  }

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
        <div className="relative">
          <button className={`${iconButton} relative`} aria-label="Notifications" onClick={toggleBell}>
            <Bell size={18} />
            {alerts.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {alerts.length}
              </span>
            )}
          </button>

          {bellOpen && (
            <>
              <button
                aria-label="Close notifications"
                className="fixed inset-0 z-10 cursor-default"
                onClick={() => setBellOpen(false)}
              />
              <div className="absolute right-0 z-20 mt-2 w-80 rounded-2xl bg-white p-2 shadow-lg ring-1 ring-brown/10">
                <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-brown/60">
                  Stock alerts
                </p>

                {alerts.length === 0 ? (
                  <p className="px-3 py-4 text-sm text-brown/60">All ingredients are well stocked.</p>
                ) : (
                  <ul className="max-h-72 space-y-1 overflow-y-auto">
                    {alerts.map(({ ingredient, level }) => (
                      <li
                        key={ingredient.id}
                        className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 hover:bg-cream"
                      >
                        <span className="leading-tight">
                          <span className="block text-sm font-semibold text-brown">{ingredient.name}</span>
                          <span className="block text-xs text-brown/60">
                            {ingredient.quantity} {ingredient.unit} left, reorder at {ingredient.reorder_level}{' '}
                            {ingredient.unit}
                          </span>
                        </span>
                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                            level === 'out' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {level === 'out' ? 'Out' : 'Low'}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {canAccess('/pantry') && (
                  <Link
                    to="/pantry"
                    onClick={() => setBellOpen(false)}
                    className="mt-1 block rounded-xl px-3 py-2 text-center text-sm font-bold text-brown underline hover:bg-cream"
                  >
                    Go to pantry
                  </Link>
                )}
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setMenuOpen((o) => !o)
              setBellOpen(false)
            }}
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

          {menuOpen && (
            <>
              <button
                aria-label="Close menu"
                className="fixed inset-0 z-10 cursor-default"
                onClick={() => setMenuOpen(false)}
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
                      setMenuOpen(false)
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