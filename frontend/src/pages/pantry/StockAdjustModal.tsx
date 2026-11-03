import { useState } from 'react'
import Modal from '../../components/ui/Modal'
import type { Ingredient } from '../../types/ingredients'

type AdjustReason = 'delivery' | 'spoiled'

export default function StockAdjustModal({ ingredient, onSave, onClose }: {
  ingredient: Ingredient
  onSave: (change: number, reason: AdjustReason) => void
  onClose: () => void
}) {
  const [type, setType] = useState<AdjustReason>('delivery')
  const [qty, setQty] = useState(0)

  const change = type === 'delivery' ? qty : -qty
  const tooMuch = type === 'spoiled' && qty > ingredient.quantity
  const after = Math.round((ingredient.quantity + change) * 100) / 100

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
          type="number" min={0} step="any"
          className="w-full rounded-lg border border-brown/30 bg-white px-3 py-2"
          placeholder={`Quantity (${ingredient.unit})`}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
        />
        {tooMuch ? (
          <p className="text-sm text-red-600">
            Only {ingredient.quantity} {ingredient.unit} in stock.
          </p>
        ) : (
          <p className="text-sm text-brown">
            {ingredient.name}: {ingredient.quantity} {ingredient.unit} → <b>{after} {ingredient.unit}</b>
          </p>
        )}
        <button
          disabled={qty <= 0 || tooMuch}
          onClick={() => onSave(change, type)}
          className="w-full rounded-lg bg-brown py-2 font-semibold text-cream disabled:opacity-40"
        >
          Confirm
        </button>
      </div>
    </Modal>
  )
}