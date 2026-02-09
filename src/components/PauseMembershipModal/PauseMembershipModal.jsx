import { useState } from 'react'
import { pauseMembership, formatDate } from '../../data/patrons'
import './PauseMembershipModal.css'

const PAUSE_REASONS = [
  { id: 'travel', label: 'Travel' },
  { id: 'medical', label: 'Medical leave' },
  { id: 'financial', label: 'Financial hardship' },
  { id: 'other', label: 'Other' }
]

const DURATION_OPTIONS = [
  { value: 30, label: '30 days' },
  { value: 60, label: '60 days' },
  { value: 90, label: '90 days' },
  { value: 'custom', label: 'Custom end date' }
]

function PauseMembershipModal({ membership, onClose, onConfirm }) {
  const [duration, setDuration] = useState(30)
  const [customDate, setCustomDate] = useState('')
  const [reason, setReason] = useState('travel')
  const [notes, setNotes] = useState('')

  // Calculate resume date
  const getResumeDate = () => {
    if (duration === 'custom' && customDate) {
      return customDate
    }
    const date = new Date()
    date.setDate(date.getDate() + (typeof duration === 'number' ? duration : 30))
    return date.toISOString().split('T')[0]
  }

  // Calculate effective duration in days
  const getEffectiveDays = () => {
    if (duration === 'custom' && customDate) {
      const now = new Date()
      const end = new Date(customDate)
      return Math.max(1, Math.ceil((end - now) / (1000 * 60 * 60 * 24)))
    }
    return typeof duration === 'number' ? duration : 30
  }

  // Calculate new expiration
  const getNewExpiration = () => {
    if (!membership.validUntil) return null
    const currentEnd = new Date(membership.validUntil)
    currentEnd.setDate(currentEnd.getDate() + getEffectiveDays())
    return currentEnd.toISOString().split('T')[0]
  }

  const handleSubmit = () => {
    const reasonLabel = PAUSE_REASONS.find(r => r.id === reason)?.label || ''
    const detailParts = [reasonLabel]
    if (notes) detailParts.push(notes)

    const result = pauseMembership(membership.id, {
      durationDays: getEffectiveDays(),
      reason: detailParts.join(' — ')
    })

    if (result.success) {
      onConfirm()
    }
  }

  // Minimum custom date is tomorrow
  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)
  const minDateStr = minDate.toISOString().split('T')[0]

  return (
    <div className="pause-modal__overlay" onClick={onClose}>
      <div className="pause-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="pause-modal__header">
          <div className="pause-modal__header-content">
            <h3 className="pause-modal__title">Pause membership</h3>
            <p className="pause-modal__subtitle">{membership.tier} &middot; {membership.program}</p>
          </div>
          <button className="pause-modal__close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Body */}
        <div className="pause-modal__body">
          {/* Info banner */}
          <div className="pause-modal__info">
            <i className="fa-solid fa-info-circle"></i>
            <span>Benefits will be frozen during the pause. The membership expiration will be extended by the pause duration.</span>
          </div>

          {/* Reason */}
          <div className="pause-modal__section">
            <h4 className="pause-modal__section-title">
              <i className="fa-solid fa-message"></i>
              Reason
            </h4>
            <select
              className="pause-modal__select"
              value={reason}
              onChange={e => setReason(e.target.value)}
            >
              {PAUSE_REASONS.map(r => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
          </div>

          {/* Duration */}
          <div className="pause-modal__section">
            <h4 className="pause-modal__section-title">
              <i className="fa-solid fa-clock"></i>
              Duration
            </h4>
            <div className="pause-modal__duration-grid">
              {DURATION_OPTIONS.map(opt => (
                <label
                  key={opt.value}
                  className={`pause-modal__duration-option ${duration === opt.value ? 'pause-modal__duration-option--selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="duration"
                    value={opt.value}
                    checked={duration === opt.value}
                    onChange={() => setDuration(opt.value)}
                    className="pause-modal__radio-input"
                  />
                  <div className="pause-modal__radio-custom" />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>

            {/* Custom date picker */}
            {duration === 'custom' && (
              <div className="pause-modal__custom-date">
                <label className="pause-modal__field-label">Resume date</label>
                <input
                  type="date"
                  className="pause-modal__date-input"
                  value={customDate}
                  onChange={e => setCustomDate(e.target.value)}
                  min={minDateStr}
                />
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="pause-modal__section">
            <textarea
              className="pause-modal__textarea"
              placeholder="Additional notes (optional)"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          {/* Impact summary */}
          <div className="pause-modal__impact">
            <div className="pause-modal__impact-row">
              <span>Resumes on</span>
              <span className="pause-modal__impact-value">{formatDate(getResumeDate())}</span>
            </div>
            {getNewExpiration() && (
              <div className="pause-modal__impact-row">
                <span>New expiration</span>
                <span className="pause-modal__impact-value">{formatDate(getNewExpiration())}</span>
              </div>
            )}
            <div className="pause-modal__impact-note">
              <i className="fa-solid fa-users"></i>
              <span>All beneficiaries will also be paused</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pause-modal__footer">
          <div className="pause-modal__actions">
            <button className="pause-modal__btn pause-modal__btn--secondary" onClick={onClose}>
              Close
            </button>
            <button
              className="pause-modal__btn pause-modal__btn--primary"
              onClick={handleSubmit}
              disabled={duration === 'custom' && !customDate}
            >
              <i className="fa-solid fa-pause"></i>
              Pause membership
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PauseMembershipModal
