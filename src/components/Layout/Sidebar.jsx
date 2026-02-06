import './Sidebar.css'

const getMenuItems = (activePage) => [
  { icon: 'fa-calendar', label: 'Events', hasSubmenu: true },
  { icon: 'fa-tower-broadcast', label: 'Channels', hasSubmenu: true },
  { icon: 'fa-id-card', label: 'Memberships', hasSubmenu: true },
  { 
    icon: 'fa-hand-holding-heart', 
    label: 'Fundraising', 
    hasSubmenu: true,
    expanded: true,
    submenu: [
      { label: 'Dashboard', page: 'dashboard', active: activePage === 'dashboard' },
      // 'patrons' is the list view, 'patron' is the detail view - both should highlight Patrons
      { label: 'Patrons', page: 'patrons', active: activePage === 'patrons' || activePage === 'patron' },
      { label: 'Opportunities', page: 'opportunities', active: activePage === 'opportunities' || activePage === 'opportunity' },
      { label: 'Pipeline', page: 'pipeline', active: activePage === 'pipeline' },
      { label: 'Campaigns', page: 'campaigns', active: activePage === 'campaigns' },
      { label: 'Donation Prompts', href: '#' },
      { label: 'Donation Pages', href: '#' },
      { label: 'Settings', page: 'settings', active: activePage === 'settings' },
    ]
  },
  { icon: 'fa-chart-line', label: 'Report', href: '#' },
  { icon: 'fa-boxes-stacked', label: 'Inventory', hasSubmenu: true },
  { icon: 'fa-qrcode', label: 'Validation', hasSubmenu: true },
  { icon: 'fa-shopping-cart', label: 'Orders', hasSubmenu: true },
  { icon: 'fa-bullhorn', label: 'Marketing', hasSubmenu: true },
  { icon: 'fa-cash-register', label: 'Box Office', hasSubmenu: true },
  { icon: 'fa-calendar-check', label: 'Reservations', hasSubmenu: true },
  { icon: 'fa-sack-dollar', label: 'Finance', hasSubmenu: true },
  { icon: 'fa-gear', label: 'Settings', hasSubmenu: true },
  { icon: 'fa-building', label: 'Organizations', hasSubmenu: true },
]

function Sidebar({ collapsed, activePage = 'patron', onNavigate }) {
  const menuItems = getMenuItems(activePage)
  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      <nav className="sidebar__nav">
        <ul className="sidebar__menu">
          {menuItems.map((item, index) => (
            <li key={index} className="sidebar__item">
              <a 
                href={item.href || '#'} 
                className={`sidebar__link ${item.expanded ? 'sidebar__link--expanded' : ''}`}
              >
                <i className={`fa-solid ${item.icon} sidebar__icon`}></i>
                {!collapsed && (
                  <>
                    <span className="sidebar__label">{item.label}</span>
                    {item.hasSubmenu && (
                      <i className={`fa-solid fa-chevron-${item.expanded ? 'down' : 'right'} sidebar__arrow`}></i>
                    )}
                  </>
                )}
              </a>
              
              {item.expanded && item.submenu && !collapsed && (
                <ul className="sidebar__submenu">
                  {item.submenu.map((subitem, subindex) => (
                    <li key={subindex} className="sidebar__subitem">
                      <a 
                        href={subitem.href || '#'}
                        className={`sidebar__sublink ${subitem.active ? 'sidebar__sublink--active' : ''}`}
                        onClick={(e) => {
                          if (subitem.page && onNavigate) {
                            e.preventDefault()
                            onNavigate(subitem.page)
                          }
                        }}
                      >
                        {subitem.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        
        <div className="sidebar__bottom">
          <a href="#" className="sidebar__link sidebar__link--logout">
            <i className="fa-solid fa-arrow-right-from-bracket sidebar__icon"></i>
            {!collapsed && <span className="sidebar__label">Log out</span>}
          </a>
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar
