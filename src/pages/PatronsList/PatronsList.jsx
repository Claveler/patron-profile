import { useState, useMemo } from 'react'
import { patrons, patronCategories, engagementLevels, patronSources, isManagedProspect, formatDate, getActivePatrons } from '../../data/patrons'
import PatronModal from '../../components/PatronModal/PatronModal'
import './PatronsList.css'

// Check if patron was added in the last 7 days
const isRecentlyAdded = (createdDate) => {
  if (!createdDate) return false
  const created = new Date(createdDate)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  return created >= sevenDaysAgo
}

// Get source configuration
const getSourceConfig = (sourceId) => {
  return patronSources.find(s => s.id === sourceId) || null
}

function PatronsList({ onSelectPatron }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState('lastName')
  const [sortDirection, setSortDirection] = useState('asc')
  const [openMenuId, setOpenMenuId] = useState(null)
  const [showPatronModal, setShowPatronModal] = useState(false)
  const [showArchived, setShowArchived] = useState(false)

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
        case 'lastDonation':
          aVal = a.giving?.lastDonation || ''
          bVal = b.giving?.lastDonation || ''
          break
        case 'engagement':
          const levels = ['cold', 'cool', 'warm', 'hot', 'on-fire']
          aVal = levels.indexOf(a.engagement?.level || 'cold')
          bVal = levels.indexOf(b.engagement?.level || 'cold')
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

  const getCategoryConfig = (categoryId) => {
    return patronCategories.find(c => c.id === categoryId) || { label: categoryId, color: 'neutral' }
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
              placeholder="Search by name, email and owner"
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
                <th className="patrons-list__th">Email</th>
                <th className="patrons-list__th">Category</th>
                <th className="patrons-list__th">Owner</th>
                <th 
                  className="patrons-list__th patrons-list__th--sortable"
                  onClick={() => handleSort('lastDonation')}
                >
                  Last donation
                  <i className={`fa-solid fa-sort patrons-list__sort-icon ${sortField === 'lastDonation' ? 'patrons-list__sort-icon--active' : ''}`}></i>
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
                const sourceConfig = getSourceConfig(patron.source)
                const category = getCategoryConfig(patron.category)
                
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
                          {sourceConfig && (
                            <span className="patrons-list__source" title={`Added via: ${sourceConfig.label}`}>
                              <i className={`fa-solid ${sourceConfig.icon}`}></i>
                              {sourceConfig.label}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="patrons-list__td patrons-list__td--email">
                      {patron.email}
                    </td>
                    <td className="patrons-list__td">
                      <span className={`patrons-list__category patrons-list__category--${category.color}`}>
                        {category.label}
                      </span>
                    </td>
                    <td className="patrons-list__td patrons-list__td--owner">
                      {patron.assignedTo ? (
                        <span className="patrons-list__owner">{patron.assignedTo}</span>
                      ) : (
                        <span className="patrons-list__owner patrons-list__owner--none">-</span>
                      )}
                    </td>
                    <td className="patrons-list__td">
                      {patron.giving?.lastDonation ? formatDate(patron.giving.lastDonation) : '-'}
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
    </div>
  )
}

export default PatronsList
