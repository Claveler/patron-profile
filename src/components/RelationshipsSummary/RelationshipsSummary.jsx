import { getPatronRelationships, getHouseholdForPatron, getHouseholdMembers } from '../../data/patrons'
import './RelationshipsSummary.css'

// Type-based colors — matches RelationshipsTab
// Fever Ignite DS brand colors chosen for colorblind safety (blue/orange/purple)
const typeColors = {
  'household': '#0089E3',
  'personal': '#FF8C00',
  'professional': '#6f41d7',
  'organization': '#6f41d7',
}

// Status icon + tooltip for non-active patrons — mirrors RelationshipsTab
const statusConfig = {
  deceased: { icon: 'fa-solid fa-cross', label: 'Deceased' },
  inactive: { icon: 'fa-solid fa-pause', label: 'Inactive' },
  archived: { icon: 'fa-solid fa-box-archive', label: 'Archived' },
}

const getStatusTooltip = (patronData) => {
  if (!patronData) return ''
  const { status, deceasedDate, inactiveDate, inactiveReason, archivedDate, archivedReason } = patronData
  if (status === 'deceased') return `Deceased${deceasedDate ? ` — ${deceasedDate}` : ''}`
  if (status === 'inactive') return `Inactive${inactiveDate ? ` — ${inactiveDate}` : ''}${inactiveReason ? ` — ${inactiveReason}` : ''}`
  if (status === 'archived') return `Archived${archivedDate ? ` — ${archivedDate}` : ''}${archivedReason ? ` — ${archivedReason}` : ''}`
  return ''
}

const renderStatusIcon = (patronData) => {
  if (!patronData) return null
  const status = patronData.status || 'active'
  const cfg = statusConfig[status]
  if (!cfg) return null
  return (
    <i
      className={`${cfg.icon} relationships-summary__status-icon`}
      title={getStatusTooltip(patronData)}
    ></i>
  )
}

const isNonActive = (patronData) => {
  if (!patronData) return false
  const status = patronData.status || 'active'
  return status === 'deceased' || status === 'inactive' || status === 'archived'
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

  // Build a map from household member patronId → { role, notes } (what they are to the viewed patron)
  const householdRelInfo = new Map()
  householdMembers.forEach(m => {
    const hhRel = relationships.find(r => r.type === 'household' && r.toPatronId === m.patronId)
    if (hhRel) householdRelInfo.set(m.patronId, { role: hhRel.role, notes: hhRel.notes })
  })

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
            {householdMembers.map((member, index) => {
              const memberDimmed = isNonActive(member.patron)
              return (
              <div key={member.id} className="relationships-summary__member-item">
                <div 
                  className={`relationships-summary__member-row ${member.patronId ? 'relationships-summary__member-row--clickable' : ''} ${memberDimmed ? 'relationships-summary__member-row--inactive' : ''}`}
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
                    <span className="relationships-summary__member-name">
                      {member.patron?.name}
                      {renderStatusIcon(member.patron)}
                    </span>
                    <div className="relationships-summary__tags-row">
                      <span
                        className="relationships-summary__tag relationships-summary__tag--household"
                        title={householdRelInfo.get(member.patronId)?.notes || ''}
                      >
                        {householdRelInfo.get(member.patronId)?.role || member.role}
                      </span>
                      {(householdExtraRels.get(member.patronId) || []).map(rel => {
                        const title = rel.type === 'personal' ? rel.role : (rel.reciprocalRole || rel.role)
                        const color = typeColors[rel.type] || '#0089E3'
                        return (
                          <span key={rel.id} className="relationships-summary__tag" style={{ color, borderColor: color }} title={rel.notes || ''}>
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
              )
            })}
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
            {familyRelationships.map((rel, index) => {
              const relDimmed = isNonActive(rel.linkedPatron)
              return (
              <div key={rel.id} className="relationships-summary__member-item">
                <div
                  className={`relationships-summary__member-row ${rel.linkedPatron ? 'relationships-summary__member-row--clickable' : ''} ${relDimmed ? 'relationships-summary__member-row--inactive' : ''}`}
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
                    <span className="relationships-summary__member-name">
                      {rel.displayName}
                      {renderStatusIcon(rel.linkedPatron)}
                    </span>
                    {rel.linkedPatron?.householdName && (
                      <span className="relationships-summary__household-label">
                        <i className="fa-solid fa-house-chimney relationships-summary__household-icon"></i>
                        {rel.linkedPatron.householdName}
                      </span>
                    )}
                    <span className="relationships-summary__tag relationships-summary__tag--personal" title={rel.notes || ''}>
                      {rel.role}
                    </span>
                  </div>
                </div>
                {index < familyRelationships.length - 1 && (
                  <div className="relationships-summary__divider"></div>
                )}
              </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Professional Section (includes bridging patrons with stacked badges) */}
      {hasProfessional && (() => {
        const allProfItems = [
          ...professionalRelationships.map(rel => ({ kind: 'regular', rel })),
          ...bridgingGroups.map(group => ({ kind: 'bridging', group })),
        ]
        return (
        <div className="relationships-summary__group">
          <div className="relationships-summary__group-header">
            <i className="fa-solid fa-city relationships-summary__group-icon"></i>
            <button className="relationships-summary__group-link">
              Professional
              <i className="fa-solid fa-arrow-up-right-from-square relationships-summary__external-icon"></i>
            </button>
          </div>
          <div className="relationships-summary__members">
            {allProfItems.map((item, index) => {
              if (item.kind === 'regular') {
                const rel = item.rel
                const profDimmed = isNonActive(rel.linkedPatron)
                return (
                  <div key={rel.id} className="relationships-summary__member-item">
                    <div 
                      className={`relationships-summary__professional-card ${rel.linkedPatron ? 'relationships-summary__professional-card--clickable' : ''} ${profDimmed ? 'relationships-summary__professional-card--inactive' : ''}`}
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
                            {renderStatusIcon(rel.linkedPatron)}
                          </span>
                          <span className="relationships-summary__tag relationships-summary__tag--professional" title={rel.notes || ''}>
                            {rel.externalContact?.title || rel.role}
                          </span>
                        </div>
                      </div>
                    </div>
                    {index < allProfItems.length - 1 && (
                      <div className="relationships-summary__divider"></div>
                    )}
                  </div>
                )
              }
              // Bridging patron — stacked professional + personal badges
              const { primaryRel, profRels, personalRels } = item.group
              const allRels = [...profRels, ...personalRels]
              return (
                <div key={`bridging-${item.group.patronId}`} className="relationships-summary__member-item">
                  <div
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
                              <span key={rel.id} className="relationships-summary__tag" style={{ color, borderColor: color }} title={rel.notes || ''}>
                                {title}
                              </span>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < allProfItems.length - 1 && (
                    <div className="relationships-summary__divider"></div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
        )
      })()}
    </div>
  )
}

export default RelationshipsSummary
