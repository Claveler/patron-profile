import { getPatronRelationships, getHouseholdForPatron, getHouseholdMembers } from '../../data/patrons'
import './RelationshipsSummary.css'

// Type-based colors — matches RelationshipsTab
const typeColors = {
  'household': '#0079ca',
  'personal': '#d946a8',
  'professional': '#6f41d7',
  'organization': '#6f41d7',
}

function RelationshipsSummary({ patronId, onNavigateToPatron, onViewRelationships }) {
  // Get household data
  const household = getHouseholdForPatron(patronId)
  const householdMembers = household
    ? getHouseholdMembers(household.id).filter(m => m.patronId !== patronId)
    : []
  const householdPatronIds = new Set(householdMembers.map(m => m.patronId))

  // Get non-household relationships, excluding rels to household members (they're annotated in-row)
  const relationships = getPatronRelationships(patronId)
  const allPersonal = relationships.filter(r => r.type === 'personal' && !householdPatronIds.has(r.toPatronId))
  const allProfessional = relationships.filter(r => (r.type === 'organization' || r.type === 'professional') && !householdPatronIds.has(r.toPatronId))

  // Detect bridging patrons — same toPatronId in both personal and professional
  const personalByPatron = new Map()
  allPersonal.forEach(r => { if (r.toPatronId) { if (!personalByPatron.has(r.toPatronId)) personalByPatron.set(r.toPatronId, []); personalByPatron.get(r.toPatronId).push(r) } })
  const profByPatron = new Map()
  allProfessional.forEach(r => { if (r.toPatronId) { if (!profByPatron.has(r.toPatronId)) profByPatron.set(r.toPatronId, []); profByPatron.get(r.toPatronId).push(r) } })

  const bridgingIds = new Set()
  personalByPatron.forEach((_, pid) => { if (profByPatron.has(pid)) bridgingIds.add(pid) })

  // Pure personal = not bridging; pure professional = not bridging
  const familyRelationships = allPersonal.filter(r => !bridgingIds.has(r.toPatronId))
  const professionalRelationships = allProfessional.filter(r => !bridgingIds.has(r.toPatronId))

  // Bridging groups — shown in the Professional section with stacked badges
  const bridgingGroups = [...bridgingIds].map(pid => ({
    patronId: pid,
    profRels: profByPatron.get(pid) || [],
    personalRels: personalByPatron.get(pid) || [],
    primaryRel: (profByPatron.get(pid) || [])[0] || (personalByPatron.get(pid) || [])[0],
  }))

  // Extra non-household rels on household members (for annotation)
  const householdExtraRels = new Map()
  householdMembers.forEach(m => {
    const extras = relationships.filter(r => r.type !== 'household' && r.toPatronId === m.patronId)
    if (extras.length > 0) householdExtraRels.set(m.patronId, extras)
  })

  const hasHousehold = household && householdMembers.length > 0
  const hasFamily = familyRelationships.length > 0
  const hasProfessional = professionalRelationships.length > 0 || bridgingGroups.length > 0
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
                    <div className="relationships-summary__tags-row">
                      <span className="relationships-summary__tag relationships-summary__tag--household">
                        {member.role}
                      </span>
                      {(householdExtraRels.get(member.patronId) || []).map(rel => {
                        const title = rel.type === 'personal' ? rel.role : (rel.reciprocalRole || rel.role)
                        const color = typeColors[rel.type] || '#0079ca'
                        return (
                          <span key={rel.id} className="relationships-summary__tag" style={{ color, borderColor: color }}>
                            {title}
                          </span>
                        )
                      })}
                    </div>
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

      {/* Professional Section (includes bridging patrons with stacked badges) */}
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
          {/* Bridging patrons — stacked professional + personal badges */}
          {bridgingGroups.map((group) => {
            const { primaryRel, profRels, personalRels } = group
            const allRels = [...profRels, ...personalRels]
            return (
              <div
                key={`bridging-${group.patronId}`}
                className={`relationships-summary__professional-card ${primaryRel.linkedPatron ? 'relationships-summary__professional-card--clickable' : ''}`}
                onClick={() => handleProfessionalClick(primaryRel)}
                role={primaryRel.linkedPatron ? 'button' : undefined}
                tabIndex={primaryRel.linkedPatron ? 0 : undefined}
                onKeyDown={(e) => {
                  if (primaryRel.linkedPatron && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault()
                    handleProfessionalClick(primaryRel)
                  }
                }}
              >
                <div className="relationships-summary__member-row">
                  <div className="relationships-summary__avatar relationships-summary__avatar--round">
                    {primaryRel.linkedPatron?.photo ? (
                      <img src={primaryRel.linkedPatron.photo} alt={primaryRel.displayName} />
                    ) : (
                      <span className="relationships-summary__avatar-initials">
                        {primaryRel.initials}
                      </span>
                    )}
                  </div>
                  <div className="relationships-summary__member-info">
                    <span className="relationships-summary__member-name relationships-summary__member-name--org">
                      {primaryRel.displayName}
                    </span>
                    <div className="relationships-summary__tags-row">
                      {allRels.map(rel => {
                        const title = rel.type === 'personal' ? rel.role : (rel.externalContact?.title || rel.role)
                        const color = typeColors[rel.type] || '#6f41d7'
                        return (
                          <span key={rel.id} className="relationships-summary__tag" style={{ color, borderColor: color }}>
                            {title}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default RelationshipsSummary
