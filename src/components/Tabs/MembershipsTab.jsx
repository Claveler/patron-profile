import { useMemo, useState } from 'react'
import MembershipOverview from '../MembershipOverview/MembershipOverview'
import MemberEvents from '../MemberEvents/MemberEvents'
import Beneficiaries from '../Beneficiaries/Beneficiaries'
import MembershipActions from '../MembershipActions/MembershipActions'
import MembershipHistory from '../MembershipHistory/MembershipHistory'
import CompMembershipModal from '../CompMembershipModal/CompMembershipModal'
import { 
  getMembershipsByPatronId, 
  getBeneficiariesByMembershipId,
  getPrimaryPatronForMembership,
  getMembershipSlotInfo,
  getPatronById,
  membershipPrograms,
  tierConfig,
  getMembershipPurchaseLink,
  getMembershipNudge
} from '../../data/patrons'
import './MembershipsTab.css'

// Format currency helper
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

function MembershipsTab({ 
  membership, // Legacy prop for backwards compatibility
  patronId,
  patronName, 
  patronEmail,
  refreshKey,
  onNavigateToPatron,
  onAddBeneficiary,
  onRemoveBeneficiary,
  onReorderBeneficiaries,
  onSettingsUpdate
}) {
  const [selectedTier, setSelectedTier] = useState(null)
  const [linkCopied, setLinkCopied] = useState(false)
  const [showCompModal, setShowCompModal] = useState(false)

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
  }, [patronId, membership, refreshKey])

  // Copy payment link to clipboard
  const handleCopyLink = async (link) => {
    try {
      await navigator.clipboard.writeText(link)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  // Open email client with pre-filled membership link
  const handleSendEmail = (program, link) => {
    const name = patronName || 'there'
    const subject = encodeURIComponent(`Join our ${program.tier} Membership`)
    const body = encodeURIComponent(
`Hi ${name},

We'd love to invite you to become a ${program.tier} member!

${program.tier} Membership — ${formatCurrency(program.price)}/${program.period}
${program.highlights.map(h => `  - ${h}`).join('\n')}

Click the link below to get started:
${link}

If you have any questions, please don't hesitate to reach out.

Best regards`
    )
    window.open(`mailto:${patronEmail || ''}?subject=${subject}&body=${body}`, '_blank')
  }

  // Empty state for patrons without membership
  if (!membershipData) {
    const patron = patronId ? getPatronById(patronId) : null
    const nudge = getMembershipNudge(patron)

    return (
      <div className="memberships-tab">
        {/* Behavioral Nudge Banner */}
        {nudge && (
          <div className={`memberships-tab__nudge-banner memberships-tab__nudge-banner--${nudge.strength}`}>
            <div className="memberships-tab__nudge-banner-content">
              <i className={`fa-solid ${nudge.strength === 'high' ? 'fa-fire' : nudge.strength === 'medium' ? 'fa-chart-line' : 'fa-lightbulb'}`}></i>
              <div className="memberships-tab__nudge-banner-text">
                <span className="memberships-tab__nudge-banner-title">Membership opportunity</span>
                <span className="memberships-tab__nudge-banner-message">{nudge.message}</span>
              </div>
            </div>
          </div>
        )}

        {/* Available Membership Programs */}
        <div className="memberships-tab__programs-section">
          <div className="memberships-tab__programs-header">
            <h4 className="memberships-tab__programs-title">
              <i className="fa-solid fa-id-card"></i>
              Available membership programs
            </h4>
            <p className="memberships-tab__programs-subtitle">
              Select a tier to generate a purchase link for this patron.
            </p>
          </div>

          <div className="memberships-tab__programs-grid">
            {membershipPrograms.map((program) => {
              const config = tierConfig[program.tier]
              const isSelected = selectedTier === program.id
              const paymentLink = getMembershipPurchaseLink(patronId, program.tier)

              return (
                <div key={program.id} className={`memberships-tab__program-card ${isSelected ? 'memberships-tab__program-card--selected' : ''}`}>
                  {/* Colored top accent */}
                  <div 
                    className="memberships-tab__program-card-accent"
                    style={{ backgroundColor: config?.cardStyle?.backgroundColor || '#666' }}
                  />

                  <div className="memberships-tab__program-card-body">
                    {/* Tier header */}
                    <div className="memberships-tab__program-card-header">
                      <div className="memberships-tab__program-card-tier">
                        <i className={program.icon}></i>
                        <span>{program.tier}</span>
                      </div>
                      <div className="memberships-tab__program-card-price">
                        {formatCurrency(program.price)}<span>/{program.period}</span>
                      </div>
                    </div>

                    {/* Tagline */}
                    <p className="memberships-tab__program-card-tagline">{program.tagline}</p>

                    {/* Highlights */}
                    <ul className="memberships-tab__program-highlights">
                      {program.highlights.map((highlight, idx) => (
                        <li key={idx}>
                          <i className="fa-solid fa-check"></i>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Send Link Button */}
                    <button 
                      className="memberships-tab__program-card-btn"
                      onClick={() => setSelectedTier(isSelected ? null : program.id)}
                    >
                      <i className={`fa-solid ${isSelected ? 'fa-chevron-up' : 'fa-paper-plane'}`}></i>
                      {isSelected ? 'Close' : 'Send membership link'}
                    </button>
                  </div>

                  {/* Inline Send Link Section (expanded) */}
                  {isSelected && (
                    <div className="memberships-tab__send-link">
                      <label className="memberships-tab__send-link-label">Payment link</label>
                      <div className="memberships-tab__send-link-input-wrapper">
                        <input
                          type="text"
                          className="memberships-tab__send-link-input"
                          value={paymentLink}
                          readOnly
                          onClick={(e) => e.target.select()}
                        />
                        <button
                          className={`memberships-tab__send-link-copy ${linkCopied ? 'memberships-tab__send-link-copy--copied' : ''}`}
                          onClick={() => handleCopyLink(paymentLink)}
                        >
                          <i className={`fa-solid ${linkCopied ? 'fa-check' : 'fa-copy'}`}></i>
                          {linkCopied ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <button 
                        className="memberships-tab__send-link-email"
                        onClick={() => handleSendEmail(program, paymentLink)}
                      >
                        <i className="fa-solid fa-envelope"></i>
                        Send via email
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Comp / Gift option */}
          <div className="memberships-tab__comp-option">
            <span className="memberships-tab__comp-divider">or</span>
            <button
              className="memberships-tab__comp-btn"
              onClick={() => setShowCompModal(true)}
            >
              <i className="fa-solid fa-gift"></i>
              Issue complimentary membership
            </button>
          </div>
        </div>

        {/* Comp Membership Modal */}
        {showCompModal && (
          <CompMembershipModal
            patronId={patronId}
            patronName={patronName}
            onClose={() => setShowCompModal(false)}
            onConfirm={() => {
              setShowCompModal(false)
              onSettingsUpdate && onSettingsUpdate()
            }}
          />
        )}
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
            onUpdate={onSettingsUpdate}
          />
          
          {/* Member Events (Early Access + Exclusive) */}
          {currentMembership.memberEvents && (
            <MemberEvents events={currentMembership.memberEvents} />
          )}
        </div>
        
        {/* Right Column - Beneficiaries, Actions, History */}
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
            onReorderBeneficiaries={onReorderBeneficiaries}
          />

          {/* Membership Actions (primary only) */}
          <MembershipActions
            membership={currentMembership}
            patronId={patronId}
            patronName={patronName || (currentPatron ? `${currentPatron.firstName} ${currentPatron.lastName}` : '')}
            patronEmail={patronEmail || currentPatron?.email}
            isPrimary={isPrimary}
            beneficiaries={beneficiaries}
            onUpdate={onSettingsUpdate}
          />
          
          {/* Membership History */}
          <MembershipHistory history={currentMembership.membershipHistory || currentMembership.history} />
        </div>
      </div>
    </div>
  )
}

export default MembershipsTab
