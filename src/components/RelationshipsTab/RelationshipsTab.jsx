import { useMemo } from 'react'
import { ReactFlow, Handle, Position, BaseEdge, getSmoothStepPath, EdgeLabelRenderer, Controls } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { getHouseholdForPatron, getHouseholdMembers, getPatronRelationships, getPatronById } from '../../data/patrons'
import { getInitials } from '../../utils/getInitials'
import './RelationshipsTab.css'

// ============================================
// CONSTANTS
// ============================================

const roleBadgeColors = {
  'Head': { color: '#0079ca', label: 'Spouse' },
  'Spouse': { color: '#0079ca', label: 'Spouse' },
  'Child': { color: '#0079ca', label: 'Child' },
  'Daughter': { color: '#0079ca', label: 'Child' },
  'Son': { color: '#0079ca', label: 'Child' },
}

const connectionBadgeColors = {
  'Employee': { color: '#0079ca' },
  'Board Member': { color: '#0079ca' },
  'Financial Advisor': { color: '#0079ca' },
  'Volunteer': { color: '#0079ca' },
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
  'Friend': { color: '#d946a8' },
  'Mentor': { color: '#d946a8' },
  'Godparent': { color: '#d946a8' },
  'Neighbor': { color: '#d946a8' },
  'Guardian': { color: '#d946a8' },
}

const connectorLabels = {
  'organization': 'Employment',
  'professional': 'Advisory',
  'board': 'Board',
  'volunteer': 'Volunteer',
  'personal': 'Personal',
}

const orgTitleBadgeColors = {
  'CTO': { color: '#6f41d7' },
  'Client': { color: '#0079ca' },
  'default': { color: '#6f41d7' },
}

// ============================================
// LOOKUP HELPERS (pure, outside component)
// ============================================

const getRoleBadge = (role) => roleBadgeColors[role] || { color: '#0079ca', label: role }
const getConnectionBadge = (role) => connectionBadgeColors[role] || { color: '#0079ca' }
const getOrgTitleBadge = (title) => orgTitleBadgeColors[title] || orgTitleBadgeColors['default']

// ============================================
// SHARED RENDERERS (used by React Flow nodes + mobile fallback)
// ============================================

// Org/Professional/Personal card
const renderOrgCard = (rel, { onNavigateToPatron, onEndRelationship } = {}) => {
  const orgTitle = rel.type === 'personal'
    ? (rel.role || '')
    : (rel.externalContact?.title || rel.reciprocalRole || '')
  const orgName = rel.externalContact?.company || rel.displayName || ''
  const orgInitials = rel.externalContact?.initials || rel.initials || '??'
  const titleBadge = getOrgTitleBadge(orgTitle)

  return (
    <div
      className={`relationships-tab__org-card ${rel.linkedPatron ? 'relationships-tab__org-card--clickable' : ''}`}
      onClick={() => { if (rel.linkedPatron && onNavigateToPatron) onNavigateToPatron(rel.linkedPatron.id) }}
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
          onClick={(e) => { e.stopPropagation(); onEndRelationship(rel) }}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      )}
    </div>
  )
}

