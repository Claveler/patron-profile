import './TabNavigation.css'

function TabNavigation({ tabs, activeTab, onTabChange, assignedTo }) {
  return (
    <div className="tab-navigation">
      <div className="tab-navigation__tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-navigation__tab ${activeTab === tab.id ? 'tab-navigation__tab--active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {assignedTo && (
        <div className="tab-navigation__assigned">
          <span className="tab-navigation__assigned-label">Assigned To:</span>
          <span className="tab-navigation__assigned-value">{assignedTo}</span>
          <button className="tab-navigation__assigned-edit" title="Change assignment">
            <i className="fa-solid fa-pen"></i>
          </button>
        </div>
      )}
    </div>
  )
}

export default TabNavigation
