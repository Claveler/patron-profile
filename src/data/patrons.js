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

// Patron categories (tags)
export const patronCategories = [
  { id: 'prospect', label: 'Prospect', color: 'neutral' },
  { id: 'donor', label: 'Donor', color: 'neutral' },
  { id: 'member', label: 'Member', color: 'neutral' },
  { id: 'engaged-patron', label: 'Engaged Patron', color: 'success' },
  { id: 'large-donor', label: 'Large Donor', color: 'warning' },
]

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
    category: 'donor',
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
    }
  },

  // Paul Fairfax - FULL DATA (General Constituent demo patron)
  {
    id: 'paul-fairfax',
    firstName: 'Paul',
    lastName: 'Fairfax',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    email: 'paul.fairfax@outlook.com',
    phone: '(555) 111-2222',
    category: 'donor',
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
    }
  },

  // Other Managed Prospects (simplified data for list view)
  {
    id: 'jake-thompson',
    firstName: 'Jake',
    lastName: 'Thompson',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    email: 'jake_thompson@gmail.com',
    phone: '(555) 234-5678',
    category: 'prospect',
    assignedTo: 'Liam Johnson',
    engagement: { level: 'cold', visits: 3, lastVisit: '01/10/2025' },
    giving: { lifetimeValue: 150, donations: 0, revenue: 150, lastDonation: null }
  },
  {
    id: 'sophia-thomas',
    firstName: 'Sophia',
    lastName: 'Thomas',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    email: 'sophia1234@gmail.com',
    phone: '(555) 345-6789',
    category: 'donor',
    assignedTo: 'Emma Smith',
    engagement: { level: 'cold', visits: 8, lastVisit: '12/10/2025' },
    giving: { lifetimeValue: 1250, donations: 750, revenue: 500, lastDonation: '2025-10-12' }
  },
  {
    id: 'lucas-taylor',
    firstName: 'Lucas',
    lastName: 'Taylor',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    email: 'lucas_taylor@yahoo.com',
    phone: '(555) 456-7890',
    category: 'member',
    assignedTo: 'Liam Johnson',
    engagement: { level: 'warm', visits: 22, lastVisit: '20/10/2025' },
    giving: { lifetimeValue: 2800, donations: 1500, revenue: 1300, lastDonation: '2025-10-20' },
    membership: { status: 'active', tier: 'Silver', daysToRenewal: 45 }
  },
  {
    id: 'ava-anderson',
    firstName: 'Ava',
    lastName: 'Anderson',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    email: 'anderava@gmail.com',
    phone: '(555) 567-8901',
    category: 'engaged-patron',
    assignedTo: 'Liam Johnson',
    engagement: { level: 'hot', visits: 45, lastVisit: '01/11/2025' },
    giving: { lifetimeValue: 8500, donations: 7000, revenue: 1500, lastDonation: '2025-11-01' }
  },
  {
    id: 'samantha-carter',
    firstName: 'Samantha',
    lastName: 'Carter',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    email: 'samantha_itsme@gmail.com',
    phone: '(555) 678-9012',
    category: 'large-donor',
    assignedTo: 'Emma Smith',
    engagement: { level: 'on-fire', visits: 67, lastVisit: '15/10/2025' },
    giving: { lifetimeValue: 125000, donations: 120000, revenue: 5000, lastDonation: '2025-10-15' }
  },
  {
    id: 'john-martinez',
    firstName: 'John',
    lastName: 'Martinez',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    email: 'johnsonmchl@microsoft.com',
    phone: '(555) 789-0123',
    category: 'member',
    assignedTo: 'Emma Smith',
    engagement: { level: 'warm', visits: 18, lastVisit: '10/11/2025' },
    giving: { lifetimeValue: 3200, donations: 2000, revenue: 1200, lastDonation: '2025-11-10' },
    membership: { status: 'active', tier: 'Gold', daysToRenewal: 120 }
  },
  {
    id: 'mia-wilson',
    firstName: 'Mia',
    lastName: 'Wilson',
    photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face',
    email: 'mia_wilson1960@gmail.com',
    phone: '(555) 890-1234',
    category: 'donor',
    assignedTo: 'Sophia Anderson',
    engagement: { level: 'on-fire', visits: 52, lastVisit: '30/10/2025' },
    giving: { lifetimeValue: 85000, donations: 80000, revenue: 5000, lastDonation: '2025-10-30' }
  },
  {
    id: 'olivia-brown',
    firstName: 'Olivia',
    lastName: 'Brown',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
    email: 'olibrown@gmail.com',
    phone: '(555) 901-2345',
    category: 'donor',
    assignedTo: 'Lucas Thomas',
    engagement: { level: 'cool', visits: 12, lastVisit: '05/11/2025' },
    giving: { lifetimeValue: 1800, donations: 1200, revenue: 600, lastDonation: '2025-11-05' }
  },
  {
    id: 'ethan-davis',
    firstName: 'Ethan',
    lastName: 'Davis',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
    email: 'ethan_davies_1234@gmail.com',
    phone: '(555) 012-3456',
    category: 'member',
    assignedTo: 'Emma Smith',
    engagement: { level: 'cool', visits: 15, lastVisit: '25/10/2025' },
    giving: { lifetimeValue: 950, donations: 250, revenue: 700, lastDonation: '2025-10-25' },
    membership: { status: 'active', tier: 'Silver', daysToRenewal: 90 }
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
    category: 'member',
    // General Constituent
    engagement: { level: 'cool', visits: 6, lastVisit: '20/12/2025' },
    giving: { lifetimeValue: 450, donations: 100, revenue: 350, lastDonation: '2025-12-15' },
    membership: { status: 'active', tier: 'Basic', daysToRenewal: 250 }
  },
  {
    id: 'david-chen',
    firstName: 'David',
    lastName: 'Chen',
    photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face',
    email: 'd.chen@company.com',
    phone: '(555) 333-4444',
    category: 'donor',
    // General Constituent
    engagement: { level: 'cold', visits: 2, lastVisit: '05/09/2025' },
    giving: { lifetimeValue: 275, donations: 200, revenue: 75, lastDonation: '2025-08-20' }
  },
  {
    id: 'maria-santos',
    firstName: 'Maria',
    lastName: 'Santos',
    photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    email: 'maria.santos@email.com',
    phone: '(555) 444-5555',
    category: 'member',
    // General Constituent
    engagement: { level: 'warm', visits: 18, lastVisit: '28/01/2026' },
    giving: { lifetimeValue: 620, donations: 150, revenue: 470, lastDonation: '2026-01-20' },
    membership: { status: 'active', tier: 'Silver', daysToRenewal: 60 }
  },
  {
    id: 'james-wilson',
    firstName: 'James',
    lastName: 'Wilson',
    photo: null,
    email: 'jwilson@business.net',
    phone: '(555) 555-6666',
    category: 'prospect',
    // General Constituent - identified as prospect but not yet assigned
    engagement: { level: 'cold', visits: 1, lastVisit: '10/01/2026' },
    giving: { lifetimeValue: 50, donations: 0, revenue: 50, lastDonation: null }
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