// Household wrapper (blue container with title, member rows, action buttons)
// Shared by HouseholdNode (inside React Flow) and mobile fallback (plain HTML).
const renderHouseholdContent = ({ household, householdMembers, patronId, allRelationships, onNavigateToPatron, onEndRelationship, onAddRelationship, onEditHousehold }) => {
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

  return (
    <div className="relationships-tab__household-wrapper">
      <h4 className="relationships-tab__household-name">
        {household.name}
      </h4>

      <div className="relationships-tab__household-card">
        {householdMembers.map((member) => {
          const isCurrentPatron = member.patronId === patronId
          const isHead = member.role === 'Head'
          const badge = getRoleBadge(member.role)

          return (
            <div
              key={member.id}
              className={`relationships-tab__member${!isCurrentPatron ? ' relationships-tab__member--clickable nodrag nopan nowheel' : ''}`}
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
                  className="relationships-tab__remove-btn nodrag nopan nowheel"
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
        <button className="relationships-tab__action-btn nodrag nopan nowheel" onClick={() => onAddRelationship && onAddRelationship()}>
          <i className="fa-solid fa-plus"></i>
          Add relationship
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
// top-padding(40) + title(~20) + gap(24) + card-border(1) + half-row(36) = 121px
const HH_HANDLE_TOP = 121

// Household node — root wraps the full blue wrapper directly (no absolute positioning).
// React Flow uses the real rendered size for fitView. Handles are positioned at the
// patron's row level. Horizontal padding removed via CSS so card edge = wrapper edge.
function HouseholdNode({ data }) {
  return (
    <div
      className="relationships-tab__hh-node-root nopan nodrag nowheel"
      style={{ position: 'relative', pointerEvents: 'all' }}
    >
      {renderHouseholdContent(data)}
      <Handle id="right" type="source" position={Position.Right} isConnectable={false}
        style={{ top: HH_HANDLE_TOP }} />
      <Handle id="left" type="target" position={Position.Left} isConnectable={false}
        style={{ top: HH_HANDLE_TOP }} />
    </div>
  )
}

// Standalone patron node (no household) — patron card + add button
function StandalonePatronNode({ data }) {
  const { patron, onAddRelationship } = data
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
        <div className="relationships-tab__actions">
          <button className="relationships-tab__action-btn nodrag nopan nowheel" onClick={() => onAddRelationship && onAddRelationship()}>
            <i className="fa-solid fa-plus"></i>
            Add relationship
          </button>
        </div>
      </div>
      <Handle id="right" type="source" position={Position.Right} isConnectable={false}
        style={{ top: 36 }} />
      <Handle id="left" type="target" position={Position.Left} isConnectable={false}
        style={{ top: 36 }} />
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

// Labeled edge — smoothStep with sharp 90° corners and colored stroke + badge label.
// Labels sit on the horizontal branch nearest the external card (not at the midpoint).
function LabeledEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data, style }) {
  // When source and target are at (nearly) the same Y, draw a straight line
  // instead of a smoothStep — avoids visible 1px jogs on single connections.
  const isFlat = Math.abs(sourceY - targetY) < 2
  let edgePath
  if (isFlat) {
    edgePath = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`
  } else {
    [edgePath] = getSmoothStepPath({
      sourceX, sourceY, sourcePosition,
      targetX, targetY, targetPosition,
      borderRadius: 0,
    })
  }

  const midX = (sourceX + targetX) / 2
  let customLabelX, customLabelY
  if (isFlat) {
    // 1:1 straight line: center label at true midpoint
    customLabelX = midX
    customLabelY = (sourceY + targetY) / 2
  } else if (data.side === 'left') {
    // Forked left-side: center label on horizontal branch between trunk and external card
    customLabelX = sourceX + (midX - sourceX) * 0.5
    customLabelY = sourceY
  } else {
    // Forked right-side: center label on horizontal branch between trunk and external card
    customLabelX = midX + (targetX - midX) * 0.5
    customLabelY = targetY
  }

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={style} />
      <EdgeLabelRenderer>
        <div
          className="relationships-tab__edge-label-wrapper"
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${customLabelX}px,${customLabelY}px)`,
            pointerEvents: 'all',
          }}
        >
          <span
            className="relationships-tab__connector-label"
            style={{ color: data.color, borderColor: data.color }}
          >
            {data.label}
          </span>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}

// MUST be outside the component to prevent re-renders
const nodeTypes = { household: HouseholdNode, standalone: StandalonePatronNode, externalCard: ExternalCardNode }
const edgeTypes = { labeled: LabeledEdge }

// Layout constants
const ROW_HEIGHT = 100       // vertical spacing between external card nodes
const EXT_CARD_WIDTH = 260   // approximate external card width
const CARD_GAP = 250         // horizontal gap between patron node and external cards
const PATRON_WIDTH = 343     // household card / standalone card width

// ============================================
// MAIN COMPONENT
// ============================================

function RelationshipsTab({ patronId, onNavigateToPatron, onAddRelationship, onEndRelationship, onEditHousehold }) {
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

  const externalRels = useMemo(() => {
    return allRelationships.filter(r => r.type !== 'household')
  }, [allRelationships])

  // Split external rels: personal on the left, professional/org on the right
  const leftRels = useMemo(() => externalRels.filter(r => r.type === 'personal'), [externalRels])
  const rightRels = useMemo(() => externalRels.filter(r => r.type !== 'personal'), [externalRels])

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
    const hasLeft = leftRels.length > 0
    const hasRight = rightRels.length > 0
    const patronX = hasLeft ? (EXT_CARD_WIDTH + CARD_GAP) : 0
    const leftX = 0
    const rightX = patronX + PATRON_WIDTH + CARD_GAP

    // Anchor Y: all external cards are vertically centered relative to the Handle.
    // For household, Handle is at HH_HANDLE_TOP from node top.
    // For standalone, Handle is at 36px from node top.
    const handleOffsetY = hasHousehold ? HH_HANDLE_TOP : 36

    // Source node — household wrapper or standalone patron card
    if (hasHousehold) {
      n.push({
        id: 'source',
        type: 'household',
        position: { x: patronX, y: 0 },
        data: { household, householdMembers, patronId, allRelationships, onNavigateToPatron, onEndRelationship, onAddRelationship, onEditHousehold },
      })
    } else {
      n.push({
        id: 'source',
        type: 'standalone',
        position: { x: patronX, y: 0 },
        data: { patron: currentPatron, onAddRelationship },
      })
    }

    // Left external cards (personal) — edges go from ext (source/Right) to patron (target/Left)
    const leftTotalHeight = leftRels.length * ROW_HEIGHT
    const leftStartY = handleOffsetY - (leftTotalHeight / 2) + (ROW_HEIGHT / 2) - 36 // -36 centers the 72px card on the row
    leftRels.forEach((rel, i) => {
      const color = getConnectionBadge(rel.role).color
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
        targetHandle: 'left',
        type: 'labeled',
        style: { stroke: color, strokeWidth: 1.5 },
        data: { label: connectorLabels[rel.type] || rel.role, color, side: 'left' },
      })
    })

    // Right external cards (professional/org) — edges go from patron (source/Right) to ext (target/Left)
    const rightTotalHeight = rightRels.length * ROW_HEIGHT
    const rightStartY = handleOffsetY - (rightTotalHeight / 2) + (ROW_HEIGHT / 2) - 36
    rightRels.forEach((rel, i) => {
      const color = getConnectionBadge(rel.role).color
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
        sourceHandle: 'right',
        target: nodeId,
        targetHandle: 'left',
        type: 'labeled',
        style: { stroke: color, strokeWidth: 1.5 },
        data: { label: connectorLabels[rel.type] || rel.role, color, side: 'right' },
      })
    })

    return { nodes: n, edges: e }
  }, [hasAnyRelationships, hasHousehold, household, householdMembers, patronId, allRelationships, currentPatron, externalRels, leftRels, rightRels, onNavigateToPatron, onEndRelationship, onAddRelationship, onEditHousehold])

  // ---- Empty state ----
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

  // ---- Mobile fallback (simple card list, no connectors) ----
  const renderMobileCards = () => {
    if (!hasExternal) return null
    return (
      <div className="relationships-tab__mobile-cards">
        {externalRels.map((rel) => {
          const color = getConnectionBadge(rel.role).color
          const label = connectorLabels[rel.type] || rel.role
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
      </div>
    )
  }

  // ---- Main render ----
  return (
    <div className="relationships-tab">
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
          </ReactFlow>
        </div>

        {/* Mobile fallback — plain HTML, no canvas */}
        <div className="relationships-tab__mobile-fallback">
          {hasHousehold && renderHouseholdContent({
            household, householdMembers, patronId, allRelationships,
            onNavigateToPatron, onEndRelationship, onAddRelationship, onEditHousehold,
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
              <div className="relationships-tab__actions">
                <button className="relationships-tab__action-btn" onClick={() => onAddRelationship && onAddRelationship()}>
                  <i className="fa-solid fa-plus"></i>
                  Add relationship
                </button>
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
