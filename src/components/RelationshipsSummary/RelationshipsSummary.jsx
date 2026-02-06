import './RelationshipsSummary.css'

const relationships = [
  {
    id: 1,
    name: 'Michael Johnson',
    role: 'Spouse',
    type: 'household',
    avatar: null,
    initials: 'MJ'
  },
  {
    id: 2,
    name: 'Emily Johnson',
    role: 'Daughter',
    type: 'household',
    avatar: null,
    initials: 'EJ'
  },
  {
    id: 3,
    name: 'Robert Chen',
    role: 'Financial Advisor',
    type: 'professional',
    avatar: null,
    initials: 'RC'
  },
  {
    id: 4,
    name: 'Johnson Family Foundation',
    role: 'DAF Account',
    type: 'organization',
    avatar: null,
    initials: 'JF'
  }
]

function RelationshipsSummary() {
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
          <div key={relationship.id} className="relationships-summary__item">
            <div 
              className="relationships-summary__avatar"
              style={{ '--avatar-color': getTypeColor(relationship.type) }}
            >
              {relationship.avatar ? (
                <img src={relationship.avatar} alt={relationship.name} />
              ) : (
                <span>{relationship.initials}</span>
              )}
            </div>
            <div className="relationships-summary__info">
              <span className="relationships-summary__name">{relationship.name}</span>
              <span className="relationships-summary__role">{relationship.role}</span>
            </div>
            <button className="relationships-summary__action" title="View profile">
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        ))}
      </div>

      <button className="relationships-summary__add">
        <i className="fa-solid fa-plus"></i>
        Add Relationship
      </button>
    </div>
  )
}

export default RelationshipsSummary
