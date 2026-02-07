import { getAcknowledgmentsByPatronId, getPendingAcknowledgments, getGiftsByPatronId, isGiftAcknowledged, formatDate } from '../../data/patrons'
import './AcknowledgmentsPanel.css'

const formatCurrency = (amount) => {
  if (amount == null) return '$0'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const methodIcons = {
  email: 'fa-envelope',
  mail: 'fa-envelope-open-text',
  phone: 'fa-phone',
  'in-person': 'fa-handshake',
}

const typeLabels = {
  'thank-you-letter': 'Thank-You Letter',
  'thank-you-email': 'Thank-You Email',
  'thank-you-call': 'Thank-You Call',
  'tax-receipt': 'Tax Receipt',
}

function AcknowledgmentsPanel({ patronId }) {
  const allAcks = getAcknowledgmentsByPatronId(patronId)
  const pendingAcks = getPendingAcknowledgments(patronId)
  const gifts = getGiftsByPatronId(patronId)

  // Stats
  const acknowledgedGifts = gifts.filter(g => isGiftAcknowledged(g.id))
  const unacknowledgedGifts = gifts.filter(g => !isGiftAcknowledged(g.id))

  // Recently sent (last 5)
  const sentAcks = allAcks
    .filter(a => a.status === 'sent' && a.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  // Build a gift lookup
  const giftMap = {}
  gifts.forEach(g => { giftMap[g.id] = g })

  return (
    <div className="ack-panel wrapper-card">
      <div className="ack-panel__header">
        <h4 className="ack-panel__title">Acknowledgments</h4>
      </div>

      {/* Summary stats */}
      <div className="ack-panel__stats">
        <div className="ack-panel__stat">
          <span className="ack-panel__stat-value ack-panel__stat-value--success">
            {acknowledgedGifts.length}
          </span>
          <span className="ack-panel__stat-label">Acknowledged</span>
        </div>
        <div className="ack-panel__stat">
          <span className="ack-panel__stat-divider">/</span>
        </div>
        <div className="ack-panel__stat">
          <span className="ack-panel__stat-value">{gifts.length}</span>
          <span className="ack-panel__stat-label">Total Gifts</span>
        </div>
        {pendingAcks.length > 0 && (
          <div className="ack-panel__stat ack-panel__stat--pending">
            <span className="ack-panel__stat-value ack-panel__stat-value--warning">
              {pendingAcks.length}
            </span>
            <span className="ack-panel__stat-label">Pending</span>
          </div>
        )}
      </div>

      {/* Pending section */}
      {pendingAcks.length > 0 && (
        <div className="ack-panel__pending">
          <h5 className="ack-panel__section-title">
            <i className="fa-solid fa-clock"></i>
            Awaiting Acknowledgment
          </h5>
          <div className="ack-panel__pending-list">
            {pendingAcks.map(ack => {
              const gift = giftMap[ack.giftId]
              return (
                <div key={ack.id} className="ack-panel__pending-item">
                  <div className="ack-panel__pending-info">
                    <span className="ack-panel__pending-gift">
                      {gift ? gift.description : 'Unknown gift'}
                    </span>
                    <span className="ack-panel__pending-amount">
                      {gift ? formatCurrency(gift.amount) : ''}
                    </span>
                  </div>
                  <div className="ack-panel__pending-meta">
                    <span className="ack-panel__pending-type">
                      {typeLabels[ack.type] || ack.type}
                    </span>
                    <button className="ack-panel__send-btn" title="Send acknowledgment">
                      <i className="fa-solid fa-paper-plane"></i>
                      Send
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Recent acknowledgments */}
      {sentAcks.length > 0 && (
        <div className="ack-panel__recent">
          <h5 className="ack-panel__section-title">
            <i className="fa-solid fa-check-double"></i>
            Recently Sent
          </h5>
          <div className="ack-panel__recent-list">
            {sentAcks.map(ack => {
              const gift = giftMap[ack.giftId]
              const methodIcon = methodIcons[ack.method] || 'fa-envelope'
              return (
                <div key={ack.id} className="ack-panel__recent-item">
                  <i className={`fa-solid ${methodIcon} ack-panel__recent-icon`}></i>
                  <div className="ack-panel__recent-info">
                    <span className="ack-panel__recent-type">
                      {typeLabels[ack.type] || ack.type}
                    </span>
                    <span className="ack-panel__recent-gift">
                      {gift ? gift.description : 'Unknown gift'}
                      {gift ? ` (${formatCurrency(gift.amount)})` : ''}
                    </span>
                  </div>
                  <span className="ack-panel__recent-date">{formatDate(ack.date)}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* All clear */}
      {pendingAcks.length === 0 && gifts.length > 0 && (
        <div className="ack-panel__all-clear">
          <i className="fa-solid fa-circle-check"></i>
          <span>All gifts have been acknowledged</span>
        </div>
      )}

      {/* No gifts at all */}
      {gifts.length === 0 && (
        <div className="ack-panel__empty">
          <i className="fa-solid fa-envelope-open-text"></i>
          <p>No gifts to acknowledge</p>
        </div>
      )}
    </div>
  )
}

export default AcknowledgmentsPanel
