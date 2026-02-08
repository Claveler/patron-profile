import { useState, useEffect, useRef } from 'react'
import { searchPatrons, addPatronRelationship, getReciprocalRole, patronRelationships } from '../../data/patrons'
import { getInitials } from '../../utils/getInitials'
import './AddRelationshipModal.css'

// Relationship type categories
const relationshipTypes = [
  { id: 'household', label: 'Household / Family', icon: 'fa-solid fa-house-chimney', description: 'Spouse, child, parent, sibling' },
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
  professional: [
    { id: 'Financial Advisor', label: 'Financial Advisor' },
    { id: 'Client', label: 'Client' },
    { id: 'Attorney', label: 'Attorney' },
    { id: 'Accountant', label: 'Accountant' },
    { id: 'Colleague', label: 'Colleague' },
    { id: 'Friend', label: 'Friend' },
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
}) {
  const [step, setStep] = useState('type') // 'type' | 'contact' | 'roles'
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

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const searchInputRef = useRef(null)

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

  // Auto-suggest reciprocal when role changes
  useEffect(() => {
    if (selectedRole && selectedRole !== 'other') {
      const suggested = getReciprocalRole(selectedRole)
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
    setStep('roles')
    setError('')
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

  const handleSubmit = () => {
    if (!selectedRole) {
      setError('Please select a role')
      return
    }
    if (selectedRole === 'other' && !customRole.trim()) {
      setError('Please enter the role')
      return
    }

    setIsLoading(true)
    setError('')

    const resolvedRole = selectedRole === 'other' ? customRole.trim() : selectedRole
    const resolvedReciprocal = reciprocalRole === 'other'
      ? customReciprocalRole.trim()
      : reciprocalRole

    try {
      if (selectedPatron) {
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
            {step === 'roles' && 'Define relationship'}
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

              {/* Toggle between search and external */}
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
                  {isLoading ? 'Saving...' : 'Add relationship'}
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
