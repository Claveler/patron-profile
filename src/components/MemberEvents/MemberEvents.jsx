import { useState } from 'react'
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
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }
  
  // Get days until event
  const getDaysUntil = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.ceil((date - now) / (24 * 60 * 60 * 1000))
    if (diffDays < 0) return 'Past'
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    return `In ${diffDays} days`
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
        <h4 className="member-events__title">
          <i className="fa-solid fa-calendar-star"></i>
          Member Events
        </h4>
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
      
      {/* Events List */}
      <div className="member-events__list">
        {filteredEvents.length === 0 ? (
          <p className="member-events__empty">No events in this category</p>
        ) : (
          filteredEvents.map((event) => {
            const accessStatus = getAccessStatus(event)
            
            return (
              <div key={event.id} className="member-events__item">
                {/* Event Image */}
                <div className="member-events__image">
                  {event.image ? (
                    <img src={event.image} alt={event.name} />
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
                        <i className="fa-solid fa-clock"></i>
                        Early Access
                      </>
                    )}
                  </span>
                </div>
                
                {/* Event Details */}
                <div className="member-events__details">
                  <h5 className="member-events__name">{event.name}</h5>
                  
                  <div className="member-events__meta">
                    <span className="member-events__date">
                      <i className="fa-regular fa-calendar"></i>
                      {formatDate(event.date)}
                    </span>
                    <span className="member-events__countdown">
                      {getDaysUntil(event.date)}
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
                  
                  {/* Access Timeline for Early Access events */}
                  {event.type === 'early-access' && event.publicAccess && (
                    <div className="member-events__timeline">
                      <div className="member-events__timeline-item member-events__timeline-item--member">
                        <span className="member-events__timeline-label">Member access</span>
                        <span className="member-events__timeline-date">{formatDate(event.memberAccess)}</span>
                      </div>
                      <div className="member-events__timeline-arrow">
                        <i className="fa-solid fa-arrow-right"></i>
                      </div>
                      <div className="member-events__timeline-item member-events__timeline-item--public">
                        <span className="member-events__timeline-label">Public access</span>
                        <span className="member-events__timeline-date">{formatDate(event.publicAccess)}</span>
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
