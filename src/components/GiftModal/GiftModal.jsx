import { useState, useEffect } from 'react'
import { getActiveCampaigns, getFunds, getAppealsForCampaign, getAllStaff, GIFT_TYPES, getStaffNameById } from '../../data/campaigns'
import { addGift } from '../../data/patrons'
import './GiftModal.css'

function GiftModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  patronId,
  patronName,
  // Optional pre-fill for Close as Won flow
  prefillData = null,
}) {
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    giftType: 'check',
    fundId: '',
    campaignId: '',
    appealId: '',
    paymentReference: '',
    notes: '',
    solicitor: '',
    influencer: '',
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSoftCredits, setShowSoftCredits] = useState(false)
  
  // Data for dropdowns
  const funds = getFunds()
  const campaigns = getActiveCampaigns()
  const staff = getAllStaff()
  
  // Filter campaigns by selected fund
  const filteredCampaigns = formData.fundId 
    ? campaigns.filter(c => c.fund.id === formData.fundId)
    : campaigns
  
  // Get appeals for selected campaign
  const appeals = formData.campaignId 
    ? getAppealsForCampaign(formData.campaignId)
    : []
  
  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (prefillData) {
        // Pre-fill from Close as Won flow
        setFormData({
          amount: prefillData.amount || '',
          date: new Date().toISOString().split('T')[0],
          giftType: 'check',
          fundId: prefillData.fund?.id || '',
          campaignId: prefillData.campaign?.id || '',
          appealId: '',
          paymentReference: '',
          notes: prefillData.notes || '',
          solicitor: prefillData.assignedToId ? getStaffNameById(prefillData.assignedToId) : '',
          influencer: '',
        })
        setShowSoftCredits(!!prefillData.assignedToId)
      } else {
        setFormData({
          amount: '',
          date: new Date().toISOString().split('T')[0],
          giftType: 'check',
          fundId: '',
          campaignId: '',
          appealId: '',
          paymentReference: '',
          notes: '',
          solicitor: '',
          influencer: '',
        })
        setShowSoftCredits(false)
      }
      setErrors({})
    }
  }, [isOpen, prefillData])
  
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
    const { name, value } = e.target
    setFormData(prev => {
      const updated = { ...prev, [name]: value }
      
      // Reset campaign if fund changes
      if (name === 'fundId' && prev.fundId !== value) {
        updated.campaignId = ''
        updated.appealId = ''
      }
      
      // Reset appeal if campaign changes
      if (name === 'campaignId' && prev.campaignId !== value) {
        updated.appealId = ''
      }
      
      return updated
    })
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0'
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required'
    }
    
    if (!formData.fundId) {
      newErrors.fundId = 'Please select a fund'
    }
    
    if (!formData.campaignId) {
      newErrors.campaignId = 'Please select a campaign'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      const fund = funds.find(f => f.id === formData.fundId)
      const campaign = campaigns.find(c => c.id === formData.campaignId)
      const appeal = appeals.find(a => a.id === formData.appealId)
      
      // Build soft credits array from solicitor/influencer
      const softCredits = []
      if (formData.solicitor) {
        softCredits.push({ patronId: null, name: getStaffNameById(formData.solicitor), type: 'solicitor' })
      }
      if (formData.influencer) {
        softCredits.push({ patronId: null, name: getStaffNameById(formData.influencer), type: 'influencer' })
      }

      // Persist to the GIFTS array
      const newGift = addGift({
        patronId,
        amount: parseFloat(formData.amount),
        date: formData.date,
        type: 'one-time',
        description: formData.notes || `${formData.giftType} gift`,
        fundId: formData.fundId || null,
        campaignId: formData.campaignId || null,
        appealId: formData.appealId || null,
        deductible: parseFloat(formData.amount),
        benefitsValue: 0,
        softCredits,
      })

      // Build the legacy-format object for onSuccess callback (backward compat)
      const giftData = {
        ...newGift,
        patronName,
        giftType: formData.giftType,
        fund: fund ? { id: fund.id, name: fund.name } : null,
        campaign: campaign ? { id: campaign.id, name: campaign.name } : null,
        appeal: appeal ? { id: appeal.id, name: appeal.name } : null,
        paymentReference: formData.paymentReference,
        notes: formData.notes,
      }
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      if (onSuccess) onSuccess(giftData)
      onClose()
    } catch (error) {
      console.error('Failed to record gift:', error)
      setErrors({ submit: 'Failed to record gift. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const formatCurrency = (value) => {
    if (!value) return '$0'
    const num = parseFloat(value)
    if (isNaN(num)) return '$0'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(num)
  }
  
  return (
    <div className="gift-modal__overlay" onClick={handleBackdropClick}>
      <div className="gift-modal">
        {/* Header */}
        <div className="gift-modal__header">
          <div className="gift-modal__header-content">
            <h2 className="gift-modal__title">Record gift</h2>
            {patronName && (
              <p className="gift-modal__subtitle">
                <i className="fa-solid fa-user"></i>
                {patronName}
              </p>
            )}
          </div>
          <button className="gift-modal__close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        
        {/* Body */}
        <form className="gift-modal__body" onSubmit={handleSubmit}>
          {/* Amount + Date row */}
          <div className="gift-modal__row">
            <div className="gift-modal__field gift-modal__field--half">
              <label className="gift-modal__label">
                Amount <span className="gift-modal__required">*</span>
              </label>
              <div className="gift-modal__input-prefix">
                <span className="gift-modal__prefix">$</span>
                <input
                  type="number"
                  name="amount"
                  className={`gift-modal__input gift-modal__input--currency ${errors.amount ? 'gift-modal__input--error' : ''}`}
                  placeholder="1,000"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleInputChange}
                />
              </div>
              {errors.amount && <span className="gift-modal__error">{errors.amount}</span>}
            </div>
            
            <div className="gift-modal__field gift-modal__field--half">
              <label className="gift-modal__label">
                Date <span className="gift-modal__required">*</span>
              </label>
              <input
                type="date"
                name="date"
                className={`gift-modal__input ${errors.date ? 'gift-modal__input--error' : ''}`}
                value={formData.date}
                onChange={handleInputChange}
              />
              {errors.date && <span className="gift-modal__error">{errors.date}</span>}
            </div>
          </div>
          
          {/* Gift Type */}
          <div className="gift-modal__field">
            <label className="gift-modal__label">Gift Type</label>
            <div className="gift-modal__type-grid">
              {GIFT_TYPES.map(type => (
                <label 
                  key={type.id} 
                  className={`gift-modal__type-option ${formData.giftType === type.id ? 'gift-modal__type-option--selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="giftType"
                    value={type.id}
                    checked={formData.giftType === type.id}
                    onChange={handleInputChange}
                  />
                  <span>{type.name}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Fund */}
          <div className="gift-modal__field">
            <label className="gift-modal__label">
              Fund <span className="gift-modal__required">*</span>
            </label>
            <select
              name="fundId"
              className={`gift-modal__select ${errors.fundId ? 'gift-modal__select--error' : ''}`}
              value={formData.fundId}
              onChange={handleInputChange}
            >
              <option value="">Select a fund...</option>
              {funds.map(fund => (
                <option key={fund.id} value={fund.id}>{fund.name}</option>
              ))}
            </select>
            {errors.fundId && <span className="gift-modal__error">{errors.fundId}</span>}
          </div>
          
          {/* Campaign */}
          <div className="gift-modal__field">
            <label className="gift-modal__label">
              Campaign <span className="gift-modal__required">*</span>
            </label>
            <select
              name="campaignId"
              className={`gift-modal__select ${errors.campaignId ? 'gift-modal__select--error' : ''}`}
              value={formData.campaignId}
              onChange={handleInputChange}
            >
              <option value="">Select a campaign...</option>
              {filteredCampaigns.map(campaign => (
                <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
              ))}
            </select>
            {errors.campaignId && <span className="gift-modal__error">{errors.campaignId}</span>}
          </div>
          
          {/* Appeal (optional) */}
          {appeals.length > 0 && (
            <div className="gift-modal__field">
              <label className="gift-modal__label">Appeal (Optional)</label>
              <select
                name="appealId"
                className="gift-modal__select"
                value={formData.appealId}
                onChange={handleInputChange}
              >
                <option value="">No specific appeal</option>
                {appeals.map(appeal => (
                  <option key={appeal.id} value={appeal.id}>{appeal.name}</option>
                ))}
              </select>
            </div>
          )}
          
          {/* Payment Reference */}
          <div className="gift-modal__field">
            <label className="gift-modal__label">Payment Reference</label>
            <input
              type="text"
              name="paymentReference"
              className="gift-modal__input"
              placeholder="Check #, Transaction ID, etc."
              value={formData.paymentReference}
              onChange={handleInputChange}
            />
          </div>
          
          {/* Notes */}
          <div className="gift-modal__field">
            <label className="gift-modal__label">Notes</label>
            <textarea
              name="notes"
              className="gift-modal__textarea"
              placeholder="Additional notes about this gift..."
              rows="2"
              value={formData.notes}
              onChange={handleInputChange}
            />
          </div>
          
          {/* Soft Credits (collapsible) */}
          <div className="gift-modal__section">
            <button 
              type="button"
              className="gift-modal__section-toggle"
              onClick={() => setShowSoftCredits(!showSoftCredits)}
            >
              <i className={`fa-solid fa-chevron-${showSoftCredits ? 'down' : 'right'}`}></i>
              Soft Credits
            </button>
            
            {showSoftCredits && (
              <div className="gift-modal__section-content">
                <div className="gift-modal__row">
                  <div className="gift-modal__field gift-modal__field--half">
                    <label className="gift-modal__label">Solicitor</label>
                    <select
                      name="solicitor"
                      className="gift-modal__select"
                      value={formData.solicitor}
                      onChange={handleInputChange}
                    >
                      <option value="">None</option>
                      {staff.map(s => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="gift-modal__field gift-modal__field--half">
                    <label className="gift-modal__label">Influencer</label>
                    <select
                      name="influencer"
                      className="gift-modal__select"
                      value={formData.influencer}
                      onChange={handleInputChange}
                    >
                      <option value="">None</option>
                      {staff.map(s => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {errors.submit && (
            <div className="gift-modal__submit-error">
              <i className="fa-solid fa-exclamation-circle"></i>
              {errors.submit}
            </div>
          )}
        </form>
        
        {/* Footer */}
        <div className="gift-modal__footer">
          <div className="gift-modal__summary">
            <span className="gift-modal__summary-label">Gift Total:</span>
            <span className="gift-modal__summary-amount">{formatCurrency(formData.amount)}</span>
          </div>
          <div className="gift-modal__actions">
            <button 
              type="button"
              className="gift-modal__btn gift-modal__btn--secondary" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="gift-modal__btn gift-modal__btn--primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Recording...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-check"></i>
                  Record gift
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GiftModal
