import { useState } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers'
import { CSS } from '@dnd-kit/utilities'
import { getInitials } from '../../utils/getInitials'
import './Beneficiaries.css'

// Role icons mapping (membership entitlement roles)
const roleIcons = {
  'Primary Member': 'fa-star',
  'Additional Adult': 'fa-user',
  'Dependent': 'fa-child',
  // Legacy fallbacks
  'Primary': 'fa-star',
  'default': 'fa-user'
}

// Map legacy relationship-based role labels to membership entitlement roles
const legacyRoleMap = {
  'Spouse': 'Additional Adult',
  'Partner': 'Additional Adult',
  'Child': 'Dependent',
  'Daughter': 'Dependent',
  'Son': 'Dependent',
  'Guest': 'Additional Adult',
  'Parent': 'Additional Adult',
  'Sibling': 'Additional Adult'
}

// Sortable beneficiary item component
function SortableBeneficiaryItem({ person, isPrimary, isDraggable, onNavigate, onRemove, getRoleIcon }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: person.id,
    disabled: !isDraggable
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
    position: isDragging ? 'relative' : undefined
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`beneficiaries__item ${person.patronId ? 'beneficiaries__item--clickable' : ''} ${isDragging ? 'beneficiaries__item--dragging' : ''}`}
      onClick={() => onNavigate(person)}
      {...attributes}
    >
      {/* Drag handle (only for non-primary, draggable items) */}
      {isDraggable ? (
        <button
          ref={setActivatorNodeRef}
          className="beneficiaries__drag-handle"
          {...listeners}
          onClick={e => e.stopPropagation()}
          tabIndex={0}
          aria-label="Drag to reorder"
        >
          <i className="fa-solid fa-grip-vertical"></i>
        </button>
      ) : (
        <div className="beneficiaries__drag-handle-spacer" />
      )}

      <div className="beneficiaries__avatar">
        {person.photo ? (
          <img src={person.photo} alt={person.name} />
        ) : (
          <span className="beneficiaries__initials">{getInitials(person.name)}</span>
        )}
      </div>
      <div className="beneficiaries__info">
        <span className="beneficiaries__name">
          {person.name}
          {person.isCurrentPatron && (
            <span className="beneficiaries__viewing-badge">Viewing</span>
          )}
        </span>
        <span className="beneficiaries__role">
          <i className={`fa-solid ${getRoleIcon(person.roleLabel)}`}></i>
          {person.roleLabel}
        </span>
      </div>
      
      {/* Actions */}
      <div className="beneficiaries__actions">
        {/* Navigate chevron for linked patrons */}
        {person.patronId && !person.isCurrentPatron && (
          <span className="beneficiaries__chevron">
            <i className="fa-solid fa-chevron-right"></i>
          </span>
        )}
        
        {/* Remove button (only for primary viewing non-primary beneficiaries) */}
        {isPrimary && !person.isPrimaryRole && onRemove && (
          <button 
            className="beneficiaries__remove-btn"
            onClick={(e) => { e.stopPropagation(); onRemove(person) }}
            title="Remove beneficiary"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        )}
      </div>
    </li>
  )
}

