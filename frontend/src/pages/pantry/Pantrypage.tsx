import { useEffect, useState } from 'react'
import { AlertTriangle, Boxes, PackageX } from 'lucide-react'
import { addIngredient, adjustStock, getIngredients } from '../../api/ingredients'
import StockBadge from '../../components/ui/StockBadge'
import StatCard from '../../components/ui/StatCard'
import type { Category, Ingredient } from '../../types/ingredients'
import IngredientForm from './IngredientForm'
import StockAdjustModal from './StockAdjustModal'

const tabs: ('ALL' | Category)[] = ['ALL', 'DAIRY', 'DRY_GOODS', 'PRODUCE', 'PACKAGING']

export default function PantryPage() {
  const [items, setItems] = useState<Ingredient[]>([])
  const [filter, setFilter] = useState<'ALL' | Category>('ALL')
  const [search, setSearch] = useState('')
  const [lowOnly, setLowOnly] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [adjusting, setAdjusting] = useState<Ingredient | null>(null)

  const load = async () => setItems(await getIngredients())
  useEffect(() => { load() }, [])

  const lowCount = items.filter((i) => i.quantity < i.reorder_level).length
  const outCount = items.filter((i) => i.quantity <= 0).length
  const visible = items.filter(
    (i) =>
      (filter === 'ALL' || i.category === filter) &&
      i.name.toLowerCase().includes(search.toLowerCase()) &&
      (!lowOnly || i.quantity < i.reorder_level)
  )
  
  return (
    <div className="space--1">
      <div className="grid gap-2 sm:grid-cols-">
        <StatCard icon={<Boxes />} value={items.length} label="Total ingredients" />
        <StatCard icon={<AlertTriangle />} value={lowCount} label="Low on stock" />
        <StatCard icon={<PackageX />} value={outCount} label="Out of stock" />
      </div>

      {lowCount > 0 && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 font-medium text-amber-800">
          ⚠ {lowCount} ingredient{lowCount > 1 ? 's are' : ' is'} low on stock
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="mr-auto text-2xl font-extrabold text-brown">Pantry & Ingredients</h1>
        <input
          className="rounded-full border border-brown/20 bg-white/70 px-4 py-2"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <label className="flex items-center gap-2 text-sm font-medium text-brown">
          <input type="checkbox" checked={lowOnly} onChange={(e) => setLowOnly(e.target.checked)} />
          Low stock only
        </label>
        <button onClick={() => setShowAdd(true)} className="rounded-full bg-brown px-5 py-2 font-bold text-cream shadow">
          + Add ingredient
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              filter === t ? 'bg-brown text-cream' : 'bg-white/60 text-brown hover:bg-white'
            }`}
          >
            {t === 'ALL' ? 'All' : t.replace('_', ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-3xl bg-white/60 shadow-sm ring-1 ring-brown/10 backdrop-blur">
        <table className="w-full text-left">
          <thead>
            <tr className="text-brown/70">
              {['Ingredient', 'Category', 'In stock', 'Reorder level', 'Status', ''].map((h) => (
                <th key={h} className="px-5 py-4 text-sm font-bold uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-brown/60">No ingredients found</td></tr>
            )}
            {visible.map((i) => (
              <tr key={i.id} className="border-t border-brown/10 text-brown">
                <td className="px-5 py-3 font-bold">{i.name}</td>
                <td className="px-5 py-3">{i.category.replace('_', ' ')}</td>
                <td className="px-5 py-3">{i.quantity} {i.unit}</td>
                <td className="px-5 py-3">{i.reorder_level} {i.unit}</td>
                <td className="px-5 py-3"><StockBadge quantity={i.quantity} reorderLevel={i.reorder_level} /></td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => setAdjusting(i)} className="text-sm font-bold underline">
                    Adjust stock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <IngredientForm
          onClose={() => setShowAdd(false)}
          onSave={async (data) => { await addIngredient(data); setShowAdd(false); load() }}
        />
      )}
      {adjusting && (
        <StockAdjustModal
          ingredient={adjusting}
          onClose={() => setAdjusting(null)}
          onSave={async (change) => { await adjustStock(adjusting.id, change); setAdjusting(null); load() }}
        />
      )}
    </div>
  )
}