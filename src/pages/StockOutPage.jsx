import { useMemo, useState } from 'react'
import { RegMark } from '../components/Bits'
import { lastSaleFor, variantLabel } from '../lib/calculations'
import { money, todayStr } from '../lib/format'

export default function StockOutPage({ data, actions }) {
  const [buyerId, setBuyerId] = useState('')
  const [variantId, setVariantId] = useState('')
  const [price, setPrice] = useState('')
  const [qty, setQty] = useState('1')
  const [date, setDate] = useState(todayStr())

  const variant = data.variants.find((v) => v.id === variantId)

  const hintLines = useMemo(() => {
    if (!variantId || !buyerId) return []
    const lines = []
    const last = lastSaleFor(data, variantId, buyerId)
    if (last) {
      lines.push({ tone: '', text: <>THIS BUYER LAST PAID <b>{money(last.price)}</b> FOR THIS PART ON {last.date}</> })
    } else {
      const lastAny = lastSaleFor(data, variantId)
      if (lastAny) {
        lines.push({ tone: 'muted', text: <>NO HISTORY WITH THIS BUYER. MOST RECENTLY SOLD TO SOMEONE ELSE AT <b>{money(lastAny.price)}</b></> })
      } else {
        lines.push({ tone: 'muted', text: 'NO SALE HISTORY YET FOR THIS PART' })
      }
    }
    if (variant && variant.stock <= 0) {
      lines.push({ tone: 'danger', text: 'THIS PART IS OUT OF STOCK' })
    } else if (variant && variant.stock <= variant.minStock) {
      lines.push({ tone: '', text: `ONLY ${variant.stock} LEFT IN STOCK` })
    }
    return lines
  }, [data, variantId, buyerId, variant])

  function submit(e) {
    e.preventDefault()
    const bId = buyerId || data.buyers[0]?.id
    const vId = variantId || data.variants[0]?.id
    if (!bId || !vId) {
      alert('Add a buyer and a variant first.')
      return
    }
    const priceNum = parseFloat(price)
    const qtyNum = parseInt(qty)
    if (!(priceNum >= 0) || !(qtyNum > 0)) {
      alert('Enter a valid price and quantity.')
      return
    }
    const v = data.variants.find((x) => x.id === vId)
    if (v && qtyNum > v.stock) {
      if (!confirm(`Only ${v.stock} in stock. Record this sale anyway (stock will go negative)?`)) return
    }
    actions.recordSale({ buyerId: bId, variantId: vId, price: priceNum, qty: qtyNum, date })
    setPrice('')
    setQty('1')
  }

  return (
    <div className="sheet">
      <RegMark corner="tl" />
      <RegMark corner="tr" />
      <div className="page-head">
        <div>
          <h2 className="title">Stock Out</h2>
          <div className="desc">// record a sale — buyer price history surfaces automatically</div>
        </div>
        <div className="sheet-tag">SHEET 06 — OUTBOUND</div>
      </div>

      <div className="grid2">
        <div className="card">
          <div className="card-inner">
            <h2>Record a Sale</h2>
            <form onSubmit={submit}>
              <label htmlFor="outBuyer">Buyer</label>
              <select id="outBuyer" value={buyerId} onChange={(e) => setBuyerId(e.target.value)}>
                <option value="">{data.buyers.length ? 'Select a buyer' : 'Add a buyer first'}</option>
                {data.buyers.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
              <label htmlFor="outVariant">Part</label>
              <select id="outVariant" value={variantId} onChange={(e) => setVariantId(e.target.value)}>
                <option value="">{data.variants.length ? 'Select a part' : 'Add a variant first'}</option>
                {data.variants.map((v) => (
                  <option key={v.id} value={v.id}>
                    {variantLabel(data, v)}{v.partNo ? ` (${v.partNo})` : ''} — stock {v.stock}
                  </option>
                ))}
              </select>
              {hintLines.map((h, i) => (
                <div
                  key={i}
                  className={`hint ${h.tone === 'muted' ? 'muted' : ''}`}
                  style={h.tone === 'danger' ? { color: '#E8483F', background: 'rgba(232,72,63,0.13)', borderLeftColor: '#E8483F' } : undefined}
                >
                  {h.text}
                </div>
              ))}
              <div className="row3">
                <div>
                  <label htmlFor="outPrice">Sell price / piece (₹)</label>
                  <input id="outPrice" type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="outQty">Quantity</label>
                  <input id="outQty" type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="outDate">Date</label>
                  <input id="outDate" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
              </div>
              <button className="primary" type="submit">Record sale</button>
            </form>
          </div>
        </div>

        <div className="card">
          <div className="card-inner">
            <h2>Recent Sales <span className="count">({data.sales.length})</span></h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Part</th><th>Buyer</th><th className="num">Price</th><th className="num">Qty</th><th>Date</th><th></th></tr>
                </thead>
                <tbody>
                  {data.sales.length === 0 && (
                    <tr><td colSpan={6}><div className="empty">No sales recorded yet.</div></td></tr>
                  )}
                  {data.sales.slice().reverse().slice(0, 50).map((s) => {
                    const v = data.variants.find((x) => x.id === s.variantId)
                    const b = data.buyers.find((x) => x.id === s.buyerId)
                    return (
                      <tr key={s.id}>
                        <td>{v ? variantLabel(data, v) : '—'}</td>
                        <td>{b ? b.name : '—'}</td>
                        <td className="num">{money(s.price)}</td>
                        <td className="num">{s.qty}</td>
                        <td className="mono">{s.date}</td>
                        <td>
                          <button
                            className="ghost"
                            onClick={() => confirm('Undo this sale? Stock will be added back.') && actions.undoSale(s.id)}
                          >
                            Undo
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
