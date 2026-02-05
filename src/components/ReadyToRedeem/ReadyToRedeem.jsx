import './ReadyToRedeem.css'

function ReadyToRedeem({ benefits = [] }) {
  // Filter benefits that are ready to redeem
  const redeemableBenefits = benefits.filter(benefit => {
    if (!benefit.readyToRedeem) return false
    // If it has a limit and is exhausted, not ready to redeem
    if (benefit.usage?.limit && benefit.usage.used >= benefit.usage.limit) return false
    return true
  })

  if (redeemableBenefits.length === 0) {
    return null
  }

  return (
    <div className="ready-to-redeem">
      <div className="ready-to-redeem__header">
        <div className="ready-to-redeem__title-row">
          <i className="fa-solid fa-bolt ready-to-redeem__icon"></i>
          <h4 className="ready-to-redeem__title">Ready to Redeem</h4>
        </div>
        <span className="ready-to-redeem__count">{redeemableBenefits.length} available</span>
      </div>
      
      <div className="ready-to-redeem__list">
        {redeemableBenefits.map((benefit, index) => {
          const remaining = benefit.usage?.limit 
            ? benefit.usage.limit - benefit.usage.used 
            : null

          return (
            <div key={index} className="ready-to-redeem__item">
              <div className="ready-to-redeem__item-icon">
                <i className={`fa-solid ${benefit.icon || 'fa-check'}`}></i>
              </div>
              <div className="ready-to-redeem__item-content">
                <span className="ready-to-redeem__item-title">{benefit.title}</span>
                {benefit.description && (
                  <span className="ready-to-redeem__item-desc">{benefit.description}</span>
                )}
              </div>
              <div className="ready-to-redeem__item-action">
                {remaining !== null ? (
                  <span className="ready-to-redeem__item-remaining">
                    {remaining} left
                  </span>
                ) : (
                  <span className="ready-to-redeem__item-unlimited">
                    <i className="fa-solid fa-infinity"></i>
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
      
      <p className="ready-to-redeem__hint">
        <i className="fa-solid fa-circle-info"></i>
        Show this screen at the venue to redeem perks
      </p>
    </div>
  )
}

export default ReadyToRedeem
