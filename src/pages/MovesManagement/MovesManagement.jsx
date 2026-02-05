import { useState } from 'react'
import './MovesManagement.css'

// Pipeline stages with metadata
const STAGES = [
  { id: 'identification', label: 'Identification', description: 'Prospect discovered' },
  { id: 'qualification', label: 'Qualification', description: 'Validating capacity' },
  { id: 'cultivation', label: 'Cultivation', description: 'Building relationship' },
  { id: 'solicitation', label: 'Solicitation', description: 'Ready to ask' },
  { id: 'stewardship', label: 'Stewardship', description: 'Post-gift' },
]

// Sample prospect data
const initialProspects = [
  {
    id: '1',
    name: 'Anderson Collingwood',
    askAmount: 25000,
    lastContact: '2026-01-15',
    nextAction: 'Follow up re: gallery tour',
    assignedTo: 'LJ',
    assignedToFull: 'Liam Johnson',
    stage: 'cultivation',
  },
  {
    id: '2',
    name: 'Eleanor Whitfield',
    askAmount: 100000,
    lastContact: '2026-02-01',
    nextAction: 'Schedule lunch meeting',
    assignedTo: 'JM',
    assignedToFull: 'Jennifer Martinez',
    stage: 'solicitation',
  },
  {
    id: '3',
    name: 'Marcus Chen',
    askAmount: 50000,
    lastContact: '2026-01-28',
    nextAction: 'Send exhibition catalog',
    assignedTo: 'RB',
    assignedToFull: 'Robert Brown',
    stage: 'cultivation',
  },
  {
    id: '4',
    name: 'Patricia Hawthorne',
    askAmount: 15000,
    lastContact: '2025-12-20',
    nextAction: 'Research foundation giving',
    assignedTo: 'RB',
    assignedToFull: 'Robert Brown',
    stage: 'qualification',
  },
  {
    id: '5',
    name: 'James Morrison',
    askAmount: 75000,
    lastContact: '2026-02-03',
    nextAction: 'Thank you call for pledge',
    assignedTo: 'JM',
    assignedToFull: 'Jennifer Martinez',
    stage: 'stewardship',
  },
  {
    id: '6',
    name: 'Sarah Blackwood',
    askAmount: 30000,
    lastContact: '2026-01-10',
    nextAction: 'Review wealth screening results',
    assignedTo: 'AL',
    assignedToFull: 'Amanda Lee',
    stage: 'identification',
  },
  {
    id: '7',
    name: 'William Hartford',
    askAmount: 200000,
    lastContact: '2026-01-25',
    nextAction: 'Prepare ask proposal',
    assignedTo: 'JM',
    assignedToFull: 'Jennifer Martinez',
    stage: 'solicitation',
  },
  {
    id: '8',
    name: 'Diana Rothschild',
    askAmount: 40000,
    lastContact: '2026-02-04',
    nextAction: 'Initial qualification call',
    assignedTo: 'AL',
    assignedToFull: 'Amanda Lee',
    stage: 'qualification',
  },
  {
    id: '9',
    name: 'Theodore Banks',
    askAmount: 10000,
    lastContact: '2025-11-15',
    nextAction: 'Annual stewardship report',
    assignedTo: 'RB',
    assignedToFull: 'Robert Brown',
    stage: 'stewardship',
  },
  {
    id: '10',
    name: 'Victoria Sterling',
    askAmount: 500000,
    lastContact: '2026-01-30',
    nextAction: 'Board member introduction',
    assignedTo: 'JM',
    assignedToFull: 'Jennifer Martinez',
    stage: 'cultivation',
  },
]

// Get unique assignees for filter
const getAssignees = (prospects) => {
  const assignees = new Map()
  prospects.forEach(p => {
    if (!assignees.has(p.assignedTo)) {
      assignees.set(p.assignedTo, p.assignedToFull)
    }
  })
  return Array.from(assignees, ([id, name]) => ({ id, name }))
}

