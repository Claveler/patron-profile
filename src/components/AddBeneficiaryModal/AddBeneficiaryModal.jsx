import { useState, useEffect, useRef } from 'react'
import { searchPatrons, addBeneficiaryToMembership, addPatron } from '../../data/patrons'
import './AddBeneficiaryModal.css'

const roleOptions = [
  { id: 'spouse', label: 'Spouse / Partner' },
  { id: 'child', label: 'Child' },
  { id: 'parent', label: 'Parent' },
  { id: 'sibling', label: 'Sibling' },
  { id: 'other', label: 'Other' }
]

function AddBeneficiaryModal({ 
  isOpen, 
  onClose, 
  membershipId,
  primaryPatronName,
  onSuccess 
}) {
  const [step, setStep] = useState('search') // 'search' | 'create' | 'assign'
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedPatron, setSelectedPatron] = useState(null)
  const [selectedRole, setSelectedRole] = useState('')
  const [customRole, setCustomRole] = useState('')
  const [createRelationship, setCreateRelationship] = useState(true)
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

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('search')
      setSearchQuery('')
      setSearchResults([])
      setSelectedPatron(null)
      setSelectedRole('')
      setCustomRole('')
      setCreateRelationship(true)
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

  const handleSelectPatron = (patron) => {
    setSelectedPatron(patron)
    setStep('assign')
    setError('')
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
    if (!selectedRole) {
      setError('Please select a relationship type')
      return
    }

    setIsLoading(true)
    setError('')

    const roleLabel = selectedRole === 'other' ? customRole : 
      roleOptions.find(r => r.id === selectedRole)?.label.split(' /')[0] || selectedRole

    const result = addBeneficiaryToMembership(
      membershipId,
      selectedPatron.id,
      roleLabel,
      createRelationship
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

  const getInitials = (name) => {
    if (!name) return '??'
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="add-beneficiary-modal__overlay" onClick={onClose}>
      <div className="add-beneficiary-modal" onClick={e => e.stopPropagation()}>
        <div className="add-beneficiary-modal__header">
          <h2 className="add-beneficiary-modal__title">
            {step === 'search' && 'Add Beneficiary'}
            {step === 'create' && 'Create New Patron'}
            {step === 'assign' && 'Assign Role'}
          </h2>
          <button className="add-beneficiary-modal__close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="add-beneficiary-modal__content">
          {/* Step 1: Search */}
          {step === 'search' && (
            <>
              <p className="add-beneficiary-modal__description">
                Search for an existing patron or create a new one.
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
                          <i className="fa-solid fa-plus"></i>
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
                <i className="fa-solid fa-plus"></i>
                Create New Patron
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
                    <label>Email</label>
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

              <div className="add-beneficiary-modal__role-section">
                <label className="add-beneficiary-modal__role-label">
                  Relationship to {primaryPatronName || 'primary account holder'}:
                </label>
                <div className="add-beneficiary-modal__role-options">
                  {roleOptions.map(role => (
                    <label key={role.id} className="add-beneficiary-modal__role-option">
                      <input
                        type="radio"
                        name="role"
                        value={role.id}
                        checked={selectedRole === role.id}
                        onChange={e => setSelectedRole(e.target.value)}
                      />
                      <span>{role.label}</span>
                    </label>
                  ))}
                </div>

                {selectedRole === 'other' && (
                  <input
                    type="text"
                    className="add-beneficiary-modal__custom-role"
                    placeholder="Enter relationship type"
                    value={customRole}
                    onChange={e => setCustomRole(e.target.value)}
                  />
                )}
              </div>

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
                  {isLoading ? 'Adding...' : 'Add as Beneficiary'}
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
