import { useState } from 'react'
import { patronTags, addCustomTag, updateTagLabel, deleteTag, getTagUsageCount } from '../../data/patrons'
import './Settings.css'

function Settings() {
  const [editingTagId, setEditingTagId] = useState(null)
  const [editingLabel, setEditingLabel] = useState('')
  const [newTagLabel, setNewTagLabel] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

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

  return (
    <div className="settings" key={refreshKey}>
      {/* Page Header */}
      <div className="settings__header">
        <div className="settings__breadcrumb">
          <span className="settings__breadcrumb-section">Organization</span>
          <i className="fa-solid fa-chevron-right settings__breadcrumb-separator"></i>
        </div>
        <h1 className="settings__title">Settings</h1>
      </div>

      {/* Main Content */}
      <div className="settings__container">
        {/* Navigation Sidebar */}
        <nav className="settings__nav">
          <a href="#tags" className="settings__nav-item settings__nav-item--active">
            <i className="fa-solid fa-tags"></i>
            Tags
          </a>
          <a href="#general" className="settings__nav-item settings__nav-item--disabled">
            <i className="fa-solid fa-gear"></i>
            General
          </a>
          <a href="#users" className="settings__nav-item settings__nav-item--disabled">
            <i className="fa-solid fa-users"></i>
            Users
          </a>
          <a href="#integrations" className="settings__nav-item settings__nav-item--disabled">
            <i className="fa-solid fa-plug"></i>
            Integrations
          </a>
        </nav>

        {/* Content Area */}
        <div className="settings__content">
          {/* Tags Section */}
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
                <i className="fa-solid fa-plus"></i>
                Create Tag
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
        </div>
      </div>
    </div>
  )
}

export default Settings
