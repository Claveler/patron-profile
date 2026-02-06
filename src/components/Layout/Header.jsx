import './Header.css'

function Header({ onToggleSidebar }) {
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
        <button className="header__user-menu">
          <span className="header__user-info">
            <span className="header__user-name">Andres Clavel</span>
            <span className="header__user-org">Fever Demo Events</span>
          </span>
          <i className="fa-regular fa-circle-user header__user-icon"></i>
        </button>
      </div>
    </header>
  )
}

export default Header
