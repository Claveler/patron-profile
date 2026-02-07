import { useState, useEffect } from 'react'
import { patronTags, addPatron } from '../../data/patrons'
import './PatronModal.css'

function PatronModal({ 
  isOpen, 
  onClose, 
  onSuccess,
}) {
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    category: 'prospect',
    notes: '',
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        category: 'prospect',
        notes: '',
      })
      setErrors({})
    }
  }, [isOpen])
  
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])
  
  if (!isOpen) return null
  
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }
    
    // Basic email validation if provided
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      const patronData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        address: formData.address.trim() || null,
        tags: [formData.category], // Convert single selection to tags array
        notes: formData.notes.trim() || null,
        source: 'manual', // Created via manual entry form
      }
      
      const newPatron = addPatron(patronData)
      
      // Simulate network delay for realism
      await new Promise(resolve => setTimeout(resolve, 300))
      
      if (onSuccess) {
        onSuccess(newPatron)
      }
      
      onClose()
    } catch (error) {
      console.error('Failed to create patron:', error)
      setErrors({ submit: 'Failed to create patron. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="patron-modal__overlay" onClick={handleBackdropClick}>
      <div className="patron-modal">
        {/* Header */}
        <div className="patron-modal__header">
          <div className="patron-modal__header-content">
            <h2 className="patron-modal__title">Add New Patron</h2>
            <p className="patron-modal__subtitle">
              Create a new patron record in the database
            </p>
          </div>
          <button className="patron-modal__close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        
        {/* Body */}
        <form className="patron-modal__body" onSubmit={handleSubmit}>
          {/* Name Row */}
          <div className="patron-modal__row">
            <div className="patron-modal__field patron-modal__field--half">
              <label className="patron-modal__label" htmlFor="patron-first-name">
                First Name <span className="patron-modal__required">*</span>
              </label>
              <input
                id="patron-first-name"
                type="text"
                name="firstName"
                className={`patron-modal__input ${errors.firstName ? 'patron-modal__input--error' : ''}`}
                placeholder="John"
                value={formData.firstName}
                onChange={handleInputChange}
                autoFocus
              />
              {errors.firstName && <span className="patron-modal__error">{errors.firstName}</span>}
            </div>
            
            <div className="patron-modal__field patron-modal__field--half">
              <label className="patron-modal__label" htmlFor="patron-last-name">
                Last Name <span className="patron-modal__required">*</span>
              </label>
              <input
                id="patron-last-name"
                type="text"
                name="lastName"
                className={`patron-modal__input ${errors.lastName ? 'patron-modal__input--error' : ''}`}
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleInputChange}
              />
              {errors.lastName && <span className="patron-modal__error">{errors.lastName}</span>}
            </div>
          </div>
          
          {/* Email */}
          <div className="patron-modal__field">
            <label className="patron-modal__label" htmlFor="patron-email">
              Email
            </label>
            <input
              id="patron-email"
              type="email"
              name="email"
              className={`patron-modal__input ${errors.email ? 'patron-modal__input--error' : ''}`}
              placeholder="john.doe@example.com"
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && <span className="patron-modal__error">{errors.email}</span>}
          </div>
          
          {/* Phone */}
          <div className="patron-modal__field">
            <label className="patron-modal__label" htmlFor="patron-phone">
              Phone
            </label>
            <input
              id="patron-phone"
              type="tel"
              name="phone"
              className="patron-modal__input"
              placeholder="(555) 123-4567"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          
          {/* Address */}
          <div className="patron-modal__field">
            <label className="patron-modal__label" htmlFor="patron-address">
              Address
            </label>
            <input
              id="patron-address"
              type="text"
              name="address"
              className="patron-modal__input"
              placeholder="123 Main St, City, State 12345"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>
          
          {/* Category */}
          <div className="patron-modal__field">
            <label className="patron-modal__label" htmlFor="patron-category">
              Initial Tag
            </label>
            <select
              id="patron-category"
              name="category"
              className="patron-modal__select"
              value={formData.category}
              onChange={handleInputChange}
            >
              {patronTags.map(tag => (
                <option key={tag.id} value={tag.id}>{tag.label}</option>
              ))}
            </select>
          </div>
          
          {/* Notes */}
          <div className="patron-modal__field">
            <label className="patron-modal__label" htmlFor="patron-notes">
              Notes
            </label>
            <textarea
              id="patron-notes"
              name="notes"
              className="patron-modal__textarea"
              placeholder="Any additional information about this patron..."
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
          
          {/* Submit error */}
          {errors.submit && (
            <div className="patron-modal__submit-error">
              <i className="fa-solid fa-exclamation-circle"></i>
              {errors.submit}
            </div>
          )}
        </form>
        
        {/* Footer */}
        <div className="patron-modal__footer">
          <button 
            type="button"
            className="patron-modal__btn patron-modal__btn--secondary" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="patron-modal__btn patron-modal__btn--primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                Creating...
              </>
            ) : (
              <>
                Add patron
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PatronModal
