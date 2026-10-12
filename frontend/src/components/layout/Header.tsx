import { Bell, ChevronDown, Search } from 'lucide-react'
import NavTabs from './NavTabs'

const iconButton =
  'flex h-11 w-11 items-center justify-center rounded-full bg-white/60 text-brown shadow-sm ring-1 ring-brown/10 backdrop-blur transition hover:bg-white'

export default function Header() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 px-8 py-5">
      <div className="flex items-center gap-3">
        {/* replace with your logo: <img src={logo} className="h-10" /> */}
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-300 to-orange-500" />
        <span className="text-xl font-extrabold uppercase tracking-wide text-brown">
          BakeHouse Express
        </span>
      </div>

      <NavTabs />

      <div className="flex items-center gap-3">
        <button className={iconButton} aria-label="Search"><Search size={18} /></button>
        <button className={`${iconButton} relative`} aria-label="Notifications">
          <Bell size={18} />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <button className="flex items-center gap-3 rounded-full bg-white/60 py-1.5 pl-1.5 pr-4 shadow-sm ring-1 ring-brown/10 backdrop-blur transition hover:bg-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brown text-sm font-bold text-cream">
            KB
          </span>
          <span className="text-left leading-tight">
            <span className="block text-sm font-semibold text-brown">Kim Blancia</span>
            <span className="block text-xs text-brown/60">Head Manager</span>
          </span>
          <ChevronDown size={16} className="text-brown/60" />
        </button>
      </div>
    </header>
  )
}