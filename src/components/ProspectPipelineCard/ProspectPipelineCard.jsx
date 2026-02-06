import './ProspectPipelineCard.css'

const pipelineStages = [
  { id: 'identification', label: 'Identification' },
  { id: 'qualification', label: 'Qualification' },
  { id: 'cultivation', label: 'Cultivation' },
  { id: 'solicitation', label: 'Solicitation' },
  { id: 'stewardship', label: 'Stewardship' },
]

// Calculate days since a date
const getDaysSince = (dateStr) => {
  if (!dateStr) return null
  const date = new Date(dateStr)
  const today = new Date()
  const diffTime = today - date
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format date
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })
}

// Get contact status based on days since last contact
const getContactStatus = (days) => {
  if (days >= 21) return 'overdue'
  if (days >= 14) return 'warning'
  return 'ok'
}

function ProspectPipelineCard({ prospect, onViewPipeline }) {
  if (!prospect) return null

  const currentStageIndex = pipelineStages.findIndex(s => s.id === prospect.stage)
  const daysSince = getDaysSince(prospect.lastContact)
  const contactStatus = getContactStatus(daysSince)

  return (
    <div className="prospect-pipeline-card">
      <div className="prospect-pipeline-card__header">
        <h3 className="prospect-pipeline-card__title">
          <i className="fa-solid fa-chart-line"></i>
          Prospect Pipeline
          <span 
            className="prospect-pipeline-card__pipeline-badge"
            title="This feature is part of Prospect Management for Managed Prospects"
          >
            <i className="fa-solid fa-user-tie"></i>
            Pipeline
          </span>
        </h3>
        {onViewPipeline && (
          <button 
            className="prospect-pipeline-card__view-link"
            onClick={onViewPipeline}
          >
            View Pipeline <i className="fa-solid fa-arrow-right"></i>
          </button>
        )}
      </div>

      {/* Stage Visualization */}
      <div className="prospect-pipeline-card__stages">
        {pipelineStages.map((stage, index) => {
          const isActive = index <= currentStageIndex
          const isCurrent = index === currentStageIndex
          return (
            <div key={stage.id} className="prospect-pipeline-card__stage">
              {index > 0 && (
                <div className={`prospect-pipeline-card__line ${isActive ? 'prospect-pipeline-card__line--active' : ''}`}></div>
              )}
              <div 
                className={`prospect-pipeline-card__dot ${isActive ? 'prospect-pipeline-card__dot--active' : ''} ${isCurrent ? 'prospect-pipeline-card__dot--current' : ''}`}
              >
                {isCurrent && <i className="fa-solid fa-check"></i>}
              </div>
              <span className={`prospect-pipeline-card__stage-label ${isCurrent ? 'prospect-pipeline-card__stage-label--current' : ''}`}>
                {stage.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Key Metrics */}
      <div className="prospect-pipeline-card__metrics">
        <div className="prospect-pipeline-card__metric">
          <span className="prospect-pipeline-card__metric-label">Ask Amount</span>
          <span className="prospect-pipeline-card__metric-value prospect-pipeline-card__metric-value--primary">
            {formatCurrency(prospect.askAmount)}
          </span>
        </div>
        <div className="prospect-pipeline-card__metric">
          <span className="prospect-pipeline-card__metric-label">Last Contact</span>
          <div className="prospect-pipeline-card__metric-row">
            <span className="prospect-pipeline-card__metric-value">
              {formatDate(prospect.lastContact)}
            </span>
            {daysSince !== null && (
              <span className={`prospect-pipeline-card__days prospect-pipeline-card__days--${contactStatus}`}>
                {daysSince}d ago
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Next Action */}
      <div className="prospect-pipeline-card__action">
        <div className="prospect-pipeline-card__action-header">
          <i className="fa-solid fa-arrow-right"></i>
          <span className="prospect-pipeline-card__action-label">Next Action</span>
        </div>
        <span className="prospect-pipeline-card__action-text">{prospect.nextAction}</span>
        <button className="prospect-pipeline-card__action-btn">
          <i className="fa-solid fa-check"></i>
          Mark Complete
        </button>
      </div>
    </div>
  )
}

export default ProspectPipelineCard
