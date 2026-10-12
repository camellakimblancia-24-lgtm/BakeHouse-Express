export default function StockBadge({ quantity, reorderLevel }: { quantity: number; reorderLevel: number }) {
  const [label, style] =
    quantity <= 0
      ? ['Out', 'bg-red-100 text-red-700']
      : quantity < reorderLevel
        ? ['Low', 'bg-amber-100 text-amber-700']
        : ['OK', 'bg-green-100 text-green-700']

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${style}`}>{label}</span>
}