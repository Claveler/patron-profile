import './WealthInsights.css'

function WealthInsights({ insights }) {
  // Show empty state if no wealth insights available
  if (!insights) {
    return (
      <div className="wealth-insights wrapper-card">
        <div className="wealth-insights__header">
          <h4 className="wealth-insights__title">Wealth Insights</h4>
          <div className="wealth-insights__powered-by">
            <span>Powered by</span>
            <img 
              src="/donorsearch.png" 
              alt="DonorSearch" 
              className="wealth-insights__logo"
            />
          </div>
        </div>
        <div className="wealth-insights__empty">
          <i className="fa-solid fa-chart-pie"></i>
          <p>No wealth data available</p>
          <button className="wealth-insights__request-btn">
            Request screening
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="wealth-insights wrapper-card">
      <div className="wealth-insights__header">
        <h4 className="wealth-insights__title">Wealth Insights</h4>
        <div className="wealth-insights__powered-by">
          <span>Powered by</span>
          <img 
            src="/donorsearch.png" 
            alt="DonorSearch" 
            className="wealth-insights__logo"
          />
        </div>
      </div>

      <div className="wealth-insights__content">
        {/* Propensity Score */}
        <div className="wealth-insights__propensity">
          <span className="wealth-insights__propensity-label">Propensity Score</span>
          <span className="wealth-insights__propensity-score">{insights.propensityScore}</span>
        </div>

        <div className="wealth-insights__divider"></div>

        {/* Description */}
        <p className="wealth-insights__description">
          {insights.description}
        </p>

        {/* Link */}
        <a href="#" className="wealth-insights__link">
          View full profile
          <i className="fa-solid fa-arrow-up-right-from-square"></i>
        </a>
      </div>
    </div>
  )
}

export default WealthInsights
