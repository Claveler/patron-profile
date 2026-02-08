import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import MovesManagement from '../MovesManagement/MovesManagement'
import OpportunitiesList from '../OpportunitiesList/OpportunitiesList'
import './Opportunities.css'

function Opportunities() {
  const [activeView, setActiveView] = useState('pipeline')
  const [searchParams, setSearchParams] = useSearchParams()
  const initialOfficerFilter = searchParams.get('officer') || null

  const handleClearInitialFilter = () => {
    // Remove the officer param from the URL without a full navigation
    setSearchParams((prev) => {
      prev.delete('officer')
      return prev
    }, { replace: true })
  }

  return (
    <div className="opportunities">
      {/* Dark Header with Breadcrumb - matches PatronsList, CampaignManagement */}
      <div className="opportunities__header">
        <div className="opportunities__breadcrumb">
          <span className="opportunities__breadcrumb-section">Fundraising</span>
          <i className="fa-solid fa-chevron-right opportunities__breadcrumb-separator"></i>
        </div>
        <h1 className="opportunities__title">Opportunities</h1>
      </div>
      
      {/* Main Container - matches PatronProfile */}
      <div className="opportunities__container">
        {/* Tabs Wrapper - white card with tabs and content */}
        <div className="opportunities__tabs-wrapper">
          {/* Tab Navigation */}
          <div className="opportunities__tab-nav">
            <div className="opportunities__tabs">
              <button 
                className={`opportunities__tab ${activeView === 'pipeline' ? 'opportunities__tab--active' : ''}`}
                onClick={() => setActiveView('pipeline')}
              >
                Pipeline
              </button>
              <button 
                className={`opportunities__tab ${activeView === 'list' ? 'opportunities__tab--active' : ''}`}
                onClick={() => setActiveView('list')}
              >
                List
              </button>
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="opportunities__tab-content">
            {activeView === 'pipeline' ? (
              <MovesManagement 
                embedded={true}
                initialAssigneeFilter={initialOfficerFilter}
                onClearInitialFilter={handleClearInitialFilter}
              />
            ) : (
              <OpportunitiesList 
                embedded={true}
                initialAssigneeFilter={initialOfficerFilter}
                onClearInitialFilter={handleClearInitialFilter}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Opportunities
