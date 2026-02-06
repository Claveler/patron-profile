import React from 'react'
import './ProspectStagePath.css'

const pipelineStages = [
  { id: 'identification', label: 'Identification' },
  { id: 'qualification', label: 'Qualification' },
  { id: 'cultivation', label: 'Cultivation' },
  { id: 'solicitation', label: 'Solicitation' },
  { id: 'stewardship', label: 'Stewardship' },
]

function ProspectStagePath({ prospect, onMarkComplete }) {
  if (!prospect) return null

  const currentStageIndex = pipelineStages.findIndex(s => s.id === prospect.stage)

  const handleMarkComplete = () => {
    if (onMarkComplete) {
      onMarkComplete(prospect.stage)
    } else {
      alert('This would advance the prospect to the next stage.')
    }
  }

  return (
    <div className="prospect-stage-path">
      {/* Stepper Row */}
      <div className="prospect-stage-path__stepper">
        <div className="prospect-stage-path__steps">
          {pipelineStages.map((stage, index) => {
            const isCompleted = index < currentStageIndex
            const isCurrent = index === currentStageIndex
            const isFuture = index > currentStageIndex
            const isLast = index === pipelineStages.length - 1

            return (
              <React.Fragment key={stage.id}>
                {/* Step with circle and label */}
                <div className="prospect-stage-path__step">
                  <div className={`prospect-stage-path__circle ${isCompleted ? 'prospect-stage-path__circle--completed' : ''} ${isCurrent ? 'prospect-stage-path__circle--current' : ''} ${isFuture ? 'prospect-stage-path__circle--future' : ''}`}>
                    {isCompleted && <i className="fa-solid fa-check"></i>}
                    {isCurrent && <span className="prospect-stage-path__inner-dot"></span>}
                  </div>
                  <span className={`prospect-stage-path__label ${isCurrent ? 'prospect-stage-path__label--current' : ''} ${isFuture ? 'prospect-stage-path__label--future' : ''}`}>
                    {index + 1}. {stage.label}
                  </span>
                </div>
                
                {/* Connector line (except after last) */}
                {!isLast && (
                  <div className={`prospect-stage-path__connector ${isCompleted ? 'prospect-stage-path__connector--active' : ''}`} />
                )}
              </React.Fragment>
            )
          })}
        </div>
        
        <button 
          className="prospect-stage-path__complete-btn"
          onClick={handleMarkComplete}
        >
          <i className="fa-solid fa-check"></i>
          Mark Stage as Complete
        </button>
      </div>
    </div>
  )
}

export default ProspectStagePath
