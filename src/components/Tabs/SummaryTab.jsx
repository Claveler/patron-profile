import OpportunitiesPanel from '../OpportunitiesPanel/OpportunitiesPanel'
import AddToPortfolioBar from '../AddToPortfolioBar/AddToPortfolioBar'
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
  onLogActivity 
}) {
  const isManaged = isManagedProspect(patron)

  const handleAddToPortfolio = () => {
    // TODO: Implement portfolio assignment modal/flow
    console.log('Add to portfolio:', patron.id)
    alert(`This would open a modal to assign ${patron.firstName} ${patron.lastName} to a relationship manager.`)
  }

  return (
    <div className="summary-tab">
      {/* Add to Portfolio Bar for General Constituents */}
      {!isManaged && (
        <AddToPortfolioBar 
          patron={patron} 
          onAddToPortfolio={handleAddToPortfolio} 
        />
      )}
      
      <div className="summary-tab__main">
        {/* Left Column - Giving Summary & Activity */}
        <div className="summary-tab__left">
          <GivingSummary 
            giving={patron.giving} 
            onRecordGift={onRecordGift}
          />
          <ActivityTimeline 
            gifts={patron.giving?.gifts || []} 
            onAddActivity={onLogActivity}
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
          <RelationshipsSummary />
        </div>
      </div>
    </div>
  )
}

export default SummaryTab