// Calculate days since last contact
const getDaysSinceContact = (dateStr) => {
  const lastContact = new Date(dateStr)
  const today = new Date()
  const diffTime = today - lastContact
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

// Get status class based on days since contact
const getContactStatus = (days) => {
  if (days <= 14) return 'good'
  if (days <= 30) return 'warning'
  return 'overdue'
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
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function MovesManagement({ onNavigateToPatron }) {
  const [prospects, setProspects] = useState(initialProspects)
  const [filterOfficer, setFilterOfficer] = useState('all')
  const [draggedProspect, setDraggedProspect] = useState(null)

  const assignees = getAssignees(initialProspects)

  // Filter prospects by assigned staff
  const filteredProspects = filterOfficer === 'all'
    ? prospects
    : prospects.filter(p => p.assignedTo === filterOfficer)

  // Get prospects for a specific stage
  const getProspectsForStage = (stageId) => {
    return filteredProspects.filter(p => p.stage === stageId)
  }

  // Calculate total pipeline value for a stage
  const getStageTotalValue = (stageId) => {
    return getProspectsForStage(stageId).reduce((sum, p) => sum + p.askAmount, 0)
  }

  // Calculate total pipeline value
  const getTotalPipelineValue = () => {
    return filteredProspects.reduce((sum, p) => sum + p.askAmount, 0)
  }

  // Drag handlers
  const handleDragStart = (e, prospect) => {
    setDraggedProspect(prospect)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, stageId) => {
    e.preventDefault()
    if (draggedProspect && draggedProspect.stage !== stageId) {
      setProspects(prev => prev.map(p =>
        p.id === draggedProspect.id ? { ...p, stage: stageId } : p
      ))
    }
    setDraggedProspect(null)
  }

  const handleDragEnd = () => {
    setDraggedProspect(null)
  }

  return (
    <div className="moves-management">
      {/* Page Header / Breadcrumb - matches PatronProfile */}
      <div className="moves-management__header">
        <div className="moves-management__breadcrumb">
          <span className="moves-management__breadcrumb-section">Fundraising</span>
          <i className="fa-solid fa-chevron-right moves-management__breadcrumb-separator"></i>
        </div>
        <h1 className="moves-management__title">Pipeline</h1>
      </div>

      {/* Main Content Container */}
      <div className="moves-management__container">
        {/* Toolbar with filters and total */}
        <div className="moves-management__toolbar">
          <div className="moves-management__total">
            Total Pipeline: <strong>{formatCurrency(getTotalPipelineValue())}</strong>
          </div>
          <div className="moves-management__filters">
            <label className="moves-management__filter-label">
              <i className="fa-solid fa-user"></i>
              Assigned To:
            </label>
            <select
              className="moves-management__filter-select"
              value={filterOfficer}
              onChange={(e) => setFilterOfficer(e.target.value)}
            >
              <option value="all">All Staff</option>
              {assignees.map(assignee => (
                <option key={assignee.id} value={assignee.id}>
                  {assignee.name} ({assignee.id})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="moves-management__board">
        {STAGES.map(stage => (
          <div
            key={stage.id}
            className={`moves-management__column ${draggedProspect ? 'moves-management__column--droppable' : ''}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            {/* Column Header */}
            <div className="moves-management__column-header">
              <div className="moves-management__column-title">
                <span className="moves-management__column-name">{stage.label}</span>
                <span className="moves-management__column-count">
                  {getProspectsForStage(stage.id).length}
                </span>
              </div>
              <div className="moves-management__column-value">
                {formatCurrency(getStageTotalValue(stage.id))}
              </div>
            </div>

            {/* Column Cards */}
            <div className="moves-management__cards">
              {getProspectsForStage(stage.id).map(prospect => {
                const daysSince = getDaysSinceContact(prospect.lastContact)
                const contactStatus = getContactStatus(daysSince)
                
                return (
                  <div
                    key={prospect.id}
                    className={`pipeline-card ${draggedProspect?.id === prospect.id ? 'pipeline-card--dragging' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, prospect)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="pipeline-card__header">
                      <span 
                        className="pipeline-card__name"
                        onClick={() => onNavigateToPatron && onNavigateToPatron()}
                        title="View patron profile"
                      >
                        {prospect.name}
                      </span>
                      <span className="pipeline-card__amount">
                        {formatCurrency(prospect.askAmount)}
                      </span>
                    </div>
                    
                    <div className="pipeline-card__contact">
                      <span className="pipeline-card__date">
                        Last: {formatDate(prospect.lastContact)}
                      </span>
                      <span className={`pipeline-card__days pipeline-card__days--${contactStatus}`}>
                        {daysSince}d ago
                      </span>
                    </div>
                    
                    <div className="pipeline-card__action">
                      <i className="fa-solid fa-arrow-right"></i>
                      {prospect.nextAction}
                    </div>
                    
                    <div className="pipeline-card__footer">
                      <span 
                        className="pipeline-card__assignee"
                        title={prospect.assignedToFull}
                      >
                        {prospect.assignedTo}
                      </span>
                    </div>
                  </div>
                )
              })}
              
              {getProspectsForStage(stage.id).length === 0 && (
                <div className="moves-management__empty">
                  No prospects
                </div>
              )}
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  )
}

export default MovesManagement
