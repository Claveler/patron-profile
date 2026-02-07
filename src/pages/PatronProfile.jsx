import { useState, useMemo } from 'react'
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
import { getPatronById, isManagedProspect, archivePatron, restorePatron, updatePatronTags, getMembershipsByPatronId, getPrimaryPatronForMembership, getGiftsByPatronId, getInteractionsByPatronId } from '../data/patrons'
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
  id: 'anderson-collingwood',
  firstName: 'Anderson',
  lastName: 'Collingwood',
  photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  household: {
    name: 'Collingwood Family',
    verified: true
  },
  category: 'Member',
  email: 'collingander@gmail.com',
  phone: '(555) 123-4567',
  address: '789 Pine Rd, Austin, TX 73301',
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
        { activities: [{ type: 'donation', count: 1, value: 750 }] },
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
        { activities: [{ type: 'donation', count: 1, value: 500 }, { type: 'attendance', count: 3 }] },
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
        { activities: [{ type: 'donation', count: 1, value: 200 }] }
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
        { activities: [{ type: 'donation', count: 1, value: 1000 }, { type: 'attendance', count: 3 }] },
        { activities: [{ type: 'attendance', count: 4 }, { type: 'purchase', count: 3, value: 156 }] }
      ]},
      // Jan 2026 (most recent)
      { month: '2026-01', weeks: [
        { activities: [{ type: 'attendance', count: 2 }] },
        { activities: [] },
        { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 32 }] },
        { activities: [{ type: 'attendance', count: 3 }, { type: 'donation', count: 1, value: 250 }] }
      ]}
    ]
  },
  // Note: Pipeline stages are now tracked on Opportunities, not patrons
  // See src/data/opportunities.js for opportunity records
  giving: {
    // Aggregate totals
    lifetimeValue: 3222.50,      // Total financial relationship (donations + revenue)
    donations: 1975.00,          // Charitable gifts (tax-deductible)
    revenue: 1247.50,            // Earned income (tickets, F&B, merch)
    giftCount: 6,                // Number of donation gifts
    averageGift: 329.17,         // Average donation amount (donations-only)
    
    // Aggregates by fund
    byFund: {
      'annual-operating': { name: 'Annual Operating', total: 1895.99, count: 3 },
      'education': { name: 'Education Programs', total: 500.00, count: 1 },
      'capital-building': { name: 'Capital Building', total: 750.00, count: 1 }
    },
    
    // Aggregates by campaign
    byCampaign: {
      'annual-2026': { name: '2026 Annual Fund', total: 2145.99, count: 3, goal: 500000 },
      'building-future': { name: 'Building the Future', total: 750.00, count: 1, goal: 50000000 },
      'annual-2025': { name: '2025 Annual Fund', total: 250.00, count: 1, goal: 450000 }
    },
    
    // Aggregates by year
    byYear: {
      2025: { total: 2895.99, count: 4 },
      2024: { total: 250.00, count: 1 }
    },
    
    // Transaction highlights
    firstTransaction: { amount: 250.00, date: '2024-11-18' },
    lastTransaction: { amount: 1000.00, date: '2025-12-15' },
    largestTransaction: { amount: 1000.00, date: '2025-12-15' }
  },
  wealthInsights: {
    propensityScore: 'DSI-3',
    description: 'Real Estate holdings of 1.2 million, business executive at a firm with revenues of $1-5 million.'
  },
  taxDocuments: {
    organization: {
      name: 'Paradox Museum',
      ein: '12-3456789',
      address: '123 Museum Way, Austin, TX 78701'
    },
    yearEndSummaries: [
      { year: 2025, generated: '2026-01-15', sent: true, sentDate: '2026-01-15', method: 'email' },
      { year: 2024, generated: '2025-01-12', sent: true, sentDate: '2025-01-12', method: 'email' }
    ],
    receipts: [
      { 
        id: 1,
        date: '2025-12-15', 
        type: 'donation', 
        description: 'Year-End Major Gift', 
        amount: 1000.00, 
        deductible: 1000.00,
        benefitsValue: 0,
        campaign: '2026 Annual Fund',
        appeal: 'Year-End Direct Mail'
      },
      { 
        id: 2,
        date: '2025-06-15', 
        type: 'donation', 
        description: 'Spring Gala Donation', 
        amount: 500.00, 
        deductible: 400.00,
        benefitsValue: 100.00,
        campaign: '2026 Annual Fund',
        appeal: 'Spring Gala 2025'
      },
      { 
        id: 3,
        date: '2025-12-02', 
        type: 'membership', 
        description: 'Gold Membership Renewal', 
        amount: 145.99, 
        deductible: 95.99,
        benefitsValue: 50.00,
        campaign: '2026 Annual Fund',
        appeal: 'Membership Renewal'
      },
      { 
        id: 4,
        date: '2025-03-22', 
        type: 'donation', 
        description: 'Building Campaign Gift', 
        amount: 750.00, 
        deductible: 750.00,
        benefitsValue: 0,
        campaign: 'Building the Future',
        appeal: 'Capital Campaign Appeal'
      },
      { 
        id: 5,
        date: '2024-11-18', 
        type: 'donation', 
        description: 'Online Donation', 
        amount: 250.00, 
        deductible: 250.00,
        benefitsValue: 0,
        campaign: '2025 Annual Fund',
        appeal: 'Website Donate Button'
      }
    ],
    inKindDonations: []
  }
}

