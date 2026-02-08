import { useState } from 'react'
import { formatDate } from '../../data/patrons'
import './MemberEvents.css'

function MemberEvents({ events }) {
  const [activeFilter, setActiveFilter] = useState('all')
  
  if (!events) return null
  
  const { earlyAccess = [], memberOnly = [] } = events
  
  // Combine and sort all events
  const allEvents = [
    ...earlyAccess.map(e => ({ ...e, type: 'early-access' })),
    ...memberOnly.map(e => ({ ...e, type: 'member-only' }))
  ].sort((a, b) => new Date(a.date) - new Date(b.date))
  
  // Filter events based on active filter
  const filteredEvents = activeFilter === 'all' 
    ? allEvents 
    : allEvents.filter(e => e.type === activeFilter)
  
  // Get days until event (returns number for urgency calculation)
  const getDaysUntilRaw = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    return Math.ceil((date - now) / (24 * 60 * 60 * 1000))
  }
  
  // Get display label for countdown
  const getDaysUntilLabel = (days) => {
    if (days < 0) return 'Past'
    if (days === 0) return 'Today'
    if (days === 1) return 'Tomorrow'
    return `In ${days} days`
  }
  
  // Get urgency class based on days remaining
  const getUrgencyClass = (days) => {
    if (days < 0) return 'member-events__countdown--past'
    if (days <= 14) return 'member-events__countdown--soon'
    if (days <= 30) return 'member-events__countdown--near'
    return ''
  }
  
  // Get access status for early access events
  const getAccessStatus = (event) => {
    if (event.type !== 'early-access') return null
    
    const now = new Date()
    const memberAccess = new Date(event.memberAccess)
    const publicAccess = event.publicAccess ? new Date(event.publicAccess) : null
    
    if (now < memberAccess) {
      const days = Math.ceil((memberAccess - now) / (24 * 60 * 60 * 1000))
      return { status: 'upcoming', label: `Early access in ${days} days` }
    }
    
    if (publicAccess && now < publicAccess) {
      return { status: 'unlocked', label: 'Member access open' }
    }
    
    return { status: 'public', label: 'Public sale live' }
  }
  
  return (
    <div className="member-events wrapper-card">
      <div className="member-events__header">
        <h4 className="member-events__title">Member Events</h4>
        <span className="member-events__count">{allEvents.length} events</span>
      </div>
      
      {/* Filter Tabs */}
      <div className="member-events__filters">
        <button 
          className={`member-events__filter ${activeFilter === 'all' ? 'member-events__filter--active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All ({allEvents.length})
        </button>
        <button 
          className={`member-events__filter ${activeFilter === 'early-access' ? 'member-events__filter--active' : ''}`}
          onClick={() => setActiveFilter('early-access')}
        >
          Early Access ({earlyAccess.length})
        </button>
        <button 
          className={`member-events__filter ${activeFilter === 'member-only' ? 'member-events__filter--active' : ''}`}
          onClick={() => setActiveFilter('member-only')}
        >
          Exclusive ({memberOnly.length})
        </button>
      </div>
      
      {/* Events Grid */}
      <div className="member-events__list">
        {filteredEvents.length === 0 ? (
          <p className="member-events__empty">No events in this category</p>
        ) : (
          filteredEvents.map((event) => {
            const accessStatus = getAccessStatus(event)
            const daysUntil = getDaysUntilRaw(event.date)
            
            return (
              <div key={event.id} className="member-events__item">
                {/* Image Banner */}
                <div className="member-events__image">
                  {event.image ? (
                    <img src={event.image.replace(/w=100&h=60/, 'w=400&h=240')} alt={event.name} />
                  ) : (
                    <div className="member-events__image-placeholder">
                      <i className="fa-solid fa-calendar"></i>
                    </div>
                  )}
                  
                  {/* Type Badge */}
                  <span className={`member-events__type-badge member-events__type-badge--${event.type}`}>
                    {event.type === 'member-only' ? (
                      <>
                        <i className="fa-solid fa-star"></i>
                        Exclusive
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-bolt"></i>
                        Early Access
                      </>
                    )}
                  </span>
                </div>
                
                {/* Event Details */}
                <div className="member-events__details">
                  <h5 className="member-events__name">
                    {event.eventUrl ? (
                      <a
                        href={event.eventUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="member-events__name-link"
                      >
                        {event.name} <i className="fa-solid fa-arrow-up-right-from-square member-events__external-icon"></i>
                      </a>
                    ) : (
                      event.name
                    )}
                  </h5>
                  
                  <div className="member-events__meta">
                    <span className="member-events__date">
                      <i className="fa-regular fa-calendar"></i>
                      {formatDate(event.date)}
                    </span>
                    <span className={`member-events__countdown ${getUrgencyClass(daysUntil)}`}>
                      {getDaysUntilLabel(daysUntil)}
                    </span>
                  </div>
                  
                  {/* Access Status for Early Access events */}
                  {accessStatus && (
                    <div className={`member-events__access member-events__access--${accessStatus.status}`}>
                      {accessStatus.status === 'unlocked' && <i className="fa-solid fa-unlock"></i>}
                      {accessStatus.status === 'upcoming' && <i className="fa-solid fa-hourglass-half"></i>}
                      {accessStatus.status === 'public' && <i className="fa-solid fa-globe"></i>}
                      {accessStatus.label}
                    </div>
                  )}
                  
                  {/* Access Timeline Stepper for Early Access events */}
                  {event.type === 'early-access' && event.publicAccess && (
                    <div className="member-events__timeline">
                      <div className="member-events__step member-events__step--member">
                        <div className="member-events__step-dot" />
                        <span className="member-events__step-label">Member</span>
                        <span className="member-events__step-date">{formatDate(event.memberAccess)}</span>
                      </div>
                      <div className="member-events__step-line" />
                      <div className="member-events__step member-events__step--public">
                        <div className="member-events__step-dot" />
                        <span className="member-events__step-label">Public</span>
                        <span className="member-events__step-date">{formatDate(event.publicAccess)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default MemberEvents
