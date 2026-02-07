import { useState, useMemo, useEffect } from 'react'
import OpportunityCard from '../../components/OpportunityCard/OpportunityCard'
import OpportunityModal from '../../components/OpportunityModal/OpportunityModal'
import { 
  opportunities, 
  getOpenOpportunities, 
  getCampaigns, 
  getAssignees,
  PIPELINE_STAGES,
  getPipelineTotals
} from '../../data/opportunities'
import { getStaffById, getCampaignNameById } from '../../data/campaigns'
import { getPatronById, getPatronDisplayName } from '../../data/patrons'
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

function OpportunitiesList({ onSelectOpportunity, onSelectPatron, embedded = false, initialAssigneeFilter, onClearInitialFilter }) {
  // Filters
  const [stageFilter, setStageFilter] = useState('all')
  const [campaignFilter, setCampaignFilter] = useState('all')
  const [assigneeFilter, setAssigneeFilter] = useState(initialAssigneeFilter || 'all')
  const [statusFilter, setStatusFilter] = useState('open')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Sync assignee filter when initial filter changes (e.g. navigating from PatronsList)
  useEffect(() => {
    if (initialAssigneeFilter) {
      setAssigneeFilter(initialAssigneeFilter)
      if (onClearInitialFilter) onClearInitialFilter()
    }
  }, [initialAssigneeFilter])
  
  // Refresh trigger - incremented when a new opportunity is created to force useMemo recalculation
  const [refreshKey, setRefreshKey] = useState(0)

  // Get filter options
  const campaigns = getCampaigns()
  const assignees = getAssignees()

  // Resolve assignee IDs to staff objects for display
  const assigneeOptions = useMemo(() => {
    return assignees.map(id => getStaffById(id)).filter(Boolean)
  }, [assignees])

  // Resolve campaign IDs to display objects
  const campaignOptions = useMemo(() => {
    return campaigns.map(id => ({ id, name: getCampaignNameById(id) }))
  }, [campaigns])

  // Filter opportunities
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(opp => {
      // Status filter
      if (statusFilter === 'open' && opp.status !== 'open') return false
      if (statusFilter === 'closed' && opp.status === 'open') return false
      
      // Stage filter
      if (stageFilter !== 'all' && opp.stage !== stageFilter) return false
      
      // Campaign filter
      if (campaignFilter !== 'all' && opp.campaignId !== campaignFilter) return false
      
      // Assignee filter
      if (assigneeFilter !== 'all' && opp.assignedToId !== assigneeFilter) return false
      
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const patron = getPatronById(opp.patronId)
        const patronName = patron ? getPatronDisplayName(patron) : ''
        return (
          opp.name.toLowerCase().includes(query) ||
          patronName.toLowerCase().includes(query) ||
          (opp.description && opp.description.toLowerCase().includes(query))
        )
      }
      
      return true
    })
  }, [stageFilter, campaignFilter, assigneeFilter, statusFilter, searchQuery, refreshKey])

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
  }, [refreshKey])

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
    setShowCreateModal(true)
  }

  const handleOpportunityCreated = (newOpportunity) => {
    // Increment refresh key to force useMemo recalculation with the newly added opportunity
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className={`opportunities-list ${embedded ? 'opportunities-list--embedded' : ''}`}>
      {/* Dark Fever Header with Breadcrumb - hidden when embedded */}
      {!embedded && (
        <div className="opportunities-list__header">
          <div className="opportunities-list__breadcrumb">
            <span className="opportunities-list__breadcrumb-section">Fundraising</span>
            <i className="fa-solid fa-chevron-right opportunities-list__breadcrumb-separator"></i>
          </div>
          <h1 className="opportunities-list__title">Opportunities</h1>
        </div>
      )}

      {/* Main Content Container */}
      <div className="opportunities-list__container">
        {/* Toolbar with search, filters, and create button */}
        <div className="opportunities-list__toolbar">
          <div className="opportunities-list__search">
            <i className="fa-solid fa-search opportunities-list__search-icon"></i>
            <input
              type="text"
              className="opportunities-list__search-input"
              placeholder="Search by name, patron, or description"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="opportunities-list__actions">
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
                {campaignOptions.map(campaign => (
                  <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
                ))}
              </select>
              
              <select 
                value={assigneeFilter}
                onChange={(e) => setAssigneeFilter(e.target.value)}
                className="opportunities-list__filter"
              >
                <option value="all">All Assignees</option>
                {assigneeOptions.map(staff => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name}
                  </option>
                ))}
              </select>
            </div>
            
            <button 
              className="opportunities-list__create-btn"
              onClick={handleCreateClick}
            >
              Create opportunity
            </button>
          </div>
        </div>

        {/* Pipeline Stats Summary */}
        <div className="opportunities-list__stats">
          <div className="opportunities-list__stat">
            <span className="opportunities-list__stat-value opportunities-list__stat-value--highlight">{stats.total}</span>
            <span className="opportunities-list__stat-label">Open</span>
          </div>
          <div className="opportunities-list__stat-divider"></div>
          <div className="opportunities-list__stat">
            <span className="opportunities-list__stat-value">{formatCurrency(stats.totalValue)}</span>
            <span className="opportunities-list__stat-label">Total Pipeline</span>
          </div>
          <div className="opportunities-list__stat-divider"></div>
          <div className="opportunities-list__stat">
            <span className="opportunities-list__stat-value">{formatCurrency(stats.weightedValue)}</span>
            <span className="opportunities-list__stat-label">Weighted</span>
          </div>
        </div>

        {/* Stage breakdown pills */}
        <div className="opportunities-list__stages">
          {PIPELINE_STAGES.map(stage => (
            <button 
              key={stage.id}
              className={`opportunities-list__stage ${stageFilter === stage.id ? 'opportunities-list__stage--active' : ''}`}
              onClick={() => setStageFilter(stageFilter === stage.id ? 'all' : stage.id)}
              data-tooltip={stage.description}
            >
              <span className="opportunities-list__stage-label">{stage.label}</span>
              <span className="opportunities-list__stage-count">{stats.byStage[stage.id]?.count || 0}</span>
            </button>
          ))}
        </div>

        {/* Table header */}
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

      {/* Create Opportunity Modal */}
      <OpportunityModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleOpportunityCreated}
      />
    </div>
  )
}

export default OpportunitiesList
