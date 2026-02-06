/**
 * Patron Data Store
 * 
 * Terminology:
 * - MANAGED PROSPECT: A patron with an assigned relationship manager (owner) 
 *   who is in someone's portfolio. They may have 0, 1, or many opportunities.
 *   Has: assignedTo field
 * 
 * - GENERAL CONSTITUENT: A patron in the database who is not being actively 
 *   managed through individual relationship management. Handled via automated
 *   campaigns and appeals.
 *   Has: No assignedTo field
 * 
 * NOTE: Pipeline stages are tracked on OPPORTUNITIES, not patrons.
 * See opportunities.js for pipeline data.
 */

// Gift Officers / Relationship Managers
export const giftOfficers = [
  { id: 'liam-johnson', name: 'Liam Johnson' },
  { id: 'emma-smith', name: 'Emma Smith' },
  { id: 'ethan-garcia', name: 'Ethan Garcia' },
  { id: 'sophia-anderson', name: 'Sophia Anderson' },
  { id: 'lucas-thomas', name: 'Lucas Thomas' },
]

// Patron tags (for segmentation)
export const patronTags = [
  // System tags (common classifications)
  { id: 'prospect', label: 'Prospect', system: true },
  { id: 'donor', label: 'Donor', system: true },
  { id: 'major-donor', label: 'Major Donor', system: true },
  { id: 'board-member', label: 'Board Member', system: true },
  { id: 'volunteer', label: 'Volunteer', system: true },
  { id: 'corporate', label: 'Corporate', system: true },
  { id: 'foundation', label: 'Foundation', system: true },
  // Custom tags can be added dynamically by users
]

// Legacy: kept for backwards compatibility during migration
export const patronCategories = patronTags

// Engagement levels
export const engagementLevels = [
  { id: 'cold', label: 'Cold' },
  { id: 'cool', label: 'Cool' },
  { id: 'warm', label: 'Warm' },
  { id: 'hot', label: 'Hot' },
  { id: 'on-fire', label: 'On Fire' },
]

// Pipeline stages
export const pipelineStages = [
  { id: 'identification', label: 'Identification' },
  { id: 'qualification', label: 'Qualification' },
  { id: 'cultivation', label: 'Cultivation' },
  { id: 'solicitation', label: 'Solicitation' },
  { id: 'stewardship', label: 'Stewardship' },
]

// Patron sources (how they entered the system)
// origin: 'fever' = auto-created from Fever transaction, 'manual' = added by gift officer
export const patronSources = [
  { id: 'ticket', label: 'Ticket Purchase', icon: 'fa-ticket', origin: 'fever' },
  { id: 'online', label: 'Online Donation', icon: 'fa-globe', origin: 'fever' },
  { id: 'membership', label: 'Membership Signup', icon: 'fa-id-card', origin: 'fever' },
  { id: 'manual', label: 'Manual Entry', icon: 'fa-keyboard', origin: 'manual' },
  { id: 'import', label: 'Data Import', icon: 'fa-file-import', origin: 'manual' },
]

// Get patron origin type (fever or manual)
export const getPatronOrigin = (source) => {
  const sourceConfig = patronSources.find(s => s.id === source)
  return sourceConfig?.origin || 'manual' // Default to manual for legacy data
}

/**
 * PATRONS DATABASE
 * Mix of Managed Prospects and General Constituents
 */
