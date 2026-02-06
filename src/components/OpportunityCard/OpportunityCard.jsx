import './OpportunityCard.css'

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

// Calculate days since a date
const getDaysSince = (dateStr) => {
  if (!dateStr) return null
  const date = new Date(dateStr)
  const today = new Date()
  const diffTime = today - date
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

// Get contact status based on days
const getContactStatus = (days) => {
  if (days === null) return 'unknown'
  if (days <= 14) return 'good'
  if (days <= 30) return 'warning'
  return 'overdue'
}

// Stage display config
const stageConfig = {
  identification: { label: 'Identification', color: 'gray' },
  qualification: { label: 'Qualification', color: 'blue' },
  cultivation: { label: 'Cultivation', color: 'purple' },
  solicitation: { label: 'Solicitation', color: 'orange' },
  stewardship: { label: 'Stewardship', color: 'green' },
}

function OpportunityCard({ 
  opportunity, 
  variant = 'compact', // compact, full, kanban
  onClick,
  onPatronClick,
  showPatronName = true,
  className = ''
}) {
  if (!opportunity) return null

  const daysSinceContact = getDaysSince(opportunity.lastContact)
  const contactStatus = getContactStatus(daysSinceContact)
  const stage = stageConfig[opportunity.stage] || { label: opportunity.stage, color: 'gray' }
  const isClosed = opportunity.status === 'won' || opportunity.status === 'lost'

  const handleClick = (e) => {
    if (onClick) {
      onClick(opportunity)
    }
  }

  const handlePatronClick = (e) => {
    e.stopPropagation()
    if (onPatronClick) {
      onPatronClick(opportunity.patronId)
    }
  }

  // Compact variant - for sidebar panel
  if (variant === 'compact') {
    return (
      <div 
        className={`opportunity-card opportunity-card--compact ${isClosed ? 'opportunity-card--closed' : ''} ${className}`}
        onClick={handleClick}
      >
        <div className="opportunity-card__header">
          <span className="opportunity-card__name">{opportunity.name}</span>
          <span className="opportunity-card__amount">{formatCurrency(opportunity.askAmount)}</span>
        </div>
        <div className="opportunity-card__meta">
          <span className={`opportunity-card__stage opportunity-card__stage--${stage.color}`}>
            {stage.label}
          </span>
          {opportunity.probability && (
            <span className="opportunity-card__probability">{opportunity.probability}%</span>
          )}
        </div>
        {opportunity.nextAction && !isClosed && (
          <div className="opportunity-card__action">
            <i className="fa-solid fa-arrow-right"></i>
            <span>{opportunity.nextAction}</span>
          </div>
        )}
        {isClosed && (
          <div className={`opportunity-card__status opportunity-card__status--${opportunity.status}`}>
            <i className={`fa-solid ${opportunity.status === 'won' ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
            <span>{opportunity.status === 'won' ? 'Closed Won' : 'Closed Lost'}</span>
          </div>
        )}
      </div>
    )
  }

  // Kanban variant - for pipeline board
  if (variant === 'kanban') {
    return (
      <div 
        className={`opportunity-card opportunity-card--kanban ${className}`}
        onClick={handleClick}
      >
        <div className="opportunity-card__header">
          <span className="opportunity-card__name">{opportunity.name}</span>
          <span className="opportunity-card__amount">{formatCurrency(opportunity.askAmount)}</span>
        </div>
        {showPatronName && (
          <span 
            className="opportunity-card__patron"
            onClick={handlePatronClick}
            title="View patron profile"
          >
            {opportunity.patronName}
          </span>
        )}
        <div className="opportunity-card__contact">
          <span className="opportunity-card__date">
            Last: {daysSinceContact !== null ? `${daysSinceContact}d ago` : '—'}
          </span>
          <span className={`opportunity-card__contact-status opportunity-card__contact-status--${contactStatus}`}>
            {contactStatus === 'overdue' && <i className="fa-solid fa-triangle-exclamation"></i>}
          </span>
        </div>
        {opportunity.nextAction && (
          <div className="opportunity-card__action">
            <i className="fa-solid fa-arrow-right"></i>
            <span>{opportunity.nextAction}</span>
          </div>
        )}
        <div className="opportunity-card__footer">
          <span className="opportunity-card__assignee" title={opportunity.assignedTo}>
            {opportunity.assignedToInitials}
          </span>
          {opportunity.campaign && (
            <span className="opportunity-card__campaign" title={opportunity.campaign.name}>
              {opportunity.campaign.name.length > 15 
                ? opportunity.campaign.name.substring(0, 15) + '...' 
                : opportunity.campaign.name}
            </span>
          )}
        </div>
      </div>
    )
  }

  // Full variant - for list view
  return (
    <div 
      className={`opportunity-card opportunity-card--full ${isClosed ? 'opportunity-card--closed' : ''} ${className}`}
      onClick={handleClick}
    >
      <div className="opportunity-card__main">
        <div className="opportunity-card__info">
          <span className="opportunity-card__name">{opportunity.name}</span>
          {showPatronName && (
            <span 
              className="opportunity-card__patron"
              onClick={handlePatronClick}
            >
              {opportunity.patronName}
            </span>
          )}
        </div>
        <span className="opportunity-card__amount">{formatCurrency(opportunity.askAmount)}</span>
        <span className={`opportunity-card__stage opportunity-card__stage--${stage.color}`}>
          {stage.label}
        </span>
        {opportunity.probability && (
          <span className="opportunity-card__probability">{opportunity.probability}%</span>
        )}
        <span className="opportunity-card__expected">
          {opportunity.expectedClose || '—'}
        </span>
        <span className="opportunity-card__assignee-full">
          {opportunity.assignedTo}
        </span>
      </div>
      {opportunity.nextAction && !isClosed && (
        <div className="opportunity-card__action-row">
          <i className="fa-solid fa-arrow-right"></i>
          <span>{opportunity.nextAction}</span>
          <span className={`opportunity-card__contact-days opportunity-card__contact-days--${contactStatus}`}>
            {daysSinceContact !== null ? `${daysSinceContact}d since contact` : 'No contact recorded'}
          </span>
        </div>
      )}
    </div>
  )
}

export default OpportunityCard
