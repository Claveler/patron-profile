import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { GIFTS, getPatronById, getAcknowledgmentsByGiftId, formatDate } from '../../data/patrons'
import { FUNDS, CAMPAIGNS, getFundNameById, getCampaignNameById } from '../../data/campaigns'
import GiftDetailPanel from '../../components/GiftDetailPanel/GiftDetailPanel'
import './GiftsList.css'

const formatCurrency = (amount) => {
  if (amount == null) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

const formatCurrencyShort = (amount) => {
  if (amount == null) return '$0'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const typeConfig = {
  'one-time': { label: 'One-Time', className: 'gifts-list__type-badge--one-time' },
  membership: { label: 'Membership', className: 'gifts-list__type-badge--membership' },
  'pledge-payment': { label: 'Pledge', className: 'gifts-list__type-badge--pledge' },
  recurring: { label: 'Recurring', className: 'gifts-list__type-badge--recurring' },
}

const giftTypes = [
  { id: 'one-time', label: 'One-Time' },
  { id: 'membership', label: 'Membership' },
  { id: 'pledge-payment', label: 'Pledge Payment' },
  { id: 'recurring', label: 'Recurring' },
]

const getAckStatus = (giftId) => {
  const acks = getAcknowledgmentsByGiftId(giftId)
  if (acks.length === 0) return 'none'
  const hasPending = acks.some(a => a.status === 'pending')
  const hasSent = acks.some(a => a.status === 'sent')
  if (hasPending && !hasSent) return 'pending'
  if (hasSent) return 'acknowledged'
  return 'none'
}

const ackIcons = {
  acknowledged: { icon: 'fa-circle-check', className: 'gifts-list__ack--acknowledged', title: 'Acknowledged' },
  pending: { icon: 'fa-clock', className: 'gifts-list__ack--pending', title: 'Pending' },
  none: { icon: 'fa-minus', className: 'gifts-list__ack--none', title: 'No acknowledgment' },
}

function GiftsList() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState('date')
  const [sortDirection, setSortDirection] = useState('desc')
  const [selectedGift, setSelectedGift] = useState(null)

  // Filter state
  const [showFilters, setShowFilters] = useState(false)
  const [filterTypes, setFilterTypes] = useState([])
  const [filterFund, setFilterFund] = useState('all')
  const [filterCampaign, setFilterCampaign] = useState('all')
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [filterDateTo, setFilterDateTo] = useState('')
  const [filterAmountMin, setFilterAmountMin] = useState('')
  const [filterAmountMax, setFilterAmountMax] = useState('')
  const [filterAck, setFilterAck] = useState('all')

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filterTypes.length > 0) count++
    if (filterFund !== 'all') count++
    if (filterCampaign !== 'all') count++
    if (filterDateFrom || filterDateTo) count++
    if (filterAmountMin || filterAmountMax) count++
    if (filterAck !== 'all') count++
    return count
  }, [filterTypes, filterFund, filterCampaign, filterDateFrom, filterDateTo, filterAmountMin, filterAmountMax, filterAck])

  const handleClearAllFilters = () => {
    setFilterTypes([])
    setFilterFund('all')
    setFilterCampaign('all')
    setFilterDateFrom('')
    setFilterDateTo('')
    setFilterAmountMin('')
    setFilterAmountMax('')
    setFilterAck('all')
  }

  const toggleTypeFilter = (typeId) => {
    setFilterTypes(prev =>
      prev.includes(typeId) ? prev.filter(t => t !== typeId) : [...prev, typeId]
    )
  }

  // Filter and sort gifts
  const filteredGifts = useMemo(() => {
    let result = [...GIFTS]

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(gift => {
        const patron = getPatronById(gift.patronId)
        const patronName = patron ? `${patron.firstName} ${patron.lastName}`.toLowerCase() : ''
        return (
          patronName.includes(term) ||
          (gift.description || '').toLowerCase().includes(term)
        )
      })
    }

    // Filter by type
    if (filterTypes.length > 0) {
      result = result.filter(g => filterTypes.includes(g.type))
    }

    // Filter by fund
    if (filterFund !== 'all') {
      result = result.filter(g => g.fundId === filterFund)
    }

    // Filter by campaign
    if (filterCampaign !== 'all') {
      result = result.filter(g => g.campaignId === filterCampaign)
    }

    // Filter by date range
    if (filterDateFrom) {
      result = result.filter(g => g.date >= filterDateFrom)
    }
    if (filterDateTo) {
      result = result.filter(g => g.date <= filterDateTo)
    }

    // Filter by amount range
    if (filterAmountMin !== '') {
      result = result.filter(g => g.amount >= Number(filterAmountMin))
    }
    if (filterAmountMax !== '') {
      result = result.filter(g => g.amount <= Number(filterAmountMax))
    }

    // Filter by acknowledgment status
    if (filterAck !== 'all') {
      result = result.filter(g => getAckStatus(g.id) === filterAck)
    }

    // Sort
    result.sort((a, b) => {
      let aVal, bVal
      switch (sortField) {
        case 'date':
          aVal = a.date
          bVal = b.date
          break
        case 'patron': {
          const pA = getPatronById(a.patronId)
          const pB = getPatronById(b.patronId)
          aVal = pA ? `${pA.lastName} ${pA.firstName}`.toLowerCase() : ''
          bVal = pB ? `${pB.lastName} ${pB.firstName}`.toLowerCase() : ''
          break
        }
        case 'amount':
          aVal = a.amount
          bVal = b.amount
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
  }, [searchTerm, sortField, sortDirection, filterTypes, filterFund, filterCampaign, filterDateFrom, filterDateTo, filterAmountMin, filterAmountMax, filterAck])

  // Summary stats
  const totalAmount = filteredGifts.reduce((sum, g) => sum + g.amount, 0)
  const avgGift = filteredGifts.length > 0 ? totalAmount / filteredGifts.length : 0

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection(field === 'date' ? 'desc' : 'asc')
    }
  }

  const handlePatronClick = (e, patronId) => {
    e.stopPropagation()
    navigate(`/patrons/${patronId}`)
  }

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Date', 'Patron', 'Description', 'Type', 'Fund', 'Campaign', 'Amount', 'Deductible', 'Benefits Value', 'Acknowledgment']
    const rows = filteredGifts.map(g => {
      const patron = getPatronById(g.patronId)
      return [
        g.date,
        patron ? `${patron.firstName} ${patron.lastName}` : g.patronId,
        g.description || '',
        g.type,
        getFundNameById(g.fundId),
        g.campaignId ? getCampaignNameById(g.campaignId) : '',
        g.amount,
        g.deductible || 0,
        g.benefitsValue || 0,
        getAckStatus(g.id),
      ]
    })
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
    link.download = `gifts-export-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="gifts-list">
      {/* Page Header */}
      <div className="gifts-list__header">
        <div className="gifts-list__breadcrumb">
          <span className="gifts-list__breadcrumb-section">Fundraising</span>
          <i className="fa-solid fa-chevron-right gifts-list__breadcrumb-separator"></i>
        </div>
        <h1 className="gifts-list__title">Gifts</h1>
      </div>

      {/* Main Content */}
      <div className="gifts-list__container">
        {/* Toolbar */}
        <div className="gifts-list__toolbar">
          <div className="gifts-list__search">
            <i className="fa-solid fa-magnifying-glass gifts-list__search-icon"></i>
            <input
              type="text"
              placeholder="Search by patron name or description"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="gifts-list__search-input"
            />
          </div>
          <div className="gifts-list__actions">
            <button
              className="gifts-list__export-btn"
              onClick={handleExportCSV}
              disabled={filteredGifts.length === 0}
            >
              <i className="fa-solid fa-download"></i>
              Export ({filteredGifts.length})
            </button>
            <button
              className={`gifts-list__filter-btn ${activeFilterCount > 0 ? 'gifts-list__filter-btn--active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <i className="fa-solid fa-sliders"></i>
              Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="gifts-list__filter-panel">
            <div className="gifts-list__filter-grid">
              {/* Date Range */}
              <div className="gifts-list__filter-group">
                <label className="gifts-list__filter-label">Date Range</label>
                <div className="gifts-list__filter-range">
                  <input
                    type="date"
                    className="gifts-list__filter-input"
                    value={filterDateFrom}
                    onChange={(e) => setFilterDateFrom(e.target.value)}
                  />
                  <span className="gifts-list__filter-range-sep">–</span>
                  <input
                    type="date"
                    className="gifts-list__filter-input"
                    value={filterDateTo}
                    onChange={(e) => setFilterDateTo(e.target.value)}
                  />
                </div>
              </div>

              {/* Gift Type */}
              <div className="gifts-list__filter-group">
                <label className="gifts-list__filter-label">Gift Type</label>
                <div className="gifts-list__filter-checkbox-group">
                  {giftTypes.map(type => (
                    <label key={type.id} className="gifts-list__filter-checkbox">
                      <input
                        type="checkbox"
                        checked={filterTypes.includes(type.id)}
                        onChange={() => toggleTypeFilter(type.id)}
                      />
                      <span>{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Fund */}
              <div className="gifts-list__filter-group">
                <label className="gifts-list__filter-label">Fund</label>
                <select
                  className="gifts-list__filter-select"
                  value={filterFund}
                  onChange={(e) => setFilterFund(e.target.value)}
                >
                  <option value="all">All Funds</option>
                  {FUNDS.map(fund => (
                    <option key={fund.id} value={fund.id}>{fund.name}</option>
                  ))}
                </select>
              </div>

              {/* Campaign */}
              <div className="gifts-list__filter-group">
                <label className="gifts-list__filter-label">Campaign</label>
                <select
                  className="gifts-list__filter-select"
                  value={filterCampaign}
                  onChange={(e) => setFilterCampaign(e.target.value)}
                >
                  <option value="all">All Campaigns</option>
                  {CAMPAIGNS.map(camp => (
                    <option key={camp.id} value={camp.id}>{camp.name}</option>
                  ))}
                </select>
              </div>

              {/* Amount Range */}
              <div className="gifts-list__filter-group">
                <label className="gifts-list__filter-label">Amount</label>
                <div className="gifts-list__filter-range">
                  <input
                    type="number"
                    className="gifts-list__filter-input"
                    placeholder="Min"
                    value={filterAmountMin}
                    onChange={(e) => setFilterAmountMin(e.target.value)}
                    min="0"
                  />
                  <span className="gifts-list__filter-range-sep">–</span>
                  <input
                    type="number"
                    className="gifts-list__filter-input"
                    placeholder="Max"
                    value={filterAmountMax}
                    onChange={(e) => setFilterAmountMax(e.target.value)}
                    min="0"
                  />
                </div>
              </div>

              {/* Acknowledgment Status */}
              <div className="gifts-list__filter-group">
                <label className="gifts-list__filter-label">Acknowledgment</label>
                <select
                  className="gifts-list__filter-select"
                  value={filterAck}
                  onChange={(e) => setFilterAck(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="acknowledged">Acknowledged</option>
                  <option value="pending">Pending</option>
                  <option value="none">None</option>
                </select>
              </div>
            </div>

            {activeFilterCount > 0 && (
              <div className="gifts-list__filter-actions">
                <button className="gifts-list__filter-clear" onClick={handleClearAllFilters}>
                  <i className="fa-solid fa-xmark"></i>
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Active Filter Chips */}
        {activeFilterCount > 0 && (
          <div className="gifts-list__chips">
            {filterTypes.length > 0 && (
              <span className="gifts-list__chip">
                Type: {filterTypes.map(t => giftTypes.find(gt => gt.id === t)?.label || t).join(', ')}
                <button className="gifts-list__chip-remove" onClick={() => setFilterTypes([])}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </span>
            )}
            {filterFund !== 'all' && (
              <span className="gifts-list__chip">
                Fund: {getFundNameById(filterFund)}
                <button className="gifts-list__chip-remove" onClick={() => setFilterFund('all')}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </span>
            )}
            {filterCampaign !== 'all' && (
              <span className="gifts-list__chip">
                Campaign: {getCampaignNameById(filterCampaign)}
                <button className="gifts-list__chip-remove" onClick={() => setFilterCampaign('all')}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </span>
            )}
            {(filterDateFrom || filterDateTo) && (
              <span className="gifts-list__chip">
                Date: {filterDateFrom || 'any'} – {filterDateTo || 'any'}
                <button className="gifts-list__chip-remove" onClick={() => { setFilterDateFrom(''); setFilterDateTo('') }}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </span>
            )}
            {(filterAmountMin || filterAmountMax) && (
              <span className="gifts-list__chip">
                Amount: {filterAmountMin ? formatCurrencyShort(Number(filterAmountMin)) : '$0'}
                {' – '}
                {filterAmountMax ? formatCurrencyShort(Number(filterAmountMax)) : 'any'}
                <button className="gifts-list__chip-remove" onClick={() => { setFilterAmountMin(''); setFilterAmountMax('') }}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </span>
            )}
            {filterAck !== 'all' && (
              <span className="gifts-list__chip">
                Acknowledgment: {filterAck.charAt(0).toUpperCase() + filterAck.slice(1)}
                <button className="gifts-list__chip-remove" onClick={() => setFilterAck('all')}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </span>
            )}
            <button className="gifts-list__chips-clear" onClick={handleClearAllFilters}>
              Clear all
            </button>
          </div>
        )}

        {/* Summary Stats */}
        <div className="gifts-list__stats">
          <div className="gifts-list__stat">
            <span className="gifts-list__stat-value">{filteredGifts.length}</span>
            <span className="gifts-list__stat-label">Total Gifts</span>
          </div>
          <div className="gifts-list__stat">
            <span className="gifts-list__stat-value">{formatCurrencyShort(totalAmount)}</span>
            <span className="gifts-list__stat-label">Total Amount</span>
          </div>
          <div className="gifts-list__stat">
            <span className="gifts-list__stat-value">{formatCurrencyShort(avgGift)}</span>
            <span className="gifts-list__stat-label">Average Gift</span>
          </div>
        </div>

        {/* Table */}
        <div className="gifts-list__table-wrapper">
          <table className="gifts-list__table">
            <thead>
              <tr>
                <th
                  className="gifts-list__th gifts-list__th--sortable"
                  onClick={() => handleSort('date')}
                >
                  Date
                  <i className={`fa-solid fa-sort gifts-list__sort-icon ${sortField === 'date' ? 'gifts-list__sort-icon--active' : ''}`}></i>
                </th>
                <th
                  className="gifts-list__th gifts-list__th--sortable"
                  onClick={() => handleSort('patron')}
                >
                  Patron
                  <i className={`fa-solid fa-sort gifts-list__sort-icon ${sortField === 'patron' ? 'gifts-list__sort-icon--active' : ''}`}></i>
                </th>
                <th className="gifts-list__th">Description</th>
                <th className="gifts-list__th">Type</th>
                <th className="gifts-list__th">Fund</th>
                <th className="gifts-list__th">Campaign</th>
                <th
                  className="gifts-list__th gifts-list__th--sortable gifts-list__th--right"
                  onClick={() => handleSort('amount')}
                >
                  Amount
                  <i className={`fa-solid fa-sort gifts-list__sort-icon ${sortField === 'amount' ? 'gifts-list__sort-icon--active' : ''}`}></i>
                </th>
                <th className="gifts-list__th gifts-list__th--center">Ack</th>
              </tr>
            </thead>
            <tbody>
              {filteredGifts.map(gift => {
                const patron = getPatronById(gift.patronId)
                const type = typeConfig[gift.type] || typeConfig['one-time']
                const fundName = getFundNameById(gift.fundId)
                const campaignName = gift.campaignId ? getCampaignNameById(gift.campaignId) : null
                const ackStatus = getAckStatus(gift.id)
                const ack = ackIcons[ackStatus]

                return (
                  <tr
                    key={gift.id}
                    className={`gifts-list__row ${selectedGift?.id === gift.id ? 'gifts-list__row--selected' : ''}`}
                    onClick={() => setSelectedGift(gift)}
                  >
                    <td className="gifts-list__td gifts-list__td--date">{formatDate(gift.date)}</td>
                    <td className="gifts-list__td gifts-list__td--patron">
                      {patron ? (
                        <button
                          className="gifts-list__patron-link"
                          onClick={(e) => handlePatronClick(e, patron.id)}
                        >
                          {patron.firstName} {patron.lastName}
                        </button>
                      ) : (
                        <span className="gifts-list__patron-unknown">{gift.patronId}</span>
                      )}
                    </td>
                    <td className="gifts-list__td gifts-list__td--description">{gift.description}</td>
                    <td className="gifts-list__td">
                      <span className={`gifts-list__type-badge ${type.className}`}>
                        {type.label}
                      </span>
                    </td>
                    <td className="gifts-list__td gifts-list__td--fund">{fundName || '—'}</td>
                    <td className="gifts-list__td gifts-list__td--campaign">{campaignName || '—'}</td>
                    <td className="gifts-list__td gifts-list__td--amount">{formatCurrency(gift.amount)}</td>
                    <td className="gifts-list__td gifts-list__td--ack">
                      <i
                        className={`fa-solid ${ack.icon} ${ack.className}`}
                        title={ack.title}
                      ></i>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="gifts-list__footer">
          <span className="gifts-list__count">
            Showing {filteredGifts.length} of {GIFTS.length} gifts
            {activeFilterCount > 0 && (
              <span className="gifts-list__count-filters">
                {' '} | {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} applied
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Gift Detail Slide-Out Panel */}
      {selectedGift && (
        <GiftDetailPanel
          gift={selectedGift}
          onClose={() => setSelectedGift(null)}
        />
      )}
    </div>
  )
}

export default GiftsList
