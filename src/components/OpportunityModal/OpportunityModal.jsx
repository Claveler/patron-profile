import { useState, useEffect, useRef } from 'react'
import { PIPELINE_STAGES, PROBABILITY_OPTIONS, addOpportunity } from '../../data/opportunities'
import { getActiveCampaigns, getAllStaff } from '../../data/campaigns'
import { searchPatrons, getPatronById, getPatronDisplayName } from '../../data/patrons'
import { getInitials } from '../../utils/getInitials'
import './OpportunityModal.css'

function OpportunityModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  // Pre-fill data when opened from patron context
  patronId = null,
  patronName = null,
  defaultAssignedTo = null,
  defaultStage = null,
}) {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    askAmount: '',
    campaignId: '',
    expectedClose: '',
    probability: 50,
    stage: defaultStage || 'identification',
    nextAction: '',
    assignedToId: defaultAssignedTo || '',
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Patron search state (only used when patronId is not pre-provided)
  const [patronSearch, setPatronSearch] = useState('')
  const [patronResults, setPatronResults] = useState([])
  const [selectedPatron, setSelectedPatron] = useState(null)
  const [showPatronDropdown, setShowPatronDropdown] = useState(false)
  const patronSearchRef = useRef(null)
  const patronDropdownRef = useRef(null)
  
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
        stage: defaultStage || 'identification',
        nextAction: '',
        assignedToId: defaultAssignedTo || '',
      })
      setErrors({})
      setPatronSearch('')
      setPatronResults([])
      setSelectedPatron(null)
      setShowPatronDropdown(false)
    }
  }, [isOpen, defaultAssignedTo, defaultStage])
  
  // Close patron dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        patronDropdownRef.current && 
        !patronDropdownRef.current.contains(e.target) &&
        patronSearchRef.current &&
        !patronSearchRef.current.contains(e.target)
      ) {
        setShowPatronDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
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
  
  // Patron search handlers
  const handlePatronSearchChange = (e) => {
    const value = e.target.value
    setPatronSearch(value)
    if (errors.patron) {
      setErrors(prev => ({ ...prev, patron: null }))
    }
    
    if (value.length >= 2) {
      const results = searchPatrons(value)
      setPatronResults(results)
      setShowPatronDropdown(true)
    } else {
      setPatronResults([])
      setShowPatronDropdown(false)
    }
  }
  
  const handleSelectPatron = (patron) => {
    setSelectedPatron(patron)
    setPatronSearch(patron.name)
    setShowPatronDropdown(false)
    setPatronResults([])
    if (errors.patron) {
      setErrors(prev => ({ ...prev, patron: null }))
    }
  }
  
  const handleClearPatron = () => {
    setSelectedPatron(null)
    setPatronSearch('')
    setPatronResults([])
    setShowPatronDropdown(false)
  }
  
  // Resolve the effective patronId and patronName
  const effectivePatronId = patronId || (selectedPatron ? selectedPatron.id : null)
  const effectivePatronName = patronName || (selectedPatron ? selectedPatron.name : null)
  
  const validateForm = () => {
    const newErrors = {}
    
    // Patron is required when not pre-provided
    if (!patronId && !selectedPatron) {
      newErrors.patron = 'Please select a patron'
    }
    
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
    
    if (!formData.assignedToId) {
      newErrors.assignedToId = 'Please assign to a staff member'
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
      const opportunityData = {
        patronId: effectivePatronId,
        patronName: effectivePatronName,
        name: formData.name.trim(),
        askAmount: parseFloat(formData.askAmount),
        campaignId: formData.campaignId,
        fundId: campaign ? campaign.fund.id : null,
        expectedClose: formData.expectedClose,
        probability: parseInt(formData.probability),
        stage: formData.stage,
        nextAction: formData.nextAction.trim(),
        assignedToId: formData.assignedToId,
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
            <h2 className="opportunity-modal__title">Create opportunity</h2>
          </div>
          <button className="opportunity-modal__close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        
        {/* Body */}
        <form className="opportunity-modal__body" onSubmit={handleSubmit}>
          {/* Patron Search/Select - shown when patronId is not pre-provided */}
          {!patronId ? (
            <div className="opportunity-modal__field">
              <label className="opportunity-modal__label" htmlFor="opp-patron">
                Patron <span className="opportunity-modal__required">*</span>
              </label>
              {selectedPatron ? (
                <div className="opportunity-modal__patron-selected">
                  {selectedPatron.photo ? (
                    <img 
                      src={selectedPatron.photo} 
                      alt="" 
                      className="opportunity-modal__patron-avatar"
                    />
                  ) : (
                    <div className="opportunity-modal__patron-avatar opportunity-modal__patron-avatar--placeholder">
                      <span className="opportunity-modal__patron-avatar-initials">{getInitials(selectedPatron.name)}</span>
                    </div>
                  )}
                  <div className="opportunity-modal__patron-info">
                    <span className="opportunity-modal__patron-name">{selectedPatron.name}</span>
                    {selectedPatron.email && (
                      <span className="opportunity-modal__patron-email">{selectedPatron.email}</span>
                    )}
                  </div>
                  <button 
                    type="button" 
                    className="opportunity-modal__patron-clear"
                    onClick={handleClearPatron}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              ) : (
                <div className="opportunity-modal__patron-search-wrapper">
                  <div className="opportunity-modal__input-prefix">
                    <span className="opportunity-modal__prefix"><i className="fa-solid fa-search"></i></span>
                    <input
                      ref={patronSearchRef}
                      id="opp-patron"
                      type="text"
                      className={`opportunity-modal__input opportunity-modal__input--currency ${errors.patron ? 'opportunity-modal__input--error' : ''}`}
                      placeholder="Search by name or email..."
                      value={patronSearch}
                      onChange={handlePatronSearchChange}
                      onFocus={() => {
                        if (patronResults.length > 0) setShowPatronDropdown(true)
                      }}
                      autoComplete="off"
                    />
                  </div>
                  {showPatronDropdown && patronResults.length > 0 && (
                    <div className="opportunity-modal__patron-dropdown" ref={patronDropdownRef}>
                      {patronResults.map(patron => (
                        <button
                          key={patron.id}
                          type="button"
                          className="opportunity-modal__patron-option"
                          onClick={() => handleSelectPatron(patron)}
                        >
                          {patron.photo ? (
                            <img src={patron.photo} alt="" className="opportunity-modal__patron-avatar--sm" />
                          ) : (
                            <div className="opportunity-modal__patron-avatar--sm opportunity-modal__patron-avatar--placeholder">
                              <span className="opportunity-modal__patron-avatar-initials">{getInitials(patron.name)}</span>
                            </div>
                          )}
                          <div className="opportunity-modal__patron-option-info">
                            <span className="opportunity-modal__patron-option-name">{patron.name}</span>
                            {patron.email && (
                              <span className="opportunity-modal__patron-option-email">{patron.email}</span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {showPatronDropdown && patronSearch.length >= 2 && patronResults.length === 0 && (
                    <div className="opportunity-modal__patron-dropdown">
                      <div className="opportunity-modal__patron-no-results">
                        No patrons found
                      </div>
                    </div>
                  )}
                </div>
              )}
              {errors.patron && <span className="opportunity-modal__error">{errors.patron}</span>}
            </div>
          ) : (
            /* When patronId is pre-provided, show locked patron display */
            patronName && (
              <div className="opportunity-modal__field">
                <label className="opportunity-modal__label">Patron</label>
                <div className="opportunity-modal__patron-locked">
                  <i className="fa-solid fa-user"></i>
                  <span>{patronName}</span>
                  <i className="fa-solid fa-lock opportunity-modal__patron-lock-icon"></i>
                </div>
              </div>
            )
          )}
          
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
                name="assignedToId"
                className={`opportunity-modal__select ${errors.assignedToId ? 'opportunity-modal__select--error' : ''}`}
                value={formData.assignedToId}
                onChange={handleInputChange}
              >
                <option value="">Select staff...</option>
                {staff.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              {errors.assignedToId && <span className="opportunity-modal__error">{errors.assignedToId}</span>}
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
                Create opportunity
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default OpportunityModal
