import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import cookieImg from '/src/assets/chocolatechip-cookie.jpg'
import cheeseRollImg from '/src/assets/cheese-roll.jpg'

interface CounterProduct {
  id: number
  name: string
  category: string
  price: number
  stock: number
  bakedToday: number
  soldToday: number
  wasteToday: number
  shelfLifeMinutes: number
  image: string 
}

interface CounterMetrics {
  available: number
  sold: number
  revenue: number
  baked: number
}

const initialProducts: CounterProduct[] = [
  {
    id: 1,
    name: 'Chocolate Chip Cookie',
    category: 'COOKIES',
    price: 80,
    stock: 23,
    bakedToday: 36,
    soldToday: 9,
    wasteToday: 0,
    shelfLifeMinutes: 28,
    image: cookieImg, 
  },
  {
    id: 2,
    name: 'Cheese Roll',
    category: 'BREADS',
    price: 65,
    stock: 25,
    bakedToday: 50,
    soldToday: 15,
    wasteToday: 0,
    shelfLifeMinutes: 21,
    image: cheeseRollImg,
  },
]

const initialMetrics: CounterMetrics = {
  available: 97,
  sold: 48,
  revenue: 8350,
  baked: 145,
}

const formatPeso = (amount: number) =>
  `₱ ${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export default function POSScreen() {
  const [products, setProducts] = useState(initialProducts)
  const [metrics, setMetrics] = useState(initialMetrics)

  const sellProduct = (product: CounterProduct) => {
    if (product.stock === 0) return

    setProducts((current) =>
      current.map((item) =>
        item.id === product.id
          ? { ...item, stock: item.stock - 1, soldToday: item.soldToday + 1 }
          : item
      )
    )
    setMetrics((current) => ({
      ...current,
      available: current.available - 1,
      sold: current.sold + 1,
      revenue: current.revenue + product.price,
    }))
  }

  const logWaste = (product: CounterProduct) => {
    if (product.stock === 0) return

    setProducts((current) =>
      current.map((item) =>
        item.id === product.id
          ? { ...item, stock: item.stock - 1, wasteToday: item.wasteToday + 1 }
          : item
      )
    )
    setMetrics((current) => ({ ...current, available: current.available - 1 }))
  }

  const stats = [
    { label: 'Available on Counter', value: metrics.available, unit: 'Items', tone: 'brown' },
    { label: 'Total Units Sold Today', value: metrics.sold, unit: 'Sold', tone: 'green' },
    { label: 'Daily Counter Revenue', value: formatPeso(metrics.revenue), unit: '', tone: 'brown', note: 'Registered Gross Sales' },
    { label: 'Baked & Stocked Today', value: metrics.baked, unit: 'Units', tone: 'brown' },
  ]

  return (
    <section className="-mx-8 -mb-10 flex min-h-full flex-1 flex-col bg-[#f8f1dc] px-5 py-6 sm:px-8 lg:px-12">
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {products.map((product) => (
          <article
            key={product.id}
            className="rounded-lg border border-[#cdb9a8] bg-[#fffaf0] p-4"
          >
            <p className="border-b border-[#b6907d] pb-1 text-[10px] font-medium text-[#714735]">
              Showcase Tray #01 · {product.category}
            </p>

            <div className="flex items-center gap-2 py-2">
              {/* 3. Replaced abstract radial-gradients with an actual HTML img element */}
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[#e0cfb9]">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="h-full w-full object-cover"
                />
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
                onClick={() => logWaste(product)}
                className="inline-flex items-center gap-1 text-[10px] text-[#916b5e] transition hover:text-[#81431f] disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={`Log one ${product.name} as waste`}
              >
                <Trash2 className="h-3 w-3" />
                Log Waste
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
