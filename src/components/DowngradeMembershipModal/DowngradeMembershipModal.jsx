import { useState } from 'react'
import { downgradeMembership, membershipPrograms, tierConfig } from '../../data/patrons'
import './DowngradeMembershipModal.css'

// Format currency helper
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

function DowngradeMembershipModal({ membership, patronId, patronEmail, patronName, onClose, onConfirm }) {
  const [selectedTier, setSelectedTier] = useState(null)
  const [timing, setTiming] = useState('renewal') // 'renewal' | 'immediate'
  const [linkCopied, setLinkCopied] = useState(false)
  const [linkGenerated, setLinkGenerated] = useState(false)
  const [generatedLink, setGeneratedLink] = useState('')
  const [creditAmount, setCreditAmount] = useState(0)

  // Get tiers below current
  const tierOrder = ['Basic', 'Silver', 'Gold', 'Platinum']
  const currentTierIndex = tierOrder.indexOf(membership.tier)
  const lowerTiers = membershipPrograms.filter(p => tierOrder.indexOf(p.tier) < currentTierIndex)
  const currentProgram = membershipPrograms.find(p => p.tier === membership.tier)

  // Get selected tier program
  const selectedProgram = selectedTier ? membershipPrograms.find(p => p.tier === selectedTier) : null

  // Calculate what they lose
  const getBenefitsDiff = () => {
    if (!selectedProgram || !currentProgram) return []
    // Compare highlights
    return currentProgram.highlights.filter(h => !selectedProgram.highlights.includes(h))
  }

  // Check beneficiary slot impact
  const currentSlots = tierConfig[membership.tier]?.beneficiaryLimit || 0
  const newSlots = selectedTier ? (tierConfig[selectedTier]?.beneficiaryLimit || 0) : 0
  const slotImpact = currentSlots !== Infinity && newSlots < currentSlots

  const handleGenerateLink = () => {
    if (!selectedTier) return

    const result = downgradeMembership(membership.id, selectedTier, { timing })
    if (result.success) {
      setGeneratedLink(result.link)
      setCreditAmount(result.creditAmount)
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
    const subject = encodeURIComponent(`Change your membership to ${selectedTier}`)
    const body = encodeURIComponent(
`Hi ${name},

As requested, here's a link to change your membership from ${membership.tier} to ${selectedTier}.

New tier: ${selectedTier} — ${formatCurrency(selectedProgram?.price || 0)}/year
${creditAmount > 0 ? `\nYou'll receive a credit of ${formatCurrency(creditAmount)} for the remaining period.\n` : ''}
Click the link below to confirm:
${generatedLink}

If you have any questions, please don't hesitate to reach out.

Best regards`
    )
    window.open(`mailto:${patronEmail || ''}?subject=${subject}&body=${body}`, '_blank')
    onConfirm()
  }

  return (
    <div className="downgrade-modal__overlay" onClick={onClose}>
      <div className="downgrade-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="downgrade-modal__header">
          <div className="downgrade-modal__header-content">
            <h3 className="downgrade-modal__title">Downgrade membership</h3>
            <div className="downgrade-modal__tier-transition">
              <span className="downgrade-modal__tier-badge">{membership.tier}</span>
              <i className="fa-solid fa-arrow-right"></i>
              <span className="downgrade-modal__tier-badge downgrade-modal__tier-badge--new">
                {selectedTier || '...'}
              </span>
            </div>
          </div>
          <button className="downgrade-modal__close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Body */}
        <div className="downgrade-modal__body">
          {!linkGenerated ? (
            <>
              {/* Tier selector */}
              <div className="downgrade-modal__section">
                <h4 className="downgrade-modal__section-title">
                  <i className="fa-solid fa-layer-group"></i>
                  Select new tier
                </h4>
                <div className="downgrade-modal__tier-list">
                  {lowerTiers.map(program => {
                    const config = tierConfig[program.tier]
                    return (
                      <label
                        key={program.id}
                        className={`downgrade-modal__tier-option ${selectedTier === program.tier ? 'downgrade-modal__tier-option--selected' : ''}`}
                      >
                        <input
                          type="radio"
                          name="tier"
                          value={program.tier}
                          checked={selectedTier === program.tier}
                          onChange={() => setSelectedTier(program.tier)}
                          className="downgrade-modal__radio-input"
                        />
                        <div
                          className="downgrade-modal__tier-accent"
                          style={{ backgroundColor: config?.cardStyle?.backgroundColor || '#666' }}
                        />
                        <div className="downgrade-modal__tier-info">
                          <div className="downgrade-modal__tier-header">
                            <span className="downgrade-modal__tier-name">{program.tier}</span>
                            <span className="downgrade-modal__tier-price">{formatCurrency(program.price)}/yr</span>
                          </div>
                          <span className="downgrade-modal__tier-tagline">{program.tagline}</span>
                        </div>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* What they lose */}
              {selectedTier && getBenefitsDiff().length > 0 && (
                <div className="downgrade-modal__section">
                  <h4 className="downgrade-modal__section-title">
                    <i className="fa-solid fa-arrow-down"></i>
                    Benefits they will lose
                  </h4>
                  <div className="downgrade-modal__lost-benefits">
                    {getBenefitsDiff().map((benefit, idx) => (
                      <div key={idx} className="downgrade-modal__lost-item">
                        <i className="fa-solid fa-minus"></i>
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Slot impact warning */}
              {selectedTier && slotImpact && (
                <div className="downgrade-modal__warning">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                  <span>
                    The {selectedTier} tier allows {newSlots === 1 ? '1 beneficiary' : `${newSlots} beneficiaries`} (currently {currentSlots === Infinity ? 'unlimited' : currentSlots}). Some beneficiaries may need to be removed.
                  </span>
                </div>
              )}

              {/* Timing */}
              <div className="downgrade-modal__section">
                <h4 className="downgrade-modal__section-title">
                  <i className="fa-solid fa-calendar"></i>
                  When
                </h4>
                <div className="downgrade-modal__timing-options">
                  <label className={`downgrade-modal__timing-option ${timing === 'renewal' ? 'downgrade-modal__timing-option--selected' : ''}`}>
                    <input type="radio" name="timing" value="renewal" checked={timing === 'renewal'} onChange={() => setTiming('renewal')} className="downgrade-modal__radio-input" />
                    <div className="downgrade-modal__radio-custom" />
                    <div className="downgrade-modal__timing-content">
                      <span className="downgrade-modal__timing-label">At next renewal</span>
                      <span className="downgrade-modal__timing-desc">Keep current benefits until {membership.validUntil}</span>
                    </div>
                  </label>
                  <label className={`downgrade-modal__timing-option ${timing === 'immediate' ? 'downgrade-modal__timing-option--selected' : ''}`}>
                    <input type="radio" name="timing" value="immediate" checked={timing === 'immediate'} onChange={() => setTiming('immediate')} className="downgrade-modal__radio-input" />
                    <div className="downgrade-modal__radio-custom" />
                    <div className="downgrade-modal__timing-content">
                      <span className="downgrade-modal__timing-label">Immediately</span>
                      <span className="downgrade-modal__timing-desc">Prorated credit will be applied</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Price summary */}
              {selectedTier && selectedProgram && (
                <div className="downgrade-modal__price-summary">
                  <div className="downgrade-modal__price-row">
                    <span>New price</span>
                    <span className="downgrade-modal__price-value">{formatCurrency(selectedProgram.price)}/year</span>
                  </div>
                  <div className="downgrade-modal__price-row">
                    <span>Savings</span>
                    <span className="downgrade-modal__price-value downgrade-modal__price-value--savings">
                      {formatCurrency((currentProgram?.price || 0) - selectedProgram.price)}/year
                    </span>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Link generated view */
            <>
              <div className="downgrade-modal__success-icon">
                <i className="fa-solid fa-check"></i>
              </div>
              <p className="downgrade-modal__success-text">
                Downgrade link generated. Send it to the patron to confirm the change.
              </p>
              {creditAmount > 0 && (
                <div className="downgrade-modal__credit-note">
                  <i className="fa-solid fa-receipt"></i>
                  <span>Prorated credit: <strong>{formatCurrency(creditAmount)}</strong></span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="downgrade-modal__footer">
          {linkGenerated ? (
            <>
              <div className="downgrade-modal__link-section">
                <label className="downgrade-modal__link-label">Downgrade payment link</label>
                <div className="downgrade-modal__link-input-wrapper">
                  <input
                    type="text"
                    className="downgrade-modal__link-input"
                    value={generatedLink}
                    readOnly
                    onClick={e => e.target.select()}
                  />
                  <button
                    className={`downgrade-modal__copy-btn ${linkCopied ? 'downgrade-modal__copy-btn--copied' : ''}`}
                    onClick={handleCopyLink}
                  >
                    <i className={`fa-solid ${linkCopied ? 'fa-check' : 'fa-copy'}`}></i>
                    {linkCopied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <div className="downgrade-modal__actions">
                <button className="downgrade-modal__btn downgrade-modal__btn--secondary" onClick={onClose}>Close</button>
                <button className="downgrade-modal__btn downgrade-modal__btn--primary" onClick={handleSendEmail}>
                  <i className="fa-solid fa-envelope"></i>
                  Send via email
                </button>
              </div>
            </>
          ) : (
            <div className="downgrade-modal__actions">
              <button className="downgrade-modal__btn downgrade-modal__btn--secondary" onClick={onClose}>Close</button>
              <button
                className="downgrade-modal__btn downgrade-modal__btn--primary"
                onClick={handleGenerateLink}
                disabled={!selectedTier}
              >
                <i className="fa-solid fa-link"></i>
                Generate downgrade link
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DowngradeMembershipModal
