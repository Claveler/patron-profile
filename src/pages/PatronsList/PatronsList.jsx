import { useState, useMemo } from 'react'
import { patrons, patronTags, engagementLevels, isManagedProspect, formatRelativeDate, getActivePatrons, getPatronOrigin } from '../../data/patrons'
import PatronModal from '../../components/PatronModal/PatronModal'
import AssignPortfolioModal from '../../components/AssignPortfolioModal/AssignPortfolioModal'
import './PatronsList.css'

// Check if patron was added in the last 7 days
const isRecentlyAdded = (createdDate) => {
  if (!createdDate) return false
  const created = new Date(createdDate)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  return created >= sevenDaysAgo
}

// Format currency for display
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function PatronsList({ onSelectPatron }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState('createdDate')
  const [sortDirection, setSortDirection] = useState('desc') // newest first
  const [openMenuId, setOpenMenuId] = useState(null)
  const [showPatronModal, setShowPatronModal] = useState(false)
  const [showArchived, setShowArchived] = useState(false)
  const [assigningPatron, setAssigningPatron] = useState(null) // { id, name }

  // Filter and sort patrons
  const filteredPatrons = useMemo(() => {
    // Start with active patrons or all patrons based on toggle
    let result = showArchived ? [...patrons] : getActivePatrons()
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(patron => 
        patron.firstName.toLowerCase().includes(term) ||
        patron.lastName.toLowerCase().includes(term) ||
        patron.email.toLowerCase().includes(term) ||
        (patron.assignedTo && patron.assignedTo.toLowerCase().includes(term))
      )
    }
    
    // Sort
    result.sort((a, b) => {
      let aVal, bVal
      
      switch (sortField) {
        case 'name':
        case 'lastName':
          aVal = `${a.lastName} ${a.firstName}`.toLowerCase()
          bVal = `${b.lastName} ${b.firstName}`.toLowerCase()
          break
        case 'createdDate':
          // Patrons without createdDate sort to bottom (oldest)
          aVal = a.createdDate || '1900-01-01'
          bVal = b.createdDate || '1900-01-01'
          break
        case 'lifetimeValue':
          aVal = a.giving?.lifetimeValue || 0
          bVal = b.giving?.lifetimeValue || 0
          break
        case 'engagement':
          const levels = ['cold', 'cool', 'warm', 'hot', 'on-fire']
          aVal = levels.indexOf(a.engagement?.level || 'cold')
          bVal = levels.indexOf(b.engagement?.level || 'cold')
          break
        case 'membershipTier':
          // Sort by tier: Gold > Silver > Basic > None
          const tierOrder = { 'Gold': 3, 'Silver': 2, 'Basic': 1 }
          aVal = tierOrder[a.membership?.tier] || 0
          bVal = tierOrder[b.membership?.tier] || 0
          break
        default:
          aVal = a[sortField] || ''
          bVal = b[sortField] || ''
      }
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
    
    return result
  }, [searchTerm, sortField, sortDirection, showArchived])

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getTagConfig = (tagId) => {
    return patronTags.find(t => t.id === tagId) || { id: tagId, label: tagId }
  }

  const getMembershipTier = (patron) => {
    return patron.membership?.tier || null
  }

  const getEngagementLabel = (levelId) => {
    return engagementLevels.find(l => l.id === levelId)?.label || levelId
  }

  const handleRowClick = (patron) => {
    onSelectPatron(patron.id)
  }

  const handleMenuClick = (e, patronId) => {
    e.stopPropagation()
    setOpenMenuId(openMenuId === patronId ? null : patronId)
  }

  const handleViewProfile = (e, patron) => {
    e.stopPropagation()
    setOpenMenuId(null)
    onSelectPatron(patron.id)
  }

  // Close menu when clicking outside
  const handleTableClick = () => {
    if (openMenuId) setOpenMenuId(null)
  }

  // Handle new patron creation success
  const handlePatronCreated = (newPatron) => {
    // Optionally navigate to the new patron's profile
    if (onSelectPatron) {
      onSelectPatron(newPatron.id)
    }
  }

  return (
    <div className="patrons-list">
      {/* Page Header */}
      <div className="patrons-list__header">
        <div className="patrons-list__breadcrumb">
          <span className="patrons-list__breadcrumb-section">Fundraising</span>
          <i className="fa-solid fa-chevron-right patrons-list__breadcrumb-separator"></i>
        </div>
        <h1 className="patrons-list__title">Patrons</h1>
      </div>

      {/* Main Content */}
      <div className="patrons-list__container">
        {/* Toolbar */}
        <div className="patrons-list__toolbar">
          <div className="patrons-list__search">
            <i className="fa-solid fa-magnifying-glass patrons-list__search-icon"></i>
            <input
              type="text"
              placeholder="Search by name or owner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="patrons-list__search-input"
            />
          </div>
          <div className="patrons-list__actions">
            <label className="patrons-list__toggle">
              <input
                type="checkbox"
                checked={showArchived}
                onChange={(e) => setShowArchived(e.target.checked)}
              />
              <span>Show archived</span>
            </label>
            <button className="patrons-list__filter-btn">
              <i className="fa-solid fa-sliders"></i>
              Filters
            </button>
            <button 
              className="patrons-list__add-btn"
              onClick={() => setShowPatronModal(true)}
            >
              <i className="fa-solid fa-plus"></i>
              Add new patron
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="patrons-list__table-wrapper" onClick={handleTableClick}>
          <table className="patrons-list__table">
            <thead>
              <tr>
                <th 
                  className="patrons-list__th patrons-list__th--sortable"
                  onClick={() => handleSort('lastName')}
                >
                  Name
                  <i className={`fa-solid fa-sort patrons-list__sort-icon ${sortField === 'lastName' ? 'patrons-list__sort-icon--active' : ''}`}></i>
                </th>
                <th 
                  className="patrons-list__th patrons-list__th--sortable"
                  onClick={() => handleSort('lifetimeValue')}
                >
                  Lifetime Value
                  <i className={`fa-solid fa-sort patrons-list__sort-icon ${sortField === 'lifetimeValue' ? 'patrons-list__sort-icon--active' : ''}`}></i>
                </th>
                <th 
                  className="patrons-list__th patrons-list__th--sortable"
                  onClick={() => handleSort('membershipTier')}
                >
                  Membership
                  <i className={`fa-solid fa-sort patrons-list__sort-icon ${sortField === 'membershipTier' ? 'patrons-list__sort-icon--active' : ''}`}></i>
                </th>
                <th className="patrons-list__th">Tags</th>
                <th className="patrons-list__th">Owner</th>
                <th 
                  className="patrons-list__th patrons-list__th--sortable"
                  onClick={() => handleSort('createdDate')}
                >
                  Patron Since
                  <i className={`fa-solid fa-sort patrons-list__sort-icon ${sortField === 'createdDate' ? 'patrons-list__sort-icon--active' : ''}`}></i>
                </th>
                <th 
                  className="patrons-list__th patrons-list__th--sortable"
                  onClick={() => handleSort('engagement')}
                >
                  Engagement
                  <i className={`fa-solid fa-sort patrons-list__sort-icon ${sortField === 'engagement' ? 'patrons-list__sort-icon--active' : ''}`}></i>
                </th>
                <th className="patrons-list__th patrons-list__th--actions"></th>
              </tr>
            </thead>
            <tbody>
              {filteredPatrons.map(patron => {
                const isManaged = isManagedProspect(patron)
                const isArchived = patron.status === 'archived'
                const isNew = isRecentlyAdded(patron.createdDate)
                const origin = getPatronOrigin(patron.source)
                const membershipTier = getMembershipTier(patron)
                const tags = patron.tags || []
                const displayTags = tags.slice(0, 2)
                const remainingTags = tags.length - 2
                
                return (
                  <tr 
                    key={patron.id} 
                    className={`patrons-list__row ${isManaged ? 'patrons-list__row--managed' : ''} ${isArchived ? 'patrons-list__row--archived' : ''} ${isNew ? 'patrons-list__row--new' : ''}`}
                    onClick={() => handleRowClick(patron)}
                  >
                    <td className="patrons-list__td patrons-list__td--name">
                      <div className="patrons-list__patron-info">
                        {patron.photo ? (
                          <img 
                            src={patron.photo} 
                            alt="" 
                            className={`patrons-list__avatar ${isArchived ? 'patrons-list__avatar--archived' : ''}`}
                          />
                        ) : (
                          <div className={`patrons-list__avatar patrons-list__avatar--placeholder ${isArchived ? 'patrons-list__avatar--archived' : ''}`}>
                            <i className="fa-solid fa-user"></i>
                          </div>
                        )}
                        <div className="patrons-list__name-wrapper">
                          <div className="patrons-list__name-row">
                            <span 
                              className={`patrons-list__origin patrons-list__origin--${origin}`}
                              data-tooltip={origin === 'fever' ? 'Added via Fever' : 'Manually added'}
                            />
                            <span className="patrons-list__name">
                              {patron.firstName} {patron.lastName}
                            </span>
                            {isNew && (
                              <span className="patrons-list__new-badge">New</span>
                            )}
                          </div>
                          {isArchived && (
                            <span className="patrons-list__archived-badge">Archived</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="patrons-list__td patrons-list__td--ltv">
                      {formatCurrency(patron.giving?.lifetimeValue || 0)}
                    </td>
                    <td className="patrons-list__td patrons-list__td--membership">
                      {membershipTier ? (
                        <span className={`patrons-list__membership patrons-list__membership--${membershipTier.toLowerCase()}`}>
                          {membershipTier}
                        </span>
                      ) : (
                        <span className="patrons-list__membership patrons-list__membership--none">—</span>
                      )}
                    </td>
                    <td className="patrons-list__td patrons-list__td--tags">
                      <div className="patrons-list__tags-container" data-tooltip={tags.map(t => getTagConfig(t).label).join(', ')}>
                        {displayTags.map(tagId => (
                          <span key={tagId} className="patrons-list__tag">
                            {getTagConfig(tagId).label}
                          </span>
                        ))}
                        {remainingTags > 0 && (
                          <span className="patrons-list__tag patrons-list__tag--more">+{remainingTags}</span>
                        )}
                      </div>
                    </td>
                    <td className="patrons-list__td patrons-list__td--owner">
                      {patron.assignedTo ? (
                        <span className="patrons-list__owner">{patron.assignedTo}</span>
                      ) : (
                        <button 
                          className="patrons-list__assign-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            setAssigningPatron({ id: patron.id, name: `${patron.firstName} ${patron.lastName}` })
                          }}
                        >
                          <i className="fa-solid fa-plus"></i>
                          Assign
                        </button>
                      )}
                    </td>
                    <td className="patrons-list__td">
                      {formatRelativeDate(patron.createdDate)}
                    </td>
                    <td className="patrons-list__td">
                      <span className={`patrons-list__engagement patrons-list__engagement--${patron.engagement?.level || 'cold'}`}>
                        {getEngagementLabel(patron.engagement?.level)}
                      </span>
                    </td>
                    <td className="patrons-list__td patrons-list__td--actions">
                      <div className="patrons-list__menu-container">
                        <button 
                          className="patrons-list__menu-btn"
                          onClick={(e) => handleMenuClick(e, patron.id)}
                        >
                          <i className="fa-solid fa-ellipsis"></i>
                        </button>
                        {openMenuId === patron.id && (
                          <div className="patrons-list__dropdown">
                            <button 
                              className="patrons-list__dropdown-item"
                              onClick={(e) => handleViewProfile(e, patron)}
                            >
                              <i className="fa-solid fa-address-card"></i>
                              View profile
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Results count */}
        <div className="patrons-list__footer">
          <span className="patrons-list__count">
            Showing {filteredPatrons.length} of {showArchived ? patrons.length : getActivePatrons().length} patrons
            {showArchived && ` (including archived)`}
          </span>
        </div>
      </div>

      {/* Patron Modal */}
      <PatronModal
        isOpen={showPatronModal}
        onClose={() => setShowPatronModal(false)}
        onSuccess={handlePatronCreated}
      />

      {/* Assign to Portfolio Modal */}
      {assigningPatron && (
        <AssignPortfolioModal
          isOpen={!!assigningPatron}
          onClose={() => setAssigningPatron(null)}
          onSuccess={() => setAssigningPatron(null)}
          patronId={assigningPatron.id}
          patronName={assigningPatron.name}
        />
      )}
    </div>
  )
}

export default PatronsList
