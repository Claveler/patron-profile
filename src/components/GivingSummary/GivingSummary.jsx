import { useState } from 'react'
import './GivingSummary.css'

// Sample monthly data for chart
const monthlyData = [
  { month: 'Jan', donations: 150, revenue: 80 },
  { month: 'Feb', donations: 200, revenue: 120 },
  { month: 'Mar', donations: 180, revenue: 100 },
  { month: 'Apr', donations: 350, revenue: 200 },
  { month: 'May', donations: 250, revenue: 150 },
  { month: 'Jun', donations: 400, revenue: 180 },
  { month: 'Jul', donations: 220, revenue: 140 },
  { month: 'Aug', donations: 280, revenue: 160 },
  { month: 'Sep', donations: 320, revenue: 190 },
  { month: 'Oct', donations: 200, revenue: 120 },
  { month: 'Nov', donations: 380, revenue: 170 },
  { month: 'Dec', donations: 450, revenue: 220 },
]

function GivingSummary({ giving }) {
  const [selectedPeriod, setSelectedPeriod] = useState('12-months')
  const [hoveredBar, setHoveredBar] = useState(null)
  
  // Calculate max value for chart scaling
  const maxValue = Math.max(...monthlyData.map(d => d.donations + d.revenue))
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  return (
    <div className="giving-summary">
      {/* Header */}
      <div className="giving-summary__header">
        <h3 className="giving-summary__title">Financial Summary</h3>
        <div className="giving-summary__controls">
          <select 
            className="giving-summary__period-select"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="12-months">Last 12 months</option>
            <option value="6-months">Last 6 months</option>
            <option value="ytd">Year to date</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>

      {/* Hero Stat - Lifetime Value */}
      <div className="giving-summary__hero">
        <span className="giving-summary__hero-label">Lifetime Value</span>
        <span className="giving-summary__hero-value">
          {formatCurrency(giving.lifetimeValue)}
        </span>
      </div>

      {/* Donations vs Revenue Split */}
      <div className="giving-summary__value-split">
        <div className="giving-summary__value-card giving-summary__value-card--donations">
          <div className="giving-summary__value-card-header">
            <span className="giving-summary__value-dot giving-summary__value-dot--donations"></span>
            <span className="giving-summary__value-card-label">Donations</span>
          </div>
          <span className="giving-summary__value-card-amount">{formatCurrency(giving.donations)}</span>
          <span className="giving-summary__value-card-detail">
            Avg Gift: {formatCurrency(giving.averageGift)}
          </span>
        </div>
        <div className="giving-summary__value-card giving-summary__value-card--revenue">
          <div className="giving-summary__value-card-header">
            <span className="giving-summary__value-dot giving-summary__value-dot--revenue"></span>
            <span className="giving-summary__value-card-label">Revenue</span>
          </div>
          <span className="giving-summary__value-card-amount">{formatCurrency(giving.revenue)}</span>
          <span className="giving-summary__value-card-detail">
            Tickets, F&B, Merch
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="giving-summary__chart">
        <div className="giving-summary__chart-bars">
          {monthlyData.map((data, index) => {
            const donationHeight = (data.donations / maxValue) * 100
            const revenueHeight = (data.revenue / maxValue) * 100
            const isHovered = hoveredBar === index
            
            return (
              <div 
                key={index}
                className={`giving-summary__chart-bar-group ${isHovered ? 'giving-summary__chart-bar-group--hovered' : ''}`}
                onMouseEnter={() => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                <div className="giving-summary__chart-bar-stack">
                  <div 
                    className="giving-summary__chart-bar giving-summary__chart-bar--donations"
                    style={{ height: `${donationHeight}%` }}
                  ></div>
                  <div 
                    className="giving-summary__chart-bar giving-summary__chart-bar--revenue"
                    style={{ height: `${revenueHeight}%` }}
                  ></div>
                </div>
                <span className="giving-summary__chart-label">{data.month}</span>
                
                {isHovered && (
                  <div className="giving-summary__chart-tooltip">
                    <div className="giving-summary__chart-tooltip-row">
                      <span>Donations:</span>
                      <span>{formatCurrency(data.donations)}</span>
                    </div>
                    <div className="giving-summary__chart-tooltip-row">
                      <span>Revenue:</span>
                      <span>{formatCurrency(data.revenue)}</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Transaction Stats */}
      <div className="giving-summary__transactions">
        <div className="giving-summary__transaction-stat">
          <span className="giving-summary__transaction-label">First Transaction</span>
          <div className="giving-summary__transaction-value">
            <span className="giving-summary__transaction-amount">{formatCurrency(giving.firstTransaction.amount)}</span>
            <span className="giving-summary__transaction-date">{giving.firstTransaction.date}</span>
          </div>
        </div>
        <div className="giving-summary__transaction-stat">
          <span className="giving-summary__transaction-label">Last Transaction</span>
          <div className="giving-summary__transaction-value">
            <span className="giving-summary__transaction-amount">{formatCurrency(giving.lastTransaction.amount)}</span>
            <span className="giving-summary__transaction-date">{giving.lastTransaction.date}</span>
          </div>
        </div>
        <div className="giving-summary__transaction-stat">
          <span className="giving-summary__transaction-label">Largest Transaction</span>
          <div className="giving-summary__transaction-value">
            <span className="giving-summary__transaction-amount giving-summary__transaction-amount--highlight">{formatCurrency(giving.largestTransaction.amount)}</span>
            <span className="giving-summary__transaction-date">{giving.largestTransaction.date}</span>
          </div>
        </div>
      </div>

      {/* Donation Attribution Section */}
      <div className="giving-summary__attribution">
        <h4 className="giving-summary__attribution-header">Donation Attribution</h4>
        <div className="giving-summary__breakdowns">
          {/* Fund Breakdown */}
          <div className="giving-summary__breakdown">
            <h5 className="giving-summary__breakdown-title">By Fund</h5>
            <div className="giving-summary__breakdown-list">
              {giving.byFund && Object.entries(giving.byFund).map(([id, fund]) => {
                const percentage = (fund.total / giving.donations) * 100
                return (
                  <div key={id} className="giving-summary__breakdown-item">
                    <div className="giving-summary__breakdown-header">
                      <span className="giving-summary__breakdown-name">{fund.name}</span>
                      <span className="giving-summary__breakdown-amount">{formatCurrency(fund.total)}</span>
                    </div>
                    <div className="giving-summary__breakdown-bar">
                      <div 
                        className="giving-summary__breakdown-bar-fill giving-summary__breakdown-bar-fill--fund"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="giving-summary__breakdown-percent">{percentage.toFixed(0)}%</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Campaign Breakdown */}
          <div className="giving-summary__breakdown">
            <h5 className="giving-summary__breakdown-title">By Campaign</h5>
            <div className="giving-summary__breakdown-list">
              {giving.byCampaign && Object.entries(giving.byCampaign).map(([id, campaign]) => {
                const percentage = (campaign.total / giving.donations) * 100
                return (
                  <div key={id} className="giving-summary__breakdown-item">
                    <div className="giving-summary__breakdown-header">
                      <span className="giving-summary__breakdown-name">{campaign.name}</span>
                      <span className="giving-summary__breakdown-amount">{formatCurrency(campaign.total)}</span>
                    </div>
                    <div className="giving-summary__breakdown-bar">
                      <div 
                        className="giving-summary__breakdown-bar-fill giving-summary__breakdown-bar-fill--campaign"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="giving-summary__breakdown-percent">{percentage.toFixed(0)}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GivingSummary
