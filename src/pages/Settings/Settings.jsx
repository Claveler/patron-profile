import { useState } from 'react'
import { patronTags, addCustomTag, updateTagLabel, deleteTag, getTagUsageCount, computedTagRules, updateComputedTagThreshold } from '../../data/patrons'
import './Settings.css'

// Import sources configuration
const IMPORT_SOURCES = [
  {
    id: 'blackbaud',
    name: 'Blackbaud Raiser\'s Edge',
    description: 'Enterprise donor management and fundraising platform',
    icon: 'fa-cloud',
    categories: ['Constituents', 'Gifts', 'Memberships', 'Relationships', 'Activities', 'Opportunities']
  },
  {
    id: 'tessitura',
    name: 'Tessitura',
    description: 'Arts and cultural organization CRM',
    icon: 'fa-theater-masks',
    categories: ['Constituents', 'Contributions', 'Memberships', 'Relationships', 'Activities']
  },
  {
    id: 'csv',
    name: 'CSV / Excel',
    description: 'Universal spreadsheet import for any data source',
    icon: 'fa-file-csv',
    categories: ['Constituents', 'Gifts', 'Memberships', 'Relationships', 'Activities', 'Tags']
  }
]

// Sample field mappings for demo
const SAMPLE_MAPPINGS = [
  { sourceField: 'CONSTITUENT_ID', feverField: 'Patron ID', sample: '12345' },
  { sourceField: 'FIRST_NAME', feverField: 'First Name', sample: 'Anderson' },
  { sourceField: 'LAST_NAME', feverField: 'Last Name', sample: 'Collingwood' },
  { sourceField: 'EMAIL_ADDRESS', feverField: 'Email', sample: 'anderson@collingwood.com' },
  { sourceField: 'PHONE', feverField: 'Phone', sample: '(555) 123-4567' },
  { sourceField: 'ADDRESS_LINE1', feverField: 'Address', sample: '123 Park Avenue' },
  { sourceField: 'GIFT_AMOUNT', feverField: 'Gift Amount', sample: '$1,000.00' },
  { sourceField: 'GIFT_DATE', feverField: 'Gift Date', sample: '12/15/2025' },
  { sourceField: 'FUND_NAME', feverField: 'Fund', sample: 'Annual Operating' },
  { sourceField: 'CAMPAIGN_NAME', feverField: 'Campaign', sample: '2026 Annual Fund' },
]

// Data categories for import
const DATA_CATEGORIES = [
  { id: 'constituents', label: 'Constituents', description: 'Contacts, demographics, addresses' },
  { id: 'giving', label: 'Giving History', description: 'Gifts, pledges, soft credits' },
  { id: 'memberships', label: 'Memberships', description: 'Tiers, benefits, history' },
  { id: 'relationships', label: 'Relationships', description: 'Households, employers' },
  { id: 'activities', label: 'Activities', description: 'Notes, communications' },
  { id: 'opportunities', label: 'Opportunities', description: 'Proposals, pipeline' },
  { id: 'tags', label: 'Tags/Attributes', description: 'Custom fields, segments' },
]

