import { Flame } from 'lucide-react'
import type { Ingredient } from '../../types/ingredients'
import type { Recipe } from '../../types/recipe'

export default function RecipeCard({ recipe, ingredients, onBake }: {
  recipe: Recipe
  ingredients: Ingredient[]
  onBake: () => void
}) {
  const ing = (id: number) => ingredients.find((i) => i.id === id)

  return (
    <div className="rounded-3xl border border-brown/40 bg-cream/70 p-5 shadow-sm">
      <div className="flex gap-4">
        {recipe.image ? (
          <img src={recipe.image} alt={recipe.name} className="h-20 w-20 rounded-full object-cover" />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brown/10 text-2xl font-bold text-brown">
            {recipe.name[0]}
          </div>
        )}
        <div>
          <h3 className="text-2xl font-extrabold text-brown/90">{recipe.name}</h3>
          <p className="text-[11px] font-bold uppercase text-brown">
            {recipe.category} · {recipe.bakeMinutes} min bake
          </p>
          <p className="mt-2 text-xs text-brown/80">{recipe.description}</p>
        </div>
      </div>

      <div className="mt-4 flex justify-between rounded-lg border border-brown/50 px-3 py-1.5 text-xs text-brown">
        <span>Batch Yield: <b>{recipe.yieldPerBatch} {recipe.yieldLabel}</b></span>
        <span>1 Standard Batch</span>
      </div>

      <p className="mb-1 mt-4 text-xs font-bold text-brown">Raw Ingredients Per Batch:</p>
      <ul className="space-y-1.5">
        {recipe.items.map((it) => (
          <li key={it.ingredientId} className="flex justify-between rounded-lg border border-brown/50 px-3 py-1 text-xs text-brown">
            <span>{ing(it.ingredientId)?.name}</span>
            <span>{it.quantity} {ing(it.ingredientId)?.unit}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex justify-end border-t border-brown/30 pt-3">
        <button onClick={onBake} className="flex items-center gap-1.5 rounded-full bg-brown px-4 py-1.5 text-xs font-bold text-cream">
          <Flame size={14} /> Bake This Recipe
        </button>
      </div>
    </div>
  )
}