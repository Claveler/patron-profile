import GivingSummary from '../GivingSummary/GivingSummary'
import GivingHistory from '../GivingHistory/GivingHistory'
import EngagementPanel from '../EngagementPanel/EngagementPanel'
import WealthInsights from '../WealthInsights/WealthInsights'
import SmartTips from '../SmartTips/SmartTips'
import RelationshipsSummary from '../RelationshipsSummary/RelationshipsSummary'
import RecentActivity from '../RecentActivity/RecentActivity'
import './SummaryTab.css'

function SummaryTab({ patron }) {
  return (
    <div className="summary-tab">
      <div className="summary-tab__main">
        {/* Left Column - Giving Summary & Activity */}
        <div className="summary-tab__left">
          <GivingSummary giving={patron.giving} />
          <GivingHistory gifts={patron.giving?.gifts} />
          <RecentActivity />
        </div>
        
        {/* Right Column - Sidebar Widgets */}
        <div className="summary-tab__right">
          <EngagementPanel engagement={patron.engagement} />
          <WealthInsights insights={patron.wealthInsights} />
          <SmartTips />
          <RelationshipsSummary />
        </div>
      </div>
    </div>
  )
}

export default SummaryTab
