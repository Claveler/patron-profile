import { useState, useMemo } from 'react'
import OpportunityCard from '../../components/OpportunityCard/OpportunityCard'
import OpportunityModal from '../../components/OpportunityModal/OpportunityModal'
import { 
  opportunities as initialOpportunities, 
  PIPELINE_STAGES,
  getAssignees,
  getCampaigns 
} from '../../data/opportunities'
import { getStaffById, getCampaignNameById } from '../../data/campaigns'
import './MovesManagement.css'

// Calculate days since last contact
const getDaysSinceContact = (dateStr) => {
  if (!dateStr) return null
  const lastContact = new Date(dateStr)
  const today = new Date()
  const diffTime = today - lastContact
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function MovesManagement({ onNavigateToPatron, onSelectOpportunity, embedded = false }) {
  const [opportunities, setOpportunities] = useState(
    initialOpportunities.filter(opp => opp.status === 'open')
  )
  const [filterOfficer, setFilterOfficer] = useState('all')
  const [filterCampaign, setFilterCampaign] = useState('all')
  const [draggedOpportunity, setDraggedOpportunity] = useState(null)
  
  // Create opportunity modal state
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createDefaultStage, setCreateDefaultStage] = useState(null)

  const assignees = getAssignees()
  const campaigns = getCampaigns()

  // Resolve assignee IDs to staff objects for display
  const assigneeOptions = useMemo(() => {
    return assignees.map(id => getStaffById(id)).filter(Boolean)
  }, [assignees])

  // Resolve campaign IDs to display objects
  const campaignOptions = useMemo(() => {
    return campaigns.map(id => ({ id, name: getCampaignNameById(id) }))
  }, [campaigns])

  // Filter opportunities
  const filteredOpportunities = opportunities.filter(opp => {
    if (filterOfficer !== 'all' && opp.assignedToId !== filterOfficer) return false
    if (filterCampaign !== 'all' && opp.campaignId !== filterCampaign) return false
    return true
  })

  // Get opportunities for a specific stage
  const getOpportunitiesForStage = (stageId) => {
    return filteredOpportunities.filter(opp => opp.stage === stageId)
  }

  // Calculate total pipeline value for a stage
  const getStageTotalValue = (stageId) => {
    return getOpportunitiesForStage(stageId).reduce((sum, opp) => sum + opp.askAmount, 0)
  }

  // Calculate total pipeline value
  const getTotalPipelineValue = () => {
    return filteredOpportunities.reduce((sum, opp) => sum + opp.askAmount, 0)
  }

  // Drag handlers
  const handleDragStart = (e, opportunity) => {
    setDraggedOpportunity(opportunity)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, stageId) => {
    e.preventDefault()
    if (draggedOpportunity && draggedOpportunity.stage !== stageId) {
      setOpportunities(prev => prev.map(opp =>
        opp.id === draggedOpportunity.id ? { ...opp, stage: stageId } : opp
      ))
    }
    setDraggedOpportunity(null)
  }

  const handleDragEnd = () => {
    setDraggedOpportunity(null)
  }

  const handleOpportunityClick = (opportunity) => {
    if (onSelectOpportunity) {
      onSelectOpportunity(opportunity.id)
    }
  }

  const handlePatronClick = (patronId) => {
    if (onNavigateToPatron) {
      onNavigateToPatron(patronId)
    }
  }
  
  // Create opportunity handlers
  const handleCreateClick = (defaultStage = null) => {
    setCreateDefaultStage(defaultStage)
    setShowCreateModal(true)
  }
  
  const handleOpportunityCreated = (newOpportunity) => {
    // Add the new opportunity to local state so it appears immediately
    if (newOpportunity.status === 'open') {
      setOpportunities(prev => [...prev, newOpportunity])
    }
  }

  return (
    <div className={`moves-management ${embedded ? 'moves-management--embedded' : ''}`}>
      {/* Page Header / Breadcrumb - hidden when embedded */}
      {!embedded && (
        <div className="moves-management__header">
          <div className="moves-management__breadcrumb">
            <span className="moves-management__breadcrumb-section">Fundraising</span>
            <i className="fa-solid fa-chevron-right moves-management__breadcrumb-separator"></i>
          </div>
          <h1 className="moves-management__title">Pipeline</h1>
        </div>
      )}

      {/* Main Content Container */}
      <div className="moves-management__container">
        {/* Toolbar with filters and total */}
        <div className="moves-management__toolbar">
          <div className="moves-management__total">
            Total Pipeline: <strong>{formatCurrency(getTotalPipelineValue())}</strong>
            <span className="moves-management__total-count">
              ({filteredOpportunities.length} opportunities)
            </span>
          </div>
          <div className="moves-management__filters">
            <label className="moves-management__filter-label">
              <i className="fa-solid fa-user"></i>
              Assigned To:
            </label>
            <select
              className="moves-management__filter-select"
              value={filterOfficer}
              onChange={(e) => setFilterOfficer(e.target.value)}
            >
              <option value="all">All Staff</option>
              {assigneeOptions.map(staff => (
                <option key={staff.id} value={staff.id}>
                  {staff.name} ({staff.initials})
                </option>
              ))}
            </select>
            
            <label className="moves-management__filter-label">
              <i className="fa-solid fa-bullhorn"></i>
              Campaign:
            </label>
            <select
              className="moves-management__filter-select"
              value={filterCampaign}
              onChange={(e) => setFilterCampaign(e.target.value)}
            >
              <option value="all">All Campaigns</option>
              {campaignOptions.map(campaign => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </option>
              ))}
            </select>
            
            <button 
              className="moves-management__create-btn"
              onClick={() => handleCreateClick()}
            >
              Create opportunity
            </button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="moves-management__board">
        {PIPELINE_STAGES.map(stage => (
          <div
            key={stage.id}
            className={`moves-management__column ${draggedOpportunity ? 'moves-management__column--droppable' : ''}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            {/* Column Header */}
            <div className="moves-management__column-header">
              <div className="moves-management__column-title">
                <div className="moves-management__column-title-left">
                  <span className="moves-management__column-name">{stage.label}</span>
                  <span className="moves-management__column-count">
                    {getOpportunitiesForStage(stage.id).length}
                  </span>
                </div>
                {stage.id !== 'stewardship' && (
                  <button
                    className="moves-management__column-add"
                    onClick={() => handleCreateClick(stage.id)}
                    title={`Create opportunity in ${stage.label}`}
                  >
                    <i className="fa-solid fa-plus"></i>
                  </button>
                )}
              </div>
              <div className="moves-management__column-value">
                {formatCurrency(getStageTotalValue(stage.id))}
              </div>
            </div>

            {/* Column Cards */}
            <div className="moves-management__cards">
              {getOpportunitiesForStage(stage.id).map(opportunity => (
                <div
                  key={opportunity.id}
                  className={`moves-management__card-wrapper ${draggedOpportunity?.id === opportunity.id ? 'moves-management__card-wrapper--dragging' : ''}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, opportunity)}
                  onDragEnd={handleDragEnd}
                >
                  <OpportunityCard
                    opportunity={opportunity}
                    variant="kanban"
                    onClick={handleOpportunityClick}
                    onPatronClick={handlePatronClick}
                    showPatronName={true}
                  />
                </div>
              ))}
              
              {getOpportunitiesForStage(stage.id).length === 0 && (
                <div className="moves-management__empty">
                  No opportunities
                </div>
              )}
            </div>
          </div>
        ))}
        </div>
      </div>
      
      {/* Create Opportunity Modal */}
      <OpportunityModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleOpportunityCreated}
        defaultStage={createDefaultStage}
      />
    </div>
  )
}

export default MovesManagement
