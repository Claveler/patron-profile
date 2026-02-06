import { useState, useEffect } from 'react'
import { PIPELINE_STAGES, PROBABILITY_OPTIONS, addOpportunity } from '../../data/opportunities'
import { getActiveCampaigns, getAllStaff } from '../../data/campaigns'
import './OpportunityModal.css'

function OpportunityModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  // Pre-fill data when opened from patron context
  patronId = null,
  patronName = null,
  defaultAssignedTo = null,
}) {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    askAmount: '',
    campaignId: '',
    expectedClose: '',
    probability: 50,
    stage: 'identification',
    nextAction: '',
    assignedTo: defaultAssignedTo || '',
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Data for dropdowns
  const campaigns = getActiveCampaigns()
  const staff = getAllStaff()
  const stages = PIPELINE_STAGES.filter(s => s.id !== 'stewardship') // Can't create in stewardship
  
  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        askAmount: '',
        campaignId: '',
        expectedClose: '',
        probability: 50,
        stage: 'identification',
        nextAction: '',
        assignedTo: defaultAssignedTo || '',
      })
      setErrors({})
    }
  }, [isOpen, defaultAssignedTo])
  
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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Opportunity name is required'
    }
    
    if (!formData.askAmount || parseFloat(formData.askAmount) <= 0) {
      newErrors.askAmount = 'Ask amount must be greater than 0'
    }
    
    if (!formData.campaignId) {
      newErrors.campaignId = 'Please select a campaign'
    }
    
    if (!formData.expectedClose) {
      newErrors.expectedClose = 'Expected close date is required'
    }
    
    if (!formData.assignedTo) {
      newErrors.assignedTo = 'Please assign to a staff member'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      // Get campaign details
      const campaign = campaigns.find(c => c.id === formData.campaignId)
      const staffMember = staff.find(s => s.name === formData.assignedTo)
      
      const opportunityData = {
        patronId,
        patronName,
        name: formData.name.trim(),
        askAmount: parseFloat(formData.askAmount),
        campaign: campaign ? { id: campaign.id, name: campaign.name } : null,
        fund: campaign ? campaign.fund : null,
        expectedClose: formData.expectedClose,
        probability: parseInt(formData.probability),
        stage: formData.stage,
        nextAction: formData.nextAction.trim(),
        assignedTo: formData.assignedTo,
        assignedToInitials: staffMember?.initials || formData.assignedTo.split(' ').map(n => n[0]).join(''),
      }
      
      const newOpportunity = addOpportunity(opportunityData)
      
      // Simulate network delay for realism
      await new Promise(resolve => setTimeout(resolve, 300))
      
      if (onSuccess) {
        onSuccess(newOpportunity)
      }
      
      onClose()
    } catch (error) {
      console.error('Failed to create opportunity:', error)
      setErrors({ submit: 'Failed to create opportunity. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Format currency for display
  const formatCurrency = (value) => {
    if (!value) return ''
    const num = parseFloat(value)
    if (isNaN(num)) return value
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num)
  }
  
  return (
    <div className="opportunity-modal__overlay" onClick={handleBackdropClick}>
      <div className="opportunity-modal">
        {/* Header */}
        <div className="opportunity-modal__header">
          <div className="opportunity-modal__header-content">
            <h2 className="opportunity-modal__title">Create Opportunity</h2>
            {patronName && (
              <p className="opportunity-modal__subtitle">
                <i className="fa-solid fa-user"></i>
                {patronName}
              </p>
            )}
          </div>
          <button className="opportunity-modal__close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        
        {/* Body */}
        <form className="opportunity-modal__body" onSubmit={handleSubmit}>
          {/* Opportunity Name */}
          <div className="opportunity-modal__field">
            <label className="opportunity-modal__label" htmlFor="opp-name">
              Opportunity Name <span className="opportunity-modal__required">*</span>
            </label>
            <input
              id="opp-name"
              type="text"
              name="name"
              className={`opportunity-modal__input ${errors.name ? 'opportunity-modal__input--error' : ''}`}
              placeholder="e.g., Annual Fund Major Gift"
              value={formData.name}
              onChange={handleInputChange}
            />
            {errors.name && <span className="opportunity-modal__error">{errors.name}</span>}
          </div>
          
          {/* Ask Amount */}
          <div className="opportunity-modal__field">
            <label className="opportunity-modal__label" htmlFor="opp-amount">
              Ask Amount <span className="opportunity-modal__required">*</span>
            </label>
            <div className="opportunity-modal__input-prefix">
              <span className="opportunity-modal__prefix">$</span>
              <input
                id="opp-amount"
                type="number"
                name="askAmount"
                className={`opportunity-modal__input opportunity-modal__input--currency ${errors.askAmount ? 'opportunity-modal__input--error' : ''}`}
                placeholder="25,000"
                min="0"
                step="100"
                value={formData.askAmount}
                onChange={handleInputChange}
              />
            </div>
            {errors.askAmount && <span className="opportunity-modal__error">{errors.askAmount}</span>}
          </div>
          
          {/* Campaign */}
          <div className="opportunity-modal__field">
            <label className="opportunity-modal__label" htmlFor="opp-campaign">
              Campaign <span className="opportunity-modal__required">*</span>
            </label>
            <select
              id="opp-campaign"
              name="campaignId"
              className={`opportunity-modal__select ${errors.campaignId ? 'opportunity-modal__select--error' : ''}`}
              value={formData.campaignId}
              onChange={handleInputChange}
            >
              <option value="">Select a campaign...</option>
              {campaigns.map(campaign => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.name} ({campaign.fund.name})
                </option>
              ))}
            </select>
            {errors.campaignId && <span className="opportunity-modal__error">{errors.campaignId}</span>}
          </div>
          
          {/* Two columns: Expected Close + Probability */}
          <div className="opportunity-modal__row">
            <div className="opportunity-modal__field opportunity-modal__field--half">
              <label className="opportunity-modal__label" htmlFor="opp-close">
                Expected Close <span className="opportunity-modal__required">*</span>
              </label>
              <input
                id="opp-close"
                type="date"
                name="expectedClose"
                className={`opportunity-modal__input ${errors.expectedClose ? 'opportunity-modal__input--error' : ''}`}
                value={formData.expectedClose}
                onChange={handleInputChange}
              />
              {errors.expectedClose && <span className="opportunity-modal__error">{errors.expectedClose}</span>}
            </div>
            
            <div className="opportunity-modal__field opportunity-modal__field--half">
              <label className="opportunity-modal__label" htmlFor="opp-probability">
                Probability
              </label>
              <select
                id="opp-probability"
                name="probability"
                className="opportunity-modal__select"
                value={formData.probability}
                onChange={handleInputChange}
              >
                {PROBABILITY_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Two columns: Stage + Assigned To */}
          <div className="opportunity-modal__row">
            <div className="opportunity-modal__field opportunity-modal__field--half">
              <label className="opportunity-modal__label" htmlFor="opp-stage">
                Initial Stage
              </label>
              <select
                id="opp-stage"
                name="stage"
                className="opportunity-modal__select"
                value={formData.stage}
                onChange={handleInputChange}
              >
                {stages.map(stage => (
                  <option key={stage.id} value={stage.id}>{stage.label}</option>
                ))}
              </select>
            </div>
            
            <div className="opportunity-modal__field opportunity-modal__field--half">
              <label className="opportunity-modal__label" htmlFor="opp-assigned">
                Assigned To <span className="opportunity-modal__required">*</span>
              </label>
              <select
                id="opp-assigned"
                name="assignedTo"
                className={`opportunity-modal__select ${errors.assignedTo ? 'opportunity-modal__select--error' : ''}`}
                value={formData.assignedTo}
                onChange={handleInputChange}
              >
                <option value="">Select staff...</option>
                {staff.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
              {errors.assignedTo && <span className="opportunity-modal__error">{errors.assignedTo}</span>}
            </div>
          </div>
          
          {/* Next Action */}
          <div className="opportunity-modal__field">
            <label className="opportunity-modal__label" htmlFor="opp-next-action">
              Next Action
            </label>
            <input
              id="opp-next-action"
              type="text"
              name="nextAction"
              className="opportunity-modal__input"
              placeholder="e.g., Schedule introductory call"
              value={formData.nextAction}
              onChange={handleInputChange}
            />
          </div>
          
          {/* Submit error */}
          {errors.submit && (
            <div className="opportunity-modal__submit-error">
              <i className="fa-solid fa-exclamation-circle"></i>
              {errors.submit}
            </div>
          )}
        </form>
        
        {/* Footer */}
        <div className="opportunity-modal__footer">
          <button 
            type="button"
            className="opportunity-modal__btn opportunity-modal__btn--secondary" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="opportunity-modal__btn opportunity-modal__btn--primary"
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
                <i className="fa-solid fa-plus"></i>
                Create Opportunity
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default OpportunityModal
