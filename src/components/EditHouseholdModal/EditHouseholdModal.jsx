import { useState, useEffect } from 'react'
import { updateHouseholdName, changeHeadOfHousehold } from '../../data/patrons'
import { getInitials } from '../../utils/getInitials'
import './EditHouseholdModal.css'

function EditHouseholdModal({ isOpen, onClose, household, members, onSuccess, onDeleteHousehold }) {
  const [name, setName] = useState('')
  const [selectedHead, setSelectedHead] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen && household) {
      setName(household.name)
      const currentHead = members.find(m => m.role === 'Head')
      setSelectedHead(currentHead ? currentHead.patronId : '')
      setShowDeleteConfirm(false)
    }
  }, [isOpen, household, members])

  if (!isOpen || !household) return null

  const currentHead = members.find(m => m.role === 'Head')
  const hasChanges =
    name.trim() !== household.name ||
    (currentHead && selectedHead !== currentHead.patronId)

  const handleSave = () => {
    const trimmedName = name.trim()
    if (!trimmedName) return

    // Update name if changed
    if (trimmedName !== household.name) {
      updateHouseholdName(household.id, trimmedName)
    }

    // Change head of household if changed
    if (currentHead && selectedHead !== currentHead.patronId) {
      changeHeadOfHousehold(household.id, selectedHead)
    }

    onSuccess && onSuccess()
    onClose()
  }

  return (
    <div className="edit-hh-modal__overlay" onClick={onClose}>
      <div className="edit-hh-modal" onClick={e => e.stopPropagation()}>
        <div className="edit-hh-modal__header">
          <h2 className="edit-hh-modal__title">Edit household</h2>
          <button className="edit-hh-modal__close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="edit-hh-modal__content">
          {/* Household name */}
          <div className="edit-hh-modal__field">
            <label className="edit-hh-modal__label">Household name</label>
            <input
              type="text"
              className="edit-hh-modal__input"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter household name"
            />
          </div>

          {/* Head of Household selector */}
          <div className="edit-hh-modal__field">
            <label className="edit-hh-modal__label">Head of household</label>
            <p className="edit-hh-modal__hint">
              Select the primary contact for this household.
            </p>
            <div className="edit-hh-modal__member-list">
              {members.map(member => {
                const isSelected = member.patronId === selectedHead
                const isHead = member.role === 'Head'
                return (
                  <label
                    key={member.id}
                    className={`edit-hh-modal__member ${isSelected ? 'edit-hh-modal__member--selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="head-of-household"
                      className="edit-hh-modal__radio"
                      checked={isSelected}
                      onChange={() => setSelectedHead(member.patronId)}
                    />
                    <div className="edit-hh-modal__member-avatar">
                      {member.patron?.photo ? (
                        <img src={member.patron.photo} alt={member.patron.name} />
                      ) : (
                        <span className="edit-hh-modal__member-initials">
                          {getInitials(member.patron?.name || '')}
                        </span>
                      )}
                    </div>
                    <div className="edit-hh-modal__member-info">
                      <span className="edit-hh-modal__member-name">{member.patron?.name}</span>
                      <span className="edit-hh-modal__member-role">{member.role}</span>
                    </div>
                    {isHead && (
                      <span className="edit-hh-modal__current-badge">Current</span>
                    )}
                  </label>
                )
              })}
            </div>
          </div>

          {/* Danger zone: delete household */}
          {onDeleteHousehold && (
            <div className="edit-hh-modal__danger-zone">
              {!showDeleteConfirm ? (
                <button
                  className="edit-hh-modal__delete-btn"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <i className="fa-solid fa-trash-can"></i>
                  Delete household
                </button>
              ) : (
                <div className="edit-hh-modal__confirm-block">
                  <p className="edit-hh-modal__confirm-text">
                    This will remove all members from the household. Are you sure?
                  </p>
                  <div className="edit-hh-modal__confirm-row">
                    <button
                      className="edit-hh-modal__confirm-cancel"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="edit-hh-modal__confirm-delete"
                      onClick={() => {
                        onDeleteHousehold(household.id)
                        onClose()
                      }}
                    >
                      Confirm delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="edit-hh-modal__actions">
          <button className="edit-hh-modal__cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="edit-hh-modal__save"
            onClick={handleSave}
            disabled={!name.trim() || !hasChanges}
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditHouseholdModal
