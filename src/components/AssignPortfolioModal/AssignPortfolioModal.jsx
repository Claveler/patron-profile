import { useState, useEffect } from 'react'
import { assignPatronToOfficer } from '../../data/patrons'
import { addOpportunity } from '../../data/opportunities'
import { getAllStaff, getActiveCampaigns } from '../../data/campaigns'
import './AssignPortfolioModal.css'

function AssignPortfolioModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  patronId,
  patronName,
}) {
  // Form state
  const [formData, setFormData] = useState({
    assignedToId: '',
    createOpportunity: false,
    opportunityName: '',
    askAmount: '',
    campaignId: '',
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Data for dropdowns
  const staff = getAllStaff()
  const campaigns = getActiveCampaigns()
  
  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        assignedToId: '',
        createOpportunity: false,
        opportunityName: '',
        askAmount: '',
        campaignId: '',
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
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value
    
    setFormData(prev => ({ ...prev, [name]: newValue }))
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.assignedToId) {
      newErrors.assignedToId = 'Please select a gift officer'
    }
    
    // Validate opportunity fields if checkbox is checked
    if (formData.createOpportunity) {
      if (!formData.opportunityName.trim()) {
        newErrors.opportunityName = 'Opportunity name is required'
      }
      if (!formData.askAmount || parseFloat(formData.askAmount) <= 0) {
        newErrors.askAmount = 'Ask amount must be greater than 0'
      }
      if (!formData.campaignId) {
        newErrors.campaignId = 'Please select a campaign'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      // Get staff member details
      const staffMember = staff.find(s => s.id === formData.assignedToId)
      
      // Assign patron to gift officer
      const updatedPatron = assignPatronToOfficer(patronId, formData.assignedToId)
      
      let newOpportunity = null
      
      // Create opportunity if requested
      if (formData.createOpportunity) {
        const campaign = campaigns.find(c => c.id === formData.campaignId)
        
        const opportunityData = {
          patronId,
          patronName,
          name: formData.opportunityName.trim(),
          askAmount: parseFloat(formData.askAmount),
          campaign: campaign ? { id: campaign.id, name: campaign.name } : null,
          fund: campaign ? campaign.fund : null,
          expectedClose: getDefaultExpectedClose(),
          probability: 25,
          stage: 'identification',
          nextAction: 'Initial discovery call',
          assignedToId: formData.assignedToId,
        }
        
        newOpportunity = addOpportunity(opportunityData)
      }
      
      // Simulate network delay for realism
      await new Promise(resolve => setTimeout(resolve, 300))
      
      if (onSuccess) {
        onSuccess({ patron: updatedPatron, opportunity: newOpportunity })
      }
      
      onClose()
    } catch (error) {
      console.error('Failed to assign patron:', error)
      setErrors({ submit: 'Failed to assign patron. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Helper to get default expected close date (90 days from now)
  const getDefaultExpectedClose = () => {
    const date = new Date()
    date.setDate(date.getDate() + 90)
    return date.toISOString().split('T')[0]
  }
  
  return (
    <div className="assign-modal__overlay" onClick={handleBackdropClick}>
      <div className="assign-modal">
        {/* Header */}
        <div className="assign-modal__header">
          <div className="assign-modal__header-content">
            <h2 className="assign-modal__title">Add to portfolio</h2>
            <p className="assign-modal__subtitle">
              <i className="fa-solid fa-user"></i>
              {patronName}
            </p>
          </div>
          <button className="assign-modal__close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        
        {/* Body */}
        <form className="assign-modal__body" onSubmit={handleSubmit}>
          {/* Info Banner */}
          <div className="assign-modal__info">
            <i className="fa-solid fa-info-circle"></i>
            <p>
              Assigning a gift officer converts this patron from a General Constituent 
              to a Managed Prospect for individual relationship management.
            </p>
          </div>
          
          {/* Gift Officer Selection */}
          <div className="assign-modal__field">
            <label className="assign-modal__label" htmlFor="assign-officer">
              Gift Officer <span className="assign-modal__required">*</span>
            </label>
            <select
              id="assign-officer"
              name="assignedToId"
              className={`assign-modal__select ${errors.assignedToId ? 'assign-modal__select--error' : ''}`}
              value={formData.assignedToId}
              onChange={handleInputChange}
            >
              <option value="">Select a gift officer...</option>
              {staff.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.role})
                </option>
              ))}
            </select>
            {errors.assignedToId && <span className="assign-modal__error">{errors.assignedToId}</span>}
          </div>
          
          {/* Create Opportunity Checkbox */}
          <div className="assign-modal__checkbox-field">
            <label className="assign-modal__checkbox-label">
              <input
                type="checkbox"
                name="createOpportunity"
                checked={formData.createOpportunity}
                onChange={handleInputChange}
                className="assign-modal__checkbox"
              />
              <span className="assign-modal__checkbox-text">
                Create first opportunity
              </span>
            </label>
            <p className="assign-modal__checkbox-hint">
              Start tracking a potential gift right away
            </p>
          </div>
          
          {/* Mini Opportunity Form (conditional) */}
          {formData.createOpportunity && (
            <div className="assign-modal__opportunity-section">
              <div className="assign-modal__field">
                <label className="assign-modal__label" htmlFor="opp-name">
                  Opportunity Name <span className="assign-modal__required">*</span>
                </label>
                <input
                  id="opp-name"
                  type="text"
                  name="opportunityName"
                  className={`assign-modal__input ${errors.opportunityName ? 'assign-modal__input--error' : ''}`}
                  placeholder="e.g., Annual Fund Major Gift"
                  value={formData.opportunityName}
                  onChange={handleInputChange}
                />
                {errors.opportunityName && <span className="assign-modal__error">{errors.opportunityName}</span>}
              </div>
              
              <div className="assign-modal__row">
                <div className="assign-modal__field assign-modal__field--half">
                  <label className="assign-modal__label" htmlFor="opp-amount">
                    Ask Amount <span className="assign-modal__required">*</span>
                  </label>
                  <div className="assign-modal__input-prefix">
                    <span className="assign-modal__prefix">$</span>
                    <input
                      id="opp-amount"
                      type="number"
                      name="askAmount"
                      className={`assign-modal__input assign-modal__input--currency ${errors.askAmount ? 'assign-modal__input--error' : ''}`}
                      placeholder="25,000"
                      min="0"
                      step="100"
                      value={formData.askAmount}
                      onChange={handleInputChange}
                    />
                  </div>
                  {errors.askAmount && <span className="assign-modal__error">{errors.askAmount}</span>}
                </div>
                
                <div className="assign-modal__field assign-modal__field--half">
                  <label className="assign-modal__label" htmlFor="opp-campaign">
                    Campaign <span className="assign-modal__required">*</span>
                  </label>
                  <select
                    id="opp-campaign"
                    name="campaignId"
                    className={`assign-modal__select ${errors.campaignId ? 'assign-modal__select--error' : ''}`}
                    value={formData.campaignId}
                    onChange={handleInputChange}
                  >
                    <option value="">Select...</option>
                    {campaigns.map(campaign => (
                      <option key={campaign.id} value={campaign.id}>
                        {campaign.name}
                      </option>
                    ))}
                  </select>
                  {errors.campaignId && <span className="assign-modal__error">{errors.campaignId}</span>}
                </div>
              </div>
            </div>
          )}
          
          {/* Submit error */}
          {errors.submit && (
            <div className="assign-modal__submit-error">
              <i className="fa-solid fa-exclamation-circle"></i>
              {errors.submit}
            </div>
          )}
        </form>
        
        {/* Footer */}
        <div className="assign-modal__footer">
          <button 
            type="button"
            className="assign-modal__btn assign-modal__btn--secondary" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="assign-modal__btn assign-modal__btn--primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                Assigning...
              </>
            ) : (
              <>
                <i className="fa-solid fa-user-plus"></i>
                {formData.createOpportunity ? 'Assign & create opportunity' : 'Assign to portfolio'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AssignPortfolioModal
