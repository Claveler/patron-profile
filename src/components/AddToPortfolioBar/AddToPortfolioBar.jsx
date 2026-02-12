import { useEpicScope } from '../../hooks/useEpicScope'
import './AddToPortfolioBar.css'

function AddToPortfolioBar({ patron, onAddToPortfolio }) {
  const { show } = useEpicScope()
  const showOppText = show('addToPortfolio.opportunityText')

  const handleClick = () => {
    if (onAddToPortfolio) {
      onAddToPortfolio(patron)
    } else {
      alert(`This would open a modal to assign ${patron.firstName} ${patron.lastName} to a gift officer${showOppText ? ' and optionally create their first opportunity' : ''}.`)
    }
  }

  return (
    <div className="add-to-portfolio-bar">
      <div className="add-to-portfolio-bar__content">
        <div className="add-to-portfolio-bar__info">
          <i className={`fa-solid ${showOppText ? 'fa-bullseye' : 'fa-user-shield'} add-to-portfolio-bar__icon`}></i>
          <div className="add-to-portfolio-bar__text-group">
            <span className="add-to-portfolio-bar__text">
              {showOppText
                ? 'This constituent has no active opportunities'
                : 'This constituent is not assigned to a gift officer'}
            </span>
            <span className="add-to-portfolio-bar__subtext">
              Assign to a gift officer to begin cultivation
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
