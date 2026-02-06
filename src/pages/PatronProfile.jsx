import { useState, useMemo } from 'react'
import PatronInfoBox from '../components/PatronInfoBox/PatronInfoBox'
import TabNavigation from '../components/TabNavigation/TabNavigation'
import SummaryTab from '../components/Tabs/SummaryTab'
import MembershipsTab from '../components/Tabs/MembershipsTab'
import DocumentsTab from '../components/Tabs/DocumentsTab'
import OpportunityModal from '../components/OpportunityModal/OpportunityModal'
import GiftModal from '../components/GiftModal/GiftModal'
import ActivityModal from '../components/ActivityModal/ActivityModal'
import AssignPortfolioModal from '../components/AssignPortfolioModal/AssignPortfolioModal'
import { getPatronById, isManagedProspect, archivePatron, restorePatron, updatePatronTags } from '../data/patrons'
import './PatronProfile.css'

const tabs = [
  { id: 'summary', label: 'Summary' },
  { id: 'memberships', label: 'Memberships' },
  { id: 'profile', label: 'Profile' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'relationships', label: 'Relationships' },
  { id: 'documents', label: 'Documents' },
]

// Default/fallback patron data (Anderson Collingwood) for backwards compatibility
const defaultPatronData = {
  id: '123456',
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
  membership: {
    // Core membership info
    status: 'active',
    programme: 'General Membership',
    tier: 'Gold',
    memberSince: '12/02/2023',
    currentPeriod: '12 February 2026',
    periodType: 'yearly',
    daysToRenewal: 9,
    price: 145.99,
    totalSavings: 248.40,
    
    // Card identification
    patronId: '123456',
    membershipId: 'MEM-2023-001',
    periodStart: '12/02/2025',
    validUntil: '12/02/2026',
    
    // Card styling (from membership configuration)
    cardStyle: {
      backgroundColor: '#1a5a5a',
      textColor: '#ffffff',
      accentColor: '#ffeb3b'
    },
    
    // Auto-renewal settings
    autoRenewal: true,
    paymentMethod: {
      type: 'visa',
      last4: '4242'
    },
    
    // Tenure (calculated from memberSince)
    memberYears: 2,
    
    // Upgrade eligibility
    upgradeEligible: true,
    upgradeTier: 'Platinum',
    
    // Benefits with usage tracking, reset dates, and ready-to-redeem flags
    // Categories from PRD: 'access', 'discount', 'complimentary'
    benefits: [
      { 
        category: 'access', 
        title: 'Unlimited visits', 
        description: 'to all exhibits',
        usage: { used: 34, limit: null, resetDate: null },
        icon: 'fa-ticket'
      },
      { 
        category: 'access', 
        title: 'Priority entry', 
        description: 'skip the line',
        usage: null,
        icon: 'fa-forward'
      },
      { 
        category: 'discount', 
        title: 'Bring a friend for free', 
        description: 'every visit',
        usage: { used: 3, limit: 5, resetDate: '12/02/2026' },
        icon: 'fa-user-plus'
      },
      { 
        category: 'discount', 
        title: '20% off special events', 
        description: "your ticket and friend's ticket",
        usage: null,
        icon: 'fa-percent'
      },
      { 
        category: 'discount', 
        title: '10% F&B discount', 
        description: 'at all venue restaurants',
        usage: { used: 12, limit: null, resetDate: null },
        icon: 'fa-utensils'
      },
      { 
        category: 'complimentary', 
        title: 'Welcome pack', 
        description: 'Paradox tote + exclusive goodies',
        usage: { used: 1, limit: 1, resetDate: null },
        icon: 'fa-gift'
      }
    ],
    
    // Member Events (Early Access + Member-Only)
    memberEvents: {
      earlyAccess: [
        {
          id: 1,
          name: 'Halloween Night Special',
          date: '2026-10-31',
          memberAccess: '2026-10-15',
          publicAccess: '2026-10-22',
          status: 'upcoming',
          image: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=100&h=60&fit=crop'
        },
        {
          id: 3,
          name: 'Spring Gala 2026',
          date: '2026-04-20',
          memberAccess: '2026-03-01',
          publicAccess: '2026-03-15',
          status: 'unlocked',
          image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&h=60&fit=crop'
        },
        {
          id: 4,
          name: 'Summer Concert Series',
          date: '2026-07-04',
          memberAccess: '2026-06-01',
          publicAccess: '2026-06-15',
          status: 'upcoming',
          image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=100&h=60&fit=crop'
        }
      ],
      memberOnly: [
        {
          id: 2,
          name: 'VIP Wine Tasting Evening',
          date: '2026-03-15',
          image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=100&h=60&fit=crop',
          exclusive: true
        },
        {
          id: 5,
          name: 'Members Evening: Behind the Scenes',
          date: '2026-02-28',
          image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=100&h=60&fit=crop',
          exclusive: true
        },
        {
          id: 6,
          name: 'Curator Talk: Modern Art',
          date: '2026-03-22',
          image: 'https://images.unsplash.com/photo-1577083288073-40892c0860a4?w=100&h=60&fit=crop',
          exclusive: true
        }
      ]
    },
    
    // Usage Analytics
    usageAnalytics: {
      overallPercentage: 67,
      categories: [
        { name: 'Admissions', used: 34, available: 'unlimited', percentage: 100 },
        { name: 'Guest Passes', used: 3, available: 5, percentage: 60 },
        { name: 'F&B Discounts', used: 12, available: 'unlimited', percentage: 100 },
        { name: 'Event Discounts', used: 2, available: 'unlimited', percentage: 100 }
      ],
      unusedBenefits: ['Welcome pack', 'Priority entry'],
      mostUsed: 'Admissions'
    },
    
    // Beneficiaries on this membership
    beneficiaries: [
      { id: 1, name: 'Anderson Collingwood', role: 'Primary', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face' },
      { id: 2, name: 'Sarah Collingwood', role: 'Spouse', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face' },
      { id: 3, name: 'Emma Collingwood', role: 'Child', avatar: null }
    ],
    
    // Membership History
    membershipHistory: [
      { date: '2023-12-02', event: 'Joined', tier: 'Silver', programme: 'General Membership' },
      { date: '2024-06-15', event: 'Upgraded', tier: 'Gold', programme: 'General Membership' },
      { date: '2024-12-02', event: 'Renewed', tier: 'Gold', programme: 'General Membership' },
      { date: '2025-12-02', event: 'Renewed', tier: 'Gold', programme: 'General Membership' }
    ],
    
    // Upgrade comparison data
    upgradeComparison: {
      currentTier: 'Gold',
      upgradeTier: 'Platinum',
      upgradePrice: 249.99,
      priceDifference: 104.00,
      improvements: [
        { feature: 'Guest passes', current: '5/year', upgrade: 'Unlimited' },
        { feature: 'F&B Discount', current: '10%', upgrade: '25%' },
        { feature: 'Parking', current: 'Not included', upgrade: 'Free valet' },
        { feature: 'Event discounts', current: '20%', upgrade: '35%' }
      ],
      newPerks: [
        'Exclusive member lounge access',
        'Complimentary coat check',
        'Early access to all events',
        'Personal concierge service'
      ]
    }
  },
  assignedTo: 'Liam Johnson',
  engagement: {
    level: 'on-fire', // cold, cool, warm, hot, on-fire
    visits: 54,
    lastVisit: '19/11/2025',
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
    
    // Detailed gift records with DCAP hierarchy
    gifts: [
      {
        id: 'gift-001',
        date: '2025-12-15',
        amount: 1000.00,
        type: 'donation',
        description: 'Year-End Major Gift',
        fund: { id: 'annual-operating', name: 'Annual Operating Fund' },
        campaign: { id: 'annual-2026', name: '2026 Annual Fund' },
        appeal: { id: 'year-end-mailer', name: 'Year-End Direct Mail' },
        deductible: 1000.00,
        benefitsValue: 0,
        softCredits: [
          { patronId: '999', name: 'Margaret Williams', type: 'solicitor' }
        ]
      },
      {
        id: 'gift-002',
        date: '2025-06-15',
        amount: 500.00,
        type: 'donation',
        description: 'Spring Gala Donation',
        fund: { id: 'education', name: 'Education Programs' },
        campaign: { id: 'annual-2026', name: '2026 Annual Fund' },
        appeal: { id: 'spring-gala-2025', name: 'Spring Gala 2025' },
        deductible: 400.00,
        benefitsValue: 100.00,
        softCredits: []
      },
      {
        id: 'gift-003',
        date: '2025-12-02',
        amount: 145.99,
        type: 'membership',
        description: 'Gold Membership Renewal',
        fund: { id: 'annual-operating', name: 'Annual Operating Fund' },
        campaign: { id: 'annual-2026', name: '2026 Annual Fund' },
        appeal: { id: 'membership-renewal', name: 'Membership Renewal' },
        deductible: 95.99,
        benefitsValue: 50.00,
        softCredits: []
      },
      {
        id: 'gift-004',
        date: '2025-03-22',
        amount: 750.00,
        type: 'donation',
        description: 'Building Campaign Gift',
        fund: { id: 'capital-building', name: 'Capital Building Fund' },
        campaign: { id: 'building-future', name: 'Building the Future' },
        appeal: { id: 'capital-appeal', name: 'Capital Campaign Appeal' },
        deductible: 750.00,
        benefitsValue: 0,
        softCredits: [
          { patronId: '888', name: 'Robert Chen', type: 'influencer' }
        ]
      },
      {
        id: 'gift-005',
        date: '2024-11-18',
        amount: 250.00,
        type: 'donation',
        description: 'Online Donation',
        fund: { id: 'annual-operating', name: 'Annual Operating Fund' },
        campaign: { id: 'annual-2025', name: '2025 Annual Fund' },
        appeal: { id: 'website-donate', name: 'Website Donate Button' },
        deductible: 250.00,
        benefitsValue: 0,
        softCredits: []
      }
    ],
    
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
    firstTransaction: { amount: 250.00, date: '18/11/2024' },
    lastTransaction: { amount: 1000.00, date: '15/12/2025' },
    largestTransaction: { amount: 1000.00, date: '15/12/2025' }
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
      { year: 2025, generated: '01/15/2026', sent: true, sentDate: '01/15/2026', method: 'email' },
      { year: 2024, generated: '01/12/2025', sent: true, sentDate: '01/12/2025', method: 'email' }
    ],
    receipts: [
      { 
        id: 1,
        date: '12/15/2025', 
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
        date: '06/15/2025', 
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
        date: '12/02/2025', 
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
        date: '03/22/2025', 
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
        date: '11/18/2024', 
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

function PatronProfile({ patronId, onBack, onSelectOpportunity }) {
  const [activeTab, setActiveTab] = useState('summary')
  
  // Modal states (managed at profile level for access from InfoBox and tabs)
  const [showOpportunityModal, setShowOpportunityModal] = useState(false)
  const [showGiftModal, setShowGiftModal] = useState(false)
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)

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
          />
        )
      case 'memberships':
        return <MembershipsTab membership={patronData.membership} patronName={patronFullName} patronEmail={patronData.email} />
      case 'profile':
        return <div className="coming-soon">Profile tab coming soon...</div>
      case 'timeline':
        return <div className="coming-soon">Timeline tab coming soon...</div>
      case 'relationships':
        return <div className="coming-soon">Relationships tab coming soon...</div>
      case 'documents':
        return <DocumentsTab patron={patronData} />
      default:
        return (
          <SummaryTab 
            patron={patronData}
            onCreateOpportunity={handleCreateOpportunity}
            onRecordGift={handleRecordGift}
            onLogActivity={handleLogActivity}
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
            {patronData.firstName} {patronData.lastName}
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
        />

        {/* Tab Section */}
        <div className="patron-profile__tabs-wrapper">
          <TabNavigation 
            tabs={tabs} 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            assignedTo={patronData.assignedTo}
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
        defaultAssignedTo={patronData.assignedTo}
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
    </div>
  )
}

export default PatronProfile
