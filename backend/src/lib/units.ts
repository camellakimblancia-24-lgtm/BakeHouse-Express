const UNITS: Record<string, { group: string; factor: number }> = {
  mg: { group: 'mass', factor: 0.001 },
  g: { group: 'mass', factor: 1 },
  kg: { group: 'mass', factor: 1000 },
  ml: { group: 'volume', factor: 1 },
  l: { group: 'volume', factor: 1000 },
}

export function convert(qty: number, from: string, to: string): number | null {
  const a = from.trim().toLowerCase()
  const b = to.trim().toLowerCase()
  if (a === b) return qty

  const fromUnit = UNITS[a]
  const toUnit = UNITS[b]
  if (!fromUnit || !toUnit || fromUnit.group !== toUnit.group) return null

  return (qty * fromUnit.factor) / toUnit.factor
}