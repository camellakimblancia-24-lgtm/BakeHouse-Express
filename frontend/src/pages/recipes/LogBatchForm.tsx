import { useState } from 'react'
import type { Ingredient } from '../../types/ingredients'
import type { Recipe } from '../../types/recipe'

const inputClass = 'w-full rounded-lg border border-brown/30 bg-white px-3 py-2'
const card = 'rounded-3xl bg-white/60 p-6 shadow-sm ring-1 ring-brown/10 backdrop-blur'

export default function LogBatchForm({ recipes, ingredients, onLog }: {
  recipes: Recipe[]
  ingredients: Ingredient[]
  onLog: (recipe: Recipe, batches: number, baker: string) => void
}) {
  const [recipeId, setRecipeId] = useState(recipes[0]?.id ?? 0)
  const [batches, setBatches] = useState(1)
  const [baker, setBaker] = useState('')

  const recipe = recipes.find((r) => r.id === recipeId)
  const rows = (recipe?.items ?? []).map((it) => {
    const ing = ingredients.find((g) => g.id === it.ingredientId)
    const needed = Math.round(it.quantity * batches * 100) / 100
    const stock = ing?.quantity ?? 0
    return { id: it.ingredientId, name: ing?.name ?? '?', unit: ing?.unit ?? '', needed, stock, short: stock < needed }
  })
  const hasShortage = rows.some((r) => r.short)
  const canSubmit = !!recipe && batches >= 1 && baker.trim() !== '' && !hasShortage

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className={`space-y-3 ${card}`}>
        <h2 className="text-lg font-extrabold text-brown">Log baking batch</h2>
        <input className={inputClass} placeholder="Baker name" value={baker} onChange={(e) => setBaker(e.target.value)} />
        <select className={inputClass} value={recipeId} onChange={(e) => setRecipeId(Number(e.target.value))}>
          {recipes.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <input type="number" min={1} className={inputClass} value={batches} onChange={(e) => setBatches(Number(e.target.value))} />
        {recipe && <p className="text-sm text-brown/70">Makes {recipe.yieldPerBatch * batches} pieces</p>}
        <button
          disabled={!canSubmit}
          onClick={() => recipe && onLog(recipe, batches, baker.trim())}
          className="w-full rounded-lg bg-brown py-2 font-bold text-cream disabled:opacity-40"
        >
          Log batch
        </button>
      </div>

      <div className={card}>
        <h2 className="mb-3 text-lg font-extrabold text-brown">Ingredients to be deducted</h2>
        <table className="w-full text-left text-sm text-brown">
          <thead>
            <tr className="text-brown/70"><th className="py-1">Ingredient</th><th>Needed</th><th>In stock</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className={r.short ? 'font-bold text-red-600' : ''}>
                <td className="py-1">{r.name}</td>
                <td>{r.needed} {r.unit}</td>
                <td>{r.stock} {r.unit}{r.short && ' (not enough)'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {hasShortage && <p className="mt-3 text-sm text-red-600">Not enough stock to bake this batch.</p>}
      </div>
    </div>
  )
}