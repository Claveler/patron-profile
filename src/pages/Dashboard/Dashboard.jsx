import { useMemo } from 'react'
import { 
  getOpenOpportunities, 
  getPipelineTotals, 
  PIPELINE_STAGES,
  opportunities 
} from '../../data/opportunities'
import { patrons, isManagedProspect } from '../../data/patrons'
import './Dashboard.css'

// Format currency
const formatCurrency = (amount, compact = false) => {
  if (!amount) return '$0'
  if (compact && amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`
  }
  if (compact && amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format date
const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// Days since a date
const getDaysSince = (dateStr) => {
  if (!dateStr) return null
  const date = new Date(dateStr)
  const today = new Date()
  return Math.floor((today - date) / (1000 * 60 * 60 * 24))
}

function Dashboard({ onNavigateToPatron, onNavigateToOpportunity, onNavigateToPage }) {
  // Pipeline totals
  const pipelineTotals = useMemo(() => getPipelineTotals(), [])
  
  // Open opportunities by stage
  const opportunitiesByStage = useMemo(() => {
    const openOpps = getOpenOpportunities()
    return PIPELINE_STAGES.map(stage => ({
      ...stage,
      opportunities: openOpps.filter(opp => opp.stage === stage.id),
      total: openOpps.filter(opp => opp.stage === stage.id).reduce((sum, opp) => sum + opp.askAmount, 0)
    }))
  }, [])
  
  // Tasks due (opportunities with overdue contact)
  const tasksDue = useMemo(() => {
    const openOpps = getOpenOpportunities()
    return openOpps
      .map(opp => ({
        ...opp,
        daysSinceContact: getDaysSince(opp.lastContact)
      }))
      .filter(opp => opp.daysSinceContact > 14) // More than 2 weeks
      .sort((a, b) => b.daysSinceContact - a.daysSinceContact)
      .slice(0, 5)
  }, [])
  
  // Upcoming closes (opportunities closing soon)
  const upcomingCloses = useMemo(() => {
    const openOpps = getOpenOpportunities()
    const today = new Date()
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    
    return openOpps
      .filter(opp => {
        const closeDate = new Date(opp.expectedClose)
        return closeDate >= today && closeDate <= thirtyDaysFromNow
      })
      .sort((a, b) => new Date(a.expectedClose) - new Date(b.expectedClose))
      .slice(0, 5)
  }, [])
  
  // Quick stats
  const stats = useMemo(() => {
    const managedProspects = patrons.filter(p => isManagedProspect(p)).length
    const totalPatrons = patrons.length
    const wonOpportunities = opportunities.filter(opp => opp.status === 'won')
    const ytdGiving = wonOpportunities.reduce((sum, opp) => sum + opp.askAmount, 0)
    
    return {
      totalPatrons,
      managedProspects,
      generalConstituents: totalPatrons - managedProspects,
      ytdGiving
    }
  }, [])

  return (
    <div className="dashboard">
      {/* Page Header */}
      <div className="dashboard__header">
        <div className="dashboard__header-content">
          <h1 className="dashboard__title">Dashboard</h1>
          <p className="dashboard__subtitle">Welcome back. Here's what needs your attention today.</p>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="dashboard__stats-row">
        <div className="dashboard__stat-card">
          <div className="dashboard__stat-icon dashboard__stat-icon--primary">
            <i className="fa-solid fa-bullseye"></i>
          </div>
          <div className="dashboard__stat-content">
            <span className="dashboard__stat-value">{pipelineTotals.count}</span>
            <span className="dashboard__stat-label">Open Opportunities</span>
          </div>
        </div>
        
        <div className="dashboard__stat-card">
          <div className="dashboard__stat-icon dashboard__stat-icon--success">
            <i className="fa-solid fa-dollar-sign"></i>
          </div>
          <div className="dashboard__stat-content">
            <span className="dashboard__stat-value">{formatCurrency(pipelineTotals.totalValue, true)}</span>
            <span className="dashboard__stat-label">Pipeline Value</span>
          </div>
        </div>
        
        <div className="dashboard__stat-card">
          <div className="dashboard__stat-icon dashboard__stat-icon--warning">
            <i className="fa-solid fa-scale-balanced"></i>
          </div>
          <div className="dashboard__stat-content">
            <span className="dashboard__stat-value">{formatCurrency(pipelineTotals.weightedValue, true)}</span>
            <span className="dashboard__stat-label">Weighted Pipeline</span>
          </div>
        </div>
        
        <div className="dashboard__stat-card">
          <div className="dashboard__stat-icon dashboard__stat-icon--info">
            <i className="fa-solid fa-users"></i>
          </div>
          <div className="dashboard__stat-content">
            <span className="dashboard__stat-value">{stats.managedProspects}</span>
            <span className="dashboard__stat-label">Managed Prospects</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard__content">
        {/* Left Column */}
        <div className="dashboard__column dashboard__column--main">
          {/* Pipeline Overview */}
          <div className="dashboard__card">
            <div className="dashboard__card-header">
              <h2 className="dashboard__card-title">
                <i className="fa-solid fa-chart-simple"></i>
                Pipeline Overview
              </h2>
              <button 
                className="dashboard__card-action"
                onClick={() => onNavigateToPage && onNavigateToPage('pipeline')}
              >
                View Pipeline
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
            <div className="dashboard__pipeline">
              {opportunitiesByStage.map(stage => (
                <div key={stage.id} className="dashboard__pipeline-stage">
                  <div className="dashboard__pipeline-stage-header">
                    <span className="dashboard__pipeline-stage-name">{stage.label}</span>
                    <span className="dashboard__pipeline-stage-count">{stage.opportunities.length}</span>
                  </div>
                  <div className="dashboard__pipeline-stage-bar">
                    <div 
                      className="dashboard__pipeline-stage-fill"
                      style={{ 
                        width: `${pipelineTotals.totalValue > 0 ? (stage.total / pipelineTotals.totalValue) * 100 : 0}%` 
                      }}
                    />
                  </div>
                  <span className="dashboard__pipeline-stage-value">{formatCurrency(stage.total, true)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Closes */}
          <div className="dashboard__card">
            <div className="dashboard__card-header">
              <h2 className="dashboard__card-title">
                <i className="fa-solid fa-calendar-check"></i>
                Closing Soon
              </h2>
              <button 
                className="dashboard__card-action"
                onClick={() => onNavigateToPage && onNavigateToPage('opportunities')}
              >
                View All
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
            {upcomingCloses.length === 0 ? (
              <div className="dashboard__empty">
                <i className="fa-solid fa-calendar"></i>
                <p>No opportunities closing in the next 30 days</p>
              </div>
            ) : (
              <div className="dashboard__list">
                {upcomingCloses.map(opp => (
                  <div 
                    key={opp.id} 
                    className="dashboard__list-item"
                    onClick={() => onNavigateToOpportunity && onNavigateToOpportunity(opp.id)}
                  >
                    <div className="dashboard__list-item-main">
                      <span className="dashboard__list-item-title">{opp.name}</span>
                      <span className="dashboard__list-item-subtitle">{opp.patronName}</span>
                    </div>
                    <div className="dashboard__list-item-meta">
                      <span className="dashboard__list-item-amount">{formatCurrency(opp.askAmount)}</span>
                      <span className="dashboard__list-item-date">
                        <i className="fa-solid fa-calendar"></i>
                        {formatDate(opp.expectedClose)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="dashboard__column dashboard__column--sidebar">
          {/* Tasks Due / Follow-ups Needed */}
          <div className="dashboard__card dashboard__card--alert">
            <div className="dashboard__card-header">
              <h2 className="dashboard__card-title">
                <i className="fa-solid fa-bell"></i>
                Follow-ups Needed
              </h2>
            </div>
            {tasksDue.length === 0 ? (
              <div className="dashboard__empty">
                <i className="fa-solid fa-check-circle"></i>
                <p>All caught up!</p>
              </div>
            ) : (
              <div className="dashboard__tasks">
                {tasksDue.map(opp => (
                  <div 
                    key={opp.id} 
                    className="dashboard__task"
                    onClick={() => onNavigateToOpportunity && onNavigateToOpportunity(opp.id)}
                  >
                    <div className="dashboard__task-header">
                      <span className="dashboard__task-patron">{opp.patronName}</span>
                      <span className={`dashboard__task-days ${opp.daysSinceContact > 30 ? 'dashboard__task-days--overdue' : ''}`}>
                        {opp.daysSinceContact}d ago
                      </span>
                    </div>
                    <span className="dashboard__task-opp">{opp.name}</span>
                    {opp.nextAction && (
                      <span className="dashboard__task-action">
                        <i className="fa-solid fa-arrow-right"></i>
                        {opp.nextAction}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="dashboard__card">
            <div className="dashboard__card-header">
              <h2 className="dashboard__card-title">
                <i className="fa-solid fa-bolt"></i>
                Quick Actions
              </h2>
            </div>
            <div className="dashboard__quick-actions">
              <button 
                className="dashboard__quick-action"
                onClick={() => onNavigateToPage && onNavigateToPage('patrons')}
              >
                <i className="fa-solid fa-user-plus"></i>
                Add Patron
              </button>
              <button 
                className="dashboard__quick-action"
                onClick={() => onNavigateToPage && onNavigateToPage('opportunities')}
              >
                <i className="fa-solid fa-bullseye"></i>
                New Opportunity
              </button>
              <button 
                className="dashboard__quick-action"
                onClick={() => onNavigateToPage && onNavigateToPage('campaigns')}
              >
                <i className="fa-solid fa-bullhorn"></i>
                View Campaigns
              </button>
              <button 
                className="dashboard__quick-action"
                onClick={() => onNavigateToPage && onNavigateToPage('pipeline')}
              >
                <i className="fa-solid fa-chart-simple"></i>
                Pipeline Board
              </button>
            </div>
          </div>

          {/* Portfolio Summary */}
          <div className="dashboard__card">
            <div className="dashboard__card-header">
              <h2 className="dashboard__card-title">
                <i className="fa-solid fa-users"></i>
                Patron Summary
              </h2>
            </div>
            <div className="dashboard__summary-stats">
              <div className="dashboard__summary-stat">
                <span className="dashboard__summary-stat-value">{stats.totalPatrons}</span>
                <span className="dashboard__summary-stat-label">Total Patrons</span>
              </div>
              <div className="dashboard__summary-stat">
                <span className="dashboard__summary-stat-value">{stats.managedProspects}</span>
                <span className="dashboard__summary-stat-label">Managed</span>
              </div>
              <div className="dashboard__summary-stat">
                <span className="dashboard__summary-stat-value">{stats.generalConstituents}</span>
                <span className="dashboard__summary-stat-label">General</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
