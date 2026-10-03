import { useState } from 'react'
import { RegMark, Badge } from '../components/Bits'
import Gauge from '../components/Gauge'
import HeroDiagram from '../components/HeroDiagram'
import { lastPurchaseFor, lastSaleFor, stockStatus, inventoryStats } from '../lib/calculations'
import { money } from '../lib/format'

const STATUS_LABEL = { danger: 'Out of stock', warn: 'Low stock', good: 'In stock' }

export default function InventoryPage({ data }) {
  const [search, setSearch] = useState('')
  const { total, low, out } = inventoryStats(data)

  const q = search.toLowerCase()
  const rows = data.variants.filter((v) => {
    if (!q) return true
    const product = data.products.find((p) => p.id === v.productId)
    const hay = [product ? product.name : '', v.brand, v.vehicle, v.partNo].join(' ').toLowerCase()
    return hay.includes(q)
  })

  return (
    <div className="sheet">
      <RegMark corner="tl" />
      <RegMark corner="tr" />

      <div className="page-head">
        <div>
          <h2 className="title">Inventory</h2>
          <div className="desc">// live stock across every part variant</div>
        </div>
        <div className="sheet-tag">SHEET 01 — STOCK REGISTER</div>
      </div>

      <div className="hero-card">
        <div className="hero-flex">
          <div className="hero-svg-wrap">
            <HeroDiagram />
          </div>
          <div className="hero-copy">
            <div className="eyebrow">Callout Reference</div>
            <h3>Every variant, traced.</h3>
            <p>
              Brand + vehicle fit + part number defines the exact SKU. Stock, cost history and
              buyer price history are all tracked per variant below.
            </p>
          </div>
        </div>
      </div>

      <div className="pillrow">
        <div className="stat">
          <div className="v">{total}</div>
          <div className="l">Total Variants</div>
        </div>
        <div className="stat st-amber">
          <div className="v">{low}</div>
          <div className="l">Low Stock</div>
        </div>
        <div className="stat st-danger">
          <div className="v">{out}</div>
          <div className="l">Out Of Stock</div>
        </div>
      </div>

      <div className="card">
        <div className="card-inner">
          <div className="searchbar">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="SEARCH — part, brand, vehicle, or part number"
            />
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Part / Variant</th>
                  <th>Vehicle Fit</th>
                  <th>Part No.</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th className="num">Last Cost</th>
                  <th className="num">Last Sold</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={7}>
                      <div className="empty">
                        {total === 0 ? (
                          <>No parts yet. Add a product and a variant in the <b>Products</b> sheet to get started.</>
                        ) : (
                          'No matches for that search.'
                        )}
                      </div>
                    </td>
                  </tr>
                )}
                {rows.map((v) => {
                  const product = data.products.find((p) => p.id === v.productId)
                  const status = stockStatus(v)
                  const lastP = lastPurchaseFor(data, v.id)
                  const lastS = lastSaleFor(data, v.id)
                  return (
                    <tr key={v.id}>
                      <td>
                        <div className="tname">
                          {product ? product.name : '—'}
                          {v.brand && <span style={{ color: 'var(--ink-soft)', fontWeight: 600 }}> · {v.brand}</span>}
                        </div>
                        {v.partNo && <div className="tsub mono">{v.partNo}</div>}
                      </td>
                      <td>{v.vehicle || <span style={{ color: 'var(--ink-soft)' }}>—</span>}</td>
                      <td className="mono">{v.partNo || '—'}</td>
                      <td>
                        <div className="gaugewrap">
                          <Gauge stock={v.stock} minStock={v.minStock} status={status} />
                          <div>
                            <div className="gauge-num">{v.stock}</div>
                            <div className="gauge-unit">UNITS</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge status={status}>{STATUS_LABEL[status]}</Badge>
                      </td>
                      <td className="num">{lastP ? money(lastP.cost) : '—'}</td>
                      <td className="num">{lastS ? money(lastS.price) : '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
