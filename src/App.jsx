import { useState } from 'react'
import Sidebar from './components/Sidebar'
import InventoryPage from './pages/InventoryPage'
import CatalogPage from './pages/CatalogPage'
import SuppliersPage from './pages/SuppliersPage'
import BuyersPage from './pages/BuyersPage'
import StockInPage from './pages/StockInPage'
import StockOutPage from './pages/StockOutPage'
import { useShopData } from './hooks/useShopData'

export default function App() {
  const [activeTab, setActiveTab] = useState('inventory')
  const { data, saveStatus, actions } = useShopData()

  return (
    <div className="shell">
      <Sidebar activeTab={activeTab} onChangeTab={setActiveTab} saveStatus={saveStatus} />
      <main className="app">
        <div className="page-stage" key={activeTab}>
          {activeTab === 'inventory' && <InventoryPage data={data} />}
          {activeTab === 'catalog' && <CatalogPage data={data} actions={actions} />}
          {activeTab === 'suppliers' && <SuppliersPage data={data} actions={actions} />}
          {activeTab === 'buyers' && <BuyersPage data={data} actions={actions} />}
          {activeTab === 'stockin' && <StockInPage data={data} actions={actions} />}
          {activeTab === 'stockout' && <StockOutPage data={data} actions={actions} />}
        </div>
      </main>
    </div>
  )
}
