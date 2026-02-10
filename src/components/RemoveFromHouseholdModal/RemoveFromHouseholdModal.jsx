import { useState } from 'react'
import { removePatronFromHousehold, HOUSEHOLD_MEMBERS } from '../../data/patrons'
import './RemoveFromHouseholdModal.css'

function RemoveFromHouseholdModal({
  isOpen,
  onClose,
  member,
  patronName,
  householdName,
  householdMemberCount,
  onSuccess,
  onBeforeMutate,
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleConfirm = () => {
    if (!member) return

    setIsLoading(true)
    setError('')

    try {
      onBeforeMutate?.()
      removePatronFromHousehold(member.patronId)

      setIsLoading(false)
      onSuccess && onSuccess()
      onClose()
    } catch (err) {
      setIsLoading(false)
      setError('Failed to remove from household')
    }
  }

  if (!isOpen || !member) return null

  const memberName = member.patron
    ? `${member.patron.firstName} ${member.patron.lastName}`
    : 'this member'

  const isHead = HOUSEHOLD_MEMBERS.some(
    m => m.patronId === member.patronId && m.isPrimary
  )

  const willDissolve = householdMemberCount <= 2

  return (
    <div className="remove-hh-modal__overlay" onClick={onClose}>
      <div className="remove-hh-modal" onClick={e => e.stopPropagation()}>
        <div className="remove-hh-modal__header">
          <h2 className="remove-hh-modal__title">Remove from household</h2>
          <button className="remove-hh-modal__close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="remove-hh-modal__content">
          <div className="remove-hh-modal__notice">
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            <span>
              Remove <strong>{memberName}</strong> from the{' '}
              <strong>{householdName || 'household'}</strong>?
            </span>
          </div>

          <div className="remove-hh-modal__info">
            <i className="fa-solid fa-link"></i>
            <span>
              Family relationships will be <strong>preserved as personal connections</strong>.{' '}
              {memberName} will appear as a personal contact on the relationship graph instead of within the household card.
            </span>
          </div>

          {willDissolve && (
            <div className="remove-hh-modal__warning">
              <i className="fa-solid fa-house-circle-xmark"></i>
              <span>
                This will <strong>dissolve</strong> the{' '}
                <strong>{householdName || 'household'}</strong> since only one member would remain.
              </span>
            </div>
          )}

          {isHead && !willDissolve && (
            <div className="remove-hh-modal__warning">
              <i className="fa-solid fa-crown"></i>
              <span>
                <strong>{memberName}</strong> is the Head of this household.
                A new Head will be automatically assigned.
              </span>
            </div>
          )}

          {error && (
            <div className="remove-hh-modal__error">
              <i className="fa-solid fa-exclamation-circle"></i>
              {error}
            </div>
          )}
        </div>

        <div className="remove-hh-modal__actions">
          <button className="remove-hh-modal__cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="remove-hh-modal__confirm"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Removing...' : 'Remove from household'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RemoveFromHouseholdModal
