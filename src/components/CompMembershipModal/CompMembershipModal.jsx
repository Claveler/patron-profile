import { useState } from 'react'
import { compMembership, membershipPrograms, tierConfig } from '../../data/patrons'
import './CompMembershipModal.css'

const COMP_REASONS = [
  { id: 'board_member', label: 'Board member' },
  { id: 'vip', label: 'VIP guest' },
  { id: 'staff', label: 'Staff' },
  { id: 'donor_cultivation', label: 'Donor cultivation' },
  { id: 'promotion', label: 'Promotion / campaign' },
  { id: 'other', label: 'Other' }
]

const DURATION_OPTIONS = [
  { value: 1, label: '1 month' },
  { value: 3, label: '3 months' },
  { value: 6, label: '6 months' },
  { value: 12, label: '1 year' }
]

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

function CompMembershipModal({ patronId, patronName, onClose, onConfirm }) {
  const [selectedTier, setSelectedTier] = useState('Basic')
  const [durationMonths, setDurationMonths] = useState(12)
  const [reason, setReason] = useState('board_member')
  const [notes, setNotes] = useState('')
  const [autoRenewal, setAutoRenewal] = useState(false)
  const [error, setError] = useState(null)

  const selectedProgram = membershipPrograms.find(p => p.tier === selectedTier)

  // Calculate expiration
  const getExpirationDate = () => {
    const date = new Date()
    date.setMonth(date.getMonth() + durationMonths)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const handleSubmit = () => {
    setError(null)
    const reasonLabel = COMP_REASONS.find(r => r.id === reason)?.label || ''

    const result = compMembership(patronId, {
      tier: selectedTier,
      durationMonths,
      reason: reasonLabel,
      notes,
      autoRenewal
    })

    if (result.success) {
      onConfirm()
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="comp-modal__overlay" onClick={onClose}>
      <div className="comp-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="comp-modal__header">
          <div className="comp-modal__header-content">
            <h3 className="comp-modal__title">
              <i className="fa-solid fa-gift"></i>
              Issue complimentary membership
            </h3>
            {patronName && (
              <p className="comp-modal__subtitle">For {patronName}</p>
            )}
          </div>
          <button className="comp-modal__close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Body */}
        <div className="comp-modal__body">
          {error && (
            <div className="comp-modal__error">
              <i className="fa-solid fa-circle-exclamation"></i>
              <span>{error}</span>
            </div>
          )}

          {/* Tier selector */}
          <div className="comp-modal__section">
            <h4 className="comp-modal__section-title">
              <i className="fa-solid fa-layer-group"></i>
              Membership tier
            </h4>
            <div className="comp-modal__tier-grid">
              {membershipPrograms.map(program => {
                const config = tierConfig[program.tier]
                return (
                  <label
                    key={program.id}
                    className={`comp-modal__tier-option ${selectedTier === program.tier ? 'comp-modal__tier-option--selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="tier"
                      value={program.tier}
                      checked={selectedTier === program.tier}
                      onChange={() => setSelectedTier(program.tier)}
                      className="comp-modal__radio-input"
                    />
                    <div
                      className="comp-modal__tier-dot"
                      style={{ backgroundColor: config?.cardStyle?.backgroundColor || '#666' }}
                    />
                    <div className="comp-modal__tier-info">
                      <span className="comp-modal__tier-name">{program.tier}</span>
                      <span className="comp-modal__tier-value">
                        <s>{formatCurrency(program.price)}/yr</s>
                        <span className="comp-modal__tier-free">Free</span>
                      </span>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Duration */}
          <div className="comp-modal__section">
            <h4 className="comp-modal__section-title">
              <i className="fa-solid fa-clock"></i>
              Duration
            </h4>
            <div className="comp-modal__duration-grid">
              {DURATION_OPTIONS.map(opt => (
                <label
                  key={opt.value}
                  className={`comp-modal__duration-option ${durationMonths === opt.value ? 'comp-modal__duration-option--selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="duration"
                    value={opt.value}
                    checked={durationMonths === opt.value}
                    onChange={() => setDurationMonths(opt.value)}
                    className="comp-modal__radio-input"
                  />
                  <div className="comp-modal__radio-custom" />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div className="comp-modal__section">
            <h4 className="comp-modal__section-title">
              <i className="fa-solid fa-message"></i>
              Reason
            </h4>
            <select
              className="comp-modal__select"
              value={reason}
              onChange={e => setReason(e.target.value)}
            >
              {COMP_REASONS.map(r => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
            <textarea
              className="comp-modal__textarea"
              placeholder="Additional notes (optional)"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          {/* Auto-renewal toggle */}
          <div className="comp-modal__section">
            <label className="comp-modal__toggle-row">
              <input
                type="checkbox"
                checked={autoRenewal}
                onChange={e => setAutoRenewal(e.target.checked)}
                className="comp-modal__checkbox-input"
              />
              <div className={`comp-modal__checkbox-custom ${autoRenewal ? 'comp-modal__checkbox-custom--checked' : ''}`}>
                {autoRenewal && <i className="fa-solid fa-check"></i>}
              </div>
              <div className="comp-modal__toggle-content">
                <span className="comp-modal__toggle-label">Enable auto-renewal</span>
                <span className="comp-modal__toggle-desc">Complimentary memberships typically do not auto-renew</span>
              </div>
            </label>
          </div>

          {/* Summary */}
          <div className="comp-modal__summary">
            <div className="comp-modal__summary-row">
              <span>Tier</span>
              <span className="comp-modal__summary-value">{selectedTier}</span>
            </div>
            <div className="comp-modal__summary-row">
              <span>Duration</span>
              <span className="comp-modal__summary-value">{DURATION_OPTIONS.find(o => o.value === durationMonths)?.label}</span>
            </div>
            <div className="comp-modal__summary-row">
              <span>Expires</span>
              <span className="comp-modal__summary-value">{getExpirationDate()}</span>
            </div>
            <div className="comp-modal__summary-row">
              <span>Cost</span>
              <span className="comp-modal__summary-value comp-modal__summary-value--free">Complimentary</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="comp-modal__footer">
          <div className="comp-modal__actions">
            <button className="comp-modal__btn comp-modal__btn--secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="comp-modal__btn comp-modal__btn--primary" onClick={handleSubmit}>
              <i className="fa-solid fa-gift"></i>
              Issue complimentary membership
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompMembershipModal
