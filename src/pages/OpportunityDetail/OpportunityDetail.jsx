import { useState } from 'react'
import { getOpportunityById, PIPELINE_STAGES, updateOpportunityStage, closeOpportunityAsLost } from '../../data/opportunities'
import { formatDate, getPatronById, getPatronDisplayName } from '../../data/patrons'
import { getStaffNameById, getFundNameById, getCampaignNameById } from '../../data/campaigns'
import ActivityModal from '../../components/ActivityModal/ActivityModal'
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

// formatDate imported from shared utility

// Days since a date
const getDaysSince = (dateStr) => {
  if (!dateStr) return null
  const date = new Date(dateStr)
  const today = new Date()
  return Math.floor((today - date) / (1000 * 60 * 60 * 24))
}

function OpportunityDetail({ opportunityId, onBack, onNavigateToPatron }) {
  const [opportunity, setOpportunity] = useState(() => getOpportunityById(opportunityId))

  // Editable state (in a real app, this would update the data)
  const [editMode, setEditMode] = useState(false)
  const [askAmount, setAskAmount] = useState(opportunity?.askAmount || 0)
  const [probability, setProbability] = useState(opportunity?.probability || 50)
  const [expectedClose, setExpectedClose] = useState(opportunity?.expectedClose || '')
  const [nextAction, setNextAction] = useState(opportunity?.nextAction || '')
  
  // Modal states
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [showCloseWonModal, setShowCloseWonModal] = useState(false)
  
  if (!opportunity) {
    return (
      <div className="opportunity-detail">
        <div className="opportunity-detail__header">
          <button className="opportunity-detail__back" onClick={onBack}>
            <i className="fa-solid fa-arrow-left"></i>
            Back to Opportunities
          </button>
        </div>
        <div className="opportunity-detail__not-found">
          <i className="fa-solid fa-bullseye"></i>
          <h2>Opportunity Not Found</h2>
          <p>The opportunity you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const currentStageIndex = PIPELINE_STAGES.findIndex(s => s.id === opportunity.stage)
  const daysSinceContact = getDaysSince(opportunity.lastContact)
  const isClosed = opportunity.status === 'won' || opportunity.status === 'lost'

  // Resolve display names from normalized IDs
  const patron = getPatronById(opportunity.patronId)
  const patronName = patron ? getPatronDisplayName(patron) : opportunity.patronId

  const handleSave = () => {
    // In a real app, this would save to backend
    console.log('Saving:', { askAmount, probability, expectedClose, nextAction })
    setEditMode(false)
    alert('Changes saved (mock - no real persistence)')
  }

  const handleAdvanceStage = () => {
    if (currentStageIndex < PIPELINE_STAGES.length - 1) {
      const nextStage = PIPELINE_STAGES[currentStageIndex + 1]
      updateOpportunityStage(opportunityId, nextStage.id)
      // Refresh the opportunity data
      setOpportunity(getOpportunityById(opportunityId))
    }
  }

  const handleCloseWon = () => {
    setShowCloseWonModal(true)
  }

  const handleCloseWonSuccess = (result) => {
    console.log('Closed as won:', result)
    // Refresh the opportunity data
    setOpportunity(getOpportunityById(opportunityId))
  }

  const handleCloseLost = () => {
    const reason = prompt('Why was this opportunity lost?', 'Not interested at this time')
    if (reason) {
      closeOpportunityAsLost(opportunityId, reason)
      // Refresh the opportunity data
      setOpportunity(getOpportunityById(opportunityId))
    }
  }

  const handleLogContact = () => {
    setShowActivityModal(true)
  }

  const handleActivitySuccess = (activity) => {
    console.log('Logged activity:', activity)
    // Refresh the opportunity data to update lastContact
    setOpportunity(getOpportunityById(opportunityId))
  }

  const handlePatronClick = () => {
    if (onNavigateToPatron) {
      onNavigateToPatron(opportunity.patronId)
    }
  }

  return (
    <div className="opportunity-detail">
      {/* Header */}
      <div className="opportunity-detail__header">
        <button className="opportunity-detail__back" onClick={onBack}>
          <i className="fa-solid fa-arrow-left"></i>
          Back to Opportunities
        </button>
        
        <div className="opportunity-detail__actions">
          {!isClosed && (
            <>
              {editMode ? (
                <>
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
                </>
              ) : (
                <button 
                  className="opportunity-detail__btn opportunity-detail__btn--secondary"
                  onClick={() => setEditMode(true)}
                >
                  <i className="fa-solid fa-pen"></i>
                  Edit
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="opportunity-detail__content">
        {/* Left column - Main info */}
        <div className="opportunity-detail__main">
          {/* Title section */}
          <div className="opportunity-detail__title-section">
            <div className="opportunity-detail__title-row">
              <h1 className="opportunity-detail__title">{opportunity.name}</h1>
              {isClosed && (
                <span className={`opportunity-detail__status opportunity-detail__status--${opportunity.status}`}>
                  {opportunity.status === 'won' ? 'Closed Won' : 'Closed Lost'}
                </span>
              )}
            </div>
            <p 
              className="opportunity-detail__patron"
              onClick={handlePatronClick}
            >
              <i className="fa-solid fa-user"></i>
              {patronName}
            </p>
            {opportunity.description && (
              <p className="opportunity-detail__description">{opportunity.description}</p>
            )}
          </div>

          {/* Pipeline stepper */}
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

          {/* Key metrics */}
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

          {/* Contact info */}
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

          {/* Close actions */}
          {!isClosed && (
            <div className="opportunity-detail__close-actions">
              {currentStageIndex < PIPELINE_STAGES.length - 1 && (
                <button 
                  className="opportunity-detail__btn opportunity-detail__btn--advance"
                  onClick={handleAdvanceStage}
                >
                  <i className="fa-solid fa-forward"></i>
                  Advance to {PIPELINE_STAGES[currentStageIndex + 1]?.label.toLowerCase()}
                </button>
              )}
              <button 
                className="opportunity-detail__btn opportunity-detail__btn--won"
                onClick={handleCloseWon}
              >
                <i className="fa-solid fa-check-circle"></i>
                Close as won
              </button>
              <button 
                className="opportunity-detail__btn opportunity-detail__btn--lost"
                onClick={handleCloseLost}
              >
                <i className="fa-solid fa-times-circle"></i>
                Close as lost
              </button>
            </div>
          )}
        </div>

        {/* Right column - Details */}
        <div className="opportunity-detail__sidebar">
          {/* Details card */}
          <div className="opportunity-detail__card">
            <h3 className="opportunity-detail__card-title">Details</h3>
            <dl className="opportunity-detail__details">
              <div className="opportunity-detail__detail">
                <dt>Campaign</dt>
                <dd>{opportunity.campaignId ? getCampaignNameById(opportunity.campaignId) : '—'}</dd>
              </div>
              <div className="opportunity-detail__detail">
                <dt>Fund</dt>
                <dd>{opportunity.fundId ? getFundNameById(opportunity.fundId) : '—'}</dd>
              </div>
              <div className="opportunity-detail__detail">
                <dt>Assigned To</dt>
                <dd>{getStaffNameById(opportunity.assignedToId)}</dd>
              </div>
              <div className="opportunity-detail__detail">
                <dt>Created</dt>
                <dd>{formatDate(opportunity.createdDate)}</dd>
              </div>
              {opportunity.closedDate && (
                <div className="opportunity-detail__detail">
                  <dt>Closed</dt>
                  <dd>{formatDate(opportunity.closedDate)}</dd>
                </div>
              )}
              {opportunity.closedReason && (
                <div className="opportunity-detail__detail">
                  <dt>Close Reason</dt>
                  <dd>{opportunity.closedReason}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Activity card */}
          <div className="opportunity-detail__card">
            <h3 className="opportunity-detail__card-title">Recent Activity</h3>
            <div className="opportunity-detail__activity-placeholder">
              <i className="fa-solid fa-clipboard-list"></i>
              <p>No activity logged for this opportunity yet.</p>
              <span className="opportunity-detail__activity-hint">Use "Log contact" to record interactions.</span>
            </div>
          </div>
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
