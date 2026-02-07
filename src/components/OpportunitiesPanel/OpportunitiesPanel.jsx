import { useState } from 'react'
import OpportunityCard from '../OpportunityCard/OpportunityCard'
import { getOpportunitiesForPatron } from '../../data/opportunities'
import './OpportunitiesPanel.css'

// Format currency
const formatCurrency = (amount) => {
  if (!amount) return '$0'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function OpportunitiesPanel({ 
  patronId, 
  onSelectOpportunity, 
  onCreateOpportunity,
  onNavigateToPatron 
}) {
  const [showClosed, setShowClosed] = useState(false)

  // Get opportunities for this patron
  const allOpportunities = getOpportunitiesForPatron(patronId)
  const openOpportunities = allOpportunities.filter(opp => opp.status === 'open')
  const closedOpportunities = allOpportunities.filter(opp => opp.status !== 'open')

  // Calculate totals
  const totalPipeline = openOpportunities.reduce((sum, opp) => sum + opp.askAmount, 0)
  const weightedPipeline = openOpportunities.reduce(
    (sum, opp) => sum + (opp.askAmount * (opp.probability || 50) / 100), 
    0
  )

  const handleCreateClick = () => {
    if (onCreateOpportunity) {
      onCreateOpportunity(patronId)
    } else {
      alert('This would open a modal to create a new opportunity.')
    }
  }

  const handleOpportunityClick = (opportunity) => {
    if (onSelectOpportunity) {
      onSelectOpportunity(opportunity.id)
    }
  }

  return (
    <div className="opportunities-panel wrapper-card">
      {/* Header */}
      <div className="opportunities-panel__header">
        <h4 className="opportunities-panel__title">Opportunities</h4>
        <button 
          className="opportunities-panel__add-btn"
          onClick={handleCreateClick}
          title="Create new opportunity"
        >
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>

      {/* Summary stats */}
      {openOpportunities.length > 0 && (
        <div className="opportunities-panel__stats">
          <div className="opportunities-panel__stat">
            <span className="opportunities-panel__stat-value">{openOpportunities.length}</span>
            <span className="opportunities-panel__stat-label">Active</span>
          </div>
          <div className="opportunities-panel__stat">
            <span className="opportunities-panel__stat-value">{formatCurrency(totalPipeline)}</span>
            <span className="opportunities-panel__stat-label">Pipeline</span>
          </div>
          <div className="opportunities-panel__stat">
            <span className="opportunities-panel__stat-value">{formatCurrency(weightedPipeline)}</span>
            <span className="opportunities-panel__stat-label">Weighted</span>
          </div>
        </div>
      )}

      {/* Open Opportunities */}
      <div className="opportunities-panel__list">
        {openOpportunities.length === 0 ? (
          <div className="opportunities-panel__empty">
            <i className="fa-solid fa-bullseye"></i>
            <p>No active opportunities</p>
            <button 
              className="opportunities-panel__create-btn"
              onClick={handleCreateClick}
            >
              Create opportunity
            </button>
          </div>
        ) : (
          openOpportunities.map(opp => (
            <OpportunityCard 
              key={opp.id}
              opportunity={opp}
              variant="compact"
              onClick={handleOpportunityClick}
              showPatronName={false}
            />
          ))
        )}
      </div>

      {/* Closed Opportunities */}
      {closedOpportunities.length > 0 && (
        <div className="opportunities-panel__closed">
          <button 
            className="opportunities-panel__closed-toggle"
            onClick={() => setShowClosed(!showClosed)}
          >
            <i className={`fa-solid fa-chevron-${showClosed ? 'down' : 'right'}`}></i>
            Closed ({closedOpportunities.length})
          </button>
          
          {showClosed && (
            <div className="opportunities-panel__closed-list">
              {closedOpportunities.map(opp => (
                <OpportunityCard 
                  key={opp.id}
                  opportunity={opp}
                  variant="compact"
                  onClick={handleOpportunityClick}
                  showPatronName={false}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default OpportunitiesPanel
