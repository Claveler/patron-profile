import { useState } from 'react'
import './GivingHistory.css'

function GivingHistory({ gifts }) {
  const [showAll, setShowAll] = useState(false)
  
  // Sort gifts by date descending
  const sortedGifts = [...(gifts || [])].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  )
  
  // Show only first 3 by default
  const displayedGifts = showAll ? sortedGifts : sortedGifts.slice(0, 3)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getSoftCreditTypeLabel = (type) => {
    switch (type) {
      case 'solicitor': return 'Solicitor'
      case 'influencer': return 'Influencer'
      case 'matching': return 'Matching Gift'
      default: return type
    }
  }

  if (!gifts || gifts.length === 0) {
    return (
      <div className="giving-history">
        <div className="giving-history__header">
          <h3 className="giving-history__title">Giving History</h3>
        </div>
        <div className="giving-history__empty">
          <i className="fa-solid fa-hand-holding-heart"></i>
          <p>No gifts on record</p>
        </div>
      </div>
    )
  }

  return (
    <div className="giving-history">
      {/* Header */}
      <div className="giving-history__header">
        <h3 className="giving-history__title">Giving History</h3>
        {sortedGifts.length > 3 && (
          <button 
            className="giving-history__view-all"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : `View All (${sortedGifts.length})`}
          </button>
        )}
      </div>

      {/* Gift List */}
      <div className="giving-history__list">
        {displayedGifts.map((gift) => (
          <div key={gift.id} className="giving-history__gift">
            {/* Gift Header */}
            <div className="giving-history__gift-header">
              <div className="giving-history__gift-date">
                <i className="fa-solid fa-calendar"></i>
                {formatDate(gift.date)}
              </div>
              <span className="giving-history__gift-amount">
                {formatCurrency(gift.amount)}
              </span>
            </div>

            {/* Gift Type Badge */}
            <span className={`giving-history__gift-type giving-history__gift-type--${gift.type}`}>
              {gift.type === 'membership' ? 'Membership' : 'Donation'}
            </span>

            {/* Description */}
            <p className="giving-history__gift-description">{gift.description}</p>

            {/* Fund & Campaign */}
            <div className="giving-history__gift-attribution">
              <div className="giving-history__gift-fund">
                <i className="fa-solid fa-folder"></i>
                <span>{gift.fund?.name}</span>
              </div>
              <i className="fa-solid fa-arrow-right giving-history__gift-arrow"></i>
              <div className="giving-history__gift-campaign">
                <i className="fa-solid fa-bullseye"></i>
                <span>{gift.campaign?.name}</span>
              </div>
            </div>

            {/* Appeal */}
            {gift.appeal && (
              <div className="giving-history__gift-appeal">
                <i className="fa-solid fa-paper-plane"></i>
                <span>Appeal: {gift.appeal.name}</span>
              </div>
            )}

            {/* Soft Credits */}
            {gift.softCredits && gift.softCredits.length > 0 && (
              <div className="giving-history__soft-credits">
                {gift.softCredits.map((credit, index) => (
                  <div key={index} className="giving-history__soft-credit">
                    <i className="fa-solid fa-star"></i>
                    <span className="giving-history__soft-credit-name">{credit.name}</span>
                    <span className="giving-history__soft-credit-type">
                      ({getSoftCreditTypeLabel(credit.type)})
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Tax Info */}
            {gift.benefitsValue > 0 && (
              <div className="giving-history__gift-tax">
                <span className="giving-history__gift-deductible">
                  Tax Deductible: {formatCurrency(gift.deductible)}
                </span>
                <span className="giving-history__gift-benefits">
                  Benefits: {formatCurrency(gift.benefitsValue)}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default GivingHistory
