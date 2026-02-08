import { useState } from 'react'
import OpportunitiesPanel from '../OpportunitiesPanel/OpportunitiesPanel'
import GivingSummary from '../GivingSummary/GivingSummary'
import ActivityTimeline from '../ActivityTimeline/ActivityTimeline'
import GiftDetailPanel from '../GiftDetailPanel/GiftDetailPanel'
import EngagementPanel from '../EngagementPanel/EngagementPanel'
import WealthInsights from '../WealthInsights/WealthInsights'
import SmartTips from '../SmartTips/SmartTips'
import RelationshipsSummary from '../RelationshipsSummary/RelationshipsSummary'
import { isManagedProspect, getGiftsByPatronId, getInteractionsByPatronId } from '../../data/patrons'
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
  const [selectedGift, setSelectedGift] = useState(null)

  return (
    <div className="summary-tab">
      <div className="summary-tab__main">
        {/* Left Column - Giving Summary & Activity */}
        <div className="summary-tab__left">
          <GivingSummary 
            giving={patron.giving} 
            gifts={getGiftsByPatronId(patron.id)}
            activityHistory={patron.engagement?.activityHistory}
          />
          <ActivityTimeline 
            gifts={getGiftsByPatronId(patron.id)} 
            activities={getInteractionsByPatronId(patron.id)}
            onAddActivity={onLogActivity}
            onRecordGift={onRecordGift}
            onGiftSelect={setSelectedGift}
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
          <SmartTips patron={patron} />
          <RelationshipsSummary 
            patronId={patron.id}
            onNavigateToPatron={onNavigateToPatron}
          />
        </div>
      </div>

      {selectedGift && (
        <GiftDetailPanel
          gift={selectedGift}
          onClose={() => setSelectedGift(null)}
        />
      )}
    </div>
  )
}

export default SummaryTab
