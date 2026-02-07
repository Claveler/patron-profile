import { useState } from 'react'
import { formatDate } from '../../data/patrons'
import { FUNDS, getAllCampaignsResolved } from '../../data/campaigns'
import './CampaignManagement.css'

// Get unique funds for filter (from canonical FUNDS source)
const getFunds = () => FUNDS

// Use resolved campaigns (fund/manager names populated from IDs)
const CAMPAIGNS = getAllCampaignsResolved()

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

// formatDate imported from shared utility

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
              New campaign
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
