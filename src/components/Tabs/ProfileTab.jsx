import { useState, useCallback, useMemo, useRef } from 'react'
import { patronSources, PATRON_STATUSES, updatePatron, getOrgRelationships } from '../../data/patrons'
import StatusChangeModal from '../StatusChangeModal/StatusChangeModal'
import { getInitials } from '../../utils/getInitials'
import { useEpicScope } from '../../hooks/useEpicScope'
import './ProfileTab.css'

const PREFIX_OPTIONS = ['', 'Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Rev.', 'Hon.', 'Prof.']
const SUFFIX_OPTIONS = ['', 'Jr.', 'Sr.', 'II', 'III', 'IV', 'V', 'Esq.', 'Ph.D.', 'M.D.']
const GENDER_OPTIONS = ['', 'Male', 'Female', 'Non-binary', 'Prefer not to say']
const MAX_PHOTO_SIZE = 2 * 1024 * 1024 // 2MB

function ProfileTab({ patron, onPatronUpdate, onSwitchTab, onAddRelationship }) {
  const { show } = useEpicScope()
  const [isEditing, setIsEditing] = useState(false)
  const [errors, setErrors] = useState({})
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [photoError, setPhotoError] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  // Build form state from patron data
  const buildFormState = useCallback((p) => ({
    prefix: p.prefix || '',
    firstName: p.firstName || '',
    lastName: p.lastName || '',
    suffix: p.suffix || '',
    preferredName: p.preferredName || '',
    gender: p.gender ? p.gender.charAt(0).toUpperCase() + p.gender.slice(1) : '',
    dateOfBirth: p.dateOfBirth || '',
    email: p.email || '',
    phone: p.phone || '',
    addressStreet: p.addressStreet || '',
    addressCity: p.addressCity || '',
    addressState: p.addressState || '',
    addressZip: p.addressZip || '',
    addressCountry: p.addressCountry || 'United States',
    preferredMethod: p.communicationPreferences?.preferredMethod || 'email',
    emailOptIn: p.communicationPreferences?.emailOptIn !== false,
    phoneOptIn: p.communicationPreferences?.phoneOptIn !== false,
    mailOptIn: p.communicationPreferences?.mailOptIn !== false,
    doNotContact: p.communicationPreferences?.doNotContact || false,
    notes: p.notes || '',
  }), [])

  const [form, setForm] = useState(() => buildFormState(patron))

  // Get source config for display
  const sourceConfig = useMemo(() => 
    patronSources.find(s => s.id === patron.source) || { label: patron.source || 'Unknown', icon: 'fa-question' },
    [patron.source]
  )

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not specified'
    try {
      return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      })
    } catch {
      return dateStr
    }
  }

  // Calculate age from date of birth
  const calculateAge = (dateStr) => {
    if (!dateStr) return null
    const today = new Date()
    const birth = new Date(dateStr + 'T00:00:00')
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
    return age
  }

  // Compose full address from structured fields
  const getDisplayAddress = () => {
    const parts = []
    if (patron.addressStreet) parts.push(patron.addressStreet)
    if (patron.addressCity || patron.addressState || patron.addressZip) {
      const cityStateZip = [
        patron.addressCity,
        patron.addressState ? (patron.addressCity ? `, ${patron.addressState}` : patron.addressState) : '',
        patron.addressZip ? ` ${patron.addressZip}` : ''
      ].join('')
      if (cityStateZip.trim()) parts.push(cityStateZip)
    }
    if (patron.addressCountry && patron.addressCountry !== 'United States') {
      parts.push(patron.addressCountry)
    }
    // Fallback to legacy address field
    if (parts.length === 0 && patron.address) return patron.address
    return parts.join('\n') || 'Not specified'
  }

  // Validation
  const validate = () => {
    const newErrors = {}
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (form.addressZip && !/^\d{5}(-\d{4})?$/.test(form.addressZip)) {
      newErrors.addressZip = 'ZIP code must be 5 or 9 digits (e.g., 94920 or 94920-1234)'
    }
    if (form.dateOfBirth) {
      const dob = new Date(form.dateOfBirth + 'T00:00:00')
      if (dob >= new Date()) newErrors.dateOfBirth = 'Date of birth must be in the past'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle field change
  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    // Clear error on change
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  // Handle toggle change
  const handleToggle = (field) => {
    setForm(prev => {
      const newForm = { ...prev, [field]: !prev[field] }
      // If Do Not Contact is toggled on, disable all channels
      if (field === 'doNotContact' && newForm.doNotContact) {
        newForm.emailOptIn = false
        newForm.phoneOptIn = false
        newForm.mailOptIn = false
      }
      // If any channel is re-enabled, turn off Do Not Contact
      if (field !== 'doNotContact' && newForm[field] && newForm.doNotContact) {
        newForm.doNotContact = false
      }
      return newForm
    })
  }

  // Enter edit mode
  const handleEdit = () => {
    setForm(buildFormState(patron))
    setErrors({})
    setSaveSuccess(false)
    setIsEditing(true)
  }

  // Cancel edit
  const handleCancel = () => {
    setForm(buildFormState(patron))
    setErrors({})
    setIsEditing(false)
  }

  // Save changes
  const handleSave = () => {
    if (!validate()) return

    // Compute the flat address string for backward compatibility
    const addressParts = [form.addressStreet]
    const cityState = [form.addressCity, form.addressState].filter(Boolean).join(', ')
    if (cityState) addressParts.push(`${cityState} ${form.addressZip}`.trim())
    const address = addressParts.filter(Boolean).join(', ') || null

    const updates = {
      prefix: form.prefix || null,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      suffix: form.suffix || null,
      preferredName: form.preferredName.trim() || null,
      gender: form.gender ? form.gender.toLowerCase() : null,
      dateOfBirth: form.dateOfBirth || null,
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      address,
      addressStreet: form.addressStreet.trim() || null,
      addressCity: form.addressCity.trim() || null,
      addressState: form.addressState.trim() || null,
      addressZip: form.addressZip.trim() || null,
      addressCountry: form.addressCountry.trim() || 'United States',
      communicationPreferences: {
        preferredMethod: form.preferredMethod,
        emailOptIn: form.emailOptIn,
        phoneOptIn: form.phoneOptIn,
        mailOptIn: form.mailOptIn,
        doNotContact: form.doNotContact,
      },
      notes: form.notes.trim() || null,
    }

    updatePatron(patron.id, updates)
    if (onPatronUpdate) onPatronUpdate()
    setIsEditing(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  // Copy patron ID
  const [idCopied, setIdCopied] = useState(false)
  const handleCopyId = () => {
    navigator.clipboard.writeText(patron.id)
    setIdCopied(true)
    setTimeout(() => setIdCopied(false), 2000)
  }

  // ─── Photo Handling ───

  const processFile = (file) => {
    setPhotoError(null)
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setPhotoError('Please select an image file (JPEG, PNG, GIF, or WebP)')
      return
    }
    if (file.size > MAX_PHOTO_SIZE) {
      setPhotoError('Image must be smaller than 2MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setPhotoPreview(e.target.result)
    }
    reader.readAsDataURL(file)
  }

  const handleFileSelect = (e) => {
    processFile(e.target.files[0])
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    processFile(e.dataTransfer.files[0])
  }

  const handleRemovePhoto = () => {
    setPhotoPreview(null)
    setPhotoError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSavePhoto = () => {
    updatePatron(patron.id, { photo: photoPreview })
    if (onPatronUpdate) onPatronUpdate()
    setPhotoPreview(null)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handleDeletePhoto = () => {
    updatePatron(patron.id, { photo: null })
    if (onPatronUpdate) onPatronUpdate()
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  // ─── Status Change ───

  const handleStatusChange = () => {
    if (onPatronUpdate) onPatronUpdate()
    setShowStatusModal(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const currentStatusConfig = useMemo(() =>
    PATRON_STATUSES.find(s => s.id === (patron.status || 'active')) || PATRON_STATUSES[0],
    [patron.status]
  )

  // ─── Organization Relationships (source of truth for professional info) ───

  const orgRelationships = useMemo(() => getOrgRelationships(patron.id), [patron.id])

  // ─── Render Helpers ───

  const renderViewField = (label, value, icon) => (
    <div className="profile-tab__field">
      <span className="profile-tab__field-label">
        {icon && <i className={`fa-solid ${icon}`}></i>}
        {label}
      </span>
      <span className={`profile-tab__field-value ${!value || value === 'Not specified' ? 'profile-tab__field-value--empty' : ''}`}>
        {value || 'Not specified'}
      </span>
    </div>
  )

  const renderInput = (field, label, opts = {}) => {
    const { type = 'text', required = false, placeholder = '', half = false } = opts
    return (
      <div className={`profile-tab__form-field ${half ? 'profile-tab__form-field--half' : ''} ${errors[field] ? 'profile-tab__form-field--error' : ''}`}>
        <label className="profile-tab__form-label">
          {label}
          {required && <span className="profile-tab__required">*</span>}
        </label>
        <input
          type={type}
          className="profile-tab__input"
          value={form[field]}
          onChange={(e) => handleChange(field, e.target.value)}
          placeholder={placeholder}
        />
        {errors[field] && <span className="profile-tab__field-error">{errors[field]}</span>}
      </div>
    )
  }

  const renderSelect = (field, label, options, opts = {}) => {
    const { half = false } = opts
    return (
      <div className={`profile-tab__form-field ${half ? 'profile-tab__form-field--half' : ''}`}>
        <label className="profile-tab__form-label">{label}</label>
        <select
          className="profile-tab__select"
          value={form[field]}
          onChange={(e) => handleChange(field, e.target.value)}
        >
          {options.map(opt => (
            <option key={opt} value={opt}>{opt || '—'}</option>
          ))}
        </select>
      </div>
    )
  }

  const renderToggle = (field, label, description) => (
    <div className={`profile-tab__toggle-row ${field === 'doNotContact' ? 'profile-tab__toggle-row--danger' : ''}`}>
      <div className="profile-tab__toggle-info">
        <span className="profile-tab__toggle-label">{label}</span>
        {description && <span className="profile-tab__toggle-desc">{description}</span>}
      </div>
      <button
        type="button"
        className={`profile-tab__toggle ${form[field] ? 'profile-tab__toggle--active' : ''}`}
        onClick={() => handleToggle(field)}
        role="switch"
        aria-checked={form[field]}
      >
        <span className="profile-tab__toggle-knob"></span>
      </button>
    </div>
  )

  // ─── Render ───

  return (
    <div className="profile-tab" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
      {/* Header with Edit/Save/Cancel buttons */}
      <div className="profile-tab__header">
        <div className="profile-tab__header-left">
          <h2 className="profile-tab__title">Profile Details</h2>
          {saveSuccess && (
            <span className="profile-tab__save-success">
              <i className="fa-solid fa-check-circle"></i>
              Changes saved
            </span>
          )}
        </div>
        <div className="profile-tab__header-actions">
          {isEditing ? (
            <>
              <button className="profile-tab__btn profile-tab__btn--cancel" onClick={handleCancel}>
                Cancel
              </button>
              <button className="profile-tab__btn profile-tab__btn--save" onClick={handleSave}>
                <i className="fa-solid fa-check"></i>
                Save Changes
              </button>
            </>
          ) : (
            <button className="profile-tab__btn profile-tab__btn--edit" onClick={handleEdit}>
              <i className="fa-solid fa-pen"></i>
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Validation error banner */}
      {isEditing && Object.keys(errors).length > 0 && (
        <div className="profile-tab__error-banner">
          <i className="fa-solid fa-exclamation-circle"></i>
          Please fix the errors below before saving.
        </div>
      )}

      {/* ─── Photo Section ─── */}
      <div className="profile-tab__photo-section">
        <div className="profile-tab__photo-current">
          {(photoPreview || patron.photo) ? (
            <img 
              src={photoPreview || patron.photo} 
              alt={`${patron.firstName} ${patron.lastName}`}
              className="profile-tab__photo-img"
            />
          ) : (
            <div className="profile-tab__photo-placeholder">
              <span className="profile-tab__photo-initials">
                {getInitials(`${patron.firstName} ${patron.lastName}`)}
              </span>
            </div>
          )}
          {!photoPreview && (
            <button 
              className="profile-tab__photo-overlay"
              onClick={() => fileInputRef.current?.click()}
              title="Change photo"
            >
              <i className="fa-solid fa-camera"></i>
            </button>
          )}
        </div>
        <div className="profile-tab__photo-controls">
          <h3 className="profile-tab__photo-name">{patron.firstName} {patron.lastName}</h3>
          {photoPreview ? (
            <div className="profile-tab__photo-actions">
              <button className="profile-tab__btn profile-tab__btn--save profile-tab__btn--sm" onClick={handleSavePhoto}>
                <i className="fa-solid fa-check"></i>
                Save Photo
              </button>
              <button className="profile-tab__btn profile-tab__btn--cancel profile-tab__btn--sm" onClick={handleRemovePhoto}>
                Cancel
              </button>
            </div>
          ) : (
            <div className="profile-tab__photo-actions">
              <button 
                className="profile-tab__btn profile-tab__btn--cancel profile-tab__btn--sm" 
                onClick={() => fileInputRef.current?.click()}
              >
                <i className="fa-solid fa-upload"></i>
                Upload Photo
              </button>
              {patron.photo && (
                <button 
                  className="profile-tab__btn profile-tab__btn--cancel profile-tab__btn--sm profile-tab__btn--danger-text" 
                  onClick={handleDeletePhoto}
                >
                  <i className="fa-solid fa-trash"></i>
                  Remove
                </button>
              )}
            </div>
          )}
          {photoError && (
            <span className="profile-tab__photo-error">
              <i className="fa-solid fa-exclamation-circle"></i>
              {photoError}
            </span>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileSelect}
            className="profile-tab__photo-input"
          />
          {/* Drop zone overlay (visible in edit mode or when dragging) */}
          {isDragging && (
            <div 
              className="profile-tab__photo-dropzone"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <i className="fa-solid fa-cloud-arrow-up"></i>
              <span>Drop image here</span>
            </div>
          )}
        </div>
      </div>

      {/* ─── Section 1: Personal Information ─── */}
      <div className="profile-tab__section">
        <h3 className="profile-tab__section-title">
          <i className="fa-solid fa-user"></i>
          Personal Information
        </h3>
        {isEditing ? (
          <div className="profile-tab__section-body">
            <div className="profile-tab__form-row profile-tab__form-row--3col">
              {renderSelect('prefix', 'Prefix', PREFIX_OPTIONS, { half: true })}
              {renderInput('firstName', 'First Name', { required: true })}
              {renderInput('lastName', 'Last Name', { required: true })}
            </div>
            <div className="profile-tab__form-row">
              {renderInput('preferredName', 'Preferred Name / Goes By', { placeholder: 'e.g., Andy' })}
              {renderSelect('suffix', 'Suffix', SUFFIX_OPTIONS, { half: true })}
            </div>
            <div className="profile-tab__form-row">
              {renderSelect('gender', 'Gender', GENDER_OPTIONS)}
              {renderInput('dateOfBirth', 'Date of Birth', { type: 'date' })}
            </div>
          </div>
        ) : (
          <div className="profile-tab__section-body">
            <div className="profile-tab__fields-grid">
              {renderViewField('Full Name', [patron.prefix, patron.firstName, patron.lastName, patron.suffix].filter(Boolean).join(' '))}
              {renderViewField('Preferred Name', patron.preferredName, 'fa-heart')}
              {renderViewField('Gender', patron.gender ? patron.gender.charAt(0).toUpperCase() + patron.gender.slice(1) : null)}
              {renderViewField('Date of Birth', patron.dateOfBirth ? `${formatDate(patron.dateOfBirth)} (age ${calculateAge(patron.dateOfBirth)})` : null, 'fa-cake-candles')}
            </div>
          </div>
        )}
      </div>

      {/* ─── Section 2: Contact Information ─── */}
      <div className="profile-tab__section">
        <h3 className="profile-tab__section-title">
          <i className="fa-solid fa-address-book"></i>
          Contact Information
        </h3>
        {isEditing ? (
          <div className="profile-tab__section-body">
            <div className="profile-tab__form-row">
              {renderInput('email', 'Email Address', { type: 'email', placeholder: 'name@example.com' })}
              {renderInput('phone', 'Phone Number', { type: 'tel', placeholder: '(555) 123-4567' })}
            </div>
            <div className="profile-tab__form-row profile-tab__form-row--full">
              {renderInput('addressStreet', 'Street Address', { placeholder: '123 Main St' })}
            </div>
            <div className="profile-tab__form-row profile-tab__form-row--4col">
              {renderInput('addressCity', 'City', { placeholder: 'San Francisco' })}
              {renderInput('addressState', 'State', { placeholder: 'CA', half: true })}
              {renderInput('addressZip', 'ZIP Code', { placeholder: '94102', half: true })}
              {renderInput('addressCountry', 'Country')}
            </div>
          </div>
        ) : (
          <div className="profile-tab__section-body">
            <div className="profile-tab__fields-grid">
              {renderViewField('Email', patron.email, 'fa-envelope')}
              {renderViewField('Phone', patron.phone, 'fa-phone')}
              {renderViewField('Address', getDisplayAddress(), 'fa-location-dot')}
            </div>
          </div>
        )}
      </div>

      {/* ─── Section 3: Professional Information (from Relationships) ─── */}
      <div className="profile-tab__section">
        <div className="profile-tab__section-header-row">
          <h3 className="profile-tab__section-title">
            <i className="fa-solid fa-briefcase"></i>
            Professional Information
          </h3>
          <button
            className="profile-tab__section-link"
            onClick={() => onSwitchTab && onSwitchTab('relationships')}
          >
            Manage
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
        <div className="profile-tab__section-body">
          {orgRelationships.length > 0 ? (
            <div className="profile-tab__org-list">
              {orgRelationships.map((rel) => (
                <div key={rel.id} className="profile-tab__org-card">
                  <div className="profile-tab__org-avatar">
                    <span className="profile-tab__org-initials">
                      {rel.externalContact?.initials || rel.initials || '??'}
                    </span>
                  </div>
                  <div className="profile-tab__org-info">
                    <span className="profile-tab__org-name">
                      {rel.externalContact?.company || rel.displayName}
                    </span>
                    <span className="profile-tab__org-role">
                      {rel.externalContact?.title || rel.role}
                      {rel.isPrimary && (
                        <span className="profile-tab__org-primary">Primary</span>
                      )}
                    </span>
                  </div>
                  <span className={`profile-tab__org-type-badge profile-tab__org-type-badge--${rel.type}`}>
                    {rel.type === 'organization' ? 'Organization' : 'Professional'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="profile-tab__org-empty">
              <i className="fa-solid fa-building profile-tab__org-empty-icon"></i>
              <p className="profile-tab__org-empty-text">No professional connections recorded.</p>
              <button
                className="profile-tab__org-empty-action"
                onClick={() => onAddRelationship && onAddRelationship()}
              >
                <i className="fa-solid fa-plus"></i>
                Add organization
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ─── Section 4: Communication Preferences ─── */}
      <div className="profile-tab__section">
        <h3 className="profile-tab__section-title">
          <i className="fa-solid fa-bell"></i>
          Communication Preferences
        </h3>
        {isEditing ? (
          <div className="profile-tab__section-body">
            <div className="profile-tab__form-field">
              <label className="profile-tab__form-label">Preferred Contact Method</label>
              <div className="profile-tab__radio-group">
                {['email', 'phone', 'mail'].map(method => (
                  <label key={method} className={`profile-tab__radio ${form.preferredMethod === method ? 'profile-tab__radio--selected' : ''}`}>
                    <input
                      type="radio"
                      name="preferredMethod"
                      value={method}
                      checked={form.preferredMethod === method}
                      onChange={(e) => handleChange('preferredMethod', e.target.value)}
                    />
                    <i className={`fa-solid ${method === 'email' ? 'fa-envelope' : method === 'phone' ? 'fa-phone' : 'fa-envelope-open-text'}`}></i>
                    {method.charAt(0).toUpperCase() + method.slice(1)}
                  </label>
                ))}
              </div>
            </div>
            <div className="profile-tab__toggles">
              {renderToggle('emailOptIn', 'Email Communications', 'Receive emails including appeals, newsletters, and event invitations')}
              {renderToggle('phoneOptIn', 'Phone Communications', show('profileTab.solicitationLabel') ? 'Receive phone calls for solicitation and stewardship' : 'Receive phone calls for stewardship')}
              {renderToggle('mailOptIn', 'Direct Mail', 'Receive printed materials, annual reports, and mailed appeals')}
              <div className="profile-tab__toggle-divider"></div>
              {renderToggle('doNotContact', 'Do Not Contact', 'Override all channels — patron will not be contacted through any method')}
            </div>
          </div>
        ) : (
          <div className="profile-tab__section-body">
            <div className="profile-tab__fields-grid">
              {renderViewField('Preferred Method', 
                patron.communicationPreferences?.preferredMethod 
                  ? patron.communicationPreferences.preferredMethod.charAt(0).toUpperCase() + patron.communicationPreferences.preferredMethod.slice(1)
                  : null,
                'fa-star'
              )}
            </div>
            <div className="profile-tab__comm-badges">
              {patron.communicationPreferences?.doNotContact ? (
                <span className="profile-tab__badge profile-tab__badge--danger">
                  <i className="fa-solid fa-ban"></i>
                  Do Not Contact
                </span>
              ) : (
                <>
                  <span className={`profile-tab__badge ${patron.communicationPreferences?.emailOptIn !== false ? 'profile-tab__badge--success' : 'profile-tab__badge--muted'}`}>
                    <i className={`fa-solid ${patron.communicationPreferences?.emailOptIn !== false ? 'fa-check' : 'fa-xmark'}`}></i>
                    Email
                  </span>
                  <span className={`profile-tab__badge ${patron.communicationPreferences?.phoneOptIn !== false ? 'profile-tab__badge--success' : 'profile-tab__badge--muted'}`}>
                    <i className={`fa-solid ${patron.communicationPreferences?.phoneOptIn !== false ? 'fa-check' : 'fa-xmark'}`}></i>
                    Phone
                  </span>
                  <span className={`profile-tab__badge ${patron.communicationPreferences?.mailOptIn !== false ? 'profile-tab__badge--success' : 'profile-tab__badge--muted'}`}>
                    <i className={`fa-solid ${patron.communicationPreferences?.mailOptIn !== false ? 'fa-check' : 'fa-xmark'}`}></i>
                    Mail
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ─── Section 5: Notes ─── */}
      <div className="profile-tab__section">
        <h3 className="profile-tab__section-title">
          <i className="fa-solid fa-sticky-note"></i>
          Notes
        </h3>
        <div className="profile-tab__section-body">
          {isEditing ? (
            <div className="profile-tab__form-field">
              <textarea
                className="profile-tab__textarea"
                value={form.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Add internal notes about this patron..."
                rows={4}
              />
            </div>
          ) : (
            <p className={`profile-tab__notes-display ${!patron.notes ? 'profile-tab__notes-display--empty' : ''}`}>
              {patron.notes || 'No notes added yet.'}
            </p>
          )}
        </div>
      </div>

      {/* ─── Section 6: System Information (always read-only) ─── */}
      <div className="profile-tab__section profile-tab__section--system">
        <h3 className="profile-tab__section-title">
          <i className="fa-solid fa-circle-info"></i>
          System Information
        </h3>
        <div className="profile-tab__section-body">
          <div className="profile-tab__fields-grid">
            <div className="profile-tab__field">
              <span className="profile-tab__field-label">Patron ID</span>
              <span className="profile-tab__field-value profile-tab__field-value--mono">
                {patron.id}
                <button 
                  className="profile-tab__copy-btn"
                  onClick={handleCopyId}
                  title="Copy ID"
                >
                  <i className={`fa-solid ${idCopied ? 'fa-check' : 'fa-copy'}`}></i>
                  {idCopied && <span className="profile-tab__copy-label">Copied</span>}
                </button>
              </span>
            </div>
            <div className="profile-tab__field">
              <span className="profile-tab__field-label">Source</span>
              <span className="profile-tab__field-value">
                <span className="profile-tab__source-badge">
                  <i className={`fa-solid ${sourceConfig.icon}`}></i>
                  {sourceConfig.label}
                </span>
              </span>
            </div>
            {renderViewField('Date Created', formatDate(patron.createdDate))}
            <div className="profile-tab__field">
              <span className="profile-tab__field-label">Status</span>
              <span className="profile-tab__field-value">
                <span className={`profile-tab__status-badge profile-tab__status-badge--${patron.status || 'active'}`}>
                  <i className={`fa-solid ${currentStatusConfig.icon}`}></i>
                  {currentStatusConfig.label}
                </span>
                <button 
                  className="profile-tab__status-change-btn"
                  onClick={() => setShowStatusModal(true)}
                >
                  Change
                </button>
              </span>
            </div>
            {patron.status === 'deceased' && patron.deceasedDate && (
              renderViewField('Date of Death', formatDate(patron.deceasedDate))
            )}
            {patron.status === 'inactive' && patron.inactiveDate && (
              <>
                {renderViewField('Inactive Since', formatDate(patron.inactiveDate))}
                {patron.inactiveReason && renderViewField('Reason', patron.inactiveReason)}
              </>
            )}
            {patron.status === 'archived' && patron.archivedDate && (
              renderViewField('Archived On', formatDate(patron.archivedDate))
            )}
          </div>
        </div>
      </div>

      {/* Status Change Modal */}
      {showStatusModal && (
        <StatusChangeModal
          patron={patron}
          onClose={() => setShowStatusModal(false)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  )
}

export default ProfileTab
