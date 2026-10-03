// Pure helper functions that derive information from the shop data.
// Kept separate from components so they're easy to unit test later,
// and easy to reuse once similar aggregation happens on a backend.

export function variantLabel(state, variant) {
  const product = state.products.find((p) => p.id === variant.productId)
  const bits = [product ? product.name : '—', variant.brand, variant.vehicle].filter(Boolean)
  return bits.join(' · ')
}

export function lastPurchaseFor(state, variantId, supplierId) {
  const list = state.purchases.filter(
    (p) => p.variantId === variantId && (!supplierId || p.supplierId === supplierId)
  )
  if (!list.length) return null
  return list.slice().sort((a, b) => b.date.localeCompare(a.date))[0]
}

export function lastSaleFor(state, variantId, buyerId) {
  const list = state.sales.filter(
    (s) => s.variantId === variantId && (!buyerId || s.buyerId === buyerId)
  )
  if (!list.length) return null
  return list.slice().sort((a, b) => b.date.localeCompare(a.date))[0]
}

export function stockStatus(variant) {
  if (variant.stock <= 0) return 'danger'
  if (variant.stock <= variant.minStock) return 'warn'
  return 'good'
}

export function inventoryStats(state) {
  const total = state.variants.length
  const low = state.variants.filter((v) => v.stock > 0 && v.stock <= v.minStock).length
  const out = state.variants.filter((v) => v.stock <= 0).length
  return { total, low, out }
}

export function supplierAvgCost(state, supplierId) {
  const list = state.purchases.filter((p) => p.supplierId === supplierId)
  if (!list.length) return null
  return list.reduce((a, p) => a + p.cost, 0) / list.length
}

export function buyerAvgPrice(state, buyerId) {
  const list = state.sales.filter((s) => s.buyerId === buyerId)
  if (!list.length) return null
  return list.reduce((a, s) => a + s.price, 0) / list.length
}
