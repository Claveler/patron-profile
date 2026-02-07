import { useState } from 'react'
import Header from './components/Layout/Header'
import Sidebar from './components/Layout/Sidebar'
import Footer from './components/Layout/Footer'
import Dashboard from './pages/Dashboard/Dashboard'
import PatronsList from './pages/PatronsList/PatronsList'
import PatronProfile from './pages/PatronProfile'
import CampaignManagement from './pages/CampaignManagement/CampaignManagement'
import Opportunities from './pages/Opportunities/Opportunities'
import OpportunityDetail from './pages/OpportunityDetail/OpportunityDetail'
import Settings from './pages/Settings/Settings'

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activePage, setActivePage] = useState('dashboard') // Start at dashboard
  const [selectedPatronId, setSelectedPatronId] = useState(null)
  const [selectedOpportunityId, setSelectedOpportunityId] = useState(null)

  const handleSelectPatron = (patronId) => {
    setSelectedPatronId(patronId)
    setActivePage('patron')
  }

  const handleBackToList = () => {
    setSelectedPatronId(null)
    setActivePage('patrons')
  }

  const handleSelectOpportunity = (opportunityId) => {
    setSelectedOpportunityId(opportunityId)
    setActivePage('opportunity')
  }

  const handleBackToOpportunities = () => {
    setSelectedOpportunityId(null)
    setActivePage('opportunities')
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <Dashboard 
            onNavigateToPatron={handleSelectPatron}
            onNavigateToOpportunity={handleSelectOpportunity}
            onNavigateToPage={setActivePage}
          />
        )
      case 'campaigns':
        return <CampaignManagement />
      case 'patrons':
        return <PatronsList onSelectPatron={handleSelectPatron} />
      case 'patron':
        return (
          <PatronProfile 
            patronId={selectedPatronId} 
            onBack={handleBackToList}
            onSelectOpportunity={handleSelectOpportunity}
            onSelectPatron={handleSelectPatron}
          />
        )
      case 'opportunities':
        return (
          <Opportunities 
            onSelectOpportunity={handleSelectOpportunity}
            onSelectPatron={handleSelectPatron}
          />
        )
      case 'opportunity':
        return (
          <OpportunityDetail 
            opportunityId={selectedOpportunityId}
            onBack={handleBackToOpportunities}
            onNavigateToPatron={handleSelectPatron}
          />
        )
      case 'settings':
        return <Settings />
      default:
        return (
          <Dashboard 
            onNavigateToPatron={handleSelectPatron}
            onNavigateToOpportunity={handleSelectOpportunity}
            onNavigateToPage={setActivePage}
          />
        )
    }
  }

  return (
    <div className="app">
      <Header 
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <div className="app__body">
        <Sidebar 
          collapsed={sidebarCollapsed}
          activePage={activePage}
          onNavigate={setActivePage}
        />
        <main className={`app__content ${sidebarCollapsed ? 'app__content--expanded' : ''}`}>
          {renderPage()}
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default App
