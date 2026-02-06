import { useState } from 'react'
import Header from './components/Layout/Header'
import Sidebar from './components/Layout/Sidebar'
import Footer from './components/Layout/Footer'
import PatronsList from './pages/PatronsList/PatronsList'
import PatronProfile from './pages/PatronProfile'
import MovesManagement from './pages/MovesManagement/MovesManagement'
import CampaignManagement from './pages/CampaignManagement/CampaignManagement'
import OpportunitiesList from './pages/OpportunitiesList/OpportunitiesList'
import OpportunityDetail from './pages/OpportunityDetail/OpportunityDetail'

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activePage, setActivePage] = useState('patrons') // Start at list view
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
      case 'pipeline':
        return (
          <MovesManagement 
            onNavigateToPatron={handleSelectPatron} 
            onSelectOpportunity={handleSelectOpportunity}
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
          />
        )
      case 'opportunities':
        return (
          <OpportunitiesList 
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
      default:
        return <PatronsList onSelectPatron={handleSelectPatron} />
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
