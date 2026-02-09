import { useMemo } from 'react'
import { getHouseholdForPatron, getHouseholdMembers, getPatronRelationships, getPatronById } from '../../data/patrons'
import { getInitials } from '../../utils/getInitials'
import './RelationshipsTab.css'

// Outlined badge colors (border + text color — bg is always white)
const roleBadgeColors = {
  'Head': { color: '#0079ca', label: 'Spouse' },
  'Spouse': { color: '#0079ca', label: 'Spouse' },
  'Child': { color: '#0079ca', label: 'Child' },
  'Daughter': { color: '#0079ca', label: 'Child' },
  'Son': { color: '#0079ca', label: 'Child' },
}

// Connection type badge colors (outlined)
const connectionBadgeColors = {
  'Employee': { color: '#0079ca' },
  'Board Member': { color: '#0079ca' },
  'Financial Advisor': { color: '#0079ca' },
  'Volunteer': { color: '#0079ca' },
  // Family roles — pink/magenta to differentiate from professional (blue)
  'Sister': { color: '#d946a8' },
  'Brother': { color: '#d946a8' },
  'Sibling': { color: '#d946a8' },
  'Parent': { color: '#d946a8' },
  'Mother': { color: '#d946a8' },
  'Father': { color: '#d946a8' },
  'Child': { color: '#d946a8' },
  'Son': { color: '#d946a8' },
  'Daughter': { color: '#d946a8' },
  'Grandparent': { color: '#d946a8' },
  'Grandchild': { color: '#d946a8' },
  'Uncle': { color: '#d946a8' },
  'Aunt': { color: '#d946a8' },
  'Nephew': { color: '#d946a8' },
  'Niece': { color: '#d946a8' },
  'Cousin': { color: '#d946a8' },
}

// Neutral connector labels derived from relationship type (no directionality)
const connectorLabels = {
  'organization': 'Employment',
  'professional': 'Advisory',
  'board': 'Board',
  'volunteer': 'Volunteer',
  'family': 'Family',
}

// Org title badge colors — purple outlined per Figma
const orgTitleBadgeColors = {
  'CTO': { color: '#6f41d7' },
  'Client': { color: '#0079ca' },
  'default': { color: '#6f41d7' },
}

