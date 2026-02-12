import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatDateTime } from '../../data/patrons'
import { getFundNameById, getCampaignNameById, getAppealNameById, getStaffNameById, getStaffInitialsById } from '../../data/campaigns'
import { getOpportunityById } from '../../data/opportunities'
import { useEpicScope } from '../../hooks/useEpicScope'
import './ActivityTimeline.css'

// Activity type configurations
const activityTypes = {
  'one-time': {
    icon: 'fa-hand-holding-dollar',
    title: 'Donation',
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
    title: 'Buy ticket',
    filter: 'events'
  },
  'buy-fnb': {
    icon: 'fa-bags-shopping',
    title: 'Buy F&B',
    filter: 'events'
  },
  review: {
    icon: 'fa-star',
    title: 'Review',
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
  const { show } = useEpicScope()
  const [expandedItems, setExpandedItems] = useState(new Set())
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const isFull = variant === 'full'
  const [visibleCount, setVisibleCount] = useState(isFull ? 10 : 6)

  // Map gift.type to activity type key
  const getGiftActivityType = (gift) => {
    if (gift.type === 'pledge-payment') return 'pledge-payment'
    if (gift.type === 'recurring') return 'recurring'
    if (gift.type === 'membership') return 'membership'
    return 'one-time'
  }

  // Convert gifts to activity format and merge with other activities
  const showFund = show('timeline.fundAttribution')
  const showCampaign = show('timeline.campaignAttribution')
  const giftActivities = gifts.map(gift => ({
    id: gift.id,
    type: getGiftActivityType(gift),
    description: gift.description,
    date: gift.date,
    amount: gift.amount,
    _originalGift: gift,
    details: {
      fund: showFund && gift.fundId ? { id: gift.fundId, name: getFundNameById(gift.fundId) } : null,
      campaign: showCampaign && gift.campaignId ? { id: gift.campaignId, name: getCampaignNameById(gift.campaignId) } : null,
      appeal: showCampaign && gift.appealId ? { id: gift.appealId, name: getAppealNameById(gift.campaignId, gift.appealId) } : null,
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

  // Filter activities by category
  const categoryFiltered = filter === 'all' 
    ? allActivities 
    : allActivities.filter(a => activityTypes[a.type]?.filter === filter)

  // Filter activities by search query
  const filteredActivities = searchQuery.trim()
    ? categoryFiltered.filter(a => {
        const query = searchQuery.toLowerCase()
        const typeConfig = activityTypes[a.type]
        const title = typeConfig?.title?.toLowerCase() || ''
        const description = a.description?.toLowerCase() || ''
        return title.includes(query) || description.includes(query)
      })
    : categoryFiltered

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
    setVisibleCount(prev => prev + 10)
  }

  const handleFilterSelect = (selectedFilter) => {
    setFilter(selectedFilter)
    setShowFilters(false)
    setVisibleCount(isFull ? 10 : 6)
  }

  return (
    <div className={`activity-timeline ${isFull ? 'activity-timeline--full' : ''}`}>
      {/* Header - compact variant keeps old style, full variant matches Figma */}
      {isFull ? (
        <>
          <div className="activity-timeline__header">
            <div className="activity-timeline__header-spacer" />
            <button className="activity-timeline__add-btn activity-timeline__add-btn--secondary" onClick={handleAddActivity}>
              Add activity
            </button>
          </div>

          {/* Search and Filters bar */}
          <div className="activity-timeline__search-bar">
            <div className="activity-timeline__search-input-wrapper">
              <i className="fa-solid fa-magnifying-glass activity-timeline__search-icon"></i>
              <input
                type="text"
                className="activity-timeline__search-input"
                placeholder="Search by activity"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setVisibleCount(isFull ? 10 : 6)
                }}
              />
            </div>
            <div className="activity-timeline__filter-actions">
              <div className="activity-timeline__filter-dropdown-wrapper">
                <button
                  className={`activity-timeline__filter-btn ${filter !== 'all' ? 'activity-timeline__filter-btn--active' : ''}`}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <i className="fa-solid fa-sliders"></i>
                  Filters
                  {filter !== 'all' && <span className="activity-timeline__filter-badge">1</span>}
                </button>
                {showFilters && (
                  <div className="activity-timeline__filter-dropdown">
                    <button
                      className={`activity-timeline__filter-option ${filter === 'all' ? 'activity-timeline__filter-option--active' : ''}`}
                      onClick={() => handleFilterSelect('all')}
                    >
                      All activities
                    </button>
                    <button
                      className={`activity-timeline__filter-option ${filter === 'gifts' ? 'activity-timeline__filter-option--active' : ''}`}
                      onClick={() => handleFilterSelect('gifts')}
                    >
                      Gifts
                    </button>
                    <button
                      className={`activity-timeline__filter-option ${filter === 'events' ? 'activity-timeline__filter-option--active' : ''}`}
                      onClick={() => handleFilterSelect('events')}
                    >
                      Events
                    </button>
                    <button
                      className={`activity-timeline__filter-option ${filter === 'communications' ? 'activity-timeline__filter-option--active' : ''}`}
                      onClick={() => handleFilterSelect('communications')}
                    >
                      Communications
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
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
                Record gift
              </button>
            )}
            <button className="activity-timeline__add-btn" onClick={handleAddActivity}>
              Add activity
            </button>
          </div>
        </div>
      )}

      {/* Activity List */}
      <div className="activity-timeline__list">
        {displayedActivities.length === 0 ? (
          <div className="activity-timeline__empty">
            <i className="fa-solid fa-clock-rotate-left"></i>
            <p>{searchQuery ? 'No matching activities found' : 'No activities found'}</p>
          </div>
        ) : (
          displayedActivities.map((activity, index) => {
            const typeConfig = activityTypes[activity.type] || { icon: 'fa-circle', title: activity.type }
            const isExpanded = expandedItems.has(activity.id)
            const isLast = index === displayedActivities.length - 1
            const staffName = activity.staffId ? getStaffNameById(activity.staffId) : null
            const staffInitials = activity.staffId ? getStaffInitialsById(activity.staffId) : null
            const linkedOpportunity = show('timeline.opportunityChip') && activity.opportunityId ? getOpportunityById(activity.opportunityId) : null

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
                      <span className="activity-timeline__date">{formatDate(activity.date)}</span>
                      <i className={`fa-solid fa-chevron-${isExpanded ? 'up' : 'down'} activity-timeline__chevron`}></i>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="activity-timeline__details">
                      {/* Extra context moved from collapsed row */}
                      <div className="activity-details__context">
                        {activity.amount && (
                          <div className="activity-details__row">
                            <span className="activity-details__label">Amount:</span>
                            <span className="activity-details__value activity-details__value--amount">{formatCurrency(activity.amount)}</span>
                          </div>
                        )}
                        {staffName && (
                          <div className="activity-details__row">
                            <span className="activity-details__label">Staff:</span>
                            <span className="activity-details__value">
                              <span className="activity-timeline__staff" data-tooltip={staffName}>
                                {staffInitials}
                              </span>
                              {' '}{staffName}
                            </span>
                          </div>
                        )}
                        {activity.direction && (
                          <div className="activity-details__row">
                            <span className="activity-details__label">Direction:</span>
                            <span className="activity-details__value">
                              <span className={`activity-timeline__direction activity-timeline__direction--${activity.direction}`}>
                                <i className={`fa-solid ${activity.direction === 'outbound' ? 'fa-share' : 'fa-reply'}`}></i>
                              </span>
                              {' '}{activity.direction === 'outbound' ? 'Outbound' : 'Inbound'}
                            </span>
                          </div>
                        )}
                        {linkedOpportunity && (
                          <div className="activity-details__row">
                            <span className="activity-details__label">Opportunity:</span>
                            <span className="activity-details__value">
                              <span
                                className="activity-timeline__opp-chip"
                                onClick={(e) => { e.stopPropagation(); navigate(`/opportunities/${activity.opportunityId}`); }}
                              >
                                <i className="fa-solid fa-bullseye"></i>
                                {linkedOpportunity.name}
                              </span>
                            </span>
                          </div>
                        )}
                        {activity.eventUrl && (
                          <div className="activity-details__row">
                            <span className="activity-details__label">Event:</span>
                            <span className="activity-details__value">
                              <a href={activity.eventUrl} target="_blank" rel="noopener noreferrer" className="activity-details__link" onClick={(e) => e.stopPropagation()}>
                                View on Fever <i className="fa-solid fa-arrow-up-right-from-square activity-details__external-icon"></i>
                              </a>
                            </span>
                          </div>
                        )}
                        {activity.orderId && (
                          <div className="activity-details__row">
                            <span className="activity-details__label">Order ID:</span>
                            <span className="activity-details__value">
                              <a href="/#" className="activity-details__link" onClick={(e) => e.stopPropagation()}>
                                {activity.orderId}
                              </a>
                            </span>
                          </div>
                        )}
                      </div>
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
          Load more activities
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
          {(details.deductible != null || details.benefitsValue != null) && (
            <div className="activity-details__tax">
              {details.deductible != null && (
                <span>Tax Deductible: {formatCurrency(details.deductible)}</span>
              )}
              {details.benefitsValue != null && details.benefitsValue !== 0 && (
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
