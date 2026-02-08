import { isManagedProspect } from '../../data/patrons'
import './AddToPortfolioCard.css'

function AddToPortfolioCard({ patron, onAddToPortfolio }) {
  // Don't show if patron is already managed
  if (isManagedProspect(patron)) return null

  // Format lifetime value
  const formatCurrency = (amount) => {
    if (!amount) return '$0'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="add-to-portfolio-card">
      <div className="add-to-portfolio-card__header">
        <h3 className="add-to-portfolio-card__title">
          <i className="fa-solid fa-chart-line"></i>
          Prospect Management
        </h3>
        <span className="add-to-portfolio-card__badge">
          <i className="fa-solid fa-circle-info"></i>
          Not in Pipeline
        </span>
      </div>

      <div className="add-to-portfolio-card__content">
        <div className="add-to-portfolio-card__icon">
          <i className="fa-solid fa-user-plus"></i>
        </div>
        <p className="add-to-portfolio-card__message">
          This patron is not currently assigned to a gift officer.
        </p>
        
        {/* Quick stats to help decision */}
        <div className="add-to-portfolio-card__stats">
          <div className="add-to-portfolio-card__stat">
            <span className="add-to-portfolio-card__stat-label">Lifetime Value</span>
            <span className="add-to-portfolio-card__stat-value">
              {formatCurrency(patron.giving?.lifetimeValue)}
            </span>
          </div>
          <div className="add-to-portfolio-card__stat">
            <span className="add-to-portfolio-card__stat-label">Engagement</span>
            <span className={`add-to-portfolio-card__stat-value add-to-portfolio-card__stat-value--${patron.engagement?.level || 'cold'}`}>
              {patron.engagement?.level ? patron.engagement.level.replace('-', ' ') : 'Unknown'}
            </span>
          </div>
        </div>

        <button 
          className="add-to-portfolio-card__action-btn"
          onClick={onAddToPortfolio}
        >
          Add to portfolio
        </button>
      </div>
    </div>
  )
}

export default AddToPortfolioCard
