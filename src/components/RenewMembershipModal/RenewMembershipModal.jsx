import { useState } from 'react'
import { renewMembership, membershipPrograms, formatDate } from '../../data/patrons'
import './RenewMembershipModal.css'

// Format currency helper
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

function RenewMembershipModal({ membership, patronEmail, patronName, onClose, onConfirm }) {
  const [linkCopied, setLinkCopied] = useState(false)
  const [linkGenerated, setLinkGenerated] = useState(false)
  const [generatedLink, setGeneratedLink] = useState('')

  const tierProgram = membershipPrograms.find(p => p.tier === membership.tier)
  const price = tierProgram?.price || 0

  const handleGenerateLink = () => {
    const result = renewMembership(membership.id, patronEmail)
    if (result.success) {
      setGeneratedLink(result.link)
      setLinkGenerated(true)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  const handleSendEmail = () => {
    const name = patronName || 'there'
    const subject = encodeURIComponent(`Renew your ${membership.tier} Membership`)
    const body = encodeURIComponent(
`Hi ${name},

Your ${membership.tier} membership is coming up for renewal.

${membership.tier} Membership — ${formatCurrency(price)}/year

Click the link below to renew:
${generatedLink}

If you have any questions, please don't hesitate to reach out.

Best regards`
    )
    window.open(`mailto:${patronEmail || ''}?subject=${subject}&body=${body}`, '_blank')
    onConfirm()
  }

  return (
    <div className="renew-modal__overlay" onClick={onClose}>
      <div className="renew-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="renew-modal__header">
          <div className="renew-modal__header-content">
            <h3 className="renew-modal__title">Renew membership</h3>
            <p className="renew-modal__subtitle">{membership.tier} &middot; {membership.program}</p>
          </div>
          <button className="renew-modal__close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Body */}
        <div className="renew-modal__body">
          {/* Current membership summary */}
          <div className="renew-modal__summary">
            <div className="renew-modal__summary-row">
              <span>Current tier</span>
              <span className="renew-modal__summary-value">{membership.tier}</span>
            </div>
            <div className="renew-modal__summary-row">
              <span>Renewal price</span>
              <span className="renew-modal__summary-value renew-modal__summary-value--price">{formatCurrency(price)}/year</span>
            </div>
            <div className="renew-modal__summary-row">
              <span>Current expiration</span>
              <span className="renew-modal__summary-value">{formatDate(membership.validUntil)}</span>
            </div>
            {membership.daysToRenewal != null && (
              <div className="renew-modal__summary-row">
                <span>Days to renewal</span>
                <span className={`renew-modal__summary-value ${membership.daysToRenewal <= 14 ? 'renew-modal__summary-value--urgent' : ''}`}>
                  {membership.daysToRenewal} days
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="renew-modal__info">
            <i className="fa-solid fa-info-circle"></i>
            <span>A payment link will be generated for the patron to complete their renewal online.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="renew-modal__footer">
          {linkGenerated ? (
            <>
              {/* Link section */}
              <div className="renew-modal__link-section">
                <label className="renew-modal__link-label">Renewal payment link</label>
                <div className="renew-modal__link-input-wrapper">
                  <input
                    type="text"
                    className="renew-modal__link-input"
                    value={generatedLink}
                    readOnly
                    onClick={e => e.target.select()}
                  />
                  <button
                    className={`renew-modal__copy-btn ${linkCopied ? 'renew-modal__copy-btn--copied' : ''}`}
                    onClick={handleCopyLink}
                  >
                    <i className={`fa-solid ${linkCopied ? 'fa-check' : 'fa-copy'}`}></i>
                    {linkCopied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="renew-modal__actions">
                <button className="renew-modal__btn renew-modal__btn--secondary" onClick={onClose}>
                  Close
                </button>
                <button className="renew-modal__btn renew-modal__btn--primary" onClick={handleSendEmail}>
                  <i className="fa-solid fa-envelope"></i>
                  Send via email
                </button>
              </div>
            </>
          ) : (
            <div className="renew-modal__actions">
              <button className="renew-modal__btn renew-modal__btn--secondary" onClick={onClose}>
                Close
              </button>
              <button className="renew-modal__btn renew-modal__btn--primary" onClick={handleGenerateLink}>
                <i className="fa-solid fa-link"></i>
                Generate renewal link
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RenewMembershipModal
