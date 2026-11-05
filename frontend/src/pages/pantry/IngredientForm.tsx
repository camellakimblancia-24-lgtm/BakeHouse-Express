import { useState } from 'react'
import Modal from '../../components/ui/Modal'
import type { Category, Ingredient } from '../../types/ingredients'

const inputClass = 'w-full rounded-lg border border-brown/30 bg-white px-3 py-2'

export default function IngredientForm({ onSave, onClose }: {
  onSave: (data: Omit<Ingredient, 'id'>) => void
  onClose: () => void
}) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState<Category>('DRY_GOODS')
  const [unit, setUnit] = useState('kg')
  const [quantity, setQuantity] = useState(0)
  const [reorder, setReorder] = useState(0)
  const [costPerUnit, setCostPerUnit] = useState(0)
  const [error, setError] = useState('')
  

  const submit = () => {
    if (!name.trim()) return setError('Name is required')
    if (quantity < 0 || reorder < 0 || costPerUnit < 0 ) return setError('Numbers cannot be negative')
    onSave({ name: name.trim(), category, unit, quantity, reorder_level: reorder, cost_per_unit: costPerUnit })
  }

  return (
    <Modal title="Add ingredient" onClose={onClose}>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-brown mb-1">Ingredient Name</label>
          <input className={inputClass} placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-brown mb-1">Category</label>
          <select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value as Category)}>
            <option value="DAIRY">Dairy</option>
            <option value="DRY_GOODS">Dry Goods</option>
            <option value="PRODUCE">Produce</option>
            <option value="PACKAGING">Packaging</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-brown mb-1">Unit of Measurement</label>
          <select className={inputClass} value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option>kg</option><option>g</option><option>L</option><option>pcs</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-brown mb-1">Stock Level</label>
          <input type="number" className={inputClass} placeholder="Starting quantity" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-brown mb-1">Reorder Level</label>
          <input type="number" className={inputClass} placeholder="Reorder level" value={reorder} onChange={(e) => setReorder(Number(e.target.value))} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-brown mb-1">Cost Per Unit</label>
          <input type="number" className={inputClass} placeholder="Cost Per Unit" value={costPerUnit} onChange={(e) => setCostPerUnit(Number(e.target.value))} />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="w-full rounded-lg bg-brown py-2 font-semibold text-cream">
          Save
        </button>
      </form>
    </Modal>
  )
}