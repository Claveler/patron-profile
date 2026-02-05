import { useState } from 'react'
import './PerksUsage.css'

const perkIcons = {
  'free-admission': 'fa-ticket',
  'discounted-tickets': 'fa-percent',
  'member-only-events': 'fa-calendar-star',
  'default': 'fa-gift'
}

function PerksUsage({ perks }) {
  const [expandedItems, setExpandedItems] = useState({})
  
  const toggleItem = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }
  
  const getIcon = (type) => {
    return perkIcons[type] || perkIcons['default']
  }
  
  return (
    <div className="perks-usage wrapper-card">
      <div className="perks-usage__header">
        <h4 className="perks-usage__title">Perks usage</h4>
      </div>
      
      <div className="perks-usage__content">
        <div className="perks-usage__timeline">
          {perks.map((perk, index) => (
            <div key={index} className="perks-usage__item">
              <div className="perks-usage__timeline-marker">
                <div className="perks-usage__icon-circle">
                  <i className={`fa-solid ${getIcon(perk.type)}`}></i>
                </div>
                {index < perks.length - 1 && (
                  <div className="perks-usage__timeline-line"></div>
                )}
              </div>
              
              <div className="perks-usage__item-content">
                <div className="perks-usage__item-main">
                  <div className="perks-usage__item-info">
                    <span className="perks-usage__item-title">{perk.title}</span>
                    <span className="perks-usage__item-event">{perk.event}</span>
                  </div>
                  <div className="perks-usage__item-actions">
                    <span className="perks-usage__item-date">{perk.date}</span>
                    <button 
                      className="perks-usage__item-toggle"
                      onClick={() => toggleItem(index)}
                    >
                      <i className={`fa-solid fa-chevron-${expandedItems[index] ? 'up' : 'down'}`}></i>
                    </button>
                  </div>
                </div>
                
                {expandedItems[index] && (
                  <div className="perks-usage__item-details">
                    <p className="perks-usage__item-description">
                      Perk applied for {perk.event}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="perks-usage__footer">
        <a href="#" className="perks-usage__link">
          View more activities
        </a>
      </div>
    </div>
  )
}

export default PerksUsage
