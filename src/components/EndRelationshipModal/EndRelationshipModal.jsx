import { useState } from 'react'
import { endPatronRelationship, patronRelationships, HOUSEHOLD_MEMBERS } from '../../data/patrons'
import './EndRelationshipModal.css'

function EndRelationshipModal({
  isOpen,
  onClose,
  relationship,
  patronName,
  onSuccess,
  householdName,
  householdMemberCount,
  onBeforeMutate,
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleConfirm = () => {
    if (!relationship) return

    setIsLoading(true)
    setError('')

    try {
      onBeforeMutate?.()
      if (relationship.toPatronId) {
        // Patron-to-patron: end scoped to this relationship type + category
        endPatronRelationship(relationship.fromPatronId, relationship.toPatronId, relationship.type, relationship.category)
      } else {
        // External contact: set endDate directly on the record
        const record = patronRelationships.find(r => r.id === relationship.id)
        if (record) {
          record.endDate = new Date().toISOString().split('T')[0]
        }
      }

      setIsLoading(false)
      onSuccess && onSuccess()
      onClose()
    } catch (err) {
      setIsLoading(false)
      setError('Failed to end relationship')
    }
  }

  if (!isOpen || !relationship) return null

  const contactName = relationship.linkedPatron
    ? `${relationship.linkedPatron.firstName} ${relationship.linkedPatron.lastName}`
    : relationship.externalContact?.name || relationship.displayName || 'this contact'

  const isHousehold = relationship.type === 'household'

  // Determine if the other patron (the one being removed) is the Head
  const isRemovingHead = isHousehold && relationship.toPatronId
    ? HOUSEHOLD_MEMBERS.some(m => m.patronId === relationship.toPatronId && m.isPrimary)
    : false

  // Will the household dissolve? (2 members -> removing one leaves 1 -> auto-dissolve)
  const willDissolve = isHousehold && householdMemberCount <= 2

  return (
    <div className="end-rel-modal__overlay" onClick={onClose}>
      <div className="end-rel-modal" onClick={e => e.stopPropagation()}>
        <div className="end-rel-modal__header">
          <h2 className="end-rel-modal__title">End relationship</h2>
          <button className="end-rel-modal__close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="end-rel-modal__content">
          <div className="end-rel-modal__warning">
            <i className="fa-solid fa-triangle-exclamation"></i>
            <span>
              End the <strong>{relationship.role}</strong> relationship between{' '}
              <strong>{patronName}</strong> and <strong>{contactName}</strong>?
            </span>
          </div>

          <p className="end-rel-modal__description">
            This will mark the relationship as ended. The record will be preserved for historical tracking.
          </p>

          {/* Context-aware household warnings */}
          {isHousehold && willDissolve && (
            <div className="end-rel-modal__warning end-rel-modal__warning--household">
              <i className="fa-solid fa-house-circle-xmark"></i>
              <span>
                Ending this relationship will <strong>dissolve</strong> the <strong>{householdName || 'household'}</strong>.
                Both patrons will become standalone.
              </span>
            </div>
          )}

          {isHousehold && !willDissolve && householdMemberCount > 2 && (
            <div className="end-rel-modal__warning end-rel-modal__warning--household">
              <i className="fa-solid fa-user-minus"></i>
              <span>
                <strong>{contactName}</strong> will be removed from the <strong>{householdName || 'household'}</strong>.
                Their relationships with other household members will also be ended.
              </span>
            </div>
          )}

          {isHousehold && isRemovingHead && !willDissolve && (
            <div className="end-rel-modal__info end-rel-modal__info--head">
              <i className="fa-solid fa-crown"></i>
              <span>
                <strong>{contactName}</strong> is the Head of this household.
                A new Head may need to be assigned after removal.
              </span>
            </div>
          )}

          {isHousehold && (
            <div className="end-rel-modal__info">
              <i className="fa-solid fa-circle-info"></i>
              <span>
                This only removes the CRM relationship. It does <strong>not</strong> remove them from any shared memberships.
                Use the Memberships tab to manage beneficiary access.
              </span>
            </div>
          )}

          {error && (
            <div className="end-rel-modal__error">
              <i className="fa-solid fa-exclamation-circle"></i>
              {error}
            </div>
          )}
        </div>

        <div className="end-rel-modal__actions">
          <button className="end-rel-modal__cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="end-rel-modal__confirm"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Ending...' : 'End relationship'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EndRelationshipModal
