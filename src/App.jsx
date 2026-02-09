import { useState, useEffect, createContext, useCallback, useMemo } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Header from './components/Layout/Header'
import Sidebar from './components/Layout/Sidebar'
import Footer from './components/Layout/Footer'
import ProductGuidePanel from './components/ProductGuidePanel/ProductGuidePanel'
import Dashboard from './pages/Dashboard/Dashboard'
import PatronsList from './pages/PatronsList/PatronsList'
import PatronProfile from './pages/PatronProfile'
import CampaignManagement from './pages/CampaignManagement/CampaignManagement'
import Opportunities from './pages/Opportunities/Opportunities'
import OpportunityDetail from './pages/OpportunityDetail/OpportunityDetail'
import GiftsList from './pages/GiftsList/GiftsList'
import Settings from './pages/Settings/Settings'
import { EPIC_SCOPE, isInScope } from './data/epicScope'

// Context for the Product Guide panel and Epic Scope stepper
export const GuideContext = createContext({
  guideOpen: false,
  toggleGuide: () => {},
  guideTab: null,
  setGuideTab: () => {},
  activeEpic: Infinity,
  setActiveEpic: () => {},
})

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
  const [guideOpen, setGuideOpen] = useState(false)
  const [guideTab, setGuideTab] = useState(null)
  const [activeEpic, setActiveEpic] = useState(Infinity)

  const toggleGuide = useCallback(() => setGuideOpen(prev => !prev), [])

  // Determine the fallback route based on active epic
  const fallbackRoute = useMemo(() => {
    if (isInScope(EPIC_SCOPE.routes['/'], activeEpic)) return '/'
    return '/patrons'
  }, [activeEpic])

  return (
    <GuideContext.Provider value={{ guideOpen, toggleGuide, guideTab, setGuideTab, activeEpic, setActiveEpic }}>
      <div className="app">
        <ScrollToTop />
        <Header 
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          onToggleGuide={toggleGuide}
          guideOpen={guideOpen}
        />
        <div className="app__body">
          <Sidebar 
            collapsed={sidebarCollapsed}
          />
          <main className={`app__content ${sidebarCollapsed ? 'app__content--expanded' : ''}`}>
            <Routes>
              {isInScope(EPIC_SCOPE.routes['/'], activeEpic) && (
                <Route path="/" element={<Dashboard />} />
              )}
              <Route path="/patrons" element={<PatronsList />} />
              <Route path="/patrons/:patronId" element={<PatronProfile />} />
              {isInScope(EPIC_SCOPE.routes['/gifts'], activeEpic) && (
                <Route path="/gifts" element={<GiftsList />} />
              )}
              {isInScope(EPIC_SCOPE.routes['/opportunities'], activeEpic) && (
                <>
                  <Route path="/opportunities" element={<Opportunities />} />
                  <Route path="/opportunities/:oppId" element={<OpportunityDetail />} />
                </>
              )}
              {isInScope(EPIC_SCOPE.routes['/campaigns'], activeEpic) && (
                <Route path="/campaigns" element={<CampaignManagement />} />
              )}
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to={fallbackRoute} replace />} />
            </Routes>
          </main>
        </div>
        <Footer />
        <ProductGuidePanel />
      </div>
    </GuideContext.Provider>
  )
}

export default App
