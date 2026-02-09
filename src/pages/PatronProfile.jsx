import { useState, useEffect, useMemo, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { GuideContext } from '../App'
import { EPIC_SCOPE, isInScope } from '../data/epicScope'
import PatronInfoBox from '../components/PatronInfoBox/PatronInfoBox'
import TabNavigation from '../components/TabNavigation/TabNavigation'
import SummaryTab from '../components/Tabs/SummaryTab'
import GivingTab from '../components/Tabs/GivingTab'
import MembershipsTab from '../components/Tabs/MembershipsTab'
import DocumentsTab from '../components/Tabs/DocumentsTab'
import OpportunityModal from '../components/OpportunityModal/OpportunityModal'
import GiftModal from '../components/GiftModal/GiftModal'
import ActivityModal from '../components/ActivityModal/ActivityModal'
import AssignPortfolioModal from '../components/AssignPortfolioModal/AssignPortfolioModal'
import AddBeneficiaryModal from '../components/AddBeneficiaryModal/AddBeneficiaryModal'
import RemoveBeneficiaryModal from '../components/RemoveBeneficiaryModal/RemoveBeneficiaryModal'
import ActivityTimeline from '../components/ActivityTimeline/ActivityTimeline'
import GiftDetailPanel from '../components/GiftDetailPanel/GiftDetailPanel'
import RelationshipsTab from '../components/RelationshipsTab/RelationshipsTab'
import AddRelationshipModal from '../components/AddRelationshipModal/AddRelationshipModal'
import EndRelationshipModal from '../components/EndRelationshipModal/EndRelationshipModal'
import EditHouseholdModal from '../components/EditHouseholdModal/EditHouseholdModal'
import ProfileTab from '../components/Tabs/ProfileTab'
import { getPatronById, isManagedProspect, archivePatron, restorePatron, updatePatronTags, getMembershipsByPatronId, getPrimaryPatronForMembership, getGiftsByPatronId, getInteractionsByPatronId, hasHouseholdRelationship, reorderBeneficiaries, getHouseholdForPatron, getHouseholdMembers, deleteHousehold } from '../data/patrons'
import './PatronProfile.css'

const tabs = [
  { id: 'summary', label: 'Summary' },
  { id: 'giving', label: 'Giving' },
  { id: 'memberships', label: 'Memberships' },
  { id: 'profile', label: 'Profile' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'relationships', label: 'Relationships' },
  { id: 'documents', label: 'Documents' },
]

// Default/fallback patron data (Anderson Collingwood) for backwards compatibility
const defaultPatronData = {
  id: '7962415',
  firstName: 'Anderson',
  lastName: 'Collingwood',
  photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  household: {
    name: 'Collingwood Family',
    verified: true
  },
  category: 'Member',
  email: 'anderson.collingwood@gmail.com',
  phone: '(415) 555-4567',
  address: '45 Paradise Dr, Tiburon, CA 94920',
  // Membership data now comes from normalized memberships[] via getPrimaryMembershipForPatron()
  assignedToId: 'lj',
  engagement: {
    level: 'on-fire', // cold, cool, warm, hot, on-fire
    visits: 54,
    lastVisit: '2025-11-19',
    // Activity data for heatmap - Trailing Twelve Months (TTM)
    // Structure: 12 months × 4 weeks per month = 48 data points
    // Each month: { month: 'YYYY-MM', weeks: [week1, week2, week3, week4] }
    // Each week: { activities: [{ type, count, value }] }
    activityHistory: [
      // Feb 2025 (oldest)
      { month: '2025-02', weeks: [
        { activities: [{ type: 'attendance', count: 1 }] },
        { activities: [] },
        { activities: [{ type: 'attendance', count: 2 }] },
        { activities: [{ type: 'purchase', count: 1, value: 35 }] }
      ]},
      // Mar 2025
      { month: '2025-03', weeks: [
        { activities: [] },
        { activities: [{ type: 'attendance', count: 1 }] },
        { activities: [{ type: 'gift', count: 1, value: 750 }] },
        { activities: [{ type: 'attendance', count: 2 }, { type: 'purchase', count: 1, value: 45 }] }
      ]},
      // Apr 2025
      { month: '2025-04', weeks: [
        { activities: [{ type: 'attendance', count: 1 }] },
        { activities: [] },
        { activities: [] },
        { activities: [{ type: 'attendance', count: 1 }] }
      ]},
      // May 2025
      { month: '2025-05', weeks: [
        { activities: [] },
        { activities: [{ type: 'attendance', count: 2 }] },
        { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 2, value: 78 }] },
        { activities: [] }
      ]},
      // Jun 2025
      { month: '2025-06', weeks: [
        { activities: [{ type: 'attendance', count: 1 }] },
        { activities: [{ type: 'gift', count: 1, value: 500 }, { type: 'attendance', count: 3 }] },
        { activities: [{ type: 'attendance', count: 2 }] },
        { activities: [{ type: 'purchase', count: 1, value: 25 }] }
      ]},
      // Jul 2025
      { month: '2025-07', weeks: [
        { activities: [] },
        { activities: [] },
        { activities: [{ type: 'attendance', count: 1 }] },
        { activities: [] }
      ]},
      // Aug 2025
      { month: '2025-08', weeks: [
        { activities: [] },
        { activities: [{ type: 'attendance', count: 1 }] },
        { activities: [] },
        { activities: [{ type: 'attendance', count: 2 }] }
      ]},
      // Sep 2025
      { month: '2025-09', weeks: [
        { activities: [{ type: 'attendance', count: 1 }] },
        { activities: [{ type: 'purchase', count: 1, value: 42 }] },
        { activities: [{ type: 'attendance', count: 2 }] },
        { activities: [{ type: 'attendance', count: 1 }] }
      ]},
      // Oct 2025
      { month: '2025-10', weeks: [
        { activities: [{ type: 'attendance', count: 2 }] },
        { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 55 }] },
        { activities: [{ type: 'attendance', count: 3 }] },
        { activities: [{ type: 'gift', count: 1, value: 200 }] }
      ]},
      // Nov 2025
      { month: '2025-11', weeks: [
        { activities: [{ type: 'attendance', count: 2 }, { type: 'purchase', count: 1, value: 45 }] },
        { activities: [] },
        { activities: [{ type: 'attendance', count: 1 }] },
        { activities: [{ type: 'attendance', count: 4 }, { type: 'purchase', count: 2, value: 89 }] }
      ]},
      // Dec 2025
      { month: '2025-12', weeks: [
        { activities: [{ type: 'membership', count: 1, value: 145.99 }] },
        { activities: [{ type: 'attendance', count: 2 }] },
        { activities: [{ type: 'gift', count: 1, value: 1000 }, { type: 'attendance', count: 3 }] },
        { activities: [{ type: 'attendance', count: 4 }, { type: 'purchase', count: 3, value: 156 }] }
      ]},
      // Jan 2026 (most recent)
      { month: '2026-01', weeks: [
        { activities: [{ type: 'attendance', count: 2 }] },
        { activities: [] },
        { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 32 }] },
        { activities: [{ type: 'attendance', count: 3 }, { type: 'gift', count: 1, value: 250 }] }
      ]}
    ]
  },
  // Note: Pipeline stages are now tracked on Opportunities, not patrons
  // See src/data/opportunities.js for opportunity records
  giving: {
    // Aggregate totals
    lifetimeValue: 19231.97,     // Total financial relationship (gifts + revenue)
    totalGifts: 16681.97,        // Charitable gifts (tax-deductible)
    revenue: 2550.00,            // Earned income (tickets, F&B, merch)
    giftCount: 16,               // Number of gift transactions
    averageGift: 1042.62,        // Average gift amount (gifts-only)
    
    // Aggregates by fund
    byFund: {
      'annual-operating': { name: 'Annual Operating', total: 12181.97, count: 12 },
      'restricted': { name: 'Restricted Funds', total: 750.00, count: 1 },
      'capital-building': { name: 'Capital Building', total: 3750.00, count: 3 }
    },
    
    // Aggregates by campaign
    byCampaign: {
      'annual-2026': { name: '2026 Annual Fund', total: 7945.99, count: 7, goal: 500000 },
      'building-future': { name: 'Building the Future', total: 3750.00, count: 3, goal: 50000000 },
      'annual-2025': { name: '2025 Annual Fund', total: 4145.99, count: 4, goal: 450000 },
      'emergency-2024': { name: 'Emergency Relief Fund', total: 750.00, count: 1, goal: 100000 }
    },
    
    // Aggregates by year
    byYear: {
      2026: { total: 2600.00, count: 2 },
      2025: { total: 9095.99, count: 8 },
      2024: { total: 4895.99, count: 5 },
      2023: { total: 89.99, count: 1 }
    },
    
    // Transaction highlights
    firstTransaction: { amount: 89.99, date: '2023-12-02' },
    lastTransaction: { amount: 2500.00, date: '2026-01-28' },
    largestTransaction: { amount: 2500.00, date: '2024-12-18' }
  },
  wealthInsights: {
    propensityScore: 'DSI-3',
    description: 'Real estate holdings in Marin County valued at $2.8 million, business executive at a firm with revenues of $5-10 million.'
  },
  taxDocuments: {
    organization: {
      name: 'Fonck Museum',
      ein: '12-3456789',
      address: '100 Bridgeway, Sausalito, CA 94965'
    },
    yearEndSummaries: [
      { year: 2025, generated: '2026-01-15', sent: true, sentDate: '2026-01-15', method: 'email' },
      { year: 2024, generated: '2025-01-12', sent: true, sentDate: '2025-01-12', method: 'email' },
      { year: 2023, generated: '2024-01-10', sent: true, sentDate: '2024-01-10', method: 'email' }
    ],
    receipts: [
      { id: 1, date: '2024-12-18', type: 'one-time', description: 'Year-End Major Gift', amount: 2500.00, deductible: 2500.00, benefitsValue: 0, campaign: '2025 Annual Fund', appeal: 'Year-End Direct Mail' },
      { id: 2, date: '2025-06-15', type: 'one-time', description: 'Spring Gala Sponsorship', amount: 2500.00, deductible: 2100.00, benefitsValue: 400.00, campaign: '2026 Annual Fund', appeal: 'Spring Gala 2026' },
      { id: 3, date: '2025-12-02', type: 'membership', description: 'Gold Membership Renewal', amount: 145.99, deductible: 95.99, benefitsValue: 50.00, campaign: '2026 Annual Fund', appeal: 'Membership Renewal' },
      { id: 4, date: '2025-06-15', type: 'pledge-payment', description: 'Building Campaign - Q1 Payment', amount: 1250.00, deductible: 1250.00, benefitsValue: 0, campaign: 'Building the Future', appeal: 'Leadership Gifts Circle' },
      { id: 5, date: '2025-12-20', type: 'one-time', description: 'Year-End Major Gift', amount: 2500.00, deductible: 2500.00, benefitsValue: 0, campaign: '2026 Annual Fund', appeal: 'Year-End Direct Mail' }
    ],
    inKindGifts: []
  }
}

