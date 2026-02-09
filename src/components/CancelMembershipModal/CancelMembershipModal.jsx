import { useState } from 'react'
import { cancelMembership, membershipPrograms } from '../../data/patrons'
import { getInitials } from '../../utils/getInitials'
import './CancelMembershipModal.css'

const CANCEL_REASONS = [
  { id: 'patron_request', label: 'Patron request' },
  { id: 'non_payment', label: 'Non-payment' },
  { id: 'policy_violation', label: 'Policy violation' },
  { id: 'other', label: 'Other' }
]

function CancelMembershipModal({ membership, beneficiaries = [], onClose, onConfirm }) {
  const [step, setStep] = useState(1) // 1 = options, 2 = confirm
  const [timing, setTiming] = useState('end_of_period')
  const [refundType, setRefundType] = useState('none')
  const [reasonCategory, setReasonCategory] = useState('patron_request')
  const [notes, setNotes] = useState('')
  const [confirmText, setConfirmText] = useState('')

  // Calculate refund amounts
  const tierProgram = membershipPrograms.find(p => p.tier === membership.tier)
  const price = tierProgram?.price || 0

  const calculateRefund = () => {
    if (refundType === 'full') return price
    if (refundType === 'prorated' && membership.periodStart && membership.validUntil) {
      const start = new Date(membership.periodStart)
      const end = new Date(membership.validUntil)
      const now = new Date()
      const totalDays = (end - start) / (1000 * 60 * 60 * 24)
      const remainingDays = Math.max(0, (end - now) / (1000 * 60 * 60 * 24))
      return Math.round((remainingDays / totalDays) * price * 100) / 100
    }
    return 0
  }

  const refundAmount = calculateRefund()
  const canConfirm = confirmText.toUpperCase() === 'CANCEL'

  const handleSubmit = () => {
    const result = cancelMembership(membership.id, {
      timing,
      refundType,
      reasonCategory,
      reason: CANCEL_REASONS.find(r => r.id === reasonCategory)?.label || '',
      notes
    })

    if (result.success) {
      onConfirm()
    }
  }

  return (
    <div className="cancel-modal__overlay" onClick={onClose}>
      <div className="cancel-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="cancel-modal__header">
          <div className="cancel-modal__header-content">
            <h3 className="cancel-modal__title">Cancel membership</h3>
            <p className="cancel-modal__subtitle">{membership.tier} &middot; {membership.program}</p>
          </div>
          <button className="cancel-modal__close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Body */}
        <div className="cancel-modal__body">
          {step === 1 ? (
            <>
              {/* When to cancel */}
              <div className="cancel-modal__section">
                <h4 className="cancel-modal__section-title">
                  <i className="fa-solid fa-calendar"></i>
                  When should this take effect?
                </h4>
                <div className="cancel-modal__radio-group">
                  <label className={`cancel-modal__radio-option ${timing === 'end_of_period' ? 'cancel-modal__radio-option--selected' : ''}`}>
                    <input
                      type="radio"
                      name="timing"
                      value="end_of_period"
                      checked={timing === 'end_of_period'}
                      onChange={() => setTiming('end_of_period')}
                      className="cancel-modal__radio-input"
                    />
                    <div className="cancel-modal__radio-custom" />
                    <div className="cancel-modal__radio-content">
                      <span className="cancel-modal__radio-label">At end of current period</span>
                      <span className="cancel-modal__radio-desc">
                        Patron keeps access until {membership.validUntil || 'expiration date'}
                      </span>
                    </div>
                  </label>
                  <label className={`cancel-modal__radio-option ${timing === 'immediate' ? 'cancel-modal__radio-option--selected' : ''}`}>
                    <input
                      type="radio"
                      name="timing"
                      value="immediate"
                      checked={timing === 'immediate'}
                      onChange={() => setTiming('immediate')}
                      className="cancel-modal__radio-input"
                    />
                    <div className="cancel-modal__radio-custom" />
                    <div className="cancel-modal__radio-content">
                      <span className="cancel-modal__radio-label">Immediately</span>
                      <span className="cancel-modal__radio-desc">Access revoked today</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Refund */}
              <div className="cancel-modal__section">
                <h4 className="cancel-modal__section-title">
                  <i className="fa-solid fa-dollar-sign"></i>
                  Refund
                </h4>
                <div className="cancel-modal__radio-group">
                  <label className={`cancel-modal__radio-option cancel-modal__radio-option--compact ${refundType === 'none' ? 'cancel-modal__radio-option--selected' : ''}`}>
                    <input type="radio" name="refund" value="none" checked={refundType === 'none'} onChange={() => setRefundType('none')} className="cancel-modal__radio-input" />
                    <div className="cancel-modal__radio-custom" />
                    <span className="cancel-modal__radio-label">No refund</span>
                  </label>
                  <label className={`cancel-modal__radio-option cancel-modal__radio-option--compact ${refundType === 'prorated' ? 'cancel-modal__radio-option--selected' : ''}`}>
                    <input type="radio" name="refund" value="prorated" checked={refundType === 'prorated'} onChange={() => setRefundType('prorated')} className="cancel-modal__radio-input" />
                    <div className="cancel-modal__radio-custom" />
                    <div className="cancel-modal__radio-content">
                      <span className="cancel-modal__radio-label">Prorated refund</span>
                      <span className="cancel-modal__radio-amount">${refundAmount.toFixed(2)}</span>
                    </div>
                  </label>
                  <label className={`cancel-modal__radio-option cancel-modal__radio-option--compact ${refundType === 'full' ? 'cancel-modal__radio-option--selected' : ''}`}>
                    <input type="radio" name="refund" value="full" checked={refundType === 'full'} onChange={() => setRefundType('full')} className="cancel-modal__radio-input" />
                    <div className="cancel-modal__radio-custom" />
                    <div className="cancel-modal__radio-content">
                      <span className="cancel-modal__radio-label">Full refund</span>
                      <span className="cancel-modal__radio-amount">${price.toFixed(2)}</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Beneficiary impact */}
              {beneficiaries.length > 0 && (
                <div className="cancel-modal__section">
                  <div className="cancel-modal__impact-banner">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                    <div className="cancel-modal__impact-content">
                      <strong>{beneficiaries.length} beneficiar{beneficiaries.length === 1 ? 'y' : 'ies'} will lose access</strong>
                      <div className="cancel-modal__impact-list">
                        {beneficiaries.map(b => {
                          const name = b.patron?.name || b.name || `${b.patron?.firstName || b.firstName || ''} ${b.patron?.lastName || b.lastName || ''}`.trim()
                          return (
                            <div key={b.patronId || b.id} className="cancel-modal__impact-person">
                              <div className="cancel-modal__impact-avatar">
                                {getInitials(name)}
                              </div>
                              <span>{name}</span>
                              {b.roleLabel && <span className="cancel-modal__impact-role">{b.roleLabel}</span>}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Reason */}
              <div className="cancel-modal__section">
                <h4 className="cancel-modal__section-title">
                  <i className="fa-solid fa-message"></i>
                  Reason
                </h4>
                <select
                  className="cancel-modal__select"
                  value={reasonCategory}
                  onChange={e => setReasonCategory(e.target.value)}
                >
                  {CANCEL_REASONS.map(r => (
                    <option key={r.id} value={r.id}>{r.label}</option>
                  ))}
                </select>
                <textarea
                  className="cancel-modal__textarea"
                  placeholder="Additional notes (optional)"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </>
          ) : (
            /* Step 2: Confirmation */
            <div className="cancel-modal__confirmation">
              <div className="cancel-modal__confirm-icon">
                <i className="fa-solid fa-triangle-exclamation"></i>
              </div>
              <h4 className="cancel-modal__confirm-title">Are you sure?</h4>
              <p className="cancel-modal__confirm-desc">
                This will {timing === 'immediate' ? 'immediately cancel' : 'schedule cancellation of'} the <strong>{membership.tier}</strong> membership.
                {refundType !== 'none' && ` A ${refundType} refund of $${(refundType === 'full' ? price : refundAmount).toFixed(2)} will be issued.`}
                {beneficiaries.length > 0 && ` ${beneficiaries.length} beneficiar${beneficiaries.length === 1 ? 'y' : 'ies'} will lose access.`}
              </p>

              {/* Summary */}
              <div className="cancel-modal__confirm-summary">
                <div className="cancel-modal__confirm-row">
                  <span>Timing</span>
                  <span>{timing === 'immediate' ? 'Immediately' : `End of period (${membership.validUntil})`}</span>
                </div>
                <div className="cancel-modal__confirm-row">
                  <span>Refund</span>
                  <span>{refundType === 'none' ? 'No refund' : `$${(refundType === 'full' ? price : refundAmount).toFixed(2)} (${refundType})`}</span>
                </div>
                <div className="cancel-modal__confirm-row">
                  <span>Reason</span>
                  <span>{CANCEL_REASONS.find(r => r.id === reasonCategory)?.label}</span>
                </div>
              </div>

              {/* Safety gate */}
              <div className="cancel-modal__safety-gate">
                <label className="cancel-modal__safety-label">
                  Type <strong>CANCEL</strong> to confirm
                </label>
                <input
                  type="text"
                  className="cancel-modal__safety-input"
                  value={confirmText}
                  onChange={e => setConfirmText(e.target.value)}
                  placeholder="CANCEL"
                  autoFocus
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="cancel-modal__footer">
          <div className="cancel-modal__actions">
            {step === 2 && (
              <button className="cancel-modal__btn cancel-modal__btn--secondary" onClick={() => setStep(1)}>
                <i className="fa-solid fa-arrow-left"></i>
                Back
              </button>
            )}
            <div className="cancel-modal__actions-right">
              <button className="cancel-modal__btn cancel-modal__btn--secondary" onClick={onClose}>
                Close
              </button>
              {step === 1 ? (
                <button className="cancel-modal__btn cancel-modal__btn--danger" onClick={() => setStep(2)}>
                  Continue
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              ) : (
                <button
                  className="cancel-modal__btn cancel-modal__btn--danger"
                  onClick={handleSubmit}
                  disabled={!canConfirm}
                >
                  <i className="fa-solid fa-ban"></i>
                  Cancel membership
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CancelMembershipModal
