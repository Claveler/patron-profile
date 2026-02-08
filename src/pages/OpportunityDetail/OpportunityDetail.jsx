import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getOpportunityById, PIPELINE_STAGES, updateOpportunityStage, closeOpportunityAsLost } from '../../data/opportunities'
import { formatDate, getPatronById, getPatronDisplayName, getInteractionsByOpportunityId } from '../../data/patrons'
import { getStaffNameById, getFundNameById, getCampaignNameById } from '../../data/campaigns'
import ActivityModal from '../../components/ActivityModal/ActivityModal'
import ActivityTimeline from '../../components/ActivityTimeline/ActivityTimeline'
import CloseWonModal from '../../components/CloseWonModal/CloseWonModal'
import './OpportunityDetail.css'

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

// Days since a date
const getDaysSince = (dateStr) => {
  if (!dateStr) return null
  const date = new Date(dateStr)
  const today = new Date()
  return Math.floor((today - date) / (1000 * 60 * 60 * 24))
}

function OpportunityDetail() {
  const { oppId: opportunityId } = useParams()
  const navigate = useNavigate()
  const [opportunity, setOpportunity] = useState(() => getOpportunityById(opportunityId))

  // Editable state
  const [editMode, setEditMode] = useState(false)
  const [askAmount, setAskAmount] = useState(opportunity?.askAmount || 0)
  const [probability, setProbability] = useState(opportunity?.probability || 50)
  const [expectedClose, setExpectedClose] = useState(opportunity?.expectedClose || '')
  const [nextAction, setNextAction] = useState(opportunity?.nextAction || '')
  
  // Actions dropdown state
  const [actionsOpen, setActionsOpen] = useState(false)
  const actionsRef = useRef(null)

  // Modal states
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [showCloseWonModal, setShowCloseWonModal] = useState(false)

  // Close actions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (actionsRef.current && !actionsRef.current.contains(e.target)) {
        setActionsOpen(false)
      }
    }
    if (actionsOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [actionsOpen])
  
  if (!opportunity) {
    return (
      <div className="opportunity-detail">
        <div className="opportunity-detail__header">
          <div className="opportunity-detail__breadcrumb">
            <span className="opportunity-detail__breadcrumb-section">Fundraising</span>
            <i className="fa-solid fa-chevron-right opportunity-detail__breadcrumb-separator"></i>
            <button className="opportunity-detail__breadcrumb-link" onClick={() => navigate(-1)}>
              Opportunities
            </button>
          </div>
          <div className="opportunity-detail__title-row">
            <h1 className="opportunity-detail__title">Opportunity Not Found</h1>
          </div>
        </div>
        <div className="opportunity-detail__container">
          <div className="opportunity-detail__not-found">
            <i className="fa-solid fa-bullseye"></i>
            <h2>Opportunity Not Found</h2>
            <p>The opportunity you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    )
  }

  const currentStageIndex = PIPELINE_STAGES.findIndex(s => s.id === opportunity.stage)
  const currentStageLabel = PIPELINE_STAGES[currentStageIndex]?.label || opportunity.stage
  const daysSinceContact = getDaysSince(opportunity.lastContact)
  const isClosed = opportunity.status === 'won' || opportunity.status === 'lost'

  // Resolve display names from normalized IDs
  const patron = getPatronById(opportunity.patronId)
  const patronName = patron ? getPatronDisplayName(patron) : opportunity.patronId

  const handleSave = () => {
    console.log('Saving:', { askAmount, probability, expectedClose, nextAction })
    setEditMode(false)
    setActionsOpen(false)
    alert('Changes saved (mock - no real persistence)')
  }

  const handleAdvanceStage = () => {
    if (currentStageIndex < PIPELINE_STAGES.length - 1) {
      const nextStage = PIPELINE_STAGES[currentStageIndex + 1]
      updateOpportunityStage(opportunityId, nextStage.id)
      setOpportunity(getOpportunityById(opportunityId))
    }
    setActionsOpen(false)
  }

  const handleCloseWon = () => {
    setShowCloseWonModal(true)
    setActionsOpen(false)
  }

  const handleCloseWonSuccess = (result) => {
    console.log('Closed as won:', result)
    setOpportunity(getOpportunityById(opportunityId))
  }

  const handleCloseLost = () => {
    setActionsOpen(false)
    const reason = prompt('Why was this opportunity lost?', 'Not interested at this time')
    if (reason) {
      closeOpportunityAsLost(opportunityId, reason)
      setOpportunity(getOpportunityById(opportunityId))
    }
  }

  const handleLogContact = () => {
    setShowActivityModal(true)
  }

  const handleActivitySuccess = (activity) => {
    console.log('Logged activity:', activity)
    setOpportunity(getOpportunityById(opportunityId))
  }

  const handlePatronClick = () => {
    navigate(`/patrons/${opportunity.patronId}`)
  }

  // Badge for stage / status
  const getStageBadgeClass = () => {
    if (isClosed) {
      return opportunity.status === 'won'
        ? 'opportunity-detail__badge--won'
        : 'opportunity-detail__badge--lost'
    }
    return 'opportunity-detail__badge--stage'
  }

  const getStageBadgeLabel = () => {
    if (isClosed) {
      return opportunity.status === 'won' ? 'Closed Won' : 'Closed Lost'
    }
    return currentStageLabel
  }

  const getStageBadgeIcon = () => {
    if (opportunity.status === 'won') return 'fa-solid fa-check-circle'
    if (opportunity.status === 'lost') return 'fa-solid fa-times-circle'
    return 'fa-solid fa-bullseye'
  }

  return (
    <div className="opportunity-detail">
      {/* Dark Header Banner */}
      <div className="opportunity-detail__header">
        <div className="opportunity-detail__breadcrumb">
          <span className="opportunity-detail__breadcrumb-section">Fundraising</span>
          <i className="fa-solid fa-chevron-right opportunity-detail__breadcrumb-separator"></i>
          <button className="opportunity-detail__breadcrumb-link" onClick={() => navigate(-1)}>
            Opportunities
          </button>
          <i className="fa-solid fa-chevron-right opportunity-detail__breadcrumb-separator"></i>
        </div>
        <div className="opportunity-detail__title-row">
          <h1 className="opportunity-detail__title">{opportunity.name}</h1>
          <span className={`opportunity-detail__badge ${getStageBadgeClass()}`}>
            <i className={getStageBadgeIcon()}></i>
            {getStageBadgeLabel()}
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="opportunity-detail__container">
        {/* Info Box */}
        <div className="opportunity-detail__infobox">
          <div className="opportunity-detail__infobox-grid">
            {/* Row 1: Patron + Ask Amount */}
            <div className="opportunity-detail__infobox-item">
              <span className="opportunity-detail__infobox-label">
                <i className="fa-solid fa-user"></i> Patron
              </span>
              <span 
                className="opportunity-detail__infobox-value opportunity-detail__infobox-value--link"
                onClick={handlePatronClick}
              >
                {patronName}
              </span>
            </div>
            <div className="opportunity-detail__infobox-item">
              <span className="opportunity-detail__infobox-label">
                <i className="fa-solid fa-dollar-sign"></i> Ask Amount
              </span>
              <span className="opportunity-detail__infobox-value opportunity-detail__infobox-value--amount">
                {formatCurrency(opportunity.askAmount)}
              </span>
            </div>

            {/* Row 2: Campaign + Assigned To */}
            <div className="opportunity-detail__infobox-item">
              <span className="opportunity-detail__infobox-label">
                <i className="fa-solid fa-flag"></i> Campaign
              </span>
              <span className="opportunity-detail__infobox-value">
                {opportunity.campaignId ? getCampaignNameById(opportunity.campaignId) : '—'}
              </span>
            </div>
            <div className="opportunity-detail__infobox-item">
              <span className="opportunity-detail__infobox-label">
                <i className="fa-solid fa-user-tie"></i> Assigned To
              </span>
              <span className="opportunity-detail__infobox-value">
                {getStaffNameById(opportunity.assignedToId)}
              </span>
            </div>

            {/* Row 3: Fund + Created */}
            <div className="opportunity-detail__infobox-item">
              <span className="opportunity-detail__infobox-label">
                <i className="fa-solid fa-landmark"></i> Fund
              </span>
              <span className="opportunity-detail__infobox-value">
                {opportunity.fundId ? getFundNameById(opportunity.fundId) : '—'}
              </span>
            </div>
            <div className="opportunity-detail__infobox-item">
              <span className="opportunity-detail__infobox-label">
                <i className="fa-solid fa-calendar"></i> Created
              </span>
              <span className="opportunity-detail__infobox-value">
                {formatDate(opportunity.createdDate)}
              </span>
            </div>

            {/* Row 4: Description + Expected Close */}
            {opportunity.description && (
              <div className="opportunity-detail__infobox-item">
                <span className="opportunity-detail__infobox-label">
                  <i className="fa-solid fa-align-left"></i> Description
                </span>
                <span className="opportunity-detail__infobox-value">
                  {opportunity.description}
                </span>
              </div>
            )}
            <div className="opportunity-detail__infobox-item">
              <span className="opportunity-detail__infobox-label">
                <i className="fa-solid fa-calendar-check"></i> Expected Close
              </span>
              <span className="opportunity-detail__infobox-value">
                {formatDate(opportunity.expectedClose)}
              </span>
            </div>

            {/* Closed fields if applicable */}
            {opportunity.closedDate && (
              <div className="opportunity-detail__infobox-item">
                <span className="opportunity-detail__infobox-label">
                  <i className="fa-solid fa-calendar-xmark"></i> Closed
                </span>
                <span className="opportunity-detail__infobox-value">
                  {formatDate(opportunity.closedDate)}
                </span>
              </div>
            )}
            {opportunity.closedReason && (
              <div className="opportunity-detail__infobox-item">
                <span className="opportunity-detail__infobox-label">
                  <i className="fa-solid fa-comment"></i> Close Reason
                </span>
                <span className="opportunity-detail__infobox-value">
                  {opportunity.closedReason}
                </span>
              </div>
            )}
          </div>

          {/* Actions Button */}
          {!isClosed && (
            <div className="opportunity-detail__actions-wrapper" ref={actionsRef}>
              {editMode ? (
                <div className="opportunity-detail__edit-actions">
                  <button 
                    className="opportunity-detail__btn opportunity-detail__btn--secondary"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="opportunity-detail__btn opportunity-detail__btn--primary"
                    onClick={handleSave}
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <>
                  <button 
                    className="opportunity-detail__actions-btn"
                    onClick={() => setActionsOpen(!actionsOpen)}
                  >
                    Actions
                    <i className={`fa-solid fa-chevron-${actionsOpen ? 'up' : 'down'}`}></i>
                  </button>
                  {actionsOpen && (
                    <div className="opportunity-detail__actions-dropdown">
                      <button onClick={() => { setEditMode(true); setActionsOpen(false) }}>
                        <i className="fa-solid fa-pen"></i>
                        Edit Opportunity
                      </button>
                      {currentStageIndex < PIPELINE_STAGES.length - 1 && (
                        <button onClick={handleAdvanceStage}>
                          <i className="fa-solid fa-forward"></i>
                          Advance to {PIPELINE_STAGES[currentStageIndex + 1]?.label}
                        </button>
                      )}
                      <button onClick={handleLogContact}>
                        <i className="fa-solid fa-phone"></i>
                        Log Contact
                      </button>
                      <div className="opportunity-detail__actions-divider"></div>
                      <button className="opportunity-detail__actions-dropdown-won" onClick={handleCloseWon}>
                        <i className="fa-solid fa-check-circle"></i>
                        Close as Won
                      </button>
                      <button className="opportunity-detail__actions-dropdown-lost" onClick={handleCloseLost}>
                        <i className="fa-solid fa-times-circle"></i>
                        Close as Lost
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Content Wrapper */}
        <div className="opportunity-detail__content-wrapper">
          {/* Pipeline Stepper */}
          <div className="opportunity-detail__stepper">
            {PIPELINE_STAGES.map((stage, index) => {
              const isCompleted = index < currentStageIndex
              const isCurrent = index === currentStageIndex
              const isFuture = index > currentStageIndex
              
              return (
                <div 
                  key={stage.id}
                  className={`opportunity-detail__stage ${
                    isCompleted ? 'opportunity-detail__stage--completed' : ''
                  } ${isCurrent ? 'opportunity-detail__stage--current' : ''} ${
                    isFuture ? 'opportunity-detail__stage--future' : ''
                  }`}
                >
                  <div className="opportunity-detail__stage-circle">
                    {isCompleted ? (
                      <i className="fa-solid fa-check"></i>
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <span className="opportunity-detail__stage-label">{stage.label}</span>
                </div>
              )
            })}
          </div>

          {/* Key Metrics */}
          <div className="opportunity-detail__metrics">
            <div className="opportunity-detail__metric">
              <span className="opportunity-detail__metric-label">Ask Amount</span>
              {editMode ? (
                <input
                  type="number"
                  value={askAmount}
                  onChange={(e) => setAskAmount(parseInt(e.target.value) || 0)}
                  className="opportunity-detail__input"
                />
              ) : (
                <span className="opportunity-detail__metric-value opportunity-detail__metric-value--large">
                  {formatCurrency(opportunity.askAmount)}
                </span>
              )}
            </div>
            
            <div className="opportunity-detail__metric">
              <span className="opportunity-detail__metric-label">Probability</span>
              {editMode ? (
                <select
                  value={probability}
                  onChange={(e) => setProbability(parseInt(e.target.value))}
                  className="opportunity-detail__input"
                >
                  {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(val => (
                    <option key={val} value={val}>{val}%</option>
                  ))}
                </select>
              ) : (
                <span className="opportunity-detail__metric-value">
                  {opportunity.probability || 50}%
                </span>
              )}
            </div>
            
            <div className="opportunity-detail__metric">
              <span className="opportunity-detail__metric-label">Expected Close</span>
              {editMode ? (
                <input
                  type="date"
                  value={expectedClose}
                  onChange={(e) => setExpectedClose(e.target.value)}
                  className="opportunity-detail__input"
                />
              ) : (
                <span className="opportunity-detail__metric-value">
                  {formatDate(opportunity.expectedClose)}
                </span>
              )}
            </div>
            
            <div className="opportunity-detail__metric">
              <span className="opportunity-detail__metric-label">Weighted Value</span>
              <span className="opportunity-detail__metric-value">
                {formatCurrency(opportunity.askAmount * (opportunity.probability || 50) / 100)}
              </span>
            </div>
          </div>

          {/* Next Action */}
          <div className="opportunity-detail__section">
            <h3 className="opportunity-detail__section-title">
              <i className="fa-solid fa-arrow-right"></i>
              Next Action
            </h3>
            {editMode ? (
              <textarea
                value={nextAction}
                onChange={(e) => setNextAction(e.target.value)}
                className="opportunity-detail__textarea"
                rows={3}
              />
            ) : (
              <p className="opportunity-detail__section-content">
                {opportunity.nextAction || 'No next action set'}
              </p>
            )}
          </div>

          {/* Contact */}
          <div className="opportunity-detail__section">
            <h3 className="opportunity-detail__section-title">
              <i className="fa-solid fa-clock"></i>
              Contact
            </h3>
            <div className="opportunity-detail__contact-info">
              <span>
                Last contact: <strong>{formatDate(opportunity.lastContact)}</strong>
                {daysSinceContact !== null && (
                  <span className={`opportunity-detail__days ${
                    daysSinceContact > 30 ? 'opportunity-detail__days--overdue' : 
                    daysSinceContact > 14 ? 'opportunity-detail__days--warning' : ''
                  }`}>
                    ({daysSinceContact} days ago)
                  </span>
                )}
              </span>
              <button 
                className="opportunity-detail__log-contact-btn"
                onClick={handleLogContact}
              >
                <i className="fa-solid fa-phone"></i>
                Log contact
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <ActivityTimeline
            gifts={[]}
            activities={getInteractionsByOpportunityId(opportunityId)}
            onAddActivity={handleLogContact}
          />
        </div>
      </div>

      {/* Modals */}
      <ActivityModal
        isOpen={showActivityModal}
        onClose={() => setShowActivityModal(false)}
        onSuccess={handleActivitySuccess}
        patronId={opportunity?.patronId}
        patronName={patronName}
        opportunityId={opportunityId}
        opportunityName={opportunity?.name}
      />

      <CloseWonModal
        isOpen={showCloseWonModal}
        onClose={() => setShowCloseWonModal(false)}
        onSuccess={handleCloseWonSuccess}
        opportunityId={opportunityId}
      />
    </div>
  )
}

export default OpportunityDetail
