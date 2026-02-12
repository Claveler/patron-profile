import { useState, useEffect, useRef } from 'react'
import { searchPatrons, addPatronRelationship, patronRelationships, getPatronById, createHousehold, getHouseholdConflict, hasActiveRelationship, getActiveRelationships, transferPatronToHousehold, getHouseholdForPatron, getHouseholdMembers, getDisplayRole, getReciprocalRole, ROLE_TO_CATEGORY } from '../../data/patrons'
import { getInitials } from '../../utils/getInitials'
import './AddRelationshipModal.css'

// Relationship type categories
const relationshipTypes = [
  { id: 'household', label: 'Household', icon: 'fa-solid fa-house-chimney', description: 'Spouse, child, parent living together' },
  { id: 'personal', label: 'Personal', icon: 'fa-solid fa-user-group', description: 'Family, friends, mentors and other personal connections' },
  { id: 'professional', label: 'Professional', icon: 'fa-solid fa-briefcase', description: 'Financial advisor, attorney, accountant and other professional connections' },
  { id: 'organization', label: 'Organization', icon: 'fa-solid fa-building', description: 'Employee, board member, volunteer and other organizational affiliations' },
]

// Role label options per relationship type (familiar gendered labels for the UI)
const roleOptionsByType = {
  household: [
    { id: 'Spouse', label: 'Spouse' },
    { id: 'Wife', label: 'Wife' },
    { id: 'Husband', label: 'Husband' },
    { id: 'Partner', label: 'Partner' },
    { id: 'Child', label: 'Child' },
    { id: 'Son', label: 'Son' },
    { id: 'Daughter', label: 'Daughter' },
    { id: 'Parent', label: 'Parent' },
    { id: 'Father', label: 'Father' },
    { id: 'Mother', label: 'Mother' },
    { id: 'Sibling', label: 'Sibling' },
    { id: 'Brother', label: 'Brother' },
    { id: 'Sister', label: 'Sister' },
    { id: 'Grandparent', label: 'Grandparent' },
    { id: 'Grandchild', label: 'Grandchild' },
    { id: 'Guardian', label: 'Guardian' },
    { id: 'Ward', label: 'Ward' },
    { id: 'other', label: 'Other' },
  ],
  personal: [
    { id: 'Sibling', label: 'Sibling' },
    { id: 'Brother', label: 'Brother' },
    { id: 'Sister', label: 'Sister' },
    { id: 'Parent', label: 'Parent' },
    { id: 'Father', label: 'Father' },
    { id: 'Mother', label: 'Mother' },
    { id: 'Child', label: 'Child' },
    { id: 'Son', label: 'Son' },
    { id: 'Daughter', label: 'Daughter' },
    { id: 'Grandparent', label: 'Grandparent' },
    { id: 'Grandchild', label: 'Grandchild' },
    { id: 'Uncle', label: 'Uncle' },
    { id: 'Aunt', label: 'Aunt' },
    { id: 'Nephew', label: 'Nephew' },
    { id: 'Niece', label: 'Niece' },
    { id: 'Cousin', label: 'Cousin' },
    { id: 'Friend', label: 'Friend' },
    { id: 'Mentor', label: 'Mentor' },
    { id: 'Mentee', label: 'Mentee' },
    { id: 'Ex-Spouse', label: 'Ex-Spouse' },
    { id: 'Ex-Wife', label: 'Ex-Wife' },
    { id: 'Ex-Husband', label: 'Ex-Husband' },
    { id: 'Godparent', label: 'Godparent' },
    { id: 'Godchild', label: 'Godchild' },
    { id: 'Neighbor', label: 'Neighbor' },
    { id: 'Guardian', label: 'Guardian' },
    { id: 'Ward', label: 'Ward' },
    { id: 'other', label: 'Other' },
  ],
  professional: [
    { id: 'Financial Advisor', label: 'Financial Advisor' },
    { id: 'Attorney', label: 'Attorney' },
    { id: 'Accountant', label: 'Accountant' },
    { id: 'Client', label: 'Client' },
    { id: 'Colleague', label: 'Colleague' },
    { id: 'other', label: 'Other' },
  ],
  organization: [
    { id: 'Employee', label: 'Employee' },
    { id: 'Board Member', label: 'Board Member' },
    { id: 'Volunteer', label: 'Volunteer' },
    { id: 'Donor', label: 'Donor' },
    { id: 'other', label: 'Other' },
  ],
}