function PatronProfile({ patronId, onBack, onSelectOpportunity, onSelectPatron }) {
  const [activeTab, setActiveTab] = useState('summary')
  
  // Modal states (managed at profile level for access from InfoBox and tabs)
  const [showOpportunityModal, setShowOpportunityModal] = useState(false)
  const [showGiftModal, setShowGiftModal] = useState(false)
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showAddBeneficiaryModal, setShowAddBeneficiaryModal] = useState(false)
  const [showRemoveBeneficiaryModal, setShowRemoveBeneficiaryModal] = useState(false)
  const [beneficiaryToRemove, setBeneficiaryToRemove] = useState(null)

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
        primaryPatronName: primaryPatron ? primaryPatron.name : patronFullName
      }
    }
    return null
  }, [patronData.id, patronFullName])

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
    if (onBack) {
      onBack()
    }
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
    // Force re-render to show updated beneficiaries
    window.location.reload() // Simple approach for demo
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'summary':
        return (
          <SummaryTab 
            patron={patronData} 
            onSelectOpportunity={onSelectOpportunity}
            onCreateOpportunity={handleCreateOpportunity}
            onRecordGift={handleRecordGift}
            onLogActivity={handleLogActivity}
            onNavigateToPatron={onSelectPatron}
          />
        )
      case 'giving':
        return (
          <GivingTab patronId={patronData.id} />
        )
      case 'memberships':
        return (
          <MembershipsTab 
            patronId={patronData.id}
            patronName={patronFullName} 
            patronEmail={patronData.email}
            onNavigateToPatron={onSelectPatron}
            onAddBeneficiary={handleAddBeneficiary}
            onRemoveBeneficiary={handleRemoveBeneficiary}
          />
        )
      case 'profile':
        return (
          <div className="empty-state">
            <i className="fa-solid fa-user-pen empty-state__icon"></i>
            <h3 className="empty-state__title">Profile Details</h3>
            <p className="empty-state__text">Extended profile information, preferences, and custom fields will appear here.</p>
          </div>
        )
      case 'timeline':
        return (
          <ActivityTimeline
            gifts={getGiftsByPatronId(patronData.id)}
            activities={getInteractionsByPatronId(patronData.id)}
            onAddActivity={handleLogActivity}
            onRecordGift={handleRecordGift}
            variant="full"
          />
        )
      case 'relationships':
        return (
          <div className="empty-state">
            <i className="fa-solid fa-people-arrows empty-state__icon"></i>
            <h3 className="empty-state__title">No Relationships Mapped</h3>
            <p className="empty-state__text">Household members, organizational affiliations, and other patron relationships will appear here.</p>
          </div>
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
            onNavigateToPatron={onSelectPatron}
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
          {onBack && (
            <>
              <button 
                className="patron-profile__breadcrumb-link"
                onClick={onBack}
              >
                Patrons
              </button>
              <i className="fa-solid fa-chevron-right patron-profile__breadcrumb-separator"></i>
            </>
          )}
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
          onArchive={handleArchive}
          onRestore={handleRestore}
          onUpdateTags={handleUpdateTags}
          onNavigateToPatron={onSelectPatron}
        />

        {/* Tab Section */}
        <div className="patron-profile__tabs-wrapper">
          <TabNavigation 
            tabs={tabs} 
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
            onSuccess={handleBeneficiarySuccess}
          />
        </>
      )}
    </div>
  )
}

export default PatronProfile
