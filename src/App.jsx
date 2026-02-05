import { useState } from 'react'
import Header from './components/Layout/Header'
import Sidebar from './components/Layout/Sidebar'
import Footer from './components/Layout/Footer'
import PatronProfile from './pages/PatronProfile'
import MovesManagement from './pages/MovesManagement/MovesManagement'
import CampaignManagement from './pages/CampaignManagement/CampaignManagement'

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activePage, setActivePage] = useState('patron')

  const renderPage = () => {
    switch (activePage) {
      case 'pipeline':
        return <MovesManagement onNavigateToPatron={() => setActivePage('patron')} />
      case 'campaigns':
        return <CampaignManagement />
      case 'patron':
      default:
        return <PatronProfile />
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
