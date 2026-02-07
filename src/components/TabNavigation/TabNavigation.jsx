import { getStaffNameById } from '../../data/campaigns'
import './TabNavigation.css'

function TabNavigation({ tabs, activeTab, onTabChange, assignedToId, onAssign }) {
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
      
      {assignedToId ? (
        <div className="tab-navigation__assigned">
          <span className="tab-navigation__assigned-label">Assigned To:</span>
          <a href="#" className="tab-navigation__assigned-link">
            {getStaffNameById(assignedToId)}
            <i className="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
        </div>
      ) : onAssign && (
        <div className="tab-navigation__assigned">
          <span className="tab-navigation__assigned-label">Assigned To:</span>
          <button className="tab-navigation__assign-btn" onClick={onAssign}>
            Assign
          </button>
        </div>
      )}
    </div>
  )
}

export default TabNavigation
