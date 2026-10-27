import { useState } from 'react'
import Modal from '../../components/ui/Modal'
import type { Ingredient } from '../../types/ingredients'
import type { Recipe, RecipeItem } from '../../types/recipe'

const inputClass = 'w-full rounded-lg border border-brown/30 bg-white px-3 py-2'

export default function RecipeForm({ ingredients, onSave, onClose }: {
  ingredients: Ingredient[]
  onSave: (data: Omit<Recipe, 'id'>) => void
  onClose: () => void
}) {
  const [name, setName] = useState('')
  const [yieldPerBatch, setYield] = useState(1)
  const [items, setItems] = useState<RecipeItem[]>([{ ingredientId: ingredients[0]?.id ?? 0, quantity: 0 }])
  const [error, setError] = useState('')

  const update = (index: number, patch: Partial<RecipeItem>) =>
    setItems(items.map((it, i) => (i === index ? { ...it, ...patch } : it)))

  const submit = () => {
    if (!name.trim()) return setError('Recipe name is required')
    if (items.some((it) => it.quantity <= 0)) return setError('Every ingredient needs a quantity above 0')
    onSave({ name: name.trim(), yieldPerBatch, items })
  }

  return (
    <Modal title="New recipe" onClose={onClose}>
      <div className="space-y-3">
        <input className={inputClass} placeholder="Recipe name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="number" min={1} className={inputClass} placeholder="Yield per batch" value={yieldPerBatch} onChange={(e) => setYield(Number(e.target.value))} />

        <p className="text-sm font-bold text-brown">Ingredients per batch</p>
        {items.map((it, index) => {
          const unit = ingredients.find((g) => g.id === it.ingredientId)?.unit
          return (
            <div key={index} className="flex items-center gap-2">
              <select className={inputClass} value={it.ingredientId} onChange={(e) => update(index, { ingredientId: Number(e.target.value) })}>
                {ingredients.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
              <input type="number" min={0} step="0.1" className="w-24 rounded-lg border border-brown/30 bg-white px-3 py-2" value={it.quantity} onChange={(e) => update(index, { quantity: Number(e.target.value) })} />
              <span className="w-8 text-sm text-brown">{unit}</span>
              <button onClick={() => setItems(items.filter((_, i) => i !== index))} disabled={items.length === 1} className="text-xl text-brown disabled:opacity-30">×</button>
            </div>
          )
        })}
        <button onClick={() => setItems([...items, { ingredientId: ingredients[0]?.id ?? 0, quantity: 0 }])} className="text-sm font-bold text-brown underline">
          + Add ingredient
        </button>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <button onClick={submit} className="w-full rounded-lg bg-brown py-2 font-bold text-cream">Save recipe</button>
      </div>
    </Modal>
  )
}