import './Beneficiaries.css'

// Role icons mapping
const roleIcons = {
  'Primary': 'fa-star',
  'Spouse': 'fa-heart',
  'Child': 'fa-child',
  'Guest': 'fa-user-plus',
  'Parent': 'fa-user',
  'Daughter': 'fa-child',
  'Son': 'fa-child',
  'Partner': 'fa-heart',
  'default': 'fa-user'
}

function Beneficiaries({ 
  beneficiaries,
  currentPatronId,
  isPrimary = true,
  slotInfo,
  onNavigateToPatron,
  onAddBeneficiary,
  onRemoveBeneficiary
}) {
  if (!beneficiaries || beneficiaries.length === 0) return null
  
  const getRoleIcon = (role) => roleIcons[role] || roleIcons.default
  
  // Get initials from name
  const getInitials = (name) => {
    if (!name) return '??'
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

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
        roleLabel: b.roleLabel,
        isCurrentPatron: b.patronId === currentPatronId,
        isPrimaryRole: b.role === 'primary'
      }
    }
    // Legacy format: direct properties
    return {
      id: b.id,
      patronId: null,
      name: b.name,
      email: null,
      photo: b.avatar,
      role: b.role?.toLowerCase() === 'primary' ? 'primary' : 'beneficiary',
      roleLabel: b.role,
      isCurrentPatron: false,
      isPrimaryRole: b.role === 'Primary'
    }
  })

  const handleBeneficiaryClick = (beneficiary) => {
    if (beneficiary.patronId && onNavigateToPatron) {
      onNavigateToPatron(beneficiary.patronId)
    }
  }

  const handleRemove = (e, beneficiary) => {
    e.stopPropagation()
    if (onRemoveBeneficiary) {
      onRemoveBeneficiary(beneficiary)
    }
  }

  // Slot info display
  const slotDisplay = slotInfo 
    ? `${slotInfo.used}/${slotInfo.limit === 'unlimited' ? '∞' : slotInfo.limit} slots`
    : `${beneficiaries.length} people`
  
  return (
    <div className="beneficiaries wrapper-card">
      <div className="beneficiaries__header">
        <h4 className="beneficiaries__title">Beneficiaries</h4>
        <span className="beneficiaries__count">{slotDisplay}</span>
      </div>
      
      <ul className="beneficiaries__list">
        {normalizedBeneficiaries.map((person) => (
          <li 
            key={person.id} 
            className={`beneficiaries__item ${person.patronId ? 'beneficiaries__item--clickable' : ''}`}
            onClick={() => handleBeneficiaryClick(person)}
          >
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
                  <span className="beneficiaries__you-badge">You</span>
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
              {isPrimary && !person.isPrimaryRole && onRemoveBeneficiary && (
                <button 
                  className="beneficiaries__remove-btn"
                  onClick={(e) => handleRemove(e, person)}
                  title="Remove beneficiary"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>
          </li>
        ))}
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
