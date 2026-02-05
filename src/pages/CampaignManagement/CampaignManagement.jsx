import { useState } from 'react'
import './CampaignManagement.css'

// Sample campaign data with DCAP hierarchy
const CAMPAIGNS = [
  {
    id: 'annual-2026',
    name: '2026 Annual Fund',
    fund: { id: 'annual-operating', name: 'Annual Operating Fund' },
    status: 'active',
    goal: 500000,
    raised: 215000,
    donorCount: 142,
    giftCount: 187,
    avgGift: 1150,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    manager: 'Jennifer Martinez',
    appeals: [
      { id: 'year-end-mailer', name: 'Year-End Direct Mail', raised: 85000, cost: 12000, responses: 234 },
      { id: 'spring-gala', name: 'Spring Gala 2026', raised: 95000, cost: 25000, responses: 156 },
      { id: 'membership-renewal', name: 'Membership Renewal', raised: 35000, cost: 2000, responses: 89 },
    ]
  },
  {
    id: 'building-future',
    name: 'Building the Future',
    fund: { id: 'capital-building', name: 'Capital Building Fund' },
    status: 'active',
    goal: 50000000,
    raised: 2750000,
    donorCount: 47,
    giftCount: 63,
    avgGift: 43651,
    startDate: '2025-01-01',
    endDate: '2028-12-31',
    manager: 'Liam Johnson',
    appeals: [
      { id: 'capital-kickoff', name: 'Campaign Kickoff', raised: 1500000, cost: 45000, responses: 28 },
      { id: 'leadership-gifts', name: 'Leadership Gifts Circle', raised: 1000000, cost: 8000, responses: 12 },
      { id: 'capital-mailer', name: 'Capital Campaign Mailer', raised: 250000, cost: 15000, responses: 23 },
    ]
  },
  {
    id: 'education-2026',
    name: 'Education Initiative 2026',
    fund: { id: 'education', name: 'Education Programs Fund' },
    status: 'active',
    goal: 150000,
    raised: 67500,
    donorCount: 89,
    giftCount: 112,
    avgGift: 603,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    manager: 'Robert Brown',
    appeals: [
      { id: 'school-partnership', name: 'School Partnership Drive', raised: 42000, cost: 3500, responses: 67 },
      { id: 'summer-camp', name: 'Summer Camp Sponsorships', raised: 25500, cost: 1500, responses: 45 },
    ]
  },
  {
    id: 'annual-2025',
    name: '2025 Annual Fund',
    fund: { id: 'annual-operating', name: 'Annual Operating Fund' },
    status: 'completed',
    goal: 450000,
    raised: 459000,
    donorCount: 328,
    giftCount: 412,
    avgGift: 1114,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    manager: 'Jennifer Martinez',
    appeals: [
      { id: 'year-end-2025', name: 'Year-End 2025', raised: 180000, cost: 11000, responses: 289 },
      { id: 'spring-2025', name: 'Spring Appeal 2025', raised: 150000, cost: 8000, responses: 203 },
      { id: 'online-2025', name: 'Online Giving', raised: 129000, cost: 500, responses: 178 },
    ]
  },
  {
    id: 'emergency-2024',
    name: 'Emergency Relief Fund',
    fund: { id: 'restricted', name: 'Restricted Funds' },
    status: 'completed',
    goal: 100000,
    raised: 127500,
    donorCount: 234,
    giftCount: 267,
    avgGift: 478,
    startDate: '2024-06-01',
    endDate: '2024-12-31',
    manager: 'Amanda Lee',
    appeals: [
      { id: 'emergency-email', name: 'Emergency Email Appeal', raised: 87500, cost: 200, responses: 198 },
      { id: 'matching-grant', name: 'Matching Grant Challenge', raised: 40000, cost: 500, responses: 69 },
    ]
  },
]

// Get unique funds for filter
const getFunds = () => {
  const funds = new Map()
  CAMPAIGNS.forEach(c => {
    if (!funds.has(c.fund.id)) {
      funds.set(c.fund.id, c.fund.name)
    }
  })
  return Array.from(funds, ([id, name]) => ({ id, name }))
}