function PatronProfile() {
  const { patronId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('summary')
  const [refreshKey, setRefreshKey] = useState(0)
  const { setGuideTab, activeEpic } = useContext(GuideContext)

  // Filter tabs based on the active epic scope
  const visibleTabs = useMemo(() => {
    return tabs.filter(tab => {
      const minEpic = EPIC_SCOPE.patronTabs[tab.id]
      return minEpic == null || isInScope(minEpic, activeEpic)
    })
  }, [activeEpic])

  // Reset to 'summary' if the active tab is no longer visible
  useEffect(() => {
    if (!visibleTabs.find(t => t.id === activeTab)) {
      setActiveTab('summary')
    }
  }, [visibleTabs, activeTab])

  // Scroll to top whenever the active tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  // Report active tab to Product Guide context
  useEffect(() => {
    setGuideTab(activeTab)
    return () => setGuideTab(null)
  }, [activeTab, setGuideTab]);
  
  // Modal states (managed at profile level for access from InfoBox and tabs)
  const [showOpportunityModal, setShowOpportunityModal] = useState(false)
  const [showGiftModal, setShowGiftModal] = useState(false)
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showAddBeneficiaryModal, setShowAddBeneficiaryModal] = useState(false)
  const [showRemoveBeneficiaryModal, setShowRemoveBeneficiaryModal] = useState(false)
  const [beneficiaryToRemove, setBeneficiaryToRemove] = useState(null)
  const [showAddRelationshipModal, setShowAddRelationshipModal] = useState(false)
  const [addRelationshipType, setAddRelationshipType] = useState(null)
  const [showEndRelationshipModal, setShowEndRelationshipModal] = useState(false)
  const [relationshipToEnd, setRelationshipToEnd] = useState(null)
  const [relationshipRefreshKey, setRelationshipRefreshKey] = useState(0)
  const [showEditHouseholdModal, setShowEditHouseholdModal] = useState(false)
  const [selectedTimelineGift, setSelectedTimelineGift] = useState(null)

  // Get patron data from store, fallback to default if not found
  const patronData = useMemo(() => {
    if (patronId) {
      const patron = getPatronById(patronId)
      if (patron) return patron
    }
    // Fallback to default patron (Anderson Collingwood full data)
    return defaultPatronData
  }, [patronId])

  // Determine if this is a Managed Prospect or General Constituent
  const isManaged = isManagedProspect(patronData)
  
  const patronFullName = `${patronData.firstName} ${patronData.lastName}`

  // Get membership data for beneficiary modals
  const membershipData = useMemo(() => {
    const memberships = getMembershipsByPatronId(patronData.id)
    if (memberships.length > 0) {
      const membership = memberships[0]
      const primaryPatron = getPrimaryPatronForMembership(membership.id)
      return {
        membershipId: membership.id,
        primaryPatronId: primaryPatron ? primaryPatron.id : patronData.id,
        primaryPatronName: primaryPatron ? primaryPatron.name : patronFullName
      }
    }
    return null
  }, [patronData.id, patronFullName, refreshKey])

  // Modal handlers
  const handleCreateOpportunity = () => setShowOpportunityModal(true)
  const handleRecordGift = () => setShowGiftModal(true)
  const handleLogActivity = () => setShowActivityModal(true)
  const handleAssignToPortfolio = () => setShowAssignModal(true)
  
  const handleOpportunitySuccess = (newOpportunity) => {
    console.log('Created opportunity:', newOpportunity)
    // In a real app, this would refresh the data
  }
  
  const handleGiftSuccess = (newGift) => {
    console.log('Recorded gift:', newGift)
    // In a real app, this would refresh the giving summary
  }
  
  const handleActivitySuccess = (newActivity) => {
    console.log('Logged activity:', newActivity)
    // In a real app, this would refresh the timeline
  }

  const handleAssignSuccess = (result) => {
    console.log('Assigned to portfolio:', result)
    // In a real app, this would refresh the patron data to reflect new assignment
  }

  const handleArchive = () => {
    archivePatron(patronData.id)
    console.log('Archived patron:', patronData.id)
    // Navigate back to patrons list after archiving
    navigate('/patrons')
  }

  const handleRestore = () => {
    restorePatron(patronData.id)
    console.log('Restored patron:', patronData.id)
    // Force re-render by updating a key or refreshing data
    window.location.reload() // Simple approach for demo
  }

  const handleUpdateTags = (newTags) => {
    updatePatronTags(patronData.id, newTags)
    console.log('Updated tags:', newTags)
    // Force re-render to show updated tags
    window.location.reload() // Simple approach for demo
  }

  // Beneficiary management handlers
  const handleAddBeneficiary = () => setShowAddBeneficiaryModal(true)

  const handleRemoveBeneficiary = (beneficiary) => {
    setBeneficiaryToRemove(beneficiary)
    setShowRemoveBeneficiaryModal(true)
  }

  const handleBeneficiarySuccess = () => {
    console.log('Beneficiary updated')
    // Increment refreshKey to trigger re-render without page reload (preserves active tab)
    setRefreshKey(k => k + 1)
  }

  const handleReorderBeneficiaries = (orderedPatronIds) => {
    if (membershipData) {
      reorderBeneficiaries(membershipData.membershipId, orderedPatronIds)
      setRefreshKey(k => k + 1)
    }
  }

  // Household data for the edit modal
  const householdData = useMemo(() => getHouseholdForPatron(patronData.id), [patronData.id, relationshipRefreshKey])
  const householdMembersData = useMemo(() => {
    if (!householdData) return []
    return getHouseholdMembers(householdData.id)
  }, [householdData, relationshipRefreshKey])

  const handleEditHousehold = () => {
    setShowEditHouseholdModal(true)
  }

  const handleDeleteHousehold = (householdId) => {
    deleteHousehold(householdId)
    setShowEditHouseholdModal(false)
    handleRelationshipSuccess()
  }

  // Relationship management handlers
  const handleAddRelationship = (preselectedType = null) => {
    setAddRelationshipType(preselectedType)
    setShowAddRelationshipModal(true)
  }

  const handleEndRelationship = (relationship) => {
    setRelationshipToEnd(relationship)
    setShowEndRelationshipModal(true)
  }

  const handleRelationshipSuccess = () => {
    console.log('Relationship updated')
    setRelationshipRefreshKey(k => k + 1) // Force RelationshipsTab remount with fresh data
  }

  const handleNavigateToOpportunity = (opportunityId) => {
    navigate(`/opportunities/${opportunityId}`)
  }

  const handleNavigateToPatron = (id) => {
    navigate(`/patrons/${id}`)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'summary':
        return (
          <SummaryTab 
            patron={patronData} 
            onSelectOpportunity={handleNavigateToOpportunity}
            onCreateOpportunity={handleCreateOpportunity}
            onRecordGift={handleRecordGift}
            onLogActivity={handleLogActivity}
            onNavigateToPatron={handleNavigateToPatron}
            onViewRelationships={() => setActiveTab('relationships')}
          />
        )
      case 'giving':
        return (
          <GivingTab patronId={patronData.id} onRecordGift={handleRecordGift} />
        )
      case 'memberships':
        return (
          <MembershipsTab 
            patronId={patronData.id}
            patronName={patronFullName} 
            patronEmail={patronData.email}
            refreshKey={refreshKey}
            onNavigateToPatron={handleNavigateToPatron}
            onAddBeneficiary={handleAddBeneficiary}
            onRemoveBeneficiary={handleRemoveBeneficiary}
            onReorderBeneficiaries={handleReorderBeneficiaries}
            onSettingsUpdate={() => setRefreshKey(k => k + 1)}
          />
        )
      case 'profile':
        return (
          <ProfileTab
            patron={patronData}
            onPatronUpdate={() => setRefreshKey(k => k + 1)}
            onSwitchTab={setActiveTab}
            onAddRelationship={handleAddRelationship}
          />
        )
      case 'timeline':
        return (
          <ActivityTimeline
            gifts={getGiftsByPatronId(patronData.id)}
            activities={getInteractionsByPatronId(patronData.id)}
            onAddActivity={handleLogActivity}
            onRecordGift={handleRecordGift}
            onGiftSelect={setSelectedTimelineGift}
            variant="full"
          />
        )
      case 'relationships':
        return (
          <RelationshipsTab
            key={relationshipRefreshKey}
            patronId={patronData.id}
            onNavigateToPatron={handleNavigateToPatron}
            onAddRelationship={handleAddRelationship}
            onEndRelationship={handleEndRelationship}
            onEditHousehold={handleEditHousehold}
          />
        )
      case 'documents':
        return <DocumentsTab patron={patronData} />
      default:
        return (
          <SummaryTab 
            patron={patronData}
            onCreateOpportunity={handleCreateOpportunity}
            onRecordGift={handleRecordGift}
            onLogActivity={handleLogActivity}
            onNavigateToPatron={handleNavigateToPatron}
            onViewRelationships={() => setActiveTab('relationships')}
          />
        )
    }
  }

  return (
    <div className="patron-profile">
      {/* Page Header / Breadcrumb */}
      <div className="patron-profile__header">
        <div className="patron-profile__breadcrumb">
          <span className="patron-profile__breadcrumb-section">Fundraising</span>
          <i className="fa-solid fa-chevron-right patron-profile__breadcrumb-separator"></i>
          <button 
            className="patron-profile__breadcrumb-link"
            onClick={() => navigate(-1)}
          >
            Patrons
          </button>
          <i className="fa-solid fa-chevron-right patron-profile__breadcrumb-separator"></i>
        </div>
        <div className="patron-profile__title-row">
          <h1 className="patron-profile__title">
            <span className="patron-profile__first-name">{patronData.firstName}</span>{' '}
            <span className="patron-profile__last-name">{patronData.lastName}</span>
          </h1>
          {isManaged && (
            <span className="patron-profile__badge patron-profile__badge--managed">
              <i className="fa-solid fa-user-tie"></i>
              Managed Prospect
            </span>
          )}
          {!isManaged && (
            <span className="patron-profile__badge patron-profile__badge--general">
              <i className="fa-solid fa-user"></i>
              General Constituent
            </span>
          )}
        </div>
      </div>

      {/* Main Content Container */}
      <div className="patron-profile__container">
        {/* Patron Info Box */}
        <PatronInfoBox 
          patron={patronData} 
          isManaged={isManaged}
          onCreateOpportunity={handleCreateOpportunity}
          onAddActivity={handleLogActivity}
          onRecordGift={handleRecordGift}
          onAssignToPortfolio={handleAssignToPortfolio}
          onArchive={handleArchive}
          onRestore={handleRestore}
          onUpdateTags={handleUpdateTags}
          onNavigateToPatron={handleNavigateToPatron}
        />

        {/* Tab Section */}
        <div className="patron-profile__tabs-wrapper">
          <TabNavigation 
            tabs={visibleTabs} 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            assignedToId={patronData.assignedToId}
            onAssign={handleAssignToPortfolio}
          />
          
          <div className="patron-profile__tab-content">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Modals - managed at profile level */}
      <OpportunityModal
        isOpen={showOpportunityModal}
        onClose={() => setShowOpportunityModal(false)}
        onSuccess={handleOpportunitySuccess}
        patronId={patronData.id}
        patronName={patronFullName}
        defaultAssignedTo={patronData.assignedToId}
      />

      <GiftModal
        isOpen={showGiftModal}
        onClose={() => setShowGiftModal(false)}
        onSuccess={handleGiftSuccess}
        patronId={patronData.id}
        patronName={patronFullName}
      />

      <ActivityModal
        isOpen={showActivityModal}
        onClose={() => setShowActivityModal(false)}
        onSuccess={handleActivitySuccess}
        patronId={patronData.id}
        patronName={patronFullName}
      />

      <AssignPortfolioModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onSuccess={handleAssignSuccess}
        patronId={patronData.id}
        patronName={patronFullName}
      />

      {membershipData && (
        <>
          <AddBeneficiaryModal
            isOpen={showAddBeneficiaryModal}
            onClose={() => setShowAddBeneficiaryModal(false)}
            membershipId={membershipData.membershipId}
            primaryPatronId={membershipData.primaryPatronId}
            primaryPatronName={membershipData.primaryPatronName}
            onSuccess={handleBeneficiarySuccess}
          />

          <RemoveBeneficiaryModal
            isOpen={showRemoveBeneficiaryModal}
            onClose={() => {
              setShowRemoveBeneficiaryModal(false)
              setBeneficiaryToRemove(null)
            }}
            membershipId={membershipData.membershipId}
            beneficiary={beneficiaryToRemove}
            hasRelationship={
              beneficiaryToRemove?.patronId
                ? hasHouseholdRelationship(membershipData.primaryPatronId, beneficiaryToRemove.patronId)
                : false
            }
            onSuccess={handleBeneficiarySuccess}
          />
        </>
      )}

      <AddRelationshipModal
        isOpen={showAddRelationshipModal}
        onClose={() => {
          setShowAddRelationshipModal(false)
          setAddRelationshipType(null)
        }}
        patronId={patronData.id}
        patronName={patronFullName}
        preselectedType={addRelationshipType}
        onSuccess={handleRelationshipSuccess}
      />

      <EndRelationshipModal
        isOpen={showEndRelationshipModal}
        onClose={() => {
          setShowEndRelationshipModal(false)
          setRelationshipToEnd(null)
        }}
        relationship={relationshipToEnd}
        patronName={patronFullName}
        onSuccess={handleRelationshipSuccess}
      />

      <EditHouseholdModal
        isOpen={showEditHouseholdModal}
        onClose={() => setShowEditHouseholdModal(false)}
        household={householdData}
        members={householdMembersData}
        onSuccess={handleRelationshipSuccess}
        onDeleteHousehold={handleDeleteHousehold}
      />

      {selectedTimelineGift && (
        <GiftDetailPanel
          gift={selectedTimelineGift}
          onClose={() => setSelectedTimelineGift(null)}
        />
      )}
    </div>
  )
}

export default PatronProfile
