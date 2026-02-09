import { useState } from 'react'
import { 
  PATRON_STATUSES, 
  archivePatron, 
  restorePatron, 
  markPatronDeceased, 
  markPatronInactive, 
  reactivatePatron 
} from '../../data/patrons'
import './StatusChangeModal.css'

const ARCHIVE_REASONS = [
  { id: 'duplicate', label: 'Duplicate record' },
  { id: 'moved', label: 'Moved away' },
  { id: 'requested', label: 'Requested removal' },
  { id: 'data-cleanup', label: 'Data cleanup' },
  { id: 'other', label: 'Other' },
]

function StatusChangeModal({ patron, onClose, onStatusChange }) {
  const currentStatus = patron.status || 'active'
  const [selectedStatus, setSelectedStatus] = useState(currentStatus)
  const [deceasedDate, setDeceasedDate] = useState('')
  const [deceasedNotes, setDeceasedNotes] = useState('')
  const [inactiveReason, setInactiveReason] = useState('')
  const [archiveReason, setArchiveReason] = useState('other')
  const [errors, setErrors] = useState({})
  const [showConfirm, setShowConfirm] = useState(false)

  const hasChanged = selectedStatus !== currentStatus

  const validate = () => {
    const newErrors = {}
    if (selectedStatus === 'deceased' && !deceasedDate) {
      newErrors.deceasedDate = 'Date of death is required'
    }
    if (selectedStatus === 'deceased' && deceasedDate) {
      const d = new Date(deceasedDate + 'T00:00:00')
      if (d > new Date()) newErrors.deceasedDate = 'Date cannot be in the future'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinue = () => {
    if (!validate()) return
    setShowConfirm(true)
  }

  const handleConfirm = () => {
    switch (selectedStatus) {
      case 'active':
        reactivatePatron(patron.id)
        break
      case 'inactive':
        markPatronInactive(patron.id, inactiveReason || null)
        break
      case 'deceased':
        markPatronDeceased(patron.id, deceasedDate, deceasedNotes || null)
        break
      case 'archived':
        archivePatron(patron.id, archiveReason)
        break
      default:
        break
    }
    onStatusChange()
  }

  const getImpactMessage = () => {
    switch (selectedStatus) {
      case 'active':
        return 'This patron will be restored to full active status and included in all campaigns and communications.'
      case 'inactive':
        return 'This patron will be flagged for review. They will still appear in lists but will be highlighted as inactive.'
      case 'deceased':
        return 'All outreach will stop immediately. The patron will be excluded from campaigns, renewals, and communications. Giving history will be preserved for reporting.'
      case 'archived':
        return 'This patron will be hidden from all active lists and excluded from campaigns. They can be restored later.'
      default:
        return ''
    }
  }

  const statusConfig = PATRON_STATUSES.find(s => s.id === selectedStatus) || PATRON_STATUSES[0]

  return (
    <div className="status-modal__overlay" onClick={onClose}>
      <div className="status-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="status-modal__header">
          <h2 className="status-modal__title">Change Patron Status</h2>
          <button className="status-modal__close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {!showConfirm ? (
          <>
            {/* Current status indicator */}
            <div className="status-modal__current">
              <span className="status-modal__current-label">Current status:</span>
              <span className={`status-modal__current-badge status-modal__current-badge--${currentStatus}`}>
                <i className={`fa-solid ${PATRON_STATUSES.find(s => s.id === currentStatus)?.icon || 'fa-circle'}`}></i>
                {PATRON_STATUSES.find(s => s.id === currentStatus)?.label || 'Active'}
              </span>
            </div>

            {/* Status selector */}
            <div className="status-modal__options">
              {PATRON_STATUSES.map(status => (
                <label 
                  key={status.id}
                  className={`status-modal__option ${selectedStatus === status.id ? 'status-modal__option--selected' : ''} ${status.id === currentStatus ? 'status-modal__option--current' : ''}`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={status.id}
                    checked={selectedStatus === status.id}
                    onChange={() => {
                      setSelectedStatus(status.id)
                      setErrors({})
                    }}
                  />
                  <div className={`status-modal__option-icon status-modal__option-icon--${status.color}`}>
                    <i className={`fa-solid ${status.icon}`}></i>
                  </div>
                  <div className="status-modal__option-info">
                    <span className="status-modal__option-label">
                      {status.label}
                      {status.id === currentStatus && <span className="status-modal__option-tag">Current</span>}
                    </span>
                    <span className="status-modal__option-desc">{status.description}</span>
                  </div>
                </label>
              ))}
            </div>

            {/* Conditional fields */}
            {selectedStatus === 'deceased' && selectedStatus !== currentStatus && (
              <div className="status-modal__fields">
                <div className={`status-modal__field ${errors.deceasedDate ? 'status-modal__field--error' : ''}`}>
                  <label className="status-modal__field-label">
                    Date of Death <span className="status-modal__required">*</span>
                  </label>
                  <input
                    type="date"
                    className="status-modal__input"
                    value={deceasedDate}
                    onChange={(e) => {
                      setDeceasedDate(e.target.value)
                      if (errors.deceasedDate) setErrors(prev => { const n = {...prev}; delete n.deceasedDate; return n })
                    }}
                  />
                  {errors.deceasedDate && <span className="status-modal__field-error">{errors.deceasedDate}</span>}
                </div>
                <div className="status-modal__field">
                  <label className="status-modal__field-label">Notes (optional)</label>
                  <input
                    type="text"
                    className="status-modal__input"
                    value={deceasedNotes}
                    onChange={(e) => setDeceasedNotes(e.target.value)}
                    placeholder="e.g., Estate contact: son Robert"
                  />
                </div>
              </div>
            )}

            {selectedStatus === 'inactive' && selectedStatus !== currentStatus && (
              <div className="status-modal__fields">
                <div className="status-modal__field">
                  <label className="status-modal__field-label">Reason (optional)</label>
                  <input
                    type="text"
                    className="status-modal__input"
                    value={inactiveReason}
                    onChange={(e) => setInactiveReason(e.target.value)}
                    placeholder="e.g., No engagement in 2+ years"
                  />
                </div>
              </div>
            )}

            {selectedStatus === 'archived' && selectedStatus !== currentStatus && (
              <div className="status-modal__fields">
                <div className="status-modal__field">
                  <label className="status-modal__field-label">Reason</label>
                  <select
                    className="status-modal__select"
                    value={archiveReason}
                    onChange={(e) => setArchiveReason(e.target.value)}
                  >
                    {ARCHIVE_REASONS.map(r => (
                      <option key={r.id} value={r.id}>{r.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="status-modal__actions">
              <button className="status-modal__btn status-modal__btn--cancel" onClick={onClose}>
                Cancel
              </button>
              <button 
                className="status-modal__btn status-modal__btn--primary"
                disabled={!hasChanged}
                onClick={handleContinue}
              >
                Continue
              </button>
            </div>
          </>
        ) : (
          /* Confirmation Step */
          <>
            <div className="status-modal__confirm">
              <div className={`status-modal__confirm-icon status-modal__confirm-icon--${statusConfig.color}`}>
                <i className={`fa-solid ${statusConfig.icon}`}></i>
              </div>
              <h3 className="status-modal__confirm-title">
                Change status to {statusConfig.label}?
              </h3>
              <p className="status-modal__confirm-text">
                {getImpactMessage()}
              </p>
              {selectedStatus === 'deceased' && deceasedDate && (
                <div className="status-modal__confirm-detail">
                  <strong>Date of Death:</strong> {new Date(deceasedDate + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              )}
            </div>
            <div className="status-modal__actions">
              <button className="status-modal__btn status-modal__btn--cancel" onClick={() => setShowConfirm(false)}>
                Back
              </button>
              <button 
                className={`status-modal__btn ${selectedStatus === 'deceased' || selectedStatus === 'archived' ? 'status-modal__btn--danger' : 'status-modal__btn--primary'}`}
                onClick={handleConfirm}
              >
                <i className={`fa-solid ${statusConfig.icon}`}></i>
                Confirm — {statusConfig.label}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default StatusChangeModal
