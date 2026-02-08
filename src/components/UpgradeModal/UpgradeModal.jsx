import { useEffect, useState } from 'react'
import './UpgradeModal.css'

function UpgradeModal({ comparison, patronId, patronEmail, patronName, onClose }) {
  const [linkCopied, setLinkCopied] = useState(false)

  if (!comparison) {
    return null
  }

  const {
    currentTier,
    upgradeTier,
    upgradePrice,
    priceDifference,
    improvements,
    newPerks
  } = comparison

  // Generate payment link
  const paymentLink = `https://pay.fever.co/upgrade/${patronId}/${upgradeTier.toLowerCase().replace(/\s+/g, '-')}`

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Copy payment link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(paymentLink)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  // Open email client with pre-filled content
  const handleSendEmail = () => {
    const subject = encodeURIComponent(`Upgrade your membership to ${upgradeTier}`)
    const body = encodeURIComponent(
`Hi ${patronName},

You're eligible to upgrade your membership from ${currentTier} to ${upgradeTier}!

New benefits include:
${newPerks?.map(perk => `• ${perk}`).join('\n') || '• Enhanced membership benefits'}

Upgrade price: ${formatCurrency(upgradePrice)}/year
${priceDifference > 0 ? `Additional cost: ${formatCurrency(priceDifference)}` : ''}

Click the link below to complete your upgrade:
${paymentLink}

If you have any questions, please don't hesitate to reach out.

Best regards`
    )
    
    window.open(`mailto:${patronEmail}?subject=${subject}&body=${body}`, '_blank')
  }

  return (
    <div className="upgrade-modal__overlay" onClick={handleBackdropClick}>
      <div className="upgrade-modal">
        {/* Header */}
        <div className="upgrade-modal__header">
          <div className="upgrade-modal__header-content">
            <h2 className="upgrade-modal__title">Upgrade membership</h2>
            <p className="upgrade-modal__subtitle">
              <span className="upgrade-modal__tier upgrade-modal__tier--current">{currentTier}</span>
              <i className="fa-solid fa-arrow-right upgrade-modal__arrow"></i>
              <span className="upgrade-modal__tier upgrade-modal__tier--upgrade">{upgradeTier}</span>
            </p>
          </div>
          <button className="upgrade-modal__close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Body */}
        <div className="upgrade-modal__body">
          {/* Feature Improvements */}
          {improvements && improvements.length > 0 && (
            <div className="upgrade-modal__section">
              <h3 className="upgrade-modal__section-title">
                <i className="fa-solid fa-arrow-up"></i>
                Enhanced features
              </h3>
              <div className="upgrade-modal__improvements">
                {improvements.map((item, index) => (
                  <div key={index} className="upgrade-modal__improvement">
                    <span className="upgrade-modal__improvement-feature">{item.feature}</span>
                    <div className="upgrade-modal__improvement-values">
                      <span className="upgrade-modal__improvement-current">{item.current}</span>
                      <i className="fa-solid fa-arrow-right upgrade-modal__improvement-arrow"></i>
                      <span className="upgrade-modal__improvement-upgrade">{item.upgrade}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Perks */}
          {newPerks && newPerks.length > 0 && (
            <div className="upgrade-modal__section">
              <h3 className="upgrade-modal__section-title">
                <i className="fa-solid fa-plus"></i>
                New benefits
              </h3>
              <ul className="upgrade-modal__new-perks">
                {newPerks.map((perk, index) => (
                  <li key={index} className="upgrade-modal__new-perk">
                    <i className="fa-solid fa-check upgrade-modal__new-perk-icon"></i>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="upgrade-modal__footer">
          <div className="upgrade-modal__price-summary">
            <div className="upgrade-modal__price-row">
              <span className="upgrade-modal__price-label">{upgradeTier} Membership</span>
              <span className="upgrade-modal__price-value">{formatCurrency(upgradePrice)}/year</span>
            </div>
            {priceDifference > 0 && (
              <div className="upgrade-modal__price-row upgrade-modal__price-row--difference">
                <span className="upgrade-modal__price-label">Additional cost</span>
                <span className="upgrade-modal__price-difference">+{formatCurrency(priceDifference)}</span>
              </div>
            )}
          </div>

          {/* Payment Link Section */}
          <div className="upgrade-modal__payment-link">
            <label className="upgrade-modal__payment-link-label">Payment Link</label>
            <div className="upgrade-modal__payment-link-input-wrapper">
              <input 
                type="text" 
                className="upgrade-modal__payment-link-input"
                value={paymentLink}
                readOnly
                onClick={(e) => e.target.select()}
              />
              <button 
                className={`upgrade-modal__copy-btn ${linkCopied ? 'upgrade-modal__copy-btn--copied' : ''}`}
                onClick={handleCopyLink}
              >
                <i className={`fa-solid ${linkCopied ? 'fa-check' : 'fa-copy'}`}></i>
                {linkCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="upgrade-modal__actions">
            <button className="upgrade-modal__btn upgrade-modal__btn--secondary" onClick={onClose}>
              Close
            </button>
            <button className="upgrade-modal__btn upgrade-modal__btn--primary" onClick={handleSendEmail}>
              <i className="fa-solid fa-envelope"></i>
              Send payment link via email
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpgradeModal
