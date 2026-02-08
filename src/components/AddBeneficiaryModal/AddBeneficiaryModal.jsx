import { useState, useEffect, useRef, useMemo } from 'react'
import { searchPatrons, addBeneficiaryToMembership, addPatron, getReciprocalRole, getHouseholdForPatron, getHouseholdMembers, getBeneficiariesByMembershipId, patronRelationships } from '../../data/patrons'
import { getInitials } from '../../utils/getInitials'
import './AddBeneficiaryModal.css'

// Membership roles (entitlement-based)
const membershipRoleOptions = [
  { id: 'additional_adult', label: 'Additional Adult' },
  { id: 'dependent', label: 'Dependent' }
]

// CRM relationship types (personal connections) -- with gendered variants
const relationshipOptions = [
  { id: 'spouse',   label: 'Spouse' },
  { id: 'partner',  label: 'Partner' },
  { id: 'child',    label: 'Child' },
  { id: 'son',      label: 'Son' },
  { id: 'daughter', label: 'Daughter' },
  { id: 'parent',   label: 'Parent' },
  { id: 'father',   label: 'Father' },
  { id: 'mother',   label: 'Mother' },
  { id: 'sibling',  label: 'Sibling' },
  { id: 'brother',  label: 'Brother' },
  { id: 'sister',   label: 'Sister' },
  { id: 'other',    label: 'Other' }
]

function AddBeneficiaryModal({ 
  isOpen, 
  onClose, 
  membershipId,
  primaryPatronId,
  primaryPatronName,
  onSuccess 
}) {
  const [step, setStep] = useState('search') // 'search' | 'create' | 'assign'
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

  // Look up existing relationship between primary patron and a given patron
  const findExistingRelationship = (targetPatronId) => {
    if (!primaryPatronId || !targetPatronId) return null
    return patronRelationships.find(
      r => r.fromPatronId === primaryPatronId
        && r.toPatronId === targetPatronId
        && r.type === 'household'
        && !r.endDate
    ) || null
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

  // Auto-suggest reciprocal when relationship changes
  useEffect(() => {
    if (selectedRelationship && selectedRelationship !== 'other') {
      const label = relationshipOptions.find(r => r.id === selectedRelationship)?.label || selectedRelationship
      const suggested = getReciprocalRole(label)
      // Find matching option ID for the suggested reciprocal
      const matchingOption = relationshipOptions.find(r => r.label === suggested)
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
      setHasExistingRelationship(true)
      setExistingRelLabel(existingRel.role)
      setCreateRelationship(false)

      // Still pre-fill for display purposes
      const matchForward = relationshipOptions.find(r => r.label === existingRel.role)
      const matchReverse = relationshipOptions.find(r => r.label === existingRel.reciprocalRole)

      setSelectedRelationship(matchForward ? matchForward.id : 'other')
      if (!matchForward) setCustomRelationship(existingRel.role)

      setReciprocalRelationship(matchReverse ? matchReverse.id : 'other')
      if (!matchReverse) setCustomReciprocalRelationship(existingRel.reciprocalRole)
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

  const handleAssignSubmit = () => {
    if (!selectedMembershipRole) {
      setError('Please select a membership role')
      return
    }

    if (createRelationship && !selectedRelationship) {
      setError('Please select a relationship type or uncheck the household relationship option')
      return
    }

    setIsLoading(true)
    setError('')

    // Build relationship object with both directions (separate from membership role)
    const resolvedRelationship = selectedRelationship === 'other' 
      ? customRelationship 
      : relationshipOptions.find(r => r.id === selectedRelationship)?.label || selectedRelationship
    const resolvedReciprocal = reciprocalRelationship === 'other'
      ? customReciprocalRelationship
      : relationshipOptions.find(r => r.id === reciprocalRelationship)?.label || reciprocalRelationship

    const relationship = createRelationship ? {
      create: true,
      type: resolvedRelationship,
      reciprocalType: resolvedReciprocal
    } : null

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

  if (!isOpen) return null

  return (
    <div className="add-beneficiary-modal__overlay" onClick={onClose}>
      <div className="add-beneficiary-modal" onClick={e => e.stopPropagation()}>
        <div className="add-beneficiary-modal__header">
          <h2 className="add-beneficiary-modal__title">
            {step === 'search' && 'Add beneficiary'}
            {step === 'create' && 'Create new patron'}
            {step === 'assign' && 'Assign role'}
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
                  {/* Direction A → B */}
                  <div className="add-beneficiary-modal__relationship-field">
                    <label className="add-beneficiary-modal__relationship-label">
                      {selectedPatron.name || 'New patron'} is {primaryPatronName || 'primary member'}'s:
                    </label>
                    <select
                      className="add-beneficiary-modal__relationship-select"
                      value={selectedRelationship}
                      onChange={e => setSelectedRelationship(e.target.value)}
                    >
                      <option value="">Select relationship...</option>
                      {relationshipOptions.map(rel => (
                        <option key={rel.id} value={rel.id}>{rel.label}</option>
                      ))}
                    </select>
                    {selectedRelationship === 'other' && (
                      <input
                        type="text"
                        className="add-beneficiary-modal__custom-role"
                        placeholder="Enter relationship type"
                        value={customRelationship}
                        onChange={e => setCustomRelationship(e.target.value)}
                      />
                    )}
                  </div>

                  {/* Direction B → A (auto-suggested, editable) */}
                  <div className="add-beneficiary-modal__relationship-field">
                    <label className="add-beneficiary-modal__relationship-label">
                      {primaryPatronName || 'Primary member'} is {selectedPatron.name || 'new patron'}'s:
                      {selectedRelationship && (
                        <small className="add-beneficiary-modal__auto-label">auto-suggested</small>
                      )}
                    </label>
                    <select
                      className="add-beneficiary-modal__relationship-select"
                      value={reciprocalRelationship}
                      onChange={e => setReciprocalRelationship(e.target.value)}
                      disabled={!selectedRelationship}
                    >
                      <option value="">Select relationship...</option>
                      {relationshipOptions.map(rel => (
                        <option key={`recip-${rel.id}`} value={rel.id}>{rel.label}</option>
                      ))}
                    </select>
                    {reciprocalRelationship === 'other' && (
                      <input
                        type="text"
                        className="add-beneficiary-modal__custom-role"
                        placeholder="Enter reciprocal relationship type"
                        value={customReciprocalRelationship}
                        onChange={e => setCustomReciprocalRelationship(e.target.value)}
                      />
                    )}
                  </div>
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
                  {isLoading ? 'Adding...' : 'Add as beneficiary'}
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
