import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatDateTime } from '../../data/patrons'
import { getFundNameById, getCampaignNameById, getAppealNameById, getStaffNameById, getStaffInitialsById } from '../../data/campaigns'
import { getOpportunityById } from '../../data/opportunities'
import './ActivityTimeline.css'

// Activity type configurations
const activityTypes = {
  'one-time': {
    icon: 'fa-hand-holding-dollar',
    title: 'Gift',
    filter: 'gifts'
  },
  membership: {
    icon: 'fa-id-card',
    title: 'Membership',
    filter: 'gifts'
  },
  'pledge-payment': {
    icon: 'fa-file-invoice-dollar',
    title: 'Pledge Payment',
    filter: 'gifts'
  },
  recurring: {
    icon: 'fa-rotate',
    title: 'Recurring Gift',
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
  meeting: {
    icon: 'fa-handshake',
    title: 'Meeting',
    filter: 'communications'
  },
  event: {
    icon: 'fa-building-columns',
    title: 'Attended',
    filter: 'events'
  },
  ticket: {
    icon: 'fa-ticket',
    title: 'Ticket Purchase',
    filter: 'events'
  },
  note: {
    icon: 'fa-note-sticky',
    title: 'Note Added',
    filter: 'communications'
  },
  letter: {
    icon: 'fa-envelope-open-text',
    title: 'Letter',
    filter: 'communications'
  },
  visit: {
    icon: 'fa-door-open',
    title: 'Visit',
    filter: 'events'
  },
  task: {
    icon: 'fa-list-check',
    title: 'Task',
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

// Format date - use shared utility
const formatDate = formatDateTime

function ActivityTimeline({ gifts = [], activities = [], onAddActivity, onRecordGift, onGiftSelect, variant }) {
  const navigate = useNavigate()
  const [expandedItems, setExpandedItems] = useState(new Set())
  const [filter, setFilter] = useState('all')
  const isFull = variant === 'full'
  const [visibleCount, setVisibleCount] = useState(isFull ? 20 : 6)

  // Map gift.type to activity type key
  const getGiftActivityType = (gift) => {
    if (gift.type === 'pledge-payment') return 'pledge-payment'
    if (gift.type === 'recurring') return 'recurring'
    if (gift.type === 'membership') return 'membership'
    return 'one-time'
  }

  // Convert gifts to activity format and merge with other activities
  const giftActivities = gifts.map(gift => ({
    id: gift.id,
    type: getGiftActivityType(gift),
    description: gift.description,
    date: gift.date,
    amount: gift.amount,
    _originalGift: gift,
    details: {
      fund: gift.fundId ? { id: gift.fundId, name: getFundNameById(gift.fundId) } : null,
      campaign: gift.campaignId ? { id: gift.campaignId, name: getCampaignNameById(gift.campaignId) } : null,
      appeal: gift.appealId ? { id: gift.appealId, name: getAppealNameById(gift.campaignId, gift.appealId) } : null,
      softCredits: gift.softCredits,
      deductible: gift.deductible,
      benefitsValue: gift.benefitsValue,
      pledgeId: gift.pledgeId,
      recurringProfileId: gift.recurringProfileId,
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
    setExpandedItems(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
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
    <div className={`activity-timeline ${isFull ? 'activity-timeline--full' : ''}`}>
      {/* Header */}
      <div className="activity-timeline__header">
        <h3 className="activity-timeline__title">{isFull ? 'Activity Timeline' : 'Recent Activity'}</h3>
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
              Record gift
            </button>
          )}
          <button className="activity-timeline__add-btn" onClick={handleAddActivity}>
            Add activity
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
            const isExpanded = expandedItems.has(activity.id)
            const isLast = index === displayedActivities.length - 1
            const staffName = activity.staffId ? getStaffNameById(activity.staffId) : null
            const staffInitials = activity.staffId ? getStaffInitialsById(activity.staffId) : null
            const linkedOpportunity = activity.opportunityId ? getOpportunityById(activity.opportunityId) : null

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
                      <div className="activity-timeline__title-row">
                        <span className="activity-timeline__item-title">{typeConfig.title}</span>
                        {activity.direction && (
                          <span className={`activity-timeline__direction activity-timeline__direction--${activity.direction}`} title={activity.direction === 'outbound' ? 'Outbound' : 'Inbound'}>
                            <i className={`fa-solid ${activity.direction === 'outbound' ? 'fa-share' : 'fa-reply'}`}></i>
                          </span>
                        )}
                        {linkedOpportunity && (
                          <span
                            className="activity-timeline__opp-chip"
                            title={`Linked to: ${linkedOpportunity.name}`}
                            onClick={(e) => { e.stopPropagation(); navigate(`/opportunities/${activity.opportunityId}`); }}
                          >
                            <i className="fa-solid fa-bullseye"></i>
                            {linkedOpportunity.name}
                          </span>
                        )}
                      </div>
                      {activity.eventUrl ? (
                        <a
                          href={activity.eventUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="activity-timeline__subtitle activity-timeline__event-link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {activity.description} <i className="fa-solid fa-arrow-up-right-from-square activity-timeline__external-icon"></i>
                        </a>
                      ) : (
                        <span className="activity-timeline__subtitle">{activity.description}</span>
                      )}
                      {activity.orderId && (
                        <a href="/#" className="activity-timeline__order-id" onClick={(e) => e.stopPropagation()}>
                          {activity.orderId}
                        </a>
                      )}
                    </div>
                    <div className="activity-timeline__meta">
                      {activity.amount && (
                        <span className="activity-timeline__amount">{formatCurrency(activity.amount)}</span>
                      )}
                      {staffName && (
                        <span className="activity-timeline__staff" data-tooltip={staffName}>
                          {staffInitials}
                        </span>
                      )}
                      <span className="activity-timeline__date">{formatDate(activity.date)}</span>
                      <i className={`fa-solid fa-chevron-${isExpanded ? 'up' : 'down'} activity-timeline__chevron`}></i>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="activity-timeline__details">
                      <ActivityDetails activity={activity} onGiftSelect={onGiftSelect} />
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
function ActivityDetails({ activity, onGiftSelect }) {
  const { type, details, amount, eventUrl, orderId } = activity

  if (!details) return null

  switch (type) {
    case 'one-time':
    case 'membership':
    case 'pledge-payment':
    case 'recurring':
      return (
        <div className="activity-details activity-details--gift">
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
          {onGiftSelect && activity._originalGift && (
            <button
              className="activity-details__view-full"
              onClick={(e) => { e.stopPropagation(); onGiftSelect(activity._originalGift); }}
            >
              <i className="fa-solid fa-arrow-up-right-from-square"></i>
              View full details
            </button>
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
    case 'meeting':
      return (
        <div className="activity-details activity-details--phone">
          {details.location && (
            <div className="activity-details__row">
              <span className="activity-details__label">Location:</span>
              <span className="activity-details__value">{details.location}</span>
            </div>
          )}
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
          {activity.orderId && (
            <div className="activity-details__row">
              <span className="activity-details__label">Order ID:</span>
              <span className="activity-details__value">
                <a href="/#" className="activity-details__link">{activity.orderId}</a>
              </span>
            </div>
          )}
          {activity.eventUrl && (
            <div className="activity-details__row">
              <span className="activity-details__label">Event:</span>
              <span className="activity-details__value">
                <a href={activity.eventUrl} target="_blank" rel="noopener noreferrer" className="activity-details__link">
                  View on Fever <i className="fa-solid fa-arrow-up-right-from-square activity-details__external-icon"></i>
                </a>
              </span>
            </div>
          )}
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
          {activity.orderId && (
            <div className="activity-details__row">
              <span className="activity-details__label">Order ID:</span>
              <span className="activity-details__value">
                <a href="/#" className="activity-details__link">{activity.orderId}</a>
              </span>
            </div>
          )}
          {details.event && (
            <div className="activity-details__row">
              <span className="activity-details__label">Event:</span>
              <span className="activity-details__value">
                {activity.eventUrl ? (
                  <a href={activity.eventUrl} target="_blank" rel="noopener noreferrer" className="activity-details__link">
                    {details.event} <i className="fa-solid fa-arrow-up-right-from-square activity-details__external-icon"></i>
                  </a>
                ) : (
                  details.event
                )}
              </span>
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
