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

  return (
    <div
      className={`relationships-tab__org-card ${isClickable ? 'relationships-tab__org-card--clickable' : ''}`}
      onClick={handleNav}
      {...(isClickable ? {
        role: 'button',
        tabIndex: 0,
        onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleNav() } },
      } : {})}
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
        {rel.type === 'personal' && rel.linkedPatron?.householdName && (
          <span className="relationships-tab__org-household-label">
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

  // Build one badge per relationship — color by type, not by role
  const badges = rels.map(rel => {
    const title = rel.type === 'personal'
      ? (rel.role || '')
      : (rel.externalContact?.title || rel.reciprocalRole || '')
    return { title, color: getColorForType(rel.type), rel }
  }).filter(b => b.title)

  return (
    <div
      className={`relationships-tab__org-card ${isClickable ? 'relationships-tab__org-card--clickable' : ''}`}
      onClick={handleNav}
      {...(isClickable ? {
        role: 'button',
        tabIndex: 0,
        onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleNav() } },
      } : {})}
    >
      <div className="relationships-tab__member-avatar">
        {linkedPatron?.photo ? (
          <img src={linkedPatron.photo} alt={orgName} />
        ) : (
          <span className="relationships-tab__org-initials">{orgInitials}</span>
        )}
      </div>
      <div className="relationships-tab__org-info">
        <span className="relationships-tab__org-name">{orgName}</span>
        {linkedPatron?.householdName && (
          <span className="relationships-tab__org-household-label">
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

          return (
            <div
              key={member.id}
              className={`relationships-tab__member${isClickable ? ' relationships-tab__member--clickable nodrag nopan nowheel' : ''}`}
              onClick={handleClick}
              {...(isClickable ? {
                role: 'button',
                tabIndex: 0,
                onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick() } },
              } : {})}
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

// Bridging card node — single node for a patron that appears on BOTH sides.
// Placed on the right side with N left handles (one per relationship, evenly spaced)
// so colored edges can arrive without overlapping. Supports 2+ relationships.
function BridgingCardNode({ data }) {
  const { rels, onNavigateToPatron, onEndRelationship } = data
  const handleCount = rels.length
  // Distribute handles evenly within the card height (72px), centered
  const spacing = 48 / (handleCount + 1)
  return (
    <div
      className="nodrag nopan nowheel"
      style={{ position: 'relative', pointerEvents: 'all' }}
    >
      {rels.map((_, i) => (
        <Handle
          key={`left-${i}`}
          id={`left-${i}`}
          type="target"
          position={Position.Left}
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
// Bridging edges (staggerTotal > 1) use staggered bend points so vertical segments
// don't overlap: top edge bends further right, bottom edge bends further left (diagonal pattern).
// No inline labels — role info is shown on the target card badges + line colors indicate type.
const STAGGER_SPACING = 35 // px between staggered vertical segments

function LabeledEdge({ id, sourceX, sourceY, targetX, targetY, data, style }) {
  const isFlat = Math.abs(sourceY - targetY) < 2
  const { staggerIndex = 0, staggerTotal = 1 } = data

  let edgePath
  if (isFlat) {
    edgePath = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`
  } else if (staggerTotal > 1) {
    // Custom staggered step path: top edge bends further right, bottom further left
    const midX = (sourceX + targetX) / 2
    const offset = ((staggerTotal - 1) / 2 - staggerIndex) * STAGGER_SPACING
    const bendX = midX + offset
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
const ROW_HEIGHT = 100       // vertical spacing between external card nodes
const EXT_CARD_WIDTH = 260   // approximate external card width
const CARD_GAP = 250         // horizontal gap between patron node and external cards
const PATRON_WIDTH = 343     // household card / standalone card width

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

  // Detect bridging patrons — same toPatronId in both personal (left) and professional (right).
  // Uses arrays (not single values) to support 3+ relationships to the same person.
  const { pureLeftRels, pureRightRels, bridgingGroups } = useMemo(() => {
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

    const bridgingIds = new Set()
    leftByPatron.forEach((_, pid) => {
      if (rightByPatron.has(pid)) bridgingIds.add(pid)
    })

    return {
      pureLeftRels: leftRels.filter(r => !bridgingIds.has(r.toPatronId)),
      pureRightRels: rightRels.filter(r => !bridgingIds.has(r.toPatronId)),
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
    const hasLeft = pureLeftRels.length > 0
    const hasRight = pureRightRels.length > 0 || bridgingGroups.length > 0
    const patronX = hasLeft ? (EXT_CARD_WIDTH + CARD_GAP) : 0
    const leftX = 0
    const rightX = patronX + PATRON_WIDTH + CARD_GAP

    // Anchor Y: all external cards are vertically centered relative to the Handle.
    // For household, Handle is at HH_HANDLE_TOP from node top.
    // For standalone, Handle is at 36px from node top.
    const handleOffsetY = hasHousehold ? HH_HANDLE_TOP : 36

    // --- Compute card positions + source handle positions ---

    // Left external cards (personal, excluding bridging)
    const leftEdgeCount = pureLeftRels.length
    const leftTotalHeight = leftEdgeCount * ROW_HEIGHT
    const leftStartY = handleOffsetY - (leftTotalHeight / 2) + (ROW_HEIGHT / 2) - 36

    // Right external cards (professional/org, excluding bridging) + bridging nodes
    const allRightCount = pureRightRels.length + bridgingGroups.length
    const rightEdgeCount = pureRightRels.length + bridgingGroups.reduce((sum, g) => sum + g.allRels.length, 0)
    const rightTotalHeight = allRightCount * ROW_HEIGHT
    const rightStartY = handleOffsetY - (rightTotalHeight / 2) + (ROW_HEIGHT / 2) - 36

    // Source-node handle Y arrays: N handles per side, evenly distributed around handleOffsetY
    const HANDLE_SPACING = 16
    const rightHandleYs = Array.from({ length: rightEdgeCount }, (_, i) =>
      handleOffsetY + (i - (rightEdgeCount - 1) / 2) * HANDLE_SPACING
    )
    const leftHandleYs = Array.from({ length: leftEdgeCount }, (_, i) =>
      handleOffsetY + (i - (leftEdgeCount - 1) / 2) * HANDLE_SPACING
    )

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

    // Left external cards — edges go from ext (source/Right) to patron (target/Left)
    pureLeftRels.forEach((rel, i) => {
      const color = getColorForType(rel.type)
      const nodeId = `ext-${rel.id}`
      n.push({
        id: nodeId,
        type: 'externalCard',
        position: { x: leftX, y: leftStartY + i * ROW_HEIGHT },
        data: { rel, onNavigateToPatron, onEndRelationship, side: 'left' },
      })
      e.push({
        id: `edge-${rel.id}`,
        source: nodeId,
        sourceHandle: 'right',
        target: 'source',
        targetHandle: `left-${leftEdgeIdx++}`,
        type: 'labeled',
        style: { stroke: color, strokeWidth: 1.5 },
        data: { label: getConnectorLabel(rel), color, side: 'left' },
      })
    })

    // Right external cards (professional/org, excluding bridging)
    pureRightRels.forEach((rel, i) => {
      const color = getColorForType(rel.type)
      const nodeId = `ext-${rel.id}`
      n.push({
        id: nodeId,
        type: 'externalCard',
        position: { x: rightX, y: rightStartY + i * ROW_HEIGHT },
        data: { rel, onNavigateToPatron, onEndRelationship, side: 'right' },
      })
      e.push({
        id: `edge-${rel.id}`,
        source: 'source',
        sourceHandle: `right-${rightEdgeIdx++}`,
        target: nodeId,
        targetHandle: 'left',
        type: 'labeled',
        style: { stroke: color, strokeWidth: 1.5 },
        data: { label: getConnectorLabel(rel), color, side: 'right' },
      })
    })

    // Bridging nodes — consolidated cards with N edges each
    bridgingGroups.forEach((group, i) => {
      const idx = pureRightRels.length + i
      const nodeId = `bridging-${group.patronId}`

      n.push({
        id: nodeId,
        type: 'bridgingCard',
        position: { x: rightX, y: rightStartY + idx * ROW_HEIGHT },
        data: { rels: group.allRels, onNavigateToPatron, onEndRelationship },
      })

      const staggerTotal = group.allRels.length
      group.allRels.forEach((rel, relIdx) => {
        const color = getColorForType(rel.type)
        e.push({
          id: `edge-${rel.id}`,
          source: 'source',
          sourceHandle: `right-${rightEdgeIdx++}`,
          target: nodeId,
          targetHandle: `left-${relIdx}`,
          type: 'labeled',
          style: { stroke: color, strokeWidth: 1.5 },
          data: { label: getConnectorLabel(rel), color, side: 'right', staggerIndex: relIdx, staggerTotal },
        })
      })
    })

    return { nodes: n, edges: e }
  }, [hasAnyRelationships, hasHousehold, household, householdMembers, patronId, allRelationships, currentPatron, externalRels, pureLeftRels, pureRightRels, bridgingGroups, onNavigateToPatron, onEndRelationship, onAddRelationship, onEditHousehold, onRemoveFromHousehold])

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
                  pureLeftRels.length > 0 || bridgingGroups.some(g => g.allRels.some(r => r.type === 'personal')) ? { color: typeColors['personal'], label: 'Personal' } : null,
                  pureRightRels.length > 0 || bridgingGroups.some(g => g.allRels.some(r => r.type !== 'personal')) ? { color: typeColors['professional'], label: 'Professional' } : null,
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
