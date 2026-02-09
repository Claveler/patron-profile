import { useState, useRef, useEffect } from 'react'
import { patronTags, addCustomTag, getPrimaryMembershipForPatron, formatDate, getHouseholdForPatron, getHouseholdMembers, getHouseholdAddress, getEffectiveTags, isComputedTag, getTagConfig } from '../../data/patrons'
import { getInitials } from '../../utils/getInitials'
import './PatronInfoBox.css'

function PatronInfoBox({ patron, isManaged, onCreateOpportunity, onAddActivity, onRecordGift, onAssignToPortfolio, onArchive, onRestore, onUpdateTags, onNavigateToPatron }) {
  const membership = getPrimaryMembershipForPatron(patron.id)
  const household = getHouseholdForPatron(patron.id)
  const householdMembers = household ? getHouseholdMembers(household.id) : []
  const getTagLabel = (tagId) => {
    return getTagConfig(tagId).label
  }
  const [actionsOpen, setActionsOpen] = useState(false)
  const [tagsPopoverOpen, setTagsPopoverOpen] = useState(false)
  const [tagSearchTerm, setTagSearchTerm] = useState('')
  const [householdPopoverOpen, setHouseholdPopoverOpen] = useState(false)
  const tagsPopoverRef = useRef(null)
  const householdPopoverRef = useRef(null)
  const actionsRef = useRef(null)
  
  // Tags display logic - show 1 tag + count (uses effective = manual + computed)
  const allTags = getEffectiveTags(patron)
  const firstTag = allTags[0]
  const remainingCount = allTags.length - 1

  // Filter available tags for search (only manual tags, exclude already added)
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

  // Close household popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (householdPopoverRef.current && !householdPopoverRef.current.contains(e.target)) {
        setHouseholdPopoverOpen(false)
      }
    }
    if (householdPopoverOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [householdPopoverOpen])

  // Close actions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (actionsRef.current && !actionsRef.current.contains(e.target)) {
        setActionsOpen(false)
      }
    }
    if (actionsOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [actionsOpen])

  // Tag management handlers (only modify manual tags on the patron record)
  const manualTags = patron.tags || []

  const handleRemoveTag = (tagId) => {
    if (onUpdateTags && !isComputedTag(tagId)) {
      onUpdateTags(manualTags.filter(t => t !== tagId))
    }
  }

  const handleAddTag = (tagId) => {
    if (onUpdateTags && !manualTags.includes(tagId)) {
      onUpdateTags([...manualTags, tagId])
    }
    setTagSearchTerm('')
  }

  const handleCreateAndAddTag = () => {
    if (canCreateNew) {
      const newTag = addCustomTag(tagSearchTerm.trim())
      handleAddTag(newTag.id)
    }
  }

  // Check patron status
  const isArchived = patron.status === 'archived'
  const isDeceased = patron.status === 'deceased'
  const isInactive = patron.status === 'inactive'
  const isNonActive = isArchived || isDeceased
  
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

  const handleRecordGift = () => {
    setActionsOpen(false)
    if (onRecordGift) {
      onRecordGift()
    }
  }

  const handleAssignToPortfolio = () => {
    setActionsOpen(false)
    if (onAssignToPortfolio) {
      onAssignToPortfolio()
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
    <div className={`patron-info-box ${isNonActive ? 'patron-info-box--archived' : ''} ${isDeceased ? 'patron-info-box--deceased' : ''} ${isInactive ? 'patron-info-box--inactive' : ''}`}>
      {/* Deceased Banner */}
      {isDeceased && (
        <div className="patron-info-box__status-banner patron-info-box__status-banner--deceased">
          <i className="fa-solid fa-cross"></i>
          <span>
            This patron is deceased
            {patron.deceasedDate && ` — ${new Date(patron.deceasedDate + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`}
          </span>
          <button className="patron-info-box__restore-btn" onClick={handleRestore}>
            Change Status
          </button>
        </div>
      )}
      {/* Inactive Banner */}
      {isInactive && (
        <div className="patron-info-box__status-banner patron-info-box__status-banner--inactive">
          <i className="fa-solid fa-clock"></i>
          <span>
            This patron is inactive
            {patron.inactiveReason && ` — ${patron.inactiveReason}`}
          </span>
          <button className="patron-info-box__restore-btn patron-info-box__restore-btn--amber" onClick={handleRestore}>
            Reactivate
          </button>
        </div>
      )}
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
              <span className="patron-info-box__photo-initials">{getInitials(`${patron.firstName} ${patron.lastName}`)}</span>
            </div>
          )}
        </div>
        <div className="patron-info-box__details">
          <h2 className="patron-info-box__name">
            <span className="patron-info-box__name-first">{patron.firstName}</span>
            {' '}
            <span className="patron-info-box__name-last">{patron.lastName}</span>
          </h2>
          {household && (
            <div className="patron-info-box__household" ref={householdPopoverRef}>
              <button 
                className="patron-info-box__household-link"
                onClick={() => setHouseholdPopoverOpen(!householdPopoverOpen)}
              >
                <i className="fa-solid fa-house-chimney patron-info-box__household-icon"></i>
                {household.name}
              </button>
              {household.verified && (
                <i className="fa-solid fa-circle-check patron-info-box__verified"></i>
              )}
              {householdPopoverOpen && (
                <div className="patron-info-box__household-popover">
                  <div className="patron-info-box__household-popover-header">
                    <span className="patron-info-box__household-popover-title">{household.name}</span>
                    {household.verified && (
                      <i className="fa-solid fa-circle-check patron-info-box__household-popover-badge"></i>
                    )}
                    <button 
                      className="patron-info-box__household-popover-close"
                      onClick={() => setHouseholdPopoverOpen(false)}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                  {getHouseholdAddress(household) && (
                    <div className="patron-info-box__household-popover-address">
                      <i className="fa-solid fa-location-dot"></i>
                      <span>{getHouseholdAddress(household)}</span>
                    </div>
                  )}
                  <div className="patron-info-box__household-popover-members">
                    {householdMembers.map((member) => {
                      const isCurrentPatron = member.patronId === patron.id
                      return (
                        <div 
                          key={member.id}
                          className={`patron-info-box__household-member ${isCurrentPatron ? 'patron-info-box__household-member--current' : 'patron-info-box__household-member--clickable'}`}
                          onClick={() => {
                            if (!isCurrentPatron && onNavigateToPatron) {
                              setHouseholdPopoverOpen(false)
                              onNavigateToPatron(member.patronId)
                            }
                          }}
                        >
                          <div className="patron-info-box__household-member-avatar">
                            {member.patron.photo ? (
                              <img src={member.patron.photo} alt={member.patron.name} />
                            ) : (
                              <span>{getInitials(member.patron.name)}</span>
                            )}
                          </div>
                          <div className="patron-info-box__household-member-info">
                            <span className="patron-info-box__household-member-name">
                              {member.patron.name}
                            </span>
                            <span className="patron-info-box__household-member-role">{member.role}</span>
                          </div>
                          {member.isPrimary && (
                            <span className="patron-info-box__household-member-primary" title="Primary contact">
                              <i className="fa-solid fa-star"></i>
                            </span>
                          )}
                          {!isCurrentPatron && (
                            <span className="patron-info-box__household-member-arrow">
                              <i className="fa-solid fa-chevron-right"></i>
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
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
                title={remainingCount > 0 ? `${remainingCount} more tag${remainingCount > 1 ? 's' : ''}` : 'Manage tags'}
              >
                {remainingCount > 0 ? (
                  <><i className="fa-solid fa-tag" style={{fontSize: '9px', marginRight: '2px'}}></i>+{remainingCount}</>
                ) : (
                  <i className="fa-solid fa-plus"></i>
                )}
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
                      allTags.map(tagId => {
                        const computed = isComputedTag(tagId)
                        return (
                          <div key={tagId} className={`patron-info-box__tags-popover-item ${computed ? 'patron-info-box__tags-popover-item--computed' : ''}`}>
                            <span className="patron-info-box__tags-popover-item-label">
                              {getTagLabel(tagId)}
                              {computed && (
                                <i className="fa-solid fa-bolt patron-info-box__tags-popover-item-auto" title="Auto-computed from data"></i>
                              )}
                            </span>
                            {!computed && (
                              <button 
                                className="patron-info-box__tags-popover-item-remove"
                                onClick={() => handleRemoveTag(tagId)}
                              >
                                <i className="fa-solid fa-xmark"></i>
                              </button>
                            )}
                          </div>
                        )
                      })
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
              {membership.program ? `${membership.program} - ` : ''}
              {membership.tier || 'Member'}
            </span>
            <span 
              className={`patron-info-box__membership-role ${membership.patronRole === 'primary' ? 'patron-info-box__membership-role--primary' : 'patron-info-box__membership-role--beneficiary'}`}
              title={membership.patronRoleLabel || (membership.patronRole === 'primary' ? 'Primary Member' : 'Beneficiary')}
            >
              <i className={`fa-solid ${membership.patronRole === 'primary' ? 'fa-star' : 'fa-user-plus'}`}></i>
              {membership.patronRole === 'primary' ? 'Primary' : (membership.patronRoleLabel || 'Beneficiary')}
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
        <div className="patron-info-box__dropdown" ref={actionsRef}>
          <button 
            className="patron-info-box__actions-btn"
            onClick={() => setActionsOpen(!actionsOpen)}
          >
            Actions
            <i className="fa-solid fa-chevron-down"></i>
          </button>
          {actionsOpen && (
            <div className="patron-info-box__dropdown-menu">
              {/* Group 1: Quick Record Actions */}
              <button className="patron-info-box__dropdown-item" onClick={handleRecordGift}>
                <i className="fa-solid fa-hand-holding-dollar"></i>
                Record gift
              </button>
              <button className="patron-info-box__dropdown-item" onClick={handleAddActivity}>
                <i className="fa-solid fa-calendar-plus"></i>
                Log activity
              </button>
              {isManaged && (
                <button className="patron-info-box__dropdown-item" onClick={handleCreateOpportunity}>
                  <i className="fa-solid fa-bullseye"></i>
                  Create opportunity
                </button>
              )}
              <div className="patron-info-box__dropdown-divider"></div>
              {/* Group 2: Manage Profile */}
              <button className="patron-info-box__dropdown-item">
                <i className="fa-solid fa-pen"></i>
                Edit information
              </button>
              <button className="patron-info-box__dropdown-item" onClick={handleAssignToPortfolio}>
                <i className="fa-solid fa-user-shield"></i>
                Assign to portfolio
              </button>
              <button className="patron-info-box__dropdown-item">
                <i className="fa-solid fa-link"></i>
                Add relationship
              </button>
              <div className="patron-info-box__dropdown-divider"></div>
              {/* Group 3: Administrative */}
              {isArchived ? (
                <button className="patron-info-box__dropdown-item patron-info-box__dropdown-item--success" onClick={handleRestore}>
                  <i className="fa-solid fa-rotate-left"></i>
                  Restore patron
                </button>
              ) : (
                <button className="patron-info-box__dropdown-item patron-info-box__dropdown-item--danger" onClick={handleArchive}>
                  <i className="fa-solid fa-box-archive"></i>
                  Archive patron
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
