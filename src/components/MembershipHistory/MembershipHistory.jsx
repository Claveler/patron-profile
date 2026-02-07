import { formatDate } from '../../data/patrons'
import './MembershipHistory.css'

// Event type icons and colors
const eventConfig = {
  'Joined': { icon: 'fa-user-plus', color: 'success' },
  'Upgraded': { icon: 'fa-arrow-up', color: 'primary' },
  'Downgraded': { icon: 'fa-arrow-down', color: 'warning' },
  'Renewed': { icon: 'fa-rotate', color: 'success' },
  'Cancelled': { icon: 'fa-xmark', color: 'error' },
  'Lapsed': { icon: 'fa-clock', color: 'warning' },
  'Reactivated': { icon: 'fa-play', color: 'success' },
  'default': { icon: 'fa-circle', color: 'neutral' }
}

function MembershipHistory({ history }) {
  if (!history || history.length === 0) return null
  
  // Sort by date descending (most recent first)
  const sortedHistory = [...history].sort((a, b) => new Date(b.date) - new Date(a.date))
  
  const getEventConfig = (event) => eventConfig[event] || eventConfig.default
  
  // formatDate imported from shared utility
  
  // Calculate membership tenure
  const getYearsAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffYears = Math.floor((now - date) / (365.25 * 24 * 60 * 60 * 1000))
    if (diffYears === 0) return 'This year'
    if (diffYears === 1) return '1 year ago'
    return `${diffYears} years ago`
  }
  
  return (
    <div className="membership-history wrapper-card">
      <div className="membership-history__header">
        <h4 className="membership-history__title">Membership History</h4>
      </div>
      
      <div className="membership-history__timeline">
        {sortedHistory.map((item, index) => {
          const config = getEventConfig(item.event)
          const isLast = index === sortedHistory.length - 1
          
          return (
            <div key={index} className="membership-history__item">
              {/* Timeline connector */}
              <div className="membership-history__connector">
                <div className={`membership-history__dot membership-history__dot--${config.color}`}>
                  <i className={`fa-solid ${config.icon}`}></i>
                </div>
                {!isLast && <div className="membership-history__line" />}
              </div>
              
              {/* Event content */}
              <div className="membership-history__content">
                <div className="membership-history__event-header">
                  <span className={`membership-history__event membership-history__event--${config.color}`}>
                    {item.event}
                  </span>
                  <span className="membership-history__tier">{item.tier}</span>
                </div>
                <span className="membership-history__programme">{item.programme}</span>
                <div className="membership-history__date">
                  <span>{formatDate(item.date)}</span>
                  <span className="membership-history__ago">{getYearsAgo(item.date)}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MembershipHistory
