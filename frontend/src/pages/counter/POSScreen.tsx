import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import cookieImg from '/src/assets/chocolatechip-cookie.jpg'
import cheeseRollImg from '/src/assets/cheese-roll.jpg'
import {
  getCounterOverview,
  logWaste,
  type CounterOverview,
  type CounterProduct,
} from '../../api/counter'
import { checkout } from '../../api/sales'
import { useRole } from '../../types/roles'

const PRODUCT_IMAGES: Record<string, string> = {
  'chocolate chip cookie': cookieImg,
  'cheese roll': cheeseRollImg,
}

const sectionClass =
  '-mx-8 -mb-10 flex min-h-full flex-1 flex-col bg-[#f8f1dc] px-5 py-6 sm:px-8 lg:px-12'

const formatPeso = (amount: number) =>
  `₱ ${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export default function POSScreen() {
  const { user } = useRole()
  const [overview, setOverview] = useState<CounterOverview | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getCounterOverview()
      .then(setOverview)
      .catch((err: Error) => setError(err.message))
  }, [])

  const run = async (action: () => Promise<unknown>) => {
    setError('')
    try {
      await action()
      setOverview(await getCounterOverview())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  const sellProduct = (product: CounterProduct) =>
    run(() => checkout([{ productId: product.id, qty: 1 }], user.name))

  const wasteProduct = (product: CounterProduct) =>
    run(() => logWaste(product.id, 1, 'Unsold', user.name))

  if (!overview) {
    return (
      <section className={sectionClass}>
        {error ? (
          <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>
        ) : (
          <p className="text-sm text-[#916b5e]">Loading counter...</p>
        )}
      </section>
    )
  }

  const { products, metrics } = overview

  const stats = [
    { label: 'Available on Counter', value: metrics.available, unit: 'Items', tone: 'brown' },
    { label: 'Total Units Sold Today', value: metrics.sold, unit: 'Sold', tone: 'green' },
    { label: 'Daily Counter Revenue', value: formatPeso(metrics.revenue), unit: '', tone: 'brown', note: 'Registered Gross Sales' },
    { label: 'Baked & Stocked Today', value: metrics.baked, unit: 'Units', tone: 'brown' },
  ]

  return (
    <section className={sectionClass}>
      {error && <p className="mb-3 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="min-h-24 rounded-lg border border-[#cdb9a8] bg-[#fffaf0] px-4 py-3"
          >
            <p className="text-xs font-medium text-[#916b5e]">{stat.label}</p>
            <div className="mt-1 flex items-baseline gap-3">
              <span className={`text-4xl font-bold leading-none ${stat.tone === 'green' ? 'text-green-900' : 'text-[#916b5e]'}`}>
                {stat.value}
              </span>
              {stat.unit && <span className={`text-xs ${stat.tone === 'green' ? 'text-green-900' : 'text-[#916b5e]'}`}>{stat.unit}</span>}
            </div>
            {stat.note && <p className="mt-1 text-[10px] text-[#916b5e]">{stat.note}</p>}
          </article>
        ))}
      </div>

      <hr className="my-6 border-0 border-t border-[#956d5d]" />

      {products.length === 0 && (
        <p className="text-sm text-[#916b5e]">No products on the counter yet. Add a recipe first.</p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {products.map((product, index) => {
          const image = product.image ?? PRODUCT_IMAGES[product.name.toLowerCase()]
          return (
            <article
              key={product.id}
              className="rounded-lg border border-[#cdb9a8] bg-[#fffaf0] p-4"
            >
              <p className="border-b border-[#b6907d] pb-1 text-[10px] font-medium text-[#714735]">
                Showcase Tray #{String(index + 1).padStart(2, '0')} · {product.category}
              </p>

              <div className="flex items-center gap-2 py-2">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[#e0cfb9]">
                  {image ? (
                    <img src={image} alt={product.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#81431f]/10 text-lg font-bold text-[#81431f]">
                      {product.name[0]}
                    </div>
                  )}
                </div>
                <h2 className="text-base font-bold text-[#916b5e]">{product.name}</h2>
              </div>

              <div className="rounded-md border border-[#a9543c] px-3 py-2 text-[#916b5e]">
                <div className="flex items-end justify-between gap-2">
                  <div>
                    <p className="text-[9px] uppercase">In display</p>
                    <p className="text-3xl font-bold leading-tight">
                      {product.stock} <span className="text-[10px] font-normal">units</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] uppercase">Retail price</p>
                    <p className="text-2xl font-bold leading-tight">{formatPeso(product.price)}</p>
                  </div>
                </div>
                <div className="mt-1 flex justify-between border-t border-[#e7d8c8] pt-1 text-[9px]">
                  <span>Baked: <strong>{product.bakedToday}</strong></span>
                  <span>Sold: <strong>{product.soldToday}</strong></span>
                  <span>Waste: <strong>{product.wasteToday}</strong></span>
                </div>
              </div>

              <p className="mt-1 border-b border-[#b6907d] pb-1 text-[9px] text-[#916b5e]">
                Fresh shelf life: {product.shelfLifeMinutes} min from oven pull
              </p>
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  disabled={product.stock === 0}
                  onClick={() => sellProduct(product)}
                  className="rounded-md bg-[#81431f] px-3 py-1 text-xs font-bold text-white transition hover:bg-[#693719] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  + Sell 1
                </button>
                <button
                  type="button"
                  disabled={product.stock === 0}
                  onClick={() => wasteProduct(product)}
                  className="inline-flex items-center gap-1 text-[10px] text-[#916b5e] transition hover:text-[#81431f] disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={`Log one ${product.name} as waste`}
                >
                  <Trash2 className="h-3 w-3" />
                  Log Waste
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}