function Settings() {
  // Tags state
  const [editingTagId, setEditingTagId] = useState(null)
  const [editingLabel, setEditingLabel] = useState('')
  const [newTagLabel, setNewTagLabel] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  
  // Import wizard state
  const [activeSection, setActiveSection] = useState('tags')
  const [importStep, setImportStep] = useState(1)
  const [selectedSource, setSelectedSource] = useState(null)
  const [selectedCategories, setSelectedCategories] = useState(
    DATA_CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat.id]: true }), {})
  )

  // Computed tag threshold editing state
  const [editingThresholdId, setEditingThresholdId] = useState(null)
  const [editingThresholdValue, setEditingThresholdValue] = useState('')

  // Force re-render after mutations
  const refresh = () => setRefreshKey(k => k + 1)

  // Separate system and custom tags
  const systemTags = patronTags.filter(t => t.system)
  const customTags = patronTags.filter(t => !t.system)

  // Handle edit start
  const handleStartEdit = (tag) => {
    setEditingTagId(tag.id)
    setEditingLabel(tag.label)
  }

  // Handle save edit
  const handleSaveEdit = () => {
    if (editingLabel.trim() && editingTagId) {
      updateTagLabel(editingTagId, editingLabel.trim())
      setEditingTagId(null)
      setEditingLabel('')
      refresh()
    }
  }

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingTagId(null)
    setEditingLabel('')
  }

  // Handle delete tag
  const handleDeleteTag = (tag) => {
    const usageCount = getTagUsageCount(tag.id)
    const message = usageCount > 0 
      ? `This tag is used by ${usageCount} patron${usageCount > 1 ? 's' : ''}. Are you sure you want to delete "${tag.label}"?`
      : `Are you sure you want to delete "${tag.label}"?`
    
    if (window.confirm(message)) {
      deleteTag(tag.id)
      refresh()
    }
  }

  // Handle create new tag
  const handleCreateTag = () => {
    if (newTagLabel.trim()) {
      addCustomTag(newTagLabel.trim())
      setNewTagLabel('')
      refresh()
    }
  }

  // Handle key press for inputs
  const handleEditKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit()
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  const handleNewTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCreateTag()
    }
  }

  // Render tag row
  const renderTagRow = (tag, isSystem = false) => {
    const usageCount = getTagUsageCount(tag.id)
    const isEditing = editingTagId === tag.id

    return (
      <div key={tag.id} className="settings__tag-row">
        {isEditing ? (
          <div className="settings__tag-edit">
            <input
              type="text"
              className="settings__tag-input"
              value={editingLabel}
              onChange={(e) => setEditingLabel(e.target.value)}
              onKeyDown={handleEditKeyPress}
              autoFocus
            />
            <div className="settings__tag-edit-actions">
              <button 
                className="settings__tag-btn settings__tag-btn--save"
                onClick={handleSaveEdit}
              >
                <i className="fa-solid fa-check"></i>
              </button>
              <button 
                className="settings__tag-btn settings__tag-btn--cancel"
                onClick={handleCancelEdit}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="settings__tag-info">
              <span className="settings__tag-label">{tag.label}</span>
              {isSystem && (
                <span className="settings__tag-badge">System</span>
              )}
            </div>
            <div className="settings__tag-meta">
              <span className="settings__tag-usage">
                {usageCount} patron{usageCount !== 1 ? 's' : ''}
              </span>
              <div className="settings__tag-actions">
                <button 
                  className="settings__tag-btn settings__tag-btn--edit"
                  onClick={() => handleStartEdit(tag)}
                  title="Edit tag"
                >
                  <i className="fa-solid fa-pen"></i>
                </button>
                {!isSystem && (
                  <button 
                    className="settings__tag-btn settings__tag-btn--delete"
                    onClick={() => handleDeleteTag(tag)}
                    title="Delete tag"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  // Handle computed tag threshold editing
  const handleStartThresholdEdit = (rule) => {
    setEditingThresholdId(rule.id)
    setEditingThresholdValue(String(rule.threshold))
  }

  const handleSaveThreshold = () => {
    if (editingThresholdId && editingThresholdValue !== '') {
      updateComputedTagThreshold(editingThresholdId, editingThresholdValue)
      setEditingThresholdId(null)
      setEditingThresholdValue('')
      refresh()
    }
  }

  const handleCancelThreshold = () => {
    setEditingThresholdId(null)
    setEditingThresholdValue('')
  }

  const handleThresholdKeyPress = (e) => {
    if (e.key === 'Enter') handleSaveThreshold()
    else if (e.key === 'Escape') handleCancelThreshold()
  }

  // Format threshold for display
  const formatThreshold = (rule) => {
    if (rule.operator === 'older_than_months') {
      return `${rule.threshold} month${rule.threshold !== 1 ? 's' : ''}`
    }
    return `$${Number(rule.threshold).toLocaleString()}`
  }

  // Format rule description for display
  const formatRuleDescription = (rule) => {
    switch (rule.operator) {
      case '>': return `Lifetime gifts > ${formatThreshold(rule)}`
      case '>=': return `Lifetime gifts \u2265 ${formatThreshold(rule)}`
      case 'older_than_months': return `No gift in ${formatThreshold(rule)}`
      default: return rule.description
    }
  }

  // Render computed tag row
  const renderComputedTagRow = (rule) => {
    const usageCount = getTagUsageCount(rule.id)
    const isEditingThreshold = editingThresholdId === rule.id

    return (
      <div key={rule.id} className="settings__tag-row settings__tag-row--computed">
        <div className="settings__tag-info-block">
          <div className="settings__tag-info">
            <span className="settings__tag-label">{rule.label}</span>
            <span className="settings__tag-badge settings__tag-badge--computed">Computed</span>
          </div>
          <div className="settings__tag-rule">
            {isEditingThreshold ? (
              <div className="settings__tag-threshold-edit">
                <span className="settings__tag-threshold-label">
                  {rule.operator === 'older_than_months' ? 'No gift in' : 'Lifetime gifts \u2265'}
                </span>
                <div className="settings__tag-threshold-input-group">
                  {rule.operator !== 'older_than_months' && (
                    <span className="settings__tag-threshold-prefix">$</span>
                  )}
                  <input
                    type="number"
                    className="settings__tag-threshold-input"
                    value={editingThresholdValue}
                    onChange={(e) => setEditingThresholdValue(e.target.value)}
                    onKeyDown={handleThresholdKeyPress}
                    min="0"
                    autoFocus
                  />
                  {rule.operator === 'older_than_months' && (
                    <span className="settings__tag-threshold-suffix">months</span>
                  )}
                </div>
                <div className="settings__tag-edit-actions">
                  <button 
                    className="settings__tag-btn settings__tag-btn--save"
                    onClick={handleSaveThreshold}
                  >
                    <i className="fa-solid fa-check"></i>
                  </button>
                  <button 
                    className="settings__tag-btn settings__tag-btn--cancel"
                    onClick={handleCancelThreshold}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
            ) : (
              <span className="settings__tag-rule-text">
                {formatRuleDescription(rule)}
              </span>
            )}
          </div>
        </div>
        <div className="settings__tag-meta">
          <span className="settings__tag-usage">
            {usageCount} patron{usageCount !== 1 ? 's' : ''}
          </span>
          {rule.editable && !isEditingThreshold && (
            <div className="settings__tag-actions">
              <button 
                className="settings__tag-btn settings__tag-btn--edit"
                onClick={() => handleStartThresholdEdit(rule)}
                title="Edit threshold"
              >
                <i className="fa-solid fa-sliders"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="settings" key={refreshKey}>
      {/* Page Header */}
      <div className="settings__header">
        <div className="settings__breadcrumb">
          <span className="settings__breadcrumb-section">Fundraising</span>
          <i className="fa-solid fa-chevron-right settings__breadcrumb-separator"></i>
        </div>
        <h1 className="settings__title">Settings</h1>
      </div>

      {/* Main Content */}
      <div className="settings__container">
        <div className="settings__wrapper">
          {/* Navigation Sidebar */}
          <nav className="settings__nav">
          <button 
            className={`settings__nav-item ${activeSection === 'tags' ? 'settings__nav-item--active' : ''}`}
            onClick={() => setActiveSection('tags')}
          >
            Tags
          </button>
          <button 
            className={`settings__nav-item ${activeSection === 'import' ? 'settings__nav-item--active' : ''}`}
            onClick={() => { setActiveSection('import'); setImportStep(1); setSelectedSource(null); }}
          >
            Import Data
          </button>
          <button className="settings__nav-item settings__nav-item--disabled" disabled>
            General
          </button>
          <button className="settings__nav-item settings__nav-item--disabled" disabled>
            Users
          </button>
          <button className="settings__nav-item settings__nav-item--disabled" disabled>
            Integrations
          </button>
        </nav>

        {/* Content Area */}
        <div className="settings__content">
          {/* Tags Section */}
          {activeSection === 'tags' && (
          <section id="tags" className="settings__section">
            <div className="settings__section-header">
              <div>
                <h2 className="settings__section-title">Tags</h2>
                <p className="settings__section-description">
                  Manage tags used for patron segmentation. System tags are predefined and cannot be deleted.
                </p>
              </div>
            </div>

            {/* Create New Tag */}
            <div className="settings__create-tag">
              <input
                type="text"
                className="settings__create-input"
                placeholder="Enter new tag name..."
                value={newTagLabel}
                onChange={(e) => setNewTagLabel(e.target.value)}
                onKeyDown={handleNewTagKeyPress}
              />
              <button 
                className="settings__create-btn"
                onClick={handleCreateTag}
                disabled={!newTagLabel.trim()}
              >
                Create tag
              </button>
            </div>

            {/* System Tags */}
            <div className="settings__tag-group">
              <h3 className="settings__tag-group-title">
                System Tags
                <span className="settings__tag-group-count">{systemTags.length}</span>
              </h3>
              <div className="settings__tag-list">
                {systemTags.map(tag => renderTagRow(tag, true))}
              </div>
            </div>

            {/* Computed Tags */}
            <div className="settings__tag-group">
              <h3 className="settings__tag-group-title">
                Computed Tags
                <span className="settings__tag-group-count">{computedTagRules.length}</span>
              </h3>
              <p className="settings__tag-group-description">
                These tags are automatically assigned based on patron data. Edit thresholds to adjust criteria.
              </p>
              <div className="settings__tag-list">
                {computedTagRules.map(rule => renderComputedTagRow(rule))}
              </div>
            </div>

            {/* Custom Tags */}
            <div className="settings__tag-group">
              <h3 className="settings__tag-group-title">
                Custom Tags
                <span className="settings__tag-group-count">{customTags.length}</span>
              </h3>
              {customTags.length > 0 ? (
                <div className="settings__tag-list">
                  {customTags.map(tag => renderTagRow(tag, false))}
                </div>
              ) : (
                <div className="settings__tag-empty">
                  <p>No custom tags yet. Create one above to get started.</p>
                </div>
              )}
            </div>
          </section>
          )}

          {/* Import Data Section */}
          {activeSection === 'import' && (
          <section id="import" className="settings__section">
            {/* Wizard Step Indicator */}
            <div className="settings__wizard-steps">
              <div className={`settings__wizard-step ${importStep >= 1 ? 'settings__wizard-step--active' : ''} ${importStep > 1 ? 'settings__wizard-step--completed' : ''}`}>
                <span className="settings__wizard-step-number">1</span>
                <span className="settings__wizard-step-label">Select Source</span>
              </div>
              <div className="settings__wizard-step-connector"></div>
              <div className={`settings__wizard-step ${importStep >= 2 ? 'settings__wizard-step--active' : ''} ${importStep > 2 ? 'settings__wizard-step--completed' : ''}`}>
                <span className="settings__wizard-step-number">2</span>
                <span className="settings__wizard-step-label">Upload & Map</span>
              </div>
              <div className="settings__wizard-step-connector"></div>
              <div className={`settings__wizard-step ${importStep >= 3 ? 'settings__wizard-step--active' : ''}`}>
                <span className="settings__wizard-step-number">3</span>
                <span className="settings__wizard-step-label">Preview & Confirm</span>
              </div>
            </div>

            {/* Step 1: Select Source */}
            {importStep === 1 && (
              <div className="settings__import-step">
                <div className="settings__section-header">
                  <div>
                    <h2 className="settings__section-title">Select Import Source</h2>
                    <p className="settings__section-description">
                      Choose the system you want to import data from. We'll help you map your fields to Fever's data model.
                    </p>
                  </div>
                </div>

                <div className="settings__import-sources">
                  {IMPORT_SOURCES.map(source => (
                    <div 
                      key={source.id}
                      className={`settings__source-card ${selectedSource === source.id ? 'settings__source-card--selected' : ''}`}
                      onClick={() => setSelectedSource(source.id)}
                    >
                      <div className="settings__source-card-header">
                        <div className="settings__source-card-icon">
                          <i className={`fa-solid ${source.icon}`}></i>
                        </div>
                        <div className="settings__source-card-info">
                          <h3 className="settings__source-card-name">{source.name}</h3>
                          <p className="settings__source-card-description">{source.description}</p>
                        </div>
                        {selectedSource === source.id && (
                          <div className="settings__source-card-check">
                            <i className="fa-solid fa-check-circle"></i>
                          </div>
                        )}
                      </div>
                      <div className="settings__source-card-categories">
                        <span className="settings__source-card-categories-label">Supported data:</span>
                        <div className="settings__source-card-tags">
                          {source.categories.map(cat => (
                            <span key={cat} className="settings__source-card-tag">{cat}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedSource && (
                  <div className="settings__import-categories">
                    <h3 className="settings__import-categories-title">Select data to import</h3>
                    <div className="settings__import-categories-grid">
                      {DATA_CATEGORIES.map(category => (
                        <label key={category.id} className="settings__import-category">
                          <input
                            type="checkbox"
                            checked={selectedCategories[category.id]}
                            onChange={(e) => setSelectedCategories({
                              ...selectedCategories,
                              [category.id]: e.target.checked
                            })}
                          />
                          <div className="settings__import-category-info">
                            <span className="settings__import-category-label">{category.label}</span>
                            <span className="settings__import-category-description">{category.description}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="settings__import-actions">
                  <button 
                    className="settings__import-btn settings__import-btn--primary"
                    disabled={!selectedSource}
                    onClick={() => setImportStep(2)}
                  >
                    Continue
                    <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Upload & Map */}
            {importStep === 2 && (
              <div className="settings__import-step">
                <div className="settings__section-header">
                  <div>
                    <h2 className="settings__section-title">Upload & Map Fields</h2>
                    <p className="settings__section-description">
                      Upload your export file and map the fields to Fever's data model.
                    </p>
                  </div>
                </div>

                <div className="settings__upload-zone">
                  <div className="settings__upload-zone-content">
                    <i className="fa-solid fa-cloud-arrow-up settings__upload-zone-icon"></i>
                    <p className="settings__upload-zone-text">
                      Drag and drop your file here, or <span className="settings__upload-zone-link">browse</span>
                    </p>
                    <p className="settings__upload-zone-hint">
                      Supports CSV, XLSX, or {IMPORT_SOURCES.find(s => s.id === selectedSource)?.name} export format
                    </p>
                  </div>
                  <div className="settings__upload-zone-file">
                    <i className="fa-solid fa-file-csv"></i>
                    <span className="settings__upload-zone-filename">constituents_export_2026.csv</span>
                    <span className="settings__upload-zone-filesize">2.4 MB</span>
                    <button className="settings__upload-zone-remove">
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                </div>

                <div className="settings__mapping">
                  <h3 className="settings__mapping-title">Field Mapping</h3>
                  <p className="settings__mapping-description">
                    We've automatically mapped fields where possible. Review and adjust as needed.
                  </p>
                  <div className="settings__mapping-table">
                    <div className="settings__mapping-header">
                      <span>Source Field</span>
                      <span></span>
                      <span>Fever Field</span>
                      <span>Sample Data</span>
                    </div>
                    {SAMPLE_MAPPINGS.map((mapping, index) => (
                      <div key={index} className="settings__mapping-row">
                        <span className="settings__mapping-source">{mapping.sourceField}</span>
                        <span className="settings__mapping-arrow">
                          <i className="fa-solid fa-arrow-right"></i>
                        </span>
                        <select className="settings__mapping-select" defaultValue={mapping.feverField}>
                          <option value="">-- Skip this field --</option>
                          <option value="Patron ID">Patron ID</option>
                          <option value="First Name">First Name</option>
                          <option value="Last Name">Last Name</option>
                          <option value="Email">Email</option>
                          <option value="Phone">Phone</option>
                          <option value="Address">Address</option>
                          <option value="Gift Amount">Gift Amount</option>
                          <option value="Gift Date">Gift Date</option>
                          <option value="Fund">Fund</option>
                          <option value="Campaign">Campaign</option>
                        </select>
                        <span className="settings__mapping-sample">{mapping.sample}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="settings__import-actions">
                  <button 
                    className="settings__import-btn settings__import-btn--secondary"
                    onClick={() => setImportStep(1)}
                  >
                    <i className="fa-solid fa-arrow-left"></i>
                    Back
                  </button>
                  <button 
                    className="settings__import-btn settings__import-btn--primary"
                    onClick={() => setImportStep(3)}
                  >
                    Preview Import
                    <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Preview & Confirm */}
            {importStep === 3 && (
              <div className="settings__import-step">
                <div className="settings__section-header">
                  <div>
                    <h2 className="settings__section-title">Preview & Confirm</h2>
                    <p className="settings__section-description">
                      Review the import summary before proceeding. This action cannot be undone.
                    </p>
                  </div>
                </div>

                <div className="settings__preview-stats">
                  <div className="settings__preview-stat">
                    <span className="settings__preview-stat-value">1,247</span>
                    <span className="settings__preview-stat-label">Total Records</span>
                  </div>
                  <div className="settings__preview-stat">
                    <span className="settings__preview-stat-value">892</span>
                    <span className="settings__preview-stat-label">New Patrons</span>
                  </div>
                  <div className="settings__preview-stat">
                    <span className="settings__preview-stat-value">355</span>
                    <span className="settings__preview-stat-label">Updates to Existing</span>
                  </div>
                  <div className="settings__preview-stat">
                    <span className="settings__preview-stat-value">3,421</span>
                    <span className="settings__preview-stat-label">Gifts to Import</span>
                  </div>
                  <div className="settings__preview-stat">
                    <span className="settings__preview-stat-value">234</span>
                    <span className="settings__preview-stat-label">Memberships</span>
                  </div>
                </div>

                <div className="settings__preview-warnings">
                  <div className="settings__preview-warning">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                    <span>12 records are missing email addresses</span>
                  </div>
                  <div className="settings__preview-warning">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                    <span>3 records have invalid phone number formats</span>
                  </div>
                </div>

                <div className="settings__preview-table-container">
                  <h3 className="settings__preview-table-title">Sample Records</h3>
                  <table className="settings__preview-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Lifetime Value</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Anderson Collingwood</td>
                        <td>anderson@collingwood.com</td>
                        <td>$3,222.50</td>
                        <td><span className="settings__preview-badge settings__preview-badge--update">Update</span></td>
                      </tr>
                      <tr>
                        <td>Margaret Williams</td>
                        <td>margaret.w@email.com</td>
                        <td>$15,750.00</td>
                        <td><span className="settings__preview-badge settings__preview-badge--new">New</span></td>
                      </tr>
                      <tr>
                        <td>Robert Chen</td>
                        <td>rchen@business.com</td>
                        <td>$8,500.00</td>
                        <td><span className="settings__preview-badge settings__preview-badge--new">New</span></td>
                      </tr>
                      <tr>
                        <td>Sarah Johnson</td>
                        <td>sarah.j@gmail.com</td>
                        <td>$2,100.00</td>
                        <td><span className="settings__preview-badge settings__preview-badge--update">Update</span></td>
                      </tr>
                      <tr>
                        <td>David Park</td>
                        <td>dpark@company.org</td>
                        <td>$950.00</td>
                        <td><span className="settings__preview-badge settings__preview-badge--new">New</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="settings__import-actions">
                  <button 
                    className="settings__import-btn settings__import-btn--secondary"
                    onClick={() => setImportStep(2)}
                  >
                    <i className="fa-solid fa-arrow-left"></i>
                    Back
                  </button>
                  <button 
                    className="settings__import-btn settings__import-btn--primary settings__import-btn--success"
                    onClick={() => alert('Import preview complete. In production, this would begin the data import process.')}
                  >
                    <i className="fa-solid fa-check"></i>
                    Start Import
                  </button>
                </div>
              </div>
            )}
          </section>
          )}
        </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