export const patrons = [
  // ============================================
  // MANAGED PROSPECTS (have assignedTo + prospect)
  // ============================================
  
  // Anderson Collingwood - FULL DATA (our main demo patron)
  {
    id: 'anderson-collingwood',
    firstName: 'Anderson',
    lastName: 'Collingwood',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    email: 'collingander@gmail.com',
    phone: '(555) 123-4567',
    address: '789 Pine Rd, Austin, TX 73301',
    tags: ['major-donor', 'donor', 'board-member'],
    household: {
      name: 'Collingwood Family',
      verified: true
    },
    // MANAGED PROSPECT - has assignedTo (opportunities tracked separately)
    assignedTo: 'Liam Johnson',
    engagement: {
      level: 'on-fire',
      visits: 54,
      lastVisit: '19/11/2025',
      activityHistory: [
        { month: '2025-02', weeks: [
          { activities: [{ type: 'attendance', count: 1 }] },
          { activities: [] },
          { activities: [{ type: 'attendance', count: 2 }] },
          { activities: [{ type: 'purchase', count: 1, value: 35 }] }
        ]},
        { month: '2025-03', weeks: [
          { activities: [] },
          { activities: [{ type: 'attendance', count: 1 }] },
          { activities: [{ type: 'donation', count: 1, value: 750 }] },
          { activities: [{ type: 'attendance', count: 2 }, { type: 'purchase', count: 1, value: 45 }] }
        ]},
        { month: '2025-04', weeks: [
          { activities: [{ type: 'attendance', count: 1 }] },
          { activities: [] },
          { activities: [] },
          { activities: [{ type: 'attendance', count: 1 }] }
        ]},
        { month: '2025-05', weeks: [
          { activities: [] },
          { activities: [{ type: 'attendance', count: 2 }] },
          { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 2, value: 78 }] },
          { activities: [] }
        ]},
        { month: '2025-06', weeks: [
          { activities: [{ type: 'attendance', count: 1 }] },
          { activities: [{ type: 'donation', count: 1, value: 500 }, { type: 'attendance', count: 3 }] },
          { activities: [{ type: 'attendance', count: 2 }] },
          { activities: [{ type: 'purchase', count: 1, value: 25 }] }
        ]},
        { month: '2025-07', weeks: [
          { activities: [] },
          { activities: [] },
          { activities: [{ type: 'attendance', count: 1 }] },
          { activities: [] }
        ]},
        { month: '2025-08', weeks: [
          { activities: [] },
          { activities: [{ type: 'attendance', count: 1 }] },
          { activities: [] },
          { activities: [{ type: 'attendance', count: 2 }] }
        ]},
        { month: '2025-09', weeks: [
          { activities: [{ type: 'attendance', count: 1 }] },
          { activities: [{ type: 'purchase', count: 1, value: 42 }] },
          { activities: [{ type: 'attendance', count: 2 }] },
          { activities: [{ type: 'attendance', count: 1 }] }
        ]},
        { month: '2025-10', weeks: [
          { activities: [{ type: 'attendance', count: 2 }] },
          { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 55 }] },
          { activities: [{ type: 'attendance', count: 3 }] },
          { activities: [{ type: 'donation', count: 1, value: 200 }] }
        ]},
        { month: '2025-11', weeks: [
          { activities: [{ type: 'attendance', count: 2 }, { type: 'purchase', count: 1, value: 45 }] },
          { activities: [] },
          { activities: [{ type: 'attendance', count: 1 }] },
          { activities: [{ type: 'attendance', count: 4 }, { type: 'purchase', count: 2, value: 89 }] }
        ]},
        { month: '2025-12', weeks: [
          { activities: [{ type: 'membership', count: 1, value: 145.99 }] },
          { activities: [{ type: 'attendance', count: 2 }] },
          { activities: [{ type: 'donation', count: 1, value: 1000 }, { type: 'attendance', count: 3 }] },
          { activities: [{ type: 'attendance', count: 4 }, { type: 'purchase', count: 3, value: 156 }] }
        ]},
        { month: '2026-01', weeks: [
          { activities: [{ type: 'attendance', count: 2 }] },
          { activities: [] },
          { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 32 }] },
          { activities: [{ type: 'attendance', count: 3 }, { type: 'donation', count: 1, value: 250 }] }
        ]}
      ]
    },
    membership: {
      status: 'active',
      programme: 'General Membership',
      tier: 'Gold',
      memberSince: '12/02/2023',
      currentPeriod: '12 February 2026',
      periodType: 'yearly',
      daysToRenewal: 9,
      price: 145.99,
      totalSavings: 248.40,
      patronId: 'anderson-collingwood',
      membershipId: 'MEM-2023-001',
      periodStart: '12/02/2025',
      validUntil: '12/02/2026',
      cardStyle: {
        backgroundColor: '#B8860B',
        textColor: '#ffffff',
        accentColor: '#D4AF37'
      },
      autoRenewal: true,
      paymentMethod: {
        type: 'visa',
        last4: '4242'
      },
      memberYears: 2,
      upgradeEligible: true,
      upgradeTier: 'Platinum',
      benefits: [
        { category: 'access', title: 'Unlimited visits', description: 'to all exhibits', usage: { used: 34, limit: null, resetDate: null }, icon: 'fa-ticket' },
        { category: 'access', title: 'Priority entry', description: 'skip the line', usage: null, icon: 'fa-forward' },
        { category: 'discount', title: 'Bring a friend for free', description: 'every visit', usage: { used: 3, limit: 5, resetDate: '12/02/2026' }, icon: 'fa-user-plus' },
        { category: 'discount', title: '20% off special events', description: "your ticket and friend's ticket", usage: null, icon: 'fa-percent' },
        { category: 'discount', title: '10% F&B discount', description: 'at all venue restaurants', usage: { used: 12, limit: null, resetDate: null }, icon: 'fa-utensils' },
        { category: 'complimentary', title: 'Welcome pack', description: 'Paradox tote + exclusive goodies', usage: { used: 1, limit: 1, resetDate: null }, icon: 'fa-gift' }
      ],
      memberEvents: {
        earlyAccess: [
          { id: 1, name: 'Halloween Night Special', date: '2026-10-31', memberAccess: '2026-10-15', publicAccess: '2026-10-22', status: 'upcoming', image: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=100&h=60&fit=crop' },
          { id: 3, name: 'Spring Gala 2026', date: '2026-04-20', memberAccess: '2026-03-01', publicAccess: '2026-03-15', status: 'unlocked', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&h=60&fit=crop' },
          { id: 4, name: 'Summer Concert Series', date: '2026-07-04', memberAccess: '2026-06-01', publicAccess: '2026-06-15', status: 'upcoming', image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=100&h=60&fit=crop' }
        ],
        memberOnly: [
          { id: 2, name: 'VIP Wine Tasting Evening', date: '2026-03-15', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=100&h=60&fit=crop', exclusive: true },
          { id: 5, name: 'Members Evening: Behind the Scenes', date: '2026-02-28', image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=100&h=60&fit=crop', exclusive: true },
          { id: 6, name: 'Curator Talk: Modern Art', date: '2026-03-22', image: 'https://images.unsplash.com/photo-1577083288073-40892c0860a4?w=100&h=60&fit=crop', exclusive: true }
        ]
      },
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
      beneficiaries: [
        { id: 1, name: 'Anderson Collingwood', role: 'Primary', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face' },
        { id: 2, name: 'Sarah Collingwood', role: 'Spouse', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face' },
        { id: 3, name: 'Emma Collingwood', role: 'Child', avatar: null }
      ],
      membershipHistory: [
        { date: '2023-12-02', event: 'Joined', tier: 'Silver', programme: 'General Membership' },
        { date: '2024-06-15', event: 'Upgraded', tier: 'Gold', programme: 'General Membership' },
        { date: '2024-12-02', event: 'Renewed', tier: 'Gold', programme: 'General Membership' },
        { date: '2025-12-02', event: 'Renewed', tier: 'Gold', programme: 'General Membership' }
      ],
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
    giving: {
      lifetimeValue: 3222.50,
      donations: 1975.00,
      revenue: 1247.50,
      giftCount: 6,
      averageGift: 329.17,
      lastDonation: '2025-12-15',
      gifts: [
        { id: 'gift-001', date: '2025-12-15', amount: 1000.00, type: 'donation', description: 'Year-End Major Gift', fund: { id: 'annual-operating', name: 'Annual Operating Fund' }, campaign: { id: 'annual-2026', name: '2026 Annual Fund' }, appeal: { id: 'year-end-mailer', name: 'Year-End Direct Mail' }, deductible: 1000.00, benefitsValue: 0, softCredits: [{ patronId: '999', name: 'Margaret Williams', type: 'solicitor' }] },
        { id: 'gift-002', date: '2025-06-15', amount: 500.00, type: 'donation', description: 'Spring Gala Donation', fund: { id: 'education', name: 'Education Programs' }, campaign: { id: 'annual-2026', name: '2026 Annual Fund' }, appeal: { id: 'spring-gala-2025', name: 'Spring Gala 2025' }, deductible: 400.00, benefitsValue: 100.00, softCredits: [] },
        { id: 'gift-003', date: '2025-12-02', amount: 145.99, type: 'membership', description: 'Gold Membership Renewal', fund: { id: 'annual-operating', name: 'Annual Operating Fund' }, campaign: { id: 'annual-2026', name: '2026 Annual Fund' }, appeal: { id: 'membership-renewal', name: 'Membership Renewal' }, deductible: 95.99, benefitsValue: 50.00, softCredits: [] },
        { id: 'gift-004', date: '2025-03-22', amount: 750.00, type: 'donation', description: 'Building Campaign Gift', fund: { id: 'capital-building', name: 'Capital Building Fund' }, campaign: { id: 'building-future', name: 'Building the Future' }, appeal: { id: 'capital-appeal', name: 'Capital Campaign Appeal' }, deductible: 750.00, benefitsValue: 0, softCredits: [{ patronId: '888', name: 'Robert Chen', type: 'influencer' }] },
        { id: 'gift-005', date: '2024-11-18', amount: 250.00, type: 'donation', description: 'Online Donation', fund: { id: 'annual-operating', name: 'Annual Operating Fund' }, campaign: { id: 'annual-2025', name: '2025 Annual Fund' }, appeal: { id: 'website-donate', name: 'Website Donate Button' }, deductible: 250.00, benefitsValue: 0, softCredits: [] }
      ],
      byFund: {
        'annual-operating': { name: 'Annual Operating', total: 1895.99, count: 3 },
        'education': { name: 'Education Programs', total: 500.00, count: 1 },
        'capital-building': { name: 'Capital Building', total: 750.00, count: 1 }
      },
      byCampaign: {
        'annual-2026': { name: '2026 Annual Fund', total: 2145.99, count: 3, goal: 500000 },
        'building-future': { name: 'Building the Future', total: 750.00, count: 1, goal: 50000000 },
        'annual-2025': { name: '2025 Annual Fund', total: 250.00, count: 1, goal: 450000 }
      },
      byYear: { 2025: { total: 2895.99, count: 4 }, 2024: { total: 250.00, count: 1 } },
      firstTransaction: { amount: 250.00, date: '18/11/2024' },
      lastTransaction: { amount: 1000.00, date: '15/12/2025' },
      largestTransaction: { amount: 1000.00, date: '15/12/2025' }
    },
    wealthInsights: {
      propensityScore: 'DSI-3',
      description: 'Real Estate holdings of 1.2 million, business executive at a firm with revenues of $1-5 million.'
    },
    taxDocuments: {
      organization: { name: 'Paradox Museum', ein: '12-3456789', address: '123 Museum Way, Austin, TX 78701' },
      yearEndSummaries: [
        { year: 2025, generated: '01/15/2026', sent: true, sentDate: '01/15/2026', method: 'email' },
        { year: 2024, generated: '01/12/2025', sent: true, sentDate: '01/12/2025', method: 'email' }
      ],
      receipts: [
        { id: 1, date: '12/15/2025', type: 'donation', description: 'Year-End Major Gift', amount: 1000.00, deductible: 1000.00, benefitsValue: 0, campaign: '2026 Annual Fund', appeal: 'Year-End Direct Mail' },
        { id: 2, date: '06/15/2025', type: 'donation', description: 'Spring Gala Donation', amount: 500.00, deductible: 400.00, benefitsValue: 100.00, campaign: '2026 Annual Fund', appeal: 'Spring Gala 2025' },
        { id: 3, date: '12/02/2025', type: 'membership', description: 'Gold Membership Renewal', amount: 145.99, deductible: 95.99, benefitsValue: 50.00, campaign: '2026 Annual Fund', appeal: 'Membership Renewal' },
        { id: 4, date: '03/22/2025', type: 'donation', description: 'Building Campaign Gift', amount: 750.00, deductible: 750.00, benefitsValue: 0, campaign: 'Building the Future', appeal: 'Capital Campaign Appeal' },
        { id: 5, date: '11/18/2024', type: 'donation', description: 'Online Donation', amount: 250.00, deductible: 250.00, benefitsValue: 0, campaign: '2025 Annual Fund', appeal: 'Website Donate Button' }
      ],
      inKindDonations: []
    },
    source: 'manual',
    createdDate: '2024-11-18'
  },

  // Paul Fairfax - FULL DATA (General Constituent demo patron)
  {
    id: 'paul-fairfax',
    firstName: 'Paul',
    lastName: 'Fairfax',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    email: 'paul.fairfax@outlook.com',
    phone: '(555) 111-2222',
    tags: ['donor', 'corporate'],
    // NO assignedTo - General Constituent
    // NO prospect data - not in pipeline
    engagement: {
      level: 'cool',
      visits: 6,
      lastVisit: '15/11/2025',
      activityHistory: [
        { month: '2025-02', weeks: [
          { activities: [] },
          { activities: [] },
          { activities: [] },
          { activities: [] }
        ]},
        { month: '2025-03', weeks: [
          { activities: [] },
          { activities: [{ type: 'attendance', count: 1 }] },
          { activities: [] },
          { activities: [] }
        ]},
        { month: '2025-04', weeks: [
          { activities: [] },
          { activities: [] },
          { activities: [] },
          { activities: [] }
        ]},
        { month: '2025-05', weeks: [
          { activities: [] },
          { activities: [] },
          { activities: [{ type: 'attendance', count: 1 }] },
          { activities: [] }
        ]},
        { month: '2025-06', weeks: [
          { activities: [] },
          { activities: [] },
          { activities: [] },
          { activities: [] }
        ]},
        { month: '2025-07', weeks: [
          { activities: [] },
          { activities: [] },
          { activities: [] },
          { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 22 }] }
        ]},
        { month: '2025-08', weeks: [
          { activities: [] },
          { activities: [] },
          { activities: [] },
          { activities: [] }
        ]},
        { month: '2025-09', weeks: [
          { activities: [] },
          { activities: [] },
          { activities: [] },
          { activities: [] }
        ]},
        { month: '2025-10', weeks: [
          { activities: [] },
          { activities: [{ type: 'attendance', count: 1 }] },
          { activities: [] },
          { activities: [] }
        ]},
        { month: '2025-11', weeks: [
          { activities: [] },
          { activities: [] },
          { activities: [{ type: 'attendance', count: 2 }] },
          { activities: [] }
        ]},
        { month: '2025-12', weeks: [
          { activities: [] },
          { activities: [] },
          { activities: [] },
          { activities: [] }
        ]},
        { month: '2026-01', weeks: [
          { activities: [] },
          { activities: [] },
          { activities: [] },
          { activities: [] }
        ]}
      ]
    },
    giving: { lifetimeValue: 1850, donations: 1200, revenue: 650, lastDonation: '2025-09-10' },
    membership: {
      status: 'active',
      programme: 'General Membership',
      tier: 'Silver',
      memberSince: '27/02/2024',
      currentPeriod: '27 February 2026',
      periodType: 'yearly',
      daysToRenewal: 21,
      price: 89.99,
      totalSavings: 42.50,
      patronId: 'paul-fairfax',
      membershipId: 'MEM-2024-047',
      periodStart: '27/02/2025',
      validUntil: '27/02/2026',
      // Silver card styling - professional gray/silver tones
      cardStyle: {
        backgroundColor: '#5C6B7A',
        textColor: '#ffffff',
        accentColor: '#B8C5D1'
      },
      autoRenewal: false,
      paymentMethod: {
        type: 'mastercard',
        last4: '8832'
      },
      memberYears: 1,
      upgradeEligible: true,
      upgradeTier: 'Gold',
      benefits: [
        { 
          category: 'access', 
          title: 'Unlimited visits', 
          description: 'to all standard exhibits',
          usage: { used: 6, limit: null, resetDate: null },
          icon: 'fa-ticket'
        },
        { 
          category: 'discount', 
          title: 'Bring a friend for free', 
          description: 'twice per year',
          usage: { used: 0, limit: 2, resetDate: '27/02/2026' },
          icon: 'fa-user-plus'
        },
        { 
          category: 'discount', 
          title: '10% off special events', 
          description: 'your ticket only',
          usage: null,
          icon: 'fa-percent'
        },
        { 
          category: 'discount', 
          title: '5% F&B discount', 
          description: 'at main café',
          usage: { used: 2, limit: null, resetDate: null },
          icon: 'fa-utensils'
        }
      ],
      memberEvents: {
        earlyAccess: [
          {
            id: 1,
            name: 'Spring Gala 2026',
            date: '2026-04-20',
            memberAccess: '2026-03-15',
            publicAccess: '2026-03-25',
            status: 'upcoming',
            image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&h=60&fit=crop'
          }
        ],
        memberOnly: []
      },
      usageAnalytics: {
        overallPercentage: 35,
        categories: [
          { name: 'Admissions', used: 6, available: 'unlimited', percentage: 40 },
          { name: 'Guest Passes', used: 0, available: 2, percentage: 0 },
          { name: 'F&B Discounts', used: 2, available: 'unlimited', percentage: 25 }
        ],
        unusedBenefits: ['Event discounts', 'Guest passes'],
        mostUsed: 'Admissions'
      },
      beneficiaries: [
        { id: 1, name: 'Paul Fairfax', role: 'Primary', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=40&h=40&fit=crop&crop=face' }
      ],
      membershipHistory: [
        { date: '2024-02-27', event: 'Joined', tier: 'Silver', programme: 'General Membership' },
        { date: '2025-02-27', event: 'Renewed', tier: 'Silver', programme: 'General Membership' }
      ],
      upgradeComparison: {
        currentTier: 'Silver',
        upgradeTier: 'Gold',
        upgradePrice: 145.99,
        priceDifference: 56.00,
        improvements: [
          { feature: 'Guest passes', current: '2/year', upgrade: '5/year' },
          { feature: 'F&B Discount', current: '5%', upgrade: '10%' },
          { feature: 'Event discounts', current: '10%', upgrade: '20%' }
        ],
        newPerks: [
          'Priority entry',
          'Welcome pack with tote bag',
          'Access to special exhibits'
        ]
      }
    },
    address: '742 Maple Avenue, Boston, MA 02108',
    // Tax documents for Documents tab
    taxDocuments: {
      organization: {
        name: 'Paradox Museum',
        ein: '12-3456789',
        address: '100 Museum Way, Boston, MA 02115'
      },
      receipts: [
        { 
          id: 1, 
          date: '27/02/2025', 
          type: 'membership', 
          description: 'Silver Membership Renewal', 
          amount: 89.99, 
          deductible: 49.99, 
          benefitsValue: 40.00, 
          campaign: 'Membership', 
          appeal: 'Renewal Notice' 
        },
        { 
          id: 2, 
          date: '27/02/2024', 
          type: 'membership', 
          description: 'Silver Membership - Initial', 
          amount: 89.99, 
          deductible: 49.99, 
          benefitsValue: 40.00, 
          campaign: 'Membership', 
          appeal: 'Website Join' 
        }
      ],
      yearEndSummaries: [
        { id: 1, year: 2025, generated: '15/01/2026', sent: false },
        { id: 2, year: 2024, generated: '10/01/2025', sent: true, sentDate: '12/01/2025' }
      ],
      inKindDonations: []
    },
    source: 'ticket',
    createdDate: '2024-02-27'
  },

  // Other Managed Prospects (simplified data for list view)
  {
    id: 'jake-thompson',
    firstName: 'Jake',
    lastName: 'Thompson',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    email: 'jake_thompson@gmail.com',
    phone: '(555) 234-5678',
    tags: ['prospect'],
    assignedTo: 'Liam Johnson',
    engagement: {
      level: 'cold',
      visits: 3,
      lastVisit: '01/10/2025',
      activityHistory: [
        { month: '2025-02', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-03', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-04', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-05', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-06', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-07', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-08', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-09', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-10', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-11', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-12', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 150, donations: 0, revenue: 150, lastDonation: null },
    source: 'import',
    createdDate: '2025-06-15'
  },
  {
    id: 'sophia-thomas',
    firstName: 'Sophia',
    lastName: 'Thomas',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    email: 'sophia1234@gmail.com',
    phone: '(555) 345-6789',
    tags: ['donor'],
    assignedTo: 'Emma Smith',
    engagement: {
      level: 'cold',
      visits: 8,
      lastVisit: '12/10/2025',
      activityHistory: [
        { month: '2025-02', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-03', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-04', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-05', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-06', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-07', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-08', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-09', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'donation', count: 1, value: 750 }] }, { activities: [] }] },
        { month: '2025-10', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-11', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-12', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 1250, donations: 750, revenue: 500, lastDonation: '2025-10-12' },
    source: 'import',
    createdDate: '2025-04-10'
  },
  {
    id: 'lucas-taylor',
    firstName: 'Lucas',
    lastName: 'Taylor',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    email: 'lucas_taylor@yahoo.com',
    phone: '(555) 456-7890',
    tags: ['donor'],
    assignedTo: 'Liam Johnson',
    engagement: {
      level: 'warm',
      visits: 22,
      lastVisit: '20/10/2025',
      activityHistory: [
        { month: '2025-02', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-03', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [] }, { activities: [{ type: 'purchase', count: 1, value: 45 }] }] },
        { month: '2025-04', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-05', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'donation', count: 1, value: 500 }] }, { activities: [] }] },
        { month: '2025-06', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 2 }] }] },
        { month: '2025-07', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'purchase', count: 1, value: 35 }] }, { activities: [] }] },
        { month: '2025-08', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'donation', count: 1, value: 500 }] }] },
        { month: '2025-09', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-10', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'purchase', count: 1, value: 55 }] }, { activities: [{ type: 'attendance', count: 2 }, { type: 'donation', count: 1, value: 500 }] }, { activities: [] }] },
        { month: '2025-11', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-12', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 2800, donations: 1500, revenue: 1300, lastDonation: '2025-10-20' },
    membership: {
      status: 'active',
      programme: 'General Membership',
      tier: 'Silver',
      memberSince: '10/11/2024',
      currentPeriod: '10 March 2026',
      periodType: 'yearly',
      daysToRenewal: 45,
      price: 89.99,
      totalSavings: 18.50,
      patronId: 'sophia-thomas',
      membershipId: 'MEM-2024-312',
      periodStart: '10/03/2025',
      validUntil: '10/03/2026',
      cardStyle: {
        backgroundColor: '#5C6B7A',
        textColor: '#ffffff',
        accentColor: '#B8C5D1'
      },
      autoRenewal: false,
      paymentMethod: {
        type: 'visa',
        last4: '7721'
      },
      memberYears: 1,
      upgradeEligible: true,
      upgradeTier: 'Gold',
      benefits: [
        { category: 'access', title: 'Unlimited visits', description: 'to all standard exhibits', usage: { used: 8, limit: null, resetDate: null }, icon: 'fa-ticket' },
        { category: 'discount', title: 'Bring a friend for free', description: 'twice per year', usage: { used: 1, limit: 2, resetDate: '10/03/2026' }, icon: 'fa-user-plus' },
        { category: 'discount', title: '10% off special events', description: 'your ticket only', usage: null, icon: 'fa-percent' },
        { category: 'discount', title: '5% F&B discount', description: 'at main café', usage: { used: 2, limit: null, resetDate: null }, icon: 'fa-utensils' }
      ],
      usageAnalytics: {
        overallPercentage: 25,
        categories: [
          { name: 'Admissions', used: 8, available: 'unlimited', percentage: 30 },
          { name: 'Guest Passes', used: 1, available: 2, percentage: 50 },
          { name: 'F&B Discounts', used: 2, available: 'unlimited', percentage: 15 }
        ],
        unusedBenefits: ['Event discounts'],
        mostUsed: 'Admissions'
      },
      beneficiaries: [
        { id: 1, name: 'Sophia Thomas', role: 'Primary', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face' }
      ],
      membershipHistory: [
        { date: '2024-11-10', event: 'Joined', tier: 'Silver', programme: 'General Membership' },
        { date: '2025-03-10', event: 'Renewed', tier: 'Silver', programme: 'General Membership' }
      ]
    },
    source: 'import',
    createdDate: '2024-08-20'
  },
  {
    id: 'ava-anderson',
    firstName: 'Ava',
    lastName: 'Anderson',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    email: 'anderava@gmail.com',
    phone: '(555) 567-8901',
    tags: ['donor', 'volunteer'],
    assignedTo: 'Liam Johnson',
    engagement: {
      level: 'hot',
      visits: 45,
      lastVisit: '01/11/2025',
      activityHistory: [
        { month: '2025-02', weeks: [{ activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'purchase', count: 1, value: 65 }] }, { activities: [{ type: 'attendance', count: 3 }] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-03', weeks: [{ activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'donation', count: 1, value: 1000 }] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'attendance', count: 3 }, { type: 'purchase', count: 1, value: 45 }] }] },
        { month: '2025-04', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'purchase', count: 1, value: 38 }] }, { activities: [{ type: 'attendance', count: 2 }] }] },
        { month: '2025-05', weeks: [{ activities: [{ type: 'attendance', count: 3 }] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'donation', count: 1, value: 2000 }] }, { activities: [{ type: 'attendance', count: 2 }] }] },
        { month: '2025-06', weeks: [{ activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'purchase', count: 2, value: 78 }] }, { activities: [{ type: 'attendance', count: 3 }] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-07', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'donation', count: 1, value: 1500 }] }, { activities: [{ type: 'attendance', count: 2 }] }] },
        { month: '2025-08', weeks: [{ activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'purchase', count: 1, value: 55 }] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'attendance', count: 3 }] }] },
        { month: '2025-09', weeks: [{ activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'donation', count: 1, value: 1000 }] }, { activities: [{ type: 'attendance', count: 2 }] }] },
        { month: '2025-10', weeks: [{ activities: [{ type: 'attendance', count: 3 }] }, { activities: [{ type: 'purchase', count: 1, value: 42 }] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-11', weeks: [{ activities: [{ type: 'attendance', count: 2 }, { type: 'donation', count: 1, value: 1500 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-12', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 8500, donations: 7000, revenue: 1500, lastDonation: '2025-11-01' },
    source: 'import',
    createdDate: '2024-03-15'
  },
  {
    id: 'samantha-carter',
    firstName: 'Samantha',
    lastName: 'Carter',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    email: 'samantha_itsme@gmail.com',
    phone: '(555) 678-9012',
    tags: ['major-donor', 'donor'],
    assignedTo: 'Emma Smith',
    engagement: {
      level: 'on-fire',
      visits: 67,
      lastVisit: '15/10/2025',
      activityHistory: [
        { month: '2025-02', weeks: [{ activities: [{ type: 'attendance', count: 3 }, { type: 'donation', count: 1, value: 10000 }] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'attendance', count: 4 }, { type: 'purchase', count: 2, value: 125 }] }, { activities: [{ type: 'attendance', count: 2 }] }] },
        { month: '2025-03', weeks: [{ activities: [{ type: 'attendance', count: 3 }] }, { activities: [{ type: 'attendance', count: 2 }, { type: 'donation', count: 1, value: 15000 }] }, { activities: [{ type: 'attendance', count: 4 }] }, { activities: [{ type: 'attendance', count: 3 }, { type: 'purchase', count: 1, value: 89 }] }] },
        { month: '2025-04', weeks: [{ activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'attendance', count: 3 }] }, { activities: [{ type: 'attendance', count: 2 }, { type: 'donation', count: 1, value: 5000 }] }, { activities: [{ type: 'attendance', count: 4 }] }] },
        { month: '2025-05', weeks: [{ activities: [{ type: 'attendance', count: 3 }, { type: 'purchase', count: 2, value: 156 }] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'attendance', count: 4 }] }, { activities: [{ type: 'attendance', count: 2 }, { type: 'donation', count: 1, value: 25000 }] }] },
        { month: '2025-06', weeks: [{ activities: [{ type: 'attendance', count: 4 }] }, { activities: [{ type: 'attendance', count: 3 }] }, { activities: [{ type: 'attendance', count: 2 }, { type: 'purchase', count: 1, value: 78 }] }, { activities: [{ type: 'attendance', count: 3 }] }] },
        { month: '2025-07', weeks: [{ activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'attendance', count: 4 }, { type: 'donation', count: 1, value: 20000 }] }, { activities: [{ type: 'attendance', count: 3 }] }, { activities: [{ type: 'attendance', count: 2 }] }] },
        { month: '2025-08', weeks: [{ activities: [{ type: 'attendance', count: 3 }, { type: 'purchase', count: 2, value: 112 }] }, { activities: [{ type: 'attendance', count: 4 }] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'attendance', count: 3 }, { type: 'donation', count: 1, value: 15000 }] }] },
        { month: '2025-09', weeks: [{ activities: [{ type: 'attendance', count: 4 }] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'attendance', count: 3 }, { type: 'purchase', count: 1, value: 65 }] }, { activities: [{ type: 'attendance', count: 4 }] }] },
        { month: '2025-10', weeks: [{ activities: [{ type: 'attendance', count: 3 }] }, { activities: [{ type: 'attendance', count: 4 }, { type: 'donation', count: 1, value: 30000 }] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [] }] },
        { month: '2025-11', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-12', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 125000, donations: 120000, revenue: 5000, lastDonation: '2025-10-15' },
    source: 'import',
    createdDate: '2023-05-01'
  },
  {
    id: 'john-martinez',
    firstName: 'John',
    lastName: 'Martinez',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    email: 'johnsonmchl@microsoft.com',
    phone: '(555) 789-0123',
    tags: ['donor', 'corporate'],
    assignedTo: 'Emma Smith',
    engagement: {
      level: 'warm',
      visits: 18,
      lastVisit: '10/11/2025',
      activityHistory: [
        { month: '2025-02', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-03', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [] }, { activities: [{ type: 'donation', count: 1, value: 500 }] }] },
        { month: '2025-04', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'purchase', count: 1, value: 45 }] }, { activities: [] }] },
        { month: '2025-05', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-06', weeks: [{ activities: [{ type: 'attendance', count: 2 }] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'donation', count: 1, value: 500 }] }] },
        { month: '2025-07', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'purchase', count: 1, value: 38 }] }, { activities: [] }] },
        { month: '2025-08', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-09', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [] }, { activities: [{ type: 'donation', count: 1, value: 500 }] }] },
        { month: '2025-10', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'purchase', count: 1, value: 52 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-11', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 2 }, { type: 'donation', count: 1, value: 500 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-12', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 3200, donations: 2000, revenue: 1200, lastDonation: '2025-11-10' },
    membership: {
      status: 'active',
      programme: 'General Membership',
      tier: 'Gold',
      memberSince: '15/03/2023',
      currentPeriod: '15 June 2026',
      periodType: 'yearly',
      daysToRenewal: 120,
      price: 145.99,
      totalSavings: 412.50,
      patronId: 'samantha-carter',
      membershipId: 'MEM-2023-089',
      periodStart: '15/06/2025',
      validUntil: '15/06/2026',
      cardStyle: {
        backgroundColor: '#B8860B',
        textColor: '#ffffff',
        accentColor: '#D4AF37'
      },
      autoRenewal: true,
      paymentMethod: {
        type: 'amex',
        last4: '1008'
      },
      memberYears: 3,
      upgradeEligible: false,
      benefits: [
        { category: 'access', title: 'Unlimited visits', description: 'to all exhibits', usage: { used: 67, limit: null, resetDate: null }, icon: 'fa-ticket' },
        { category: 'access', title: 'Priority entry', description: 'skip the line', usage: null, icon: 'fa-forward' },
        { category: 'discount', title: 'Bring a friend for free', description: 'every visit', usage: { used: 4, limit: 5, resetDate: '15/06/2026' }, icon: 'fa-user-plus' },
        { category: 'discount', title: '20% off special events', description: "your ticket and friend's ticket", usage: null, icon: 'fa-percent' },
        { category: 'discount', title: '10% F&B discount', description: 'at all venue restaurants', usage: { used: 25, limit: null, resetDate: null }, icon: 'fa-utensils' },
        { category: 'complimentary', title: 'Welcome pack', description: 'Paradox tote + exclusive goodies', usage: { used: 1, limit: 1, resetDate: null }, icon: 'fa-gift' }
      ],
      usageAnalytics: {
        overallPercentage: 85,
        categories: [
          { name: 'Admissions', used: 67, available: 'unlimited', percentage: 95 },
          { name: 'Guest Passes', used: 4, available: 5, percentage: 80 },
          { name: 'F&B Discounts', used: 25, available: 'unlimited', percentage: 85 },
          { name: 'Event Discounts', used: 3, available: 'unlimited', percentage: 60 }
        ],
        unusedBenefits: ['Priority entry'],
        mostUsed: 'Admissions'
      },
      beneficiaries: [
        { id: 1, name: 'Samantha Carter', role: 'Primary', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face' },
        { id: 2, name: 'Michael Carter', role: 'Spouse', avatar: null }
      ],
      membershipHistory: [
        { date: '2023-03-15', event: 'Joined', tier: 'Silver', programme: 'General Membership' },
        { date: '2023-09-01', event: 'Upgraded', tier: 'Gold', programme: 'General Membership' },
        { date: '2024-06-15', event: 'Renewed', tier: 'Gold', programme: 'General Membership' },
        { date: '2025-06-15', event: 'Renewed', tier: 'Gold', programme: 'General Membership' }
      ]
    },
    source: 'import',
    createdDate: '2024-09-10'
  },
  {
    id: 'mia-wilson',
    firstName: 'Mia',
    lastName: 'Wilson',
    photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face',
    email: 'mia_wilson1960@gmail.com',
    phone: '(555) 890-1234',
    tags: ['donor'],
    assignedTo: 'Sophia Anderson',
    engagement: {
      level: 'on-fire',
      visits: 52,
      lastVisit: '30/10/2025',
      activityHistory: [
        { month: '2025-02', weeks: [{ activities: [{ type: 'attendance', count: 2 }, { type: 'donation', count: 1, value: 5000 }] }, { activities: [{ type: 'attendance', count: 3 }] }, { activities: [{ type: 'attendance', count: 2 }, { type: 'purchase', count: 1, value: 95 }] }, { activities: [{ type: 'attendance', count: 2 }] }] },
        { month: '2025-03', weeks: [{ activities: [{ type: 'attendance', count: 3 }] }, { activities: [{ type: 'attendance', count: 2 }, { type: 'donation', count: 1, value: 10000 }] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'attendance', count: 3 }] }] },
        { month: '2025-04', weeks: [{ activities: [{ type: 'attendance', count: 2 }, { type: 'purchase', count: 2, value: 145 }] }, { activities: [{ type: 'attendance', count: 3 }] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'attendance', count: 2 }, { type: 'donation', count: 1, value: 15000 }] }] },
        { month: '2025-05', weeks: [{ activities: [{ type: 'attendance', count: 3 }] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'attendance', count: 3 }, { type: 'purchase', count: 1, value: 78 }] }, { activities: [{ type: 'attendance', count: 2 }] }] },
        { month: '2025-06', weeks: [{ activities: [{ type: 'attendance', count: 2 }, { type: 'donation', count: 1, value: 10000 }] }, { activities: [{ type: 'attendance', count: 3 }] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'attendance', count: 3 }] }] },
        { month: '2025-07', weeks: [{ activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'attendance', count: 3 }, { type: 'purchase', count: 2, value: 112 }] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'attendance', count: 2 }, { type: 'donation', count: 1, value: 15000 }] }] },
        { month: '2025-08', weeks: [{ activities: [{ type: 'attendance', count: 3 }] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'attendance', count: 3 }, { type: 'purchase', count: 1, value: 65 }] }, { activities: [{ type: 'attendance', count: 2 }] }] },
        { month: '2025-09', weeks: [{ activities: [{ type: 'attendance', count: 2 }, { type: 'donation', count: 1, value: 10000 }] }, { activities: [{ type: 'attendance', count: 3 }] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'attendance', count: 3 }] }] },
        { month: '2025-10', weeks: [{ activities: [{ type: 'attendance', count: 3 }] }, { activities: [{ type: 'attendance', count: 2 }, { type: 'purchase', count: 1, value: 89 }] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'attendance', count: 3 }, { type: 'donation', count: 1, value: 15000 }] }] },
        { month: '2025-11', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-12', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 85000, donations: 80000, revenue: 5000, lastDonation: '2025-10-30' },
    source: 'import',
    createdDate: '2023-08-20'
  },
  {
    id: 'olivia-brown',
    firstName: 'Olivia',
    lastName: 'Brown',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
    email: 'olibrown@gmail.com',
    phone: '(555) 901-2345',
    tags: ['donor'],
    assignedTo: 'Lucas Thomas',
    engagement: {
      level: 'cool',
      visits: 12,
      lastVisit: '05/11/2025',
      activityHistory: [
        { month: '2025-02', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-03', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'donation', count: 1, value: 400 }] }] },
        { month: '2025-04', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-05', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'purchase', count: 1, value: 35 }] }] },
        { month: '2025-06', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'donation', count: 1, value: 400 }] }, { activities: [] }] },
        { month: '2025-07', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-08', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'purchase', count: 1, value: 42 }] }] },
        { month: '2025-09', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'donation', count: 1, value: 400 }] }] },
        { month: '2025-10', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-11', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-12', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 1800, donations: 1200, revenue: 600, lastDonation: '2025-11-05' },
    source: 'import',
    createdDate: '2025-01-15'
  },
  {
    id: 'ethan-davis',
    firstName: 'Ethan',
    lastName: 'Davis',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
    email: 'ethan_davies_1234@gmail.com',
    phone: '(555) 012-3456',
    tags: ['donor'],
    assignedTo: 'Emma Smith',
    engagement: {
      level: 'cool',
      visits: 15,
      lastVisit: '25/10/2025',
      activityHistory: [
        { month: '2025-02', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-03', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'purchase', count: 1, value: 45 }] }, { activities: [] }] },
        { month: '2025-04', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-05', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'donation', count: 1, value: 250 }] }] },
        { month: '2025-06', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'purchase', count: 1, value: 38 }] }] },
        { month: '2025-07', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-08', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'purchase', count: 1, value: 52 }] }] },
        { month: '2025-09', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-10', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [] }] },
        { month: '2025-11', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-12', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 950, donations: 250, revenue: 700, lastDonation: '2025-10-25' },
    membership: {
      status: 'active',
      programme: 'General Membership',
      tier: 'Silver',
      memberSince: '01/05/2024',
      currentPeriod: '01 May 2026',
      periodType: 'yearly',
      daysToRenewal: 90,
      price: 89.99,
      totalSavings: 67.20,
      patronId: 'olivia-brown',
      membershipId: 'MEM-2024-156',
      periodStart: '01/05/2025',
      validUntil: '01/05/2026',
      cardStyle: {
        backgroundColor: '#5C6B7A',
        textColor: '#ffffff',
        accentColor: '#B8C5D1'
      },
      autoRenewal: true,
      paymentMethod: {
        type: 'mastercard',
        last4: '3344'
      },
      memberYears: 2,
      upgradeEligible: true,
      upgradeTier: 'Gold',
      benefits: [
        { category: 'access', title: 'Unlimited visits', description: 'to all standard exhibits', usage: { used: 12, limit: null, resetDate: null }, icon: 'fa-ticket' },
        { category: 'discount', title: 'Bring a friend for free', description: 'twice per year', usage: { used: 1, limit: 2, resetDate: '01/05/2026' }, icon: 'fa-user-plus' },
        { category: 'discount', title: '10% off special events', description: 'your ticket only', usage: null, icon: 'fa-percent' },
        { category: 'discount', title: '5% F&B discount', description: 'at main café', usage: { used: 4, limit: null, resetDate: null }, icon: 'fa-utensils' }
      ],
      usageAnalytics: {
        overallPercentage: 50,
        categories: [
          { name: 'Admissions', used: 12, available: 'unlimited', percentage: 45 },
          { name: 'Guest Passes', used: 1, available: 2, percentage: 50 },
          { name: 'F&B Discounts', used: 4, available: 'unlimited', percentage: 35 },
          { name: 'Event Discounts', used: 1, available: 'unlimited', percentage: 25 }
        ],
        unusedBenefits: [],
        mostUsed: 'Admissions'
      },
      beneficiaries: [
        { id: 1, name: 'Olivia Brown', role: 'Primary', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=40&h=40&fit=crop&crop=face' }
      ],
      membershipHistory: [
        { date: '2024-05-01', event: 'Joined', tier: 'Silver', programme: 'General Membership' },
        { date: '2025-05-01', event: 'Renewed', tier: 'Silver', programme: 'General Membership' }
      ]
    },
    source: 'import',
    createdDate: '2024-12-01'
  },

  // ============================================
  // GENERAL CONSTITUENTS (no assignedTo)
  // These are in the database but not actively managed.
  // They may be promoted to Managed Prospect by assigning
  // them to a relationship manager.
  // ============================================
  
  {
    id: 'rachel-kim',
    firstName: 'Rachel',
    lastName: 'Kim',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
    email: 'rachel.kim@gmail.com',
    phone: '(555) 222-3333',
    tags: ['donor'],
    // General Constituent - RECENTLY ADDED via ticket purchase
    engagement: {
      level: 'cool',
      visits: 6,
      lastVisit: '20/12/2025',
      activityHistory: [
        { month: '2025-02', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-03', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-04', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-05', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-06', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-07', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-08', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-09', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-10', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-11', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'membership', count: 1, value: 100 }] }] },
        { month: '2025-12', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'donation', count: 1, value: 100 }] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 450, donations: 100, revenue: 350, lastDonation: '2025-12-15' },
    membership: {
      status: 'active',
      programme: 'General Membership',
      tier: 'Basic',
      memberSince: '25/11/2025',
      currentPeriod: '25 November 2026',
      periodType: 'yearly',
      daysToRenewal: 250,
      price: 49.99,
      totalSavings: 24.00,
      patronId: 'rachel-kim',
      membershipId: 'MEM-2025-589',
      periodStart: '25/11/2025',
      validUntil: '25/11/2026',
      cardStyle: {
        backgroundColor: '#8B7355',
        textColor: '#ffffff',
        accentColor: '#A89070'
      },
      autoRenewal: false,
      paymentMethod: {
        type: 'mastercard',
        last4: '6622'
      },
      memberYears: 1,
      upgradeEligible: true,
      upgradeTier: 'Silver',
      benefits: [
        { category: 'access', title: 'Unlimited visits', description: 'to all standard exhibits', usage: { used: 6, limit: null, resetDate: null }, icon: 'fa-ticket' }
      ],
      usageAnalytics: {
        overallPercentage: 40,
        categories: [
          { name: 'Admissions', used: 6, available: 'unlimited', percentage: 40 }
        ],
        unusedBenefits: [],
        mostUsed: 'Admissions'
      },
      beneficiaries: [
        { id: 1, name: 'Rachel Kim', role: 'Primary', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face' }
      ],
      membershipHistory: [
        { date: '2025-11-25', event: 'Joined', tier: 'Basic', programme: 'General Membership' }
      ]
    },
    createdDate: '2026-02-03',
    source: 'ticket'
  },
  {
    id: 'david-chen',
    firstName: 'David',
    lastName: 'Chen',
    photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face',
    email: 'd.chen@company.com',
    phone: '(555) 333-4444',
    tags: ['donor'],
    // General Constituent - RECENTLY ADDED via online donation
    engagement: {
      level: 'cold',
      visits: 2,
      lastVisit: '05/09/2025',
      activityHistory: [
        { month: '2025-02', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-03', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-04', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-05', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-06', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-07', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-08', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'donation', count: 1, value: 200 }] }, { activities: [] }] },
        { month: '2025-09', weeks: [{ activities: [{ type: 'attendance', count: 2 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-10', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-11', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-12', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 275, donations: 200, revenue: 75, lastDonation: '2025-08-20' },
    createdDate: '2026-02-01',
    source: 'online'
  },
  {
    id: 'maria-santos',
    firstName: 'Maria',
    lastName: 'Santos',
    photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    email: 'maria.santos@email.com',
    phone: '(555) 444-5555',
    tags: ['donor'],
    // General Constituent - RECENTLY ADDED via membership signup
    engagement: {
      level: 'warm',
      visits: 18,
      lastVisit: '28/01/2026',
      activityHistory: [
        { month: '2025-02', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-03', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-04', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-05', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-06', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-07', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-08', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'purchase', count: 1, value: 55 }] }] },
        { month: '2025-09', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-10', weeks: [{ activities: [{ type: 'attendance', count: 2 }] }, { activities: [] }, { activities: [{ type: 'membership', count: 1, value: 150 }] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-11', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-12', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'donation', count: 1, value: 150 }] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2026-01', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'attendance', count: 1 }] }] }
      ]
    },
    giving: { lifetimeValue: 620, donations: 150, revenue: 470, lastDonation: '2026-01-20' },
    membership: {
      status: 'active',
      programme: 'General Membership',
      tier: 'Silver',
      memberSince: '15/10/2025',
      currentPeriod: '15 April 2026',
      periodType: 'yearly',
      daysToRenewal: 60,
      price: 89.99,
      totalSavings: 95.40,
      patronId: 'maria-santos',
      membershipId: 'MEM-2025-421',
      periodStart: '15/10/2025',
      validUntil: '15/10/2026',
      cardStyle: {
        backgroundColor: '#5C6B7A',
        textColor: '#ffffff',
        accentColor: '#B8C5D1'
      },
      autoRenewal: true,
      paymentMethod: {
        type: 'visa',
        last4: '9156'
      },
      memberYears: 1,
      upgradeEligible: true,
      upgradeTier: 'Gold',
      benefits: [
        { category: 'access', title: 'Unlimited visits', description: 'to all standard exhibits', usage: { used: 18, limit: null, resetDate: null }, icon: 'fa-ticket' },
        { category: 'discount', title: 'Bring a friend for free', description: 'twice per year', usage: { used: 2, limit: 2, resetDate: '15/10/2026' }, icon: 'fa-user-plus' },
        { category: 'discount', title: '10% off special events', description: 'your ticket only', usage: null, icon: 'fa-percent' },
        { category: 'discount', title: '5% F&B discount', description: 'at main café', usage: { used: 6, limit: null, resetDate: null }, icon: 'fa-utensils' }
      ],
      usageAnalytics: {
        overallPercentage: 70,
        categories: [
          { name: 'Admissions', used: 18, available: 'unlimited', percentage: 70 },
          { name: 'Guest Passes', used: 2, available: 2, percentage: 100 },
          { name: 'F&B Discounts', used: 6, available: 'unlimited', percentage: 50 },
          { name: 'Event Discounts', used: 2, available: 'unlimited', percentage: 40 }
        ],
        unusedBenefits: [],
        mostUsed: 'Guest Passes'
      },
      beneficiaries: [
        { id: 1, name: 'Maria Santos', role: 'Primary', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=40&h=40&fit=crop&crop=face' }
      ],
      membershipHistory: [
        { date: '2025-10-15', event: 'Joined', tier: 'Silver', programme: 'General Membership' }
      ]
    },
    createdDate: '2026-02-04',
    source: 'membership'
  },
  {
    id: 'james-wilson',
    firstName: 'James',
    lastName: 'Wilson',
    photo: null,
    email: 'jwilson@business.net',
    phone: '(555) 555-6666',
    tags: ['prospect'],
    // General Constituent - RECENTLY ADDED via ticket purchase
    engagement: {
      level: 'cold',
      visits: 1,
      lastVisit: '10/01/2026',
      activityHistory: [
        { month: '2025-02', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-03', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-04', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-05', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-06', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-07', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-08', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-09', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-10', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-11', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-12', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 50, donations: 0, revenue: 50, lastDonation: null },
    createdDate: '2026-02-05',
    source: 'ticket'
  },
  
  // ============================================
  // BENEFICIARY PATRONS (Family members with own records)
  // ============================================
  
  // Sarah Collingwood - Anderson's spouse, beneficiary on his membership
  {
    id: 'sarah-collingwood',
    firstName: 'Sarah',
    lastName: 'Collingwood',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    email: 'sarah@collingwood.com',
    phone: '(555) 123-4568',
    address: '789 Pine Rd, Austin, TX 73301',
    tags: ['donor'],
    recordStatus: 'active',
    household: {
      name: 'Collingwood Family',
      verified: true
    },
    // No assignedTo - not individually managed, but part of household
    engagement: {
      level: 'warm',
      visits: 28,
      lastVisit: '15/01/2026',
      activityHistory: [
        { month: '2025-02', weeks: [{ activities: [{ type: 'attendance', count: 2 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-03', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-04', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-05', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-06', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-07', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-08', weeks: [{ activities: [{ type: 'attendance', count: 2 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-09', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-10', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [] }] },
        { month: '2025-11', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-12', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [] }, { activities: [] }] }
      ]
    },
    giving: {
      lifetimeValue: 250,
      donations: 250,
      revenue: 0,
      giftCount: 1,
      averageGift: 250,
      lastDonation: '2025-03-15'
    },
    // No separate membership - she's a beneficiary on Anderson's
    createdDate: '2023-12-02',
    source: 'manual'
  },
  
  // Emma Collingwood - Anderson's daughter, dependent on his membership
  {
    id: 'emma-collingwood',
    firstName: 'Emma',
    lastName: 'Collingwood',
    photo: null,
    email: null, // Minor, no email
    phone: null,
    address: '789 Pine Rd, Austin, TX 73301',
    dateOfBirth: '2012-03-15', // 13 years old
    tags: [],
    recordStatus: 'active',
    household: {
      name: 'Collingwood Family',
      verified: true
    },
    // No assignedTo - dependent/minor
    engagement: {
      level: 'cool',
      visits: 7,
      lastVisit: '20/12/2025',
      activityHistory: [
        { month: '2025-02', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-03', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-04', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-05', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-06', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-07', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-08', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-09', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-10', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-11', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-12', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] }
      ]
    },
    giving: {
      lifetimeValue: 0,
      donations: 0,
      revenue: 0,
      giftCount: 0,
      lastDonation: null
    },
    // No separate membership - she's a dependent on Anderson's
    createdDate: '2024-01-15',
    source: 'manual'
  }
]

// Helper function to get patron by ID
export const getPatronById = (id) => patrons.find(p => p.id === id)

// Helper function to determine if patron is a Managed Prospect
// A managed prospect has an assignedTo (relationship manager)
export const isManagedProspect = (patron) => Boolean(patron?.assignedTo)

// Helper function to get display name
export const getPatronDisplayName = (patron) => `${patron.firstName} ${patron.lastName}`

// Helper to format date for display
export const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Helper to format date as relative time (e.g., "2 days ago", "1 year ago")
export const formatRelativeDate = (dateString) => {
  if (!dateString) return '-'
  
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  
  const diffWeeks = Math.floor(diffDays / 7)
  if (diffDays < 30) return diffWeeks === 1 ? '1 week ago' : `${diffWeeks} weeks ago`
  
  const diffMonths = Math.floor(diffDays / 30)
  if (diffDays < 365) return diffMonths === 1 ? '1 month ago' : `${diffMonths} months ago`
  
  const years = Math.floor(diffDays / 365)
  return years === 1 ? '1 year ago' : `${years} years ago`
}

// =============================================================================
// MUTATION FUNCTIONS (Mock - for demo purposes)
// =============================================================================

// Generate unique ID from name
const generatePatronId = (firstName, lastName) => {
  const baseId = `${firstName.toLowerCase()}-${lastName.toLowerCase()}`
    .replace(/[^a-z-]/g, '')
  
  // Check if ID already exists
  let uniqueId = baseId
  let counter = 1
  while (patrons.find(p => p.id === uniqueId)) {
    uniqueId = `${baseId}-${counter}`
    counter++
  }
  return uniqueId
}

// Generate empty activity history for new patrons (12 months, 4 weeks each)
const generateEmptyActivityHistory = () => {
  const months = []
  const now = new Date()
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    months.push({
      month: monthStr,
      weeks: [
        { activities: [] },
        { activities: [] },
        { activities: [] },
        { activities: [] }
      ]
    })
  }
  
  return months
}

// Add new patron
export const addPatron = (patronData) => {
  const newPatron = {
    id: generatePatronId(patronData.firstName, patronData.lastName),
    firstName: patronData.firstName,
    lastName: patronData.lastName,
    photo: null,
    email: patronData.email || null,
    phone: patronData.phone || null,
    address: patronData.address || null,
    tags: patronData.tags || ['prospect'],
    // Default empty engagement
    engagement: {
      level: 'cold',
      visits: 0,
      lastVisit: null,
      activityHistory: generateEmptyActivityHistory(),
    },
    // Default empty giving
    giving: {
      lifetimeValue: 0,
      donations: 0,
      revenue: 0,
      lastDonation: null,
    },
    // Optional notes
    notes: patronData.notes || null,
    // No relationship manager by default (General Constituent)
    assignedTo: patronData.assignedTo || null,
    // Created timestamp
    createdDate: new Date().toISOString().split('T')[0],
    // Source - how they entered the system
    source: patronData.source || 'manual',
  }
  
  patrons.push(newPatron)
  return newPatron
}

// Update existing patron
export const updatePatron = (id, updates) => {
  const index = patrons.findIndex(p => p.id === id)
  if (index === -1) return null
  
  patrons[index] = {
    ...patrons[index],
    ...updates,
  }
  
  return patrons[index]
}

// Assign patron to gift officer (convert to Managed Prospect)
export const assignPatronToOfficer = (patronId, assignedTo) => {
  return updatePatron(patronId, { assignedTo })
}

// Archive a patron (soft delete)
export const archivePatron = (patronId, reason = 'other') => {
  return updatePatron(patronId, { 
    status: 'archived',
    archivedDate: new Date().toISOString(),
    archivedReason: reason
  })
}

// Restore an archived patron
export const restorePatron = (patronId) => {
  return updatePatron(patronId, { 
    status: 'active',
    archivedDate: null,
    archivedReason: null
  })
}

// Get active patrons only (excludes archived)
export const getActivePatrons = () => patrons.filter(p => p.status !== 'archived')

// ============================================
// TAG MANAGEMENT FUNCTIONS
// ============================================

// Update a patron's tags
export const updatePatronTags = (patronId, tags) => {
  return updatePatron(patronId, { tags })
}

// Add a new custom tag
export const addCustomTag = (label) => {
  const id = label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  
  // Check if tag already exists
  const existing = patronTags.find(t => t.id === id)
  if (existing) return existing
  
  const newTag = {
    id,
    label,
    system: false, // Custom tag
  }
  patronTags.push(newTag)
  return newTag
}

// Update an existing tag's label
export const updateTagLabel = (tagId, newLabel) => {
  const tag = patronTags.find(t => t.id === tagId)
  if (!tag) return null
  tag.label = newLabel
  return tag
}

// Delete a tag from the system and remove from all patrons
export const deleteTag = (tagId) => {
  const index = patronTags.findIndex(t => t.id === tagId)
  if (index === -1) return false
  
  // Remove tag from patronTags
  patronTags.splice(index, 1)
  
  // Remove tag from all patrons that have it
  patrons.forEach(patron => {
    if (patron.tags && patron.tags.includes(tagId)) {
      patron.tags = patron.tags.filter(t => t !== tagId)
    }
  })
  
  return true
}

// Get count of patrons using a specific tag
export const getTagUsageCount = (tagId) => {
  return patrons.filter(p => p.tags && p.tags.includes(tagId)).length
}

// ============================================
// MEMBERSHIP MODEL - SEPARATE ENTITIES
// ============================================

// Tier beneficiary limits
export const tierLimits = {
  'Basic': 1,
  'Silver': 2,
  'Gold': 4,
  'Platinum': Infinity
}

// Memberships as first-class entities
export const memberships = [
  {
    id: 'mem-anderson-gold',
    programme: 'General Membership',
    tier: 'Gold',
    status: 'active',
    
    // Date tracking
    startDate: '2023-12-02',
    renewalDate: '2026-12-02',
    expirationDate: '2026-12-02',
    
    // MembershipOverview required properties
    membershipId: 'MEM-2023-001',  // For QR code display
    periodStart: '02/12/2025',     // DD/MM/YYYY format for progress bar
    validUntil: '02/12/2026',      // DD/MM/YYYY format for progress bar
    daysToRenewal: 300,            // For churn risk calculation
    
    // Auto-renewal
    autoRenew: true,
    autoRenewal: true,  // Alias for MembershipOverview compatibility
    paymentMethod: { type: 'visa', last4: '4242' },
    memberYears: 2,
    
    // Card styling
    cardStyle: {
      backgroundColor: '#1a5a5a',
      textColor: '#ffffff',
      accentColor: '#ffeb3b'
    },
    
    // Usage analytics
    usageAnalytics: {
      overallPercentage: 67,
      categories: [
        { name: 'Admissions', used: 47, available: 'unlimited', percentage: 100 },
        { name: 'Guest Passes', used: 3, available: 5, percentage: 60 },
        { name: 'F&B Discounts', used: 12, available: 'unlimited', percentage: 100 },
        { name: 'Event Discounts', used: 2, available: 'unlimited', percentage: 100 }
      ],
      unusedBenefits: ['Welcome pack', 'Priority entry'],
      mostUsed: 'Admissions'
    },
    
    // Upgrade options
    upgradeEligible: true,
    upgradeTier: 'Platinum',
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
    },
    
    // Benefits with usage tracking
    benefits: [
      { category: 'access', title: 'Unlimited visits', description: 'to all exhibits', usage: { used: 47, limit: null, resetDate: null }, icon: 'fa-ticket' },
      { category: 'access', title: 'Priority entry', description: 'skip the line', usage: null, icon: 'fa-forward' },
      { category: 'discount', title: 'Bring a friend for free', description: 'every visit', usage: { used: 3, limit: 5, resetDate: '12/02/2026' }, icon: 'fa-user-plus' },
      { category: 'discount', title: '20% off special events', description: "your ticket and friend's ticket", usage: null, icon: 'fa-percent' },
      { category: 'discount', title: '10% F&B discount', description: 'at all venue restaurants', usage: { used: 12, limit: null, resetDate: null }, icon: 'fa-utensils' },
      { category: 'complimentary', title: 'Welcome pack', description: 'Paradox tote + exclusive goodies', usage: { used: 1, limit: 1, resetDate: null }, icon: 'fa-gift' }
    ],
    
    // Member events
    memberEvents: {
      earlyAccess: [
        { id: 1, name: 'Halloween Night Special', date: '2026-10-31', memberAccess: '2026-10-15', publicAccess: '2026-10-22', status: 'upcoming', image: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=100&h=60&fit=crop' },
        { id: 3, name: 'Spring Gala 2026', date: '2026-04-20', memberAccess: '2026-03-01', publicAccess: '2026-03-15', status: 'unlocked', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&h=60&fit=crop' },
        { id: 4, name: 'Summer Concert Series', date: '2026-07-04', memberAccess: '2026-06-01', publicAccess: '2026-06-15', status: 'upcoming', image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=100&h=60&fit=crop' }
      ],
      memberOnly: [
        { id: 2, name: 'VIP Wine Tasting Evening', date: '2026-03-15', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=100&h=60&fit=crop', exclusive: true },
        { id: 5, name: 'Members Evening: Behind the Scenes', date: '2026-02-28', image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=100&h=60&fit=crop', exclusive: true },
        { id: 6, name: 'Curator Talk: Modern Art', date: '2026-03-22', image: 'https://images.unsplash.com/photo-1577083288073-40892c0860a4?w=100&h=60&fit=crop', exclusive: true }
      ]
    },
    
    // Membership history
    membershipHistory: [
      { date: '2023-12-02', event: 'Joined', tier: 'Silver', programme: 'General Membership' },
      { date: '2024-06-15', event: 'Upgraded', tier: 'Gold', programme: 'General Membership' },
      { date: '2024-12-02', event: 'Renewed', tier: 'Gold', programme: 'General Membership' },
      { date: '2025-12-02', event: 'Renewed', tier: 'Gold', programme: 'General Membership' }
    ],
    
    // Legacy alias for history
    history: [
      { date: '2023-12-02', event: 'Joined', tier: 'Silver', programme: 'General Membership' },
      { date: '2024-06-15', event: 'Upgraded', tier: 'Gold', programme: 'General Membership' },
      { date: '2024-12-02', event: 'Renewed', tier: 'Gold', programme: 'General Membership' },
      { date: '2025-12-02', event: 'Renewed', tier: 'Gold', programme: 'General Membership' }
    ]
  }
]

// Membership beneficiaries (join table)
export const membershipBeneficiaries = [
  {
    id: 'mb-1',
    membershipId: 'mem-anderson-gold',
    patronId: 'anderson-collingwood',
    role: 'primary',
    roleLabel: 'Primary',
    canManage: true,
    addedDate: '2023-12-02',
    removedDate: null,
    status: 'active'
  },
  {
    id: 'mb-2',
    membershipId: 'mem-anderson-gold',
    patronId: 'sarah-collingwood',
    role: 'beneficiary',
    roleLabel: 'Spouse',
    canManage: false,
    addedDate: '2023-12-02',
    removedDate: null,
    status: 'active'
  },
  {
    id: 'mb-3',
    membershipId: 'mem-anderson-gold',
    patronId: 'emma-collingwood',
    role: 'dependent',
    roleLabel: 'Child',
    canManage: false,
    addedDate: '2024-01-15',
    removedDate: null,
    status: 'active'
  }
]

// Membership usage tracking (per beneficiary)
export const membershipUsage = [
  // Anderson's usage
  { id: 'usage-1', membershipId: 'mem-anderson-gold', patronId: 'anderson-collingwood', benefitType: 'admission', quantity: 12 },
  { id: 'usage-2', membershipId: 'mem-anderson-gold', patronId: 'anderson-collingwood', benefitType: 'guest_pass', quantity: 1 },
  { id: 'usage-3', membershipId: 'mem-anderson-gold', patronId: 'anderson-collingwood', benefitType: 'fb_discount', quantity: 4 },
  // Sarah's usage
  { id: 'usage-4', membershipId: 'mem-anderson-gold', patronId: 'sarah-collingwood', benefitType: 'admission', quantity: 28 },
  { id: 'usage-5', membershipId: 'mem-anderson-gold', patronId: 'sarah-collingwood', benefitType: 'guest_pass', quantity: 2 },
  { id: 'usage-6', membershipId: 'mem-anderson-gold', patronId: 'sarah-collingwood', benefitType: 'fb_discount', quantity: 8 },
  // Emma's usage
  { id: 'usage-7', membershipId: 'mem-anderson-gold', patronId: 'emma-collingwood', benefitType: 'admission', quantity: 7 },
  { id: 'usage-8', membershipId: 'mem-anderson-gold', patronId: 'emma-collingwood', benefitType: 'guest_pass', quantity: 0 },
  { id: 'usage-9', membershipId: 'mem-anderson-gold', patronId: 'emma-collingwood', benefitType: 'fb_discount', quantity: 0 },
]

// Relationships (CRM connections between patrons)
export const patronRelationships = [
  // Anderson's relationships
  {
    id: 'rel-1',
    fromPatronId: 'anderson-collingwood',
    toPatronId: 'sarah-collingwood',
    type: 'household',
    role: 'Spouse',
    reciprocalRole: 'Spouse',
    isPrimary: true,
    startDate: null,
    endDate: null,
    notes: null
  },
  {
    id: 'rel-2',
    fromPatronId: 'anderson-collingwood',
    toPatronId: 'emma-collingwood',
    type: 'household',
    role: 'Daughter',
    reciprocalRole: 'Father',
    isPrimary: false,
    startDate: null,
    endDate: null,
    notes: null
  },
  // Sarah's reverse relationships (auto-created)
  {
    id: 'rel-3',
    fromPatronId: 'sarah-collingwood',
    toPatronId: 'anderson-collingwood',
    type: 'household',
    role: 'Spouse',
    reciprocalRole: 'Spouse',
    isPrimary: true,
    startDate: null,
    endDate: null,
    notes: null
  },
  {
    id: 'rel-4',
    fromPatronId: 'sarah-collingwood',
    toPatronId: 'emma-collingwood',
    type: 'household',
    role: 'Daughter',
    reciprocalRole: 'Mother',
    isPrimary: false,
    startDate: null,
    endDate: null,
    notes: null
  },
  // Emma's reverse relationships
  {
    id: 'rel-5',
    fromPatronId: 'emma-collingwood',
    toPatronId: 'anderson-collingwood',
    type: 'household',
    role: 'Father',
    reciprocalRole: 'Daughter',
    isPrimary: true,
    startDate: null,
    endDate: null,
    notes: null
  },
  {
    id: 'rel-6',
    fromPatronId: 'emma-collingwood',
    toPatronId: 'sarah-collingwood',
    type: 'household',
    role: 'Mother',
    reciprocalRole: 'Daughter',
    isPrimary: false,
    startDate: null,
    endDate: null,
    notes: null
  },
  // Anderson's professional relationships
  {
    id: 'rel-7',
    fromPatronId: 'anderson-collingwood',
    toPatronId: null, // External contact (not in system as patron yet)
    type: 'professional',
    role: 'Financial Advisor',
    reciprocalRole: 'Client',
    isPrimary: false,
    startDate: null,
    endDate: null,
    notes: 'Robert Chen - handles estate planning',
    externalContact: { name: 'Robert Chen', company: 'Collingwood Wealth Management', initials: 'RC' }
  }
]

// ============================================
// MEMBERSHIP HELPER FUNCTIONS
// ============================================

// Get all memberships for a patron (where they are primary or beneficiary)
export const getMembershipsByPatronId = (patronId) => {
  if (!patronId) return []
  
  const beneficiaryLinks = membershipBeneficiaries.filter(
    mb => mb.patronId === patronId && mb.status === 'active'
  )
  
  return beneficiaryLinks
    .map(link => {
      const membership = memberships.find(m => m.id === link.membershipId)
      if (!membership) return null
      return {
        ...membership,
        patronId: patronId,  // Add patron ID for QR code in MembershipOverview
        patronRole: link.role,
        patronRoleLabel: link.roleLabel,
        canManage: link.canManage,
        addedDate: link.addedDate
      }
    })
    .filter(Boolean) // Remove any null entries
}

// Get all beneficiaries for a membership (with full patron data)
export const getBeneficiariesByMembershipId = (membershipId) => {
  const links = membershipBeneficiaries.filter(
    mb => mb.membershipId === membershipId && mb.status === 'active'
  )
  
  return links.map(link => {
    const patron = patrons.find(p => p.id === link.patronId)
    return {
      ...link,
      patron: patron ? {
        id: patron.id,
        firstName: patron.firstName,
        lastName: patron.lastName,
        name: `${patron.firstName} ${patron.lastName}`,
        email: patron.email,
        photo: patron.photo,
        dateOfBirth: patron.dateOfBirth
      } : null
    }
  })
}

// Get a patron's role on a specific membership
export const getPatronMembershipRole = (patronId, membershipId) => {
  const link = membershipBeneficiaries.find(
    mb => mb.patronId === patronId && mb.membershipId === membershipId && mb.status === 'active'
  )
  return link ? link.role : null
}

// Check if patron is primary on a membership
export const isPatronPrimaryOnMembership = (patronId, membershipId) => {
  return getPatronMembershipRole(patronId, membershipId) === 'primary'
}

// Get primary patron for a membership
export const getPrimaryPatronForMembership = (membershipId) => {
  const primaryLink = membershipBeneficiaries.find(
    mb => mb.membershipId === membershipId && mb.role === 'primary' && mb.status === 'active'
  )
  if (!primaryLink) return null
  
  const patron = patrons.find(p => p.id === primaryLink.patronId)
  return patron ? {
    id: patron.id,
    firstName: patron.firstName,
    lastName: patron.lastName,
    name: `${patron.firstName} ${patron.lastName}`,
    email: patron.email,
    photo: patron.photo
  } : null
}

// Get beneficiary slot info for a membership
export const getMembershipSlotInfo = (membershipId) => {
  const membership = memberships.find(m => m.id === membershipId)
  if (!membership) return null
  
  const activeBeneficiaries = membershipBeneficiaries.filter(
    mb => mb.membershipId === membershipId && mb.status === 'active'
  )
  
  const limit = tierLimits[membership.tier] || 1
  
  return {
    used: activeBeneficiaries.length,
    limit: limit === Infinity ? 'unlimited' : limit,
    available: limit === Infinity ? Infinity : limit - activeBeneficiaries.length,
    canAdd: limit === Infinity || activeBeneficiaries.length < limit
  }
}

// Get usage breakdown by patron for a membership
export const getMembershipUsageByPatron = (membershipId) => {
  const usage = membershipUsage.filter(u => u.membershipId === membershipId)
  const beneficiaries = getBeneficiariesByMembershipId(membershipId)
  
  const breakdown = {}
  beneficiaries.forEach(b => {
    const patronUsage = usage.filter(u => u.patronId === b.patronId)
    breakdown[b.patronId] = {
      patron: b.patron,
      role: b.roleLabel,
      usage: patronUsage.reduce((acc, u) => {
        acc[u.benefitType] = (acc[u.benefitType] || 0) + u.quantity
        return acc
      }, {})
    }
  })
  
  return breakdown
}

// Add a beneficiary to a membership
export const addBeneficiaryToMembership = (membershipId, patronId, roleLabel, createRelationship = false) => {
  const slotInfo = getMembershipSlotInfo(membershipId)
  if (!slotInfo.canAdd) {
    return { success: false, error: 'Membership has reached beneficiary limit' }
  }
  
  // Check if patron is already on this membership
  const existing = membershipBeneficiaries.find(
    mb => mb.membershipId === membershipId && mb.patronId === patronId && mb.status === 'active'
  )
  if (existing) {
    return { success: false, error: 'Patron is already a beneficiary on this membership' }
  }
  
  const newBeneficiary = {
    id: `mb-${Date.now()}`,
    membershipId,
    patronId,
    role: 'beneficiary',
    roleLabel,
    canManage: false,
    addedDate: new Date().toISOString().split('T')[0],
    removedDate: null,
    status: 'active'
  }
  
  membershipBeneficiaries.push(newBeneficiary)
  
  // Optionally create household relationship
  if (createRelationship) {
    const primary = getPrimaryPatronForMembership(membershipId)
    if (primary && primary.id !== patronId) {
      addPatronRelationship(primary.id, patronId, 'household', roleLabel)
    }
  }
  
  return { success: true, beneficiary: newBeneficiary }
}

// Remove a beneficiary from a membership (soft delete)
export const removeBeneficiaryFromMembership = (membershipId, patronId, removeRelationship = false) => {
  const link = membershipBeneficiaries.find(
    mb => mb.membershipId === membershipId && mb.patronId === patronId && mb.status === 'active'
  )
  
  if (!link) {
    return { success: false, error: 'Beneficiary not found on this membership' }
  }
  
  if (link.role === 'primary') {
    return { success: false, error: 'Cannot remove primary account holder' }
  }
  
  link.status = 'removed'
  link.removedDate = new Date().toISOString().split('T')[0]
  
  // Optionally end the relationship
  if (removeRelationship) {
    const primary = getPrimaryPatronForMembership(membershipId)
    if (primary) {
      endPatronRelationship(primary.id, patronId)
    }
  }
  
  return { success: true }
}

// ============================================
// RELATIONSHIP HELPER FUNCTIONS
// ============================================

// Get relationships for a patron
export const getPatronRelationships = (patronId) => {
  if (!patronId) return []
  
  return patronRelationships.filter(
    r => r.fromPatronId === patronId && !r.endDate
  ).map(rel => {
    // Get linked patron data if it exists
    let linkedPatron = null
    if (rel.toPatronId) {
      const patron = patrons.find(p => p.id === rel.toPatronId)
      if (patron) {
        linkedPatron = {
          id: patron.id,
          firstName: patron.firstName,
          lastName: patron.lastName,
          name: `${patron.firstName} ${patron.lastName}`,
          email: patron.email,
          photo: patron.photo
        }
      }
    }
    
    return {
      ...rel,
      linkedPatron,
      displayName: linkedPatron ? linkedPatron.name : rel.externalContact?.name || 'Unknown',
      initials: linkedPatron 
        ? `${linkedPatron.firstName[0]}${linkedPatron.lastName[0]}`
        : rel.externalContact?.initials || '??'
    }
  })
}

// Add a relationship between patrons
export const addPatronRelationship = (fromPatronId, toPatronId, type, role, reciprocalRole = null) => {
  // Determine reciprocal role based on role if not provided
  const reciprocal = reciprocalRole || getReciprocalRole(role)
  
  // Create relationship from -> to
  const rel1 = {
    id: `rel-${Date.now()}-1`,
    fromPatronId,
    toPatronId,
    type,
    role,
    reciprocalRole: reciprocal,
    isPrimary: false,
    startDate: new Date().toISOString().split('T')[0],
    endDate: null,
    notes: null
  }
  patronRelationships.push(rel1)
  
  // Create reciprocal relationship to -> from
  const rel2 = {
    id: `rel-${Date.now()}-2`,
    fromPatronId: toPatronId,
    toPatronId: fromPatronId,
    type,
    role: reciprocal,
    reciprocalRole: role,
    isPrimary: false,
    startDate: new Date().toISOString().split('T')[0],
    endDate: null,
    notes: null
  }
  patronRelationships.push(rel2)
  
  return { rel1, rel2 }
}

// End a relationship (soft delete)
export const endPatronRelationship = (fromPatronId, toPatronId) => {
  const today = new Date().toISOString().split('T')[0]
  
  // End both directions
  patronRelationships.forEach(rel => {
    if (
      (rel.fromPatronId === fromPatronId && rel.toPatronId === toPatronId) ||
      (rel.fromPatronId === toPatronId && rel.toPatronId === fromPatronId)
    ) {
      rel.endDate = today
    }
  })
}

// Get reciprocal role
const getReciprocalRole = (role) => {
  const reciprocals = {
    'Spouse': 'Spouse',
    'Partner': 'Partner',
    'Child': 'Parent',
    'Parent': 'Child',
    'Daughter': 'Parent',
    'Son': 'Parent',
    'Father': 'Child',
    'Mother': 'Child',
    'Sibling': 'Sibling',
    'Friend': 'Friend',
    'Colleague': 'Colleague',
    'Financial Advisor': 'Client',
    'Client': 'Financial Advisor'
  }
  return reciprocals[role] || role
}

// Search patrons by name or email (for add beneficiary modal)
export const searchPatrons = (query, excludeIds = []) => {
  if (!query || query.length < 2) return []
  
  const lowerQuery = query.toLowerCase()
  
  return patrons
    .filter(p => {
      if (excludeIds.includes(p.id)) return false
      if (p.status === 'archived') return false
      
      const fullName = `${p.firstName} ${p.lastName}`.toLowerCase()
      const email = (p.email || '').toLowerCase()
      
      return fullName.includes(lowerQuery) || email.includes(lowerQuery)
    })
    .slice(0, 10)
    .map(p => ({
      id: p.id,
      firstName: p.firstName,
      lastName: p.lastName,
      name: `${p.firstName} ${p.lastName}`,
      email: p.email,
      photo: p.photo,
      hasMembership: getMembershipsByPatronId(p.id).length > 0
    }))
}
