import { useState } from 'react'
import { getGiftsByPatronId, isGiftAcknowledged, getAcknowledgmentsByGiftId, formatDate } from '../../data/patrons'
import { getFundNameById } from '../../data/campaigns'
import './GiftHistoryTable.css'

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
  'one-time': { label: 'One-Time', className: 'gift-history__type-badge--one-time' },
  membership: { label: 'Membership', className: 'gift-history__type-badge--membership' },
  'pledge-payment': { label: 'Pledge', className: 'gift-history__type-badge--pledge' },
  recurring: { label: 'Recurring', className: 'gift-history__type-badge--recurring' },
}

function GiftHistoryTable({ patronId, onRecordGift, onGiftSelect, selectedGiftId }) {
  const [visibleCount, setVisibleCount] = useState(10)
  
  const gifts = getGiftsByPatronId(patronId)
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  const displayedGifts = gifts.slice(0, visibleCount)
  const hasMore = gifts.length > visibleCount

  // Summary
  const totalAmount = gifts.reduce((sum, g) => sum + g.amount, 0)

  const getAckStatus = (giftId) => {
    const acks = getAcknowledgmentsByGiftId(giftId)
    if (acks.length === 0) return 'none'
    const hasPending = acks.some(a => a.status === 'pending')
    const hasSent = acks.some(a => a.status === 'sent')
    if (hasPending && !hasSent) return 'pending'
    if (hasSent) return 'acknowledged'
    return 'none'
  }

  const ackIcons = {
    acknowledged: { icon: 'fa-circle-check', className: 'gift-history__ack--acknowledged', title: 'Acknowledged' },
    pending: { icon: 'fa-clock', className: 'gift-history__ack--pending', title: 'Pending' },
    none: { icon: 'fa-minus', className: 'gift-history__ack--none', title: 'No acknowledgment' },
  }

  return (
    <div className="gift-history wrapper-card">
      <div className="gift-history__header">
        <h4 className="gift-history__title">
          Gift History
          <span className="gift-history__count">{gifts.length}</span>
        </h4>
        <div className="gift-history__actions">
          <span className="gift-history__total">
            Total: {formatCurrency(totalAmount)}
          </span>
          {onRecordGift && (
            <button className="gift-history__record-gift-btn" onClick={onRecordGift}>
              Record gift
            </button>
          )}
        </div>
      </div>

      {gifts.length === 0 ? (
        <div className="gift-history__empty">
          <i className="fa-solid fa-hand-holding-dollar"></i>
          <p>No gifts on record</p>
        </div>
      ) : (
        <>
          <div className="gift-history__table-wrapper">
            <table className="gift-history__table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Fund</th>
                  <th className="gift-history__th-right">Amount</th>
                  <th className="gift-history__th-center">Ack</th>
                </tr>
              </thead>
              <tbody>
                {displayedGifts.map(gift => {
                  const type = typeConfig[gift.type] || typeConfig['one-time']
                  const fundName = getFundNameById(gift.fundId)
                  const ackStatus = getAckStatus(gift.id)
                  const ack = ackIcons[ackStatus]

                  return (
                    <tr
                      key={gift.id}
                      className={`gift-history__row${selectedGiftId === gift.id ? ' gift-history__row--selected' : ''}`}
                      onClick={() => onGiftSelect && onGiftSelect(gift)}
                    >
                      <td className="gift-history__date">{formatDate(gift.date)}</td>
                      <td className="gift-history__description">{gift.description}</td>
                      <td>
                        <span className={`gift-history__type-badge ${type.className}`}>
                          {type.label}
                        </span>
                      </td>
                      <td className="gift-history__fund">{fundName || '—'}</td>
                      <td className="gift-history__amount">{formatCurrency(gift.amount)}</td>
                      <td className="gift-history__ack-cell">
                        <i 
                          className={`fa-solid ${ack.icon} ${ack.className}`}
                          title={ack.title}
                        ></i>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {hasMore && (
            <button 
              className="gift-history__load-more"
              onClick={() => setVisibleCount(prev => prev + 10)}
            >
              Show more ({gifts.length - visibleCount} remaining)
            </button>
          )}
        </>
      )}
    </div>
  )
}

export default GiftHistoryTable
