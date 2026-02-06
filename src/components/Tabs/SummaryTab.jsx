import OpportunitiesPanel from '../OpportunitiesPanel/OpportunitiesPanel'
import GivingSummary from '../GivingSummary/GivingSummary'
import ActivityTimeline from '../ActivityTimeline/ActivityTimeline'
import EngagementPanel from '../EngagementPanel/EngagementPanel'
import WealthInsights from '../WealthInsights/WealthInsights'
import SmartTips from '../SmartTips/SmartTips'
import RelationshipsSummary from '../RelationshipsSummary/RelationshipsSummary'
import { isManagedProspect } from '../../data/patrons'
import './SummaryTab.css'

function SummaryTab({ 
  patron, 
  onSelectOpportunity, 
  onCreateOpportunity,
  onRecordGift,
  onLogActivity,
  onNavigateToPatron
}) {
  const isManaged = isManagedProspect(patron)

  return (
    <div className="summary-tab">
      <div className="summary-tab__main">
        {/* Left Column - Giving Summary & Activity */}
        <div className="summary-tab__left">
          <GivingSummary giving={patron.giving} />
          <ActivityTimeline 
            gifts={patron.giving?.gifts || []} 
            onAddActivity={onLogActivity}
            onRecordGift={onRecordGift}
          />
        </div>
        
        {/* Right Column - Sidebar Widgets */}
        <div className="summary-tab__right">
          {isManaged && (
            <OpportunitiesPanel 
              patronId={patron.id}
              onSelectOpportunity={onSelectOpportunity}
              onCreateOpportunity={onCreateOpportunity}
            />
          )}
          <EngagementPanel engagement={patron.engagement} />
          <WealthInsights insights={patron.wealthInsights} />
          <SmartTips />
          <RelationshipsSummary 
            patronId={patron.id}
            onNavigateToPatron={onNavigateToPatron}
          />
        </div>
      </div>
    </div>
  )
}

export default SummaryTab