function RelationshipsTab({ patronId, onNavigateToPatron, onAddRelationship, onEndRelationship, onEditHousehold }) {
  // Get household data
  const household = useMemo(() => getHouseholdForPatron(patronId), [patronId])
  const householdMembers = useMemo(() => {
    if (!household) return []
    const members = getHouseholdMembers(household.id)
    // Put current patron first in the list
    return members.sort((a, b) => {
      if (a.patronId === patronId) return -1
      if (b.patronId === patronId) return 1
      return 0
    })
  }, [household, patronId])

  // Get all relationships for viewing patron (needed for household-rel lookups)
  const allRelationships = useMemo(() => getPatronRelationships(patronId), [patronId])

  // Build a map: only the CURRENT patron's external (non-household) relationships
  // Other household members' external connections are not shown on this patron's view
  const memberExternalMap = useMemo(() => {
    const map = {}
    if (householdMembers.length > 0) {
      const rels = getPatronRelationships(patronId).filter(r => r.type !== 'household')
      if (rels.length > 0) map[patronId] = rels
    }
    return map
  }, [householdMembers, patronId])

  // For standalone patron (no household), get their external relationships directly
  const standaloneExternalRels = useMemo(() => {
    if (householdMembers.length > 0) return []
    return allRelationships.filter(r => r.type !== 'household')
  }, [allRelationships, householdMembers])

  // Current patron data (for standalone card when no household)
  const currentPatron = useMemo(() => getPatronById(patronId), [patronId])

  // Check if we have anything to show
  const hasHousehold = household && householdMembers.length > 0
  const hasExternalAnywhere = Object.keys(memberExternalMap).length > 0 || standaloneExternalRels.length > 0
  const hasAnyRelationships = hasHousehold || hasExternalAnywhere

  if (!hasAnyRelationships) {
    return (
      <div className="relationships-tab">
        <div className="relationships-tab__empty">
          <i className="fa-solid fa-people-arrows relationships-tab__empty-icon"></i>
          <h3 className="relationships-tab__empty-title">No Relationships Mapped</h3>
          <p className="relationships-tab__empty-text">
            Household members, organizational affiliations, and other patron relationships will appear here.
          </p>
          <button className="relationships-tab__empty-action" onClick={() => onAddRelationship && onAddRelationship()}>
            <i className="fa-solid fa-plus"></i>
            Add relationship
          </button>
        </div>
      </div>
    )
  }

  const handleMemberClick = (member) => {
    if (member.patronId !== patronId && onNavigateToPatron) {
      onNavigateToPatron(member.patronId)
    }
  }

  const handleExternalClick = (relationship) => {
    if (relationship.linkedPatron && onNavigateToPatron) {
      onNavigateToPatron(relationship.linkedPatron.id)
    }
  }

  const getHouseholdRelationship = (member) => {
    if (member.patronId === patronId) return null
    return allRelationships.find(
      r => r.type === 'household' && r.toPatronId === member.patronId
    ) || {
      id: `hh-${member.id}`,
      fromPatronId: patronId,
      toPatronId: member.patronId,
      type: 'household',
      role: member.role,
      linkedPatron: member.patron ? { id: member.patronId, firstName: member.patron.firstName, lastName: member.patron.lastName } : null,
    }
  }

  const handleRemoveMember = (e, member) => {
    e.stopPropagation()
    const rel = getHouseholdRelationship(member)
    if (rel && onEndRelationship) {
      onEndRelationship(rel)
    }
  }

  const handleRemoveExternal = (e, rel) => {
    e.stopPropagation()
    if (onEndRelationship) {
      onEndRelationship(rel)
    }
  }

  const getRoleBadge = (role) => {
    return roleBadgeColors[role] || { color: '#0079ca', label: role }
  }

  const getConnectionBadge = (role) => {
    return connectionBadgeColors[role] || { color: '#0079ca' }
  }

  const getOrgTitleBadge = (title) => {
    return orgTitleBadgeColors[title] || orgTitleBadgeColors['default']
  }

  // Renders a single org/professional/family card (reused in tree branches, sub-branches, and standalone)
  const renderOrgCard = (rel) => {
    // For family relationships, show the role (e.g., "Sister") not the reciprocal ("Brother")
    const orgTitle = rel.type === 'family'
      ? (rel.role || '')
      : (rel.externalContact?.title || rel.reciprocalRole || '')
    const orgName = rel.externalContact?.company || rel.displayName || ''
    const orgInitials = rel.externalContact?.initials || rel.initials || '??'
    const titleBadge = getOrgTitleBadge(orgTitle)

    return (
      <div
        className={`relationships-tab__org-card ${rel.linkedPatron ? 'relationships-tab__org-card--clickable' : ''}`}
        onClick={() => handleExternalClick(rel)}
      >
        <div className={rel.type === 'organization' ? 'relationships-tab__org-avatar' : 'relationships-tab__member-avatar'}>
          {rel.linkedPatron?.photo ? (
            <img src={rel.linkedPatron.photo} alt={rel.displayName} />
          ) : (
            <span className="relationships-tab__org-initials">{orgInitials}</span>
          )}
        </div>
        <div className="relationships-tab__org-info">
          <span className="relationships-tab__org-name">{orgName}</span>
          {orgTitle && (
            <span
              className="relationships-tab__org-title-badge"
              style={{ color: titleBadge.color, borderColor: titleBadge.color }}
            >
              {orgTitle}
            </span>
          )}
        </div>
        {onEndRelationship && (
          <button
            className="relationships-tab__remove-btn relationships-tab__remove-btn--org"
            title="End relationship"
            onClick={(e) => handleRemoveExternal(e, rel)}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        )}
      </div>
    )
  }

  // Renders external connection cards (connector line + org card) — used by standalone patron
  const renderConnections = (rels) => {
    return rels.map((rel) => {
      const connBadge = getConnectionBadge(rel.role)
      const neutralLabel = connectorLabels[rel.type] || rel.role

      return (
        <div key={rel.id} className="relationships-tab__connection-row">
          <div className="relationships-tab__connector">
            <div className="relationships-tab__connector-line"></div>
            <span
              className="relationships-tab__connector-label"
              style={{ color: connBadge.color, borderColor: connBadge.color }}
            >
              {neutralLabel}
            </span>
            <div className="relationships-tab__connector-line"></div>
          </div>
          {renderOrgCard(rel)}
        </div>
      )
    })
  }

  // Check if any household member has external connections
  const hasAnyExternalInHousehold = Object.keys(memberExternalMap).length > 0

  return (
    <div className="relationships-tab">
      {/* Relationship graph area — gray background */}
      <div className="relationships-tab__graph">
        {hasHousehold ? (
          <div className="relationships-tab__graph-inner">
            {/* LEFT: Light blue wrapper with title + card + add-family link */}
            <div className="relationships-tab__household-wrapper">
              <h4 className="relationships-tab__household-name">
                {household.name}
              </h4>

              {/* Single white card containing all member rows */}
              <div className="relationships-tab__household-card">
                {householdMembers.map((member) => {
                  const isCurrentPatron = member.patronId === patronId
                  const isHead = member.role === 'Head'
                  const badge = getRoleBadge(member.role)

                  return (
                    <div
                      key={member.id}
                      className={`relationships-tab__member ${!isCurrentPatron ? 'relationships-tab__member--clickable' : ''}`}
                      onClick={() => handleMemberClick(member)}
                    >
                      <div className="relationships-tab__member-avatar">
                        {member.patron?.photo ? (
                          <img src={member.patron.photo} alt={member.patron.name} />
                        ) : (
                          <span className="relationships-tab__member-initials">
                            {getInitials(member.patron?.name || '')}
                          </span>
                        )}
                      </div>
                      <div className="relationships-tab__member-info">
                        <span className={`relationships-tab__member-name ${isCurrentPatron ? 'relationships-tab__member-name--head' : ''}`}>
                          {member.patron?.name}
                        </span>
                        <div className="relationships-tab__badges">
                          {isHead && (
                            <span className="relationships-tab__role-badge relationships-tab__role-badge--head">
                              <i className="fa-solid fa-circle-check"></i>
                              Head of household
                            </span>
                          )}
                          <span
                            className="relationships-tab__role-badge"
                            style={{ color: badge.color, borderColor: badge.color }}
                          >
                            {badge.label}
                          </span>
                        </div>
                      </div>
                      {!isCurrentPatron && onEndRelationship && (
                        <button
                          className="relationships-tab__remove-btn"
                          title="End relationship"
                          onClick={(e) => handleRemoveMember(e, member)}
                        >
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="relationships-tab__actions">
                <button className="relationships-tab__action-btn" onClick={() => onAddRelationship && onAddRelationship()}>
                  <i className="fa-solid fa-plus"></i>
                  Add relationship
                </button>
                <button className="relationships-tab__action-btn" onClick={() => onEditHousehold && onEditHousehold()}>
                  <i className="fa-solid fa-pen-to-square"></i>
                  Edit household
                </button>
              </div>
            </div>

            {/* RIGHT: External connections — two-level tree grouped by type */}
            {hasAnyExternalInHousehold && (
              <div className="relationships-tab__ext-column">
                {householdMembers.map((member, memberIndex) => {
                  const memberRels = memberExternalMap[member.patronId] || []
                  if (memberRels.length === 0) return null

                  // Group relationships by type → [['organization', [...]], ['professional', [...]], ...]
                  const typeGroups = Object.entries(
                    memberRels.reduce((acc, rel) => {
                      const key = rel.type
                      if (!acc[key]) acc[key] = []
                      acc[key].push(rel)
                      return acc
                    }, {})
                  )
                  const isSingle = typeGroups.length === 1 && typeGroups[0][1].length === 1

                  return (
                    <div
                      key={member.id}
                      className={`relationships-tab__ext-group${isSingle ? ' relationships-tab__ext-group--single' : ''}`}
                      style={{ '--member-index': memberIndex }}
                    >
                      {/* Horizontal trunk from household card edge to branch spine */}
                      <div className="relationships-tab__trunk">
                        <div className="relationships-tab__trunk-line" />
                      </div>
                      {/* Level 1: one branch per relationship type */}
                      <div className="relationships-tab__branches">
                        {typeGroups.map(([type, contacts]) => {
                          const connBadge = getConnectionBadge(contacts[0].role)
                          const neutralLabel = connectorLabels[type] || contacts[0].role

                          return (
                            <div key={type} className="relationships-tab__branch">
                              <div className="relationships-tab__branch-connector">
                                <div className="relationships-tab__connector-line"></div>
                                <span
                                  className="relationships-tab__connector-label"
                                  style={{ color: connBadge.color, borderColor: connBadge.color }}
                                >
                                  {neutralLabel}
                                </span>
                                <div className="relationships-tab__connector-line"></div>
                              </div>
                              {contacts.length === 1 ? (
                                /* Single contact in this type → direct card */
                                renderOrgCard(contacts[0])
                              ) : (
                                /* Multiple contacts → level-2 sub-tree */
                                <div className="relationships-tab__sub-branches">
                                  {contacts.map((rel) => (
                                    <div key={rel.id} className="relationships-tab__sub-branch">
                                      <div className="relationships-tab__sub-connector"></div>
                                      {renderOrgCard(rel)}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ) : (
          /* Standalone patron (no household) */
          <div className="relationships-tab__graph-inner relationships-tab__graph-inner--standalone">
            <div className="relationships-tab__standalone-column">
              <div className="relationships-tab__patron-card">
                <div className="relationships-tab__member-avatar">
                  {currentPatron?.photo ? (
                    <img src={currentPatron.photo} alt={`${currentPatron.firstName} ${currentPatron.lastName}`} />
                  ) : (
                    <span className="relationships-tab__member-initials">
                      {getInitials(`${currentPatron?.firstName || ''} ${currentPatron?.lastName || ''}`)}
                    </span>
                  )}
                </div>
                <span className="relationships-tab__patron-card-name">
                  {currentPatron?.firstName} {currentPatron?.lastName}
                </span>
              </div>

              <div className="relationships-tab__actions">
                <button className="relationships-tab__action-btn" onClick={() => onAddRelationship && onAddRelationship()}>
                  <i className="fa-solid fa-plus"></i>
                  Add relationship
                </button>
              </div>
            </div>

            {standaloneExternalRels.length > 0 && (
              <div className="relationships-tab__ext-column relationships-tab__ext-column--standalone">
                <div className="relationships-tab__ext-slot">
                  {renderConnections(standaloneExternalRels)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default RelationshipsTab
