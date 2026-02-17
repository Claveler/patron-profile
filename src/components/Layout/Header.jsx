import { useContext } from 'react'
import { GuideContext } from '../../App'
import { EPIC_LABELS } from '../../data/epicScope'
import './Header.css'

function Header({ onToggleSidebar, onToggleGuide, guideOpen }) {
  const { activeEpic, setActiveEpic } = useContext(GuideContext)

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

      {/* Phase Scope Stepper */}
      <nav className="header__stepper" aria-label="Phase scope selector">
        {EPIC_LABELS.map((step) => {
          const isActive = activeEpic === step.value
          const isCompleted = step.value < activeEpic && !isActive
          return (
            <button
              key={step.label}
              className={[
                'header__step',
                isActive && 'header__step--active',
                isCompleted && 'header__step--completed',
              ].filter(Boolean).join(' ')}
              onClick={() => setActiveEpic(step.value)}
              title={`${step.label}: ${step.subtitle}`}
            >
              <span className="header__step-label">{step.label}</span>
              <span className="header__step-subtitle">{step.subtitle}</span>
            </button>
          )
        })}
      </nav>
      
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
