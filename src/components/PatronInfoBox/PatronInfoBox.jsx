import { useState } from 'react'
import './PatronInfoBox.css'

function PatronInfoBox({ patron }) {
  const [actionsOpen, setActionsOpen] = useState(false)

  return (
    <div className="patron-info-box">
      {/* Photo and Basic Info */}
      <div className="patron-info-box__main">
        <div className="patron-info-box__photo">
          <img src={patron.photo} alt={`${patron.firstName} ${patron.lastName}`} />
        </div>
        <div className="patron-info-box__details">
          <h2 className="patron-info-box__name">
            <span className="patron-info-box__name-first">{patron.firstName}</span>
            {' '}
            <span className="patron-info-box__name-last">{patron.lastName}</span>
          </h2>
          <div className="patron-info-box__household">
            <a href="#" className="patron-info-box__household-link">
              {patron.household.name}
            </a>
            {patron.household.verified && (
              <i className="fa-solid fa-badge-check patron-info-box__verified"></i>
            )}
          </div>
          <div className="patron-info-box__tags">
            <span className="patron-info-box__tag patron-info-box__tag--accent">
              {patron.category}
            </span>
            <span className="patron-info-box__id">
              Id: {patron.id}
              <button className="patron-info-box__copy" title="Copy ID">
                <i className="fa-regular fa-copy"></i>
              </button>
            </span>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="patron-info-box__section patron-info-box__contact">
        <div className="patron-info-box__info-item">
          <i className="fa-solid fa-envelope patron-info-box__info-icon"></i>
          <span>{patron.email}</span>
          <i className="fa-solid fa-star patron-info-box__star" title="Primary email"></i>
        </div>
        <div className="patron-info-box__info-item">
          <i className="fa-solid fa-phone patron-info-box__info-icon"></i>
          <span>{patron.phone}</span>
        </div>
        <div className="patron-info-box__info-item">
          <i className="fa-solid fa-location-dot patron-info-box__info-icon"></i>
          <span>{patron.address}</span>
        </div>
      </div>

      {/* Membership Info */}
      <div className="patron-info-box__section patron-info-box__membership">
        <div className="patron-info-box__info-item">
          <i className="fa-solid fa-address-card patron-info-box__info-icon"></i>
          <span>{patron.membership.programme} - {patron.membership.tier}</span>
        </div>
        <div className="patron-info-box__info-item">
          <i className="fa-solid fa-calendar-day patron-info-box__info-icon"></i>
          <span>Member since {patron.membership.memberSince}</span>
        </div>
        <div className="patron-info-box__info-item">
          <i className="fa-solid fa-clock-rotate-left patron-info-box__info-icon"></i>
          <span>{patron.membership.daysToRenewal} days to renewal</span>
          {patron.membership.daysToRenewal < 180 && (
            <i className="fa-solid fa-triangle-exclamation patron-info-box__warning" title="Renewal approaching"></i>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="patron-info-box__actions">
        <div className="patron-info-box__dropdown">
          <button 
            className="patron-info-box__actions-btn"
            onClick={() => setActionsOpen(!actionsOpen)}
          >
            Actions
            <i className="fa-solid fa-chevron-down"></i>
          </button>
          {actionsOpen && (
            <div className="patron-info-box__dropdown-menu">
              <button className="patron-info-box__dropdown-item">
                <i className="fa-solid fa-pen"></i>
                Edit Information
              </button>
              <button className="patron-info-box__dropdown-item">
                <i className="fa-solid fa-tags"></i>
                Change Category
              </button>
              <button className="patron-info-box__dropdown-item">
                <i className="fa-solid fa-plus"></i>
                Add activity
              </button>
              <button className="patron-info-box__dropdown-item">
                <i className="fa-solid fa-link"></i>
                Add relationship
              </button>
              <button className="patron-info-box__dropdown-item">
                <i className="fa-solid fa-user"></i>
                Change Assignment
              </button>
              <button className="patron-info-box__dropdown-item">
                <i className="fa-solid fa-fire-flame-curved"></i>
                Modify Engagement Level
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PatronInfoBox
