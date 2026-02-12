import { useMemo } from 'react'
import { ReactFlow, Handle, Position, BaseEdge, Controls, Panel, getSmoothStepPath } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { getHouseholdForPatron, getHouseholdMembers, getPatronRelationships, getPatronById } from '../../data/patrons'
import { getInitials } from '../../utils/getInitials'
import './RelationshipsTab.css'

// ============================================
// CONSTANTS
// ============================================

// Canonical color per relationship type — single source of truth for badges, edges, and labels.
// Uses Fever Ignite DS brand colors chosen for colorblind safety (blue/orange/purple).
// household = primary blue, personal = warning orange, professional/org = accent purple
const typeColors = {
  'household': '#0089E3',
  'personal': '#FF8C00',
  'professional': '#6f41d7',
  'organization': '#6f41d7',
}

// ============================================
// LOOKUP HELPERS (pure, outside component)
// ============================================

const getColorForType = (type) => typeColors[type] || '#0089E3'

// Connector label = the specific role name (matches the badge on the card).
// No more abstract category labels like "Advisory" or "Employment".
const getConnectorLabel = (rel) => {
  if (rel.type === 'personal') return rel.role || 'Personal'
  return rel.externalContact?.title || rel.reciprocalRole || rel.role || ''
}

// LTV tier indicator — restaurant-style $/$$/$$$/$$$$ badges
const getLtvTier = (giving) => {
  if (!giving || giving.lifetimeValue == null) return null
  const v = giving.lifetimeValue
  if (v < 1000) return { label: '$', tooltip: `Lifetime Value: $${v.toLocaleString()}` }
  if (v < 10000) return { label: '$$', tooltip: `Lifetime Value: $${v.toLocaleString()}` }
  if (v < 50000) return { label: '$$$', tooltip: `Lifetime Value: $${v.toLocaleString()}` }
  return { label: '$$$$', tooltip: `Lifetime Value: $${v.toLocaleString()}` }
}

// Status icon + tooltip for non-active patrons
const statusConfig = {
  deceased: { icon: 'fa-solid fa-cross', label: 'Deceased', className: 'relationships-tab__status-icon--deceased' },
  inactive: { icon: 'fa-solid fa-pause', label: 'Inactive', className: 'relationships-tab__status-icon--inactive' },
  archived: { icon: 'fa-solid fa-box-archive', label: 'Archived', className: 'relationships-tab__status-icon--archived' },
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
      className={`${cfg.icon} relationships-tab__status-icon ${cfg.className}`}
      title={getStatusTooltip(patronData)}
    ></i>
  )
}

const isNonActive = (patronData) => {
  if (!patronData) return false
  const status = patronData.status || 'active'
  return status === 'deceased' || status === 'inactive' || status === 'archived'
}

// Build edge style — dashed for non-active linked patrons
const getEdgeStyle = (color, rel) => {
  const base = { stroke: color, strokeWidth: 1.5 }
  if (isNonActive(rel.linkedPatron)) base.strokeDasharray = '6 4'
  return base
}

// ============================================
// SHARED RENDERERS (used by React Flow nodes + mobile fallback)
// ============================================

