import './AddToPortfolioBar.css'

function AddToPortfolioBar({ patron, onAddToPortfolio }) {
  const handleClick = () => {
    if (onAddToPortfolio) {
      onAddToPortfolio(patron)
    } else {
      alert(`This would open a modal to assign ${patron.firstName} ${patron.lastName} to a relationship manager.`)
    }
  }

  return (
    <div className="add-to-portfolio-bar">
      <div className="add-to-portfolio-bar__content">
        <div className="add-to-portfolio-bar__info">
          <i className="fa-solid fa-user-plus add-to-portfolio-bar__icon"></i>
          <span className="add-to-portfolio-bar__text">
            This constituent is not currently assigned to a relationship manager
          </span>
        </div>
        <button 
          className="add-to-portfolio-bar__btn"
          onClick={handleClick}
        >
          <i className="fa-solid fa-briefcase"></i>
          Add to Portfolio
        </button>
      </div>
    </div>
  )
}

export default AddToPortfolioBar
