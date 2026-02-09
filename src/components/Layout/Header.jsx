import './Header.css'

function Header({ onToggleSidebar, onToggleGuide, guideOpen }) {
  return (
    <header className="header">
      <div className="header__left">
        <button 
          className="header__menu-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <i className="fa-solid fa-bars"></i>
        </button>
        <a href="/" className="header__logo">
          <img 
            src="/fever-zone-logo.svg" 
            alt="Fever Zone" 
            className="header__logo-img"
          />
        </a>
      </div>
      
      <div className="header__right">
        <button className="header__create-btn">
          Create event
        </button>
        <button 
          className={`header__user-menu ${guideOpen ? 'header__user-menu--guide-active' : ''}`}
          onClick={onToggleGuide}
          title="Toggle Product Guide"
        >
          <span className="header__user-info">
            <span className="header__user-name">Andres Clavel</span>
            <span className="header__user-org">Fonck Museum</span>
          </span>
          <i className="fa-regular fa-circle-user header__user-icon"></i>
          <i className={`fa-solid ${guideOpen ? 'fa-xmark' : 'fa-compass'} header__guide-hint`}></i>
        </button>
      </div>
    </header>
  )
}

export default Header
