import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import UpgradeModal from '../UpgradeModal/UpgradeModal'
import './MembershipOverview.css'

// Category display names, order, and icon colors (from PRD: Membership Perks Management)
const categoryConfig = {
  access: { label: 'Access', order: 1, colorClass: 'access' },
  discount: { label: 'Discounts', order: 2, colorClass: 'discount' },
  complimentary: { label: 'Complimentary', order: 3, colorClass: 'complimentary' }
}

// Payment method icons
const paymentIcons = {
  visa: 'fa-cc-visa',
  mastercard: 'fa-cc-mastercard',
  amex: 'fa-cc-amex',
  default: 'fa-credit-card'
}

function MembershipOverview({ membership, patronName, patronEmail }) {
  // IMPORTANT: All hooks must be called before any early returns (Rules of Hooks)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  
  // Guard for incomplete membership data
  if (!membership?.programme || !membership?.benefits) {
    return (
      <div className="membership-overview wrapper-card">
        <div className="membership-overview__header">
          <h4 className="membership-overview__title">Overview</h4>
        </div>
        <div className="membership-overview__empty">
          <i className="fa-solid fa-id-card"></i>
          <p>Membership details not available</p>
          <span className="membership-overview__empty-tier">
            {membership?.tier || 'Unknown'} Member
          </span>
        </div>
      </div>
    )
  }
  const qrValue = `${membership.patronId}-${membership.membershipId}`
  
  // Churn risk calculation
  const usagePercentage = membership.usageAnalytics?.overallPercentage || 0
  const isAtRisk = membership.daysToRenewal <= 30 && 
                   !membership.autoRenewal && 
                   usagePercentage < 50
  
  // Get churn risk reasons for tooltip
  const getChurnRiskReasons = () => {
    const reasons = []
    if (membership.daysToRenewal <= 30) reasons.push('Renewal approaching')
    if (!membership.autoRenewal) reasons.push('Auto-renewal OFF')
    if (usagePercentage < 50) reasons.push(`Low usage (${usagePercentage}%)`)
    return reasons
  }
  
  // Get payment icon
  const getPaymentIcon = (type) => {
    return paymentIcons[type] || paymentIcons.default
  }
  
  // Group benefits by category
  const groupBenefitsByCategory = () => {
    const grouped = {}
    membership.benefits?.forEach(benefit => {
      const cat = benefit.category || 'other'
      if (!grouped[cat]) grouped[cat] = []
      grouped[cat].push(benefit)
    })
    // Sort categories by defined order
    return Object.entries(grouped)
      .sort(([a], [b]) => (categoryConfig[a]?.order || 99) - (categoryConfig[b]?.order || 99))
  }
  
  // Get benefits with trackable usage (for Usage section)
  const getBenefitsWithUsage = () => {
    return membership.benefits?.filter(b => b.usage && b.usage.used > 0) || []
  }
  
  // Calculate period progress percentage
  const calculatePeriodProgress = () => {
    if (!membership.periodStart || !membership.validUntil) return 0
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split('/')
      return new Date(year, month - 1, day)
    }
    const start = parseDate(membership.periodStart)
    const end = parseDate(membership.validUntil)
    const now = new Date()
    const totalDays = (end - start) / (1000 * 60 * 60 * 24)
    const elapsedDays = (now - start) / (1000 * 60 * 60 * 24)
    return Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100)
  }
  const periodPercentage = calculatePeriodProgress()
  
  return (
    <div className="membership-overview wrapper-card">
      <div className="membership-overview__header">
        <h4 className="membership-overview__title">Overview</h4>
        <button className="membership-overview__menu">
          <i className="fa-solid fa-ellipsis-vertical"></i>
        </button>
      </div>
      
      <div className="membership-overview__content">
        {/* Two-column layout: Card on left, Benefits on right */}
        <div className="membership-overview__two-col">
          
          {/* COLUMN 1 (LEFT): Card + Upgrade + Auto-renewal */}
          <div className="membership-overview__card-col">
            {/* Membership Card */}
            <div 
              className="membership-overview__card"
              style={{ 
                backgroundColor: membership.cardStyle?.backgroundColor || '#1a5a5a',
                color: membership.cardStyle?.textColor || '#ffffff'
              }}
            >
              {/* Tenure Badge */}
              {membership.memberYears >= 1 && (
                <div className="membership-overview__tenure-badge">
                  <i className="fa-solid fa-award"></i>
                  <span>{membership.memberYears}-YEAR MEMBER</span>
                </div>
              )}
              
              <div className="membership-overview__card-content">
                <div className="membership-overview__card-info">
                  <h3 className="membership-overview__membership-name">
                    {membership.programme} - {membership.tier}
                  </h3>
                  <p className="membership-overview__patron-name">{patronName}</p>
                  <p className="membership-overview__card-id">ID: {membership.patronId}</p>
                  <p className="membership-overview__card-valid">Valid until: {membership.validUntil}</p>
                  
                  <span className={`membership-overview__status membership-overview__status--${membership.status}`}>
                    {membership.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="membership-overview__qr-container">
                  <QRCodeSVG 
                    value={qrValue}
                    size={70}
                    bgColor="transparent"
                    fgColor={membership.cardStyle?.textColor || '#ffffff'}
                    level="M"
                  />
                </div>
              </div>
            </div>
            
            {/* Period Progress */}
            <div className="membership-overview__period-progress">
              <div className="membership-overview__period-bar">
                <div 
                  className="membership-overview__period-fill"
                  style={{ width: `${periodPercentage}%` }}
                />
                <div 
                  className="membership-overview__period-marker"
                  style={{ left: `${periodPercentage}%` }}
                />
              </div>
              <div className="membership-overview__period-dates">
                <span>{membership.periodStart}</span>
                <span>{membership.validUntil}</span>
              </div>
            </div>
            
            {/* Upgrade CTA */}
            {membership.upgradeEligible && membership.upgradeComparison && (
              <button 
                className="membership-overview__upgrade-cta"
                onClick={() => setShowUpgradeModal(true)}
              >
                <i className="fa-solid fa-sparkles"></i>
                Upgrade to {membership.upgradeTier}
              </button>
            )}
            
            {/* Auto-Renewal Status */}
            <div className="membership-overview__renewal-info">
              <div className="membership-overview__auto-renewal-row">
                <span className="membership-overview__renewal-label">Auto-renewal</span>
                <span className={`membership-overview__auto-renewal membership-overview__auto-renewal--${membership.autoRenewal ? 'on' : 'off'}`}>
                  {membership.autoRenewal ? 'ON' : 'OFF'}
                </span>
                {membership.paymentMethod && (
                  <div className="membership-overview__payment-method">
                    <i className={`fa-brands ${getPaymentIcon(membership.paymentMethod.type)}`}></i>
                    <span>•••• {membership.paymentMethod.last4}</span>
                  </div>
                )}
              </div>
              
              {/* Churn Risk Indicator */}
              {isAtRisk && (
                <div className="membership-overview__risk-alert">
                  <div className="membership-overview__risk-badge">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                    <span>At Risk</span>
                  </div>
                  <ul className="membership-overview__risk-reasons">
                    {getChurnRiskReasons().map((reason, index) => (
                      <li key={index}>{reason}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          {/* COLUMN 2 (RIGHT): Benefits */}
          <div className="membership-overview__benefits-col">
            <div className="membership-overview__benefits-header">
              <span>Benefits</span>
              <span>Usage</span>
            </div>
            
            <div className="membership-overview__benefits-list">
              {groupBenefitsByCategory().map(([category, benefits]) => (
                <div key={category} className="membership-overview__benefit-category">
                  <h6 className="membership-overview__category-label">
                    {categoryConfig[category]?.label || category}
                  </h6>
                  
                  {benefits.map((benefit, index) => {
                    const hasUsage = benefit.usage && benefit.usage.used > 0
                    const hasLimit = benefit.usage && benefit.usage.limit !== null && benefit.usage.limit !== undefined
                    const isExhausted = hasLimit && benefit.usage?.used >= benefit.usage?.limit
                    const isLow = hasLimit && !isExhausted && (benefit.usage.limit - benefit.usage.used) <= 1
                    const colorClass = categoryConfig[category]?.colorClass || 'access'
                    
                    // Build compact usage pill content
                    const getUsagePill = () => {
                      if (!hasUsage) return null
                      if (isExhausted) return { type: 'redeemed' }
                      if (hasLimit) return { type: 'count', text: `${benefit.usage.used}/${benefit.usage.limit}` }
                      return { type: 'count', text: `${benefit.usage.used}x` }
                    }
                    
                    const usagePill = getUsagePill()
                    
                    return (
                      <div key={index} className="membership-overview__benefit-card">
                        <div className={`membership-overview__benefit-icon membership-overview__benefit-icon--${colorClass}`}>
                          <i className={`fa-solid ${benefit.icon || 'fa-check'}`}></i>
                        </div>
                        <div className="membership-overview__benefit-content">
                          <p className="membership-overview__benefit-text">
                            <strong>{benefit.title}</strong>
                            {benefit.description && ` ${benefit.description}`}
                          </p>
                        </div>
                        {usagePill && (
                          <span className={`membership-overview__usage-pill membership-overview__usage-pill--${colorClass}`}>
                            {usagePill.type === 'redeemed' ? (
                              <i className="fa-solid fa-check"></i>
                            ) : (
                              usagePill.text
                            )}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <UpgradeModal
          comparison={membership.upgradeComparison}
          patronId={membership.patronId}
          patronEmail={patronEmail}
          patronName={patronName}
          onClose={() => setShowUpgradeModal(false)}
        />
      )}
    </div>
  )
}

export default MembershipOverview
