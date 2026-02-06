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

function SummaryTab({ patron, onSelectOpportunity }) {
  const isManaged = isManagedProspect(patron)

  const handleAddToPortfolio = () => {
    // TODO: Implement portfolio assignment modal/flow
    console.log('Add to portfolio:', patron.id)
    alert(`This would open a modal to assign ${patron.firstName} ${patron.lastName} to a relationship manager.`)
  }

  const handleCreateOpportunity = (patronId) => {
    // TODO: Implement opportunity creation modal/flow
    console.log('Create opportunity for:', patronId)
    alert(`This would open a modal to create an opportunity for ${patron.firstName} ${patron.lastName}.`)
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
          <GivingSummary giving={patron.giving} />
          <ActivityTimeline gifts={patron.giving?.gifts || []} />
        </div>
        
        {/* Right Column - Sidebar Widgets */}
        <div className="summary-tab__right">
          {isManaged && (
            <OpportunitiesPanel 
              patronId={patron.id}
              onSelectOpportunity={onSelectOpportunity}
              onCreateOpportunity={handleCreateOpportunity}
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