// Org/Professional/Personal card — single relationship, per-badge dismiss
const renderOrgCard = (rel, { onNavigateToPatron, onEndRelationship } = {}) => {
  const orgTitle = rel.type === 'personal'
    ? (rel.role || '')
    : (rel.externalContact?.title || rel.reciprocalRole || '')
  const orgName = rel.externalContact?.company || rel.displayName || ''
  const orgInitials = rel.externalContact?.initials || rel.initials || '??'
  const badgeColor = getColorForType(rel.type)
  const isClickable = !!rel.linkedPatron
  const handleNav = () => { if (isClickable && onNavigateToPatron) onNavigateToPatron(rel.linkedPatron.id) }
  const dimmed = isNonActive(rel.linkedPatron)
  const ltvTier = getLtvTier(rel.linkedPatron?.giving)

  return (
    <div
      className={`relationships-tab__org-card ${isClickable ? 'relationships-tab__org-card--clickable' : ''} ${dimmed ? 'relationships-tab__org-card--inactive' : ''}`}
      onClick={handleNav}
      {...(isClickable ? {
        role: 'button',
        tabIndex: 0,
        onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleNav() } },
      } : {})}
    >
      {ltvTier && (
        <span className="relationships-tab__ltv-badge" title={ltvTier.tooltip}>{ltvTier.label}</span>
      )}
      <div className={rel.type === 'organization' ? 'relationships-tab__org-avatar' : 'relationships-tab__member-avatar'}>
        {rel.linkedPatron?.photo ? (
          <img src={rel.linkedPatron.photo} alt={rel.displayName} />
        ) : (
          <span className="relationships-tab__org-initials">{orgInitials}</span>
        )}
      </div>
      <div className="relationships-tab__org-info">
        <span className="relationships-tab__org-name">
          {orgName}
          {renderStatusIcon(rel.linkedPatron)}
        </span>
        {rel.type === 'personal' && rel.linkedPatron?.householdName && (
          <span className="relationships-tab__org-household-label">
            <i className="fa-solid fa-house-chimney relationships-tab__household-icon"></i>
            {rel.linkedPatron.householdName}
          </span>
        )}
        {orgTitle && (
          <span
            className="relationships-tab__org-title-badge relationships-tab__org-title-badge--dismissible"
            style={{ color: badgeColor, borderColor: badgeColor }}
            title={rel.notes || ''}
          >
            {orgTitle}
            {onEndRelationship && (
              <button
                className="relationships-tab__badge-dismiss nodrag nopan nowheel"
                title={`End ${orgTitle} relationship`}
                onClick={(e) => { e.stopPropagation(); onEndRelationship(rel) }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </span>
        )}
      </div>
    </div>
  )
}

// Bridging card — single card for a patron with relationships on BOTH sides (e.g., Friend + Client).
// Shows the person once with stacked role badges, each with its own dismiss button.
const renderBridgingCard = (rels, { onNavigateToPatron, onEndRelationship } = {}) => {
  // Use the professional/org rel for primary display (more actionable for gift officers)
  const primaryRel = rels.find(r => r.type !== 'personal') || rels[0]
  const orgName = primaryRel.displayName || ''
  const orgInitials = primaryRel.initials || '??'
  const linkedPatron = primaryRel.linkedPatron
  const isClickable = !!linkedPatron
  const handleNav = () => { if (isClickable && onNavigateToPatron) onNavigateToPatron(linkedPatron.id) }
  const dimmed = isNonActive(linkedPatron)
  const ltvTier = getLtvTier(linkedPatron?.giving)

  // Build one badge per relationship — color by type, not by role
  const badges = rels.map(rel => {
    const title = rel.type === 'personal'
      ? (rel.role || '')
      : (rel.externalContact?.title || rel.reciprocalRole || '')
    return { title, color: getColorForType(rel.type), rel }
  }).filter(b => b.title)

  return (
    <div
      className={`relationships-tab__org-card ${isClickable ? 'relationships-tab__org-card--clickable' : ''} ${dimmed ? 'relationships-tab__org-card--inactive' : ''}`}
      onClick={handleNav}
      {...(isClickable ? {
        role: 'button',
        tabIndex: 0,
        onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleNav() } },
      } : {})}
    >
      {ltvTier && (
        <span className="relationships-tab__ltv-badge" title={ltvTier.tooltip}>{ltvTier.label}</span>
      )}
      <div className="relationships-tab__member-avatar">
        {linkedPatron?.photo ? (
          <img src={linkedPatron.photo} alt={orgName} />
        ) : (
          <span className="relationships-tab__org-initials">{orgInitials}</span>
        )}
      </div>
      <div className="relationships-tab__org-info">
        <span className="relationships-tab__org-name">
          {orgName}
          {renderStatusIcon(linkedPatron)}
        </span>
        {linkedPatron?.householdName && (
          <span className="relationships-tab__org-household-label">
            <i className="fa-solid fa-house-chimney relationships-tab__household-icon"></i>
            {linkedPatron.householdName}
          </span>
        )}
        <div className="relationships-tab__org-badges">
          {badges.map((b, i) => (
            <span
              key={i}
              className="relationships-tab__org-title-badge relationships-tab__org-title-badge--dismissible"
              style={{ color: b.color, borderColor: b.color }}
              title={b.rel.notes || ''}
            >
              {b.title}
              {onEndRelationship && (
                <button
                  className="relationships-tab__badge-dismiss nodrag nopan nowheel"
                  title={`End ${b.title} relationship`}
                  onClick={(e) => { e.stopPropagation(); onEndRelationship(b.rel) }}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// Household wrapper (blue container with title, member rows, action buttons)
// Shared by HouseholdNode (inside React Flow) and mobile fallback (plain HTML).
const renderHouseholdContent = ({ household, householdMembers, patronId, allRelationships, onNavigateToPatron, onEndRelationship, onAddRelationship, onEditHousehold, onRemoveFromHousehold }) => {
  const handleMemberClick = (member) => {
    if (member.patronId !== patronId && onNavigateToPatron) {
      onNavigateToPatron(member.patronId)
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
      linkedPatron: member.patron
        ? { id: member.patronId, firstName: member.patron.firstName, lastName: member.patron.lastName }
        : null,
    }
  }

  const handleRemoveMember = (e, member) => {
    e.stopPropagation()
    const rel = getHouseholdRelationship(member)
    if (rel && onEndRelationship) onEndRelationship(rel)
  }

  const handleMoveOut = (e, member) => {
    e.stopPropagation()
    if (onRemoveFromHousehold) onRemoveFromHousehold(member)
  }

  return (
    <div className="relationships-tab__household-wrapper">
      <h4 className="relationships-tab__household-name">
        {household.name} ({householdMembers.length})
      </h4>

      <div className="relationships-tab__household-card">
        {householdMembers.map((member) => {
          const isCurrentPatron = member.patronId === patronId
          const isHead = member.role === 'Head'
          const isClickable = !isCurrentPatron

          // Use the relational role (what this member is TO the viewed patron)
          // from the relationship record, falling back to the structural role.
          const hhRel = !isCurrentPatron ? getHouseholdRelationship(member) : null
          const relationalRole = hhRel?.role || member.role
          const badgeColor = typeColors['household']
          const handleClick = () => handleMemberClick(member)

          // Find any non-household relationships to this household member
          // (e.g., Marianne could be both Spouse and Business Partner)
          const extraRels = isClickable
            ? allRelationships.filter(r => r.type !== 'household' && r.toPatronId === member.patronId)
            : []

          const memberDimmed = !isCurrentPatron && isNonActive(member.patron)
          const memberLtvTier = !isCurrentPatron ? getLtvTier(member.patron?.giving) : null

          return (
            <div
              key={member.id}
              className={`relationships-tab__member${isClickable ? ' relationships-tab__member--clickable nodrag nopan nowheel' : ''}${memberDimmed ? ' relationships-tab__member--inactive' : ''}`}
              onClick={handleClick}
              {...(isClickable ? {
                role: 'button',
                tabIndex: 0,
                onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick() } },
              } : {})}
            >
              {memberLtvTier && (
                <span className="relationships-tab__ltv-badge" title={memberLtvTier.tooltip}>{memberLtvTier.label}</span>
              )}
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
                  {!isCurrentPatron && renderStatusIcon(member.patron)}
                </span>
                <div className="relationships-tab__badges">
                  {isHead && (
                    <span className="relationships-tab__role-badge relationships-tab__role-badge--head">
                      <i className="fa-solid fa-circle-check"></i>
                      Head of household
                    </span>
                  )}
                  {!isCurrentPatron && (
                    <span
                      className={`relationships-tab__role-badge${onEndRelationship ? ' relationships-tab__role-badge--dismissible' : ''}`}
                      style={{ color: badgeColor, borderColor: badgeColor }}
                      title={hhRel?.notes || ''}
                    >
                      {relationalRole}
                      {onEndRelationship && (
                        <button
                          className="relationships-tab__badge-dismiss nodrag nopan nowheel"
                          title={`End ${relationalRole} relationship`}
                          onClick={(e) => handleRemoveMember(e, member)}
                        >
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      )}
                    </span>
                  )}
                  {isClickable && onRemoveFromHousehold && (
                    <button
                      className="relationships-tab__move-out-btn nodrag nopan nowheel"
                      title={`Remove ${member.patron?.firstName || 'member'} from household`}
                      onClick={(e) => handleMoveOut(e, member)}
                    >
                      <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    </button>
                  )}
                  {extraRels.map(rel => {
                    const title = rel.type === 'personal' ? rel.role : (rel.reciprocalRole || rel.role)
                    const extraColor = getColorForType(rel.type)
                    return (
                      <span
                        key={rel.id}
                        className="relationships-tab__role-badge relationships-tab__role-badge--dismissible"
                        style={{ color: extraColor, borderColor: extraColor }}
                        title={rel.notes || ''}
                      >
                        {title}
                        {onEndRelationship && (
                          <button
                            className="relationships-tab__badge-dismiss nodrag nopan nowheel"
                            title={`End ${title} relationship`}
                            onClick={(e) => { e.stopPropagation(); onEndRelationship(rel) }}
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        )}
                      </span>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="relationships-tab__actions">
        <button className="relationships-tab__action-btn nodrag nopan nowheel" onClick={() => onAddRelationship && onAddRelationship('household')}>
          <i className="fa-solid fa-plus"></i>
          Add household member
        </button>
        <button className="relationships-tab__action-btn nodrag nopan nowheel" onClick={() => onEditHousehold && onEditHousehold()}>
          <i className="fa-solid fa-pen-to-square"></i>
          Edit household
        </button>
      </div>
    </div>
  )
}

// ============================================
// REACT FLOW CUSTOM NODES + EDGES
// Defined outside component to prevent re-renders.
// ============================================

// Distance from wrapper top to Anderson's row vertical center:
// top-padding(48) + title(~20) + gap(24) + card-border(1) + half-row(36) = 129px
const HH_HANDLE_TOP = 129

// Household node — root wraps the full blue wrapper directly (no absolute positioning).
// React Flow uses the real rendered size for fitView. Handles are positioned at the
// patron's row level. Horizontal padding removed via CSS so card edge = wrapper edge.
function HouseholdNode({ data }) {
  const rightYs = data.rightHandleYs || []
  const leftYs = data.leftHandleYs || []
  return (
    <div
      className="relationships-tab__hh-node-root nopan nodrag nowheel"
      style={{ position: 'relative', pointerEvents: 'all' }}
    >
      {renderHouseholdContent(data)}
      {rightYs.map((y, i) => (
        <Handle key={`right-${i}`} id={`right-${i}`} type="source" position={Position.Right} isConnectable={false}
          style={{ top: y }} />
      ))}
      {leftYs.map((y, i) => (
        <Handle key={`left-${i}`} id={`left-${i}`} type="target" position={Position.Left} isConnectable={false}
          style={{ top: y }} />
      ))}
    </div>
  )
}

// Standalone patron node (no household) — patron card + add button
function StandalonePatronNode({ data }) {
  const { patron, onAddRelationship } = data
  const rightYs = data.rightHandleYs || []
  const leftYs = data.leftHandleYs || []
  return (
    <div className="nopan nodrag nowheel" style={{ position: 'relative', pointerEvents: 'all' }}>
      <div className="relationships-tab__standalone-column">
        <div className="relationships-tab__patron-card">
          <div className="relationships-tab__member-avatar">
            {patron?.photo ? (
              <img src={patron.photo} alt={`${patron.firstName} ${patron.lastName}`} />
            ) : (
              <span className="relationships-tab__member-initials">
                {getInitials(`${patron?.firstName || ''} ${patron?.lastName || ''}`)}
              </span>
            )}
          </div>
          <span className="relationships-tab__patron-card-name">
            {patron?.firstName} {patron?.lastName}
          </span>
        </div>
      </div>
      {rightYs.map((y, i) => (
        <Handle key={`right-${i}`} id={`right-${i}`} type="source" position={Position.Right} isConnectable={false}
          style={{ top: y }} />
      ))}
      {leftYs.map((y, i) => (
        <Handle key={`left-${i}`} id={`left-${i}`} type="target" position={Position.Left} isConnectable={false}
          style={{ top: y }} />
      ))}
    </div>
  )
}

// External relationship card node — side determines Handle placement.
// Right-side cards (professional/org): target Handle on Left.
// Left-side cards (personal): source Handle on Right, right-aligned so the
// right edge of every card aligns at the same X regardless of content width.
function ExternalCardNode({ data }) {
  const { rel, onNavigateToPatron, onEndRelationship, side } = data
  return (
    <div
      className="nodrag nopan nowheel"
      style={{
        position: 'relative',
        pointerEvents: 'all',
        ...(side === 'left' ? {
          width: EXT_CARD_WIDTH,
          display: 'flex',
          justifyContent: 'flex-end',
          overflow: 'visible',
        } : {}),
      }}
    >
      {side === 'left' ? (
        <Handle id="right" type="source" position={Position.Right} isConnectable={false} style={{ top: 36 }} />
      ) : (
        <Handle id="left" type="target" position={Position.Left} isConnectable={false} style={{ top: 36 }} />
      )}
      {renderOrgCard(rel, { onNavigateToPatron, onEndRelationship })}
    </div>
  )
}

// Grouped card node — single node for a patron with 2+ relationships.
// Used for bridging patrons (both sides) AND same-side groups (e.g., Friend + Mentor).
// Side-aware: right side uses left target handles, left side uses right source handles.
// For left-side placement, right-aligns the card so edges connect at the card's right edge.
function BridgingCardNode({ data }) {
  const { rels, onNavigateToPatron, onEndRelationship, side } = data
  const handleCount = rels.length
  // Distribute handles evenly within the card height (72px), centered
  const spacing = 48 / (handleCount + 1)
  const isLeft = side === 'left'
  return (
    <div
      className="nodrag nopan nowheel"
      style={{
        position: 'relative',
        pointerEvents: 'all',
        ...(isLeft ? {
          width: EXT_CARD_WIDTH,
          display: 'flex',
          justifyContent: 'flex-end',
          overflow: 'visible',
        } : {}),
      }}
    >
      {rels.map((_, i) => (
        <Handle
          key={`${isLeft ? 'right' : 'left'}-${i}`}
          id={`${isLeft ? 'right' : 'left'}-${i}`}
          type={isLeft ? 'source' : 'target'}
          position={isLeft ? Position.Right : Position.Left}
          isConnectable={false}
          style={{ top: 12 + spacing * (i + 1) }}
        />
      ))}
      {renderBridgingCard(rels, { onNavigateToPatron, onEndRelationship })}
    </div>
  )
}

// Edge — hybrid routing: straight horizontal line when source/target are at the same Y,
// step path with hard 90-degree corners when they differ. Each edge has its own handle on both sides.
// Half-stagger: edges on each side are split into upper/lower halves relative to the patron centre.
// Within each half, the card furthest from centre gets its bend-X closest to the centre node,
// creating nested paths that never cross while preserving top-bottom symmetry.
// No inline labels — role info is shown on the target card badges.
const STAGGER_SPACING = 35 // px between staggered vertical segments

function LabeledEdge({ id, sourceX, sourceY, targetX, targetY, data, style }) {
  const isFlat = Math.abs(sourceY - targetY) < 2
  const { halfStaggerIndex = 0, halfStaggerTotal = 1 } = data

  let edgePath
  if (isFlat) {
    edgePath = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`
  } else if (halfStaggerTotal > 1) {
    // Staggered step path: spread vertical segments within each upper/lower half
    const midX = (sourceX + targetX) / 2
    const offset = ((halfStaggerTotal - 1) / 2 - halfStaggerIndex) * STAGGER_SPACING
    const bendX = midX + offset * (data.side === 'left' ? -1 : 1)
    edgePath = `M ${sourceX} ${sourceY} H ${bendX} V ${targetY} H ${targetX}`
  } else {
    const [path] = getSmoothStepPath({
      sourceX, sourceY, targetX, targetY,
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      borderRadius: 0,
    })
    edgePath = path
  }

  return <BaseEdge id={id} path={edgePath} style={style} />
}

// MUST be outside the component to prevent re-renders
const nodeTypes = { household: HouseholdNode, standalone: StandalonePatronNode, externalCard: ExternalCardNode, bridgingCard: BridgingCardNode }
const edgeTypes = { labeled: LabeledEdge }

// Layout constants
const BASE_CARD_HEIGHT = 72       // 12px pad-top + 48px avatar + 12px pad-bottom
const CARD_GAP_PX = 28            // desired uniform whitespace gap between cards
const HOUSEHOLD_LABEL_EXTRA = 20  // extra height when household label line is present
const BADGE_WRAP_EXTRA = 26       // extra height per additional badge row (wrap)
const EXT_CARD_WIDTH = 260   // approximate external card width
const CARD_GAP = 250         // horizontal gap between patron node and external cards
const PATRON_WIDTH = 343     // household card / standalone card width

// Estimate rendered height of an external card from its data (no DOM measurement needed).
// Keeps layout single-pass so fitView centres correctly on first render.
function estimateCardHeight(rel, isBridging = false, rels = []) {
  let h = BASE_CARD_HEIGHT
  // Personal cards with a household label add a sub-line
  if (rel.type === 'personal' && rel.linkedPatron?.householdName) {
    h += HOUSEHOLD_LABEL_EXTRA
  }
  // Bridging / grouped cards: if badges likely wrap (3+ badges at ~60px each in ~180px space)
  if (isBridging && rels.length >= 3) {
    h += BADGE_WRAP_EXTRA
  }
  return h
}

// ============================================
// MAIN COMPONENT
// ============================================

function RelationshipsTab({ patronId, onNavigateToPatron, onAddRelationship, onEndRelationship, onEditHousehold, onRemoveFromHousehold, onUndo, onRedo, canUndo, canRedo }) {
  // ---- Data hooks ----
  const household = useMemo(() => getHouseholdForPatron(patronId), [patronId])
  const householdMembers = useMemo(() => {
    if (!household) return []
    const members = getHouseholdMembers(household.id)
    return members.sort((a, b) => {
      if (a.patronId === patronId) return -1
      if (b.patronId === patronId) return 1
      return 0
    })
  }, [household, patronId])

  const allRelationships = useMemo(() => getPatronRelationships(patronId), [patronId])
  const currentPatron = useMemo(() => getPatronById(patronId), [patronId])

  // Filter external rels: exclude household type AND any rels pointing to household members
  // (those get annotated as extra badges on the household member row instead of separate cards).
  const householdPatronIds = useMemo(() => new Set(householdMembers.map(m => m.patronId)), [householdMembers])
  const externalRels = useMemo(() => {
    return allRelationships.filter(r =>
      r.type !== 'household' && !householdPatronIds.has(r.toPatronId)
    )
  }, [allRelationships, householdPatronIds])

  // Split external rels: personal on the left, professional/org on the right
  const leftRels = useMemo(() => externalRels.filter(r => r.type === 'personal'), [externalRels])
  const rightRels = useMemo(() => externalRels.filter(r => r.type !== 'personal'), [externalRels])

  // Group relationships by toPatronId, detecting:
  //   1. Bridging patrons — same toPatronId in both personal (left) and professional (right)
  //   2. Same-side groups — 2+ rels of the same type to the same patron (e.g., Friend + Mentor)
  //   3. Singles — exactly 1 rel to a patron on one side
  const { leftSingles, leftGroups, rightSingles, rightGroups, bridgingGroups } = useMemo(() => {
    const leftByPatron = new Map()
    leftRels.forEach(r => {
      if (!r.toPatronId) return
      if (!leftByPatron.has(r.toPatronId)) leftByPatron.set(r.toPatronId, [])
      leftByPatron.get(r.toPatronId).push(r)
    })
    const rightByPatron = new Map()
    rightRels.forEach(r => {
      if (!r.toPatronId) return
      if (!rightByPatron.has(r.toPatronId)) rightByPatron.set(r.toPatronId, [])
      rightByPatron.get(r.toPatronId).push(r)
    })

    // Bridging: patron appears on both sides
    const bridgingIds = new Set()
    leftByPatron.forEach((_, pid) => {
      if (rightByPatron.has(pid)) bridgingIds.add(pid)
    })

    // Helper: split non-bridging rels into singles (1 rel) and groups (2+ rels).
    // Also includes rels with no toPatronId (e.g., organization rels) as singles,
    // since they were skipped when building the byPatron Map.
    const splitByPatron = (byPatronMap, allSideRels) => {
      const singles = []
      const groups = []
      byPatronMap.forEach((relArr, pid) => {
        if (bridgingIds.has(pid)) return
        if (relArr.length === 1) singles.push(relArr[0])
        else groups.push({ patronId: pid, allRels: relArr })
      })
      // Include rels with no toPatronId (e.g., organization rels) — always singles
      allSideRels.forEach(r => { if (!r.toPatronId) singles.push(r) })
      return { singles, groups }
    }

    const left = splitByPatron(leftByPatron, leftRels)
    const right = splitByPatron(rightByPatron, rightRels)

    return {
      leftSingles: left.singles,
      leftGroups: left.groups,
      rightSingles: right.singles,
      rightGroups: right.groups,
      bridgingGroups: [...bridgingIds].map(pid => ({
        patronId: pid,
        allRels: [...(rightByPatron.get(pid) || []), ...(leftByPatron.get(pid) || [])],
      })),
    }
  }, [leftRels, rightRels])

  // ---- Flags ----
  const hasHousehold = household && householdMembers.length > 0
  const hasExternal = externalRels.length > 0
  const hasAnyRelationships = hasHousehold || hasExternal

  // ---- React Flow: build nodes + edges ----
  const { nodes, edges } = useMemo(() => {
    if (!hasAnyRelationships) return { nodes: [], edges: [] }

    const n = []
    const e = []

    // Dynamic X positioning: if there are left cards, patron shifts right to make room
    const hasLeft = leftSingles.length > 0 || leftGroups.length > 0
    const hasRight = rightSingles.length > 0 || rightGroups.length > 0 || bridgingGroups.length > 0
    const patronX = hasLeft ? (EXT_CARD_WIDTH + CARD_GAP) : 0
    const leftX = 0
    const rightX = patronX + PATRON_WIDTH + CARD_GAP

    // Anchor Y: all external cards are vertically centered relative to the Handle.
    // For household, Handle is at HH_HANDLE_TOP from node top.
    // For standalone, Handle is at 36px from node top.
    const handleOffsetY = hasHousehold ? HH_HANDLE_TOP : 36

    // --- Pre-compute card heights and accumulated Y positions ---
    // Each side builds a heights array in iteration order (singles → groups → bridging),
    // accumulates Y positions with uniform CARD_GAP_PX between cards, then centres
    // the column so the midpoint of the first/last card handles aligns with handleOffsetY.

    // Left side: personal singles, then same-side groups
    const leftEdgeCount = leftSingles.length + leftGroups.reduce((sum, g) => sum + g.allRels.length, 0)
    const leftHeights = [
      ...leftSingles.map(rel => estimateCardHeight(rel)),
      ...leftGroups.map(group => estimateCardHeight(group.allRels[0], true, group.allRels)),
    ]
    const leftYs = []
    { let acc = 0; leftHeights.forEach(h => { leftYs.push(acc); acc += h + CARD_GAP_PX }) }
    // Centre: handle sits at y=36 inside each card
    const leftFirstHandle = leftYs.length > 0 ? leftYs[0] + 36 : 0
    const leftLastHandle = leftYs.length > 0 ? leftYs[leftYs.length - 1] + 36 : 0
    const leftShift = handleOffsetY - (leftFirstHandle + leftLastHandle) / 2

    // Right side: professional/org singles, then same-side groups, then bridging groups
    const rightEdgeCount = rightSingles.length + rightGroups.reduce((sum, g) => sum + g.allRels.length, 0) + bridgingGroups.reduce((sum, g) => sum + g.allRels.length, 0)
    const rightHeights = [
      ...rightSingles.map(rel => estimateCardHeight(rel)),
      ...rightGroups.map(group => estimateCardHeight(group.allRels[0], true, group.allRels)),
      ...bridgingGroups.map(group => estimateCardHeight(group.allRels[0], true, group.allRels)),
    ]
    const rightYs = []
    { let acc = 0; rightHeights.forEach(h => { rightYs.push(acc); acc += h + CARD_GAP_PX }) }
    const rightFirstHandle = rightYs.length > 0 ? rightYs[0] + 36 : 0
    const rightLastHandle = rightYs.length > 0 ? rightYs[rightYs.length - 1] + 36 : 0
    const rightShift = handleOffsetY - (rightFirstHandle + rightLastHandle) / 2

    // Source-node handle Y arrays: N handles per side, evenly distributed around handleOffsetY
    const HANDLE_SPACING = 16
    const rightHandleYs = Array.from({ length: rightEdgeCount }, (_, i) =>
      handleOffsetY + (i - (rightEdgeCount - 1) / 2) * HANDLE_SPACING
    )
    const leftHandleYs = Array.from({ length: leftEdgeCount }, (_, i) =>
      handleOffsetY + (i - (leftEdgeCount - 1) / 2) * HANDLE_SPACING
    )

    // ---- Half-stagger pre-computation ----
    // Split edges on each side into upper/lower halves relative to handleOffsetY.
    // Stagger bend-X only within each half so upper and lower fans are symmetric.
    // Key rule: the card FURTHEST from centre gets its bend-X CLOSEST to the centre
    // node, creating nested paths that never cross. Upper-half indices are therefore
    // assigned in reverse (top-to-bottom → highest index first) while lower-half
    // indices keep natural order (top-to-bottom → lowest index first).
    const HALF_FLAT_THRESHOLD = 2

    // Left side
    const leftEdgeHalves = []
    leftSingles.forEach((_rel, i) => {
      const cardHandleY = leftYs[i] + leftShift + 36
      leftEdgeHalves.push({ cardHandleY })
    })
    leftGroups.forEach((group, gi) => {
      const cardHandleY = leftYs[leftSingles.length + gi] + leftShift + 36
      group.allRels.forEach(() => leftEdgeHalves.push({ cardHandleY }))
    })
    {
      let upperCount = 0, lowerCount = 0
      leftEdgeHalves.forEach(entry => {
        entry.isUpper = entry.cardHandleY < handleOffsetY - HALF_FLAT_THRESHOLD
        entry.isLower = entry.cardHandleY > handleOffsetY + HALF_FLAT_THRESHOLD
        if (entry.isUpper) upperCount++
        else if (entry.isLower) lowerCount++
      })
      let ui = 0, li = 0
      leftEdgeHalves.forEach(entry => {
        if (entry.isUpper) { entry.halfStaggerIndex = upperCount - 1 - ui++; entry.halfStaggerTotal = upperCount }
        else if (entry.isLower) { entry.halfStaggerIndex = li++; entry.halfStaggerTotal = lowerCount }
        else { entry.halfStaggerIndex = 0; entry.halfStaggerTotal = 1 }
      })
    }

    // Right side
    const rightEdgeHalves = []
    rightSingles.forEach((_rel, i) => {
      const cardHandleY = rightYs[i] + rightShift + 36
      rightEdgeHalves.push({ cardHandleY })
    })
    rightGroups.forEach((group, gi) => {
      const cardHandleY = rightYs[rightSingles.length + gi] + rightShift + 36
      group.allRels.forEach(() => rightEdgeHalves.push({ cardHandleY }))
    })
    bridgingGroups.forEach((group, bi) => {
      const cardHandleY = rightYs[rightSingles.length + rightGroups.length + bi] + rightShift + 36
      group.allRels.forEach(() => rightEdgeHalves.push({ cardHandleY }))
    })
    {
      let upperCount = 0, lowerCount = 0
      rightEdgeHalves.forEach(entry => {
        entry.isUpper = entry.cardHandleY < handleOffsetY - HALF_FLAT_THRESHOLD
        entry.isLower = entry.cardHandleY > handleOffsetY + HALF_FLAT_THRESHOLD
        if (entry.isUpper) upperCount++
        else if (entry.isLower) lowerCount++
      })
      let ui = 0, li = 0
      rightEdgeHalves.forEach(entry => {
        if (entry.isUpper) { entry.halfStaggerIndex = upperCount - 1 - ui++; entry.halfStaggerTotal = upperCount }
        else if (entry.isLower) { entry.halfStaggerIndex = li++; entry.halfStaggerTotal = lowerCount }
        else { entry.halfStaggerIndex = 0; entry.halfStaggerTotal = 1 }
      })
    }

    // Source node — pass handle Y arrays (centered distribution around patron row)
    if (hasHousehold) {
      n.push({
        id: 'source',
        type: 'household',
        position: { x: patronX, y: 0 },
        data: { household, householdMembers, patronId, allRelationships, onNavigateToPatron, onEndRelationship, onAddRelationship, onEditHousehold, onRemoveFromHousehold, rightHandleYs, leftHandleYs },
      })
    } else {
      n.push({
        id: 'source',
        type: 'standalone',
        position: { x: patronX, y: 0 },
        data: { patron: currentPatron, onAddRelationship, rightHandleYs, leftHandleYs },
      })
    }

    // Running counters for indexed source/target handles on the source node
    let leftEdgeIdx = 0
    let rightEdgeIdx = 0
    // Running counters for half-stagger lookup
    let leftHalfIdx = 0
    let rightHalfIdx = 0

    // ---- Left side: singles + same-side groups ----
    let leftCardIdx = 0

    // Left single cards — one card per relationship
    leftSingles.forEach((rel) => {
      const color = getColorForType(rel.type)
      const nodeId = `ext-${rel.id}`
      const hs = leftEdgeHalves[leftHalfIdx++]
      n.push({
        id: nodeId,
        type: 'externalCard',
        position: { x: leftX, y: leftYs[leftCardIdx] + leftShift },
        data: { rel, onNavigateToPatron, onEndRelationship, side: 'left' },
      })
      e.push({
        id: `edge-${rel.id}`,
        source: nodeId,
        sourceHandle: 'right',
        target: 'source',
        targetHandle: `left-${leftEdgeIdx++}`,
        type: 'labeled',
        style: getEdgeStyle(color, rel),
        data: { label: getConnectorLabel(rel), color, side: 'left', halfStaggerIndex: hs.halfStaggerIndex, halfStaggerTotal: hs.halfStaggerTotal },
      })
      leftCardIdx++
    })

    // Left grouped cards — 2+ rels to the same patron, one card with stacked badges
    leftGroups.forEach((group) => {
      const nodeId = `grouped-left-${group.patronId}`
      n.push({
        id: nodeId,
        type: 'bridgingCard',
        position: { x: leftX, y: leftYs[leftCardIdx] + leftShift },
        data: { rels: group.allRels, onNavigateToPatron, onEndRelationship, side: 'left' },
      })
      group.allRels.forEach((rel, relIdx) => {
        const color = getColorForType(rel.type)
        const hs = leftEdgeHalves[leftHalfIdx++]
        e.push({
          id: `edge-${rel.id}`,
          source: nodeId,
          sourceHandle: `right-${relIdx}`,
          target: 'source',
          targetHandle: `left-${leftEdgeIdx++}`,
          type: 'labeled',
          style: getEdgeStyle(color, rel),
          data: { label: getConnectorLabel(rel), color, side: 'left', halfStaggerIndex: hs.halfStaggerIndex, halfStaggerTotal: hs.halfStaggerTotal },
        })
      })
      leftCardIdx++
    })

    // ---- Right side: singles + same-side groups + bridging ----
    let rightCardIdx = 0

    // Right single cards — one card per relationship
    rightSingles.forEach((rel) => {
      const color = getColorForType(rel.type)
      const nodeId = `ext-${rel.id}`
      const hs = rightEdgeHalves[rightHalfIdx++]
      n.push({
        id: nodeId,
        type: 'externalCard',
        position: { x: rightX, y: rightYs[rightCardIdx] + rightShift },
        data: { rel, onNavigateToPatron, onEndRelationship, side: 'right' },
      })
      e.push({
        id: `edge-${rel.id}`,
        source: 'source',
        sourceHandle: `right-${rightEdgeIdx++}`,
        target: nodeId,
        targetHandle: 'left',
        type: 'labeled',
        style: getEdgeStyle(color, rel),
        data: { label: getConnectorLabel(rel), color, side: 'right', halfStaggerIndex: hs.halfStaggerIndex, halfStaggerTotal: hs.halfStaggerTotal },
      })
      rightCardIdx++
    })

    // Right grouped cards — 2+ rels of the same type to the same patron
    rightGroups.forEach((group) => {
      const nodeId = `grouped-right-${group.patronId}`
      n.push({
        id: nodeId,
        type: 'bridgingCard',
        position: { x: rightX, y: rightYs[rightCardIdx] + rightShift },
        data: { rels: group.allRels, onNavigateToPatron, onEndRelationship },
      })
      group.allRels.forEach((rel, relIdx) => {
        const color = getColorForType(rel.type)
        const hs = rightEdgeHalves[rightHalfIdx++]
        e.push({
          id: `edge-${rel.id}`,
          source: 'source',
          sourceHandle: `right-${rightEdgeIdx++}`,
          target: nodeId,
          targetHandle: `left-${relIdx}`,
          type: 'labeled',
          style: getEdgeStyle(color, rel),
          data: { label: getConnectorLabel(rel), color, side: 'right', halfStaggerIndex: hs.halfStaggerIndex, halfStaggerTotal: hs.halfStaggerTotal },
        })
      })
      rightCardIdx++
    })

    // Bridging nodes — consolidated cards with N edges each (patron on both sides)
    bridgingGroups.forEach((group) => {
      const nodeId = `bridging-${group.patronId}`
      n.push({
        id: nodeId,
        type: 'bridgingCard',
        position: { x: rightX, y: rightYs[rightCardIdx] + rightShift },
        data: { rels: group.allRels, onNavigateToPatron, onEndRelationship },
      })
      group.allRels.forEach((rel, relIdx) => {
        const color = getColorForType(rel.type)
        const hs = rightEdgeHalves[rightHalfIdx++]
        e.push({
          id: `edge-${rel.id}`,
          source: 'source',
          sourceHandle: `right-${rightEdgeIdx++}`,
          target: nodeId,
          targetHandle: `left-${relIdx}`,
          type: 'labeled',
          style: getEdgeStyle(color, rel),
          data: { label: getConnectorLabel(rel), color, side: 'right', halfStaggerIndex: hs.halfStaggerIndex, halfStaggerTotal: hs.halfStaggerTotal },
        })
      })
      rightCardIdx++
    })

    return { nodes: n, edges: e }
  }, [hasAnyRelationships, hasHousehold, household, householdMembers, patronId, allRelationships, currentPatron, externalRels, leftSingles, leftGroups, rightSingles, rightGroups, bridgingGroups, onNavigateToPatron, onEndRelationship, onAddRelationship, onEditHousehold, onRemoveFromHousehold])

  // ---- Empty state ----
  if (!hasAnyRelationships) {
    return (
      <div className="relationships-tab">
        <div className="relationships-tab__empty">
          <div className="relationships-tab__empty-text-group">
            <h3 className="relationships-tab__empty-title">
              Explore the connections between users, such as Households, professional ties, and more. Discover how everyone is linked!
            </h3>
            <p className="relationships-tab__empty-text">
              Start by adding the first relationship of this Patron
            </p>
          </div>
          <button className="relationships-tab__empty-action" onClick={() => onAddRelationship && onAddRelationship()}>
            <i className="fa-solid fa-plus"></i>
            Add new relationship
          </button>
        </div>
      </div>
    )
  }

  // ---- Mobile fallback (simple card list, no connectors) ----
  const renderMobileCards = () => {
    if (!hasExternal) return null

    // Build a consolidated list: pure (non-bridging) rels as singles, bridging groups as merged cards
    const pureRels = externalRels.filter(r => !bridgingGroups.some(g => g.patronId === r.toPatronId))

    return (
      <div className="relationships-tab__mobile-cards">
        {pureRels.map((rel) => {
          const color = getColorForType(rel.type)
          const label = getConnectorLabel(rel)
          return (
            <div key={rel.id} className="relationships-tab__mobile-card-row">
              <span
                className="relationships-tab__connector-label"
                style={{ color, borderColor: color }}
              >
                {label}
              </span>
              {renderOrgCard(rel, { onNavigateToPatron, onEndRelationship })}
            </div>
          )
        })}
        {bridgingGroups.map((group) => (
          <div key={`bridging-${group.patronId}`} className="relationships-tab__mobile-card-row">
            <div className="relationships-tab__mobile-labels">
              {group.allRels.map(rel => {
                const color = getColorForType(rel.type)
                const label = getConnectorLabel(rel)
                return (
                  <span key={rel.id} className="relationships-tab__connector-label" style={{ color, borderColor: color }}>
                    {label}
                  </span>
                )
              })}
            </div>
            {renderBridgingCard(group.allRels, { onNavigateToPatron, onEndRelationship })}
          </div>
        ))}
      </div>
    )
  }

  // ---- Main render ----
  return (
    <div className="relationships-tab">
      <div className="relationships-tab__toolbar">
        <button className="relationships-tab__add-btn" onClick={() => onAddRelationship && onAddRelationship()}>
          <i className="fa-solid fa-plus"></i>
          Add relationship
        </button>
      </div>
      <div className="relationships-tab__graph">
        {/* Desktop: Single React Flow canvas with everything inside */}
        <div className="relationships-tab__flow-container">
          <ReactFlow
            key={patronId}
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            fitViewOptions={{ padding: 0.15, maxZoom: 1 }}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            panOnDrag={true}
            zoomOnScroll={true}
            zoomOnPinch={true}
            minZoom={0.3}
            maxZoom={2}
            proOptions={{ hideAttribution: true }}
          >
            <Controls showInteractive={false} />
            {(canUndo || canRedo) && (
              <Panel position="top-left">
                <div className="relationships-tab__undo-bar">
                  <button
                    className="relationships-tab__undo-btn"
                    disabled={!canUndo}
                    onClick={onUndo}
                    title="Undo last action"
                  >
                    <i className="fa-solid fa-rotate-left" />
                  </button>
                  <button
                    className="relationships-tab__undo-btn"
                    disabled={!canRedo}
                    onClick={onRedo}
                    title="Redo last action"
                  >
                    <i className="fa-solid fa-rotate-right" />
                  </button>
                </div>
              </Panel>
            )}
            <Panel position="bottom-right">
              <div className="relationships-tab__legend">
                {[
                  hasHousehold && { color: typeColors['household'], label: 'Household' },
                  leftSingles.length > 0 || leftGroups.length > 0 || bridgingGroups.some(g => g.allRels.some(r => r.type === 'personal')) ? { color: typeColors['personal'], label: 'Personal' } : null,
                  rightSingles.length > 0 || rightGroups.length > 0 || bridgingGroups.some(g => g.allRels.some(r => r.type !== 'personal')) ? { color: typeColors['professional'], label: 'Professional' } : null,
                ].filter(Boolean).map(item => (
                  <div key={item.label} className="relationships-tab__legend-item">
                    <span className="relationships-tab__legend-swatch" style={{ background: item.color }} />
                    <span className="relationships-tab__legend-label">{item.label}</span>
                  </div>
                ))}
              </div>
            </Panel>
          </ReactFlow>
        </div>

        {/* Mobile fallback — plain HTML, no canvas */}
        <div className="relationships-tab__mobile-fallback">
          {hasHousehold && renderHouseholdContent({
            household, householdMembers, patronId, allRelationships,
            onNavigateToPatron, onEndRelationship, onAddRelationship, onEditHousehold, onRemoveFromHousehold,
          })}
          {!hasHousehold && (
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
            </div>
          )}
          {renderMobileCards()}
        </div>
      </div>
    </div>
  )
}

export default RelationshipsTab
