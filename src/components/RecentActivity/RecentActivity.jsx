import { useState } from 'react'
import './RecentActivity.css'

const activities = [
  {
    id: 1,
    type: 'donation',
    icon: 'fa-hand-holding-heart',
    title: 'Donation Received',
    description: 'Annual Fund contribution',
    amount: '$2,500.00',
    date: 'Dec 15, 2024',
    time: '2:30 PM',
    details: {
      fund: 'Annual Fund',
      campaign: 'Year-End Giving 2024',
      paymentMethod: 'Credit Card',
      receiptNumber: 'RCP-2024-12345'
    }
  },
  {
    id: 2,
    type: 'event',
    icon: 'fa-calendar-star',
    title: 'Event Attended',
    description: 'Winter Gala 2024',
    date: 'Dec 10, 2024',
    time: '7:00 PM',
    details: {
      venue: 'Grand Ballroom',
      tableNumber: '12',
      guests: 2,
      mealPreference: 'Vegetarian'
    }
  },
  {
    id: 3,
    type: 'communication',
    icon: 'fa-envelope-open',
    title: 'Email Opened',
    description: 'Year-End Appeal Newsletter',
    date: 'Dec 5, 2024',
    time: '9:15 AM',
    details: {
      campaign: 'Year-End Appeal',
      subject: 'Your impact in 2024',
      clickedLinks: 3
    }
  },
  {
    id: 4,
    type: 'membership',
    icon: 'fa-id-card',
    title: 'Membership Renewed',
    description: 'Patron Level membership',
    amount: '$1,000.00',
    date: 'Nov 1, 2024',
    time: '10:00 AM',
    details: {
      level: 'Patron',
      validUntil: 'Oct 31, 2025',
      benefits: ['VIP Events', 'Early Access', 'Newsletter']
    }
  },
  {
    id: 5,
    type: 'note',
    icon: 'fa-note-sticky',
    title: 'Note Added',
    description: 'Discussed major gift opportunity',
    author: 'John Smith',
    date: 'Oct 20, 2024',
    time: '3:45 PM',
    details: {
      note: 'Sarah expressed interest in supporting the new building project. Follow up in Q1 2025 with proposal.',
      category: 'Major Gifts',
      followUp: 'Jan 15, 2025'
    }
  },
  {
    id: 6,
    type: 'donation',
    icon: 'fa-hand-holding-heart',
    title: 'Donation Received',
    description: 'Building Fund contribution',
    amount: '$5,000.00',
    date: 'Sep 15, 2024',
    time: '11:30 AM',
    details: {
      fund: 'Building Fund',
      campaign: 'Capital Campaign',
      paymentMethod: 'Check',
      receiptNumber: 'RCP-2024-11234'
    }
  }
]

function RecentActivity() {
  const [expandedItem, setExpandedItem] = useState(null)
  const [filter, setFilter] = useState('all')

  const getTypeColor = (type) => {
    switch (type) {
      case 'donation':
        return 'var(--color-success)'
      case 'event':
        return 'var(--color-primary)'
      case 'communication':
        return 'var(--color-info)'
      case 'membership':
        return 'var(--color-warning)'
      case 'note':
        return 'var(--color-text-secondary)'
      default:
        return 'var(--color-text-muted)'
    }
  }

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(a => a.type === filter)

  return (
    <div className="recent-activity">
      <div className="recent-activity__header">
        <h3 className="recent-activity__title">Recent Activity</h3>
        <div className="recent-activity__filters">
          <button 
            className={`recent-activity__filter ${filter === 'all' ? 'recent-activity__filter--active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`recent-activity__filter ${filter === 'donation' ? 'recent-activity__filter--active' : ''}`}
            onClick={() => setFilter('donation')}
          >
            Donations
          </button>
          <button 
            className={`recent-activity__filter ${filter === 'event' ? 'recent-activity__filter--active' : ''}`}
            onClick={() => setFilter('event')}
          >
            Events
          </button>
          <button 
            className={`recent-activity__filter ${filter === 'communication' ? 'recent-activity__filter--active' : ''}`}
            onClick={() => setFilter('communication')}
          >
            Communications
          </button>
        </div>
      </div>

      <div className="recent-activity__timeline">
        {filteredActivities.map((activity, index) => (
          <div 
            key={activity.id}
            className={`recent-activity__item ${expandedItem === activity.id ? 'recent-activity__item--expanded' : ''}`}
            onClick={() => setExpandedItem(expandedItem === activity.id ? null : activity.id)}
          >
            {/* Timeline connector */}
            <div className="recent-activity__connector">
              <div 
                className="recent-activity__dot"
                style={{ '--dot-color': getTypeColor(activity.type) }}
              >
                <i className={`fa-solid ${activity.icon}`}></i>
              </div>
              {index < filteredActivities.length - 1 && (
                <div className="recent-activity__line"></div>
              )}
            </div>

            {/* Content */}
            <div className="recent-activity__content">
              <div className="recent-activity__item-header">
                <div className="recent-activity__item-info">
                  <span className="recent-activity__item-title">{activity.title}</span>
                  <span className="recent-activity__item-description">{activity.description}</span>
                </div>
                <div className="recent-activity__item-meta">
                  {activity.amount && (
                    <span className="recent-activity__item-amount">{activity.amount}</span>
                  )}
                  <span className="recent-activity__item-date">{activity.date}</span>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedItem === activity.id && activity.details && (
                <div className="recent-activity__details">
                  <div className="recent-activity__details-grid">
                    {Object.entries(activity.details).map(([key, value]) => (
                      <div key={key} className="recent-activity__detail-item">
                        <span className="recent-activity__detail-label">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                        <span className="recent-activity__detail-value">
                          {Array.isArray(value) ? value.join(', ') : value}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="recent-activity__details-actions">
                    <button className="recent-activity__detail-action">
                      <i className="fa-solid fa-eye"></i>
                      View Details
                    </button>
                    <button className="recent-activity__detail-action">
                      <i className="fa-solid fa-print"></i>
                      Print
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <button className="recent-activity__load-more">
        <i className="fa-solid fa-arrow-down"></i>
        Load More Activity
      </button>
    </div>
  )
}

export default RecentActivity
