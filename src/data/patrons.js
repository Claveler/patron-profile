/**
 * Patron Data Store
 * 
 * Terminology:
 * - MANAGED PROSPECT: A patron with an assigned relationship manager (owner) 
 *   who is in someone's portfolio. They may have 0, 1, or many opportunities.
 *   Has: assignedToId field (references STAFF by id)
 * 
 * - GENERAL CONSTITUENT: A patron in the database who is not being actively 
 *   managed through individual relationship management. Handled via automated
 *   campaigns and appeals.
 *   Has: No assignedToId field
 * 
 * NOTE: Pipeline stages are tracked on OPPORTUNITIES, not patrons.
 * See opportunities.js for pipeline data.
 */

// Gift Officers / Relationship Managers
// DEPRECATED: Use STAFF from campaigns.js as the single source of truth.
// This alias is kept for backwards compatibility during migration.
export { STAFF as giftOfficers } from './campaigns'

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
  // MANAGED PROSPECTS (have assignedToId + prospect)
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
    // MANAGED PROSPECT - has assignedToId (opportunities tracked separately)
    assignedToId: 'lj',
    engagement: {
      level: 'on-fire',
      visits: 54,
      lastVisit: '2025-11-19',
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
    giving: {
      lifetimeValue: 3222.50,
      donations: 1975.00,
      revenue: 1247.50,
      giftCount: 6,
      averageGift: 329.17,
      lastDonation: '2025-12-15',
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
      firstTransaction: { amount: 250.00, date: '2024-11-18' },
      lastTransaction: { amount: 1000.00, date: '2025-12-15' },
      largestTransaction: { amount: 1000.00, date: '2025-12-15' }
    },
    wealthInsights: {
      propensityScore: 'DSI-3',
      description: 'Real Estate holdings of 1.2 million, business executive at a firm with revenues of $1-5 million.'
    },
    taxDocuments: {
      organization: { name: 'Paradox Museum', ein: '12-3456789', address: '123 Museum Way, Austin, TX 78701' },
      yearEndSummaries: [
        { year: 2025, generated: '2026-01-15', sent: true, sentDate: '2026-01-15', method: 'email' },
        { year: 2024, generated: '2025-01-12', sent: true, sentDate: '2025-01-12', method: 'email' }
      ],
      receipts: [
        { id: 1, date: '2025-12-15', type: 'donation', description: 'Year-End Major Gift', amount: 1000.00, deductible: 1000.00, benefitsValue: 0, campaign: '2026 Annual Fund', appeal: 'Year-End Direct Mail' },
        { id: 2, date: '2025-06-15', type: 'donation', description: 'Spring Gala Donation', amount: 500.00, deductible: 400.00, benefitsValue: 100.00, campaign: '2026 Annual Fund', appeal: 'Spring Gala 2025' },
        { id: 3, date: '2025-12-02', type: 'membership', description: 'Gold Membership Renewal', amount: 145.99, deductible: 95.99, benefitsValue: 50.00, campaign: '2026 Annual Fund', appeal: 'Membership Renewal' },
        { id: 4, date: '2025-03-22', type: 'donation', description: 'Building Campaign Gift', amount: 750.00, deductible: 750.00, benefitsValue: 0, campaign: 'Building the Future', appeal: 'Capital Campaign Appeal' },
        { id: 5, date: '2024-11-18', type: 'donation', description: 'Online Donation', amount: 250.00, deductible: 250.00, benefitsValue: 0, campaign: '2025 Annual Fund', appeal: 'Website Donate Button' }
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
    // NO assignedToId - General Constituent
    // NO prospect data - not in pipeline
    engagement: {
      level: 'cool',
      visits: 6,
      lastVisit: '2025-11-15',
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
          date: '2025-02-27', 
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
          date: '2024-02-27', 
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
        { id: 1, year: 2025, generated: '2026-01-15', sent: false },
        { id: 2, year: 2024, generated: '2025-01-10', sent: true, sentDate: '2025-01-12' }
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
    assignedToId: 'lj',
    engagement: {
      level: 'cold',
      visits: 3,
      lastVisit: '2025-10-01',
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
    assignedToId: 'es',
    engagement: {
      level: 'cold',
      visits: 8,
      lastVisit: '2025-10-12',
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
    assignedToId: 'lj',
    engagement: {
      level: 'warm',
      visits: 22,
      lastVisit: '2025-10-20',
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
    assignedToId: 'lj',
    engagement: {
      level: 'hot',
      visits: 45,
      lastVisit: '2025-11-01',
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
    assignedToId: 'es',
    engagement: {
      level: 'on-fire',
      visits: 67,
      lastVisit: '2025-10-15',
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
    assignedToId: 'es',
    engagement: {
      level: 'warm',
      visits: 18,
      lastVisit: '2025-11-10',
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
    assignedToId: 'sa',
    engagement: {
      level: 'on-fire',
      visits: 52,
      lastVisit: '2025-10-30',
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
    assignedToId: 'lt',
    engagement: {
      level: 'cool',
      visits: 12,
      lastVisit: '2025-11-05',
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
    assignedToId: 'es',
    engagement: {
      level: 'cool',
      visits: 15,
      lastVisit: '2025-10-25',
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
    source: 'import',
    createdDate: '2024-12-01'
  },

  // ============================================
  // GENERAL CONSTITUENTS (no assignedToId)
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
      lastVisit: '2025-12-20',
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
      lastVisit: '2025-09-05',
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
      lastVisit: '2026-01-28',
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
      lastVisit: '2026-01-10',
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
    // No assignedToId - not individually managed, but part of household
    engagement: {
      level: 'warm',
      visits: 28,
      lastVisit: '2026-01-15',
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
    // No assignedToId - dependent/minor
    engagement: {
      level: 'cool',
      visits: 7,
      lastVisit: '2025-12-20',
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
  },

  // =====================================================================
  // Patrons referenced by opportunities (and pledge demo data)
  // =====================================================================

  // Eleanor Whitfield - major donor, $100k leadership gift opp (assigned to JM)
  {
    id: 'eleanor-whitfield',
    firstName: 'Eleanor',
    lastName: 'Whitfield',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    email: 'eleanor.whitfield@gmail.com',
    phone: '(512) 555-3001',
    tags: ['major-donor', 'donor'],
    assignedToId: 'jm',
    engagement: {
      level: 'hot',
      visits: 34,
      lastVisit: '2026-01-22',
      activityHistory: [
        { month: '2025-02', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'donation', count: 1, value: 5000 }] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-03', weeks: [{ activities: [{ type: 'attendance', count: 2 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-04', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'purchase', count: 1, value: 120 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-05', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'donation', count: 1, value: 10000 }] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-06', weeks: [{ activities: [{ type: 'attendance', count: 2 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'purchase', count: 1, value: 85 }] }] },
        { month: '2025-07', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-08', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'donation', count: 1, value: 5000 }] }, { activities: [] }] },
        { month: '2025-09', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-10', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'purchase', count: 1, value: 200 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-11', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'donation', count: 1, value: 10000 }] }] },
        { month: '2025-12', weeks: [{ activities: [{ type: 'attendance', count: 2 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 42500, donations: 35000, revenue: 7500, giftCount: 8, averageGift: 4375, lastDonation: '2025-11-20' },
    address: '2401 Lake Austin Blvd, Austin, TX 78703',
    source: 'import',
    createdDate: '2022-06-15'
  },

  // Marcus Chen - corporate contact, exhibition sponsorship opp (assigned to RB)
  {
    id: 'marcus-chen',
    firstName: 'Marcus',
    lastName: 'Chen',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    email: 'marcus.chen@chenenterprises.com',
    phone: '(512) 555-3002',
    tags: ['corporate', 'donor'],
    assignedToId: 'rb',
    engagement: {
      level: 'warm',
      visits: 12,
      lastVisit: '2026-01-10',
      activityHistory: [
        { month: '2025-02', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-03', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-04', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-05', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-06', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-07', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-08', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'purchase', count: 1, value: 250 }] }] },
        { month: '2025-09', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-10', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-11', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-12', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 18000, donations: 15000, revenue: 3000, giftCount: 3, averageGift: 5000, lastDonation: '2025-09-22' },
    address: '500 W 5th St, Suite 800, Austin, TX 78701',
    source: 'manual',
    createdDate: '2023-03-10'
  },

  // Patricia Hawthorne - foundation, grant opp (assigned to RB)
  {
    id: 'patricia-hawthorne',
    firstName: 'Patricia',
    lastName: 'Hawthorne',
    photo: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&h=150&fit=crop&crop=face',
    email: 'p.hawthorne@hawthornefoundation.org',
    phone: '(512) 555-3003',
    tags: ['foundation', 'donor'],
    assignedToId: 'rb',
    engagement: {
      level: 'cool',
      visits: 5,
      lastVisit: '2025-12-05',
      activityHistory: [
        { month: '2025-02', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-03', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-04', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-05', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-06', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-07', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-08', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-09', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-10', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-11', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-12', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 12000, donations: 12000, revenue: 0, giftCount: 2, averageGift: 6000, lastDonation: '2025-06-15' },
    address: '1200 Barton Springs Rd, Austin, TX 78704',
    source: 'manual',
    createdDate: '2024-08-20'
  },

  // James Morrison - major donor, building campaign (won $75k), assigned to JM
  {
    id: 'james-morrison',
    firstName: 'James',
    lastName: 'Morrison',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    email: 'james.morrison@gmail.com',
    phone: '(512) 555-3004',
    tags: ['major-donor', 'donor', 'board-member'],
    assignedToId: 'jm',
    engagement: {
      level: 'hot',
      visits: 28,
      lastVisit: '2026-01-30',
      activityHistory: [
        { month: '2025-02', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-03', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'donation', count: 1, value: 10000 }] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-04', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-05', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-06', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'donation', count: 1, value: 15000 }] }] },
        { month: '2025-07', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-08', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-09', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-10', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 150 }] }] },
        { month: '2025-11', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-12', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'donation', count: 1, value: 75000 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] }
      ]
    },
    giving: { lifetimeValue: 125000, donations: 115000, revenue: 10000, giftCount: 12, averageGift: 9583, lastDonation: '2026-01-15' },
    address: '3200 Westlake Dr, Austin, TX 78746',
    source: 'import',
    createdDate: '2021-04-01'
  },

  // Sarah Blackwood - new prospect, first major gift opp (assigned to AL)
  {
    id: 'sarah-blackwood',
    firstName: 'Sarah',
    lastName: 'Blackwood',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    email: 'sarah.blackwood@outlook.com',
    phone: '(512) 555-3005',
    tags: ['prospect'],
    assignedToId: 'al',
    engagement: {
      level: 'cool',
      visits: 3,
      lastVisit: '2026-01-05',
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
        { month: '2025-11', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-12', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 350, donations: 0, revenue: 350, giftCount: 0, lastDonation: null },
    address: '901 S Congress Ave, Apt 4B, Austin, TX 78704',
    source: 'ticket',
    createdDate: '2025-11-01'
  },

  // William Hartford - planned giving / bequest opp (assigned to JM)
  {
    id: 'william-hartford',
    firstName: 'William',
    lastName: 'Hartford',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    email: 'w.hartford@hartfordlaw.com',
    phone: '(512) 555-3006',
    tags: ['major-donor', 'donor'],
    assignedToId: 'jm',
    engagement: {
      level: 'warm',
      visits: 18,
      lastVisit: '2026-01-18',
      activityHistory: [
        { month: '2025-02', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-03', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'donation', count: 1, value: 5000 }] }] },
        { month: '2025-04', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-05', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-06', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'donation', count: 1, value: 5000 }] }] },
        { month: '2025-07', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-08', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-09', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'donation', count: 1, value: 10000 }] }, { activities: [] }] },
        { month: '2025-10', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-11', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-12', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'donation', count: 1, value: 5000 }] }] },
        { month: '2026-01', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 52000, donations: 45000, revenue: 7000, giftCount: 9, averageGift: 5000, lastDonation: '2025-12-20' },
    address: '4500 Bee Cave Rd, Austin, TX 78746',
    source: 'import',
    createdDate: '2020-11-01'
  },

  // Diana Rothschild - education program supporter (assigned to AL)
  {
    id: 'diana-rothschild',
    firstName: 'Diana',
    lastName: 'Rothschild',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    email: 'diana.rothschild@yahoo.com',
    phone: '(512) 555-3007',
    tags: ['donor', 'volunteer'],
    assignedToId: 'al',
    engagement: {
      level: 'warm',
      visits: 15,
      lastVisit: '2026-01-28',
      activityHistory: [
        { month: '2025-02', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-03', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-04', weeks: [{ activities: [] }, { activities: [{ type: 'donation', count: 1, value: 2000 }] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-05', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-06', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-07', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-08', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-09', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'donation', count: 1, value: 3000 }] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-10', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-11', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-12', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 9500, donations: 8000, revenue: 1500, giftCount: 4, averageGift: 2000, lastDonation: '2025-09-18' },
    address: '780 Red River St, Austin, TX 78701',
    source: 'online',
    createdDate: '2024-02-10'
  },

  // Theodore Banks - annual renewal donor (won $10k), assigned to RB
  {
    id: 'theodore-banks',
    firstName: 'Theodore',
    lastName: 'Banks',
    photo: 'https://images.unsplash.com/photo-1548372290-8d01b6c8e78c?w=150&h=150&fit=crop&crop=face',
    email: 'ted.banks@bankscapital.com',
    phone: '(512) 555-3008',
    tags: ['major-donor', 'donor'],
    assignedToId: 'rb',
    engagement: {
      level: 'warm',
      visits: 20,
      lastVisit: '2025-11-28',
      activityHistory: [
        { month: '2025-02', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-03', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-04', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'donation', count: 1, value: 2500 }] }, { activities: [] }] },
        { month: '2025-05', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-06', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-07', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-08', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-09', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'purchase', count: 1, value: 75 }] }] },
        { month: '2025-10', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-11', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'donation', count: 1, value: 10000 }] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-12', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 65000, donations: 60000, revenue: 5000, giftCount: 10, averageGift: 6000, lastDonation: '2025-11-15' },
    address: '1500 S Lamar Blvd, Austin, TX 78704',
    source: 'import',
    createdDate: '2019-09-01'
  },

  // Victoria Sterling - transformational gift prospect ($500k), assigned to JM
  {
    id: 'victoria-sterling',
    firstName: 'Victoria',
    lastName: 'Sterling',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
    email: 'victoria@sterlingfamilyoffice.com',
    phone: '(512) 555-3009',
    tags: ['major-donor', 'donor', 'prospect'],
    assignedToId: 'jm',
    engagement: {
      level: 'warm',
      visits: 10,
      lastVisit: '2026-01-25',
      activityHistory: [
        { month: '2025-02', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-03', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-04', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-05', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-06', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-07', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'donation', count: 1, value: 25000 }] }, { activities: [] }] },
        { month: '2025-08', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-09', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-10', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-11', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'donation', count: 1, value: 25000 }] }, { activities: [] }] },
        { month: '2025-12', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 78000, donations: 75000, revenue: 3000, giftCount: 5, averageGift: 15000, lastDonation: '2025-11-10' },
    address: '6000 Shepherd Mountain Cv, Austin, TX 78730',
    source: 'manual',
    createdDate: '2023-01-20'
  },

  // Margaret Chen - annual fund prospect ($5k), assigned to LJ
  {
    id: 'margaret-chen',
    firstName: 'Margaret',
    lastName: 'Chen',
    photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    email: 'margaret.chen@utexas.edu',
    phone: '(512) 555-3010',
    tags: ['donor', 'prospect'],
    assignedToId: 'lj',
    engagement: {
      level: 'cool',
      visits: 8,
      lastVisit: '2025-10-15',
      activityHistory: [
        { month: '2025-02', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-03', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-04', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-05', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-06', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-07', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-08', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-09', weeks: [{ activities: [] }, { activities: [{ type: 'donation', count: 1, value: 1000 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-10', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-11', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-12', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 2800, donations: 2000, revenue: 800, giftCount: 2, averageGift: 1000, lastDonation: '2025-09-10' },
    address: '2200 Guadalupe St, Austin, TX 78705',
    source: 'ticket',
    createdDate: '2024-06-01'
  },

  // Elizabeth Fairfax - pledges and gifts demo patron (paul-fairfax's wife)
  {
    id: 'elizabeth-fairfax',
    firstName: 'Elizabeth',
    lastName: 'Fairfax',
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face',
    email: 'elizabeth.fairfax@outlook.com',
    phone: '(555) 111-2223',
    tags: ['donor'],
    assignedToId: 'lj',
    engagement: {
      level: 'warm',
      visits: 14,
      lastVisit: '2025-12-10',
      activityHistory: [
        { month: '2025-02', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-03', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-04', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'donation', count: 1, value: 500 }] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-05', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-06', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-07', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-08', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-09', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-10', weeks: [{ activities: [] }, { activities: [{ type: 'purchase', count: 1, value: 45 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-11', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-12', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'donation', count: 1, value: 200 }] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 3200, donations: 2700, revenue: 500, giftCount: 3, averageGift: 900, lastDonation: '2025-12-20' },
    address: '742 Maple Avenue, Boston, MA 02108',
    source: 'ticket',
    createdDate: '2024-03-15'
  }
]

// Helper function to get patron by ID
export const getPatronById = (id) => patrons.find(p => p.id === id)

// Helper function to determine if patron is a Managed Prospect
// A managed prospect has an assignedToId (relationship manager)
export const isManagedProspect = (patron) => Boolean(patron?.assignedToId)

// Helper function to get display name
export const getPatronDisplayName = (patron) => `${patron.firstName} ${patron.lastName}`

// Helper to format date for display (expects ISO YYYY-MM-DD input)
export const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Helper to format date with time (for activity timelines)
export const formatDateTime = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' - ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
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
    assignedToId: patronData.assignedToId || null,
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
export const assignPatronToOfficer = (patronId, assignedToId) => {
  return updatePatron(patronId, { assignedToId })
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

// Tier configuration (styling + limits)
// In production, this data lives at the membership programme/tier config level in Fever Zone.
// Card styling is set per-tier (not per-member) via the tier creation UI's "Look & Feel" section.
export const tierConfig = {
  'Basic': {
    beneficiaryLimit: 1,
    cardStyle: { backgroundColor: '#8B7355', textColor: '#ffffff', accentColor: '#A89070' }
  },
  'Silver': {
    beneficiaryLimit: 2,
    cardStyle: { backgroundColor: '#5C6B7A', textColor: '#ffffff', accentColor: '#B8C5D1' }
  },
  'Gold': {
    beneficiaryLimit: 4,
    cardStyle: { backgroundColor: '#B8860B', textColor: '#ffffff', accentColor: '#D4AF37' }
  },
  'Platinum': {
    beneficiaryLimit: Infinity,
    cardStyle: { backgroundColor: '#2C2C2C', textColor: '#ffffff', accentColor: '#E5E4E2' }
  }
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
    periodStart: '2025-12-02',     // For progress bar display
    validUntil: '2026-12-02',      // For progress bar display
    daysToRenewal: 300,            // For churn risk calculation
    
    // Auto-renewal
    autoRenew: true,
    autoRenewal: true,  // Alias for MembershipOverview compatibility
    paymentMethod: { type: 'visa', last4: '4242' },
    memberYears: 2,
    
    // Card styling resolved from tierConfig at query time (not stored per-member)
    
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
      { category: 'discount', title: 'Bring a friend for free', description: 'every visit', usage: { used: 3, limit: 5, resetDate: '2026-02-12' }, icon: 'fa-user-plus' },
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
  },

  // paul-fairfax Silver membership
  {
    id: 'mem-fairfax-silver',
    programme: 'General Membership',
    tier: 'Silver',
    status: 'active',

    // Date tracking
    startDate: '2024-02-27',
    renewalDate: '2026-02-27',
    expirationDate: '2026-02-27',

    // MembershipOverview required properties
    membershipId: 'MEM-2024-047',
    periodStart: '2025-02-27',
    validUntil: '2026-02-27',
    daysToRenewal: 21,

    // Auto-renewal
    autoRenew: false,
    autoRenewal: false,
    paymentMethod: { type: 'mastercard', last4: '8832' },
    memberYears: 1,

    // Upgrade options
    upgradeEligible: true,
    upgradeTier: 'Gold',
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
    },

    // Benefits with usage tracking
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
        usage: { used: 0, limit: 2, resetDate: '2026-02-27' },
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

    // Member events
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

    // Usage analytics
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

    // Membership history
    membershipHistory: [
      { date: '2024-02-27', event: 'Joined', tier: 'Silver', programme: 'General Membership' },
      { date: '2025-02-27', event: 'Renewed', tier: 'Silver', programme: 'General Membership' }
    ],

    // Legacy alias for history
    history: [
      { date: '2024-02-27', event: 'Joined', tier: 'Silver', programme: 'General Membership' },
      { date: '2025-02-27', event: 'Renewed', tier: 'Silver', programme: 'General Membership' }
    ]
  },

  // lucas-taylor Silver membership
  {
    id: 'mem-taylor-silver',
    programme: 'General Membership',
    tier: 'Silver',
    status: 'active',

    // Date tracking
    startDate: '2024-11-10',
    renewalDate: '2026-03-10',
    expirationDate: '2026-03-10',

    // MembershipOverview required properties
    membershipId: 'MEM-2024-312',
    periodStart: '2025-03-10',
    validUntil: '2026-03-10',
    daysToRenewal: 45,

    // Auto-renewal
    autoRenew: false,
    autoRenewal: false,
    paymentMethod: { type: 'visa', last4: '7721' },
    memberYears: 1,

    // Upgrade options
    upgradeEligible: true,
    upgradeTier: 'Gold',

    // Benefits with usage tracking
    benefits: [
      { category: 'access', title: 'Unlimited visits', description: 'to all standard exhibits', usage: { used: 8, limit: null, resetDate: null }, icon: 'fa-ticket' },
      { category: 'discount', title: 'Bring a friend for free', description: 'twice per year', usage: { used: 1, limit: 2, resetDate: '2026-03-10' }, icon: 'fa-user-plus' },
      { category: 'discount', title: '10% off special events', description: 'your ticket only', usage: null, icon: 'fa-percent' },
      { category: 'discount', title: '5% F&B discount', description: 'at main café', usage: { used: 2, limit: null, resetDate: null }, icon: 'fa-utensils' }
    ],

    // Usage analytics
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

    // Membership history
    membershipHistory: [
      { date: '2024-11-10', event: 'Joined', tier: 'Silver', programme: 'General Membership' },
      { date: '2025-03-10', event: 'Renewed', tier: 'Silver', programme: 'General Membership' }
    ],

    // Legacy alias for history
    history: [
      { date: '2024-11-10', event: 'Joined', tier: 'Silver', programme: 'General Membership' },
      { date: '2025-03-10', event: 'Renewed', tier: 'Silver', programme: 'General Membership' }
    ]
  },

  // john-martinez Gold membership
  {
    id: 'mem-martinez-gold',
    programme: 'General Membership',
    tier: 'Gold',
    status: 'active',

    // Date tracking
    startDate: '2023-03-15',
    renewalDate: '2026-06-15',
    expirationDate: '2026-06-15',

    // MembershipOverview required properties
    membershipId: 'MEM-2023-089',
    periodStart: '2025-06-15',
    validUntil: '2026-06-15',
    daysToRenewal: 120,

    // Auto-renewal
    autoRenew: true,
    autoRenewal: true,
    paymentMethod: { type: 'amex', last4: '1008' },
    memberYears: 2,

    // Upgrade options
    upgradeEligible: true,
    upgradeTier: 'Platinum',

    // Benefits with usage tracking
    benefits: [
      { category: 'access', title: 'Unlimited visits', description: 'to all exhibits', usage: { used: 67, limit: null, resetDate: null }, icon: 'fa-ticket' },
      { category: 'access', title: 'Priority entry', description: 'skip the line', usage: null, icon: 'fa-forward' },
      { category: 'discount', title: 'Bring a friend for free', description: 'every visit', usage: { used: 4, limit: 5, resetDate: '2026-06-15' }, icon: 'fa-user-plus' },
      { category: 'discount', title: '20% off special events', description: "your ticket and friend's ticket", usage: null, icon: 'fa-percent' },
      { category: 'discount', title: '10% F&B discount', description: 'at all venue restaurants', usage: { used: 25, limit: null, resetDate: null }, icon: 'fa-utensils' },
      { category: 'complimentary', title: 'Welcome pack', description: 'Paradox tote + exclusive goodies', usage: { used: 1, limit: 1, resetDate: null }, icon: 'fa-gift' }
    ],

    // Usage analytics
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

    // Membership history
    membershipHistory: [
      { date: '2023-03-15', event: 'Joined', tier: 'Silver', programme: 'General Membership' },
      { date: '2023-09-01', event: 'Upgraded', tier: 'Gold', programme: 'General Membership' },
      { date: '2024-06-15', event: 'Renewed', tier: 'Gold', programme: 'General Membership' },
      { date: '2025-06-15', event: 'Renewed', tier: 'Gold', programme: 'General Membership' }
    ],

    // Legacy alias for history
    history: [
      { date: '2023-03-15', event: 'Joined', tier: 'Silver', programme: 'General Membership' },
      { date: '2023-09-01', event: 'Upgraded', tier: 'Gold', programme: 'General Membership' },
      { date: '2024-06-15', event: 'Renewed', tier: 'Gold', programme: 'General Membership' },
      { date: '2025-06-15', event: 'Renewed', tier: 'Gold', programme: 'General Membership' }
    ]
  },

  // ethan-davis Silver membership
  {
    id: 'mem-davis-silver',
    programme: 'General Membership',
    tier: 'Silver',
    status: 'active',

    // Date tracking
    startDate: '2024-05-01',
    renewalDate: '2026-05-01',
    expirationDate: '2026-05-01',

    // MembershipOverview required properties
    membershipId: 'MEM-2024-156',
    periodStart: '2025-05-01',
    validUntil: '2026-05-01',
    daysToRenewal: 90,

    // Auto-renewal
    autoRenew: true,
    autoRenewal: true,
    paymentMethod: { type: 'mastercard', last4: '3344' },
    memberYears: 1,

    // Upgrade options
    upgradeEligible: true,
    upgradeTier: 'Gold',

    // Benefits with usage tracking
    benefits: [
      { category: 'access', title: 'Unlimited visits', description: 'to all standard exhibits', usage: { used: 12, limit: null, resetDate: null }, icon: 'fa-ticket' },
      { category: 'discount', title: 'Bring a friend for free', description: 'twice per year', usage: { used: 1, limit: 2, resetDate: '2026-05-01' }, icon: 'fa-user-plus' },
      { category: 'discount', title: '10% off special events', description: 'your ticket only', usage: null, icon: 'fa-percent' },
      { category: 'discount', title: '5% F&B discount', description: 'at main café', usage: { used: 4, limit: null, resetDate: null }, icon: 'fa-utensils' }
    ],

    // Usage analytics
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

    // Membership history
    membershipHistory: [
      { date: '2024-05-01', event: 'Joined', tier: 'Silver', programme: 'General Membership' },
      { date: '2025-05-01', event: 'Renewed', tier: 'Silver', programme: 'General Membership' }
    ],

    // Legacy alias for history
    history: [
      { date: '2024-05-01', event: 'Joined', tier: 'Silver', programme: 'General Membership' },
      { date: '2025-05-01', event: 'Renewed', tier: 'Silver', programme: 'General Membership' }
    ]
  },

  // rachel-kim Basic membership
  {
    id: 'mem-kim-basic',
    programme: 'General Membership',
    tier: 'Basic',
    status: 'active',

    // Date tracking
    startDate: '2025-11-25',
    renewalDate: '2026-11-25',
    expirationDate: '2026-11-25',

    // MembershipOverview required properties
    membershipId: 'MEM-2025-589',
    periodStart: '2025-11-25',
    validUntil: '2026-11-25',
    daysToRenewal: 250,

    // Auto-renewal
    autoRenew: false,
    autoRenewal: false,
    paymentMethod: { type: 'mastercard', last4: '6622' },
    memberYears: 0,

    // Upgrade options
    upgradeEligible: true,
    upgradeTier: 'Silver',

    // Benefits with usage tracking
    benefits: [
      { category: 'access', title: 'Unlimited visits', description: 'to all standard exhibits', usage: { used: 6, limit: null, resetDate: null }, icon: 'fa-ticket' }
    ],

    // Usage analytics
    usageAnalytics: {
      overallPercentage: 40,
      categories: [
        { name: 'Admissions', used: 6, available: 'unlimited', percentage: 40 }
      ],
      unusedBenefits: [],
      mostUsed: 'Admissions'
    },

    // Membership history
    membershipHistory: [
      { date: '2025-11-25', event: 'Joined', tier: 'Basic', programme: 'General Membership' }
    ],

    // Legacy alias for history
    history: [
      { date: '2025-11-25', event: 'Joined', tier: 'Basic', programme: 'General Membership' }
    ]
  },
  // maria-santos Silver membership
  {
    id: 'mem-santos-silver',
    programme: 'General Membership',
    tier: 'Silver',
    status: 'active',

    // Date tracking
    startDate: '2025-10-15',
    renewalDate: '2026-10-15',
    expirationDate: '2026-10-15',

    // MembershipOverview required properties
    membershipId: 'MEM-2025-421',
    periodStart: '2025-10-15',
    validUntil: '2026-10-15',
    daysToRenewal: 60,

    // Auto-renewal
    autoRenew: true,
    autoRenewal: true,
    paymentMethod: { type: 'visa', last4: '9156' },
    memberYears: 1,

    // Usage analytics
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

    // Upgrade options
    upgradeEligible: true,
    upgradeTier: 'Gold',

    // Benefits with usage tracking
    benefits: [
      { category: 'access', title: 'Unlimited visits', description: 'to all standard exhibits', usage: { used: 18, limit: null, resetDate: null }, icon: 'fa-ticket' },
      { category: 'discount', title: 'Bring a friend for free', description: 'twice per year', usage: { used: 2, limit: 2, resetDate: '2026-10-15' }, icon: 'fa-user-plus' },
      { category: 'discount', title: '10% off special events', description: 'your ticket only', usage: null, icon: 'fa-percent' },
      { category: 'discount', title: '5% F&B discount', description: 'at main café', usage: { used: 6, limit: null, resetDate: null }, icon: 'fa-utensils' }
    ],

    // Membership history
    membershipHistory: [
      { date: '2025-10-15', event: 'Joined', tier: 'Silver', programme: 'General Membership' }
    ],

    // Legacy alias for history
    history: [
      { date: '2025-10-15', event: 'Joined', tier: 'Silver', programme: 'General Membership' }
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
  },
  {
    id: 'mb-4',
    membershipId: 'mem-fairfax-silver',
    patronId: 'paul-fairfax',
    role: 'primary',
    roleLabel: 'Primary Member',
    canManage: true,
    addedDate: '2024-02-27',
    status: 'active'
  },
  {
    id: 'mb-5',
    membershipId: 'mem-taylor-silver',
    patronId: 'lucas-taylor',
    role: 'primary',
    roleLabel: 'Primary Member',
    canManage: true,
    addedDate: '2024-11-10',
    status: 'active'
  },
  {
    id: 'mb-6',
    membershipId: 'mem-taylor-silver',
    patronId: 'sophia-thomas',
    role: 'additional_adult',
    roleLabel: 'Additional Adult',
    canManage: false,
    addedDate: '2024-11-10',
    status: 'active'
  },
  {
    id: 'mb-7',
    membershipId: 'mem-martinez-gold',
    patronId: 'john-martinez',
    role: 'primary',
    roleLabel: 'Primary Member',
    canManage: true,
    addedDate: '2023-03-15',
    status: 'active'
  },
  {
    id: 'mb-8',
    membershipId: 'mem-martinez-gold',
    patronId: 'samantha-carter',
    role: 'additional_adult',
    roleLabel: 'Additional Adult',
    canManage: false,
    addedDate: '2023-06-01',
    status: 'active'
  },
  {
    id: 'mb-9',
    membershipId: 'mem-davis-silver',
    patronId: 'ethan-davis',
    role: 'primary',
    roleLabel: 'Primary Member',
    canManage: true,
    addedDate: '2024-05-01',
    status: 'active'
  },
  {
    id: 'mb-10',
    membershipId: 'mem-davis-silver',
    patronId: 'olivia-brown',
    role: 'additional_adult',
    roleLabel: 'Additional Adult',
    canManage: false,
    addedDate: '2024-05-15',
    status: 'active'
  },
  {
    id: 'mb-11',
    membershipId: 'mem-kim-basic',
    patronId: 'rachel-kim',
    role: 'primary',
    roleLabel: 'Primary Member',
    canManage: true,
    addedDate: '2025-11-25',
    status: 'active'
  },
  {
    id: 'mb-12',
    membershipId: 'mem-santos-silver',
    patronId: 'maria-santos',
    role: 'primary',
    roleLabel: 'Primary Member',
    canManage: true,
    addedDate: '2025-10-15',
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

// =============================================================================
// GIFTS (top-level entity with patronId foreign keys)
// =============================================================================

export const GIFTS = [
  // Existing one-time donations (pledgeId/recurringProfileId = null)
  { id: 'gift-001', patronId: 'anderson-collingwood', date: '2025-12-15', amount: 1000.00, type: 'donation', description: 'Year-End Major Gift', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'year-end-mailer', deductible: 1000.00, benefitsValue: 0, softCredits: [{ patronId: '999', name: 'Margaret Williams', type: 'solicitor' }], pledgeId: null, recurringProfileId: null },
  { id: 'gift-002', patronId: 'anderson-collingwood', date: '2025-06-15', amount: 500.00, type: 'donation', description: 'Spring Gala Donation', fundId: 'education', campaignId: 'annual-2026', appealId: 'spring-gala-2025', deductible: 400.00, benefitsValue: 100.00, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-003', patronId: 'anderson-collingwood', date: '2025-12-02', amount: 145.99, type: 'membership', description: 'Gold Membership Renewal', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'membership-renewal', deductible: 95.99, benefitsValue: 50.00, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-005', patronId: 'anderson-collingwood', date: '2024-11-18', amount: 250.00, type: 'donation', description: 'Online Donation', fundId: 'annual-operating', campaignId: 'annual-2025', appealId: 'website-donate', deductible: 250.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },

  // Pledge payments (linked to pledge-001: $5,000 Building Campaign pledge)
  { id: 'gift-004', patronId: 'anderson-collingwood', date: '2025-06-15', amount: 750.00, type: 'pledge-payment', description: 'Building Campaign - Q1 Payment', fundId: 'capital-building', campaignId: 'building-future', appealId: 'leadership-gifts', deductible: 750.00, benefitsValue: 0, softCredits: [{ patronId: '888', name: 'Robert Chen', type: 'influencer' }], pledgeId: 'pledge-001', recurringProfileId: null },
  { id: 'gift-006', patronId: 'anderson-collingwood', date: '2025-09-15', amount: 1250.00, type: 'pledge-payment', description: 'Building Campaign - Q2 Payment', fundId: 'capital-building', campaignId: 'building-future', appealId: 'leadership-gifts', deductible: 1250.00, benefitsValue: 0, softCredits: [], pledgeId: 'pledge-001', recurringProfileId: null },

  // Recurring payments (linked to rec-001: $100/month Annual Fund sustainer)
  { id: 'gift-007', patronId: 'anderson-collingwood', date: '2025-11-15', amount: 100.00, type: 'recurring', description: 'Monthly Sustainer - Nov 2025', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: null, deductible: 100.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: 'rec-001' },
  { id: 'gift-008', patronId: 'anderson-collingwood', date: '2025-12-15', amount: 100.00, type: 'recurring', description: 'Monthly Sustainer - Dec 2025', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: null, deductible: 100.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: 'rec-001' },
  { id: 'gift-009', patronId: 'anderson-collingwood', date: '2026-01-15', amount: 100.00, type: 'recurring', description: 'Monthly Sustainer - Jan 2026', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: null, deductible: 100.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: 'rec-001' },

  // Elizabeth Fairfax - pledge payment + donation
  { id: 'gift-010', patronId: 'elizabeth-fairfax', date: '2025-04-15', amount: 500.00, type: 'pledge-payment', description: 'Annual Fund Pledge - Q1 Payment', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'spring-gala-2025', deductible: 500.00, benefitsValue: 0, softCredits: [], pledgeId: 'pledge-002', recurringProfileId: null },
  { id: 'gift-011', patronId: 'elizabeth-fairfax', date: '2025-12-20', amount: 200.00, type: 'donation', description: 'Year-End Online Donation', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'year-end-mailer', deductible: 200.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
]

// Get all gifts for a patron
export const getGiftsByPatronId = (patronId) => {
  return GIFTS.filter(g => g.patronId === patronId)
}

// Add a new gift to the store
export const addGift = (giftData) => {
  const newGift = {
    id: giftData.id || `gift-${Date.now()}`,
    patronId: giftData.patronId,
    date: giftData.date || new Date().toISOString().split('T')[0],
    amount: giftData.amount,
    type: giftData.type || 'donation',
    description: giftData.description || '',
    fundId: giftData.fundId || null,
    campaignId: giftData.campaignId || null,
    appealId: giftData.appealId || null,
    deductible: giftData.deductible ?? giftData.amount,
    benefitsValue: giftData.benefitsValue ?? 0,
    softCredits: giftData.softCredits || [],
    pledgeId: giftData.pledgeId || null,
    recurringProfileId: giftData.recurringProfileId || null,
  }
  GIFTS.push(newGift)
  return newGift
}

// Resolve a gift with display names for DCAP references
export const resolveGift = (gift) => {
  if (!gift) return null
  return gift
}

// =============================================================================
// PLEDGES (multi-payment commitments)
// =============================================================================

export const PLEDGES = [
  {
    id: 'pledge-001',
    patronId: 'anderson-collingwood',
    amount: 5000.00,
    balance: 3000.00,
    totalPaid: 2000.00,
    startDate: '2025-06-01',
    endDate: '2026-06-01',
    frequency: 'quarterly',
    nextPaymentDate: '2026-03-01',
    status: 'active',
    fundId: 'capital-building',
    campaignId: 'building-future',
    appealId: 'leadership-gifts',
    assignedToId: 'lj',
    notes: 'Committed at leadership dinner. Quarterly installments.',
    createdDate: '2025-06-01',
  },
  // Elizabeth Fairfax - overdue pledge (triggers alert)
  {
    id: 'pledge-002',
    patronId: 'elizabeth-fairfax',
    amount: 2500.00,
    balance: 2000.00,
    totalPaid: 500.00,
    startDate: '2025-04-01',
    endDate: '2026-04-01',
    frequency: 'quarterly',
    nextPaymentDate: '2025-10-01',
    status: 'active',
    fundId: 'annual-operating',
    campaignId: 'annual-2026',
    appealId: 'spring-gala-2025',
    assignedToId: 'lj',
    notes: 'Pledged at Spring Gala. Quarterly installments.',
    createdDate: '2025-04-01',
  },
]

// Get all pledges for a patron
export const getPledgesByPatronId = (patronId) => {
  return PLEDGES.filter(p => p.patronId === patronId)
}

// Get all gift payments linked to a pledge
export const getPaymentsForPledge = (pledgeId) => {
  return GIFTS.filter(g => g.pledgeId === pledgeId)
}

// Get the remaining balance on a pledge (computed from linked payments)
export const getPledgeBalance = (pledgeId) => {
  const pledge = PLEDGES.find(p => p.id === pledgeId)
  if (!pledge) return 0
  const paid = getPaymentsForPledge(pledgeId).reduce((sum, g) => sum + g.amount, 0)
  return pledge.amount - paid
}

// =============================================================================
// RECURRING PROFILES (sustainer / monthly donor schedules)
// =============================================================================

export const RECURRING_PROFILES = [
  {
    id: 'rec-001',
    patronId: 'anderson-collingwood',
    amount: 100.00,
    frequency: 'monthly',
    startDate: '2025-01-15',
    nextDate: '2026-02-15',
    endDate: null,
    status: 'active',
    fundId: 'annual-operating',
    campaignId: 'annual-2026',
    paymentMethod: { type: 'visa', last4: '4242' },
    totalGiven: 1300.00,
    giftCount: 13,
    createdDate: '2025-01-15',
  },
]

// Get all recurring profiles for a patron
export const getRecurringProfilesByPatronId = (patronId) => {
  return RECURRING_PROFILES.filter(r => r.patronId === patronId)
}

// Get all gift payments linked to a recurring profile
export const getPaymentsForRecurringProfile = (profileId) => {
  return GIFTS.filter(g => g.recurringProfileId === profileId)
}

// =============================================================================
// GIFT ALLOCATIONS (split designations across multiple funds)
// =============================================================================

export const GIFT_ALLOCATIONS = [
  // gift-001 ($1,000 Year-End Major Gift) split across two funds
  { id: 'alloc-001', giftId: 'gift-001', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'year-end-mailer', amount: 700.00 },
  { id: 'alloc-002', giftId: 'gift-001', fundId: 'education', campaignId: 'annual-2026', appealId: 'year-end-mailer', amount: 300.00 },
]

// Get all allocations for a gift
export const getAllocationsForGift = (giftId) => {
  return GIFT_ALLOCATIONS.filter(a => a.giftId === giftId)
}

// Check if a gift has split designations
export const isGiftSplit = (giftId) => {
  return GIFT_ALLOCATIONS.some(a => a.giftId === giftId)
}

// =============================================================================
// INTERACTIONS (CRM activity / communication log)
// =============================================================================

export const INTERACTIONS = [
  {
    id: 'int-001',
    patronId: 'anderson-collingwood',
    opportunityId: null,
    type: 'phone',
    direction: 'outbound',
    date: '2025-10-19T11:20:00',
    description: 'Follow-up after recent donation',
    details: {
      notes: 'Discussed upcoming gala. Very enthusiastic about building campaign. Mentioned interest in naming opportunity.',
      duration: '15 min',
      outcome: 'Positive - will attend gala'
    },
    staffId: 'lj',
    createdDate: '2025-10-19',
  },
  {
    id: 'int-002',
    patronId: 'anderson-collingwood',
    opportunityId: null,
    type: 'email',
    direction: 'outbound',
    date: '2025-08-26T10:00:00',
    description: 'Thank-you message after Summer Concert',
    details: {
      to: 'anderson.collingwood@email.com',
      subject: 'Thank you for joining us at the Summer Concert!',
      content: 'Personal thank-you with photos from the event.',
    },
    staffId: 'lj',
    createdDate: '2025-08-26',
  },
  {
    id: 'int-003',
    patronId: 'anderson-collingwood',
    opportunityId: null,
    type: 'event',
    direction: null,
    date: '2025-08-24T18:30:00',
    description: 'Attended Summer Concert Series VIP Reception',
    details: {
      venue: 'Paradox Museum - Rooftop Terrace',
      guests: 2,
      table: 'VIP Table 3'
    },
    staffId: null,
    createdDate: '2025-08-24',
  },
  {
    id: 'int-004',
    patronId: 'anderson-collingwood',
    opportunityId: null,
    type: 'meeting',
    direction: null,
    date: '2025-07-10T14:00:00',
    description: 'Portfolio review lunch meeting',
    details: {
      notes: 'Reviewed giving history and discussed building campaign pledge structure. Anderson prefers quarterly payments.',
      duration: '1 hr 15 min',
      outcome: 'Agreed to $5,000 pledge over 4 quarters',
      location: 'The Capital Grille, Austin'
    },
    staffId: 'lj',
    createdDate: '2025-07-10',
  },
  {
    id: 'int-005',
    patronId: 'anderson-collingwood',
    opportunityId: null,
    type: 'note',
    direction: null,
    date: '2025-06-02T09:00:00',
    description: 'Building campaign pledge confirmed',
    details: {
      notes: 'Pledge form received. $5,000 over 4 quarters starting Q2 2025. First payment processed.',
    },
    staffId: 'lj',
    createdDate: '2025-06-02',
  },
  {
    id: 'int-006',
    patronId: 'anderson-collingwood',
    opportunityId: null,
    type: 'email',
    direction: 'inbound',
    date: '2025-04-15T08:30:00',
    description: 'Inquiry about building campaign naming opportunities',
    details: {
      to: 'development@paradoxmuseum.org',
      subject: 'Re: Building the Future Campaign',
      content: 'Anderson replied to campaign brochure asking about gallery naming levels.',
    },
    staffId: null,
    createdDate: '2025-04-15',
  },
  {
    id: 'int-007',
    patronId: 'anderson-collingwood',
    opportunityId: null,
    type: 'ticket',
    direction: null,
    date: '2025-03-08T19:00:00',
    description: 'Purchased Spring Gala tickets',
    details: {
      event: 'Spring Gala 2025',
      quantity: 4,
      ticketType: 'VIP Table'
    },
    amount: 800.00,
    staffId: null,
    createdDate: '2025-03-08',
  },
  {
    id: 'int-008',
    patronId: 'anderson-collingwood',
    opportunityId: null,
    type: 'phone',
    direction: 'outbound',
    date: '2025-01-20T10:00:00',
    description: 'New year check-in call',
    details: {
      notes: 'Wished happy new year. Confirmed recurring monthly gift is processing correctly. Mentioned upcoming Spring Gala.',
      duration: '10 min',
      outcome: 'Positive - interested in Spring Gala'
    },
    staffId: 'lj',
    createdDate: '2025-01-20',
  },
]

// Get all interactions for a patron
export const getInteractionsByPatronId = (patronId) => {
  return INTERACTIONS.filter(i => i.patronId === patronId)
}

// Get interactions linked to an opportunity
export const getInteractionsByOpportunityId = (opportunityId) => {
  return INTERACTIONS.filter(i => i.opportunityId === opportunityId)
}

// Get recent interactions for a patron (sorted newest first, optional limit)
export const getRecentInteractions = (patronId, limit = 10) => {
  return getInteractionsByPatronId(patronId)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit)
}

// Add a new interaction
export const addInteraction = (data) => {
  const newInteraction = {
    id: data.id || `int-${Date.now()}`,
    patronId: data.patronId,
    opportunityId: data.opportunityId || null,
    type: data.type,
    direction: data.direction || null,
    date: data.date || new Date().toISOString(),
    description: data.description || '',
    details: data.details || {},
    staffId: data.staffId || null,
    createdDate: new Date().toISOString().split('T')[0],
  }
  INTERACTIONS.push(newInteraction)
  return newInteraction
}

// =============================================================================
// ACKNOWLEDGMENTS (gift thank-you and receipt tracking)
// =============================================================================

export const ACKNOWLEDGMENTS = [
  // gift-001: Year-End Major Gift ($1,000) - fully acknowledged
  { id: 'ack-001', giftId: 'gift-001', patronId: 'anderson-collingwood', type: 'thank-you-letter', method: 'email', status: 'sent', date: '2025-12-16', staffId: 'lj', templateUsed: 'major-gift-thanks', notes: null },
  { id: 'ack-002', giftId: 'gift-001', patronId: 'anderson-collingwood', type: 'tax-receipt', method: 'email', status: 'sent', date: '2025-12-16', staffId: null, templateUsed: 'standard-receipt', notes: null },

  // gift-002: Spring Gala Donation ($500) - acknowledged
  { id: 'ack-003', giftId: 'gift-002', patronId: 'anderson-collingwood', type: 'thank-you-email', method: 'email', status: 'sent', date: '2025-06-16', staffId: 'lj', templateUsed: 'event-gift-thanks', notes: null },
  { id: 'ack-004', giftId: 'gift-002', patronId: 'anderson-collingwood', type: 'tax-receipt', method: 'email', status: 'sent', date: '2025-06-16', staffId: null, templateUsed: 'standard-receipt', notes: null },

  // gift-004: Building Campaign Q1 Payment ($750) - acknowledged
  { id: 'ack-005', giftId: 'gift-004', patronId: 'anderson-collingwood', type: 'thank-you-letter', method: 'email', status: 'sent', date: '2025-06-16', staffId: 'lj', templateUsed: 'pledge-payment-thanks', notes: null },

  // gift-006: Building Campaign Q2 Payment ($1,250) - PENDING acknowledgment
  { id: 'ack-006', giftId: 'gift-006', patronId: 'anderson-collingwood', type: 'thank-you-letter', method: 'email', status: 'pending', date: null, staffId: 'lj', templateUsed: 'pledge-payment-thanks', notes: 'Queued for next batch' },

  // gift-005: Online Donation ($250) - acknowledged
  { id: 'ack-007', giftId: 'gift-005', patronId: 'anderson-collingwood', type: 'thank-you-email', method: 'email', status: 'sent', date: '2024-11-19', staffId: null, templateUsed: 'online-auto-thanks', notes: 'Auto-generated' },

  // Elizabeth Fairfax - gift-010 acknowledged, gift-011 PENDING
  { id: 'ack-008', giftId: 'gift-010', patronId: 'elizabeth-fairfax', type: 'thank-you-letter', method: 'email', status: 'sent', date: '2025-04-16', staffId: 'lj', templateUsed: 'pledge-payment-thanks', notes: null },
  { id: 'ack-009', giftId: 'gift-011', patronId: 'elizabeth-fairfax', type: 'thank-you-email', method: 'email', status: 'pending', date: null, staffId: 'lj', templateUsed: 'online-auto-thanks', notes: 'Queued for batch processing' },
]

// Get all acknowledgments for a gift
export const getAcknowledgmentsByGiftId = (giftId) => {
  return ACKNOWLEDGMENTS.filter(a => a.giftId === giftId)
}

// Get all acknowledgments for a patron
export const getAcknowledgmentsByPatronId = (patronId) => {
  return ACKNOWLEDGMENTS.filter(a => a.patronId === patronId)
}

// Check if a gift has been acknowledged (at least one sent acknowledgment)
export const isGiftAcknowledged = (giftId) => {
  return ACKNOWLEDGMENTS.some(a => a.giftId === giftId && a.status === 'sent')
}

// Get pending acknowledgments for a patron
export const getPendingAcknowledgments = (patronId) => {
  return ACKNOWLEDGMENTS.filter(a => a.patronId === patronId && a.status === 'pending')
}

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
      // Resolve tier-level styling from tierConfig (card colors are per-tier, not per-member)
      const tierCfg = tierConfig[membership.tier] || {}
      return {
        ...membership,
        cardStyle: tierCfg.cardStyle || membership.cardStyle,
        patronId: patronId,  // Add patron ID for QR code in MembershipOverview
        patronRole: link.role,
        patronRoleLabel: link.roleLabel,
        canManage: link.canManage,
        addedDate: link.addedDate
      }
    })
    .filter(Boolean) // Remove any null entries
}

// Get the primary membership for a patron (convenience wrapper)
// Returns the first membership where the patron is a beneficiary, with tier styling resolved
export const getPrimaryMembershipForPatron = (patronId) => {
  const patronMemberships = getMembershipsByPatronId(patronId)
  return patronMemberships.length > 0 ? patronMemberships[0] : null
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
  
  const limit = tierConfig[membership.tier]?.beneficiaryLimit || 1
  
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
