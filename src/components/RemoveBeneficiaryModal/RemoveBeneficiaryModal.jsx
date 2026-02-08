import { useState } from 'react'
import { removeBeneficiaryFromMembership } from '../../data/patrons'
import './RemoveBeneficiaryModal.css'

function RemoveBeneficiaryModal({ 
  isOpen, 
  onClose, 
  membershipId,
  beneficiary,
  hasRelationship = false,
  onSuccess 
}) {
  const [removeRelationship, setRemoveRelationship] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRemove = () => {
    setIsLoading(true)
    setError('')

    const result = removeBeneficiaryFromMembership(
      membershipId,
      beneficiary.patronId || beneficiary.id,
      removeRelationship
    )

    setIsLoading(false)

    if (result.success) {
      onSuccess && onSuccess()
      onClose()
    } else {
      setError(result.error || 'Failed to remove beneficiary')
    }
  }

  if (!isOpen || !beneficiary) return null

  const beneficiaryName = beneficiary.name || 
    (beneficiary.patron ? `${beneficiary.patron.firstName} ${beneficiary.patron.lastName}` : 'this person')

  return (
    <div className="remove-beneficiary-modal__overlay" onClick={onClose}>
      <div className="remove-beneficiary-modal" onClick={e => e.stopPropagation()}>
        <div className="remove-beneficiary-modal__header">
          <h2 className="remove-beneficiary-modal__title">Remove beneficiary</h2>
          <button className="remove-beneficiary-modal__close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="remove-beneficiary-modal__content">
          <div className="remove-beneficiary-modal__warning">
            <i className="fa-solid fa-triangle-exclamation"></i>
            <span>Remove <strong>{beneficiaryName}</strong> from this membership?</span>
          </div>

          <p className="remove-beneficiary-modal__description">
            {beneficiaryName} will no longer be able to use membership benefits.
            Their patron record will be preserved for historical tracking.
          </p>

          {hasRelationship && (
            <label className="remove-beneficiary-modal__checkbox">
              <input
                type="checkbox"
                checked={removeRelationship}
                onChange={e => setRemoveRelationship(e.target.checked)}
              />
              <span className="remove-beneficiary-modal__checkbox-text">
                <strong>Also remove household relationship</strong>
                <small>Uncheck if still family, just not on this membership</small>
              </span>
            </label>
          )}

          {error && (
            <div className="remove-beneficiary-modal__error">
              <i className="fa-solid fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          <div className="remove-beneficiary-modal__actions">
            <button className="remove-beneficiary-modal__cancel" onClick={onClose}>
              Cancel
            </button>
            <button 
              className="remove-beneficiary-modal__submit"
              onClick={handleRemove}
              disabled={isLoading}
            >
              {isLoading ? 'Removing...' : 'Remove'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RemoveBeneficiaryModal
