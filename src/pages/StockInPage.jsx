import { useMemo, useState } from 'react'
import { RegMark } from '../components/Bits'
import { lastPurchaseFor, variantLabel } from '../lib/calculations'
import { money, todayStr } from '../lib/format'

export default function StockInPage({ data, actions }) {
  const [supplierId, setSupplierId] = useState('')
  const [variantId, setVariantId] = useState('')
  const [cost, setCost] = useState('')
  const [qty, setQty] = useState('1')
  const [date, setDate] = useState(todayStr())

  const hint = useMemo(() => {
    if (!variantId || !supplierId) return null
    const last = lastPurchaseFor(data, variantId, supplierId)
    if (last) {
      return { tone: 'accent', text: <>LAST BOUGHT FROM THIS SUPPLIER AT <b>{money(last.cost)}</b> ON {last.date}</> }
    }
    const lastAny = lastPurchaseFor(data, variantId)
    if (lastAny) {
      const s = data.suppliers.find((x) => x.id === lastAny.supplierId)
      return { tone: 'muted', text: <>NO HISTORY WITH THIS SUPPLIER. LAST BOUGHT OVERALL FROM <b>{s ? s.name : 'ANOTHER SUPPLIER'}</b> AT <b>{money(lastAny.cost)}</b></> }
    }
    return { tone: 'muted', text: 'NO PURCHASE HISTORY YET FOR THIS PART' }
  }, [data, variantId, supplierId])

  function submit(e) {
    e.preventDefault()
    const sId = supplierId || data.suppliers[0]?.id
    const vId = variantId || data.variants[0]?.id
    if (!sId || !vId) {
      alert('Add a supplier and a variant first.')
      return
    }
    const costNum = parseFloat(cost)
    const qtyNum = parseInt(qty)
    if (!(costNum >= 0) || !(qtyNum > 0)) {
      alert('Enter a valid cost and quantity.')
      return
    }
    actions.recordPurchase({ supplierId: sId, variantId: vId, cost: costNum, qty: qtyNum, date })
    setCost('')
    setQty('1')
  }

  return (
    <div className="sheet">
      <RegMark corner="tl" />
      <RegMark corner="tr" />
      <div className="page-head">
        <div>
          <h2 className="title">Stock In</h2>
          <div className="desc">// record a purchase — stock updates automatically</div>
        </div>
        <div className="sheet-tag">SHEET 05 — INBOUND</div>
      </div>

      <div className="grid2">
        <div className="card">
          <div className="card-inner">
            <h2>Record a Purchase</h2>
            <form onSubmit={submit}>
              <label htmlFor="inSupplier">Supplier</label>
              <select id="inSupplier" value={supplierId} onChange={(e) => setSupplierId(e.target.value)}>
                <option value="">{data.suppliers.length ? 'Select a supplier' : 'Add a supplier first'}</option>
                {data.suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <label htmlFor="inVariant">Part</label>
              <select id="inVariant" value={variantId} onChange={(e) => setVariantId(e.target.value)}>
                <option value="">{data.variants.length ? 'Select a part' : 'Add a variant first'}</option>
                {data.variants.map((v) => (
                  <option key={v.id} value={v.id}>
                    {variantLabel(data, v)}{v.partNo ? ` (${v.partNo})` : ''} — stock {v.stock}
                  </option>
                ))}
              </select>
              {hint && <div className={`hint ${hint.tone === 'muted' ? 'muted' : ''}`}>{hint.text}</div>}
              <div className="row3">
                <div>
                  <label htmlFor="inCost">Cost / piece (₹)</label>
                  <input id="inCost" type="number" min="0" step="0.01" value={cost} onChange={(e) => setCost(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="inQty">Quantity</label>
                  <input id="inQty" type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="inDate">Date</label>
                  <input id="inDate" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
              </div>
              <button className="primary" type="submit">Add to stock</button>
            </form>
          </div>
        </div>

        <div className="card">
          <div className="card-inner">
            <h2>Recent Purchases <span className="count">({data.purchases.length})</span></h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Part</th><th>Supplier</th><th className="num">Cost</th><th className="num">Qty</th><th>Date</th><th></th></tr>
                </thead>
                <tbody>
                  {data.purchases.length === 0 && (
                    <tr><td colSpan={6}><div className="empty">No purchases recorded yet.</div></td></tr>
                  )}
                  {data.purchases.slice().reverse().slice(0, 50).map((p) => {
                    const v = data.variants.find((x) => x.id === p.variantId)
                    const s = data.suppliers.find((x) => x.id === p.supplierId)
                    return (
                      <tr key={p.id}>
                        <td>{v ? variantLabel(data, v) : '—'}</td>
                        <td>{s ? s.name : '—'}</td>
                        <td className="num">{money(p.cost)}</td>
                        <td className="num">{p.qty}</td>
                        <td className="mono">{p.date}</td>
                        <td>
                          <button
                            className="ghost"
                            onClick={() => confirm('Undo this purchase? Stock will be reduced back.') && actions.undoPurchase(p.id)}
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
