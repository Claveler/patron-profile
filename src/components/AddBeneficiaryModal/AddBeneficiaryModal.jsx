import { useState, useEffect, useRef, useMemo } from 'react'
import { searchPatrons, addBeneficiaryToMembership, addPatron, getHouseholdForPatron, getHouseholdMembers, getBeneficiariesByMembershipId, patronRelationships, getPatronById, createHousehold, getDisplayRole, getReciprocalRole, ROLE_TO_CATEGORY, getActiveRelationships } from '../../data/patrons'
import { getInitials } from '../../utils/getInitials'
import './AddBeneficiaryModal.css'

// Membership roles (entitlement-based)
const membershipRoleOptions = [
  { id: 'additional_adult', label: 'Additional Adult' },
  { id: 'dependent', label: 'Dependent' }
]

// CRM relationship role labels for household connections
const relationshipRoleOptions = [
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
]

function AddBeneficiaryModal({ 
  isOpen, 
  onClose, 
  membershipId,
  primaryPatronId,
  primaryPatronName,
  onSuccess 
}) {
  const [step, setStep] = useState('search') // 'search' | 'create' | 'assign' | 'household'
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedPatron, setSelectedPatron] = useState(null)
  const [selectedMembershipRole, setSelectedMembershipRole] = useState('')
  const [selectedRelationship, setSelectedRelationship] = useState('')
  const [reciprocalRelationship, setReciprocalRelationship] = useState('')
  const [customRelationship, setCustomRelationship] = useState('')
  const [customReciprocalRelationship, setCustomReciprocalRelationship] = useState('')
  const [createRelationship, setCreateRelationship] = useState(true)
  const [hasExistingRelationship, setHasExistingRelationship] = useState(false)
  const [existingRelLabel, setExistingRelLabel] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Household creation state (Step 4)
  const [householdName, setHouseholdName] = useState('')
  const [selectedHead, setSelectedHead] = useState(null)
  
  // New patron form state
  const [newPatron, setNewPatron] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: ''
  })

  const searchInputRef = useRef(null)

  // Compute eligible household members (exclude primary patron + existing beneficiaries)
  const householdSuggestions = useMemo(() => {
    if (!primaryPatronId || !membershipId) return []

    const household = getHouseholdForPatron(primaryPatronId)
    if (!household) return []

    const members = getHouseholdMembers(household.id)
    const existingBeneficiaries = getBeneficiariesByMembershipId(membershipId)
    const existingPatronIds = new Set(existingBeneficiaries.map(b => b.patronId))

    return members
      .filter(m => m.patronId !== primaryPatronId && !existingPatronIds.has(m.patronId))
      .map(m => ({
        ...m.patron,
        householdRole: m.role // e.g. "Spouse", "Child"
      }))
  }, [primaryPatronId, membershipId, isOpen])

  // Look up existing relationship between primary patron and a given patron (order-agnostic)
  const findExistingRelationship = (targetPatronId) => {
    if (!primaryPatronId || !targetPatronId) return null
    const rels = getActiveRelationships(primaryPatronId, targetPatronId)
    return rels.find(r => r.type === 'household') || null
  }

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('search')
      setSearchQuery('')
      setSearchResults([])
      setSelectedPatron(null)
      setSelectedMembershipRole('')
      setSelectedRelationship('')
      setReciprocalRelationship('')
      setCustomRelationship('')
      setCustomReciprocalRelationship('')
      setCreateRelationship(true)
      setHasExistingRelationship(false)
      setExistingRelLabel('')
      setError('')
      setHouseholdName('')
      setSelectedHead(null)
      setNewPatron({ firstName: '', lastName: '', email: '', dateOfBirth: '' })
      
      // Focus search input after modal opens
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Search patrons when query changes
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const results = searchPatrons(searchQuery)
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  // Auto-suggest reciprocal when selectedRelationship changes
  useEffect(() => {
    if (selectedRelationship && selectedRelationship !== 'other') {
      // Reciprocal gender is the selected patron's gender (for the primary patron's label)
      const reciprocalGender = currentPatronData?.gender || null
      const suggested = getReciprocalRole(selectedRelationship, reciprocalGender)
      const matchingOption = relationshipRoleOptions.find(r => r.id === suggested)
      setReciprocalRelationship(matchingOption ? matchingOption.id : 'other')
      if (!matchingOption) {
        setCustomReciprocalRelationship(suggested)
      }
    } else if (selectedRelationship === 'other') {
      setReciprocalRelationship('other')
      setCustomReciprocalRelationship('')
    }
  }, [selectedRelationship])

  const handleSelectPatron = (patron) => {
    setSelectedPatron(patron)
    setStep('assign')
    setError('')
  }

  // Select a household suggestion and pre-fill relationship if one exists
  const handleSelectSuggestion = (patron) => {
    setSelectedPatron(patron)
    setStep('assign')
    setError('')

    // Check if a household relationship already exists
    const existingRel = findExistingRelationship(patron.id)
    if (existingRel) {
      // Relationship already exists — hide the create checkbox, show info instead
      const otherGender = patron.gender || getPatronById(patron.id)?.gender || null
      const label = getDisplayRole(existingRel.category, patron.id, existingRel, otherGender)
      setHasExistingRelationship(true)
      setExistingRelLabel(label)
      setCreateRelationship(false)

      // Pre-fill role labels from existing relationship
      const primaryGender = currentPatronData?.gender || null
      const primaryLabel = getDisplayRole(existingRel.category, primaryPatronId, existingRel, primaryGender)
      const primaryMatch = relationshipRoleOptions.find(r => r.id === primaryLabel)
      setSelectedRelationship(primaryMatch ? primaryMatch.id : 'other')
      if (!primaryMatch) setCustomRelationship(primaryLabel)
      const otherMatch = relationshipRoleOptions.find(r => r.id === label)
      setReciprocalRelationship(otherMatch ? otherMatch.id : 'other')
      if (!otherMatch) setCustomReciprocalRelationship(label)
    } else {
      setHasExistingRelationship(false)
      setExistingRelLabel('')
    }
  }

  const handleCreateNew = () => {
    setStep('create')
    setError('')
  }

  const handleBackToSearch = () => {
    setStep('search')
    setSelectedPatron(null)
    setError('')
  }

  const handleNewPatronSubmit = () => {
    if (!newPatron.firstName.trim() || !newPatron.lastName.trim()) {
      setError('First name and last name are required')
      return
    }
    if (!newPatron.email?.trim()) {
      setError('Email is required')
      return
    }
    
    // Create the patron
    const createdPatron = addPatron(newPatron)
    setSelectedPatron({
      id: createdPatron.id,
      firstName: createdPatron.firstName,
      lastName: createdPatron.lastName,
      name: `${createdPatron.firstName} ${createdPatron.lastName}`,
      email: createdPatron.email
    })
    setStep('assign')
    setError('')
  }

  // Check whether we need a household creation step
  const needsHouseholdCreation = () => {
    if (!createRelationship || !selectedPatron) return false
    const currentPatron = getPatronById(primaryPatronId)
    const otherPatron = getPatronById(selectedPatron.id)
    return !currentPatron?.householdId && !otherPatron?.householdId
  }

  // Get current patron data for the household step UI
  const currentPatronData = primaryPatronId ? getPatronById(primaryPatronId) : null

  const handleAssignSubmit = () => {
    if (!selectedMembershipRole) {
      setError('Please select a membership role')
      return
    }

    if (createRelationship && !selectedRelationship) {
      setError('Please select a relationship role or uncheck the household relationship option')
      return
    }

    // If creating a household relationship and neither patron has a household,
    // redirect to the household creation step
    if (needsHouseholdCreation()) {
      const lastName = currentPatronData?.lastName || primaryPatronName?.split(' ').pop() || ''
      setHouseholdName(`${lastName} Family`)
      setSelectedHead(primaryPatronId)
      setStep('household')
      setError('')
      return
    }

    submitBeneficiary()
  }

  const handleBackToAssign = () => {
    setStep('assign')
    setError('')
  }

  // Shared submit logic — adds beneficiary and optionally creates the relationship
  const submitBeneficiary = (relationship = undefined) => {
    setIsLoading(true)
    setError('')

    // Build relationship object: map role label → category + patron ordering
    if (relationship === undefined) {
      if (createRelationship && selectedRelationship) {
        const resolvedRole = selectedRelationship === 'other' ? customRelationship.trim() : selectedRelationship
        const mapping = ROLE_TO_CATEGORY[resolvedRole]
        const category = mapping?.category || 'custom'
        const customLabels = selectedRelationship === 'other'
          ? { patron1: customRelationship.trim(), patron2: customReciprocalRelationship.trim() }
          : null

        // Determine patron ordering: selectedRelationship describes the PRIMARY patron.
        // If mapping.side === 1, primary is patron1. If side === 2, primary is patron2.
        const primaryIsSide1 = !mapping?.side || mapping.side === 1
        const p1 = primaryIsSide1 ? primaryPatronId : selectedPatron.id
        const p2 = primaryIsSide1 ? selectedPatron.id : primaryPatronId

        relationship = {
          create: true,
          category,
          customLabels,
          patron1Id: p1,
          patron2Id: p2,
        }
      } else {
        relationship = null
      }
    }

    const result = addBeneficiaryToMembership(
      membershipId,
      selectedPatron.id,
      selectedMembershipRole,
      relationship
    )

    setIsLoading(false)

    if (result.success) {
      onSuccess && onSuccess(result.beneficiary)
      onClose()
    } else {
      setError(result.error || 'Failed to add beneficiary')
    }
  }

  // Handle household creation step submit
  const handleHouseholdSubmit = () => {
    if (!householdName.trim()) {
      setError('Please enter a household name')
      return
    }

    setIsLoading(true)
    setError('')

    const resolvedRole = selectedRelationship === 'other' ? customRelationship.trim() : selectedRelationship
    const mapping = ROLE_TO_CATEGORY[resolvedRole]
    const category = mapping?.category || 'custom'
    const customLabels = selectedRelationship === 'other'
      ? { patron1: customRelationship.trim(), patron2: customReciprocalRelationship.trim() }
      : null

    try {
      // Determine head vs other patron
      const headId = selectedHead
      const otherId = headId === primaryPatronId ? selectedPatron.id : primaryPatronId
      // Derive a structural member role for the "other" member
      const resolvedReciprocal = reciprocalRelationship === 'other' ? customReciprocalRelationship.trim() : reciprocalRelationship
      const otherMemberRole = headId === primaryPatronId ? resolvedReciprocal : resolvedRole

      // Create the household first — this sets householdId on both patrons
      createHousehold(headId, otherId, householdName.trim(), otherMemberRole)

      // Determine patron ordering
      const primaryIsSide1 = !mapping?.side || mapping.side === 1
      const p1 = primaryIsSide1 ? primaryPatronId : selectedPatron.id
      const p2 = primaryIsSide1 ? selectedPatron.id : primaryPatronId

      // Now add the beneficiary with the relationship
      const relationship = {
        create: true,
        category,
        customLabels,
        patron1Id: p1,
        patron2Id: p2,
      }

      setIsLoading(false)
      submitBeneficiary(relationship)
    } catch (err) {
      setIsLoading(false)
      setError('Failed to create household')
    }
  }

  if (!isOpen) return null

  return (
    <div className="add-beneficiary-modal__overlay" onClick={onClose}>
      <div className="add-beneficiary-modal" onClick={e => e.stopPropagation()}>
        <div className="add-beneficiary-modal__header">
          <h2 className="add-beneficiary-modal__title">
            {step === 'search' && 'Add beneficiary'}
            {step === 'create' && 'Create new patron'}
            {step === 'assign' && 'Assign role'}
            {step === 'household' && 'Create household'}
          </h2>
          <button className="add-beneficiary-modal__close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="add-beneficiary-modal__content">
          {/* Step 1: Search */}
          {step === 'search' && (
            <>
              {/* Household member suggestions */}
              {householdSuggestions.length > 0 && (
                <div className="add-beneficiary-modal__suggestions">
                  <div className="add-beneficiary-modal__suggestions-label">
                    <i className="fa-solid fa-house-chimney"></i>
                    Household members
                  </div>
                  <ul className="add-beneficiary-modal__suggestions-list">
                    {householdSuggestions.map(patron => (
                      <li
                        key={patron.id}
                        className="add-beneficiary-modal__suggestion-item"
                        onClick={() => handleSelectSuggestion(patron)}
                      >
                        <div className="add-beneficiary-modal__result-avatar">
                          {patron.photo ? (
                            <img src={patron.photo} alt={patron.name} />
                          ) : (
                            <span>{getInitials(patron.name)}</span>
                          )}
                        </div>
                        <div className="add-beneficiary-modal__result-info">
                          <span className="add-beneficiary-modal__result-name">{patron.name}</span>
                          <span className="add-beneficiary-modal__result-meta">
                            {patron.householdRole && (
                              <span className="add-beneficiary-modal__suggestion-role">{patron.householdRole}</span>
                            )}
                            {patron.email && <>{patron.householdRole ? ' · ' : ''}{patron.email}</>}
                          </span>
                        </div>
                        <button className="add-beneficiary-modal__result-add">
                          Add
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="add-beneficiary-modal__description">
                {householdSuggestions.length > 0
                  ? 'Or search for another patron.'
                  : 'Search for an existing patron or create a new one.'}
              </p>

              <div className="add-beneficiary-modal__search">
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
                <div className="add-beneficiary-modal__results">
                  <div className="add-beneficiary-modal__results-label">Results</div>
                  <ul className="add-beneficiary-modal__results-list">
                    {searchResults.map(patron => (
                      <li 
                        key={patron.id} 
                        className="add-beneficiary-modal__result-item"
                        onClick={() => handleSelectPatron(patron)}
                      >
                        <div className="add-beneficiary-modal__result-avatar">
                          {patron.photo ? (
                            <img src={patron.photo} alt={patron.name} />
                          ) : (
                            <span>{getInitials(patron.name)}</span>
                          )}
                        </div>
                        <div className="add-beneficiary-modal__result-info">
                          <span className="add-beneficiary-modal__result-name">{patron.name}</span>
                          <span className="add-beneficiary-modal__result-meta">
                            {patron.email || 'No email'}
                            {patron.hasMembership && ' • Has membership'}
                          </span>
                        </div>
                        <button className="add-beneficiary-modal__result-add">
                          Add
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {searchQuery.length >= 2 && searchResults.length === 0 && (
                <div className="add-beneficiary-modal__no-results">
                  <p>No patrons found matching "{searchQuery}"</p>
                </div>
              )}

              <div className="add-beneficiary-modal__divider">
                <span>or</span>
              </div>

              <button 
                className="add-beneficiary-modal__create-btn"
                onClick={handleCreateNew}
              >
                Create new patron
              </button>
            </>
          )}

          {/* Step 2: Create New Patron */}
          {step === 'create' && (
            <>
              <button className="add-beneficiary-modal__back" onClick={handleBackToSearch}>
                <i className="fa-solid fa-arrow-left"></i>
                Back to search
              </button>

              <div className="add-beneficiary-modal__form">
                <div className="add-beneficiary-modal__form-row">
                  <div className="add-beneficiary-modal__form-field">
                    <label>First Name *</label>
                    <input
                      type="text"
                      value={newPatron.firstName}
                      onChange={e => setNewPatron({ ...newPatron, firstName: e.target.value })}
                      placeholder="First name"
                    />
                  </div>
                  <div className="add-beneficiary-modal__form-field">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      value={newPatron.lastName}
                      onChange={e => setNewPatron({ ...newPatron, lastName: e.target.value })}
                      placeholder="Last name"
                    />
                  </div>
                </div>

                <div className="add-beneficiary-modal__form-row">
                  <div className="add-beneficiary-modal__form-field">
                    <label>Email <span style={{ color: 'var(--color-error, #dc3545)' }}>*</span></label>
                    <input
                      type="email"
                      value={newPatron.email}
                      onChange={e => setNewPatron({ ...newPatron, email: e.target.value })}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="add-beneficiary-modal__form-field">
                    <label>Date of Birth</label>
                    <input
                      type="date"
                      value={newPatron.dateOfBirth}
                      onChange={e => setNewPatron({ ...newPatron, dateOfBirth: e.target.value })}
                    />
                    <span className="add-beneficiary-modal__field-hint">Used for age-out tracking</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="add-beneficiary-modal__error">
                  <i className="fa-solid fa-exclamation-circle"></i>
                  {error}
                </div>
              )}

              <div className="add-beneficiary-modal__actions">
                <button className="add-beneficiary-modal__cancel" onClick={onClose}>
                  Cancel
                </button>
                <button 
                  className="add-beneficiary-modal__submit"
                  onClick={handleNewPatronSubmit}
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {/* Step 3: Assign Role */}
          {step === 'assign' && selectedPatron && (
            <>
              <button className="add-beneficiary-modal__back" onClick={handleBackToSearch}>
                <i className="fa-solid fa-arrow-left"></i>
                Back to search
              </button>

              <div className="add-beneficiary-modal__selected">
                <div className="add-beneficiary-modal__selected-avatar">
                  {selectedPatron.photo ? (
                    <img src={selectedPatron.photo} alt={selectedPatron.name} />
                  ) : (
                    <span>{getInitials(selectedPatron.name)}</span>
                  )}
                </div>
                <div className="add-beneficiary-modal__selected-info">
                  <span className="add-beneficiary-modal__selected-label">Adding:</span>
                  <span className="add-beneficiary-modal__selected-name">{selectedPatron.name}</span>
                  {selectedPatron.email && (
                    <span className="add-beneficiary-modal__selected-email">{selectedPatron.email}</span>
                  )}
                </div>
              </div>

              {/* Membership Role (required) */}
              <div className="add-beneficiary-modal__role-section">
                <label className="add-beneficiary-modal__role-label">
                  Add as:
                </label>
                <div className="add-beneficiary-modal__role-options">
                  {membershipRoleOptions.map(role => (
                    <label key={role.id} className="add-beneficiary-modal__role-option">
                      <input
                        type="radio"
                        name="membershipRole"
                        value={role.id}
                        checked={selectedMembershipRole === role.id}
                        onChange={e => setSelectedMembershipRole(e.target.value)}
                      />
                      <span>{role.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Household Relationship */}
              {hasExistingRelationship ? (
                <div className="add-beneficiary-modal__existing-relationship">
                  <i className="fa-solid fa-house-chimney"></i>
                  <span>Household relationship already exists ({existingRelLabel})</span>
                </div>
              ) : (
                <label className="add-beneficiary-modal__checkbox">
                  <input
                    type="checkbox"
                    checked={createRelationship}
                    onChange={e => setCreateRelationship(e.target.checked)}
                  />
                  <span className="add-beneficiary-modal__checkbox-text">
                    <strong>Also create household relationship</strong>
                    <small>Links these patrons in CRM for gift crediting</small>
                  </span>
                </label>
              )}

              {!hasExistingRelationship && createRelationship && (
                <div className="add-beneficiary-modal__relationship-pair">
                  {/* Primary patron's role */}
                  <div className="add-beneficiary-modal__relationship-field">
                    <label className="add-beneficiary-modal__relationship-label">
                      {primaryPatronName || 'Primary member'} is {selectedPatron?.name || 'new patron'}'s:
                    </label>
                    <select
                      className="add-beneficiary-modal__relationship-select"
                      value={selectedRelationship}
                      onChange={e => setSelectedRelationship(e.target.value)}
                    >
                      <option value="">Select role...</option>
                      {relationshipRoleOptions.map(r => (
                        <option key={r.id} value={r.id}>{r.label}</option>
                      ))}
                    </select>

                    {/* Custom role input */}
                    {selectedRelationship === 'other' && (
                      <input
                        type="text"
                        className="add-beneficiary-modal__custom-role"
                        placeholder={`${primaryPatronName || 'Primary member'}'s role`}
                        value={customRelationship}
                        onChange={e => setCustomRelationship(e.target.value)}
                        style={{ marginTop: '4px' }}
                      />
                    )}
                  </div>

                  {/* Reciprocal role (auto-suggested) */}
                  {selectedRelationship && (
                    <div className="add-beneficiary-modal__relationship-field">
                      <label className="add-beneficiary-modal__relationship-label">
                        {selectedPatron?.name || 'New patron'} is {primaryPatronName || 'primary member'}'s:
                      </label>
                      <select
                        className="add-beneficiary-modal__relationship-select"
                        value={reciprocalRelationship}
                        onChange={e => setReciprocalRelationship(e.target.value)}
                      >
                        <option value="">Select role...</option>
                        {relationshipRoleOptions.map(r => (
                          <option key={r.id} value={r.id}>{r.label}</option>
                        ))}
                      </select>

                      {/* Custom reciprocal input */}
                      {reciprocalRelationship === 'other' && (
                        <input
                          type="text"
                          className="add-beneficiary-modal__custom-role"
                          placeholder={`${selectedPatron?.name || 'New patron'}'s role`}
                          value={customReciprocalRelationship}
                          onChange={e => setCustomReciprocalRelationship(e.target.value)}
                          style={{ marginTop: '4px' }}
                        />
                      )}
                    </div>
                  )}
                </div>
              )}

              {error && (
                <div className="add-beneficiary-modal__error">
                  <i className="fa-solid fa-exclamation-circle"></i>
                  {error}
                </div>
              )}

              <div className="add-beneficiary-modal__actions">
                <button className="add-beneficiary-modal__cancel" onClick={onClose}>
                  Cancel
                </button>
                <button 
                  className="add-beneficiary-modal__submit"
                  onClick={handleAssignSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? 'Adding...' : (needsHouseholdCreation() ? 'Continue' : 'Add as beneficiary')}
                </button>
              </div>
            </>
          )}

          {/* Step 4: Create Household (when neither patron has one) */}
          {step === 'household' && (
            <>
              <button className="add-beneficiary-modal__back" onClick={handleBackToAssign}>
                <i className="fa-solid fa-arrow-left"></i>
                Back
              </button>

              <p className="add-beneficiary-modal__description">
                Neither <strong>{primaryPatronName}</strong> nor <strong>{selectedPatron?.name}</strong> belongs to a household yet. Create one to group them together.
              </p>

              {/* Household name */}
              <div className="add-beneficiary-modal__hh-field">
                <label className="add-beneficiary-modal__hh-label">Household name</label>
                <input
                  type="text"
                  className="add-beneficiary-modal__hh-input"
                  value={householdName}
                  onChange={e => setHouseholdName(e.target.value)}
                  placeholder="e.g. Anderson Family"
                />
              </div>

              {/* Head of household selector */}
              <div className="add-beneficiary-modal__hh-field">
                <label className="add-beneficiary-modal__hh-label">Head of household</label>
                <p className="add-beneficiary-modal__hh-hint">
                  Select the primary contact for this household.
                </p>
                <div className="add-beneficiary-modal__hh-member-list">
                  {/* Primary patron */}
                  <label className={`add-beneficiary-modal__hh-member ${selectedHead === primaryPatronId ? 'add-beneficiary-modal__hh-member--selected' : ''}`}>
                    <input
                      type="radio"
                      name="head-of-household"
                      className="add-beneficiary-modal__hh-radio"
                      checked={selectedHead === primaryPatronId}
                      onChange={() => setSelectedHead(primaryPatronId)}
                    />
                    <div className="add-beneficiary-modal__hh-avatar">
                      {currentPatronData?.photo ? (
                        <img src={currentPatronData.photo} alt={primaryPatronName} />
                      ) : (
                        <span>{getInitials(primaryPatronName)}</span>
                      )}
                    </div>
                    <span className="add-beneficiary-modal__hh-name">{primaryPatronName}</span>
                  </label>

                  {/* Selected patron */}
                  <label className={`add-beneficiary-modal__hh-member ${selectedHead === selectedPatron?.id ? 'add-beneficiary-modal__hh-member--selected' : ''}`}>
                    <input
                      type="radio"
                      name="head-of-household"
                      className="add-beneficiary-modal__hh-radio"
                      checked={selectedHead === selectedPatron?.id}
                      onChange={() => setSelectedHead(selectedPatron?.id)}
                    />
                    <div className="add-beneficiary-modal__hh-avatar">
                      {selectedPatron?.photo ? (
                        <img src={selectedPatron.photo} alt={selectedPatron.name} />
                      ) : (
                        <span>{getInitials(selectedPatron?.name || '')}</span>
                      )}
                    </div>
                    <span className="add-beneficiary-modal__hh-name">{selectedPatron?.name}</span>
                  </label>
                </div>
              </div>

              {error && (
                <div className="add-beneficiary-modal__error">
                  <i className="fa-solid fa-exclamation-circle"></i>
                  {error}
                </div>
              )}

              <div className="add-beneficiary-modal__actions">
                <button className="add-beneficiary-modal__cancel" onClick={onClose}>
                  Cancel
                </button>
                <button
                  className="add-beneficiary-modal__submit"
                  onClick={handleHouseholdSubmit}
                  disabled={isLoading || !householdName.trim()}
                >
                  {isLoading ? 'Creating...' : 'Create household & add'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AddBeneficiaryModal
