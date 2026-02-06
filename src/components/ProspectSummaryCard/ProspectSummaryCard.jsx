import { useState } from 'react'
import './ProspectSummaryCard.css'

// Format currency
const formatCurrency = (amount) => {
  if (!amount) return '—'
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

// Format date for display
const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

// Probability options
const probabilityOptions = [10, 25, 50, 75, 90]

function ProspectSummaryCard({ prospect, giving, onUpdate }) {
  const [editingField, setEditingField] = useState(null)
  const [tempValue, setTempValue] = useState('')

  if (!prospect) return null

  const daysSinceContact = getDaysSince(prospect.lastContact)
  const isContactOverdue = daysSinceContact !== null && daysSinceContact > 14

  // Get probability color
  const getProbabilityColor = (prob) => {
    if (prob < 25) return 'low'
    if (prob <= 50) return 'medium'
    return 'high'
  }

  const handleEdit = (field, currentValue) => {
    setEditingField(field)
    setTempValue(currentValue)
  }

  const handleSave = (field) => {
    if (onUpdate) {
      onUpdate(field, tempValue)
    }
    setEditingField(null)
    setTempValue('')
  }

  const handleCancel = () => {
    setEditingField(null)
    setTempValue('')
  }

  const handleAction = (action) => {
    alert(`This would open a ${action} dialog/form.`)
  }

  return (
    <div className={`prospect-summary-card wrapper-card ${isContactOverdue ? 'prospect-summary-card--alert' : ''}`}>
      <div className="prospect-summary-card__header">
        <h4 className="prospect-summary-card__title">
          <i className="fa-solid fa-bullseye"></i>
          Prospect Summary
        </h4>
      </div>

      <div className="prospect-summary-card__grid">
        {/* Ask Amount */}
        <div className="prospect-summary-card__field">
          <span className="prospect-summary-card__label">Ask Amount</span>
          <div className="prospect-summary-card__value-row">
            <span className="prospect-summary-card__value prospect-summary-card__value--highlight">
              {formatCurrency(prospect.askAmount)}
            </span>
            <button 
              className="prospect-summary-card__edit-btn"
              onClick={() => handleEdit('askAmount', prospect.askAmount)}
              title="Edit ask amount"
            >
              <i className="fa-solid fa-pencil"></i>
            </button>
          </div>
        </div>

        {/* Probability to Close */}
        <div className="prospect-summary-card__field">
          <span className="prospect-summary-card__label">Probability</span>
          <div className="prospect-summary-card__value-row">
            <span className={`prospect-summary-card__probability prospect-summary-card__probability--${getProbabilityColor(prospect.probability || 50)}`}>
              {prospect.probability || 50}%
            </span>
            <button 
              className="prospect-summary-card__edit-btn"
              onClick={() => handleEdit('probability', prospect.probability)}
              title="Edit probability"
            >
              <i className="fa-solid fa-pencil"></i>
            </button>
          </div>
        </div>

        {/* Expected Close */}
        <div className="prospect-summary-card__field">
          <span className="prospect-summary-card__label">Expected Close</span>
          <div className="prospect-summary-card__value-row">
            <span className="prospect-summary-card__value">
              {prospect.expectedClose || '—'}
            </span>
            <button 
              className="prospect-summary-card__edit-btn"
              onClick={() => handleEdit('expectedClose', prospect.expectedClose)}
              title="Edit expected close"
            >
              <i className="fa-solid fa-pencil"></i>
            </button>
          </div>
        </div>

        {/* Last Contact */}
        <div className={`prospect-summary-card__field ${isContactOverdue ? 'prospect-summary-card__field--alert' : ''}`}>
          <span className="prospect-summary-card__label">Last Contact</span>
          <div className="prospect-summary-card__value-row">
            {isContactOverdue && (
              <i className="fa-solid fa-triangle-exclamation prospect-summary-card__warning-icon"></i>
            )}
            <span className={`prospect-summary-card__value ${isContactOverdue ? 'prospect-summary-card__value--warning' : ''}`}>
              {daysSinceContact !== null ? `${daysSinceContact} days ago` : '—'}
            </span>
            {isContactOverdue ? (
              <button 
                className="prospect-summary-card__log-contact-btn"
                onClick={() => handleAction('log contact')}
              >
                <i className="fa-solid fa-plus"></i>
                Log Contact
              </button>
            ) : (
              <button 
                className="prospect-summary-card__action-btn"
                onClick={() => handleAction('log contact')}
                title="Log new contact"
              >
                <i className="fa-solid fa-plus"></i>
              </button>
            )}
          </div>
        </div>

        {/* Next Action - full width */}
        <div className="prospect-summary-card__field prospect-summary-card__field--full">
          <span className="prospect-summary-card__label">Next Action</span>
          <div className="prospect-summary-card__value-row">
            <span className="prospect-summary-card__value prospect-summary-card__value--action">
              {prospect.nextAction || '—'}
            </span>
            <button 
              className="prospect-summary-card__action-btn"
              onClick={() => handleAction('complete action')}
              title="Mark complete"
            >
              <i className="fa-solid fa-check"></i>
            </button>
            <button 
              className="prospect-summary-card__edit-btn"
              onClick={() => handleEdit('nextAction', prospect.nextAction)}
              title="Edit next action"
            >
              <i className="fa-solid fa-pencil"></i>
            </button>
          </div>
        </div>

        {/* Most Recent Gift - full width */}
        <div className="prospect-summary-card__field prospect-summary-card__field--full">
          <span className="prospect-summary-card__label">Most Recent Gift</span>
          <div className="prospect-summary-card__value-row">
            {prospect.mostRecentGift ? (
              <span className="prospect-summary-card__value">
                <strong>{formatCurrency(prospect.mostRecentGift.amount)}</strong>
                <span className="prospect-summary-card__mrc-date">
                  {' '}on {formatDate(prospect.mostRecentGift.date)}
                </span>
              </span>
            ) : giving?.lastGift ? (
              <span className="prospect-summary-card__value">
                <strong>{formatCurrency(giving.lastGift.amount)}</strong>
                <span className="prospect-summary-card__mrc-date">
                  {' '}on {formatDate(giving.lastGift.date)}
                </span>
              </span>
            ) : (
              <span className="prospect-summary-card__value">—</span>
            )}
            <a 
              href="#" 
              className="prospect-summary-card__link"
              onClick={(e) => { e.preventDefault(); handleAction('view giving history') }}
            >
              View history
              <i className="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProspectSummaryCard
