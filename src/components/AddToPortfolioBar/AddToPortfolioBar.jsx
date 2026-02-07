import './AddToPortfolioBar.css'

function AddToPortfolioBar({ patron, onAddToPortfolio }) {
  const handleClick = () => {
    if (onAddToPortfolio) {
      onAddToPortfolio(patron)
    } else {
      alert(`This would open a modal to assign ${patron.firstName} ${patron.lastName} to a relationship manager and optionally create their first opportunity.`)
    }
  }

  return (
    <div className="add-to-portfolio-bar">
      <div className="add-to-portfolio-bar__content">
        <div className="add-to-portfolio-bar__info">
          <i className="fa-solid fa-bullseye add-to-portfolio-bar__icon"></i>
          <div className="add-to-portfolio-bar__text-group">
            <span className="add-to-portfolio-bar__text">
              This constituent has no active opportunities
            </span>
            <span className="add-to-portfolio-bar__subtext">
              Assign to a relationship manager to begin cultivation
            </span>
          </div>
        </div>
        <button 
          className="add-to-portfolio-bar__btn"
          onClick={handleClick}
        >
          Add to portfolio
        </button>
      </div>
    </div>
  )
}

export default AddToPortfolioBar
