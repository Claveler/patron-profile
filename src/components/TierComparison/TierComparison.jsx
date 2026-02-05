import './TierComparison.css'

function TierComparison({ comparison }) {
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

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="tier-comparison">
      <div className="tier-comparison__header">
        <div className="tier-comparison__title-row">
          <i className="fa-solid fa-arrow-up-right-dots tier-comparison__icon"></i>
          <h4 className="tier-comparison__title">Upgrade Comparison</h4>
        </div>
        <span className="tier-comparison__subtitle">
          {currentTier} → {upgradeTier}
        </span>
      </div>
      
      {/* Feature Improvements */}
      {improvements && improvements.length > 0 && (
        <div className="tier-comparison__section">
          <h5 className="tier-comparison__section-title">Enhanced Features</h5>
          <div className="tier-comparison__improvements">
            {improvements.map((item, index) => (
              <div key={index} className="tier-comparison__improvement">
                <span className="tier-comparison__improvement-feature">{item.feature}</span>
                <div className="tier-comparison__improvement-values">
                  <span className="tier-comparison__improvement-current">{item.current}</span>
                  <i className="fa-solid fa-arrow-right tier-comparison__improvement-arrow"></i>
                  <span className="tier-comparison__improvement-upgrade">{item.upgrade}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* New Perks */}
      {newPerks && newPerks.length > 0 && (
        <div className="tier-comparison__section">
          <h5 className="tier-comparison__section-title">New Benefits</h5>
          <ul className="tier-comparison__new-perks">
            {newPerks.map((perk, index) => (
              <li key={index} className="tier-comparison__new-perk">
                <i className="fa-solid fa-plus tier-comparison__new-perk-icon"></i>
                <span>{perk}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Price Summary */}
      <div className="tier-comparison__price-summary">
        <div className="tier-comparison__price-row">
          <span className="tier-comparison__price-label">{upgradeTier} Membership</span>
          <span className="tier-comparison__price-value">{formatCurrency(upgradePrice)}/year</span>
        </div>
        {priceDifference > 0 && (
          <div className="tier-comparison__price-row tier-comparison__price-row--difference">
            <span className="tier-comparison__price-label">Price difference</span>
            <span className="tier-comparison__price-difference">+{formatCurrency(priceDifference)}</span>
          </div>
        )}
      </div>
      
      <button className="tier-comparison__upgrade-btn">
        <i className="fa-solid fa-sparkles"></i>
        Upgrade to {upgradeTier}
      </button>
    </div>
  )
}

export default TierComparison
