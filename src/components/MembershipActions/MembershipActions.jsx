import { useState } from 'react'
import CancelMembershipModal from '../CancelMembershipModal/CancelMembershipModal'
import RenewMembershipModal from '../RenewMembershipModal/RenewMembershipModal'
import PauseMembershipModal from '../PauseMembershipModal/PauseMembershipModal'
import ExtendMembershipModal from '../ExtendMembershipModal/ExtendMembershipModal'
import DowngradeMembershipModal from '../DowngradeMembershipModal/DowngradeMembershipModal'
import TransferPrimaryModal from '../TransferPrimaryModal/TransferPrimaryModal'
import './MembershipActions.css'

const actionGroups = [
  {
    label: 'Lifecycle',
    actions: [
      { id: 'cancel', label: 'Cancel membership', icon: 'fa-ban', variant: 'danger' },
      { id: 'pause', label: 'Pause membership', icon: 'fa-pause', disabledWhen: 'paused' },
      { id: 'extend', label: 'Extend membership', icon: 'fa-calendar-plus' },
    ]
  },
  {
    label: 'Tier changes',
    actions: [
      { id: 'renew', label: 'Renew membership', icon: 'fa-rotate' },
      { id: 'downgrade', label: 'Downgrade tier', icon: 'fa-arrow-down', disabledWhen: 'lowest' },
    ]
  },
  {
    label: 'Account',
    actions: [
      { id: 'transfer', label: 'Transfer primary', icon: 'fa-people-arrows', disabledWhen: 'no_beneficiaries' },
    ]
  }
]

function MembershipActions({ 
  membership, 
  patronId, 
  patronName, 
  patronEmail, 
  isPrimary, 
  beneficiaries = [],
  onUpdate 
}) {
  const [activeModal, setActiveModal] = useState(null)

  // Don't render for non-primary members
  if (!isPrimary) return null

  // Determine disabled states
  const isDisabled = (action) => {
    if (membership.status === 'cancelled') return true
    if (action.disabledWhen === 'paused' && membership.status === 'paused') return true
    if (action.disabledWhen === 'lowest' && membership.tier === 'Basic') return true
    if (action.disabledWhen === 'no_beneficiaries' && beneficiaries.filter(b => b.role !== 'primary').length === 0) return true
    return false
  }

  const getDisabledReason = (action) => {
    if (membership.status === 'cancelled') return 'Membership is cancelled'
    if (action.disabledWhen === 'paused' && membership.status === 'paused') return 'Membership is already paused'
    if (action.disabledWhen === 'lowest' && membership.tier === 'Basic') return 'Already at the lowest tier'
    if (action.disabledWhen === 'no_beneficiaries' && beneficiaries.filter(b => b.role !== 'primary').length === 0) return 'No beneficiaries to transfer to'
    return ''
  }

  const handleAction = (actionId) => {
    setActiveModal(actionId)
  }

  const handleCloseModal = () => {
    setActiveModal(null)
  }

  const handleActionComplete = () => {
    setActiveModal(null)
    onUpdate && onUpdate()
  }

  // Filter out non-primary beneficiaries for transfer modal
  const transferableBeneficiaries = beneficiaries.filter(b => b.role !== 'primary')

  return (
    <div className="membership-actions wrapper-card">
      <div className="membership-actions__header">
        <h4 className="membership-actions__title">
          <i className="fa-solid fa-sliders"></i>
          Membership Actions
        </h4>
      </div>

      {/* Pending cancellation banner */}
      {membership.pendingCancellation && (
        <div className="membership-actions__pending-banner">
          <i className="fa-solid fa-clock"></i>
          <span>Cancellation scheduled for {membership.pendingCancellation.scheduledDate}</span>
        </div>
      )}

      {/* Paused banner */}
      {membership.status === 'paused' && (
        <div className="membership-actions__paused-banner">
          <i className="fa-solid fa-pause-circle"></i>
          <span>Membership paused until {membership.pausedUntil}</span>
        </div>
      )}

      <div className="membership-actions__groups">
        {actionGroups.map((group) => (
          <div key={group.label} className="membership-actions__group">
            <span className="membership-actions__group-label">{group.label}</span>
            <div className="membership-actions__list">
              {group.actions.map((action) => {
                const disabled = isDisabled(action)
                const reason = getDisabledReason(action)
                return (
                  <button
                    key={action.id}
                    className={`membership-actions__item ${action.variant === 'danger' ? 'membership-actions__item--danger' : ''} ${disabled ? 'membership-actions__item--disabled' : ''}`}
                    onClick={() => !disabled && handleAction(action.id)}
                    disabled={disabled}
                    title={disabled ? reason : action.label}
                  >
                    <i className={`fa-solid ${action.icon}`}></i>
                    <span>{action.label}</span>
                    <i className="fa-solid fa-chevron-right membership-actions__chevron"></i>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {activeModal === 'cancel' && (
        <CancelMembershipModal
          membership={membership}
          beneficiaries={transferableBeneficiaries}
          onClose={handleCloseModal}
          onConfirm={handleActionComplete}
        />
      )}
      {activeModal === 'renew' && (
        <RenewMembershipModal
          membership={membership}
          patronEmail={patronEmail}
          patronName={patronName}
          onClose={handleCloseModal}
          onConfirm={handleActionComplete}
        />
      )}
      {activeModal === 'pause' && (
        <PauseMembershipModal
          membership={membership}
          onClose={handleCloseModal}
          onConfirm={handleActionComplete}
        />
      )}
      {activeModal === 'extend' && (
        <ExtendMembershipModal
          membership={membership}
          onClose={handleCloseModal}
          onConfirm={handleActionComplete}
        />
      )}
      {activeModal === 'downgrade' && (
        <DowngradeMembershipModal
          membership={membership}
          patronId={patronId}
          patronEmail={patronEmail}
          patronName={patronName}
          onClose={handleCloseModal}
          onConfirm={handleActionComplete}
        />
      )}
      {activeModal === 'transfer' && (
        <TransferPrimaryModal
          membership={membership}
          patronName={patronName}
          beneficiaries={transferableBeneficiaries}
          onClose={handleCloseModal}
          onConfirm={handleActionComplete}
        />
      )}
    </div>
  )
}

export default MembershipActions
