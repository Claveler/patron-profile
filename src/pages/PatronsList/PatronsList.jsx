import { useState, useMemo } from 'react'
import { patrons, patronTags, engagementLevels, giftOfficers, patronSources, isManagedProspect, formatRelativeDate, getActivePatrons, getPatronOrigin, getPrimaryMembershipForPatron } from '../../data/patrons'
import { getStaffNameById } from '../../data/campaigns'
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

  // Filter state
  const [showFilters, setShowFilters] = useState(false)
  const [filterTags, setFilterTags] = useState([])              // array of tag IDs
  const [filterMembership, setFilterMembership] = useState('all') // 'all' | 'Gold' | 'Silver' | 'Basic' | 'none'
  const [filterEngagement, setFilterEngagement] = useState([])    // array of level IDs
  const [filterType, setFilterType] = useState('all')             // 'all' | 'managed' | 'general'
  const [filterOwner, setFilterOwner] = useState('all')           // 'all' | officer name
  const [filterSource, setFilterSource] = useState('all')         // 'all' | source ID
  const [filterLtvMin, setFilterLtvMin] = useState('')            // string for input
  const [filterLtvMax, setFilterLtvMax] = useState('')
  const [filterLastDonation, setFilterLastDonation] = useState('all') // 'all' | '30' | '90' | '365' | 'over365' | 'never'

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filterTags.length > 0) count++
    if (filterMembership !== 'all') count++
    if (filterEngagement.length > 0) count++
    if (filterType !== 'all') count++
    if (filterOwner !== 'all') count++
    if (filterSource !== 'all') count++
    if (filterLtvMin !== '' || filterLtvMax !== '') count++
    if (filterLastDonation !== 'all') count++
    return count
  }, [filterTags, filterMembership, filterEngagement, filterType, filterOwner, filterSource, filterLtvMin, filterLtvMax, filterLastDonation])

  // Clear all filters
  const handleClearAllFilters = () => {
    setFilterTags([])
    setFilterMembership('all')
    setFilterEngagement([])
    setFilterType('all')
    setFilterOwner('all')
    setFilterSource('all')
    setFilterLtvMin('')
    setFilterLtvMax('')
    setFilterLastDonation('all')
  }

  // Toggle a value in an array filter
  const toggleArrayFilter = (arr, setArr, value) => {
    setArr(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value])
  }

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
        (patron.assignedToId && getStaffNameById(patron.assignedToId).toLowerCase().includes(term))
      )
    }

    // Filter by tags (OR match - patron must have at least one of the selected tags)
    if (filterTags.length > 0) {
      result = result.filter(p => filterTags.some(t => (p.tags || []).includes(t)))
    }

    // Filter by membership tier
    if (filterMembership !== 'all') {
      result = result.filter(p =>
        filterMembership === 'none'
          ? !p.membership?.tier
          : p.membership?.tier === filterMembership
      )
    }

    // Filter by engagement level
    if (filterEngagement.length > 0) {
      result = result.filter(p => filterEngagement.includes(p.engagement?.level || 'cold'))
    }

    // Filter by patron type (managed prospect vs general constituent)
    if (filterType !== 'all') {
      result = result.filter(p =>
        filterType === 'managed' ? isManagedProspect(p) : !isManagedProspect(p)
      )
    }

    // Filter by owner / gift officer
    if (filterOwner !== 'all') {
      result = result.filter(p => p.assignedToId === filterOwner)
    }

    // Filter by source
    if (filterSource !== 'all') {
      result = result.filter(p => p.source === filterSource)
    }

    // Filter by lifetime value range
    if (filterLtvMin !== '') {
      result = result.filter(p => (p.giving?.lifetimeValue || 0) >= Number(filterLtvMin))
    }
    if (filterLtvMax !== '') {
      result = result.filter(p => (p.giving?.lifetimeValue || 0) <= Number(filterLtvMax))
    }

    // Filter by last donation date
    if (filterLastDonation !== 'all') {
      const now = new Date()
      result = result.filter(p => {
        const lastDonation = p.giving?.lastDonation
        if (filterLastDonation === 'never') {
          return !lastDonation
        }
        if (!lastDonation) return false
        const donationDate = new Date(lastDonation)
        const diffDays = Math.floor((now - donationDate) / (1000 * 60 * 60 * 24))
        if (filterLastDonation === '30') return diffDays <= 30
        if (filterLastDonation === '90') return diffDays <= 90
        if (filterLastDonation === '365') return diffDays <= 365
        if (filterLastDonation === 'over365') return diffDays > 365
        return true
      })
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
  }, [searchTerm, sortField, sortDirection, showArchived, filterTags, filterMembership, filterEngagement, filterType, filterOwner, filterSource, filterLtvMin, filterLtvMax, filterLastDonation])

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

  const getMembershipInfo = (patron) => {
    const membership = getPrimaryMembershipForPatron(patron.id)
    const tier = membership?.tier || null
    const cardStyle = membership?.cardStyle || null
    return { tier, cardStyle }
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

  // Export filtered patrons to CSV
  const handleExportCSV = () => {
    const headers = [
      'First Name', 'Last Name', 'Email', 'Phone', 'Address',
      'Membership Tier', 'Lifetime Value', 'Donation Count', 'Last Donation',
      'Tags', 'Owner', 'Engagement', 'Source', 'Patron Since'
    ]
    const rows = filteredPatrons.map(p => [
      p.firstName,
      p.lastName,
      p.email || '',
      p.phone || '',
      p.address || '',
      p.membership?.tier || 'None',
      p.giving?.lifetimeValue || 0,
      p.giving?.giftCount || 0,
      p.giving?.lastDonation || '',
      (p.tags || []).map(t => {
        const tag = patronTags.find(pt => pt.id === t)
        return tag ? tag.label : t
      }).join('; '),
      (p.assignedToId ? getStaffNameById(p.assignedToId) : ''),
      p.engagement?.level || 'cold',
      p.source || '',
      p.createdDate || ''
    ])
    const csvContent = [headers, ...rows]
      .map(row => row.map(val => {
        const str = String(val)
        return str.includes(',') || str.includes('"') || str.includes('\n')
          ? `"${str.replace(/"/g, '""')}"`
          : str
      }).join(','))
      .join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `patrons-export-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
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
            <button
              className="patrons-list__export-btn"
              onClick={handleExportCSV}
              disabled={filteredPatrons.length === 0}
            >
              <i className="fa-solid fa-download"></i>
              Export ({filteredPatrons.length})
            </button>
            <button
              className={`patrons-list__filter-btn ${activeFilterCount > 0 ? 'patrons-list__filter-btn--active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <i className="fa-solid fa-sliders"></i>
              Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
            </button>
            <button 
              className="patrons-list__add-btn"
              onClick={() => setShowPatronModal(true)}
            >
              Add new patron
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="patrons-list__filter-panel">
            <div className="patrons-list__filter-grid">
              {/* Tags - multi-select checkboxes */}
              <div className="patrons-list__filter-group">
                <label className="patrons-list__filter-label">Tags</label>
                <div className="patrons-list__filter-checkbox-group">
                  {patronTags.map(tag => (
                    <label key={tag.id} className="patrons-list__filter-checkbox">
                      <input
                        type="checkbox"
                        checked={filterTags.includes(tag.id)}
                        onChange={() => toggleArrayFilter(filterTags, setFilterTags, tag.id)}
                      />
                      <span>{tag.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Membership - single select */}
              <div className="patrons-list__filter-group">
                <label className="patrons-list__filter-label">Membership</label>
                <select
                  className="patrons-list__filter-select"
                  value={filterMembership}
                  onChange={(e) => setFilterMembership(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="Gold">Gold</option>
                  <option value="Silver">Silver</option>
                  <option value="Basic">Basic</option>
                  <option value="none">No membership</option>
                </select>
              </div>

              {/* Engagement - multi-select checkboxes */}
              <div className="patrons-list__filter-group">
                <label className="patrons-list__filter-label">Engagement</label>
                <div className="patrons-list__filter-checkbox-group">
                  {engagementLevels.map(level => (
                    <label key={level.id} className="patrons-list__filter-checkbox">
                      <input
                        type="checkbox"
                        checked={filterEngagement.includes(level.id)}
                        onChange={() => toggleArrayFilter(filterEngagement, setFilterEngagement, level.id)}
                      />
                      <span>{level.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Patron Type - single select */}
              <div className="patrons-list__filter-group">
                <label className="patrons-list__filter-label">Patron Type</label>
                <select
                  className="patrons-list__filter-select"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="managed">Managed Prospect</option>
                  <option value="general">General Constituent</option>
                </select>
              </div>

              {/* Owner - dropdown */}
              <div className="patrons-list__filter-group">
                <label className="patrons-list__filter-label">Owner</label>
                <select
                  className="patrons-list__filter-select"
                  value={filterOwner}
                  onChange={(e) => setFilterOwner(e.target.value)}
                >
                  <option value="all">All</option>
                  {giftOfficers.map(officer => (
                    <option key={officer.id} value={officer.id}>{officer.name}</option>
                  ))}
                </select>
              </div>

              {/* Source - dropdown */}
              <div className="patrons-list__filter-group">
                <label className="patrons-list__filter-label">Source</label>
                <select
                  className="patrons-list__filter-select"
                  value={filterSource}
                  onChange={(e) => setFilterSource(e.target.value)}
                >
                  <option value="all">All</option>
                  {patronSources.map(source => (
                    <option key={source.id} value={source.id}>{source.label}</option>
                  ))}
                </select>
              </div>

              {/* Lifetime Value - range */}
              <div className="patrons-list__filter-group">
                <label className="patrons-list__filter-label">Lifetime Value</label>
                <div className="patrons-list__filter-range">
                  <input
                    type="number"
                    className="patrons-list__filter-input"
                    placeholder="Min"
                    value={filterLtvMin}
                    onChange={(e) => setFilterLtvMin(e.target.value)}
                    min="0"
                  />
                  <span className="patrons-list__filter-range-sep">–</span>
                  <input
                    type="number"
                    className="patrons-list__filter-input"
                    placeholder="Max"
                    value={filterLtvMax}
                    onChange={(e) => setFilterLtvMax(e.target.value)}
                    min="0"
                  />
                </div>
              </div>

              {/* Last Donation - dropdown */}
              <div className="patrons-list__filter-group">
                <label className="patrons-list__filter-label">Last Donation</label>
                <select
                  className="patrons-list__filter-select"
                  value={filterLastDonation}
                  onChange={(e) => setFilterLastDonation(e.target.value)}
                >
                  <option value="all">Any time</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="365">Last year</option>
                  <option value="over365">Over 1 year ago</option>
                  <option value="never">Never donated</option>
                </select>
              </div>
            </div>

            {/* Clear all */}
            {activeFilterCount > 0 && (
              <div className="patrons-list__filter-actions">
                <button
                  className="patrons-list__filter-clear"
                  onClick={handleClearAllFilters}
                >
                  <i className="fa-solid fa-xmark"></i>
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Active Filter Chips */}
        {activeFilterCount > 0 && (
          <div className="patrons-list__chips">
            {filterTags.length > 0 && (
              <span className="patrons-list__chip">
                Tags: {filterTags.map(t => {
                  const tag = patronTags.find(pt => pt.id === t)
                  return tag ? tag.label : t
                }).join(', ')}
                <button className="patrons-list__chip-remove" onClick={() => setFilterTags([])}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </span>
            )}
            {filterMembership !== 'all' && (
              <span className="patrons-list__chip">
                Membership: {filterMembership === 'none' ? 'None' : filterMembership}
                <button className="patrons-list__chip-remove" onClick={() => setFilterMembership('all')}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </span>
            )}
            {filterEngagement.length > 0 && (
              <span className="patrons-list__chip">
                Engagement: {filterEngagement.map(e => {
                  const level = engagementLevels.find(l => l.id === e)
                  return level ? level.label : e
                }).join(', ')}
                <button className="patrons-list__chip-remove" onClick={() => setFilterEngagement([])}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </span>
            )}
            {filterType !== 'all' && (
              <span className="patrons-list__chip">
                Type: {filterType === 'managed' ? 'Managed Prospect' : 'General Constituent'}
                <button className="patrons-list__chip-remove" onClick={() => setFilterType('all')}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </span>
            )}
            {filterOwner !== 'all' && (
              <span className="patrons-list__chip">
                Owner: {getStaffNameById(filterOwner)}
                <button className="patrons-list__chip-remove" onClick={() => setFilterOwner('all')}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </span>
            )}
            {filterSource !== 'all' && (
              <span className="patrons-list__chip">
                Source: {patronSources.find(s => s.id === filterSource)?.label || filterSource}
                <button className="patrons-list__chip-remove" onClick={() => setFilterSource('all')}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </span>
            )}
            {(filterLtvMin !== '' || filterLtvMax !== '') && (
              <span className="patrons-list__chip">
                LTV: {filterLtvMin !== '' ? formatCurrency(Number(filterLtvMin)) : '$0'}
                {' – '}
                {filterLtvMax !== '' ? formatCurrency(Number(filterLtvMax)) : 'any'}
                <button className="patrons-list__chip-remove" onClick={() => { setFilterLtvMin(''); setFilterLtvMax('') }}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </span>
            )}
            {filterLastDonation !== 'all' && (
              <span className="patrons-list__chip">
                Last Donation: {
                  { '30': 'Last 30 days', '90': 'Last 90 days', '365': 'Last year', 'over365': 'Over 1 year ago', 'never': 'Never' }[filterLastDonation]
                }
                <button className="patrons-list__chip-remove" onClick={() => setFilterLastDonation('all')}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </span>
            )}
            <button className="patrons-list__chips-clear" onClick={handleClearAllFilters}>
              Clear all
            </button>
          </div>
        )}

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
                const { tier: membershipTier, cardStyle: membershipCardStyle } = getMembershipInfo(patron)
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
                        <span 
                          className="patrons-list__membership"
                          style={membershipCardStyle ? {
                            color: membershipCardStyle.backgroundColor,
                            borderColor: membershipCardStyle.backgroundColor
                          } : undefined}
                        >
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
                      {patron.assignedToId ? (
                        <span className="patrons-list__owner">{getStaffNameById(patron.assignedToId)}</span>
                      ) : (
                        <button 
                          className="patrons-list__assign-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            setAssigningPatron({ id: patron.id, name: `${patron.firstName} ${patron.lastName}` })
                          }}
                        >
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
            {activeFilterCount > 0 && (
              <span className="patrons-list__count-filters">
                {' '} | Filtered by: {[
                  filterTags.length > 0 && 'Tags',
                  filterMembership !== 'all' && 'Membership',
                  filterEngagement.length > 0 && 'Engagement',
                  filterType !== 'all' && 'Type',
                  filterOwner !== 'all' && 'Owner',
                  filterSource !== 'all' && 'Source',
                  (filterLtvMin !== '' || filterLtvMax !== '') && 'LTV',
                  filterLastDonation !== 'all' && 'Last Donation',
                ].filter(Boolean).join(', ')}
              </span>
            )}
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
