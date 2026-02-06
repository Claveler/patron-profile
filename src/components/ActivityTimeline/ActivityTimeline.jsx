import { useState } from 'react'
import './ActivityTimeline.css'

// Activity type configurations
const activityTypes = {
  donation: {
    icon: 'fa-hand-holding-dollar',
    title: 'Gift',
    filter: 'gifts'
  },
  membership: {
    icon: 'fa-id-card',
    title: 'Membership',
    filter: 'gifts'
  },
  phone: {
    icon: 'fa-phone',
    title: 'Phone call',
    filter: 'communications'
  },
  email: {
    icon: 'fa-envelope',
    title: 'Email',
    filter: 'communications'
  },
  event: {
    icon: 'fa-building-columns',
    title: 'Attended',
    filter: 'events'
  },
  ticket: {
    icon: 'fa-ticket',
    title: 'Buy ticket',
    filter: 'events'
  },
  note: {
    icon: 'fa-note-sticky',
    title: 'Note Added',
    filter: 'communications'
  }
}

// Format currency
const formatCurrency = (amount) => {
  if (!amount) return null
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

// Format date
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }) + ' - ' + date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

// Mock activity data (combines donations + other activities)
const mockActivities = [
  {
    id: 'act-1',
    type: 'phone',
    description: 'Follow-up after recent donation',
    date: '2025-10-19T11:20:00',
    details: {
      notes: 'Discussed upcoming gala and potential major gift.',
      duration: '15 minutes',
      outcome: 'Positive - will attend gala'
    }
  },
  {
    id: 'act-2',
    type: 'email',
    description: 'Thank-you message after event',
    date: '2025-08-26T10:00:00',
    details: {
      to: 'Anderson Collingwood',
      subject: 'Thank you for joining us at the Impressionism & Light opening',
      attachment: 'exhibition_leaflet.pdf',
      content: `Dear Anderson,

We sincerely appreciate your recent visit! Thank you for choosing us. We hope you enjoy the opening and look forward to serving you again soon.

Best regards,
Liam Johnson`
    }
  },
  {
    id: 'act-3',
    type: 'ticket',
    description: '2x Adult - Picasso and the Portrait',
    date: '2025-08-25T10:50:00',
    amount: 45,
    details: {
      event: 'Picasso and the Portrait',
      quantity: 2,
      ticketType: 'Adult'
    }
  },
  {
    id: 'act-4',
    type: 'event',
    description: 'Opening of Women in Modern Art',
    date: '2025-06-05T13:45:00',
    details: {
      venue: 'Main Gallery',
      guests: 2,
      table: 'VIP Section'
    }
  }
]

