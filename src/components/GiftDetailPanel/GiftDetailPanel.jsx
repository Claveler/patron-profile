import { useEffect } from 'react'
import { formatDate, getAcknowledgmentsByGiftId, PLEDGES, getPledgeBalance, RECURRING_PROFILES, getAllocationsForGift } from '../../data/patrons'
import { getFundNameById, getCampaignNameById, getAppealNameById, getStaffNameById } from '../../data/campaigns'
import './GiftDetailPanel.css'

const formatCurrency = (amount) => {
  if (amount == null) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

const typeConfig = {
  'one-time': { label: 'One-Time', className: 'gift-detail-panel__type-badge--one-time' },
  membership: { label: 'Membership', className: 'gift-detail-panel__type-badge--membership' },
  'pledge-payment': { label: 'Pledge Payment', className: 'gift-detail-panel__type-badge--pledge' },
  recurring: { label: 'Recurring', className: 'gift-detail-panel__type-badge--recurring' },
}

const ackStatusConfig = {
  sent: { label: 'Sent', className: 'gift-detail-panel__ack-status--sent' },
  pending: { label: 'Pending', className: 'gift-detail-panel__ack-status--pending' },
}

function GiftDetailPanel({ gift, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Prevent body scroll when panel is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!gift) return null

  const type = typeConfig[gift.type] || typeConfig['one-time']
  const fundName = getFundNameById(gift.fundId)
  const campaignName = gift.campaignId ? getCampaignNameById(gift.campaignId) : null
  const appealName = gift.campaignId && gift.appealId ? getAppealNameById(gift.campaignId, gift.appealId) : null
  const acknowledgments = getAcknowledgmentsByGiftId(gift.id)
  const allocations = getAllocationsForGift(gift.id)
  const hasTaxInfo = gift.benefitsValue > 0
  const hasSoftCredits = gift.softCredits && gift.softCredits.length > 0

  // Linked pledge
  const linkedPledge = gift.pledgeId ? PLEDGES.find(p => p.id === gift.pledgeId) : null
  const pledgeBalance = gift.pledgeId ? getPledgeBalance(gift.pledgeId) : null

  // Linked recurring profile
  const linkedRecurring = gift.recurringProfileId
    ? RECURRING_PROFILES.find(r => r.id === gift.recurringProfileId)
    : null

  return (
    <div className="gift-detail-panel__overlay" onClick={onClose}>
      <div
        className="gift-detail-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="gift-detail-panel__header">
          <div className="gift-detail-panel__header-top">
            <span className={`gift-detail-panel__type-badge ${type.className}`}>
              {type.label}
            </span>
            <button className="gift-detail-panel__close" onClick={onClose} aria-label="Close">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div className="gift-detail-panel__amount">{formatCurrency(gift.amount)}</div>
          <div className="gift-detail-panel__description">{gift.description}</div>
          <div className="gift-detail-panel__date">{formatDate(gift.date)}</div>
        </div>

        {/* Scrollable body */}
        <div className="gift-detail-panel__body">

          {/* Section: Attribution (DCAP) */}
          <div className="gift-detail-panel__section">
            <h5 className="gift-detail-panel__section-title">Attribution</h5>
            <div className="gift-detail-panel__field-grid">
              <div className="gift-detail-panel__field">
                <span className="gift-detail-panel__label">Fund</span>
                <span className="gift-detail-panel__value">{fundName || '—'}</span>
              </div>
              {campaignName && (
                <div className="gift-detail-panel__field">
                  <span className="gift-detail-panel__label">Campaign</span>
                  <span className="gift-detail-panel__value">{campaignName}</span>
                </div>
              )}
              {appealName && (
                <div className="gift-detail-panel__field">
                  <span className="gift-detail-panel__label">Appeal</span>
                  <span className="gift-detail-panel__value">{appealName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Section: Tax Information */}
          {hasTaxInfo && (
            <div className="gift-detail-panel__section">
              <h5 className="gift-detail-panel__section-title">Tax Information</h5>
              <div className="gift-detail-panel__tax-breakdown">
                <div className="gift-detail-panel__tax-row">
                  <span>Gift Amount</span>
                  <span>{formatCurrency(gift.amount)}</span>
                </div>
                <div className="gift-detail-panel__tax-row gift-detail-panel__tax-row--deduction">
                  <span>Less: Benefits Value</span>
                  <span>({formatCurrency(gift.benefitsValue)})</span>
                </div>
                <div className="gift-detail-panel__tax-row gift-detail-panel__tax-row--total">
                  <span>Tax-Deductible Amount</span>
                  <span>{formatCurrency(gift.deductible)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Section: Soft Credits */}
          {hasSoftCredits && (
            <div className="gift-detail-panel__section">
              <h5 className="gift-detail-panel__section-title">Soft Credits</h5>
              <div className="gift-detail-panel__soft-credits">
                {gift.softCredits.map((credit, idx) => (
                  <div key={idx} className="gift-detail-panel__credit-item">
                    <i className="fa-solid fa-user-tag gift-detail-panel__credit-icon"></i>
                    <div className="gift-detail-panel__credit-info">
                      <span className="gift-detail-panel__credit-name">{credit.name}</span>
                      <span className="gift-detail-panel__credit-role">
                        {credit.type === 'solicitor' ? 'Solicitor' : 'Influencer'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Linked Records */}
          {(linkedPledge || linkedRecurring || allocations.length > 0) && (
            <div className="gift-detail-panel__section">
              <h5 className="gift-detail-panel__section-title">Linked Records</h5>

              {linkedPledge && (
                <div className="gift-detail-panel__linked-card">
                  <div className="gift-detail-panel__linked-icon">
                    <i className="fa-solid fa-handshake"></i>
                  </div>
                  <div className="gift-detail-panel__linked-info">
                    <span className="gift-detail-panel__linked-label">Pledge</span>
                    <span className="gift-detail-panel__linked-detail">
                      {formatCurrency(linkedPledge.amount)} total &middot; {formatCurrency(pledgeBalance)} remaining
                    </span>
                    <span className="gift-detail-panel__linked-meta">
                      {linkedPledge.frequency} &middot; {linkedPledge.status}
                    </span>
                  </div>
                </div>
              )}

              {linkedRecurring && (
                <div className="gift-detail-panel__linked-card">
                  <div className="gift-detail-panel__linked-icon">
                    <i className="fa-solid fa-rotate"></i>
                  </div>
                  <div className="gift-detail-panel__linked-info">
                    <span className="gift-detail-panel__linked-label">Recurring Profile</span>
                    <span className="gift-detail-panel__linked-detail">
                      {formatCurrency(linkedRecurring.amount)} / {linkedRecurring.frequency}
                    </span>
                    <span className="gift-detail-panel__linked-meta">
                      {linkedRecurring.status} &middot; Since {formatDate(linkedRecurring.startDate)}
                    </span>
                  </div>
                </div>
              )}

              {allocations.length > 0 && (
                <div className="gift-detail-panel__allocations">
                  <span className="gift-detail-panel__alloc-label">Split Designations</span>
                  {allocations.map(alloc => (
                    <div key={alloc.id} className="gift-detail-panel__alloc-row">
                      <span className="gift-detail-panel__alloc-fund">{getFundNameById(alloc.fundId)}</span>
                      <span className="gift-detail-panel__alloc-amount">{formatCurrency(alloc.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Section: Acknowledgments */}
          <div className="gift-detail-panel__section">
            <h5 className="gift-detail-panel__section-title">Acknowledgments</h5>
            {acknowledgments.length === 0 ? (
              <div className="gift-detail-panel__ack-empty">
                <i className="fa-solid fa-envelope-circle-check"></i>
                <span>No acknowledgments recorded</span>
              </div>
            ) : (
              <div className="gift-detail-panel__ack-list">
                {acknowledgments.map(ack => {
                  const statusCfg = ackStatusConfig[ack.status] || ackStatusConfig.pending
                  return (
                    <div key={ack.id} className="gift-detail-panel__ack-item">
                      <div className="gift-detail-panel__ack-top">
                        <span className="gift-detail-panel__ack-type">
                          {ack.type === 'thank-you-letter' ? 'Thank-You Letter' : 'Tax Receipt'}
                        </span>
                        <span className={`gift-detail-panel__ack-status ${statusCfg.className}`}>
                          {statusCfg.label}
                        </span>
                      </div>
                      <div className="gift-detail-panel__ack-bottom">
                        <span>via {ack.method}</span>
                        <span>{formatDate(ack.date)}</span>
                        {ack.staffId && <span>by {getStaffNameById(ack.staffId)}</span>}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GiftDetailPanel
