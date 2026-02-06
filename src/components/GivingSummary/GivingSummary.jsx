import { useState, useMemo } from 'react'
import './GivingSummary.css'

// Sample monthly data for chart (with year for proper labels)
const monthlyData = [
  { month: 'Jan', year: '25', donations: 150, revenue: 80 },
  { month: 'Feb', year: '25', donations: 200, revenue: 120 },
  { month: 'Mar', year: '25', donations: 180, revenue: 100 },
  { month: 'Apr', year: '25', donations: 350, revenue: 200 },
  { month: 'May', year: '25', donations: 250, revenue: 150 },
  { month: 'Jun', year: '25', donations: 400, revenue: 180 },
  { month: 'Jul', year: '25', donations: 220, revenue: 140 },
  { month: 'Aug', year: '25', donations: 280, revenue: 160 },
  { month: 'Sep', year: '25', donations: 320, revenue: 190 },
  { month: 'Oct', year: '25', donations: 200, revenue: 120 },
  { month: 'Nov', year: '25', donations: 380, revenue: 170 },
  { month: 'Dec', year: '25', donations: 450, revenue: 220 },
]

function GivingSummary({ giving }) {
  const [selectedPeriod, setSelectedPeriod] = useState('12-months')
  const [hoveredLine, setHoveredLine] = useState(null) // 'total' | 'revenue' | null
  const [hoveredPointIndex, setHoveredPointIndex] = useState(null)
  const [chartView, setChartView] = useState('cumulative') // 'cumulative' | 'nominal'

  // Early return if no giving data
  if (!giving) {
    return (
      <div className="giving-summary">
        <div className="giving-summary__header">
          <h3 className="giving-summary__title">Financial Summary</h3>
        </div>
        <div className="giving-summary__empty">
          <i className="fa-solid fa-chart-pie"></i>
          <p>No financial data available</p>
        </div>
      </div>
    )
  }
  
  // Calculate cumulative data
  const cumulativeData = useMemo(() => {
    let runningDonations = 0
    let runningRevenue = 0
    return monthlyData.map(d => {
      runningDonations += d.donations
      runningRevenue += d.revenue
      return {
        ...d,
        cumDonations: runningDonations,
        cumRevenue: runningRevenue
      }
    })
  }, [])
  
  // Get chart data based on view mode
  const chartData = useMemo(() => {
    if (chartView === 'cumulative') {
      return cumulativeData.map(d => ({
        ...d,
        displayDonations: d.cumDonations,
        displayRevenue: d.cumRevenue
      }))
    }
    return monthlyData.map(d => ({
      ...d,
      displayDonations: d.donations,
      displayRevenue: d.revenue
    }))
  }, [chartView, cumulativeData])
  
  // Calculate max value for chart scaling (with padding)
  const maxValue = useMemo(() => {
    const max = Math.max(...chartData.map(d => d.displayDonations + d.displayRevenue))
    // Round up to nice number for Y-axis
    const magnitude = Math.pow(10, Math.floor(Math.log10(max)))
    return Math.ceil(max / magnitude) * magnitude
  }, [chartData])
  
  // Generate Y-axis ticks
  const yAxisTicks = useMemo(() => {
    const tickCount = 6
    const step = maxValue / (tickCount - 1)
    return Array.from({ length: tickCount }, (_, i) => Math.round(maxValue - i * step))
  }, [maxValue])
  
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
          <span className="giving-summary__value-card-amount">{formatCurrency(giving.donations || 0)}</span>
          {giving.averageGift && (
            <span className="giving-summary__value-card-detail">
              Avg Gift: {formatCurrency(giving.averageGift)}
            </span>
          )}
        </div>
        <div className="giving-summary__value-card giving-summary__value-card--revenue">
          <div className="giving-summary__value-card-header">
            <span className="giving-summary__value-dot giving-summary__value-dot--revenue"></span>
            <span className="giving-summary__value-card-label">Revenue</span>
          </div>
          <span className="giving-summary__value-card-amount">{formatCurrency(giving.revenue || 0)}</span>
          <span className="giving-summary__value-card-detail">
            Tickets, F&B, Merch
          </span>
        </div>
      </div>

      {/* Stacked Area Chart */}
      <div className="giving-summary__chart">
        {/* View Toggle */}
        <div className="giving-summary__chart-header">
          <div className="giving-summary__view-toggle">
            <button
              className={`giving-summary__view-btn ${chartView === 'cumulative' ? 'giving-summary__view-btn--active' : ''}`}
              onClick={() => setChartView('cumulative')}
              title="Cumulative view"
            >
              <i className="fa-solid fa-chart-line"></i>
            </button>
            <button
              className={`giving-summary__view-btn ${chartView === 'nominal' ? 'giving-summary__view-btn--active' : ''}`}
              onClick={() => setChartView('nominal')}
              title="Monthly view"
            >
              <i className="fa-solid fa-chart-bar"></i>
            </button>
          </div>
        </div>
        
        {/* Chart Grid: SVG + Y-axis */}
        <div className="giving-summary__chart-grid">
          {/* Chart Container */}
          {chartView === 'cumulative' ? (
            /* Area Chart for Cumulative View */
            <div className="giving-summary__svg-container">
              <svg 
                className="giving-summary__area-svg" 
                viewBox="0 0 500 200" 
                preserveAspectRatio="none"
              >
                {/* Grid lines */}
                {yAxisTicks.map((tick, i) => {
                  const y = (i / (yAxisTicks.length - 1)) * 200
                  return (
                    <line
                      key={tick}
                      className="giving-summary__grid-line"
                      x1="0"
                      y1={y}
                      x2="500"
                      y2={y}
                    />
                  )
                })}
                
                {/* Revenue area (bottom layer - blue) */}
                <path
                  className="giving-summary__area giving-summary__area--revenue"
                  d={(() => {
                    const points = chartData.map((d, i) => {
                      const x = (i / (chartData.length - 1)) * 500
                      const y = 200 - (d.displayRevenue / maxValue) * 200
                      return `${x},${y}`
                    })
                    return `M0,200 L${points.join(' L')} L500,200 Z`
                  })()}
                />
                
                {/* Donations area (top layer - yellow, stacked on revenue) */}
                <path
                  className="giving-summary__area giving-summary__area--donations"
                  d={(() => {
                    const points = chartData.map((d, i) => {
                      const x = (i / (chartData.length - 1)) * 500
                      const y = 200 - ((d.displayRevenue + d.displayDonations) / maxValue) * 200
                      return `${x},${y}`
                    })
                    const bottomPoints = [...chartData].reverse().map((d, i) => {
                      const x = ((chartData.length - 1 - i) / (chartData.length - 1)) * 500
                      const y = 200 - (d.displayRevenue / maxValue) * 200
                      return `${x},${y}`
                    })
                    return `M${points.join(' L')} L${bottomPoints.join(' L')} Z`
                  })()}
                />
                
                {/* Line for total (donations + revenue) - with invisible hover area */}
                <path
                  className="giving-summary__area-line-hover"
                  d={(() => {
                    const points = chartData.map((d, i) => {
                      const x = (i / (chartData.length - 1)) * 500
                      const y = 200 - ((d.displayRevenue + d.displayDonations) / maxValue) * 200
                      return `${i === 0 ? 'M' : 'L'}${x},${y}`
                    })
                    return points.join(' ')
                  })()}
                  onMouseEnter={() => setHoveredLine('total')}
                  onMouseLeave={() => setHoveredLine(null)}
                />
                <path
                  className="giving-summary__area-line giving-summary__area-line--total"
                  d={(() => {
                    const points = chartData.map((d, i) => {
                      const x = (i / (chartData.length - 1)) * 500
                      const y = 200 - ((d.displayRevenue + d.displayDonations) / maxValue) * 200
                      return `${i === 0 ? 'M' : 'L'}${x},${y}`
                    })
                    return points.join(' ')
                  })()}
                  style={{ pointerEvents: 'none' }}
                />
                
                {/* Line for revenue - with invisible hover area */}
                <path
                  className="giving-summary__area-line-hover"
                  d={(() => {
                    const points = chartData.map((d, i) => {
                      const x = (i / (chartData.length - 1)) * 500
                      const y = 200 - (d.displayRevenue / maxValue) * 200
                      return `${i === 0 ? 'M' : 'L'}${x},${y}`
                    })
                    return points.join(' ')
                  })()}
                  onMouseEnter={() => setHoveredLine('revenue')}
                  onMouseLeave={() => setHoveredLine(null)}
                />
                <path
                  className="giving-summary__area-line giving-summary__area-line--revenue"
                  d={(() => {
                    const points = chartData.map((d, i) => {
                      const x = (i / (chartData.length - 1)) * 500
                      const y = 200 - (d.displayRevenue / maxValue) * 200
                      return `${i === 0 ? 'M' : 'L'}${x},${y}`
                    })
                    return points.join(' ')
                  })()}
                  style={{ pointerEvents: 'none' }}
                />
              </svg>
              
              {/* Data points - only show on hovered line */}
              {hoveredLine === 'total' && chartData.map((d, i) => {
                const xPercent = (i / (chartData.length - 1)) * 100
                const yPercentTotal = ((d.displayRevenue + d.displayDonations) / maxValue) * 100
                const isPointHovered = hoveredPointIndex === i
                return (
                  <div
                    key={`total-${i}`}
                    className={`giving-summary__data-point giving-summary__data-point--total ${isPointHovered ? 'giving-summary__data-point--active' : ''}`}
                    style={{
                      left: `${xPercent}%`,
                      bottom: `${yPercentTotal}%`,
                    }}
                    onMouseEnter={() => {
                      setHoveredLine('total')
                      setHoveredPointIndex(i)
                    }}
                    onMouseLeave={() => setHoveredPointIndex(null)}
                  />
                )
              })}
              
              {hoveredLine === 'revenue' && chartData.map((d, i) => {
                const xPercent = (i / (chartData.length - 1)) * 100
                const yPercentRevenue = (d.displayRevenue / maxValue) * 100
                const isPointHovered = hoveredPointIndex === i
                return (
                  <div
                    key={`revenue-${i}`}
                    className={`giving-summary__data-point giving-summary__data-point--revenue ${isPointHovered ? 'giving-summary__data-point--active' : ''}`}
                    style={{
                      left: `${xPercent}%`,
                      bottom: `${yPercentRevenue}%`,
                    }}
                    onMouseEnter={() => {
                      setHoveredLine('revenue')
                      setHoveredPointIndex(i)
                    }}
                    onMouseLeave={() => setHoveredPointIndex(null)}
                  />
                )
              })}
              
              {/* Tooltip when hovering a data point */}
              {hoveredPointIndex !== null && hoveredLine && (
                <div 
                  className="giving-summary__chart-tooltip"
                  style={{
                    left: `${(hoveredPointIndex / (chartData.length - 1)) * 100}%`,
                  }}
                >
                  <div className="giving-summary__tooltip-header">
                    {chartData[hoveredPointIndex].month} '{chartData[hoveredPointIndex].year}
                  </div>
                  <div className="giving-summary__chart-tooltip-row">
                    <span className="giving-summary__tooltip-dot giving-summary__tooltip-dot--donations"></span>
                    <span>Donations:</span>
                    <span>{formatCurrency(chartData[hoveredPointIndex].displayDonations)}</span>
                  </div>
                  <div className="giving-summary__chart-tooltip-row">
                    <span className="giving-summary__tooltip-dot giving-summary__tooltip-dot--revenue"></span>
                    <span>Revenue:</span>
                    <span>{formatCurrency(chartData[hoveredPointIndex].displayRevenue)}</span>
                  </div>
                  <div className="giving-summary__tooltip-total">
                    Total: {formatCurrency(chartData[hoveredPointIndex].displayDonations + chartData[hoveredPointIndex].displayRevenue)}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Bar Chart for Nominal View */
            <div className="giving-summary__bars-container">
              {/* Grid lines */}
              <div className="giving-summary__bar-grid-lines">
                {yAxisTicks.map((tick) => (
                  <div key={tick} className="giving-summary__bar-grid-line" />
                ))}
              </div>
              <div className="giving-summary__bars">
                {chartData.map((d, i) => {
                  const revenueHeight = (d.displayRevenue / maxValue) * 100
                  const donationsHeight = (d.displayDonations / maxValue) * 100
                  const isHovered = hoveredPointIndex === i
                  return (
                    <div 
                      key={i} 
                      className="giving-summary__bar-group"
                      onMouseEnter={() => setHoveredPointIndex(i)}
                      onMouseLeave={() => setHoveredPointIndex(null)}
                    >
                      <div className={`giving-summary__bar-stack ${isHovered ? 'giving-summary__bar-stack--hovered' : ''}`}>
                        <div 
                          className="giving-summary__bar giving-summary__bar--donations"
                          style={{ height: `${donationsHeight}%` }}
                        />
                        <div 
                          className="giving-summary__bar giving-summary__bar--revenue"
                          style={{ height: `${revenueHeight}%` }}
                        />
                      </div>
                      {/* Tooltip for bar */}
                      {isHovered && (
                        <div className="giving-summary__bar-tooltip">
                          <div className="giving-summary__tooltip-header">
                            {d.month} '{d.year}
                          </div>
                          <div className="giving-summary__chart-tooltip-row">
                            <span className="giving-summary__tooltip-dot giving-summary__tooltip-dot--donations"></span>
                            <span>Donations:</span>
                            <span>{formatCurrency(d.displayDonations)}</span>
                          </div>
                          <div className="giving-summary__chart-tooltip-row">
                            <span className="giving-summary__tooltip-dot giving-summary__tooltip-dot--revenue"></span>
                            <span>Revenue:</span>
                            <span>{formatCurrency(d.displayRevenue)}</span>
                          </div>
                          <div className="giving-summary__tooltip-total">
                            Total: {formatCurrency(d.displayDonations + d.displayRevenue)}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          
          {/* Y-axis labels */}
          <div className="giving-summary__y-axis">
            {yAxisTicks.map((tick) => (
              <span key={tick} className="giving-summary__y-axis-label">
                {tick >= 1000 ? `${(tick / 1000).toFixed(tick % 1000 === 0 ? 0 : 1)}k` : tick}
              </span>
            ))}
            <span className="giving-summary__y-axis-unit">USD</span>
          </div>
        </div>
        
        {/* Month labels */}
        <div className="giving-summary__chart-labels">
          {chartData.map((data, index) => (
            <span key={index} className="giving-summary__chart-label">
              {data.month} '{data.year}
            </span>
          ))}
        </div>
      </div>

      {/* Transaction Stats - Only show if transaction data exists */}
      {(giving.firstTransaction || giving.lastTransaction || giving.largestTransaction) && (
        <div className="giving-summary__transactions">
          {giving.firstTransaction && (
            <div className="giving-summary__transaction-stat">
              <span className="giving-summary__transaction-label">First Transaction</span>
              <div className="giving-summary__transaction-value">
                <span className="giving-summary__transaction-amount">{formatCurrency(giving.firstTransaction.amount)}</span>
                <span className="giving-summary__transaction-date">{giving.firstTransaction.date}</span>
              </div>
            </div>
          )}
          {giving.lastTransaction && (
            <div className="giving-summary__transaction-stat">
              <span className="giving-summary__transaction-label">Last Transaction</span>
              <div className="giving-summary__transaction-value">
                <span className="giving-summary__transaction-amount">{formatCurrency(giving.lastTransaction.amount)}</span>
                <span className="giving-summary__transaction-date">{giving.lastTransaction.date}</span>
              </div>
            </div>
          )}
          {giving.largestTransaction && (
            <div className="giving-summary__transaction-stat">
              <span className="giving-summary__transaction-label">Largest Transaction</span>
              <div className="giving-summary__transaction-value">
                <span className="giving-summary__transaction-amount giving-summary__transaction-amount--highlight">{formatCurrency(giving.largestTransaction.amount)}</span>
                <span className="giving-summary__transaction-date">{giving.largestTransaction.date}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Donation Attribution Section - Only show if we have attribution data */}
      {(giving.byFund || giving.byCampaign) && (
        <div className="giving-summary__attribution">
          <h4 className="giving-summary__attribution-header">Donation Attribution</h4>
          <div className="giving-summary__breakdowns">
            {/* Fund Breakdown */}
            {giving.byFund && Object.keys(giving.byFund).length > 0 && (
              <div className="giving-summary__breakdown">
                <h5 className="giving-summary__breakdown-title">By Fund</h5>
                <div className="giving-summary__breakdown-list">
                  {Object.entries(giving.byFund).map(([id, fund]) => {
                    const percentage = giving.donations ? (fund.total / giving.donations) * 100 : 0
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
            )}

            {/* Campaign Breakdown */}
            {giving.byCampaign && Object.keys(giving.byCampaign).length > 0 && (
              <div className="giving-summary__breakdown">
                <h5 className="giving-summary__breakdown-title">By Campaign</h5>
                <div className="giving-summary__breakdown-list">
                  {Object.entries(giving.byCampaign).map(([id, campaign]) => {
                    const percentage = giving.donations ? (campaign.total / giving.donations) * 100 : 0
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
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default GivingSummary
