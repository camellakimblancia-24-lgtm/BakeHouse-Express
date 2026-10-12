import { useState } from 'react'
import Modal from '../../components/ui/Modal'
import type { Ingredient } from '../../types/ingredients'

export default function StockAdjustModal({ ingredient, onSave, onClose }: {
  ingredient: Ingredient
  onSave: (change: number) => void
  onClose: () => void
}) {
  const [type, setType] = useState<'delivery' | 'spoiled'>('delivery')
  const [qty, setQty] = useState(0)

  const change = type === 'delivery' ? qty : -qty
  const after = Math.max(0, ingredient.quantity + change)

  return (
    <Modal title={`Adjust stock: ${ingredient.name}`} onClose={onClose}>
      <div className="space-y-3">
        <div className="flex gap-2">
          {(['delivery', 'spoiled'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold ${type === t ? 'bg-brown text-cream' : 'bg-brown/10 text-brown'}`}
            >
              {t === 'delivery' ? 'Delivery' : 'Spoiled / Expired'}
            </button>
          ))}
        </div>
        <input
          type="number" min={0}
          className="w-full rounded-lg border border-brown/30 bg-white px-3 py-2"
          placeholder={`Quantity (${ingredient.unit})`}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
        />
        <p className="text-sm text-brown">
          {ingredient.name}: {ingredient.quantity} {ingredient.unit} → <b>{after} {ingredient.unit}</b>
        </p>
        <button
          disabled={qty <= 0}
          onClick={() => onSave(change)}
          className="w-full rounded-lg bg-brown py-2 font-semibold text-cream disabled:opacity-40"
        >
          Confirm
        </button>
      </div>
    </Modal>
  )
}