function ActivityTimeline({ gifts = [], activities = mockActivities, onAddActivity, onRecordGift }) {
  const [expandedItem, setExpandedItem] = useState(null)
  const [filter, setFilter] = useState('all')
  const [visibleCount, setVisibleCount] = useState(6)

  // Convert gifts to activity format and merge with other activities
  const giftActivities = gifts.map(gift => ({
    id: gift.id,
    type: gift.type === 'membership' ? 'membership' : 'donation',
    description: gift.description,
    date: gift.date,
    amount: gift.amount,
    details: {
      fund: gift.fund,
      campaign: gift.campaign,
      appeal: gift.appeal,
      softCredits: gift.softCredits,
      deductible: gift.deductible,
      benefitsValue: gift.benefitsValue
    }
  }))

  // Merge and sort all activities by date
  const allActivities = [...giftActivities, ...activities].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  )

  // Filter activities
  const filteredActivities = filter === 'all' 
    ? allActivities 
    : allActivities.filter(a => activityTypes[a.type]?.filter === filter)

  // Paginate
  const displayedActivities = filteredActivities.slice(0, visibleCount)
  const hasMore = filteredActivities.length > visibleCount

  const toggleExpand = (id) => {
    setExpandedItem(expandedItem === id ? null : id)
  }

  const handleAddActivity = () => {
    if (onAddActivity) {
      onAddActivity()
    } else {
      alert('This would open a modal to add a new activity.')
    }
  }

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 5)
  }

  return (
    <div className="activity-timeline">
      {/* Header */}
      <div className="activity-timeline__header">
        <h3 className="activity-timeline__title">Recent Activity</h3>
        <div className="activity-timeline__filters">
          <button 
            className={`activity-timeline__filter ${filter === 'all' ? 'activity-timeline__filter--active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`activity-timeline__filter ${filter === 'gifts' ? 'activity-timeline__filter--active' : ''}`}
            onClick={() => setFilter('gifts')}
          >
            Gifts
          </button>
          <button 
            className={`activity-timeline__filter ${filter === 'events' ? 'activity-timeline__filter--active' : ''}`}
            onClick={() => setFilter('events')}
          >
            Events
          </button>
          <button 
            className={`activity-timeline__filter ${filter === 'communications' ? 'activity-timeline__filter--active' : ''}`}
            onClick={() => setFilter('communications')}
          >
            Communications
          </button>
        </div>
        <div className="activity-timeline__actions">
          {onRecordGift && (
            <button className="activity-timeline__record-gift-btn" onClick={onRecordGift}>
              Record Gift
            </button>
          )}
          <button className="activity-timeline__add-btn" onClick={handleAddActivity}>
            Add Activity
          </button>
        </div>
      </div>

      {/* Activity List */}
      <div className="activity-timeline__list">
        {displayedActivities.length === 0 ? (
          <div className="activity-timeline__empty">
            <i className="fa-solid fa-clock-rotate-left"></i>
            <p>No activities found</p>
          </div>
        ) : (
          displayedActivities.map((activity, index) => {
            const typeConfig = activityTypes[activity.type] || { icon: 'fa-circle', title: activity.type }
            const isExpanded = expandedItem === activity.id
            const isLast = index === displayedActivities.length - 1

            return (
              <div 
                key={activity.id} 
                className={`activity-timeline__item ${isExpanded ? 'activity-timeline__item--expanded' : ''}`}
              >
                {/* Timeline connector */}
                <div className="activity-timeline__connector">
                  <div className="activity-timeline__dot">
                    <i className={`fa-solid ${typeConfig.icon}`}></i>
                  </div>
                  {!isLast && <div className="activity-timeline__line"></div>}
                </div>

                {/* Content */}
                <div className="activity-timeline__content">
                  {/* Main row */}
                  <div 
                    className="activity-timeline__row"
                    onClick={() => toggleExpand(activity.id)}
                  >
                    <div className="activity-timeline__text">
                      <span className="activity-timeline__item-title">{typeConfig.title}</span>
                      <span className="activity-timeline__subtitle">{activity.description}</span>
                    </div>
                    <div className="activity-timeline__meta">
                      {activity.amount && (
                        <span className="activity-timeline__amount">{formatCurrency(activity.amount)}</span>
                      )}
                      <span className="activity-timeline__date">{formatDate(activity.date)}</span>
                      <i className={`fa-solid fa-chevron-${isExpanded ? 'up' : 'down'} activity-timeline__chevron`}></i>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="activity-timeline__details">
                      <ActivityDetails activity={activity} />
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Load More */}
      {hasMore && (
        <button className="activity-timeline__load-more" onClick={handleLoadMore}>
          View more activities
        </button>
      )}
    </div>
  )
}

// Component to render type-specific expanded details
function ActivityDetails({ activity }) {
  const { type, details, amount } = activity

  if (!details) return null

  switch (type) {
    case 'donation':
    case 'membership':
      return (
        <div className="activity-details activity-details--donation">
          {details.fund && (
            <div className="activity-details__row">
              <span className="activity-details__label">Fund:</span>
              <span className="activity-details__value">{details.fund.name}</span>
            </div>
          )}
          {details.campaign && (
            <div className="activity-details__row">
              <span className="activity-details__label">Campaign:</span>
              <span className="activity-details__value">{details.campaign.name}</span>
            </div>
          )}
          {details.appeal && (
            <div className="activity-details__row">
              <span className="activity-details__label">Appeal:</span>
              <span className="activity-details__value">{details.appeal.name}</span>
            </div>
          )}
          {details.softCredits && details.softCredits.length > 0 && (
            <div className="activity-details__row">
              <span className="activity-details__label">Soft Credit:</span>
              <span className="activity-details__value">
                {details.softCredits.map(c => `${c.name} (${c.type})`).join(', ')}
              </span>
            </div>
          )}
          {(details.deductible || details.benefitsValue) && (
            <div className="activity-details__tax">
              {details.deductible && (
                <span>Tax Deductible: {formatCurrency(details.deductible)}</span>
              )}
              {details.benefitsValue && (
                <span>Benefits Value: {formatCurrency(details.benefitsValue)}</span>
              )}
            </div>
          )}
        </div>
      )

    case 'email':
      return (
        <div className="activity-details activity-details--email">
          {details.to && (
            <p className="activity-details__field">
              <strong>To:</strong> {details.to}
            </p>
          )}
          {details.subject && (
            <p className="activity-details__field">
              <strong>Subject:</strong> "{details.subject}"
            </p>
          )}
          {details.attachment && (
            <p className="activity-details__field">
              <strong>Attachment:</strong> {details.attachment}
            </p>
          )}
          {details.content && (
            <div className="activity-details__content">
              <strong>Content:</strong>
              <p className="activity-details__email-body">{details.content}</p>
            </div>
          )}
        </div>
      )

    case 'phone':
      return (
        <div className="activity-details activity-details--phone">
          {details.duration && (
            <div className="activity-details__row">
              <span className="activity-details__label">Duration:</span>
              <span className="activity-details__value">{details.duration}</span>
            </div>
          )}
          {details.outcome && (
            <div className="activity-details__row">
              <span className="activity-details__label">Outcome:</span>
              <span className="activity-details__value">{details.outcome}</span>
            </div>
          )}
          {details.notes && (
            <div className="activity-details__notes">
              <strong>Notes:</strong>
              <p>{details.notes}</p>
            </div>
          )}
        </div>
      )

    case 'event':
      return (
        <div className="activity-details activity-details--event">
          {details.venue && (
            <div className="activity-details__row">
              <span className="activity-details__label">Venue:</span>
              <span className="activity-details__value">{details.venue}</span>
            </div>
          )}
          {details.guests && (
            <div className="activity-details__row">
              <span className="activity-details__label">Guests:</span>
              <span className="activity-details__value">{details.guests}</span>
            </div>
          )}
          {details.table && (
            <div className="activity-details__row">
              <span className="activity-details__label">Table/Section:</span>
              <span className="activity-details__value">{details.table}</span>
            </div>
          )}
        </div>
      )

    case 'ticket':
      return (
        <div className="activity-details activity-details--ticket">
          {details.event && (
            <div className="activity-details__row">
              <span className="activity-details__label">Event:</span>
              <span className="activity-details__value">{details.event}</span>
            </div>
          )}
          {details.quantity && (
            <div className="activity-details__row">
              <span className="activity-details__label">Quantity:</span>
              <span className="activity-details__value">{details.quantity}x {details.ticketType}</span>
            </div>
          )}
          {amount && (
            <div className="activity-details__row">
              <span className="activity-details__label">Amount:</span>
              <span className="activity-details__value">{formatCurrency(amount)}</span>
            </div>
          )}
        </div>
      )

    case 'note':
      return (
        <div className="activity-details activity-details--note">
          {details.category && (
            <div className="activity-details__row">
              <span className="activity-details__label">Category:</span>
              <span className="activity-details__value">{details.category}</span>
            </div>
          )}
          {details.note && (
            <div className="activity-details__notes">
              <p>{details.note}</p>
            </div>
          )}
          {details.followUp && (
            <div className="activity-details__row">
              <span className="activity-details__label">Follow-up:</span>
              <span className="activity-details__value">{details.followUp}</span>
            </div>
          )}
        </div>
      )

    default:
      return (
        <div className="activity-details">
          {Object.entries(details).map(([key, value]) => (
            <div key={key} className="activity-details__row">
              <span className="activity-details__label">{key}:</span>
              <span className="activity-details__value">
                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
              </span>
            </div>
          ))}
        </div>
      )
  }
}

export default ActivityTimeline
