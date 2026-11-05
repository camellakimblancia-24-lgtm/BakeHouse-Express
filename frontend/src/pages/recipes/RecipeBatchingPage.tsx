import { useEffect, useState } from 'react'
import { getIngredients } from '../../api/ingredients'
import { addRecipe, getBatchLogs, getRecipes } from '../../api/recipes'
import { bakeBatch, removeRecipe } from '../../api/production'
import Modal from '../../components/ui/Modal'
import { useRole } from '../../types/roles'
import type { Ingredient } from '../../types/ingredients'
import type { BatchLog, Recipe, RecipeCategory } from '../../types/recipe'
import LogBatchForm from './LogBatchForm'
import RecipeCard from './RecipeCard'
import RecipeForm from './RecipeForm'


const card = 'rounded-3xl bg-white/60 shadow-sm ring-1 ring-brown/10 backdrop-blur'

export default function RecipeBatchingPage() {
  const { user } = useRole()
  const canDelete = user.role === 'admin'

  const [tab, setTab] = useState<'recipes' | 'log'>('recipes')
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [logs, setLogs] = useState<BatchLog[]>([])
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [category, setCategory] = useState<'ALL' | RecipeCategory>('ALL')
  const [bakeId, setBakeId] = useState<number | undefined>()
  const [deleting, setDeleting] = useState<Recipe | null>(null)
  const [deleteError, setDeleteError] = useState('')
  const [busy, setBusy] = useState(false)

  const load = async () => {
    setRecipes(await getRecipes())
    setIngredients(await getIngredients())
    setLogs(await getBatchLogs())
  }
  useEffect(() => { load() }, [])

  const confirmDelete = async () => {
    if (!deleting) return
    setBusy(true)
    setDeleteError('')
    try {
      await removeRecipe(deleting.id)
      if (bakeId === deleting.id) setBakeId(undefined)
      setError('')
      setMessage(`${deleting.name} was deleted.`)
      setDeleting(null)
      await load()
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Could not delete this recipe.')
    } finally {
      setBusy(false)
    }
  }

  const shown = recipes.filter((r) => category === 'ALL' || r.category === category)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="mr-auto text-2xl font-extrabold text-brown">Recipe Batching</h1>
        {(['recipes', 'log'] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setMessage(''); setError('') }}
            className={`rounded-full px-5 py-2 text-sm font-bold ${tab === t ? 'bg-brown text-cream' : 'bg-white/60 text-brown hover:bg-white'}`}
          >
            {t === 'recipes' ? 'Recipes' : 'Log batch'}
          </button>
        ))}
      </div>

      {message && <div className="rounded-2xl bg-green-100 px-4 py-3 font-medium text-green-800">{message}</div>}
      {error && <div className="rounded-2xl bg-red-100 px-4 py-3 font-medium text-red-800">{error}</div>}

      {tab === 'recipes' && (
        <>
          <div className="flex flex-wrap items-center gap-2">
            {(['ALL', 'BREAD', 'COOKIES', 'PASTRIES', 'CAKES'] as const).map((c) => {
              const count = c === 'ALL' ? recipes.length : recipes.filter((r) => r.category === c).length
              return (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`rounded-full px-4 py-1.5 text-sm font-bold ${category === c ? 'bg-brown text-cream' : 'bg-brown/10 text-brown'}`}
                >
                  {c} <span className="font-normal opacity-70">({count})</span>
                </button>
              )
            })}
            <button onClick={() => setShowForm(true)} className="ml-auto rounded-full bg-brown px-5 py-2 font-bold text-cream shadow">
              + New recipe
            </button>
          </div>

          {shown.length === 0 && (
            <p className="rounded-2xl bg-white/60 px-4 py-6 text-center text-sm text-brown/70">
              No recipes here yet. Use + New recipe to add one.
            </p>
          )}

          <div className="grid gap-5 lg:grid-cols-2">
            {shown.map((r) => (
              <RecipeCard
                key={r.id}
                recipe={r}
                ingredients={ingredients}
                onBake={() => { setBakeId(r.id); setTab('log'); setMessage(''); setError('') }}
                onDelete={canDelete ? () => { setDeleting(r); setDeleteError('') } : undefined}
              />
            ))}
          </div>
        </>
      )}

      {tab === 'log' && recipes.length > 0 && (
        <>
          <LogBatchForm
            key={bakeId}
            initialRecipeId={bakeId}
            recipes={recipes}
            ingredients={ingredients}
            onLog={async (recipe, batches, baker) => {
              setMessage('')
              setError('')
              try {
                const produced = await bakeBatch(recipe, batches, baker)
                setMessage(
                  `${baker} baked ${batches} batch(es) of ${recipe.name}. Ingredients deducted and ${produced} ${recipe.yieldLabel} added to the display counter.`,
                )
                load()
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Could not log this batch.')
              }
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

      {deleting && (
        <Modal title="Delete recipe" onClose={() => setDeleting(null)}>
          <div className="space-y-4">
            <p className="text-sm text-brown">
              Delete <b>{deleting.name}</b>? The recipe and its tray on the display counter will be removed.
              Past batch history, sales and logs are kept.
            </p>
            {deleteError && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{deleteError}</p>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => setDeleting(null)}
                className="flex-1 rounded-lg bg-brown/10 py-2 font-semibold text-brown"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={busy}
                className="flex-1 rounded-lg bg-red-700 py-2 font-semibold text-white disabled:opacity-50"
              >
                {busy ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}