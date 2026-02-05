import MembershipOverview from '../MembershipOverview/MembershipOverview'
import MemberEvents from '../MemberEvents/MemberEvents'
import Beneficiaries from '../Beneficiaries/Beneficiaries'
import MembershipHistory from '../MembershipHistory/MembershipHistory'
import './MembershipsTab.css'

function MembershipsTab({ membership, patronName, patronEmail }) {
  return (
    <div className="memberships-tab">
      <div className="memberships-tab__main">
        {/* Left Column - Overview & Events */}
        <div className="memberships-tab__left">
          {/* Membership Overview with Card, Stats, Benefits */}
          <MembershipOverview 
            membership={membership} 
            patronName={patronName} 
            patronEmail={patronEmail} 
          />
          
          {/* Member Events (Early Access + Exclusive) */}
          <MemberEvents events={membership.memberEvents} />
        </div>
        
        {/* Right Column - Beneficiaries, History */}
        <div className="memberships-tab__right">
          {/* Beneficiaries */}
          <Beneficiaries beneficiaries={membership.beneficiaries} />
          
          {/* Membership History */}
          <MembershipHistory history={membership.membershipHistory} />
        </div>
      </div>
    </div>
  )
}

export default MembershipsTab
