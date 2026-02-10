import { useState, useEffect, useRef } from 'react'
import { searchPatrons, addPatronRelationship, getReciprocalRole, patronRelationships, getPatronById, createHousehold, getHouseholdConflict, hasActiveRelationship, getActiveRelationships, transferPatronToHousehold } from '../../data/patrons'
import { getInitials } from '../../utils/getInitials'
import './AddRelationshipModal.css'

// Relationship type categories
const relationshipTypes = [
  { id: 'household', label: 'Household', icon: 'fa-solid fa-house-chimney', description: 'Spouse, child, parent living together' },
  { id: 'personal', label: 'Personal', icon: 'fa-solid fa-user-group', description: 'Family, friends, mentors, and other personal connections' },
  { id: 'professional', label: 'Professional', icon: 'fa-solid fa-briefcase', description: 'Financial advisor, attorney, accountant' },
  { id: 'organization', label: 'Organization', icon: 'fa-solid fa-building', description: 'Employer, board, volunteer affiliation' },
]

// Role options per relationship type
const roleOptionsByType = {
  household: [
    { id: 'Spouse', label: 'Spouse' },
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
    { id: 'Godparent', label: 'Godparent' },
    { id: 'Neighbor', label: 'Neighbor' },
    { id: 'Guardian', label: 'Guardian' },
    { id: 'other', label: 'Other' },
  ],
  professional: [
    { id: 'Financial Advisor', label: 'Financial Advisor' },
    { id: 'Client', label: 'Client' },
    { id: 'Attorney', label: 'Attorney' },
    { id: 'Accountant', label: 'Accountant' },
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
  onSuccess,
  onBeforeMutate,
}) {
  const [step, setStep] = useState('type') // 'type' | 'contact' | 'conflict' | 'roles' | 'household'
  const [relType, setRelType] = useState('')
  const [contactMode, setContactMode] = useState('search') // 'search' | 'external'
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedPatron, setSelectedPatron] = useState(null)

  // External contact fields
  const [externalName, setExternalName] = useState('')
  const [externalCompany, setExternalCompany] = useState('')
  const [externalTitle, setExternalTitle] = useState('')

  // Role fields
  const [selectedRole, setSelectedRole] = useState('')
  const [customRole, setCustomRole] = useState('')
  const [reciprocalRole, setReciprocalRole] = useState('')
  const [customReciprocalRole, setCustomReciprocalRole] = useState('')

  // Household creation fields (step 4)
  const [householdName, setHouseholdName] = useState('')
  const [selectedHead, setSelectedHead] = useState('')

  // Household conflict state
  const [householdConflict, setHouseholdConflict] = useState(null)
  const [conflictApproved, setConflictApproved] = useState(false) // user approved transfer from old household
  const [conflictNewHead, setConflictNewHead] = useState(null) // patron ID chosen as new Head when transferring the current Head
  const [showHeadPicker, setShowHeadPicker] = useState(false) // controls inline Head picker visibility

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const searchInputRef = useRef(null)

  // Get current patron data for household checks
  const currentPatronData = getPatronById(patronId)

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      const initialType = preselectedType || ''
      setRelType(initialType)
      setStep(initialType ? 'contact' : 'type')
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

  // Auto-suggest reciprocal when role changes (gender-aware)
  useEffect(() => {
    if (selectedRole && selectedRole !== 'other') {
      const patronGender = currentPatronData?.gender || null
      const suggested = getReciprocalRole(selectedRole, patronGender)
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

  const handleSelectType = (typeId) => {
    setRelType(typeId)
    setStep('contact')
    setError('')
  }

  const handleSelectPatron = (patron) => {
    setSelectedPatron(patron)
    setError('')

    // For household relationships, check if the selected patron is already in a different household
    if (relType === 'household') {
      const conflict = getHouseholdConflict(patron.id, currentPatronData?.householdId)
      if (conflict) {
        setHouseholdConflict(conflict)
        setStep('conflict')
        return
      }
    }

    prefillRoleFromExistingPersonal(patron)
    setStep('roles')
  }

  // When adding a household relationship, pre-fill the role dropdowns if the selected
  // patron already has a Personal relationship with the current patron (e.g., Sister/Brother).
  const prefillRoleFromExistingPersonal = (patron) => {
    if (relType !== 'household' || !patron) return
    const existingRels = getActiveRelationships(patronId, patron.id)
    const personalMatch = existingRels.find(r => r.type === 'personal')
    if (personalMatch) {
      setSelectedRole(personalMatch.role)
      setReciprocalRole(personalMatch.reciprocalRole)
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
    setError('')
  }

  const handleBackToContact = () => {
    setStep('contact')
    setSelectedPatron(null)
    setSelectedRole('')
    setCustomRole('')
    setReciprocalRole('')
    setCustomReciprocalRole('')
    setError('')
  }

  // Check whether we need a household creation step
  const needsHouseholdCreation = () => {
    if (relType !== 'household' || !selectedPatron) return false
    const currentPatron = getPatronById(patronId)
    const otherPatron = getPatronById(selectedPatron.id)
    return !currentPatron?.householdId && !otherPatron?.householdId
  }

  const handleSubmit = () => {
    if (!selectedRole) {
      setError('Please select a role')
      return
    }
    if (selectedRole === 'other' && !customRole.trim()) {
      setError('Please enter the role')
      return
    }

    // Duplicate relationship prevention — blocks exact same role, allows different roles within same type
    if (selectedPatron && hasActiveRelationship(patronId, selectedPatron.id, relType, selectedRole)) {
      setError(`An active ${selectedRole} relationship already exists with ${selectedPatron.name}.`)
      return
    }

    // If this is a household relationship and neither patron has a household,
    // advance to the household creation step instead of submitting
    if (needsHouseholdCreation()) {
      const lastName = currentPatronData?.lastName || patronName.split(' ').pop()
      setHouseholdName(`${lastName} Family`)
      setSelectedHead(patronId)
      setStep('household')
      setError('')
      return
    }

    submitRelationship()
  }

  const submitRelationship = () => {
    onBeforeMutate?.()
    setIsLoading(true)
    setError('')

    const resolvedRole = selectedRole === 'other' ? customRole.trim() : selectedRole
    const resolvedReciprocal = reciprocalRole === 'other'
      ? customReciprocalRole.trim()
      : reciprocalRole

    try {
      if (selectedPatron) {
        // If user approved a household transfer, move the patron first
        if (conflictApproved && relType === 'household') {
          const currentPatron = getPatronById(patronId)
          const targetHouseholdId = currentPatron?.householdId
          if (targetHouseholdId) {
            // Transfer selected patron into current patron's household
            // Pass conflictNewHead so the old household gets a new Head (if applicable)
            transferPatronToHousehold(selectedPatron.id, targetHouseholdId, resolvedRole, conflictNewHead)
          }
        }

        // Patron-to-patron relationship
        addPatronRelationship(patronId, selectedPatron.id, relType, resolvedRole, resolvedReciprocal || resolvedRole)
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
          fromPatronId: patronId,
          toPatronId: null,
          type: relType,
          role: resolvedRole,
          reciprocalRole: resolvedReciprocal || resolvedRole,
          isPrimary: false,
          startDate: new Date().toISOString().split('T')[0],
          endDate: null,
          notes: externalTitle.trim() || null,
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
    // If the departing patron is the Head and the old household will survive (3+ members),
    // show the Head picker before proceeding to roles
    if (householdConflict?.isHead && householdConflict?.memberCount > 2) {
      setShowHeadPicker(true)
      setError('')
      return
    }
    // Otherwise proceed directly to roles
    setConflictApproved(true)
    prefillRoleFromExistingPersonal(selectedPatron)
    setStep('roles')
    setError('')
  }

  const handleHeadPickerContinue = () => {
    // User has selected a new Head — proceed to roles step
    setConflictApproved(true)
    setShowHeadPicker(false)
    prefillRoleFromExistingPersonal(selectedPatron)
    setStep('roles')
    setError('')
  }

  const handleConflictCancel = () => {
    // User chose to pick a different contact
    setHouseholdConflict(null)
    setConflictApproved(false)
    setConflictNewHead(null)
    setShowHeadPicker(false)
    setSelectedPatron(null)
    setStep('contact')
    setError('')
  }

  const handleBackToRoles = () => {
    setStep('roles')
    setError('')
  }

  const handleHouseholdSubmit = () => {
    if (!householdName.trim()) {
      setError('Please enter a household name')
      return
    }

    setIsLoading(true)
    setError('')

    const resolvedRole = selectedRole === 'other' ? customRole.trim() : selectedRole
    const resolvedReciprocal = reciprocalRole === 'other'
      ? customReciprocalRole.trim()
      : reciprocalRole

    try {
      // Determine head vs other patron
      const headId = selectedHead
      const otherId = headId === patronId ? selectedPatron.id : patronId
      // The "other" member's role: if the head is the current patron, the other gets resolvedRole;
      // if the head is the selected patron, the other gets resolvedReciprocal
      const otherMemberRole = headId === patronId ? resolvedRole : (resolvedReciprocal || resolvedRole)

      // Create the household first
      createHousehold(headId, otherId, householdName.trim(), otherMemberRole)

      // Now create the relationship (addPatronRelationship will find the household)
      addPatronRelationship(patronId, selectedPatron.id, relType, resolvedRole, resolvedReciprocal || resolvedRole)

      setIsLoading(false)
      onSuccess && onSuccess()
      onClose()
    } catch (err) {
      setIsLoading(false)
      setError('Failed to create household')
    }
  }

  if (!isOpen) return null

  const currentRoles = roleOptionsByType[relType] || []

  return (
    <div className="add-rel-modal__overlay" onClick={onClose}>
      <div className="add-rel-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="add-rel-modal__header">
          <h2 className="add-rel-modal__title">
            {step === 'type' && 'Add relationship'}
            {step === 'contact' && 'Find contact'}
            {step === 'conflict' && 'Household conflict'}
            {step === 'roles' && 'Define relationship'}
            {step === 'household' && 'Create household'}
          </h2>
          <button className="add-rel-modal__close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="add-rel-modal__content">
          {/* Step 1: Choose type */}
          {step === 'type' && (
            <>
              <p className="add-rel-modal__description">
                What type of relationship do you want to add for <strong>{patronName}</strong>?
              </p>
              <div className="add-rel-modal__type-list">
                {relationshipTypes.map(t => (
                  <button
                    key={t.id}
                    className="add-rel-modal__type-card"
                    onClick={() => handleSelectType(t.id)}
                  >
                    <i className={`${t.icon} add-rel-modal__type-icon`}></i>
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

          {/* Step 2: Find or enter contact */}
          {step === 'contact' && (
            <>
              <button className="add-rel-modal__back" onClick={handleBackToType}>
                <i className="fa-solid fa-arrow-left"></i>
                Back
              </button>

              {/* Toggle between search and external (personal relationships are patron-to-patron only) */}
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

                  <div className="add-rel-modal__actions">
                    <button className="add-rel-modal__cancel" onClick={onClose}>Cancel</button>
                    <button className="add-rel-modal__submit" onClick={handleExternalContinue}>
                      Continue
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {/* Step 2b: Household conflict warning */}
          {step === 'conflict' && householdConflict && (
            <>
              <button className="add-rel-modal__back" onClick={handleConflictCancel}>
                <i className="fa-solid fa-arrow-left"></i>
                Back
              </button>

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

              {/* Inline Head picker — shown after user clicks "Transfer" when departing patron is Head of a 3+ member household */}
              {showHeadPicker ? (
                <>
                  <p className="add-rel-modal__description" style={{ marginTop: 'var(--space-4)' }}>
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
                <>
                  <p className="add-rel-modal__description" style={{ marginTop: 'var(--space-4)' }}>
                    Would you like to transfer <strong>{selectedPatron?.name}</strong> to {patronName}'s household, or choose a different contact?
                  </p>

                  <div className="add-rel-modal__conflict-actions">
                    <button className="add-rel-modal__conflict-btn add-rel-modal__conflict-btn--secondary" onClick={handleConflictCancel}>
                      Choose different contact
                    </button>
                    <button className="add-rel-modal__conflict-btn add-rel-modal__conflict-btn--primary" onClick={handleConflictTransfer}>
                      <i className="fa-solid fa-arrow-right-arrow-left"></i>
                      Transfer to this household
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {/* Step 3: Define roles */}
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
                  const label = relationshipTypes.find(t => t.id === r.type)?.label || r.type
                  return `${r.role} (${label})`
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

              {/* Role selection */}
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
                {selectedRole === 'other' && (
                  <input
                    type="text"
                    className="add-rel-modal__custom-role"
                    placeholder="Enter role"
                    value={customRole}
                    onChange={e => setCustomRole(e.target.value)}
                  />
                )}
              </div>

              {/* Reciprocal role */}
              <div className="add-rel-modal__role-section">
                <label className="add-rel-modal__role-label">
                  {patronName} is {selectedPatron?.name || externalName}'s:
                  {selectedRole && selectedRole !== 'other' && (
                    <small className="add-rel-modal__auto-label">auto-suggested</small>
                  )}
                </label>
                <select
                  className="add-rel-modal__role-select"
                  value={reciprocalRole}
                  onChange={e => setReciprocalRole(e.target.value)}
                  disabled={!selectedRole}
                >
                  <option value="">Select role...</option>
                  {currentRoles.map(r => (
                    <option key={`recip-${r.id}`} value={r.id}>{r.label}</option>
                  ))}
                </select>
                {reciprocalRole === 'other' && (
                  <input
                    type="text"
                    className="add-rel-modal__custom-role"
                    placeholder="Enter reciprocal role"
                    value={customReciprocalRole}
                    onChange={e => setCustomReciprocalRole(e.target.value)}
                  />
                )}
              </div>

              {error && (
                <div className="add-rel-modal__error">
                  <i className="fa-solid fa-exclamation-circle"></i>
                  {error}
                </div>
              )}

              <div className="add-rel-modal__actions">
                <button className="add-rel-modal__cancel" onClick={onClose}>Cancel</button>
                <button
                  className="add-rel-modal__submit"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : (needsHouseholdCreation() ? 'Continue' : 'Add relationship')}
                </button>
              </div>
            </>
          )}

          {/* Step 4: Create household (only when neither patron has a household) */}
          {step === 'household' && (
            <>
              <button className="add-rel-modal__back" onClick={handleBackToRoles}>
                <i className="fa-solid fa-arrow-left"></i>
                Back
              </button>

              <p className="add-rel-modal__description">
                Neither <strong>{patronName}</strong> nor <strong>{selectedPatron?.name}</strong> belongs to a household yet. Create one to group them together.
              </p>

              {/* Household name */}
              <div className="add-rel-modal__hh-field">
                <label className="add-rel-modal__hh-label">Household name</label>
                <input
                  type="text"
                  className="add-rel-modal__hh-input"
                  value={householdName}
                  onChange={e => setHouseholdName(e.target.value)}
                  placeholder="e.g. Davis Family"
                />
              </div>

              {/* Head of household selector */}
              <div className="add-rel-modal__hh-field">
                <label className="add-rel-modal__hh-label">Head of household</label>
                <p className="add-rel-modal__hh-hint">
                  Select the primary contact for this household.
                </p>
                <div className="add-rel-modal__hh-member-list">
                  {/* Current patron */}
                  <label className={`add-rel-modal__hh-member ${selectedHead === patronId ? 'add-rel-modal__hh-member--selected' : ''}`}>
                    <input
                      type="radio"
                      name="head-of-household"
                      className="add-rel-modal__hh-radio"
                      checked={selectedHead === patronId}
                      onChange={() => setSelectedHead(patronId)}
                    />
                    <div className="add-rel-modal__hh-avatar">
                      {currentPatronData?.photo ? (
                        <img src={currentPatronData.photo} alt={patronName} />
                      ) : (
                        <span>{getInitials(patronName)}</span>
                      )}
                    </div>
                    <span className="add-rel-modal__hh-name">{patronName}</span>
                  </label>

                  {/* Selected patron */}
                  <label className={`add-rel-modal__hh-member ${selectedHead === selectedPatron?.id ? 'add-rel-modal__hh-member--selected' : ''}`}>
                    <input
                      type="radio"
                      name="head-of-household"
                      className="add-rel-modal__hh-radio"
                      checked={selectedHead === selectedPatron?.id}
                      onChange={() => setSelectedHead(selectedPatron?.id)}
                    />
                    <div className="add-rel-modal__hh-avatar">
                      {selectedPatron?.photo ? (
                        <img src={selectedPatron.photo} alt={selectedPatron.name} />
                      ) : (
                        <span>{getInitials(selectedPatron?.name || '')}</span>
                      )}
                    </div>
                    <span className="add-rel-modal__hh-name">{selectedPatron?.name}</span>
                  </label>
                </div>
              </div>

              {error && (
                <div className="add-rel-modal__error">
                  <i className="fa-solid fa-exclamation-circle"></i>
                  {error}
                </div>
              )}

              <div className="add-rel-modal__actions">
                <button className="add-rel-modal__cancel" onClick={onClose}>Cancel</button>
                <button
                  className="add-rel-modal__submit"
                  onClick={handleHouseholdSubmit}
                  disabled={isLoading || !householdName.trim()}
                >
                  {isLoading ? 'Creating...' : 'Create household'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AddRelationshipModal
