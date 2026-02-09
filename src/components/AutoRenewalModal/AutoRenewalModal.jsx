import { useEffect, useState } from 'react'
import {
  updateRenewalReminders,
  updateGracePeriod,
  requestAutoRenewalChange,
  requestPaymentMethodUpdate
} from '../../data/patrons'
import './AutoRenewalModal.css'

// Payment method icons (matching MembershipOverview)
const paymentIcons = {
  visa: 'fa-cc-visa',
  mastercard: 'fa-cc-mastercard',
  amex: 'fa-cc-amex',
  default: 'fa-credit-card'
}

// Reminder day options
const REMINDER_OPTIONS = [60, 30, 14, 7, 3, 1]

// Grace period options
const GRACE_PERIOD_OPTIONS = [
  { value: 0, label: 'No grace period' },
  { value: 7, label: '7 days' },
  { value: 14, label: '14 days' },
  { value: 30, label: '30 days' }
]

function AutoRenewalModal({ membership, patronEmail, patronName, onClose, onUpdate }) {
  const [linkCopied, setLinkCopied] = useState(false)
  const [activeAction, setActiveAction] = useState(null) // 'toggle' | 'payment' | null
  const [generatedLink, setGeneratedLink] = useState('')
  const [reminders, setReminders] = useState(membership.renewalReminders || [30, 14, 7])
  const [gracePeriod, setGracePeriod] = useState(membership.gracePeriodDays ?? 14)
  const [hasDirectChanges, setHasDirectChanges] = useState(false)
  const [savedFeedback, setSavedFeedback] = useState(false)

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  // Get payment icon
  const getPaymentIcon = (type) => paymentIcons[type] || paymentIcons.default

  // --- Patron-action handlers ---

  const handleRequestToggle = () => {
    const result = requestAutoRenewalChange(membership.id, patronEmail)
    if (result.success) {
      setActiveAction('toggle')
      setGeneratedLink(result.link)
    }
  }

  const handleRequestPaymentUpdate = () => {
    const result = requestPaymentMethodUpdate(membership.id, patronEmail)
    if (result.success) {
      setActiveAction('payment')
      setGeneratedLink(result.link)
    }
  }

  // --- Staff-direct handlers ---

  const handleReminderToggle = (day) => {
    setReminders(prev => {
      const next = prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
      return next.sort((a, b) => b - a)
    })
    setHasDirectChanges(true)
  }

  const handleGracePeriodChange = (e) => {
    setGracePeriod(Number(e.target.value))
    setHasDirectChanges(true)
  }

  // Save direct changes
  const handleSaveDirectChanges = () => {
    const remindersChanged =
      JSON.stringify(reminders) !== JSON.stringify(membership.renewalReminders || [])
    const graceChanged = gracePeriod !== (membership.gracePeriodDays ?? 14)

    if (remindersChanged) updateRenewalReminders(membership.id, reminders)
    if (graceChanged) updateGracePeriod(membership.id, gracePeriod)

    setSavedFeedback(true)
    setHasDirectChanges(false)
    setTimeout(() => setSavedFeedback(false), 2000)
    if (onUpdate) onUpdate()
  }

  // Copy link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  // Send email
  const handleSendEmail = () => {
    const isToggle = activeAction === 'toggle'
    const newStatus = membership.autoRenewal ? 'off' : 'on'

    const subject = encodeURIComponent(
      isToggle
        ? `Confirm auto-renewal change for your ${membership.tier} membership`
        : `Update your payment method for ${membership.tier} membership`
    )

    const body = encodeURIComponent(
      isToggle
        ? `Hi ${patronName},\n\nWe'd like to update your auto-renewal preference for your ${membership.tier} ${membership.program} membership.\n\nRequested change: Auto-renewal ${membership.autoRenewal ? 'ON' : 'OFF'} → ${newStatus.toUpperCase()}\n\nPlease click the link below to confirm this change:\n${generatedLink}\n\nIf you did not request this change, you can safely ignore this email.\n\nBest regards`
        : `Hi ${patronName},\n\nWe'd like to help you update the payment method on file for your ${membership.tier} ${membership.program} membership.\n\nCurrent card: •••• ${membership.paymentMethod?.last4 || '----'}\n\nPlease click the link below to securely update your payment method:\n${generatedLink}\n\nIf you did not request this change, you can safely ignore this email.\n\nBest regards`
    )

    window.open(`mailto:${patronEmail}?subject=${subject}&body=${body}`, '_blank')
  }

  // Pending change badge
  const hasPending = membership.pendingRenewalChange != null

  return (
    <div className="autorenewal-modal__overlay" onClick={handleBackdropClick}>
      <div className="autorenewal-modal">
        {/* Header */}
        <div className="autorenewal-modal__header">
          <div className="autorenewal-modal__header-content">
            <h2 className="autorenewal-modal__title">Auto-Renewal Settings</h2>
            <p className="autorenewal-modal__subtitle">
              {membership.tier} &middot; {membership.program}
            </p>
          </div>
          <button className="autorenewal-modal__close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Body */}
        <div className="autorenewal-modal__body">

          {/* Section 1: Auto-Renewal Toggle (patron-action) */}
          <div className="autorenewal-modal__section">
            <h3 className="autorenewal-modal__section-title">
              <i className="fa-solid fa-rotate"></i>
              Auto-renewal status
            </h3>
            <div className="autorenewal-modal__toggle-row">
              <div className="autorenewal-modal__toggle-info">
                <span className="autorenewal-modal__toggle-label">Current status</span>
                <span className={`autorenewal-modal__status-badge autorenewal-modal__status-badge--${membership.autoRenewal ? 'on' : 'off'}`}>
                  {membership.autoRenewal ? 'ON' : 'OFF'}
                </span>
              </div>
              <button
                className={`autorenewal-modal__action-btn ${activeAction === 'toggle' ? 'autorenewal-modal__action-btn--active' : ''}`}
                onClick={handleRequestToggle}
                disabled={activeAction === 'toggle'}
              >
                <i className="fa-solid fa-envelope"></i>
                {activeAction === 'toggle' ? 'Link generated' : `Request ${membership.autoRenewal ? 'OFF' : 'ON'}`}
              </button>
            </div>
            {hasPending && activeAction !== 'toggle' && (
              <div className="autorenewal-modal__pending-badge">
                <i className="fa-solid fa-clock"></i>
                <span>Pending change sent on {membership.pendingRenewalChange.requestedAt}</span>
              </div>
            )}
          </div>

          {/* Section 2: Payment Method (patron-action) */}
          <div className="autorenewal-modal__section">
            <h3 className="autorenewal-modal__section-title">
              <i className="fa-solid fa-credit-card"></i>
              Payment method
            </h3>
            <div className="autorenewal-modal__toggle-row">
              <div className="autorenewal-modal__payment-info">
                {membership.paymentMethod ? (
                  <>
                    <i className={`fa-brands ${getPaymentIcon(membership.paymentMethod.type)}`}></i>
                    <span>&bull;&bull;&bull;&bull; {membership.paymentMethod.last4}</span>
                  </>
                ) : (
                  <span className="autorenewal-modal__no-payment">No payment method on file</span>
                )}
              </div>
              <button
                className={`autorenewal-modal__action-btn ${activeAction === 'payment' ? 'autorenewal-modal__action-btn--active' : ''}`}
                onClick={handleRequestPaymentUpdate}
                disabled={activeAction === 'payment'}
              >
                <i className="fa-solid fa-envelope"></i>
                {activeAction === 'payment' ? 'Link generated' : 'Request update'}
              </button>
            </div>
          </div>

          {/* Section 3: Renewal Reminders (staff-direct) */}
          <div className="autorenewal-modal__section">
            <h3 className="autorenewal-modal__section-title">
              <i className="fa-solid fa-bell"></i>
              Renewal reminders
            </h3>
            <p className="autorenewal-modal__section-desc">
              Email reminders sent to the patron before membership renewal.
            </p>
            <div className="autorenewal-modal__reminder-grid">
              {REMINDER_OPTIONS.map(day => (
                <label key={day} className="autorenewal-modal__checkbox-label">
                  <input
                    type="checkbox"
                    checked={reminders.includes(day)}
                    onChange={() => handleReminderToggle(day)}
                    className="autorenewal-modal__checkbox"
                  />
                  <span className="autorenewal-modal__checkbox-custom">
                    {reminders.includes(day) && <i className="fa-solid fa-check"></i>}
                  </span>
                  <span>{day} {day === 1 ? 'day' : 'days'} before</span>
                </label>
              ))}
            </div>
          </div>

          {/* Section 4: Grace Period (staff-direct) */}
          <div className="autorenewal-modal__section">
            <h3 className="autorenewal-modal__section-title">
              <i className="fa-solid fa-hourglass-half"></i>
              Grace period
            </h3>
            <p className="autorenewal-modal__section-desc">
              Days after expiration before the membership fully lapses.
            </p>
            <select
              className="autorenewal-modal__select"
              value={gracePeriod}
              onChange={handleGracePeriodChange}
            >
              {GRACE_PERIOD_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="autorenewal-modal__footer">
          {/* Generated link section (patron-action) */}
          {activeAction && generatedLink && (
            <div className="autorenewal-modal__link-section">
              <label className="autorenewal-modal__link-label">
                {activeAction === 'toggle' ? 'Auto-renewal change link' : 'Payment update link'}
              </label>
              <div className="autorenewal-modal__link-input-wrapper">
                <input
                  type="text"
                  className="autorenewal-modal__link-input"
                  value={generatedLink}
                  readOnly
                  onClick={(e) => e.target.select()}
                />
                <button
                  className={`autorenewal-modal__copy-btn ${linkCopied ? 'autorenewal-modal__copy-btn--copied' : ''}`}
                  onClick={handleCopyLink}
                >
                  <i className={`fa-solid ${linkCopied ? 'fa-check' : 'fa-copy'}`}></i>
                  {linkCopied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          )}

          {/* Audit info */}
          <div className="autorenewal-modal__audit-note">
            <i className="fa-solid fa-clock-rotate-left"></i>
            <span>Changes are logged in membership history</span>
          </div>

          {/* Actions */}
          <div className="autorenewal-modal__actions">
            <button className="autorenewal-modal__btn autorenewal-modal__btn--secondary" onClick={onClose}>
              Close
            </button>

            {hasDirectChanges && (
              <button
                className={`autorenewal-modal__btn autorenewal-modal__btn--save ${savedFeedback ? 'autorenewal-modal__btn--saved' : ''}`}
                onClick={handleSaveDirectChanges}
              >
                <i className={`fa-solid ${savedFeedback ? 'fa-check' : 'fa-floppy-disk'}`}></i>
                {savedFeedback ? 'Saved!' : 'Save settings'}
              </button>
            )}

            {activeAction && generatedLink && (
              <button className="autorenewal-modal__btn autorenewal-modal__btn--primary" onClick={handleSendEmail}>
                <i className="fa-solid fa-envelope"></i>
                Send link via email
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AutoRenewalModal
