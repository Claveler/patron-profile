import { useState } from 'react'
import MovesManagement from '../MovesManagement/MovesManagement'
import OpportunitiesList from '../OpportunitiesList/OpportunitiesList'
import './Opportunities.css'

function Opportunities({ onSelectOpportunity, onSelectPatron, initialOfficerFilter, onClearInitialFilter }) {
  const [activeView, setActiveView] = useState('pipeline')

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
                onNavigateToPatron={onSelectPatron}
                onSelectOpportunity={onSelectOpportunity}
                embedded={true}
                initialAssigneeFilter={initialOfficerFilter}
                onClearInitialFilter={onClearInitialFilter}
              />
            ) : (
              <OpportunitiesList 
                onSelectOpportunity={onSelectOpportunity}
                onSelectPatron={onSelectPatron}
                embedded={true}
                initialAssigneeFilter={initialOfficerFilter}
                onClearInitialFilter={onClearInitialFilter}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Opportunities
