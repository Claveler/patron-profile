import './EngagementPanel.css'

const engagementLevels = [
  { id: 'cold', label: 'Cold', icon: 'fa-snowflake' },
  { id: 'cool', label: 'Cool', icon: 'fa-temperature-low' },
  { id: 'warm', label: 'Warm', icon: 'fa-temperature-half' },
  { id: 'hot', label: 'Hot', icon: 'fa-temperature-high' },
  { id: 'on-fire', label: 'On Fire', icon: 'fa-fire-flame-curved' },
]

function EngagementPanel({ engagement }) {
  const currentLevelIndex = engagementLevels.findIndex(l => l.id === engagement.level)

  return (
    <div className="engagement-panel wrapper-card">
      <div className="engagement-panel__header">
        <h4 className="engagement-panel__title">Engagement Level</h4>
      </div>

      {/* Engagement Level Steps */}
      <div className="engagement-panel__levels">
        {engagementLevels.map((level, index) => {
          const isActive = index <= currentLevelIndex
          const isCurrent = index === currentLevelIndex
          const isOnFire = level.id === 'on-fire' && isCurrent
          
          return (
            <div key={level.id} className="engagement-panel__step">
              <div className="engagement-panel__step-icon-wrapper">
                {index > 0 && (
                  <div className={`engagement-panel__step-line engagement-panel__step-line--start ${isActive ? 'engagement-panel__step-line--active' : ''}`}></div>
                )}
                <div className={`engagement-panel__level ${isActive ? 'engagement-panel__level--active' : ''} ${isOnFire ? 'engagement-panel__level--on-fire' : ''}`}>
                  <i className={`fa-solid ${level.icon}`}></i>
                </div>
                {index < engagementLevels.length - 1 && (
                  <div className={`engagement-panel__step-line engagement-panel__step-line--end ${isActive && index < currentLevelIndex ? 'engagement-panel__step-line--active' : ''}`}></div>
                )}
              </div>
              <span className={`engagement-panel__label ${isCurrent ? (isOnFire ? 'engagement-panel__label--on-fire' : 'engagement-panel__label--active') : ''}`}>
                {level.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Visit Stats Section */}
      <div className="engagement-panel__section">
        <div className="engagement-panel__section-header">
          <span className="engagement-panel__section-title">Visits</span>
          <i className="fa-solid fa-circle-info engagement-panel__info-icon"></i>
        </div>
        <div className="engagement-panel__insight-box">
          <div className="engagement-panel__insight-content">
            <span className="engagement-panel__visits">{engagement.visits} visits</span>
            <span className="engagement-panel__last-visit">Last visit: {engagement.lastVisit}</span>
          </div>
          <i className="fa-solid fa-building engagement-panel__venue-icon"></i>
        </div>
      </div>
    </div>
  )
}

export default EngagementPanel
