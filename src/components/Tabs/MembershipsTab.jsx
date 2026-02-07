import { useMemo } from 'react'
import MembershipOverview from '../MembershipOverview/MembershipOverview'
import MemberEvents from '../MemberEvents/MemberEvents'
import Beneficiaries from '../Beneficiaries/Beneficiaries'
import MembershipHistory from '../MembershipHistory/MembershipHistory'
import { 
  getMembershipsByPatronId, 
  getBeneficiariesByMembershipId,
  getPrimaryPatronForMembership,
  getMembershipSlotInfo,
  getPatronById
} from '../../data/patrons'
import './MembershipsTab.css'

function MembershipsTab({ 
  membership, // Legacy prop for backwards compatibility
  patronId,
  patronName, 
  patronEmail,
  onNavigateToPatron,
  onAddBeneficiary,
  onRemoveBeneficiary
}) {
  // Get memberships using new data model if patronId is provided
  const membershipData = useMemo(() => {
    if (patronId) {
      const patronMemberships = getMembershipsByPatronId(patronId)
      if (patronMemberships.length > 0) {
        // For now, just use the first membership
        const firstMembership = patronMemberships[0]
        const beneficiaries = getBeneficiariesByMembershipId(firstMembership.id)
        const primaryPatron = getPrimaryPatronForMembership(firstMembership.id)
        const slotInfo = getMembershipSlotInfo(firstMembership.id)
        
        return {
          membership: firstMembership,
          beneficiaries,
          primaryPatron,
          slotInfo,
          isPrimary: firstMembership.patronRole === 'primary',
          patronRole: firstMembership.patronRole,
          patronRoleLabel: firstMembership.patronRoleLabel
        }
      }
    }
    
    // Fallback to legacy membership prop
    if (membership) {
      return {
        membership,
        beneficiaries: membership.beneficiaries || [],
        primaryPatron: null,
        slotInfo: null,
        isPrimary: true, // Legacy data assumes primary view
        patronRole: 'primary',
        patronRoleLabel: 'Primary'
      }
    }
    
    return null
  }, [patronId, membership])

  // Empty state for patrons without membership
  if (!membershipData) {
    return (
      <div className="memberships-tab">
        <div className="memberships-tab__empty">
          <i className="fa-solid fa-id-card"></i>
          <h3>No Membership</h3>
          <p>This patron is not currently a member.</p>
        </div>
      </div>
    )
  }

  const { 
    membership: currentMembership, 
    beneficiaries, 
    primaryPatron, 
    slotInfo,
    isPrimary, 
    patronRoleLabel 
  } = membershipData

  // Get current patron data
  const currentPatron = patronId ? getPatronById(patronId) : null

  return (
    <div className="memberships-tab">
      {/* Role Banner for Beneficiaries */}
      {!isPrimary && (
        <div className="memberships-tab__role-banner">
          <div className="memberships-tab__role-banner-content">
            <i className="fa-solid fa-user-group"></i>
            <div className="memberships-tab__role-banner-text">
              <span className="memberships-tab__role-banner-title">
                This patron is {/^[aeiou]/i.test(patronRoleLabel || '') ? 'an' : 'a'} {patronRoleLabel?.toLowerCase() || 'beneficiary'} on this membership
              </span>
              {primaryPatron && (
                <span className="memberships-tab__role-banner-primary">
                  Primary account holder: {' '}
                  <button 
                    className="memberships-tab__role-banner-link"
                    onClick={() => onNavigateToPatron && onNavigateToPatron(primaryPatron.id)}
                  >
                    {primaryPatron.name}
                    <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </span>
              )}
            </div>
          </div>
          <div className="memberships-tab__role-banner-info">
            <i className="fa-solid fa-info-circle"></i>
            Membership changes must be made from the primary member's profile.
          </div>
        </div>
      )}

      <div className="memberships-tab__main">
        {/* Left Column - Overview & Events */}
        <div className="memberships-tab__left">
          {/* Membership Overview with Card, Stats, Benefits */}
          <MembershipOverview 
            membership={currentMembership} 
            patronName={patronName || (currentPatron ? `${currentPatron.firstName} ${currentPatron.lastName}` : '')} 
            patronEmail={patronEmail || currentPatron?.email}
            patronPhoto={currentPatron?.photo}
            isPrimary={isPrimary}
          />
          
          {/* Member Events (Early Access + Exclusive) */}
          {currentMembership.memberEvents && (
            <MemberEvents events={currentMembership.memberEvents} />
          )}
        </div>
        
        {/* Right Column - Beneficiaries, History */}
        <div className="memberships-tab__right">
          {/* Beneficiaries */}
          <Beneficiaries 
            beneficiaries={beneficiaries}
            currentPatronId={patronId}
            isPrimary={isPrimary}
            slotInfo={slotInfo}
            onNavigateToPatron={onNavigateToPatron}
            onAddBeneficiary={onAddBeneficiary}
            onRemoveBeneficiary={onRemoveBeneficiary}
          />
          
          {/* Membership History */}
          <MembershipHistory history={currentMembership.membershipHistory || currentMembership.history} />
        </div>
      </div>
    </div>
  )
}

export default MembershipsTab
