import { useState } from 'react'
import './EngagementPanel.css'

const engagementLevels = [
  { id: 'cold', label: 'Cold', icon: 'fa-snowflake' },
  { id: 'cool', label: 'Cool', icon: 'fa-temperature-low' },
  { id: 'warm', label: 'Warm', icon: 'fa-temperature-half' },
  { id: 'hot', label: 'Hot', icon: 'fa-temperature-high' },
  { id: 'on-fire', label: 'On Fire', icon: 'fa-fire-flame-curved' },
]

const activityTypes = {
  donation: { label: 'Donation', icon: 'fa-heart', color: 'var(--color-success)' },
  attendance: { label: 'Visit', icon: 'fa-ticket', color: 'var(--color-primary)' },
  purchase: { label: 'Purchase', icon: 'fa-bag-shopping', color: 'var(--color-warning)' },
  membership: { label: 'Membership', icon: 'fa-id-card', color: 'var(--color-info)' },
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Calculate activity intensity level (0-4) based on activity count and value
const getActivityIntensity = (activities) => {
  if (!activities || activities.length === 0) return 0
  
  const totalCount = activities.reduce((sum, a) => sum + (a.count || 0), 0)
  const hasDonation = activities.some(a => a.type === 'donation')
  const hasMembership = activities.some(a => a.type === 'membership')
  
  // High-value activities (donations, memberships) get higher intensity
  if (hasDonation || hasMembership) {
    return totalCount >= 2 ? 4 : 3
  }
  
  // Regular activities scale by count
  if (totalCount >= 4) return 4
  if (totalCount >= 3) return 3
  if (totalCount >= 2) return 2
  return 1
}

// Format month label for display (e.g., "2025-02" -> "Feb")
const formatMonthShort = (monthStr) => {
  const [year, month] = monthStr.split('-')
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1)
  return date.toLocaleDateString('en-US', { month: 'short' })
}

// Format tooltip header for a specific week
const formatWeekTooltip = (monthStr, weekIndex) => {
  const [year, month] = monthStr.split('-')
  const monthName = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1)
    .toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  return `${monthName}, Week ${weekIndex + 1}`
}

