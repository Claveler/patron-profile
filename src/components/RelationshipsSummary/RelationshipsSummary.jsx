import { getPatronRelationships } from '../../data/patrons'
import './RelationshipsSummary.css'

function RelationshipsSummary({ patronId, onNavigateToPatron }) {
  // Get relationships from data layer
  const relationships = getPatronRelationships(patronId)
  
  const getTypeColor = (type) => {
    switch (type) {
      case 'household':
        return 'var(--color-primary)'
      case 'professional':
        return 'var(--color-warning)'
      case 'organization':
        return 'var(--color-success)'
      default:
        return 'var(--color-text-muted)'
    }
  }

  const handleRelationshipClick = (relationship) => {
    // If linked patron exists and callback is provided, navigate to their profile
    if (relationship.linkedPatron && onNavigateToPatron) {
      onNavigateToPatron(relationship.linkedPatron.id)
    }
  }

  if (relationships.length === 0) {
    return (
      <div className="relationships-summary">
        <div className="relationships-summary__header">
          <h4 className="relationships-summary__title">Relationships</h4>
        </div>
        <div className="relationships-summary__empty">
          <p>No relationships recorded yet.</p>
        </div>
        <button className="relationships-summary__add">
          Add relationship
        </button>
      </div>
    )
  }

  return (
    <div className="relationships-summary">
      <div className="relationships-summary__header">
        <h4 className="relationships-summary__title">Relationships</h4>
        <button className="relationships-summary__view-all">
          View All
          <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>

      <div className="relationships-summary__list">
        {relationships.map((relationship) => (
          <div 
            key={relationship.id} 
            className={`relationships-summary__item ${relationship.linkedPatron ? 'relationships-summary__item--clickable' : ''}`}
            onClick={() => handleRelationshipClick(relationship)}
          >
            <div 
              className="relationships-summary__avatar"
              style={{ '--avatar-color': getTypeColor(relationship.type) }}
            >
              {relationship.linkedPatron?.photo ? (
                <img src={relationship.linkedPatron.photo} alt={relationship.displayName} />
              ) : (
                <span>{relationship.initials}</span>
              )}
            </div>
            <div className="relationships-summary__info">
              <span className="relationships-summary__name">{relationship.displayName}</span>
              <span className="relationships-summary__role">{relationship.role}</span>
            </div>
            {relationship.linkedPatron && (
              <button className="relationships-summary__action" title="View profile">
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            )}
            {!relationship.linkedPatron && relationship.externalContact && (
              <span className="relationships-summary__external" title="External contact">
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
              </span>
            )}
          </div>
        ))}
      </div>

      <button className="relationships-summary__add">
        Add relationship
      </button>
    </div>
  )
}

export default RelationshipsSummary