// Format currency
const formatCurrency = (amount) => {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format full currency (for tooltips, details)
const formatCurrencyFull = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format date
const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// Calculate ROI
const calculateROI = (raised, cost) => {
  if (cost === 0) return '∞'
  return ((raised / cost)).toFixed(1) + 'x'
}

function CampaignManagement() {
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterFund, setFilterFund] = useState('all')
  const [expandedCampaign, setExpandedCampaign] = useState(null)

  const funds = getFunds()

  // Filter campaigns
  const filteredCampaigns = CAMPAIGNS.filter(c => {
    if (filterStatus !== 'all' && c.status !== filterStatus) return false
    if (filterFund !== 'all' && c.fund.id !== filterFund) return false
    return true
  })

  // Group campaigns by status
  const activeCampaigns = filteredCampaigns.filter(c => c.status === 'active')
  const completedCampaigns = filteredCampaigns.filter(c => c.status === 'completed')

  // Calculate totals
  const totalGoal = filteredCampaigns.reduce((sum, c) => sum + c.goal, 0)
  const totalRaised = filteredCampaigns.reduce((sum, c) => sum + c.raised, 0)
  const overallProgress = totalGoal > 0 ? (totalRaised / totalGoal) * 100 : 0

  // Toggle appeal expansion
  const toggleExpand = (campaignId) => {
    setExpandedCampaign(expandedCampaign === campaignId ? null : campaignId)
  }

  // Render a campaign card
  const renderCampaignCard = (campaign) => {
    const progress = (campaign.raised / campaign.goal) * 100
    const isExpanded = expandedCampaign === campaign.id
    const isOverGoal = progress >= 100

    return (
      <div key={campaign.id} className={`campaign-card ${isExpanded ? 'campaign-card--expanded' : ''}`}>
        {/* Card Header */}
        <div className="campaign-card__header">
          <div className="campaign-card__title-row">
            <h3 className="campaign-card__name">{campaign.name}</h3>
            {isOverGoal && (
              <span className="campaign-card__badge campaign-card__badge--success">
                <i className="fa-solid fa-check"></i> Goal Met
              </span>
            )}
          </div>
          <span className="campaign-card__fund">{campaign.fund.name}</span>
        </div>

        {/* Progress Section */}
        <div className="campaign-card__progress">
          <div className="campaign-card__progress-header">
            <span className="campaign-card__raised">{formatCurrencyFull(campaign.raised)}</span>
            <span className="campaign-card__goal">of {formatCurrencyFull(campaign.goal)} goal</span>
          </div>
          <div className="campaign-card__progress-bar">
            <div 
              className={`campaign-card__progress-fill ${isOverGoal ? 'campaign-card__progress-fill--success' : ''}`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <span className="campaign-card__progress-percent">{progress.toFixed(1)}%</span>
        </div>

        {/* Stats Grid */}
        <div className="campaign-card__stats">
          <div className="campaign-card__stat">
            <span className="campaign-card__stat-value">{campaign.donorCount}</span>
            <span className="campaign-card__stat-label">Donors</span>
          </div>
          <div className="campaign-card__stat">
            <span className="campaign-card__stat-value">{campaign.giftCount}</span>
            <span className="campaign-card__stat-label">Gifts</span>
          </div>
          <div className="campaign-card__stat">
            <span className="campaign-card__stat-value">{formatCurrency(campaign.avgGift)}</span>
            <span className="campaign-card__stat-label">Avg Gift</span>
          </div>
        </div>

        {/* Timeline & Manager */}
        <div className="campaign-card__meta">
          <div className="campaign-card__dates">
            <i className="fa-solid fa-calendar"></i>
            <span>{formatDate(campaign.startDate)} — {formatDate(campaign.endDate)}</span>
          </div>
          <div className="campaign-card__manager">
            <i className="fa-solid fa-user"></i>
            <span>{campaign.manager}</span>
          </div>
        </div>

        {/* Expand Toggle */}
        <button 
          className="campaign-card__expand-btn"
          onClick={() => toggleExpand(campaign.id)}
        >
          <span>{isExpanded ? 'Hide Appeals' : `View Appeals (${campaign.appeals.length})`}</span>
          <i className={`fa-solid fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
        </button>

        {/* Appeals Section (Expandable) */}
        {isExpanded && (
          <div className="campaign-card__appeals">
            <div className="campaign-card__appeals-header">
              <span>Appeal</span>
              <span>Raised</span>
              <span>Cost</span>
              <span>ROI</span>
            </div>
            {campaign.appeals.map(appeal => (
              <div key={appeal.id} className="campaign-card__appeal">
                <span className="campaign-card__appeal-name">
                  <i className="fa-solid fa-paper-plane"></i>
                  {appeal.name}
                </span>
                <span className="campaign-card__appeal-raised">{formatCurrency(appeal.raised)}</span>
                <span className="campaign-card__appeal-cost">{formatCurrency(appeal.cost)}</span>
                <span className={`campaign-card__appeal-roi ${parseFloat(calculateROI(appeal.raised, appeal.cost)) >= 5 ? 'campaign-card__appeal-roi--good' : ''}`}>
                  {calculateROI(appeal.raised, appeal.cost)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="campaign-management">
      {/* Page Header */}
      <div className="campaign-management__header">
        <div className="campaign-management__breadcrumb">
          <span className="campaign-management__breadcrumb-section">Fundraising</span>
          <i className="fa-solid fa-chevron-right campaign-management__breadcrumb-separator"></i>
        </div>
        <h1 className="campaign-management__title">Campaigns</h1>
      </div>

      {/* Main Content Container */}
      <div className="campaign-management__container">
        {/* Toolbar */}
        <div className="campaign-management__toolbar">
          {/* Aggregate Stats */}
          <div className="campaign-management__totals">
            <div className="campaign-management__total-item">
              <span className="campaign-management__total-label">Total Goal</span>
              <span className="campaign-management__total-value">{formatCurrency(totalGoal)}</span>
            </div>
            <div className="campaign-management__total-item">
              <span className="campaign-management__total-label">Raised</span>
              <span className="campaign-management__total-value campaign-management__total-value--primary">{formatCurrency(totalRaised)}</span>
            </div>
            <div className="campaign-management__total-item">
              <span className="campaign-management__total-label">Progress</span>
              <span className="campaign-management__total-value">{overallProgress.toFixed(1)}%</span>
            </div>
          </div>

          {/* Filters */}
          <div className="campaign-management__filters">
            <div className="campaign-management__filter">
              <label className="campaign-management__filter-label">Status</label>
              <select
                className="campaign-management__filter-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Campaigns</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="campaign-management__filter">
              <label className="campaign-management__filter-label">Fund</label>
              <select
                className="campaign-management__filter-select"
                value={filterFund}
                onChange={(e) => setFilterFund(e.target.value)}
              >
                <option value="all">All Funds</option>
                {funds.map(fund => (
                  <option key={fund.id} value={fund.id}>{fund.name}</option>
                ))}
              </select>
            </div>
            <button className="campaign-management__add-btn">
              <i className="fa-solid fa-plus"></i>
              New Campaign
            </button>
          </div>
        </div>

        {/* Campaign Groups */}
        {activeCampaigns.length > 0 && (
          <div className="campaign-management__group">
            <h2 className="campaign-management__group-title">
              <span className="campaign-management__group-status campaign-management__group-status--active"></span>
              Active Campaigns
              <span className="campaign-management__group-count">{activeCampaigns.length}</span>
            </h2>
            <div className="campaign-management__grid">
              {activeCampaigns.map(campaign => renderCampaignCard(campaign))}
            </div>
          </div>
        )}

        {completedCampaigns.length > 0 && (
          <div className="campaign-management__group">
            <h2 className="campaign-management__group-title">
              <span className="campaign-management__group-status campaign-management__group-status--completed"></span>
              Completed Campaigns
              <span className="campaign-management__group-count">{completedCampaigns.length}</span>
            </h2>
            <div className="campaign-management__grid">
              {completedCampaigns.map(campaign => renderCampaignCard(campaign))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredCampaigns.length === 0 && (
          <div className="campaign-management__empty">
            <i className="fa-solid fa-bullseye"></i>
            <h3>No campaigns found</h3>
            <p>Try adjusting your filters or create a new campaign.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CampaignManagement