function AddRelationshipModal({
  isOpen,
  onClose,
  patronId,
  patronName,
  preselectedType,
  excludeTypes,
  onSuccess,
  onBeforeMutate,
}) {
  const [step, setStep] = useState('type') // 'type' | 'contact' | 'roles' | 'household-form'
  const [relType, setRelType] = useState('')
  const [contactMode, setContactMode] = useState('search') // 'search' | 'external'
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedPatron, setSelectedPatron] = useState(null)

  // External contact fields
  const [externalName, setExternalName] = useState('')
  const [externalCompany, setExternalCompany] = useState('')
  const [externalTitle, setExternalTitle] = useState('')

  // Role-based fields (UI labels mapped to categories on submit)
  const [selectedRole, setSelectedRole] = useState('')
  const [customRole, setCustomRole] = useState('')
  const [reciprocalRole, setReciprocalRole] = useState('')
  const [customReciprocalRole, setCustomReciprocalRole] = useState('')

  // Household creation fields
  const [householdName, setHouseholdName] = useState('')
  const [selectedHead, setSelectedHead] = useState('') // kept for conflict head picker

  // Household single-page form state
  const [createHouseholdToggle, setCreateHouseholdToggle] = useState(true)
  const [isHeadOfHousehold, setIsHeadOfHousehold] = useState(true)
  const [patronSearchOpen, setPatronSearchOpen] = useState(false)

  // Household conflict state
  const [householdConflict, setHouseholdConflict] = useState(null)
  const [conflictApproved, setConflictApproved] = useState(false)
  const [conflictNewHead, setConflictNewHead] = useState(null)
  const [showHeadPicker, setShowHeadPicker] = useState(false)

  // Notes (optional, shared across all relationship types)
  const [notes, setNotes] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const searchInputRef = useRef(null)
  const hhSearchInputRef = useRef(null)

  // Get current patron data for household checks
  const currentPatronData = getPatronById(patronId)

  // Build a map of same-household members (patronId → role) excluding the current patron.
  const sameHouseholdMembers = (() => {
    const map = new Map()
    const household = getHouseholdForPatron(patronId)
    if (!household) return map
    const members = getHouseholdMembers(household.id)
    members.forEach(m => {
      if (m.patronId !== patronId) {
        map.set(m.patronId, m.role)
      }
    })
    return map
  })()

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      const initialType = preselectedType || ''
      setRelType(initialType)
      if (initialType === 'household') {
        setStep('household-form')
      } else {
        setStep(initialType ? 'contact' : 'type')
      }
      setContactMode('search')
      setSearchQuery('')
      setSearchResults([])
      setSelectedPatron(null)
      setExternalName('')
      setExternalCompany('')
      setExternalTitle('')
      setSelectedRole('')
      setCustomRole('')
      setReciprocalRole('')
      setCustomReciprocalRole('')
      setHouseholdName('')
      setSelectedHead('')
      setCreateHouseholdToggle(true)
      setIsHeadOfHousehold(true)
      setPatronSearchOpen(false)
      setHouseholdConflict(null)
      setConflictApproved(false)
      setConflictNewHead(null)
      setShowHeadPicker(false)
      setError('')
      setIsLoading(false)
    }
  }, [isOpen, preselectedType])

  // Search patrons when query changes
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const results = searchPatrons(searchQuery, [patronId])
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }, [searchQuery, patronId])

  // Auto-suggest reciprocal role when selectedRole changes
  useEffect(() => {
    if (selectedRole && selectedRole !== 'other') {
      // For household-form, reciprocal gender is the selected patron's gender.
      // For non-household roles step, reciprocal gender is the current patron's gender.
      const reciprocalGender = step === 'household-form'
        ? (selectedPatron?.gender || getPatronById(selectedPatron?.id)?.gender || null)
        : (currentPatronData?.gender || null)
      const suggested = getReciprocalRole(selectedRole, reciprocalGender)
      const currentRoles = roleOptionsByType[relType] || []
      const matchingOption = currentRoles.find(r => r.id === suggested)
      setReciprocalRole(matchingOption ? matchingOption.id : 'other')
      if (!matchingOption) {
        setCustomReciprocalRole(suggested)
      }
    } else if (selectedRole === 'other') {
      setReciprocalRole('other')
      setCustomReciprocalRole('')
    }
  }, [selectedRole, relType])

  // Focus search input when entering contact step in search mode
  useEffect(() => {
    if (step === 'contact' && contactMode === 'search') {
      setTimeout(() => searchInputRef.current?.focus(), 100)
    }
  }, [step, contactMode])

  // Focus search input in household-form when search opens
  useEffect(() => {
    if (step === 'household-form' && patronSearchOpen && !selectedPatron) {
      setTimeout(() => hhSearchInputRef.current?.focus(), 100)
    }
  }, [step, patronSearchOpen, selectedPatron])

  const handleSelectType = (typeId) => {
    setRelType(typeId)
    setStep(typeId === 'household' ? 'household-form' : 'contact')
    setError('')
  }

  // Used by non-household types (contact step)
  const handleSelectPatron = (patron) => {
    setSelectedPatron(patron)
    setError('')
    prefillRoleFromExistingPersonal(patron)
    setStep('roles')
  }

  // Used by household-form (inline patron selection)
  const handleHouseholdPatronSelect = (patron) => {
    setSelectedPatron(patron)
    setPatronSearchOpen(false)
    setSearchQuery('')
    setSearchResults([])
    setError('')

    // Check for household conflict
    const conflict = getHouseholdConflict(patron.id, currentPatronData?.householdId)
    if (conflict) {
      setHouseholdConflict(conflict)
      return
    }

    // Pre-fill role from existing personal relationship
    prefillRoleFromExistingPersonal(patron)

    // Pre-fill household name if neither patron has a household
    const currentPatron = getPatronById(patronId)
    const otherPatron = getPatronById(patron.id)
    if (!currentPatron?.householdId && !otherPatron?.householdId) {
      const lastName = currentPatronData?.lastName || patronName.split(' ').pop()
      setHouseholdName(`${lastName} Family`)
    }
  }

  // Clear selected patron in household-form (to pick a different one)
  const clearHouseholdPatron = () => {
    setSelectedPatron(null)
    setSelectedRole('')
    setCustomRole('')
    setReciprocalRole('')
    setCustomReciprocalRole('')
    setHouseholdName('')
    setHouseholdConflict(null)
    setConflictApproved(false)
    setConflictNewHead(null)
    setShowHeadPicker(false)
    setPatronSearchOpen(true)
    setError('')
  }

  // Pre-fill role labels from existing personal relationship (e.g., when upgrading to household)
  const prefillRoleFromExistingPersonal = (patron) => {
    if (relType !== 'household' || !patron) return
    const existingRels = getActiveRelationships(patronId, patron.id)
    const personalMatch = existingRels.find(r => r.type === 'personal')
    if (personalMatch) {
      const currentGender = currentPatronData?.gender || null
      const otherGender = patron.gender || getPatronById(patron.id)?.gender || null
      const currentLabel = getDisplayRole(personalMatch.category, patronId, personalMatch, currentGender)
      const otherLabel = getDisplayRole(personalMatch.category, patron.id, personalMatch, otherGender)

      // Match to available role options for household type
      const hhRoles = roleOptionsByType.household || []
      const currentMatch = hhRoles.find(r => r.id === currentLabel)
      setSelectedRole(currentMatch ? currentMatch.id : 'other')
      if (!currentMatch) setCustomRole(currentLabel)

      const otherMatch = hhRoles.find(r => r.id === otherLabel)
      setReciprocalRole(otherMatch ? otherMatch.id : 'other')
      if (!otherMatch) setCustomReciprocalRole(otherLabel)
    }
  }

  const handleExternalContinue = () => {
    if (!externalName.trim()) {
      setError('Name is required')
      return
    }
    setStep('roles')
    setError('')
  }

  const handleBackToType = () => {
    setStep('type')
    setRelType('')
    setSelectedPatron(null)
    setSearchQuery('')
    setSearchResults([])
    setSelectedRole('')
    setCustomRole('')
    setReciprocalRole('')
    setCustomReciprocalRole('')
    setNotes('')
    setHouseholdName('')
    setCreateHouseholdToggle(true)
    setIsHeadOfHousehold(true)
    setPatronSearchOpen(false)
    setHouseholdConflict(null)
    setConflictApproved(false)
    setConflictNewHead(null)
    setShowHeadPicker(false)
    setError('')
  }

  const handleBackToContact = () => {
    setStep('contact')
    setSelectedPatron(null)
    setSelectedRole('')
    setCustomRole('')
    setReciprocalRole('')
    setCustomReciprocalRole('')
    setNotes('')
    setError('')
  }

  // Check whether we need a household creation step
  const needsHouseholdCreation = () => {
    if (relType !== 'household' || !selectedPatron) return false
    const currentPatron = getPatronById(patronId)
    const otherPatron = getPatronById(selectedPatron.id)
    return !currentPatron?.householdId && !otherPatron?.householdId
  }

  // Map a role label to { p1, p2, category } using ROLE_TO_CATEGORY.
  // isHouseholdForm: true means selectedRole describes the CURRENT patron;
  //                  false means selectedRole describes the OTHER patron.
  const resolvePatronOrderFromRole = (role, isHouseholdForm) => {
    const otherPatronId = selectedPatron?.id || null
    if (!role || role === 'other') return { p1: patronId, p2: otherPatronId, category: 'custom' }

    const mapping = ROLE_TO_CATEGORY[role]
    if (!mapping) return { p1: patronId, p2: otherPatronId, category: 'custom' }

    const { category, side } = mapping
    if (!side) {
      // Symmetric: order doesn't matter
      return { p1: patronId, p2: otherPatronId, category }
    }

    if (isHouseholdForm) {
      // selectedRole describes the CURRENT patron. side 1 = patron1.
      return side === 1
        ? { p1: patronId, p2: otherPatronId, category }
        : { p1: otherPatronId, p2: patronId, category }
    } else {
      // selectedRole describes the OTHER patron. side 1 = patron1.
      return side === 1
        ? { p1: otherPatronId, p2: patronId, category }
        : { p1: patronId, p2: otherPatronId, category }
    }
  }

  // Get display labels directly from the role selections
  const getDerivedLabels = () => {
    const currentLabel = selectedRole === 'other' ? customRole.trim() : selectedRole
    const otherLabel = reciprocalRole === 'other' ? customReciprocalRole.trim() : reciprocalRole
    return { currentLabel, otherLabel }
  }

  // Submit handler for non-household types (roles step)
  const handleSubmit = () => {
    if (!selectedRole) {
      setError('Please select a relationship type')
      return
    }
    if (selectedRole === 'other' && !customRole.trim()) {
      setError('Please enter the role')
      return
    }

    const resolvedRole = selectedRole === 'other' ? customRole.trim() : selectedRole
    const { category } = resolvePatronOrderFromRole(resolvedRole, false)

    // Duplicate relationship prevention
    if (selectedPatron && hasActiveRelationship(patronId, selectedPatron.id, relType, category)) {
      setError(`An active ${resolvedRole} relationship already exists with ${selectedPatron.name}.`)
      return
    }

    submitRelationship()
  }

  const submitRelationship = () => {
    onBeforeMutate?.()
    setIsLoading(true)
    setError('')

    // Non-household: selectedRole describes the OTHER patron
    const resolvedRole = selectedRole === 'other' ? customRole.trim() : selectedRole
    const { p1, p2, category } = resolvePatronOrderFromRole(resolvedRole, false)
    const customLabels = selectedRole === 'other'
      ? { patron1: customRole.trim(), patron2: customReciprocalRole.trim() }
      : null

    try {
      if (selectedPatron) {
        // If user approved a household transfer, move the patron first
        if (conflictApproved && relType === 'household') {
          const currentPatron = getPatronById(patronId)
          const targetHouseholdId = currentPatron?.householdId
          if (targetHouseholdId) {
            const { otherLabel } = getDerivedLabels()
            transferPatronToHousehold(selectedPatron.id, targetHouseholdId, otherLabel, conflictNewHead)
          }
        }

        // Patron-to-patron relationship
        addPatronRelationship(p1, p2, relType, category, customLabels, notes || null)
      } else {
        // External contact — push directly to the array
        const nameStr = externalName.trim()
        const companyStr = externalCompany.trim() || nameStr
        const words = nameStr.split(' ')
        const initials = words.length >= 2
          ? `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
          : nameStr.slice(0, 2).toUpperCase()

        const newRel = {
          id: `rel-${Date.now()}`,
          patron1Id: patronId,
          patron2Id: null,
          type: relType,
          category,
          customLabels,
          isPrimary: false,
          startDate: new Date().toISOString().split('T')[0],
          endDate: null,
          notes: notes.trim() || externalTitle.trim() || null,
          externalContact: {
            name: nameStr,
            company: companyStr,
            initials,
            ...(externalTitle.trim() ? { title: externalTitle.trim() } : {}),
          },
        }
        patronRelationships.push(newRel)
      }

      setIsLoading(false)
      onSuccess && onSuccess()
      onClose()
    } catch (err) {
      setIsLoading(false)
      setError('Failed to create relationship')
    }
  }

  const handleConflictTransfer = () => {
    if (householdConflict?.isHead && householdConflict?.memberCount > 2) {
      setShowHeadPicker(true)
      setError('')
      return
    }
    setConflictApproved(true)
    prefillRoleFromExistingPersonal(selectedPatron)
    if (step !== 'household-form') {
      setStep('roles')
    }
    setError('')
  }

  const handleHeadPickerContinue = () => {
    setConflictApproved(true)
    setShowHeadPicker(false)
    prefillRoleFromExistingPersonal(selectedPatron)
    if (step !== 'household-form') {
      setStep('roles')
    }
    setError('')
  }

  const handleConflictCancel = () => {
    setHouseholdConflict(null)
    setConflictApproved(false)
    setConflictNewHead(null)
    setShowHeadPicker(false)
    setSelectedPatron(null)
    if (step === 'household-form') {
      setPatronSearchOpen(true)
    } else {
      setStep('contact')
    }
    setError('')
  }

  // Submit handler for household single-page form
  const handleHouseholdFormSubmit = () => {
    if (!selectedPatron) {
      setError('Please select a related patron')
      return
    }
    if (householdConflict && !conflictApproved) {
      setError('Please resolve the household conflict first')
      return
    }
    if (!selectedRole) {
      setError('Please select a relationship role')
      return
    }
    if (selectedRole === 'other' && !customRole.trim()) {
      setError('Please enter the role')
      return
    }

    // Household form: selectedRole describes the CURRENT patron
    const resolvedRole = selectedRole === 'other' ? customRole.trim() : selectedRole
    const { p1, p2, category } = resolvePatronOrderFromRole(resolvedRole, true)

    // Same-household member guard
    const existingHouseholdRels = getActiveRelationships(patronId, selectedPatron.id).filter(r => r.type === 'household')
    if (existingHouseholdRels.length > 0) {
      setError(`${selectedPatron.name} is already a household member. To change their role, use Edit Household.`)
      return
    }

    // Duplicate relationship prevention (same type + same category)
    if (hasActiveRelationship(patronId, selectedPatron.id, 'household', category)) {
      setError(`An active ${resolvedRole} relationship already exists with ${selectedPatron.name}.`)
      return
    }

    // Validate household name if creating a household
    if (needsHouseholdCreation() && createHouseholdToggle && !householdName.trim()) {
      setError('Please enter a household name')
      return
    }

    onBeforeMutate?.()
    setIsLoading(true)
    setError('')

    const customLabels = selectedRole === 'other'
      ? { patron1: customRole.trim(), patron2: customReciprocalRole.trim() }
      : null

    try {
      // Handle conflict transfer if approved
      if (conflictApproved) {
        const currentPatron = getPatronById(patronId)
        const targetHouseholdId = currentPatron?.householdId
        if (targetHouseholdId) {
          const { otherLabel } = getDerivedLabels()
          transferPatronToHousehold(selectedPatron.id, targetHouseholdId, otherLabel, conflictNewHead)
        }
      }

      // Create household if needed and toggle is on
      if (needsHouseholdCreation() && createHouseholdToggle) {
        const headId = isHeadOfHousehold ? patronId : selectedPatron.id
        const otherId = headId === patronId ? selectedPatron.id : patronId
        const { otherLabel, currentLabel } = getDerivedLabels()
        const otherMemberRole = headId === patronId ? otherLabel : currentLabel
        createHousehold(headId, otherId, householdName.trim(), otherMemberRole)
      }

      // Create the relationship
      addPatronRelationship(p1, p2, 'household', category, customLabels, notes || null)

      setIsLoading(false)
      onSuccess && onSuccess()
      onClose()
    } catch (err) {
      setIsLoading(false)
      setError('Failed to create relationship')
    }
  }

  if (!isOpen) return null

  const currentRoles = roleOptionsByType[relType] || []

  // Determine if household-form submit button should be enabled
  const hhFormCanSubmit = selectedPatron
    && (!householdConflict || conflictApproved)
    && selectedRole
    && (selectedRole !== 'other' || customRole.trim())
    && (!needsHouseholdCreation() || !createHouseholdToggle || householdName.trim())

  return (
    <div className="add-rel-modal__overlay" onClick={onClose}>
      <div className="add-rel-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="add-rel-modal__header">
          {step === 'household-form' && !preselectedType && (
            <button className="add-rel-modal__header-back" onClick={handleBackToType}>
              <i className="fa-solid fa-chevron-left"></i>
            </button>
          )}
          <h2 className="add-rel-modal__title">
            {step === 'type' && 'Add relationship'}
            {step === 'contact' && 'Find contact'}
            {step === 'roles' && 'Define relationship'}
            {step === 'household-form' && (preselectedType ? 'Add relationship' : 'Add a household relationship')}
          </h2>
          <button className="add-rel-modal__close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* ============================================
            HOUSEHOLD FORM — single-page layout
            ============================================ */}
        {step === 'household-form' ? (
          <>
            <div className="add-rel-modal__scroll-content">
              {/* ---- Section 1: Related individual ---- */}
              <div className="add-rel-modal__section">
                <div className="add-rel-modal__section-title">Related individual</div>
                <div className="add-rel-modal__fieldset">
                  <div className="add-rel-modal__patron-field-wrap">
                    {selectedPatron ? (
                      <div
                        className="add-rel-modal__float-field add-rel-modal__float-field--filled"
                        onClick={clearHouseholdPatron}
                      >
                        <span className="add-rel-modal__float-label">Related patron</span>
                        <span className="add-rel-modal__float-value">{selectedPatron.name}</span>
                        <i className="fa-solid fa-chevron-down add-rel-modal__float-chevron"></i>
                      </div>
                    ) : patronSearchOpen ? (
                      <div className="add-rel-modal__float-field add-rel-modal__float-field--active">
                        <span className="add-rel-modal__float-label">Related patron</span>
                        <input
                          ref={hhSearchInputRef}
                          className="add-rel-modal__float-input"
                          type="text"
                          placeholder="Search by name or email..."
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                        />
                        <i className="fa-solid fa-chevron-down add-rel-modal__float-chevron"></i>
                      </div>
                    ) : (
                      <div
                        className="add-rel-modal__float-field"
                        onClick={() => setPatronSearchOpen(true)}
                      >
                        <span className="add-rel-modal__float-label">Related patron</span>
                        <span className="add-rel-modal__float-placeholder">Select the related patron</span>
                        <i className="fa-solid fa-chevron-down add-rel-modal__float-chevron"></i>
                      </div>
                    )}

                    {/* Floating search results dropdown */}
                    {patronSearchOpen && !selectedPatron && searchResults.length > 0 && (
                      <div className="add-rel-modal__search-dropdown">
                        {searchResults.map(patron => {
                          const existingHHRole = sameHouseholdMembers.get(patron.id)
                          const isDisabled = !!existingHHRole
                          return (
                            <div
                              key={patron.id}
                              className={`add-rel-modal__search-dropdown-item${isDisabled ? ' add-rel-modal__search-dropdown-item--disabled' : ''}`}
                              onClick={isDisabled ? undefined : () => handleHouseholdPatronSelect(patron)}
                            >
                              <div className="add-rel-modal__result-avatar">
                                {patron.photo ? (
                                  <img src={patron.photo} alt={patron.name} />
                                ) : (
                                  <span>{getInitials(patron.name)}</span>
                                )}
                              </div>
                              <div className="add-rel-modal__result-info">
                                <span className="add-rel-modal__result-name">{patron.name}</span>
                                <span className="add-rel-modal__result-meta">
                                  {isDisabled
                                    ? `Already a member \u2014 ${existingHHRole}`
                                    : (patron.email || 'No email')
                                  }
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {patronSearchOpen && !selectedPatron && searchQuery.length >= 2 && searchResults.length === 0 && (
                      <div className="add-rel-modal__search-dropdown add-rel-modal__search-dropdown--empty">
                        No patrons found matching "{searchQuery}"
                      </div>
                    )}
                  </div>

                  <div className="add-rel-modal__info-box">
                    <i className="fa-solid fa-circle-info"></i>
                    <span>The individual must be a registered patron in our database.</span>
                  </div>
                </div>
              </div>

              {/* ---- Inline conflict warning ---- */}
              {householdConflict && !conflictApproved && (
                <div className="add-rel-modal__section">
                  <div className="add-rel-modal__fieldset add-rel-modal__fieldset--warning">
                    <div className="add-rel-modal__conflict-warning">
                      <i className="fa-solid fa-triangle-exclamation"></i>
                      <div>
                        <strong>{selectedPatron?.name}</strong> is already a member of the <strong>{householdConflict.household.name}</strong> household.
                        {householdConflict.isHead && (
                          <> They are the <strong>Head</strong> of that household.</>
                        )}
                      </div>
                    </div>

                    {householdConflict.memberCount <= 2 && (
                      <div className="add-rel-modal__conflict-info">
                        <i className="fa-solid fa-circle-info"></i>
                        <span>
                          Transferring {selectedPatron?.name} will <strong>dissolve</strong> the {householdConflict.household.name} household since only one member would remain.
                        </span>
                      </div>
                    )}

                    {showHeadPicker ? (
                      <>
                        <p className="add-rel-modal__description">
                          Who should become the new Head of the <strong>{householdConflict.household.name}</strong> household?
                        </p>

                        <div className="add-rel-modal__head-picker">
                          {householdConflict.remainingMembers.map(member => (
                            <button
                              key={member.patronId}
                              type="button"
                              className={`add-rel-modal__head-option${conflictNewHead === member.patronId ? ' add-rel-modal__head-option--selected' : ''}`}
                              onClick={() => setConflictNewHead(member.patronId)}
                            >
                              <div className="add-rel-modal__head-option-avatar">
                                {member.photo
                                  ? <img src={member.photo} alt={member.name} />
                                  : <span>{getInitials(member.name)}</span>
                                }
                              </div>
                              <div className="add-rel-modal__head-option-info">
                                <span className="add-rel-modal__head-option-name">{member.name}</span>
                                <span className="add-rel-modal__head-option-role">{member.role}</span>
                              </div>
                              {conflictNewHead === member.patronId && (
                                <i className="fa-solid fa-circle-check add-rel-modal__head-option-check"></i>
                              )}
                            </button>
                          ))}
                        </div>

                        <div className="add-rel-modal__conflict-actions">
                          <button
                            className="add-rel-modal__conflict-btn add-rel-modal__conflict-btn--primary"
                            onClick={handleHeadPickerContinue}
                            disabled={!conflictNewHead}
                          >
                            Continue
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="add-rel-modal__conflict-actions add-rel-modal__conflict-actions--row">
                        <button className="add-rel-modal__conflict-btn add-rel-modal__conflict-btn--secondary" onClick={handleConflictCancel}>
                          Choose different contact
                        </button>
                        <button className="add-rel-modal__conflict-btn add-rel-modal__conflict-btn--primary" onClick={handleConflictTransfer}>
                          <i className="fa-solid fa-arrow-right-arrow-left"></i>
                          Transfer
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ---- Section 2: Relationship (two role dropdowns) ---- */}
              <div className="add-rel-modal__section">
                <div className="add-rel-modal__section-title">Relationship</div>
                <div className="add-rel-modal__fieldset">
                  {/* Current patron's role */}
                  {selectedRole !== 'other' ? (
                    <div className={`add-rel-modal__float-field add-rel-modal__float-field--select${(!selectedPatron || (householdConflict && !conflictApproved)) ? ' add-rel-modal__float-field--disabled' : ''}`}>
                      <span className="add-rel-modal__float-label">{patronName} is the</span>
                      <span className={selectedRole ? 'add-rel-modal__float-value' : 'add-rel-modal__float-placeholder'}>
                        {selectedRole ? (currentRoles.find(r => r.id === selectedRole)?.label || selectedRole) : 'Select role'}
                      </span>
                      <select
                        className="add-rel-modal__float-select"
                        value={selectedRole}
                        onChange={e => setSelectedRole(e.target.value)}
                        disabled={!selectedPatron || (householdConflict && !conflictApproved)}
                      >
                        <option value="">Select role</option>
                        {currentRoles.map(r => (
                          <option key={r.id} value={r.id}>{r.label}</option>
                        ))}
                      </select>
                      <i className="fa-solid fa-chevron-down add-rel-modal__float-chevron"></i>
                    </div>
                  ) : (
                    <div className="add-rel-modal__float-field">
                      <span className="add-rel-modal__float-label">{patronName} is the</span>
                      <input
                        className="add-rel-modal__float-input"
                        type="text"
                        placeholder="Enter role"
                        value={customRole}
                        onChange={e => setCustomRole(e.target.value)}
                      />
                    </div>
                  )}

                  {/* Reciprocal role (other patron) */}
                  {selectedRole && (reciprocalRole !== 'other' ? (
                    <div className={`add-rel-modal__float-field add-rel-modal__float-field--select${(!selectedPatron || (householdConflict && !conflictApproved)) ? ' add-rel-modal__float-field--disabled' : ''}`}>
                      <span className="add-rel-modal__float-label">{selectedPatron?.name || 'Related individual'} is the</span>
                      <span className={reciprocalRole ? 'add-rel-modal__float-value' : 'add-rel-modal__float-placeholder'}>
                        {reciprocalRole ? (currentRoles.find(r => r.id === reciprocalRole)?.label || reciprocalRole) : 'Select role'}
                      </span>
                      <select
                        className="add-rel-modal__float-select"
                        value={reciprocalRole}
                        onChange={e => setReciprocalRole(e.target.value)}
                        disabled={!selectedPatron || (householdConflict && !conflictApproved)}
                      >
                        <option value="">Select role</option>
                        {currentRoles.map(r => (
                          <option key={r.id} value={r.id}>{r.label}</option>
                        ))}
                      </select>
                      <i className="fa-solid fa-chevron-down add-rel-modal__float-chevron"></i>
                    </div>
                  ) : (
                    <div className="add-rel-modal__float-field">
                      <span className="add-rel-modal__float-label">{selectedPatron?.name || 'Related individual'} is the</span>
                      <input
                        className="add-rel-modal__float-input"
                        type="text"
                        placeholder="Enter role"
                        value={customReciprocalRole}
                        onChange={e => setCustomReciprocalRole(e.target.value)}
                      />
                    </div>
                  ))}

                  {/* Back to dropdown link when in "other" mode */}
                  {selectedRole === 'other' && (
                    <button
                      type="button"
                      className="add-rel-modal__link-btn"
                      onClick={() => { setSelectedRole(''); setCustomRole(''); setReciprocalRole(''); setCustomReciprocalRole('') }}
                    >
                      <i className="fa-solid fa-arrow-left"></i> Back to role list
                    </button>
                  )}
                </div>
              </div>

              {/* ---- Section 3: Household (conditional) ---- */}
              {selectedPatron && needsHouseholdCreation() && (
                <div className="add-rel-modal__section">
                  <div className="add-rel-modal__section-title">Household</div>
                  <div className="add-rel-modal__fieldset">
                    <div className="add-rel-modal__toggle-row">
                      <div className="add-rel-modal__toggle-text">
                        <span className="add-rel-modal__toggle-label">Create household</span>
                        <span className="add-rel-modal__toggle-desc">A household between both patrons will be created.</span>
                      </div>
                      <button
                        type="button"
                        className={`add-rel-modal__switch${createHouseholdToggle ? ' add-rel-modal__switch--on' : ''}`}
                        onClick={() => setCreateHouseholdToggle(!createHouseholdToggle)}
                        role="switch"
                        aria-checked={createHouseholdToggle}
                      >
                        <span className="add-rel-modal__switch-thumb"></span>
                      </button>
                    </div>

                    {createHouseholdToggle && (
                      <>
                        <div className="add-rel-modal__float-field">
                          <span className="add-rel-modal__float-label">Household name</span>
                          <input
                            className="add-rel-modal__float-input"
                            type="text"
                            value={householdName}
                            onChange={e => setHouseholdName(e.target.value)}
                            placeholder="e.g. Collingwood Family"
                          />
                        </div>

                        <div className="add-rel-modal__toggle-row">
                          <div className="add-rel-modal__toggle-text">
                            <span className="add-rel-modal__toggle-label">Head of household</span>
                            <span className="add-rel-modal__toggle-desc">Assign {patronName} as a Head of household</span>
                          </div>
                          <button
                            type="button"
                            className={`add-rel-modal__switch${isHeadOfHousehold ? ' add-rel-modal__switch--on' : ''}`}
                            onClick={() => setIsHeadOfHousehold(!isHeadOfHousehold)}
                            role="switch"
                            aria-checked={isHeadOfHousehold}
                          >
                            <span className="add-rel-modal__switch-thumb"></span>
                          </button>
                        </div>

                        <div className="add-rel-modal__info-box">
                          <i className="fa-solid fa-circle-info"></i>
                          <span>
                            {`If you don't select this Patron as the head of household, the related Patron will be assigned as a Head of Household automatically.`}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* ---- Section 4: Notes (optional) ---- */}
              <div className="add-rel-modal__section">
                <div className="add-rel-modal__section-title">
                  Notes <span className="add-rel-modal__section-optional">(optional)</span>
                </div>
                <div className="add-rel-modal__fieldset">
                  <textarea
                    className="add-rel-modal__notes-input"
                    placeholder={
                      relType === 'household'
                        ? 'e.g., Primary contact for donations, handles event RSVPs...'
                        : relType === 'personal'
                          ? 'e.g., Met at 2023 gala, college roommates...'
                          : relType === 'organization'
                            ? 'e.g., Board liaison, manages corporate sponsorship...'
                            : 'e.g., Referred by board chair, manages investment portfolio...'
                    }
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={2}
                  />
                </div>
              </div>

              {error && (
                <div className="add-rel-modal__error">
                  <i className="fa-solid fa-exclamation-circle"></i>
                  {error}
                </div>
              )}
            </div>

            {/* Pinned footer for household form */}
            <div className="add-rel-modal__footer">
              <button className="add-rel-modal__footer-cancel" onClick={onClose}>
                Cancel
              </button>
              <button
                className={`add-rel-modal__footer-submit${!hhFormCanSubmit ? ' add-rel-modal__footer-submit--disabled' : ''}`}
                onClick={handleHouseholdFormSubmit}
                disabled={isLoading || !hhFormCanSubmit}
              >
                {isLoading ? 'Saving...' : (hhFormCanSubmit ? 'Add' : 'Add relationship')}
              </button>
            </div>
          </>
        ) : (
          <div className="add-rel-modal__content">
            {/* ============================================
                EXISTING MULTI-STEP WIZARD (non-household)
                ============================================ */}

            {/* Step 1: Choose type */}
            {step === 'type' && (
              <>
                <div className="add-rel-modal__intro">
                  <h3 className="add-rel-modal__intro-title">
                    <span className="add-rel-modal__intro-emoji">👥</span>
                    Let's create a new relationship
                  </h3>
                  <p className="add-rel-modal__intro-desc">
                    What kind of relationship do you want to add for <strong>{patronName}</strong>
                  </p>
                </div>
                <div className="add-rel-modal__type-list">
                  {relationshipTypes.filter(t => !excludeTypes?.includes(t.id)).map(t => (
                    <button
                      key={t.id}
                      className="add-rel-modal__type-card"
                      onClick={() => handleSelectType(t.id)}
                    >
                      <div className="add-rel-modal__type-icon-wrap">
                        <i className={`${t.icon} add-rel-modal__type-icon`}></i>
                      </div>
                      <div className="add-rel-modal__type-info">
                        <span className="add-rel-modal__type-label">{t.label}</span>
                        <span className="add-rel-modal__type-desc">{t.description}</span>
                      </div>
                      <i className="fa-solid fa-chevron-right add-rel-modal__type-arrow"></i>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Step 2: Find or enter contact (non-household types) */}
            {step === 'contact' && (
              <>
                <button className="add-rel-modal__back" onClick={handleBackToType}>
                  <i className="fa-solid fa-arrow-left"></i>
                  Back
                </button>

                {relType !== 'personal' && (
                  <div className="add-rel-modal__contact-toggle">
                    <button
                      className={`add-rel-modal__toggle-btn ${contactMode === 'search' ? 'add-rel-modal__toggle-btn--active' : ''}`}
                      onClick={() => setContactMode('search')}
                    >
                      Search patrons
                    </button>
                    <button
                      className={`add-rel-modal__toggle-btn ${contactMode === 'external' ? 'add-rel-modal__toggle-btn--active' : ''}`}
                      onClick={() => setContactMode('external')}
                    >
                      External contact
                    </button>
                  </div>
                )}
                {relType === 'personal' && (
                  <p className="add-rel-modal__description" style={{ margin: 'var(--space-2) 0' }}>
                    Search for an existing patron to link as a personal connection.
                  </p>
                )}

                {contactMode === 'search' ? (
                  <>
                    <div className="add-rel-modal__search">
                      <i className="fa-solid fa-magnifying-glass"></i>
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                      />
                    </div>

                    {searchResults.length > 0 && (
                      <div className="add-rel-modal__results">
                        <div className="add-rel-modal__results-label">Results</div>
                        <ul className="add-rel-modal__results-list">
                          {searchResults.map(patron => (
                            <li
                              key={patron.id}
                              className="add-rel-modal__result-item"
                              onClick={() => handleSelectPatron(patron)}
                            >
                              <div className="add-rel-modal__result-avatar">
                                {patron.photo ? (
                                  <img src={patron.photo} alt={patron.name} />
                                ) : (
                                  <span>{getInitials(patron.name)}</span>
                                )}
                              </div>
                              <div className="add-rel-modal__result-info">
                                <span className="add-rel-modal__result-name">{patron.name}</span>
                                <span className="add-rel-modal__result-meta">{patron.email || 'No email'}</span>
                              </div>
                              <span className="add-rel-modal__result-add">Select</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {searchQuery.length >= 2 && searchResults.length === 0 && (
                      <div className="add-rel-modal__no-results">
                        <p>No patrons found matching "{searchQuery}"</p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="add-rel-modal__ext-form">
                      <div className="add-rel-modal__form-field">
                        <label>{relType === 'organization' ? 'Organization Name' : 'Contact Name'} *</label>
                        <input
                          type="text"
                          placeholder={relType === 'organization' ? 'e.g. Apex Innovations' : 'e.g. Robert Chen'}
                          value={externalName}
                          onChange={e => setExternalName(e.target.value)}
                        />
                      </div>
                      {relType !== 'organization' && (
                        <div className="add-rel-modal__form-field">
                          <label>Company</label>
                          <input
                            type="text"
                            placeholder="e.g. Collingwood Wealth Management"
                            value={externalCompany}
                            onChange={e => setExternalCompany(e.target.value)}
                          />
                        </div>
                      )}
                      <div className="add-rel-modal__form-field">
                        <label>Title / Position</label>
                        <input
                          type="text"
                          placeholder="e.g. CTO, Partner"
                          value={externalTitle}
                          onChange={e => setExternalTitle(e.target.value)}
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="add-rel-modal__error">
                        <i className="fa-solid fa-exclamation-circle"></i>
                        {error}
                      </div>
                    )}

                    <div className="add-rel-modal__footer">
                      <button className="add-rel-modal__footer-cancel" onClick={onClose}>Cancel</button>
                      <button className="add-rel-modal__footer-submit" onClick={handleExternalContinue}>
                        Continue
                      </button>
                    </div>
                  </>
                )}
              </>
            )}

            {/* Step 3: Define relationship (non-household types) */}
            {step === 'roles' && (
              <>
                <button className="add-rel-modal__back" onClick={handleBackToContact}>
                  <i className="fa-solid fa-arrow-left"></i>
                  Back
                </button>

                {/* Show selected contact */}
                <div className="add-rel-modal__selected">
                  <div className="add-rel-modal__selected-avatar">
                    {selectedPatron?.photo ? (
                      <img src={selectedPatron.photo} alt={selectedPatron.name} />
                    ) : (
                      <span>{getInitials(selectedPatron?.name || externalName)}</span>
                    )}
                  </div>
                  <div className="add-rel-modal__selected-info">
                    <span className="add-rel-modal__selected-label">Linking with:</span>
                    <span className="add-rel-modal__selected-name">
                      {selectedPatron?.name || externalName}
                    </span>
                    {(selectedPatron?.email || externalCompany) && (
                      <span className="add-rel-modal__selected-meta">
                        {selectedPatron?.email || externalCompany}
                      </span>
                    )}
                  </div>
                </div>

                {/* Cross-type relationship info callout */}
                {selectedPatron && (() => {
                  const existingRels = getActiveRelationships(patronId, selectedPatron.id)
                  if (existingRels.length === 0) return null
                  const relDescriptions = existingRels.map(r => {
                    const typeLabel = relationshipTypes.find(t => t.id === r.type)?.label || r.type
                    const displayLabel = getDisplayRole(r.category, patronId, r, currentPatronData?.gender || null)
                    return `${displayLabel} (${typeLabel})`
                  }).join(', ')
                  return (
                    <div className="add-rel-modal__existing-rels-info">
                      <i className="fa-solid fa-circle-info"></i>
                      <span>
                        {patronName} already has {existingRels.length === 1 ? 'a' : existingRels.length} relationship{existingRels.length > 1 ? 's' : ''} with {selectedPatron.name}: <strong>{relDescriptions}</strong>. Adding another will appear as an additional badge on the consolidated card.
                      </span>
                    </div>
                  )
                })()}

                {/* Role selection — two dropdowns */}
                <div className="add-rel-modal__role-section">
                  <label className="add-rel-modal__role-label">
                    {selectedPatron?.name || externalName} is {patronName}'s:
                  </label>
                  <select
                    className="add-rel-modal__role-select"
                    value={selectedRole}
                    onChange={e => setSelectedRole(e.target.value)}
                  >
                    <option value="">Select role...</option>
                    {currentRoles.map(r => (
                      <option key={r.id} value={r.id}>{r.label}</option>
                    ))}
                  </select>

                  {/* Custom role input */}
                  {selectedRole === 'other' && (
                    <input
                      type="text"
                      className="add-rel-modal__custom-role"
                      placeholder="Enter role"
                      value={customRole}
                      onChange={e => setCustomRole(e.target.value)}
                      style={{ marginTop: 'var(--space-2)' }}
                    />
                  )}
                </div>

                {/* Reciprocal role */}
                {selectedRole && (
                  <div className="add-rel-modal__role-section">
                    <label className="add-rel-modal__role-label">
                      {patronName} is {selectedPatron?.name || externalName}'s:
                    </label>
                    <select
                      className="add-rel-modal__role-select"
                      value={reciprocalRole}
                      onChange={e => setReciprocalRole(e.target.value)}
                    >
                      <option value="">Select role...</option>
                      {currentRoles.map(r => (
                        <option key={r.id} value={r.id}>{r.label}</option>
                      ))}
                    </select>

                    {/* Custom reciprocal role input */}
                    {reciprocalRole === 'other' && (
                      <input
                        type="text"
                        className="add-rel-modal__custom-role"
                        placeholder="Enter role"
                        value={customReciprocalRole}
                        onChange={e => setCustomReciprocalRole(e.target.value)}
                        style={{ marginTop: 'var(--space-2)' }}
                      />
                    )}
                  </div>
                )}

                {/* Notes (optional) */}
                <div className="add-rel-modal__role-section">
                  <label className="add-rel-modal__role-label">Notes (optional)</label>
                  <textarea
                    className="add-rel-modal__notes-input"
                    placeholder="e.g., Primary contact for donations, handles event RSVPs..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={2}
                  />
                </div>

                {error && (
                  <div className="add-rel-modal__error">
                    <i className="fa-solid fa-exclamation-circle"></i>
                    {error}
                  </div>
                )}

                <div className="add-rel-modal__footer">
                  <button className="add-rel-modal__footer-cancel" onClick={onClose}>Cancel</button>
                  <button
                    className="add-rel-modal__footer-submit"
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Add relationship'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AddRelationshipModal
