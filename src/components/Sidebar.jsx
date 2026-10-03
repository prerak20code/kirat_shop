import { BrandMark } from './Bits'
import { todayStr } from '../lib/format'

const TABS = [
  { key: 'inventory', no: '01', label: 'Inventory' },
  { key: 'catalog', no: '02', label: 'Products' },
  { key: 'suppliers', no: '03', label: 'Suppliers' },
  { key: 'buyers', no: '04', label: 'Buyers' },
  { key: 'stockin', no: '05', label: 'Stock In' },
  { key: 'stockout', no: '06', label: 'Stock Out' },
]

export default function Sidebar({ activeTab, onChangeTab, saveStatus }) {
  const activeIndex = TABS.findIndex((t) => t.key === activeTab)

  return (
    <aside className="rail">
      <div className="rail-head">
        <div className="brand">
          <BrandMark />
          <div>
            <h1>Parts Ledger</h1>
            <span className="sub">Drawing Set · Rev A</span>
          </div>
        </div>
      </div>

      <div className="titleblock">
        <div className="tb-row">
          <div className="tb-cell">
            <span className="tb-label">Sheet</span>
            <span className="tb-val">{String(activeIndex + 1).padStart(2, '0')} / 06</span>
          </div>
          <div className="tb-cell">
            <span className="tb-label">Scale</span>
            <span className="tb-val">NTS</span>
          </div>
        </div>
        <div className="tb-row">
          <div className="tb-cell">
            <span className="tb-label">Date</span>
            <span className="tb-val">{todayStr()}</span>
          </div>
          <div className="tb-cell">
            <span className={`tb-val status-dot ${saveStatus === 'saving' ? 'saving' : saveStatus === 'err' ? 'err' : ''}`}>
              <span className="tb-label" style={{ display: 'none' }} />
              {saveStatus}
            </span>
          </div>
        </div>
      </div>

      <nav className="tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={t.key === activeTab ? 'active' : ''}
            onClick={() => onChangeTab(t.key)}
          >
            <span className="sheetno">{t.no}</span>
            {t.label}
          </button>
        ))}
      </nav>

      <div className="rail-foot">Parts Ledger · Internal Use</div>
    </aside>
  )
}
