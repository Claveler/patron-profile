import { useState, useEffect } from 'react'
import { getOpportunityById, closeOpportunityAsWon } from '../../data/opportunities'
import { getPatronById, getPatronDisplayName, addGift } from '../../data/patrons'
import { getCampaignById } from '../../data/campaigns'
import { useEpicScope } from '../../hooks/useEpicScope'
import './CloseWonModal.css'

function CloseWonModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  opportunityId,
}) {
  const [opportunity, setOpportunity] = useState(null)
  const [actualAmount, setActualAmount] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  
  // Load opportunity data when modal opens
  useEffect(() => {
    if (isOpen && opportunityId) {
      const opp = getOpportunityById(opportunityId)
      setOpportunity(opp)
      setActualAmount(opp?.askAmount?.toString() || '')
      setNotes('')
      setError(null)
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
  
  const { show } = useEpicScope()
  const showCampaignInfo = show('closeWonModal.campaignInfo')

  if (!isOpen || !opportunity) return null
  
  // Resolve campaign name from campaignId
  const campaignName = showCampaignInfo
    ? (opportunity.campaignId 
        ? (getCampaignById(opportunity.campaignId)?.name || '—')
        : (opportunity.campaign?.name || '—'))
    : null
  
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }
  
  const formatCurrency = (value) => {
    const num = parseFloat(value)
    if (isNaN(num)) return '$0'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(num)
  }
  
  const handleSubmit = async () => {
    const amount = parseFloat(actualAmount)
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid gift amount')
      return
    }
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      const result = closeOpportunityAsWon(opportunityId, amount, notes || null)
      
      // Persist the gift to the GIFTS array
      if (result.gift) {
        addGift(result.gift)
      }

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (onSuccess) {
        onSuccess(result)
      }
      
      onClose()
    } catch (err) {
      console.error('Failed to close opportunity:', err)
      setError('Failed to close opportunity. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const amountDifference = parseFloat(actualAmount) - opportunity.askAmount
  const showDifference = !isNaN(amountDifference) && amountDifference !== 0
  
  return (
    <div className="close-won-modal__overlay" onClick={handleBackdropClick}>
      <div className="close-won-modal">
        {/* Header */}
        <div className="close-won-modal__header">
          <div className="close-won-modal__header-icon">
            <i className="fa-solid fa-trophy"></i>
          </div>
          <div className="close-won-modal__header-content">
            <h2 className="close-won-modal__title">Close as won</h2>
            <p className="close-won-modal__subtitle">
              Congratulations! Record the gift for this opportunity.
            </p>
          </div>
          <button className="close-won-modal__close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        
        {/* Body */}
        <div className="close-won-modal__body">
          {/* Opportunity Summary */}
          <div className="close-won-modal__summary">
            <div className="close-won-modal__summary-row">
              <span className="close-won-modal__summary-label">Opportunity</span>
              <span className="close-won-modal__summary-value">{opportunity.name}</span>
            </div>
            <div className="close-won-modal__summary-row">
              <span className="close-won-modal__summary-label">Patron</span>
              <span className="close-won-modal__summary-value">{(() => { const p = getPatronById(opportunity.patronId); return p ? getPatronDisplayName(p) : 'Unknown' })()}</span>
            </div>
            {campaignName && (
              <div className="close-won-modal__summary-row">
                <span className="close-won-modal__summary-label">Campaign</span>
                <span className="close-won-modal__summary-value">{campaignName}</span>
              </div>
            )}
            <div className="close-won-modal__summary-row">
              <span className="close-won-modal__summary-label">Original Ask</span>
              <span className="close-won-modal__summary-value close-won-modal__summary-value--amount">
                {formatCurrency(opportunity.askAmount)}
              </span>
            </div>
          </div>
          
          {/* Gift Amount */}
          <div className="close-won-modal__field">
            <label className="close-won-modal__label">
              Actual Gift Amount
            </label>
            <div className="close-won-modal__amount-input">
              <span className="close-won-modal__prefix">$</span>
              <input
                type="number"
                className="close-won-modal__input"
                value={actualAmount}
                onChange={(e) => setActualAmount(e.target.value)}
                min="0"
                step="100"
              />
            </div>
            {showDifference && (
              <div className={`close-won-modal__difference ${amountDifference > 0 ? 'close-won-modal__difference--positive' : 'close-won-modal__difference--negative'}`}>
                <i className={`fa-solid ${amountDifference > 0 ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
                {amountDifference > 0 ? '+' : ''}{formatCurrency(amountDifference)} from original ask
              </div>
            )}
          </div>
          
          {/* Notes */}
          <div className="close-won-modal__field">
            <label className="close-won-modal__label">Notes (Optional)</label>
            <textarea
              className="close-won-modal__textarea"
              placeholder="Any notes about this gift..."
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          
          {/* What will happen */}
          <div className="close-won-modal__info">
            <i className="fa-solid fa-info-circle"></i>
            <span>
              This will create a gift record for {formatCurrency(actualAmount)}{campaignName ? <> attributed to <strong>{campaignName}</strong></> : ''} and move the opportunity to Stewardship.
            </span>
          </div>
          
          {error && (
            <div className="close-won-modal__error">
              <i className="fa-solid fa-exclamation-circle"></i>
              {error}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="close-won-modal__footer">
          <button 
            className="close-won-modal__btn close-won-modal__btn--secondary" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            className="close-won-modal__btn close-won-modal__btn--primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                Processing...
              </>
            ) : (
              <>
                <i className="fa-solid fa-check"></i>
                Confirm & create gift
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CloseWonModal