function EngagementPanel({ engagement }) {
  const [hoveredWeek, setHoveredWeek] = useState(null)
  // Default to gauge view if no activity history (for General Constituents with basic data)
  const hasActivityHistory = engagement?.activityHistory && engagement.activityHistory.length > 0
  const [viewMode, setViewMode] = useState(hasActivityHistory ? 'heatmap' : 'gauge') // 'gauge' | 'heatmap'
  
  // Handle missing engagement data
  if (!engagement) {
    return (
      <div className="engagement-panel wrapper-card">
        <div className="engagement-panel__empty">
          <i className="fa-solid fa-chart-simple"></i>
          <p>No engagement data available</p>
        </div>
      </div>
    )
  }
  
  const currentLevelIndex = engagementLevels.findIndex(l => l.id === engagement.level)
  const currentLevel = engagementLevels[currentLevelIndex] || engagementLevels[0]

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'gauge' ? 'heatmap' : 'gauge')
  }

  return (
    <div className="engagement-panel wrapper-card">
      {/* View Mode Toggle - Only show if activity history exists */}
      {hasActivityHistory && (
        <div className="engagement-panel__view-toggle">
          <button 
            className={`engagement-panel__toggle-btn ${viewMode === 'gauge' ? 'engagement-panel__toggle-btn--active' : ''}`}
            onClick={toggleViewMode}
            title={viewMode === 'gauge' ? 'Switch to heatmap view' : 'Switch to gauge view'}
          >
            <i className={`fa-solid ${viewMode === 'gauge' ? 'fa-table-cells' : 'fa-chart-simple'}`}></i>
          </button>
        </div>
      )}
      {/* === GAUGE VIEW === */}
      {viewMode === 'gauge' && (
        <>
          {/* Engagement Level Section */}
          <div className="engagement-panel__section engagement-panel__section--engagement engagement-panel__section--first">
            <div className="engagement-panel__section-header">
              <span className="engagement-panel__section-title">Engagement Level</span>
            </div>
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
        </>
      )}

      {/* === HEATMAP VIEW === */}
      {viewMode === 'heatmap' && engagement.activityHistory && (
        <div className="engagement-panel__section engagement-panel__section--activity engagement-panel__section--first">
          <div className="engagement-panel__section-header">
            <div className="engagement-panel__activity-title-row">
              <span className="engagement-panel__section-title">Activity</span>
              <span 
                className={`engagement-panel__engagement-badge engagement-panel__engagement-badge--${engagement.level}`}
                data-tooltip="Engagement level: Based on activity frequency and recency"
              >
                <i className={`fa-solid ${currentLevel?.icon}`}></i>
                {currentLevel?.label}
              </span>
            </div>
            <span className="engagement-panel__activity-period">Trailing 12 months</span>
          </div>
          <div className="engagement-panel__activity-graph">
            {/* Month Labels Row */}
            <div className="engagement-panel__activity-months">
              {engagement.activityHistory.map((monthData) => (
                <span key={monthData.month} className="engagement-panel__activity-month-label">
                  {formatMonthShort(monthData.month)}
                </span>
              ))}
            </div>
            
            {/* 4 Rows (one per week of month) × 12 Columns (months) */}
            <div className="engagement-panel__activity-matrix">
              {[0, 1, 2, 3].map((weekIndex) => (
                <div key={weekIndex} className="engagement-panel__activity-row">
                  {engagement.activityHistory.map((monthData, monthIndex) => {
                    const weekData = monthData.weeks[weekIndex]
                    const intensity = getActivityIntensity(weekData?.activities || [])
                    const cellKey = `${monthData.month}-w${weekIndex}`
                    const totalActivities = (weekData?.activities || []).reduce((sum, a) => sum + (a.count || 0), 0)
                    
                    return (
                      <div 
                        key={cellKey}
                        className={`engagement-panel__activity-cell engagement-panel__activity-cell--level-${intensity}`}
                        onMouseEnter={() => setHoveredWeek(cellKey)}
                        onMouseLeave={() => setHoveredWeek(null)}
                      >
                        {hoveredWeek === cellKey && weekData?.activities?.length > 0 && (
                          <div className="engagement-panel__activity-tooltip">
                            <div className="engagement-panel__tooltip-header">
                              {formatWeekTooltip(monthData.month, weekIndex)}
                            </div>
                            {weekData.activities.map((activity, aIdx) => (
                              <div key={aIdx} className="engagement-panel__tooltip-item">
                                <i className={`fa-solid ${activityTypes[activity.type]?.icon}`}></i>
                                <span>{activity.count} {activityTypes[activity.type]?.label}{activity.count > 1 ? 's' : ''}</span>
                                {activity.value && <span className="engagement-panel__tooltip-value">{formatCurrency(activity.value)}</span>}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="engagement-panel__activity-legend">
              <span className="engagement-panel__activity-legend-label">Less</span>
              <div className="engagement-panel__activity-cell engagement-panel__activity-cell--level-0 engagement-panel__activity-cell--legend"></div>
              <div className="engagement-panel__activity-cell engagement-panel__activity-cell--level-1 engagement-panel__activity-cell--legend"></div>
              <div className="engagement-panel__activity-cell engagement-panel__activity-cell--level-2 engagement-panel__activity-cell--legend"></div>
              <div className="engagement-panel__activity-cell engagement-panel__activity-cell--level-3 engagement-panel__activity-cell--legend"></div>
              <div className="engagement-panel__activity-cell engagement-panel__activity-cell--level-4 engagement-panel__activity-cell--legend"></div>
              <span className="engagement-panel__activity-legend-label">More</span>
            </div>
          </div>
          
          {/* Explanation text */}
          <p className="engagement-panel__activity-explanation">
            <i className="fa-solid fa-circle-info"></i>
            Patron-initiated activity (donations, visits, purchases) from the last 12 months.
          </p>
        </div>
      )}
    </div>
  )
}

export default EngagementPanel
