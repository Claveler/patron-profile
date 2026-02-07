import { useState, useEffect } from 'react'
import { getOpenOpportunitiesForPatron, logContact } from '../../data/opportunities'
import './ActivityModal.css'

const ACTIVITY_TYPES = [
  { id: 'phone', name: 'Phone Call', icon: 'fa-phone' },
  { id: 'email', name: 'Email', icon: 'fa-envelope' },
  { id: 'meeting', name: 'Meeting', icon: 'fa-handshake' },
  { id: 'note', name: 'Note', icon: 'fa-sticky-note' },
]

function ActivityModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  patronId,
  patronName,
  // If opened from opportunity context
  opportunityId = null,
  opportunityName = null,
}) {
  const [formData, setFormData] = useState({
    activityType: 'phone',
    date: new Date().toISOString().split('T')[0],
    subject: '',
    description: '',
    relatedOpportunityId: opportunityId || '',
    setFollowUp: false,
    nextAction: '',
    nextActionDate: '',
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Get opportunities for this patron (for dropdown)
  const opportunities = patronId ? getOpenOpportunitiesForPatron(patronId) : []
  
  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        activityType: 'phone',
        date: new Date().toISOString().split('T')[0],
        subject: '',
        description: '',
        relatedOpportunityId: opportunityId || '',
        setFollowUp: false,
        nextAction: '',
        nextActionDate: '',
      })
      setErrors({})
    }
  }, [isOpen, opportunityId])
  
  // Close on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])
  
  // Prevent body scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [isOpen])
  
  if (!isOpen) return null
  
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required'
    }
    
    if (formData.setFollowUp && !formData.nextAction.trim()) {
      newErrors.nextAction = 'Next action is required when setting follow-up'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      const activityData = {
        id: `activity-${Date.now()}`,
        type: formData.activityType,
        date: formData.date,
        subject: formData.subject.trim(),
        description: formData.description.trim(),
        patronId,
        patronName,
        opportunityId: formData.relatedOpportunityId || null,
      }
      
      // If there's a related opportunity, update its lastContact
      if (formData.relatedOpportunityId) {
        const nextAction = formData.setFollowUp ? formData.nextAction.trim() : null
        logContact(formData.relatedOpportunityId, formData.date, nextAction)
      }
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      if (onSuccess) onSuccess(activityData)
      onClose()
    } catch (error) {
      console.error('Failed to log activity:', error)
      setErrors({ submit: 'Failed to log activity. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const selectedType = ACTIVITY_TYPES.find(t => t.id === formData.activityType)
  
  return (
    <div className="activity-modal__overlay" onClick={handleBackdropClick}>
      <div className="activity-modal">
        {/* Header */}
        <div className="activity-modal__header">
          <div className="activity-modal__header-content">
            <h2 className="activity-modal__title">Log activity</h2>
            {patronName && (
              <p className="activity-modal__subtitle">
                <i className="fa-solid fa-user"></i>
                {patronName}
              </p>
            )}
          </div>
          <button className="activity-modal__close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        
        {/* Body */}
        <form className="activity-modal__body" onSubmit={handleSubmit}>
          {/* Activity Type */}
          <div className="activity-modal__field">
            <label className="activity-modal__label">Activity Type</label>
            <div className="activity-modal__type-grid">
              {ACTIVITY_TYPES.map(type => (
                <label 
                  key={type.id}
                  className={`activity-modal__type-option ${formData.activityType === type.id ? 'activity-modal__type-option--selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="activityType"
                    value={type.id}
                    checked={formData.activityType === type.id}
                    onChange={handleInputChange}
                  />
                  <i className={`fa-solid ${type.icon}`}></i>
                  <span>{type.name}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Date */}
          <div className="activity-modal__field">
            <label className="activity-modal__label">
              Date <span className="activity-modal__required">*</span>
            </label>
            <input
              type="date"
              name="date"
              className={`activity-modal__input ${errors.date ? 'activity-modal__input--error' : ''}`}
              value={formData.date}
              onChange={handleInputChange}
            />
            {errors.date && <span className="activity-modal__error">{errors.date}</span>}
          </div>
          
          {/* Subject */}
          <div className="activity-modal__field">
            <label className="activity-modal__label">
              Subject <span className="activity-modal__required">*</span>
            </label>
            <input
              type="text"
              name="subject"
              className={`activity-modal__input ${errors.subject ? 'activity-modal__input--error' : ''}`}
              placeholder={`e.g., ${selectedType?.name || 'Activity'} with ${patronName || 'patron'}`}
              value={formData.subject}
              onChange={handleInputChange}
            />
            {errors.subject && <span className="activity-modal__error">{errors.subject}</span>}
          </div>
          
          {/* Description */}
          <div className="activity-modal__field">
            <label className="activity-modal__label">Description</label>
            <textarea
              name="description"
              className="activity-modal__textarea"
              placeholder="Notes about this interaction..."
              rows="3"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          
          {/* Related Opportunity */}
          {opportunities.length > 0 && (
            <div className="activity-modal__field">
              <label className="activity-modal__label">Related Opportunity</label>
              <select
                name="relatedOpportunityId"
                className="activity-modal__select"
                value={formData.relatedOpportunityId}
                onChange={handleInputChange}
              >
                <option value="">No related opportunity</option>
                {opportunities.map(opp => (
                  <option key={opp.id} value={opp.id}>
                    {opp.name} (${opp.askAmount.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {/* Follow-up Section */}
          <div className="activity-modal__follow-up">
            <label className="activity-modal__checkbox-label">
              <input
                type="checkbox"
                name="setFollowUp"
                checked={formData.setFollowUp}
                onChange={handleInputChange}
              />
              <span className="activity-modal__checkbox-text">
                <i className="fa-solid fa-calendar-plus"></i>
                Set follow-up action
              </span>
            </label>
            
            {formData.setFollowUp && (
              <div className="activity-modal__follow-up-fields">
                <div className="activity-modal__field">
                  <label className="activity-modal__label">
                    Next Action <span className="activity-modal__required">*</span>
                  </label>
                  <input
                    type="text"
                    name="nextAction"
                    className={`activity-modal__input ${errors.nextAction ? 'activity-modal__input--error' : ''}`}
                    placeholder="e.g., Send follow-up email"
                    value={formData.nextAction}
                    onChange={handleInputChange}
                  />
                  {errors.nextAction && <span className="activity-modal__error">{errors.nextAction}</span>}
                </div>
                
                <div className="activity-modal__field">
                  <label className="activity-modal__label">Due Date</label>
                  <input
                    type="date"
                    name="nextActionDate"
                    className="activity-modal__input"
                    value={formData.nextActionDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}
          </div>
          
          {errors.submit && (
            <div className="activity-modal__submit-error">
              <i className="fa-solid fa-exclamation-circle"></i>
              {errors.submit}
            </div>
          )}
        </form>
        
        {/* Footer */}
        <div className="activity-modal__footer">
          <button 
            type="button"
            className="activity-modal__btn activity-modal__btn--secondary" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="activity-modal__btn activity-modal__btn--primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                Logging...
              </>
            ) : (
              <>
                <i className={`fa-solid ${selectedType?.icon || 'fa-plus'}`}></i>
                Log {selectedType?.name?.toLowerCase() || 'activity'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ActivityModal
