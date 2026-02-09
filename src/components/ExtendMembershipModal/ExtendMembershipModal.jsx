import { useState } from 'react'
import { extendMembership, formatDate } from '../../data/patrons'
import './ExtendMembershipModal.css'

const EXTEND_REASONS = [
  { id: 'service_recovery', label: 'Service recovery' },
  { id: 'vip_courtesy', label: 'VIP courtesy' },
  { id: 'staff_perk', label: 'Staff / Board perk' },
  { id: 'promotion', label: 'Promotion' },
  { id: 'other', label: 'Other' }
]

const DURATION_OPTIONS = [
  { value: 7, label: '7 days' },
  { value: 14, label: '14 days' },
  { value: 30, label: '30 days' },
  { value: 'custom', label: 'Custom' }
]

function ExtendMembershipModal({ membership, onClose, onConfirm }) {
  const [duration, setDuration] = useState(30)
  const [customDays, setCustomDays] = useState('')
  const [complimentary, setComplimentary] = useState(true)
  const [reason, setReason] = useState('service_recovery')
  const [notes, setNotes] = useState('')

  // Calculate effective days
  const getEffectiveDays = () => {
    if (duration === 'custom') {
      return parseInt(customDays) || 0
    }
    return duration
  }

  // Calculate new expiration
  const getNewExpiration = () => {
    if (!membership.validUntil) return null
    const days = getEffectiveDays()
    if (days <= 0) return membership.validUntil
    const currentEnd = new Date(membership.validUntil)
    currentEnd.setDate(currentEnd.getDate() + days)
    return currentEnd.toISOString().split('T')[0]
  }

  const handleSubmit = () => {
    const days = getEffectiveDays()
    if (days <= 0) return

    const reasonLabel = EXTEND_REASONS.find(r => r.id === reason)?.label || ''

    const result = extendMembership(membership.id, {
      durationDays: days,
      complimentary,
      reason: reasonLabel,
      notes
    })

    if (result.success) {
      onConfirm()
    }
  }

  const effectiveDays = getEffectiveDays()
  const canSubmit = effectiveDays > 0

  return (
    <div className="extend-modal__overlay" onClick={onClose}>
      <div className="extend-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="extend-modal__header">
          <div className="extend-modal__header-content">
            <h3 className="extend-modal__title">Extend membership</h3>
            <p className="extend-modal__subtitle">{membership.tier} &middot; {membership.program}</p>
          </div>
          <button className="extend-modal__close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Body */}
        <div className="extend-modal__body">
          {/* Duration */}
          <div className="extend-modal__section">
            <h4 className="extend-modal__section-title">
              <i className="fa-solid fa-calendar-plus"></i>
              Extension duration
            </h4>
            <div className="extend-modal__duration-grid">
              {DURATION_OPTIONS.map(opt => (
                <label
                  key={opt.value}
                  className={`extend-modal__duration-option ${duration === opt.value ? 'extend-modal__duration-option--selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="duration"
                    value={opt.value}
                    checked={duration === opt.value}
                    onChange={() => setDuration(opt.value)}
                    className="extend-modal__radio-input"
                  />
                  <div className="extend-modal__radio-custom" />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>

            {/* Custom days input */}
            {duration === 'custom' && (
              <div className="extend-modal__custom-days">
                <label className="extend-modal__field-label">Number of days</label>
                <input
                  type="number"
                  className="extend-modal__number-input"
                  value={customDays}
                  onChange={e => setCustomDays(e.target.value)}
                  min="1"
                  max="365"
                  placeholder="e.g. 45"
                  autoFocus
                />
              </div>
            )}
          </div>

          {/* Complimentary toggle */}
          <div className="extend-modal__section">
            <label className="extend-modal__checkbox-row">
              <input
                type="checkbox"
                checked={complimentary}
                onChange={e => setComplimentary(e.target.checked)}
                className="extend-modal__checkbox-input"
              />
              <div className={`extend-modal__checkbox-custom ${complimentary ? 'extend-modal__checkbox-custom--checked' : ''}`}>
                {complimentary && <i className="fa-solid fa-check"></i>}
              </div>
              <div className="extend-modal__checkbox-content">
                <span className="extend-modal__checkbox-label">Complimentary extension</span>
                <span className="extend-modal__checkbox-desc">No charge to the patron</span>
              </div>
            </label>
          </div>

          {/* Reason */}
          <div className="extend-modal__section">
            <h4 className="extend-modal__section-title">
              <i className="fa-solid fa-message"></i>
              Reason
            </h4>
            <select
              className="extend-modal__select"
              value={reason}
              onChange={e => setReason(e.target.value)}
            >
              {EXTEND_REASONS.map(r => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
            <textarea
              className="extend-modal__textarea"
              placeholder="Additional notes (optional)"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          {/* Preview */}
          {canSubmit && (
            <div className="extend-modal__preview">
              <div className="extend-modal__preview-row">
                <span>Current expiration</span>
                <span className="extend-modal__preview-value">{formatDate(membership.validUntil)}</span>
              </div>
              <div className="extend-modal__preview-row">
                <span>Extension</span>
                <span className="extend-modal__preview-value">+{effectiveDays} days</span>
              </div>
              <div className="extend-modal__preview-row extend-modal__preview-row--highlight">
                <span>New expiration</span>
                <span className="extend-modal__preview-value">{formatDate(getNewExpiration())}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="extend-modal__footer">
          <div className="extend-modal__actions">
            <button className="extend-modal__btn extend-modal__btn--secondary" onClick={onClose}>
              Close
            </button>
            <button
              className="extend-modal__btn extend-modal__btn--primary"
              onClick={handleSubmit}
              disabled={!canSubmit}
            >
              <i className="fa-solid fa-calendar-plus"></i>
              Extend membership
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExtendMembershipModal
