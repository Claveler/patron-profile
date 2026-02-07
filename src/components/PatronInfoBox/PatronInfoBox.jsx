import { useState, useRef, useEffect } from 'react'
import { patronTags, addCustomTag, getPrimaryMembershipForPatron, formatDate } from '../../data/patrons'
import './PatronInfoBox.css'

function PatronInfoBox({ patron, isManaged, onCreateOpportunity, onAddActivity, onArchive, onRestore, onUpdateTags }) {
  const membership = getPrimaryMembershipForPatron(patron.id)
  const getTagLabel = (tagId) => {
    return patronTags.find(t => t.id === tagId)?.label || tagId
  }
  const [actionsOpen, setActionsOpen] = useState(false)
  const [tagsPopoverOpen, setTagsPopoverOpen] = useState(false)
  const [tagSearchTerm, setTagSearchTerm] = useState('')
  const tagsPopoverRef = useRef(null)
  
  // Tags display logic - show 1 tag + count
  const allTags = patron.tags || []
  const firstTag = allTags[0]
  const remainingCount = allTags.length - 1

  // Filter available tags for search (exclude already added)
  const availableTags = patronTags.filter(t => !allTags.includes(t.id))
  const filteredTags = tagSearchTerm 
    ? availableTags.filter(t => t.label.toLowerCase().includes(tagSearchTerm.toLowerCase()))
    : availableTags
  
  // Check if search term matches an existing tag
  const exactMatch = patronTags.find(t => t.label.toLowerCase() === tagSearchTerm.toLowerCase())
  const canCreateNew = tagSearchTerm.trim() && !exactMatch

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (tagsPopoverRef.current && !tagsPopoverRef.current.contains(e.target)) {
        setTagsPopoverOpen(false)
        setTagSearchTerm('')
      }
    }
    if (tagsPopoverOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [tagsPopoverOpen])

  // Tag management handlers
  const handleRemoveTag = (tagId) => {
    if (onUpdateTags) {
      onUpdateTags(allTags.filter(t => t !== tagId))
    }
  }

  const handleAddTag = (tagId) => {
    if (onUpdateTags && !allTags.includes(tagId)) {
      onUpdateTags([...allTags, tagId])
    }
    setTagSearchTerm('')
  }

  const handleCreateAndAddTag = () => {
    if (canCreateNew) {
      const newTag = addCustomTag(tagSearchTerm.trim())
      handleAddTag(newTag.id)
    }
  }

  // Check if patron is archived
  const isArchived = patron.status === 'archived'
  
  const handleCreateOpportunity = () => {
    setActionsOpen(false)
    if (onCreateOpportunity) {
      onCreateOpportunity()
    }
  }
  
  const handleAddActivity = () => {
    setActionsOpen(false)
    if (onAddActivity) {
      onAddActivity()
    }
  }

  const handleArchive = () => {
    setActionsOpen(false)
    if (onArchive && window.confirm(`Are you sure you want to archive ${patron.firstName} ${patron.lastName}? They will be hidden from the patrons list but can be restored later.`)) {
      onArchive()
    }
  }

  const handleRestore = () => {
    setActionsOpen(false)
    if (onRestore) {
      onRestore()
    }
  }

  return (
    <div className={`patron-info-box ${isArchived ? 'patron-info-box--archived' : ''}`}>
      {/* Archived Banner */}
      {isArchived && (
        <div className="patron-info-box__archived-banner">
          <i className="fa-solid fa-box-archive"></i>
          <span>This patron is archived</span>
          <button className="patron-info-box__restore-btn" onClick={handleRestore}>
            Restore
          </button>
        </div>
      )}
      {/* Photo and Basic Info */}
      <div className="patron-info-box__main">
        <div className="patron-info-box__photo">
          {patron.photo ? (
            <img src={patron.photo} alt={`${patron.firstName} ${patron.lastName}`} />
          ) : (
            <div className="patron-info-box__photo-placeholder">
              <i className="fa-solid fa-user"></i>
            </div>
          )}
        </div>
        <div className="patron-info-box__details">
          <h2 className="patron-info-box__name">
            <span className="patron-info-box__name-first">{patron.firstName}</span>
            {' '}
            <span className="patron-info-box__name-last">{patron.lastName}</span>
          </h2>
          {patron.household && (
            <div className="patron-info-box__household">
              <a href="#" className="patron-info-box__household-link">
                {patron.household.name}
              </a>
              {patron.household.verified && (
                <i className="fa-solid fa-badge-check patron-info-box__verified"></i>
              )}
            </div>
          )}
          <div className="patron-info-box__tags">
            {firstTag && (
              <span className="patron-info-box__tag patron-info-box__tag--accent">
                {getTagLabel(firstTag)}
              </span>
            )}
            <div className="patron-info-box__tags-popover-container" ref={tagsPopoverRef}>
              <button 
                className="patron-info-box__tag patron-info-box__tag--count"
                onClick={() => setTagsPopoverOpen(!tagsPopoverOpen)}
              >
                {remainingCount > 0 ? `+${remainingCount}` : <i className="fa-solid fa-plus"></i>}
              </button>
              
              {tagsPopoverOpen && (
                <div className="patron-info-box__tags-popover">
                  <div className="patron-info-box__tags-popover-header">
                    <span>Tags</span>
                    <button 
                      className="patron-info-box__tags-popover-close"
                      onClick={() => { setTagsPopoverOpen(false); setTagSearchTerm(''); }}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                  
                  <div className="patron-info-box__tags-popover-list">
                    {allTags.length === 0 ? (
                      <div className="patron-info-box__tags-popover-empty">No tags assigned</div>
                    ) : (
                      allTags.map(tagId => (
                        <div key={tagId} className="patron-info-box__tags-popover-item">
                          <span className="patron-info-box__tags-popover-item-label">
                            {getTagLabel(tagId)}
                          </span>
                          <button 
                            className="patron-info-box__tags-popover-item-remove"
                            onClick={() => handleRemoveTag(tagId)}
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="patron-info-box__tags-popover-search">
                    <input
                      type="text"
                      placeholder="Search or create tag..."
                      value={tagSearchTerm}
                      onChange={(e) => setTagSearchTerm(e.target.value)}
                      className="patron-info-box__tags-popover-input"
                    />
                    {tagSearchTerm && (
                      <div className="patron-info-box__tags-popover-suggestions">
                        {filteredTags.slice(0, 5).map(tag => (
                          <button
                            key={tag.id}
                            className="patron-info-box__tags-popover-suggestion"
                            onClick={() => handleAddTag(tag.id)}
                          >
                            {tag.label}
                          </button>
                        ))}
                        {canCreateNew && (
                          <button
                            className="patron-info-box__tags-popover-suggestion patron-info-box__tags-popover-suggestion--create"
                            onClick={handleCreateAndAddTag}
                          >
                            Create "{tagSearchTerm}"
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
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
        {patron.email && (
          <div className="patron-info-box__info-item">
            <i className="fa-solid fa-envelope patron-info-box__info-icon"></i>
            <span>{patron.email}</span>
            <i className="fa-solid fa-star patron-info-box__star" title="Primary email"></i>
          </div>
        )}
        {patron.phone && (
          <div className="patron-info-box__info-item">
            <i className="fa-solid fa-phone patron-info-box__info-icon"></i>
            <span>{patron.phone}</span>
          </div>
        )}
        {patron.address && (
          <div className="patron-info-box__info-item">
            <i className="fa-solid fa-location-dot patron-info-box__info-icon"></i>
            <span>{patron.address}</span>
          </div>
        )}
      </div>

      {/* Membership Info - Only show if membership data exists */}
      {membership && (
        <div className="patron-info-box__section patron-info-box__membership">
          <div className="patron-info-box__info-item">
            <i className="fa-solid fa-address-card patron-info-box__info-icon"></i>
            <span>
              {membership.programme ? `${membership.programme} - ` : ''}
              {membership.tier || 'Member'}
            </span>
          </div>
          {membership.startDate && (
            <div className="patron-info-box__info-item">
              <i className="fa-solid fa-calendar-day patron-info-box__info-icon"></i>
              <span>Member since {formatDate(membership.startDate)}</span>
            </div>
          )}
          {membership.daysToRenewal !== undefined && (
            <div className="patron-info-box__info-item">
              <i className="fa-solid fa-clock-rotate-left patron-info-box__info-icon"></i>
              <span>{membership.daysToRenewal} days to renewal</span>
              {membership.daysToRenewal < 180 && (
                <i className="fa-solid fa-triangle-exclamation patron-info-box__warning" title="Renewal approaching"></i>
              )}
            </div>
          )}
        </div>
      )}

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
              <button className="patron-info-box__dropdown-item" onClick={handleAddActivity}>
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
              {isManaged && (
                <button className="patron-info-box__dropdown-item" onClick={handleCreateOpportunity}>
                  <i className="fa-solid fa-bullseye"></i>
                  Create opportunity
                </button>
              )}
              <div className="patron-info-box__dropdown-divider"></div>
              {isArchived ? (
                <button className="patron-info-box__dropdown-item patron-info-box__dropdown-item--success" onClick={handleRestore}>
                  <i className="fa-solid fa-rotate-left"></i>
                  Restore Patron
                </button>
              ) : (
                <button className="patron-info-box__dropdown-item patron-info-box__dropdown-item--danger" onClick={handleArchive}>
                  <i className="fa-solid fa-box-archive"></i>
                  Archive Patron
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PatronInfoBox
