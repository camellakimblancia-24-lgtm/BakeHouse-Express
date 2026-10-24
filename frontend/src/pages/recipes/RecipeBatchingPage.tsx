import { useEffect, useState } from 'react'
import { getIngredients } from '../../api/ingredients'
import { addRecipe, getBatchLogs, getRecipes, logBatch } from '../../api/recipes'
import type { Ingredient } from '../../types/ingredients'
import type { BatchLog, Recipe } from '../../types/recipe'
import LogBatchForm from './LogBatchForm'
import RecipeForm from './RecipeForm'

const card = 'rounded-3xl bg-white/60 shadow-sm ring-1 ring-brown/10 backdrop-blur'

export default function RecipeBatchingPage() {
  const [tab, setTab] = useState<'recipes' | 'log'>('recipes')
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [logs, setLogs] = useState<BatchLog[]>([])
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')

  const load = async () => {
    setRecipes(await getRecipes())
    setIngredients(await getIngredients())
    setLogs(await getBatchLogs())
  }
  useEffect(() => { load() }, [])

  const ing = (id: number) => ingredients.find((i) => i.id === id)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="mr-auto text-2xl font-extrabold text-brown">Recipe Batching</h1>
        {(['recipes', 'log'] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setMessage('') }}
            className={`rounded-full px-5 py-2 text-sm font-bold ${tab === t ? 'bg-brown text-cream' : 'bg-white/60 text-brown hover:bg-white'}`}
          >
            {t === 'recipes' ? 'Recipes' : 'Log batch'}
          </button>
        ))}
      </div>

      {message && <div className="rounded-2xl bg-green-100 px-4 py-3 font-medium text-green-800">{message}</div>}

      {tab === 'recipes' && (
        <>
          <button onClick={() => setShowForm(true)} className="rounded-full bg-brown px-5 py-2 font-bold text-cream shadow">
            + New recipe
          </button>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((r) => (
              <div key={r.id} className={`p-5 ${card}`}>
                <h3 className="text-lg font-extrabold text-brown">{r.name}</h3>
                <p className="mb-2 text-sm text-brown/70">Yield: {r.yieldPerBatch} per batch</p>
                <ul className="text-sm text-brown">
                  {r.items.map((it) => (
                    <li key={it.ingredientId}>• {ing(it.ingredientId)?.name}: {it.quantity} {ing(it.ingredientId)?.unit}</li>
                  ))}
                </ul>
                <button onClick={() => setTab('log')} className="mt-3 text-sm font-bold text-brown underline">
                  Make batch
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'log' && recipes.length > 0 && (
        <>
          <LogBatchForm
            recipes={recipes}
            ingredients={ingredients}
            onLog={async (recipe, batches, baker) => {
              await logBatch(recipe, batches, baker)
              setMessage(`${baker} baked ${batches} batch(es) of ${recipe.name}. Ingredients deducted.`)
              load()
            }}
          />
          <div className={`overflow-x-auto ${card}`}>
            <h2 className="px-5 pt-4 text-lg font-extrabold text-brown">Batch history</h2>
            <table className="w-full text-left text-sm text-brown">
              <thead>
                <tr className="text-brown/70">
                  <th className="px-5 py-2">Date</th><th>Baker</th><th>Recipe</th><th>Batches</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-6 text-center text-brown/60">No batches logged yet</td></tr>
                )}
                {logs.map((l) => (
                  <tr key={l.id} className="border-t border-brown/10">
                    <td className="px-5 py-2">{l.date}</td><td>{l.baker}</td><td>{l.recipeName}</td><td>{l.batches}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {showForm && (
        <RecipeForm
          ingredients={ingredients}
          onClose={() => setShowForm(false)}
          onSave={async (data) => { await addRecipe(data); setShowForm(false); load() }}
        />
      )}
    </div>
  )
}