function Beneficiaries({ 
  beneficiaries,
  currentPatronId,
  isPrimary = true,
  slotInfo,
  onNavigateToPatron,
  onAddBeneficiary,
  onRemoveBeneficiary,
  onReorderBeneficiaries
}) {
  if (!beneficiaries || beneficiaries.length === 0) return null
  
  const getRoleIcon = (role) => roleIcons[role] || roleIcons.default
  
  // Normalize beneficiary data (support both new and legacy formats)
  const normalizedBeneficiaries = beneficiaries.map(b => {
    // New format: has patron object
    if (b.patron) {
      return {
        id: b.id,
        patronId: b.patronId,
        name: b.patron.name || `${b.patron.firstName} ${b.patron.lastName}`,
        email: b.patron.email,
        photo: b.patron.photo,
        role: b.role,
        roleLabel: legacyRoleMap[b.roleLabel] || b.roleLabel,
        isCurrentPatron: b.patronId === currentPatronId,
        isPrimaryRole: b.role === 'primary'
      }
    }
    // Legacy format: direct properties -- map relationship labels to membership roles
    const mappedRoleLabel = legacyRoleMap[b.role] || b.role
    return {
      id: b.id,
      patronId: null,
      name: b.name,
      email: null,
      photo: b.avatar,
      role: b.role?.toLowerCase() === 'primary' ? 'primary' : 'additional_adult',
      roleLabel: mappedRoleLabel,
      isCurrentPatron: false,
      isPrimaryRole: b.role === 'Primary'
    }
  })

  // Separate primary (pinned) from sortable beneficiaries
  const primaryBeneficiary = normalizedBeneficiaries.find(b => b.isPrimaryRole)
  const sortableBeneficiaries = normalizedBeneficiaries.filter(b => !b.isPrimaryRole)

  const handleBeneficiaryClick = (beneficiary) => {
    if (beneficiary.patronId && onNavigateToPatron) {
      onNavigateToPatron(beneficiary.patronId)
    }
  }

  // DnD sensors with activation constraints to distinguish drag from click
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = sortableBeneficiaries.findIndex(b => b.id === active.id)
    const newIndex = sortableBeneficiaries.findIndex(b => b.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const reordered = arrayMove(sortableBeneficiaries, oldIndex, newIndex)
    
    // Build full ordered patron IDs: primary first, then reordered
    const orderedPatronIds = [
      ...(primaryBeneficiary ? [primaryBeneficiary.patronId] : []),
      ...reordered.map(b => b.patronId)
    ]

    if (onReorderBeneficiaries) {
      onReorderBeneficiaries(orderedPatronIds)
    }
  }

  // Slot info display
  const slotDisplay = slotInfo 
    ? `${slotInfo.used}/${slotInfo.limit === 'unlimited' ? '∞' : slotInfo.limit} slots`
    : `${beneficiaries.length} people`
  
  const sortableIds = sortableBeneficiaries.map(b => b.id)

  return (
    <div className="beneficiaries wrapper-card">
      <div className="beneficiaries__header">
        <h4 className="beneficiaries__title">Beneficiaries</h4>
        <span className="beneficiaries__count">{slotDisplay}</span>
      </div>
      
      <ul className="beneficiaries__list">
        {/* Primary member: always first, not draggable */}
        {primaryBeneficiary && (
          <SortableBeneficiaryItem
            key={primaryBeneficiary.id}
            person={primaryBeneficiary}
            isPrimary={isPrimary}
            isDraggable={false}
            onNavigate={handleBeneficiaryClick}
            onRemove={onRemoveBeneficiary}
            getRoleIcon={getRoleIcon}
          />
        )}

        {/* Sortable non-primary beneficiaries */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        >
          <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
            {sortableBeneficiaries.map((person) => (
              <SortableBeneficiaryItem
                key={person.id}
                person={person}
                isPrimary={isPrimary}
                isDraggable={isPrimary && sortableBeneficiaries.length > 1}
                onNavigate={handleBeneficiaryClick}
                onRemove={onRemoveBeneficiary}
                getRoleIcon={getRoleIcon}
              />
            ))}
          </SortableContext>
        </DndContext>
      </ul>
      
      {/* Add Beneficiary button (only for primary) */}
      {isPrimary && (
        <button 
          className="beneficiaries__add"
          onClick={onAddBeneficiary}
          disabled={slotInfo && !slotInfo.canAdd}
        >
          <i className="fa-solid fa-user-plus"></i>
          Add Beneficiary
          {slotInfo && !slotInfo.canAdd && (
            <span className="beneficiaries__add-limit"> (limit reached)</span>
          )}
        </button>
      )}
    </div>
  )
}

export default Beneficiaries
