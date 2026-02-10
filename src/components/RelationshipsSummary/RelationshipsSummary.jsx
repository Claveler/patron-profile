import { getPatronRelationships, getHouseholdForPatron, getHouseholdMembers } from '../../data/patrons'
import './RelationshipsSummary.css'

function RelationshipsSummary({ patronId, onNavigateToPatron, onViewRelationships }) {
  // Get household data
  const household = getHouseholdForPatron(patronId)
  const householdMembers = household
    ? getHouseholdMembers(household.id).filter(m => m.patronId !== patronId)
    : []

  // Get non-household relationships
  const relationships = getPatronRelationships(patronId)
  const familyRelationships = relationships.filter(r => r.type === 'personal')
  const professionalRelationships = relationships.filter(r => r.type === 'organization' || r.type === 'professional')

  const hasHousehold = household && householdMembers.length > 0
  const hasFamily = familyRelationships.length > 0
  const hasProfessional = professionalRelationships.length > 0
  const hasAny = hasHousehold || hasFamily || hasProfessional

  const handleMemberClick = (memberPatronId) => {
    if (memberPatronId && onNavigateToPatron) {
      onNavigateToPatron(memberPatronId)
    }
  }

  const handleProfessionalClick = (rel) => {
    if (rel.linkedPatron && onNavigateToPatron) {
      onNavigateToPatron(rel.linkedPatron.id)
    }
  }

  const handleFamilyClick = (rel) => {
    if (rel.linkedPatron && onNavigateToPatron) {
      onNavigateToPatron(rel.linkedPatron.id)
    }
  }

  if (!hasAny) {
    return (
      <div className="relationships-summary">
        <div className="relationships-summary__header">
          <h4 className="relationships-summary__title">Relationships</h4>
        </div>
        <div className="relationships-summary__empty">
          <p>No relationships recorded yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relationships-summary">
      <div className="relationships-summary__header">
        <h4 className="relationships-summary__title">Relationships</h4>
        <button 
          className="relationships-summary__view-more"
          onClick={onViewRelationships}
        >
          View more
        </button>
      </div>

      {/* Household Section */}
      {hasHousehold && (
        <div className="relationships-summary__group">
          <div className="relationships-summary__group-header">
            <i className="fa-solid fa-house relationships-summary__group-icon"></i>
            <button className="relationships-summary__group-link">
              {household.name}
              <i className="fa-solid fa-arrow-up-right-from-square relationships-summary__external-icon"></i>
            </button>
          </div>
          <div className="relationships-summary__members">
            {householdMembers.map((member, index) => (
              <div key={member.id} className="relationships-summary__member-item">
                <div 
                  className={`relationships-summary__member-row ${member.patronId ? 'relationships-summary__member-row--clickable' : ''}`}
                  onClick={() => handleMemberClick(member.patronId)}
                  role={member.patronId ? 'button' : undefined}
                  tabIndex={member.patronId ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (member.patronId && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault()
                      handleMemberClick(member.patronId)
                    }
                  }}
                >
                  <div className="relationships-summary__avatar relationships-summary__avatar--round">
                    {member.patron?.photo ? (
                      <img src={member.patron.photo} alt={member.patron?.name} />
                    ) : (
                      <span className="relationships-summary__avatar-initials">
                        {member.patron?.firstName?.[0]}{member.patron?.lastName?.[0]}
                      </span>
                    )}
                  </div>
                  <div className="relationships-summary__member-info">
                    <span className="relationships-summary__member-name">{member.patron?.name}</span>
                    <span className="relationships-summary__tag relationships-summary__tag--household">
                      {member.role}
                    </span>
                  </div>
                </div>
                {index < householdMembers.length - 1 && (
                  <div className="relationships-summary__divider"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Personal Section (family, friends, mentors, and other personal connections) */}
      {hasFamily && (
        <div className="relationships-summary__group">
          <div className="relationships-summary__group-header">
            <i className="fa-solid fa-heart relationships-summary__group-icon"></i>
            <span className="relationships-summary__group-label">Personal</span>
          </div>
          <div className="relationships-summary__members">
            {familyRelationships.map((rel, index) => (
              <div key={rel.id} className="relationships-summary__member-item">
                <div
                  className={`relationships-summary__member-row ${rel.linkedPatron ? 'relationships-summary__member-row--clickable' : ''}`}
                  onClick={() => handleFamilyClick(rel)}
                  role={rel.linkedPatron ? 'button' : undefined}
                  tabIndex={rel.linkedPatron ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (rel.linkedPatron && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault()
                      handleFamilyClick(rel)
                    }
                  }}
                >
                  <div className="relationships-summary__avatar relationships-summary__avatar--round">
                    {rel.linkedPatron?.photo ? (
                      <img src={rel.linkedPatron.photo} alt={rel.displayName} />
                    ) : (
                      <span className="relationships-summary__avatar-initials">
                        {rel.initials}
                      </span>
                    )}
                  </div>
                  <div className="relationships-summary__member-info">
                    <span className="relationships-summary__member-name">{rel.displayName}</span>
                    {rel.linkedPatron?.householdName && (
                      <span className="relationships-summary__household-label">
                        {rel.linkedPatron.householdName}
                      </span>
                    )}
                    <span className="relationships-summary__tag relationships-summary__tag--personal">
                      {rel.role}
                    </span>
                  </div>
                </div>
                {index < familyRelationships.length - 1 && (
                  <div className="relationships-summary__divider"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Professional Section */}
      {hasProfessional && (
        <div className="relationships-summary__group">
          <div className="relationships-summary__group-header">
            <i className="fa-solid fa-city relationships-summary__group-icon"></i>
            <button className="relationships-summary__group-link">
              Professional
              <i className="fa-solid fa-arrow-up-right-from-square relationships-summary__external-icon"></i>
            </button>
          </div>
          {professionalRelationships.map((rel) => (
            <div 
              key={rel.id} 
              className={`relationships-summary__professional-card ${rel.linkedPatron ? 'relationships-summary__professional-card--clickable' : ''}`}
              onClick={() => handleProfessionalClick(rel)}
              role={rel.linkedPatron ? 'button' : undefined}
              tabIndex={rel.linkedPatron ? 0 : undefined}
              onKeyDown={(e) => {
                if (rel.linkedPatron && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault()
                  handleProfessionalClick(rel)
                }
              }}
            >
              <div className="relationships-summary__member-row">
                <div className={`relationships-summary__avatar ${rel.type === 'organization' ? 'relationships-summary__avatar--square' : 'relationships-summary__avatar--round'}`}>
                  {rel.linkedPatron?.photo ? (
                    <img src={rel.linkedPatron.photo} alt={rel.displayName} />
                  ) : (
                    <span className="relationships-summary__avatar-initials">
                      {rel.initials}
                    </span>
                  )}
                </div>
                <div className="relationships-summary__member-info">
                  <span className="relationships-summary__member-name relationships-summary__member-name--org">
                    {rel.displayName}
                  </span>
                  <span className="relationships-summary__tag relationships-summary__tag--professional">
                    {rel.externalContact?.title || rel.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RelationshipsSummary
