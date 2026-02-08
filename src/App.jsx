import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Layout/Header'
import Sidebar from './components/Layout/Sidebar'
import Footer from './components/Layout/Footer'
import Dashboard from './pages/Dashboard/Dashboard'
import PatronsList from './pages/PatronsList/PatronsList'
import PatronProfile from './pages/PatronProfile'
import CampaignManagement from './pages/CampaignManagement/CampaignManagement'
import Opportunities from './pages/Opportunities/Opportunities'
import OpportunityDetail from './pages/OpportunityDetail/OpportunityDetail'
import GiftsList from './pages/GiftsList/GiftsList'
import Settings from './pages/Settings/Settings'

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="app">
      <ScrollToTop />
      <Header 
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <div className="app__body">
        <Sidebar 
          collapsed={sidebarCollapsed}
        />
        <main className={`app__content ${sidebarCollapsed ? 'app__content--expanded' : ''}`}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patrons" element={<PatronsList />} />
            <Route path="/patrons/:patronId" element={<PatronProfile />} />
            <Route path="/gifts" element={<GiftsList />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/opportunities/:oppId" element={<OpportunityDetail />} />
            <Route path="/campaigns" element={<CampaignManagement />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default App
