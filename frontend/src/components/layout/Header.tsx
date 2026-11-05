import { useEffect, useState } from 'react'
import { Bell, ChevronDown } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import NavTabs, { MobileNavMenu } from './NavTabs'
import { getIngredients } from '../../api/ingredients'
import type { Ingredient } from '../../types/ingredients'
import { ROLE_LABELS, useRole } from '../../types/roles'
import logo from '../../assets/logo.png'

const iconButton =
  'flex h-10 w-10 items-center justify-center rounded-full bg-white/60 text-brown shadow-sm ring-1 ring-brown/10 backdrop-blur transition hover:bg-white sm:h-11 sm:w-11'

type StockAlert = { ingredient: Ingredient; level: 'out' | 'low' }

function getAlerts(ingredients: Ingredient[]): StockAlert[] {
  const alerts: StockAlert[] = []
  for (const ingredient of ingredients) {
    if (ingredient.quantity <= 0) alerts.push({ ingredient, level: 'out' })
    else if (ingredient.quantity < ingredient.reorder_level) alerts.push({ ingredient, level: 'low' })
  }
  return alerts.sort((a, b) => (a.level === b.level ? 0 : a.level === 'out' ? -1 : 1))
}

export default function Header() {

  const storedUser = localStorage.getItem("bakehouse_user")
  const current_user = storedUser ? JSON.parse(storedUser) : null
  
  const {user, canAccess} = useRole()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const [alerts, setAlerts] = useState<StockAlert[]>([])

  useEffect(() => {
    let active = true
    const refresh = () =>
      getIngredients()
        .then((list) => {
          if (active) setAlerts(getAlerts(list))
        })
        .catch(() => {})
    refresh()
    window.addEventListener('bakehouse-stock-changed', refresh)
    return () => {
      active = false
      window.removeEventListener('bakehouse-stock-changed', refresh)
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

  function logout() {
    localStorage.removeItem('bakehouse_auth_token')
    localStorage.removeItem('bakehouse_user_role')
    localStorage.removeItem('bakehouse_user_name')
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-8 sm:py-5 lg:px-10">
      {}
      <div className="flex shrink-0 items-center gap-3">
        <MobileNavMenu />
        <img src={logo} alt="BakeHouse Express logo" className="h-9 w-9 shrink-0 rounded-full object-cover sm:h-12 sm:w-12" />
        <span className="truncate text-base font-extrabold uppercase tracking-wide text-brown sm:text-xl">
          BakeHouse Express
        </span>
      </div>

      <div className="order-3 hidden w-full justify-center lg:flex xl:order-2 xl:w-auto xl:flex-1">
        <NavTabs />
      </div>

      <div className="order-2 ml-auto flex shrink-0 items-center gap-2 sm:gap-3 xl:order-3">
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
              <div className="fixed inset-x-4 top-18 z-20 rounded-2xl bg-white p-2 shadow-lg ring-1 ring-brown/10 sm:absolute sm:inset-x-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-80">
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
                        <span className="min-w-0 leading-tight">
                          <span className="block truncate text-sm font-semibold text-brown">{ingredient.name}</span>
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
            aria-label="Account menu"
            className="flex items-center gap-3 rounded-full bg-white/60 p-1.5 shadow-sm ring-1 ring-brown/10 backdrop-blur transition hover:bg-white sm:pr-4"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brown text-sm font-bold text-cream">
              {current_user.first_name[0]+current_user.last_name[0]}
            </span>
            <span className="hidden text-left leading-tight sm:block">
              <span className="block text-sm font-semibold text-brown">{current_user.first_name + " " + current_user.last_name}</span>
              <span className="block text-xs text-brown/60">{ROLE_LABELS[current_user.role]}</span>
            </span>
            <ChevronDown size={16} className="hidden text-brown/60 sm:block" />
          </button>

          {menuOpen && (
            <>
              <button
                aria-label="Close menu"
                className="fixed inset-0 z-10 cursor-default"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 z-20 mt-2 w-56 rounded-2xl bg-white p-2 shadow-lg ring-1 ring-brown/10">
                <div className="px-3 py-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brown/60">Signed in as</p>
                  <p className="truncate text-sm font-semibold text-brown">{current_user.first_name + " " + current_user.last_name}</p>
                  <p className="text-xs text-brown/60">{ROLE_LABELS[current_user.role]}</p>
                </div>
                <div className="mt-1 border-t border-brown/10 pt-1">
                  <button
                    onClick={logout}
                    className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-red-700 transition hover:bg-red-50"
                  >
                    Log out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}