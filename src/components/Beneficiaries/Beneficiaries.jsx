import './Beneficiaries.css'

// Role icons mapping
const roleIcons = {
  'Primary': 'fa-star',
  'Spouse': 'fa-heart',
  'Child': 'fa-child',
  'Guest': 'fa-user-plus',
  'Parent': 'fa-user',
  'default': 'fa-user'
}

function Beneficiaries({ beneficiaries }) {
  if (!beneficiaries || beneficiaries.length === 0) return null
  
  const getRoleIcon = (role) => roleIcons[role] || roleIcons.default
  
  // Get initials from name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }
  
  return (
    <div className="beneficiaries wrapper-card">
      <div className="beneficiaries__header">
        <h4 className="beneficiaries__title">Beneficiaries</h4>
        <span className="beneficiaries__count">{beneficiaries.length} people</span>
      </div>
      
      <ul className="beneficiaries__list">
        {beneficiaries.map((person) => (
          <li key={person.id} className="beneficiaries__item">
            <div className="beneficiaries__avatar">
              {person.avatar ? (
                <img src={person.avatar} alt={person.name} />
              ) : (
                <span className="beneficiaries__initials">{getInitials(person.name)}</span>
              )}
            </div>
            <div className="beneficiaries__info">
              <span className="beneficiaries__name">{person.name}</span>
              <span className="beneficiaries__role">
                <i className={`fa-solid ${getRoleIcon(person.role)}`}></i>
                {person.role}
              </span>
            </div>
          </li>
        ))}
      </ul>
      
      <button className="beneficiaries__manage">
        <i className="fa-solid fa-user-plus"></i>
        Manage beneficiaries
      </button>
    </div>
  )
}

export default Beneficiaries
