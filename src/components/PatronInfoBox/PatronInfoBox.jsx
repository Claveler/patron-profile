import { useState } from 'react'
import { getOpenOpportunitiesForPatron } from '../../data/opportunities'
import './PatronInfoBox.css'

// Format currency
const formatCurrency = (amount) => {
  if (!amount) return '$0'
  if (amount >= 1000) {
    return `$${Math.round(amount / 1000)}K`
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function PatronInfoBox({ patron, isManaged, onCreateOpportunity, onAddActivity, onArchive, onRestore }) {
  const [actionsOpen, setActionsOpen] = useState(false)

  // Check if patron is archived
  const isArchived = patron.status === 'archived'

  // Get opportunity summary for managed prospects
  const openOpportunities = isManaged ? getOpenOpportunitiesForPatron(patron.id) : []
  const totalPipeline = openOpportunities.reduce((sum, opp) => sum + opp.askAmount, 0)
  
  const handleCreateOpportunity = () => {
    setActionsOpen(false)
    if (onCreateOpportunity) {
      onCreateOpportunity()
    }
  }
  
  const handleAddActivity = () => {
    setActionsOpen(false)
    if (onAddActivity) {
      onAddActivity()
    }
  }

  const handleArchive = () => {
    setActionsOpen(false)
    if (onArchive && window.confirm(`Are you sure you want to archive ${patron.firstName} ${patron.lastName}? They will be hidden from the patrons list but can be restored later.`)) {
      onArchive()
    }
  }

  const handleRestore = () => {
    setActionsOpen(false)
    if (onRestore) {
      onRestore()
    }
  }

  return (
    <div className={`patron-info-box ${isArchived ? 'patron-info-box--archived' : ''}`}>
      {/* Archived Banner */}
      {isArchived && (
        <div className="patron-info-box__archived-banner">
          <i className="fa-solid fa-box-archive"></i>
          <span>This patron is archived</span>
          <button className="patron-info-box__restore-btn" onClick={handleRestore}>
            Restore
          </button>
        </div>
      )}
      {/* Photo and Basic Info */}
      <div className="patron-info-box__main">
        <div className="patron-info-box__photo">
          {patron.photo ? (
            <img src={patron.photo} alt={`${patron.firstName} ${patron.lastName}`} />
          ) : (
            <div className="patron-info-box__photo-placeholder">
              <i className="fa-solid fa-user"></i>
            </div>
          )}
        </div>
        <div className="patron-info-box__details">
          <h2 className="patron-info-box__name">
            <span className="patron-info-box__name-first">{patron.firstName}</span>
            {' '}
            <span className="patron-info-box__name-last">{patron.lastName}</span>
          </h2>
          {patron.household && (
            <div className="patron-info-box__household">
              <a href="#" className="patron-info-box__household-link">
                {patron.household.name}
              </a>
              {patron.household.verified && (
                <i className="fa-solid fa-badge-check patron-info-box__verified"></i>
              )}
            </div>
          )}
          <div className="patron-info-box__tags">
            <span className="patron-info-box__tag patron-info-box__tag--accent">
              {patron.category}
            </span>
            <span className="patron-info-box__id">
              Id: {patron.id}
              <button className="patron-info-box__copy" title="Copy ID">
                <i className="fa-regular fa-copy"></i>
              </button>
            </span>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="patron-info-box__section patron-info-box__contact">
        {patron.email && (
          <div className="patron-info-box__info-item">
            <i className="fa-solid fa-envelope patron-info-box__info-icon"></i>
            <span>{patron.email}</span>
            <i className="fa-solid fa-star patron-info-box__star" title="Primary email"></i>
          </div>
        )}
        {patron.phone && (
          <div className="patron-info-box__info-item">
            <i className="fa-solid fa-phone patron-info-box__info-icon"></i>
            <span>{patron.phone}</span>
          </div>
        )}
        {patron.address && (
          <div className="patron-info-box__info-item">
            <i className="fa-solid fa-location-dot patron-info-box__info-icon"></i>
            <span>{patron.address}</span>
          </div>
        )}
      </div>

      {/* Membership Info - Only show if membership data exists */}
      {patron.membership && (
        <div className="patron-info-box__section patron-info-box__membership">
          <div className="patron-info-box__info-item">
            <i className="fa-solid fa-address-card patron-info-box__info-icon"></i>
            <span>
              {patron.membership.programme ? `${patron.membership.programme} - ` : ''}
              {patron.membership.tier || 'Member'}
            </span>
          </div>
          {patron.membership.memberSince && (
            <div className="patron-info-box__info-item">
              <i className="fa-solid fa-calendar-day patron-info-box__info-icon"></i>
              <span>Member since {patron.membership.memberSince}</span>
            </div>
          )}
          {patron.membership.daysToRenewal !== undefined && (
            <div className="patron-info-box__info-item">
              <i className="fa-solid fa-clock-rotate-left patron-info-box__info-icon"></i>
              <span>{patron.membership.daysToRenewal} days to renewal</span>
              {patron.membership.daysToRenewal < 180 && (
                <i className="fa-solid fa-triangle-exclamation patron-info-box__warning" title="Renewal approaching"></i>
              )}
            </div>
          )}
        </div>
      )}

      {/* Managed Prospect Info - Shows assignedTo and opportunity summary */}
      {isManaged && (
        <div className="patron-info-box__section patron-info-box__prospect-info">
          <div className="patron-info-box__info-item">
            <i className="fa-solid fa-user-tie patron-info-box__info-icon"></i>
            <span>Assigned to <strong>{patron.assignedTo}</strong></span>
          </div>
          {openOpportunities.length > 0 && (
            <div className="patron-info-box__opp-summary">
              <i className="fa-solid fa-bullseye patron-info-box__info-icon"></i>
              <span>
                {openOpportunities.length} active opportunit{openOpportunities.length === 1 ? 'y' : 'ies'} · {formatCurrency(totalPipeline)} pipeline
              </span>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="patron-info-box__actions">
        <div className="patron-info-box__dropdown">
          <button 
            className="patron-info-box__actions-btn"
            onClick={() => setActionsOpen(!actionsOpen)}
          >
            Actions
            <i className="fa-solid fa-chevron-down"></i>
          </button>
          {actionsOpen && (
            <div className="patron-info-box__dropdown-menu">
              <button className="patron-info-box__dropdown-item">
                <i className="fa-solid fa-pen"></i>
                Edit Information
              </button>
              <button className="patron-info-box__dropdown-item">
                <i className="fa-solid fa-tags"></i>
                Change Category
              </button>
              <button className="patron-info-box__dropdown-item" onClick={handleAddActivity}>
                <i className="fa-solid fa-plus"></i>
                Add activity
              </button>
              <button className="patron-info-box__dropdown-item">
                <i className="fa-solid fa-link"></i>
                Add relationship
              </button>
              <button className="patron-info-box__dropdown-item">
                <i className="fa-solid fa-user"></i>
                Change Assignment
              </button>
              <button className="patron-info-box__dropdown-item">
                <i className="fa-solid fa-fire-flame-curved"></i>
                Modify Engagement Level
              </button>
              {isManaged && (
                <button className="patron-info-box__dropdown-item" onClick={handleCreateOpportunity}>
                  <i className="fa-solid fa-bullseye"></i>
                  Create Opportunity
                </button>
              )}
              <div className="patron-info-box__dropdown-divider"></div>
              {isArchived ? (
                <button className="patron-info-box__dropdown-item patron-info-box__dropdown-item--success" onClick={handleRestore}>
                  <i className="fa-solid fa-rotate-left"></i>
                  Restore Patron
                </button>
              ) : (
                <button className="patron-info-box__dropdown-item patron-info-box__dropdown-item--danger" onClick={handleArchive}>
                  <i className="fa-solid fa-box-archive"></i>
                  Archive Patron
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PatronInfoBox
