import { useState, useContext } from 'react'
import { GuideContext } from '../../App'
import { EPIC_SCOPE, isInScope } from '../../data/epicScope'
import { useEpicScope } from '../../hooks/useEpicScope'
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
  onNavigateToPatron,
  onViewRelationships
}) {
  const isManaged = isManagedProspect(patron)
  const [selectedGift, setSelectedGift] = useState(null)
  const { activeEpic } = useContext(GuideContext)
  const { filterGifts } = useEpicScope()

  const allGifts = getGiftsByPatronId(patron.id)
  const gifts = filterGifts(allGifts)

  const sc = EPIC_SCOPE.summaryComponents
  const showGiving = isInScope(sc.GivingSummary, activeEpic)
  const showOpportunities = isInScope(sc.OpportunitiesPanel, activeEpic)
  const showEngagement = isInScope(sc.EngagementPanel, activeEpic)
  const showTimeline = isInScope(sc.ActivityTimeline, activeEpic)
  const showRelationships = isInScope(sc.RelationshipsSummary, activeEpic)
  const showWealth = isInScope(sc.WealthInsights, activeEpic)
  const showSmartTips = isInScope(sc.SmartTips, activeEpic)

  return (
    <div className="summary-tab">
      <div className="summary-tab__main">
        {/* Left Column - Giving Summary & Activity */}
        <div className="summary-tab__left">
          {showGiving && (
            <GivingSummary 
              giving={patron.giving} 
              gifts={gifts}
              activityHistory={patron.engagement?.activityHistory}
            />
          )}
          {showTimeline && (
            <ActivityTimeline 
              gifts={gifts} 
              activities={getInteractionsByPatronId(patron.id)}
              onAddActivity={onLogActivity}
              onRecordGift={onRecordGift}
              onGiftSelect={setSelectedGift}
            />
          )}
        </div>
        
        {/* Right Column - Sidebar Widgets */}
        <div className="summary-tab__right">
          {showOpportunities && isManaged && (
            <OpportunitiesPanel 
              patronId={patron.id}
              onSelectOpportunity={onSelectOpportunity}
              onCreateOpportunity={onCreateOpportunity}
            />
          )}
          {showEngagement && (
            <EngagementPanel engagement={patron.engagement} />
          )}
          {showWealth && (
            <WealthInsights insights={patron.wealthInsights} />
          )}
          {showSmartTips && (
            <SmartTips patron={patron} />
          )}
          {showRelationships && (
            <RelationshipsSummary 
              patronId={patron.id}
              onNavigateToPatron={onNavigateToPatron}
              onViewRelationships={onViewRelationships}
            />
          )}
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
