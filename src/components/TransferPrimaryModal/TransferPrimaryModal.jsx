import { useState } from 'react'
import { transferPrimary } from '../../data/patrons'
import { getInitials } from '../../utils/getInitials'
import './TransferPrimaryModal.css'

function TransferPrimaryModal({ membership, patronName, beneficiaries = [], onClose, onConfirm }) {
  const [selectedPatronId, setSelectedPatronId] = useState(null)

  const selectedBeneficiary = beneficiaries.find(b => (b.patronId || b.id) === selectedPatronId)
  const selectedName = selectedBeneficiary
    ? (selectedBeneficiary.patron?.name || selectedBeneficiary.name || `${selectedBeneficiary.firstName || ''} ${selectedBeneficiary.lastName || ''}`)
    : null

  const handleSubmit = () => {
    if (!selectedPatronId) return

    const result = transferPrimary(membership.id, selectedPatronId)
    if (result.success) {
      onConfirm()
    }
  }

  return (
    <div className="transfer-modal__overlay" onClick={onClose}>
      <div className="transfer-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="transfer-modal__header">
          <div className="transfer-modal__header-content">
            <h3 className="transfer-modal__title">Transfer primary</h3>
            <p className="transfer-modal__subtitle">{membership.tier} &middot; {membership.program}</p>
          </div>
          <button className="transfer-modal__close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Body */}
        <div className="transfer-modal__body">
          {/* Info */}
          <div className="transfer-modal__info">
            <i className="fa-solid fa-info-circle"></i>
            <span>
              The current primary account holder (<strong>{patronName}</strong>) will become a beneficiary. Payment responsibility transfers to the new primary.
            </span>
          </div>

          {/* Beneficiary selector */}
          <div className="transfer-modal__section">
            <h4 className="transfer-modal__section-title">
              <i className="fa-solid fa-user-check"></i>
              Select new primary member
            </h4>
            <div className="transfer-modal__person-list">
              {beneficiaries.map(b => {
                const id = b.patronId || b.id
                const name = b.patron?.name || b.name || `${b.patron?.firstName || b.firstName || ''} ${b.patron?.lastName || b.lastName || ''}`.trim()
                const photo = b.patron?.photo || b.photo
                const isSelected = selectedPatronId === id
                return (
                  <label
                    key={id}
                    className={`transfer-modal__person-option ${isSelected ? 'transfer-modal__person-option--selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="primary"
                      value={id}
                      checked={isSelected}
                      onChange={() => setSelectedPatronId(id)}
                      className="transfer-modal__radio-input"
                    />
                    <div className="transfer-modal__radio-custom" />
                    <div className="transfer-modal__person-avatar">
                      {photo ? (
                        <img src={photo} alt={name} />
                      ) : (
                        getInitials(name)
                      )}
                    </div>
                    <div className="transfer-modal__person-info">
                      <span className="transfer-modal__person-name">{name}</span>
                      {b.roleLabel && (
                        <span className="transfer-modal__person-role">{b.roleLabel}</span>
                      )}
                    </div>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Warning */}
          {selectedPatronId && (
            <div className="transfer-modal__warning">
              <i className="fa-solid fa-triangle-exclamation"></i>
              <span>
                <strong>{selectedName}</strong> will become the primary account holder and assume payment responsibility. <strong>{patronName}</strong> will become a beneficiary.
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="transfer-modal__footer">
          <div className="transfer-modal__actions">
            <button className="transfer-modal__btn transfer-modal__btn--secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              className="transfer-modal__btn transfer-modal__btn--primary"
              onClick={handleSubmit}
              disabled={!selectedPatronId}
            >
              <i className="fa-solid fa-people-arrows"></i>
              Transfer primary
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransferPrimaryModal
