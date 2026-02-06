import { useState, useMemo } from 'react'
import OpportunityCard from '../../components/OpportunityCard/OpportunityCard'
import { 
  opportunities, 
  getOpenOpportunities, 
  getCampaigns, 
  getAssignees,
  PIPELINE_STAGES,
  getPipelineTotals
} from '../../data/opportunities'
import './OpportunitiesList.css'

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

function OpportunitiesList({ onSelectOpportunity, onSelectPatron, onCreateOpportunity }) {
  // Filters
  const [stageFilter, setStageFilter] = useState('all')
  const [campaignFilter, setCampaignFilter] = useState('all')
  const [assigneeFilter, setAssigneeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('open')
  const [searchQuery, setSearchQuery] = useState('')

  // Get filter options
  const campaigns = getCampaigns()
  const assignees = getAssignees()

  // Filter opportunities
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(opp => {
      // Status filter
      if (statusFilter === 'open' && opp.status !== 'open') return false
      if (statusFilter === 'closed' && opp.status === 'open') return false
      
      // Stage filter
      if (stageFilter !== 'all' && opp.stage !== stageFilter) return false
      
      // Campaign filter
      if (campaignFilter !== 'all' && opp.campaign?.id !== campaignFilter) return false
      
      // Assignee filter
      if (assigneeFilter !== 'all' && opp.assignedToInitials !== assigneeFilter) return false
      
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          opp.name.toLowerCase().includes(query) ||
          opp.patronName.toLowerCase().includes(query) ||
          (opp.description && opp.description.toLowerCase().includes(query))
        )
      }
      
      return true
    })
  }, [stageFilter, campaignFilter, assigneeFilter, statusFilter, searchQuery])

  // Calculate stats
  const stats = useMemo(() => {
    const openOpps = getOpenOpportunities()
    return {
      total: openOpps.length,
      totalValue: openOpps.reduce((sum, opp) => sum + opp.askAmount, 0),
      weightedValue: openOpps.reduce((sum, opp) => sum + (opp.askAmount * (opp.probability || 50) / 100), 0),
      byStage: PIPELINE_STAGES.reduce((acc, stage) => {
        const stageOpps = openOpps.filter(opp => opp.stage === stage.id)
        acc[stage.id] = {
          count: stageOpps.length,
          value: stageOpps.reduce((sum, opp) => sum + opp.askAmount, 0)
        }
        return acc
      }, {})
    }
  }, [])

  const handleOpportunityClick = (opportunity) => {
    if (onSelectOpportunity) {
      onSelectOpportunity(opportunity.id)
    }
  }

  const handlePatronClick = (patronId) => {
    if (onSelectPatron) {
      onSelectPatron(patronId)
    }
  }

  const handleCreateClick = () => {
    if (onCreateOpportunity) {
      onCreateOpportunity()
    } else {
      alert('This would open a modal to create a new opportunity.')
    }
  }

  return (
    <div className="opportunities-list">
      {/* Header */}
      <div className="opportunities-list__header">
        <div className="opportunities-list__title-row">
          <h1 className="opportunities-list__title">
            <i className="fa-solid fa-bullseye"></i>
            Opportunities
          </h1>
          <button 
            className="opportunities-list__create-btn"
            onClick={handleCreateClick}
          >
            <i className="fa-solid fa-plus"></i>
            Create Opportunity
          </button>
        </div>
        
        {/* Pipeline Stats */}
        <div className="opportunities-list__stats">
          <div className="opportunities-list__stat opportunities-list__stat--highlight">
            <span className="opportunities-list__stat-value">{stats.total}</span>
            <span className="opportunities-list__stat-label">Open Opportunities</span>
          </div>
          <div className="opportunities-list__stat">
            <span className="opportunities-list__stat-value">{formatCurrency(stats.totalValue)}</span>
            <span className="opportunities-list__stat-label">Total Pipeline</span>
          </div>
          <div className="opportunities-list__stat">
            <span className="opportunities-list__stat-value">{formatCurrency(stats.weightedValue)}</span>
            <span className="opportunities-list__stat-label">Weighted Pipeline</span>
          </div>
        </div>

        {/* Stage breakdown */}
        <div className="opportunities-list__stages">
          {PIPELINE_STAGES.map(stage => (
            <div 
              key={stage.id}
              className={`opportunities-list__stage ${stageFilter === stage.id ? 'opportunities-list__stage--active' : ''}`}
              onClick={() => setStageFilter(stageFilter === stage.id ? 'all' : stage.id)}
            >
              <span className="opportunities-list__stage-label">{stage.label}</span>
              <span className="opportunities-list__stage-count">{stats.byStage[stage.id]?.count || 0}</span>
              <span className="opportunities-list__stage-value">
                {formatCurrency(stats.byStage[stage.id]?.value || 0)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="opportunities-list__filters">
        <div className="opportunities-list__search">
          <i className="fa-solid fa-search"></i>
          <input
            type="text"
            placeholder="Search opportunities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="opportunities-list__filter-group">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="opportunities-list__filter"
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="all">All Status</option>
          </select>
          
          <select 
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="opportunities-list__filter"
          >
            <option value="all">All Stages</option>
            {PIPELINE_STAGES.map(stage => (
              <option key={stage.id} value={stage.id}>{stage.label}</option>
            ))}
          </select>
          
          <select 
            value={campaignFilter}
            onChange={(e) => setCampaignFilter(e.target.value)}
            className="opportunities-list__filter"
          >
            <option value="all">All Campaigns</option>
            {campaigns.map(campaign => (
              <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
            ))}
          </select>
          
          <select 
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="opportunities-list__filter"
          >
            <option value="all">All Assignees</option>
            {assignees.map(assignee => (
              <option key={assignee.initials} value={assignee.initials}>
                {assignee.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* List header */}
      <div className="opportunities-list__table-header">
        <span>Opportunity</span>
        <span>Amount</span>
        <span>Stage</span>
        <span>Prob.</span>
        <span>Expected Close</span>
        <span>Assigned To</span>
      </div>

      {/* Opportunities list */}
      <div className="opportunities-list__content">
        {filteredOpportunities.length === 0 ? (
          <div className="opportunities-list__empty">
            <i className="fa-solid fa-bullseye"></i>
            <p>No opportunities match your filters</p>
            <button onClick={() => {
              setStageFilter('all')
              setCampaignFilter('all')
              setAssigneeFilter('all')
              setStatusFilter('open')
              setSearchQuery('')
            }}>
              Clear Filters
            </button>
          </div>
        ) : (
          filteredOpportunities.map(opp => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              variant="full"
              onClick={handleOpportunityClick}
              onPatronClick={handlePatronClick}
              showPatronName={true}
            />
          ))
        )}
      </div>

      {/* Results count */}
      <div className="opportunities-list__footer">
        Showing {filteredOpportunities.length} of {opportunities.length} opportunities
      </div>
    </div>
  )
}

export default OpportunitiesList
