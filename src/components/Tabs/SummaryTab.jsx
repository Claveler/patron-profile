import ProspectStagePath from '../ProspectStagePath/ProspectStagePath'
import ProspectSummaryCard from '../ProspectSummaryCard/ProspectSummaryCard'
import AddToPortfolioBar from '../AddToPortfolioBar/AddToPortfolioBar'
import GivingSummary from '../GivingSummary/GivingSummary'
import ActivityTimeline from '../ActivityTimeline/ActivityTimeline'
import EngagementPanel from '../EngagementPanel/EngagementPanel'
import WealthInsights from '../WealthInsights/WealthInsights'
import SmartTips from '../SmartTips/SmartTips'
import RelationshipsSummary from '../RelationshipsSummary/RelationshipsSummary'
import { isManagedProspect } from '../../data/patrons'
import './SummaryTab.css'

function SummaryTab({ patron }) {
  const isManaged = isManagedProspect(patron)

  const handleAddToPortfolio = () => {
    // TODO: Implement portfolio assignment modal/flow
    console.log('Add to portfolio:', patron.id)
    alert(`This would open a modal to assign ${patron.firstName} ${patron.lastName} to a relationship manager.`)
  }

  return (
    <div className="summary-tab">
      {/* Pipeline Stage Path (Managed Prospects) or Add to Portfolio Bar (General Constituents) */}
      {isManaged ? (
        <ProspectStagePath 
          prospect={patron.prospect} 
          assignedTo={patron.assignedTo}
        />
      ) : (
        <AddToPortfolioBar 
          patron={patron} 
          onAddToPortfolio={handleAddToPortfolio} 
        />
      )}
      
      <div className="summary-tab__main">
        {/* Left Column - Giving Summary & Activity */}
        <div className="summary-tab__left">
          <GivingSummary giving={patron.giving} />
          <ActivityTimeline gifts={patron.giving?.gifts || []} />
        </div>
        
        {/* Right Column - Sidebar Widgets */}
        <div className="summary-tab__right">
          {isManaged && (
            <ProspectSummaryCard 
              prospect={patron.prospect} 
              giving={patron.giving}
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
