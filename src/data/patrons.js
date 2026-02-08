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

import { shiftDemoData, computeDaysToRenewal } from '../utils/demoDate'

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
  { id: 'online', label: 'Online Gift', icon: 'fa-globe', origin: 'fever' },
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
    email: 'anderson.collingwood@gmail.com',
    phone: '(415) 555-4567',
    address: '45 Paradise Dr, Tiburon, CA 94920',
    tags: ['major-donor', 'donor', 'board-member'],
    householdId: 'hh-collingwood',
    // MANAGED PROSPECT - has assignedToId (opportunities tracked separately)
    assignedToId: 'lj',
    engagement: {
      level: 'on-fire',
      visits: 47,
      lastVisit: '2025-11-19',
      activityHistory: [
        { month: '2025-02', weeks: [
          { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 200 }] },
          { activities: [] },
          { activities: [{ type: 'attendance', count: 2 }] },
          { activities: [{ type: 'purchase', count: 1, value: 35 }] }
        ]},
        { month: '2025-03', weeks: [
          { activities: [] },
          { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 150 }] },
          { activities: [{ type: 'gift', count: 1, value: 750 }] },
          { activities: [{ type: 'attendance', count: 2 }, { type: 'purchase', count: 1, value: 45 }] }
        ]},
        { month: '2025-04', weeks: [
          { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 2, value: 250 }] },
          { activities: [] },
          { activities: [] },
          { activities: [{ type: 'attendance', count: 1 }] }
        ]},
        { month: '2025-05', weeks: [
          { activities: [{ type: 'purchase', count: 1, value: 150 }] },
          { activities: [{ type: 'attendance', count: 2 }] },
          { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 2, value: 78 }] },
          { activities: [] }
        ]},
        { month: '2025-06', weeks: [
          { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 150 }] },
          { activities: [{ type: 'gift', count: 1, value: 500 }, { type: 'attendance', count: 3 }] },
          { activities: [{ type: 'attendance', count: 2 }] },
          { activities: [{ type: 'purchase', count: 1, value: 25 }] }
        ]},
        { month: '2025-07', weeks: [
          { activities: [{ type: 'purchase', count: 1, value: 250 }] },
          { activities: [] },
          { activities: [{ type: 'attendance', count: 1 }] },
          { activities: [] }
        ]},
        { month: '2025-08', weeks: [
          { activities: [{ type: 'purchase', count: 2, value: 300 }] },
          { activities: [{ type: 'attendance', count: 1 }] },
          { activities: [] },
          { activities: [{ type: 'attendance', count: 2 }] }
        ]},
        { month: '2025-09', weeks: [
          { activities: [{ type: 'attendance', count: 1 }] },
          { activities: [{ type: 'purchase', count: 1, value: 42 }] },
          { activities: [{ type: 'attendance', count: 2 }, { type: 'purchase', count: 1, value: 150 }] },
          { activities: [{ type: 'attendance', count: 1 }] }
        ]},
        { month: '2025-10', weeks: [
          { activities: [{ type: 'attendance', count: 2 }] },
          { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 55 }] },
          { activities: [{ type: 'attendance', count: 3 }, { type: 'purchase', count: 1, value: 150 }] },
          { activities: [{ type: 'gift', count: 1, value: 200 }] }
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
          { activities: [{ type: 'gift', count: 1, value: 1000 }, { type: 'attendance', count: 3 }] },
          { activities: [{ type: 'attendance', count: 4 }, { type: 'purchase', count: 3, value: 156 }] }
        ]},
        { month: '2026-01', weeks: [
          { activities: [{ type: 'attendance', count: 2 }, { type: 'purchase', count: 1, value: 148 }] },
          { activities: [] },
          { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 32 }] },
          { activities: [{ type: 'attendance', count: 3 }, { type: 'gift', count: 1, value: 250 }] }
        ]}
      ]
    },
    giving: {
      lifetimeValue: 19231.97,
      totalGifts: 16681.97,
      revenue: 2550.00,
      giftCount: 16,
      averageGift: 1042.62,
      lastGift: '2026-01-28',
      byFund: {
        'annual-operating': { name: 'Annual Operating', total: 12181.97, count: 12 },
        'restricted': { name: 'Restricted Funds', total: 750.00, count: 1 },
        'capital-building': { name: 'Capital Building', total: 3750.00, count: 3 }
      },
      byCampaign: {
        'annual-2026': { name: '2026 Annual Fund', total: 7945.99, count: 7, goal: 500000 },
        'building-future': { name: 'Building the Future', total: 3750.00, count: 3, goal: 50000000 },
        'annual-2025': { name: '2025 Annual Fund', total: 4145.99, count: 4, goal: 450000 },
        'emergency-2024': { name: 'Emergency Relief Fund', total: 750.00, count: 1, goal: 100000 }
      },
      byYear: { 2026: { total: 2600.00, count: 2 }, 2025: { total: 9095.99, count: 8 }, 2024: { total: 4895.99, count: 5 }, 2023: { total: 89.99, count: 1 } },
      firstTransaction: { amount: 89.99, date: '2023-12-02' },
      lastTransaction: { amount: 2500.00, date: '2026-01-28' },
      largestTransaction: { amount: 2500.00, date: '2024-12-18' }
    },
    wealthInsights: {
      propensityScore: 'DSI-3',
      description: 'Real estate holdings in Marin County valued at $2.8 million, business executive at a firm with revenues of $5-10 million.'
    },
    taxDocuments: {
      organization: { name: 'Fonck Museum', ein: '12-3456789', address: '100 Bridgeway, Sausalito, CA 94965' },
      yearEndSummaries: [
        { year: 2025, generated: '2026-01-15', sent: true, sentDate: '2026-01-15', method: 'email' },
        { year: 2024, generated: '2025-01-12', sent: true, sentDate: '2025-01-12', method: 'email' },
        { year: 2023, generated: '2024-01-10', sent: true, sentDate: '2024-01-10', method: 'email' }
      ],
      receipts: [
        { id: 1, date: '2023-12-02', type: 'membership', description: 'Silver Membership - Initial', amount: 89.99, deductible: 49.99, benefitsValue: 40.00, campaign: null, appeal: 'Membership Join' },
        { id: 2, date: '2024-03-15', type: 'one-time', description: 'First Annual Gift', amount: 500.00, deductible: 500.00, benefitsValue: 0, campaign: '2025 Annual Fund', appeal: 'Online Giving' },
        { id: 3, date: '2024-06-15', type: 'membership', description: 'Gold Membership Upgrade', amount: 145.99, deductible: 95.99, benefitsValue: 50.00, campaign: '2025 Annual Fund', appeal: 'Membership Renewal' },
        { id: 4, date: '2024-06-20', type: 'one-time', description: 'Emergency Relief Gift', amount: 750.00, deductible: 750.00, benefitsValue: 0, campaign: 'Emergency Relief Fund', appeal: 'Emergency Email Appeal' },
        { id: 5, date: '2024-10-15', type: 'one-time', description: 'Fall Campaign Gift', amount: 1000.00, deductible: 1000.00, benefitsValue: 0, campaign: '2025 Annual Fund', appeal: 'Year-End Direct Mail' },
        { id: 6, date: '2024-12-18', type: 'one-time', description: 'Year-End Major Gift', amount: 2500.00, deductible: 2500.00, benefitsValue: 0, campaign: '2025 Annual Fund', appeal: 'Year-End Direct Mail' },
        { id: 7, date: '2025-06-15', type: 'one-time', description: 'Spring Gala Sponsorship', amount: 2500.00, deductible: 2100.00, benefitsValue: 400.00, campaign: '2026 Annual Fund', appeal: 'Spring Gala 2026' },
        { id: 8, date: '2025-06-15', type: 'pledge-payment', description: 'Building Campaign - Q1 Payment', amount: 1250.00, deductible: 1250.00, benefitsValue: 0, campaign: 'Building the Future', appeal: 'Leadership Gifts Circle' },
        { id: 9, date: '2025-09-15', type: 'pledge-payment', description: 'Building Campaign - Q2 Payment', amount: 1250.00, deductible: 1250.00, benefitsValue: 0, campaign: 'Building the Future', appeal: 'Leadership Gifts Circle' },
        { id: 10, date: '2025-12-02', type: 'membership', description: 'Gold Membership Renewal', amount: 145.99, deductible: 95.99, benefitsValue: 50.00, campaign: '2026 Annual Fund', appeal: 'Membership Renewal' },
        { id: 11, date: '2025-12-15', type: 'pledge-payment', description: 'Building Campaign - Q3 Payment', amount: 1250.00, deductible: 1250.00, benefitsValue: 0, campaign: 'Building the Future', appeal: 'Leadership Gifts Circle' },
        { id: 12, date: '2025-12-20', type: 'one-time', description: 'Year-End Major Gift', amount: 2500.00, deductible: 2500.00, benefitsValue: 0, campaign: '2026 Annual Fund', appeal: 'Year-End Direct Mail' }
      ],
      inKindGifts: []
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
    tags: ['donor'],
    householdId: 'hh-fairfax',
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
          { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 90 }] },
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
          { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 90 }] },
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
          { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 112 }] }
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
          { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 90 }] },
          { activities: [] },
          { activities: [] }
        ]},
        { month: '2025-11', weeks: [
          { activities: [] },
          { activities: [] },
          { activities: [{ type: 'attendance', count: 2 }, { type: 'purchase', count: 1, value: 88 }] },
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
    giving: {
      lifetimeValue: 1850.00,
      totalGifts: 1379.98,
      revenue: 470.02,
      giftCount: 5,
      averageGift: 276.00,
      lastGift: '2025-09-10',
      byFund: {
        'annual-operating': { name: 'Annual Operating', total: 1379.98, count: 5 }
      },
      byCampaign: {
        'annual-2025': { name: '2025 Annual Fund', total: 589.99, count: 2, goal: 450000 },
        'annual-2026': { name: '2026 Annual Fund', total: 700.00, count: 2, goal: 500000 }
      },
      byYear: { 2025: { total: 789.99, count: 3 }, 2024: { total: 589.99, count: 2 } },
      firstTransaction: { amount: 89.99, date: '2024-02-27' },
      lastTransaction: { amount: 500.00, date: '2025-09-10' },
      largestTransaction: { amount: 500.00, date: '2024-11-18' }
    },
    address: '280 Cascade Dr, Mill Valley, CA 94941',
    // Tax documents for Documents tab
    taxDocuments: {
      organization: {
        name: 'Fonck Museum',
        ein: '12-3456789',
        address: '100 Bridgeway, Sausalito, CA 94965'
      },
      receipts: [
        { id: 1, date: '2024-02-27', type: 'membership', description: 'Silver Membership - Initial', amount: 89.99, deductible: 49.99, benefitsValue: 40.00, campaign: null, appeal: 'Website Join' },
        { id: 2, date: '2024-11-18', type: 'one-time', description: 'Year-End Online Gift', amount: 500.00, deductible: 500.00, benefitsValue: 0, campaign: '2025 Annual Fund', appeal: 'Online Giving' },
        { id: 3, date: '2025-02-27', type: 'membership', description: 'Silver Membership Renewal', amount: 89.99, deductible: 49.99, benefitsValue: 40.00, campaign: '2025 Annual Fund', appeal: 'Membership Renewal' },
        { id: 4, date: '2025-06-15', type: 'one-time', description: 'Spring Gala Gift', amount: 200.00, deductible: 200.00, benefitsValue: 0, campaign: '2026 Annual Fund', appeal: 'Ticket Checkout Add-on' },
        { id: 5, date: '2025-09-10', type: 'one-time', description: 'Online Gift', amount: 500.00, deductible: 500.00, benefitsValue: 0, campaign: '2026 Annual Fund', appeal: 'Online Giving' }
      ],
      yearEndSummaries: [
        { id: 1, year: 2025, generated: '2026-01-15', sent: false },
        { id: 2, year: 2024, generated: '2025-01-10', sent: true, sentDate: '2025-01-12' }
      ],
      inKindGifts: []
    },
    source: 'ticket',
    createdDate: '2024-02-27'
  },

  // Other Managed Prospects (simplified data for list view)
  {
    id: 'jake-thompson',
    firstName: 'Jake',
    lastName: 'Thompson',
    photo: null,
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
        { month: '2025-07', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 50 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-08', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-09', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 50 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-10', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 50 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-11', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-12', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 150, totalGifts: 0, revenue: 150, lastGift: null },
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
    address: '1425 Second St, San Rafael, CA 94901',
    tags: ['donor'],
    householdId: 'hh-taylor-thomas',
    assignedToId: 'es',
    engagement: {
      level: 'cold',
      visits: 8,
      lastVisit: '2025-10-12',
      activityHistory: [
        { month: '2025-02', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-03', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-04', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-05', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 80 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-06', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 80 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-07', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 80 }] }, { activities: [] }] },
        { month: '2025-08', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 80 }] }] },
        { month: '2025-09', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 90 }] }, { activities: [] }, { activities: [{ type: 'gift', count: 1, value: 750 }] }, { activities: [] }] },
        { month: '2025-10', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 2 }, { type: 'purchase', count: 1, value: 90 }] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-11', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-12', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 1250, totalGifts: 750, revenue: 500, giftCount: 1, averageGift: 750, lastGift: '2025-10-12',
      byFund: { 'annual-operating': { name: 'Annual Operating', total: 750.00, count: 1 } },
      byCampaign: { 'annual-2026': { name: '2026 Annual Fund', total: 750.00, count: 1 } },
      byYear: { 2025: { total: 750.00, count: 1 } },
      firstTransaction: { amount: 750.00, date: '2025-09-18' },
      lastTransaction: { amount: 750.00, date: '2025-09-18' },
      largestTransaction: { amount: 750.00, date: '2025-09-18' }
    },
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
    address: '1425 Second St, San Rafael, CA 94901',
    tags: ['donor'],
    householdId: 'hh-taylor-thomas',
    assignedToId: 'lj',
    engagement: {
      level: 'warm',
      visits: 22,
      lastVisit: '2025-10-20',
      activityHistory: [
        { month: '2025-02', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 175 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-03', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [] }, { activities: [{ type: 'purchase', count: 1, value: 45 }] }] },
        { month: '2025-04', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 200 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-05', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 2 }, { type: 'purchase', count: 1, value: 175 }] }, { activities: [{ type: 'gift', count: 1, value: 500 }] }, { activities: [] }] },
        { month: '2025-06', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 200 }] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 2 }] }] },
        { month: '2025-07', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'purchase', count: 1, value: 35 }] }, { activities: [] }] },
        { month: '2025-08', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 200 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'gift', count: 1, value: 500 }] }] },
        { month: '2025-09', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 2 }, { type: 'purchase', count: 1, value: 215 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-10', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'purchase', count: 1, value: 55 }] }, { activities: [{ type: 'attendance', count: 2 }, { type: 'gift', count: 1, value: 500 }] }, { activities: [] }] },
        { month: '2025-11', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-12', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 2800, totalGifts: 1500, revenue: 1300, giftCount: 3, averageGift: 500, lastGift: '2025-10-20',
      byFund: { 'annual-operating': { name: 'Annual Operating', total: 1500.00, count: 3 } },
      byCampaign: { 'annual-2026': { name: '2026 Annual Fund', total: 1500.00, count: 3 } },
      byYear: { 2025: { total: 1500.00, count: 3 } },
      firstTransaction: { amount: 500.00, date: '2025-05-18' },
      lastTransaction: { amount: 500.00, date: '2025-10-18' },
      largestTransaction: { amount: 500.00, date: '2025-05-18' }
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
    assignedToId: 'lj',
    engagement: {
      level: 'hot',
      visits: 45,
      lastVisit: '2025-11-01',
      activityHistory: [
        { month: '2025-02', weeks: [{ activities: [{ type: 'attendance', count: 2 }, { type: 'purchase', count: 1, value: 100 }] }, { activities: [{ type: 'purchase', count: 1, value: 65 }] }, { activities: [{ type: 'attendance', count: 3 }] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-03', weeks: [{ activities: [{ type: 'attendance', count: 2 }, { type: 'purchase', count: 1, value: 100 }] }, { activities: [{ type: 'gift', count: 1, value: 1000 }] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'attendance', count: 3 }, { type: 'purchase', count: 1, value: 45 }] }] },
        { month: '2025-04', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 100 }] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'purchase', count: 1, value: 38 }] }, { activities: [{ type: 'attendance', count: 2 }] }] },
        { month: '2025-05', weeks: [{ activities: [{ type: 'attendance', count: 3 }, { type: 'purchase', count: 1, value: 120 }] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'gift', count: 1, value: 2000 }] }, { activities: [{ type: 'attendance', count: 2 }] }] },
        { month: '2025-06', weeks: [{ activities: [{ type: 'attendance', count: 2 }, { type: 'purchase', count: 1, value: 100 }] }, { activities: [{ type: 'purchase', count: 2, value: 78 }] }, { activities: [{ type: 'attendance', count: 3 }] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-07', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 2, value: 220 }] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'gift', count: 1, value: 1500 }] }, { activities: [{ type: 'attendance', count: 2 }] }] },
        { month: '2025-08', weeks: [{ activities: [{ type: 'attendance', count: 2 }, { type: 'purchase', count: 1, value: 100 }] }, { activities: [{ type: 'purchase', count: 1, value: 55 }] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'attendance', count: 3 }] }] },
        { month: '2025-09', weeks: [{ activities: [{ type: 'attendance', count: 2 }, { type: 'purchase', count: 1, value: 117 }] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'gift', count: 1, value: 1000 }] }, { activities: [{ type: 'attendance', count: 2 }] }] },
        { month: '2025-10', weeks: [{ activities: [{ type: 'attendance', count: 3 }, { type: 'purchase', count: 1, value: 100 }] }, { activities: [{ type: 'purchase', count: 1, value: 42 }] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-11', weeks: [{ activities: [{ type: 'attendance', count: 2 }, { type: 'gift', count: 1, value: 1500 }, { type: 'purchase', count: 1, value: 120 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-12', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 8500, totalGifts: 7000, revenue: 1500, giftCount: 5, averageGift: 1400, lastGift: '2025-11-01',
      byFund: { 'annual-operating': { name: 'Annual Operating', total: 7000.00, count: 5 } },
      byCampaign: { 'annual-2026': { name: '2026 Annual Fund', total: 7000.00, count: 5 } },
      byYear: { 2025: { total: 7000.00, count: 5 } },
      firstTransaction: { amount: 1000.00, date: '2025-03-10' },
      lastTransaction: { amount: 1500.00, date: '2025-11-01' },
      largestTransaction: { amount: 2000.00, date: '2025-05-18' }
    },
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
    address: '105 Meadowsweet Way, Corte Madera, CA 94925',
    tags: ['major-donor', 'donor'],
    householdId: 'hh-martinez-carter',
    assignedToId: 'es',
    engagement: {
      level: 'on-fire',
      visits: 67,
      lastVisit: '2025-10-15',
      activityHistory: [
        { month: '2025-02', weeks: [{ activities: [{ type: 'attendance', count: 3 }, { type: 'gift', count: 1, value: 10000 }] }, { activities: [{ type: 'attendance', count: 2 }, { type: 'purchase', count: 2, value: 500 }] }, { activities: [{ type: 'attendance', count: 4 }, { type: 'purchase', count: 2, value: 125 }] }, { activities: [{ type: 'attendance', count: 2 }] }] },
        { month: '2025-03', weeks: [{ activities: [{ type: 'attendance', count: 3 }, { type: 'purchase', count: 2, value: 500 }] }, { activities: [{ type: 'attendance', count: 2 }, { type: 'gift', count: 1, value: 15000 }] }, { activities: [{ type: 'attendance', count: 4 }] }, { activities: [{ type: 'attendance', count: 3 }, { type: 'purchase', count: 1, value: 89 }] }] },
        { month: '2025-04', weeks: [{ activities: [{ type: 'attendance', count: 2 }, { type: 'purchase', count: 2, value: 550 }] }, { activities: [{ type: 'attendance', count: 3 }] }, { activities: [{ type: 'attendance', count: 2 }, { type: 'gift', count: 1, value: 5000 }] }, { activities: [{ type: 'attendance', count: 4 }] }] },
        { month: '2025-05', weeks: [{ activities: [{ type: 'attendance', count: 3 }, { type: 'purchase', count: 2, value: 156 }] }, { activities: [{ type: 'attendance', count: 2 }, { type: 'purchase', count: 2, value: 500 }] }, { activities: [{ type: 'attendance', count: 4 }] }, { activities: [{ type: 'attendance', count: 2 }, { type: 'gift', count: 1, value: 25000 }] }] },
        { month: '2025-06', weeks: [{ activities: [{ type: 'attendance', count: 4 }, { type: 'purchase', count: 2, value: 400 }] }, { activities: [{ type: 'attendance', count: 3 }] }, { activities: [{ type: 'attendance', count: 2 }, { type: 'purchase', count: 1, value: 78 }] }, { activities: [{ type: 'attendance', count: 3 }] }] },
        { month: '2025-07', weeks: [{ activities: [{ type: 'attendance', count: 2 }, { type: 'purchase', count: 2, value: 475 }] }, { activities: [{ type: 'attendance', count: 4 }, { type: 'gift', count: 1, value: 20000 }] }, { activities: [{ type: 'attendance', count: 3 }] }, { activities: [{ type: 'attendance', count: 2 }] }] },
        { month: '2025-08', weeks: [{ activities: [{ type: 'attendance', count: 3 }, { type: 'purchase', count: 2, value: 112 }] }, { activities: [{ type: 'attendance', count: 4 }, { type: 'purchase', count: 2, value: 350 }] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'attendance', count: 3 }, { type: 'gift', count: 1, value: 15000 }] }] },
        { month: '2025-09', weeks: [{ activities: [{ type: 'attendance', count: 4 }, { type: 'purchase', count: 2, value: 400 }] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'attendance', count: 3 }, { type: 'purchase', count: 1, value: 65 }] }, { activities: [{ type: 'attendance', count: 4 }] }] },
        { month: '2025-10', weeks: [{ activities: [{ type: 'attendance', count: 3 }, { type: 'purchase', count: 2, value: 600 }] }, { activities: [{ type: 'attendance', count: 4 }, { type: 'gift', count: 1, value: 30000 }] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [] }] },
        { month: '2025-11', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-12', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 125000, totalGifts: 120000, revenue: 5000, giftCount: 7, averageGift: 17143, lastGift: '2025-10-15',
      byFund: { 'annual-operating': { name: 'Annual Operating', total: 55000.00, count: 3 }, 'capital-building': { name: 'Capital & Building', total: 45000.00, count: 2 }, 'education': { name: 'Education', total: 5000.00, count: 1 }, 'exhibitions': { name: 'Exhibitions', total: 15000.00, count: 1 } },
      byCampaign: { 'annual-2026': { name: '2026 Annual Fund', total: 40000.00, count: 2 }, 'building-future': { name: 'Building the Future', total: 45000.00, count: 2 }, 'spring-gala-2026': { name: 'Spring Gala 2026', total: 15000.00, count: 1 }, 'education-2026': { name: 'Education 2026', total: 5000.00, count: 1 }, 'impressionist-2026': { name: 'Impressionist Exhibition', total: 15000.00, count: 1 } },
      byYear: { 2025: { total: 120000.00, count: 7 } },
      firstTransaction: { amount: 10000.00, date: '2025-02-05' },
      lastTransaction: { amount: 30000.00, date: '2025-10-15' },
      largestTransaction: { amount: 30000.00, date: '2025-10-15' }
    },
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
    address: '105 Meadowsweet Way, Corte Madera, CA 94925',
    tags: ['donor', 'corporate'],
    householdId: 'hh-martinez-carter',
    assignedToId: 'es',
    engagement: {
      level: 'warm',
      visits: 18,
      lastVisit: '2025-11-10',
      activityHistory: [
        { month: '2025-02', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 150 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-03', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 2 }, { type: 'purchase', count: 1, value: 150 }] }, { activities: [] }, { activities: [{ type: 'gift', count: 1, value: 500 }] }] },
        { month: '2025-04', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'purchase', count: 1, value: 45 }] }, { activities: [] }] },
        { month: '2025-05', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 150 }] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-06', weeks: [{ activities: [{ type: 'attendance', count: 2 }, { type: 'purchase', count: 1, value: 150 }] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'gift', count: 1, value: 500 }] }] },
        { month: '2025-07', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'purchase', count: 1, value: 38 }] }, { activities: [] }] },
        { month: '2025-08', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 150 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-09', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 2 }, { type: 'purchase', count: 1, value: 150 }] }, { activities: [] }, { activities: [{ type: 'gift', count: 1, value: 500 }] }] },
        { month: '2025-10', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'purchase', count: 1, value: 52 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-11', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 2 }, { type: 'gift', count: 1, value: 500 }, { type: 'purchase', count: 1, value: 165 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-12', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 3200, totalGifts: 2000, revenue: 1200, giftCount: 4, averageGift: 500, lastGift: '2025-11-10',
      byFund: { 'annual-operating': { name: 'Annual Operating', total: 2000.00, count: 4 } },
      byCampaign: { 'annual-2026': { name: '2026 Annual Fund', total: 2000.00, count: 4 } },
      byYear: { 2025: { total: 2000.00, count: 4 } },
      firstTransaction: { amount: 500.00, date: '2025-03-28' },
      lastTransaction: { amount: 500.00, date: '2025-11-10' },
      largestTransaction: { amount: 500.00, date: '2025-03-28' }
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
    assignedToId: 'sa',
    engagement: {
      level: 'on-fire',
      visits: 52,
      lastVisit: '2025-10-30',
      activityHistory: [
        { month: '2025-02', weeks: [{ activities: [{ type: 'attendance', count: 2 }, { type: 'gift', count: 1, value: 5000 }] }, { activities: [{ type: 'attendance', count: 3 }, { type: 'purchase', count: 2, value: 450 }] }, { activities: [{ type: 'attendance', count: 2 }, { type: 'purchase', count: 1, value: 95 }] }, { activities: [{ type: 'attendance', count: 2 }] }] },
        { month: '2025-03', weeks: [{ activities: [{ type: 'attendance', count: 3 }, { type: 'purchase', count: 2, value: 550 }] }, { activities: [{ type: 'attendance', count: 2 }, { type: 'gift', count: 1, value: 10000 }] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'attendance', count: 3 }] }] },
        { month: '2025-04', weeks: [{ activities: [{ type: 'attendance', count: 2 }, { type: 'purchase', count: 2, value: 145 }] }, { activities: [{ type: 'attendance', count: 3 }, { type: 'purchase', count: 2, value: 450 }] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'attendance', count: 2 }, { type: 'gift', count: 1, value: 15000 }] }] },
        { month: '2025-05', weeks: [{ activities: [{ type: 'attendance', count: 3 }, { type: 'purchase', count: 2, value: 450 }] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'attendance', count: 3 }, { type: 'purchase', count: 1, value: 78 }] }, { activities: [{ type: 'attendance', count: 2 }] }] },
        { month: '2025-06', weeks: [{ activities: [{ type: 'attendance', count: 2 }, { type: 'gift', count: 1, value: 10000 }] }, { activities: [{ type: 'attendance', count: 3 }, { type: 'purchase', count: 2, value: 550 }] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'attendance', count: 3 }] }] },
        { month: '2025-07', weeks: [{ activities: [{ type: 'attendance', count: 2 }, { type: 'purchase', count: 2, value: 450 }] }, { activities: [{ type: 'attendance', count: 3 }, { type: 'purchase', count: 2, value: 112 }] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'attendance', count: 2 }, { type: 'gift', count: 1, value: 15000 }] }] },
        { month: '2025-08', weeks: [{ activities: [{ type: 'attendance', count: 3 }, { type: 'purchase', count: 2, value: 500 }] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'attendance', count: 3 }, { type: 'purchase', count: 1, value: 65 }] }, { activities: [{ type: 'attendance', count: 2 }] }] },
        { month: '2025-09', weeks: [{ activities: [{ type: 'attendance', count: 2 }, { type: 'gift', count: 1, value: 10000 }] }, { activities: [{ type: 'attendance', count: 3 }, { type: 'purchase', count: 2, value: 550 }] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'attendance', count: 3 }] }] },
        { month: '2025-10', weeks: [{ activities: [{ type: 'attendance', count: 3 }, { type: 'purchase', count: 2, value: 466 }] }, { activities: [{ type: 'attendance', count: 2 }, { type: 'purchase', count: 1, value: 89 }] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'attendance', count: 3 }, { type: 'gift', count: 1, value: 15000 }] }] },
        { month: '2025-11', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-12', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 85000, totalGifts: 80000, revenue: 5000, giftCount: 7, averageGift: 11429, lastGift: '2025-10-30',
      byFund: { 'annual-operating': { name: 'Annual Operating', total: 30000.00, count: 3 }, 'capital-building': { name: 'Capital & Building', total: 30000.00, count: 2 }, 'education': { name: 'Education', total: 10000.00, count: 1 }, 'exhibitions': { name: 'Exhibitions', total: 10000.00, count: 1 } },
      byCampaign: { 'annual-2026': { name: '2026 Annual Fund', total: 30000.00, count: 3 }, 'building-future': { name: 'Building the Future', total: 30000.00, count: 2 }, 'education-2026': { name: 'Education 2026', total: 10000.00, count: 1 } },
      byYear: { 2025: { total: 80000.00, count: 7 } },
      firstTransaction: { amount: 5000.00, date: '2025-02-05' },
      lastTransaction: { amount: 15000.00, date: '2025-10-30' },
      largestTransaction: { amount: 15000.00, date: '2025-04-28' }
    },
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
        { month: '2025-02', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 65 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-03', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 65 }] }, { activities: [] }, { activities: [{ type: 'gift', count: 1, value: 400 }] }] },
        { month: '2025-04', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 65 }] }, { activities: [] }] },
        { month: '2025-05', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'purchase', count: 1, value: 35 }] }] },
        { month: '2025-06', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 65 }] }, { activities: [{ type: 'gift', count: 1, value: 400 }] }, { activities: [] }] },
        { month: '2025-07', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 65 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-08', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'purchase', count: 1, value: 42 }] }] },
        { month: '2025-09', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 65 }] }, { activities: [{ type: 'gift', count: 1, value: 400 }] }] },
        { month: '2025-10', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 68 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-11', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 65 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-12', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 1800, totalGifts: 1200, revenue: 600, giftCount: 3, averageGift: 400, lastGift: '2025-09-28',
      byFund: { 'annual-operating': { name: 'Annual Operating', total: 1200.00, count: 3 } },
      byCampaign: { 'annual-2026': { name: '2026 Annual Fund', total: 1200.00, count: 3 } },
      byYear: { 2025: { total: 1200.00, count: 3 } },
      firstTransaction: { amount: 400.00, date: '2025-03-28' },
      lastTransaction: { amount: 400.00, date: '2025-09-28' },
      largestTransaction: { amount: 400.00, date: '2025-03-28' }
    },
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
        { month: '2025-02', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 75 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-03', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'purchase', count: 1, value: 45 }] }, { activities: [] }] },
        { month: '2025-04', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 80 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-05', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 75 }] }, { activities: [{ type: 'gift', count: 1, value: 250 }] }] },
        { month: '2025-06', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'purchase', count: 1, value: 38 }] }] },
        { month: '2025-07', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 80 }] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-08', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 80 }] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'purchase', count: 1, value: 52 }] }] },
        { month: '2025-09', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 80 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-10', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 95 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [] }] },
        { month: '2025-11', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-12', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 950, totalGifts: 250, revenue: 700, giftCount: 1, averageGift: 250, lastGift: '2025-05-25',
      byFund: { 'annual-operating': { name: 'Annual Operating', total: 250.00, count: 1 } },
      byCampaign: { 'annual-2026': { name: '2026 Annual Fund', total: 250.00, count: 1 } },
      byYear: { 2025: { total: 250.00, count: 1 } },
      firstTransaction: { amount: 250.00, date: '2025-05-25' },
      lastTransaction: { amount: 250.00, date: '2025-05-25' },
      largestTransaction: { amount: 250.00, date: '2025-05-25' }
    },
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
        { month: '2025-10', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 115 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-11', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 115 }] }, { activities: [] }, { activities: [{ type: 'membership', count: 1, value: 100 }] }] },
        { month: '2025-12', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 120 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'gift', count: 1, value: 100 }] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 450, totalGifts: 100, revenue: 350, giftCount: 1, averageGift: 100, lastGift: '2025-12-18',
      byFund: { 'annual-operating': { name: 'Annual Operating', total: 100.00, count: 1 } },
      byCampaign: { 'annual-2026': { name: '2026 Annual Fund', total: 100.00, count: 1 } },
      byYear: { 2025: { total: 100.00, count: 1 } },
      firstTransaction: { amount: 100.00, date: '2025-12-18' },
      lastTransaction: { amount: 100.00, date: '2025-12-18' },
      largestTransaction: { amount: 100.00, date: '2025-12-18' }
    },
    createdDate: '2026-02-03',
    source: 'ticket'
  },
  {
    id: 'david-chen',
    firstName: 'David',
    lastName: 'Chen',
    photo: null,
    email: 'd.chen@company.com',
    phone: '(555) 333-4444',
    tags: ['donor'],
    // General Constituent - RECENTLY ADDED via online gift
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
        { month: '2025-08', weeks: [{ activities: [{ type: 'purchase', count: 1, value: 40 }] }, { activities: [] }, { activities: [{ type: 'gift', count: 1, value: 200 }] }, { activities: [] }] },
        { month: '2025-09', weeks: [{ activities: [{ type: 'attendance', count: 2 }, { type: 'purchase', count: 1, value: 35 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-10', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-11', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-12', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 275, totalGifts: 200, revenue: 75, giftCount: 1, averageGift: 200, lastGift: '2025-08-18',
      byFund: { 'annual-operating': { name: 'Annual Operating', total: 200.00, count: 1 } },
      byCampaign: { 'annual-2026': { name: '2026 Annual Fund', total: 200.00, count: 1 } },
      byYear: { 2025: { total: 200.00, count: 1 } },
      firstTransaction: { amount: 200.00, date: '2025-08-18' },
      lastTransaction: { amount: 200.00, date: '2025-08-18' },
      largestTransaction: { amount: 200.00, date: '2025-08-18' }
    },
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
        { month: '2025-06', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 85 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-07', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 55 }] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-08', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 2 }] }, { activities: [{ type: 'purchase', count: 1, value: 55 }] }] },
        { month: '2025-09', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 55 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-10', weeks: [{ activities: [{ type: 'attendance', count: 2 }, { type: 'purchase', count: 1, value: 55 }] }, { activities: [] }, { activities: [{ type: 'membership', count: 1, value: 150 }] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-11', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 55 }] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-12', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 55 }] }, { activities: [] }, { activities: [{ type: 'gift', count: 1, value: 150 }] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2026-01', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 55 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'attendance', count: 1 }] }] }
      ]
    },
    giving: { lifetimeValue: 620, totalGifts: 150, revenue: 470, giftCount: 1, averageGift: 150, lastGift: '2025-12-18',
      byFund: { 'annual-operating': { name: 'Annual Operating', total: 150.00, count: 1 } },
      byCampaign: { 'annual-2026': { name: '2026 Annual Fund', total: 150.00, count: 1 } },
      byYear: { 2025: { total: 150.00, count: 1 } },
      firstTransaction: { amount: 150.00, date: '2025-12-18' },
      lastTransaction: { amount: 150.00, date: '2025-12-18' },
      largestTransaction: { amount: 150.00, date: '2025-12-18' }
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
        { month: '2026-01', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 50 }] }, { activities: [] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 50, totalGifts: 0, revenue: 50, lastGift: null },
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
    address: '45 Paradise Dr, Tiburon, CA 94920',
    tags: ['donor'],
    recordStatus: 'active',
    householdId: 'hh-collingwood',
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
      totalGifts: 250,
      revenue: 0,
      giftCount: 1,
      averageGift: 250,
      lastGift: '2024-07-20',
      byFund: { 'annual-operating': { name: 'Annual Operating', total: 250.00, count: 1 } },
      byCampaign: { 'annual-2025': { name: '2025 Annual Fund', total: 250.00, count: 1 } },
      byYear: { 2024: { total: 250.00, count: 1 } },
      firstTransaction: { amount: 250.00, date: '2024-07-20' },
      lastTransaction: { amount: 250.00, date: '2024-07-20' },
      largestTransaction: { amount: 250.00, date: '2024-07-20' }
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
    email: 'emma.collingwood@gmail.com',
    phone: null,
    address: '45 Paradise Dr, Tiburon, CA 94920',
    dateOfBirth: '2012-03-15', // 13 years old
    tags: [],
    recordStatus: 'active',
    householdId: 'hh-collingwood',
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
      totalGifts: 0,
      revenue: 0,
      giftCount: 0,
      lastGift: null
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
        { month: '2025-02', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 2, value: 800 }] }, { activities: [] }, { activities: [{ type: 'gift', count: 1, value: 5000 }] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-03', weeks: [{ activities: [{ type: 'attendance', count: 2 }, { type: 'purchase', count: 2, value: 750 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-04', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'purchase', count: 1, value: 120 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-05', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 2, value: 800 }] }, { activities: [{ type: 'gift', count: 1, value: 10000 }] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-06', weeks: [{ activities: [{ type: 'attendance', count: 2 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'purchase', count: 1, value: 85 }] }] },
        { month: '2025-07', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 2, value: 750 }] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-08', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 2 }, { type: 'purchase', count: 2, value: 800 }] }, { activities: [{ type: 'gift', count: 1, value: 5000 }] }, { activities: [] }] },
        { month: '2025-09', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 2, value: 750 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-10', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'purchase', count: 1, value: 200 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-11', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 2, value: 800 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'gift', count: 1, value: 10000 }] }] },
        { month: '2025-12', weeks: [{ activities: [{ type: 'attendance', count: 2 }, { type: 'purchase', count: 2, value: 850 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 2, value: 795 }] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 42500, totalGifts: 35000, revenue: 7500, giftCount: 8, averageGift: 4375, lastGift: '2026-01-22',
      byFund: { 'annual-operating': { name: 'Annual Operating', total: 18500.00, count: 5 }, 'education': { name: 'Education', total: 5000.00, count: 1 } },
      byCampaign: { 'annual-2026': { name: '2026 Annual Fund', total: 17000.00, count: 3 }, 'spring-gala-2026': { name: 'Spring Gala 2026', total: 10000.00, count: 1 }, 'education-2026': { name: 'Education 2026', total: 5000.00, count: 1 }, 'annual-2025': { name: '2025 Annual Fund', total: 1500.00, count: 1 } },
      byYear: { 2022: { total: 500.00, count: 1 }, 2023: { total: 1000.00, count: 1 }, 2024: { total: 1500.00, count: 1 }, 2025: { total: 30000.00, count: 4 }, 2026: { total: 2000.00, count: 1 } },
      firstTransaction: { amount: 500.00, date: '2022-12-15' },
      lastTransaction: { amount: 2000.00, date: '2026-01-22' },
      largestTransaction: { amount: 10000.00, date: '2025-05-18' }
    },
    address: '2790 Broadway, San Francisco, CA 94115',
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
        { month: '2025-02', weeks: [{ activities: [{ type: 'purchase', count: 1, value: 250 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-03', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 250 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-04', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 250 }] }, { activities: [] }] },
        { month: '2025-05', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 250 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-06', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 250 }] }] },
        { month: '2025-07', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 250 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-08', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 250 }] }, { activities: [] }, { activities: [{ type: 'purchase', count: 1, value: 250 }] }] },
        { month: '2025-09', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 250 }] }, { activities: [] }] },
        { month: '2025-10', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 250 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-11', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 250 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-12', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 250 }] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 18000, totalGifts: 15000, revenue: 3000, giftCount: 3, averageGift: 5000, lastGift: '2025-09-22',
      byFund: { 'annual-operating': { name: 'Annual Operating', total: 10000.00, count: 2 }, 'exhibitions': { name: 'Exhibitions', total: 5000.00, count: 1 } },
      byCampaign: { 'annual-2025': { name: '2025 Annual Fund', total: 10000.00, count: 2 }, 'impressionist-2026': { name: 'Impressionist Exhibition', total: 5000.00, count: 1 } },
      byYear: { 2024: { total: 10000.00, count: 2 }, 2025: { total: 5000.00, count: 1 } },
      firstTransaction: { amount: 5000.00, date: '2024-03-15' },
      lastTransaction: { amount: 5000.00, date: '2025-09-22' },
      largestTransaction: { amount: 5000.00, date: '2024-03-15' }
    },
    address: '345 California St, Suite 600, San Francisco, CA 94104',
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
    giving: { lifetimeValue: 12000, totalGifts: 12000, revenue: 0, giftCount: 2, averageGift: 6000, lastGift: '2023-12-10',
      byFund: { 'restricted': { name: 'Restricted', total: 12000.00, count: 2 } },
      byCampaign: {},
      byYear: { 2023: { total: 12000.00, count: 2 } },
      firstTransaction: { amount: 6000.00, date: '2023-06-15' },
      lastTransaction: { amount: 6000.00, date: '2023-12-10' },
      largestTransaction: { amount: 6000.00, date: '2023-06-15' }
    },
    address: '18 Shady Ln, Ross, CA 94957',
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
        { month: '2025-02', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 2, value: 750 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-03', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 2, value: 850 }] }, { activities: [{ type: 'gift', count: 1, value: 10000 }] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-04', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 600 }] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-05', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 2 }, { type: 'purchase', count: 2, value: 900 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-06', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 3, value: 1200 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'gift', count: 1, value: 15000 }] }] },
        { month: '2025-07', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 2, value: 800 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-08', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 2, value: 950 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-09', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 2, value: 1100 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-10', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'purchase', count: 2, value: 750 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 150 }] }] },
        { month: '2025-11', weeks: [{ activities: [{ type: 'purchase', count: 2, value: 850 }] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-12', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 3, value: 1100 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'gift', count: 1, value: 75000 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] }
      ]
    },
    giving: { lifetimeValue: 125000, totalGifts: 115000, revenue: 10000, giftCount: 12, averageGift: 9583, lastGift: '2026-01-15',
      byFund: { 'annual-operating': { name: 'Annual Operating', total: 15000.00, count: 9 }, 'capital-building': { name: 'Capital & Building', total: 90000.00, count: 2 }, 'annual-2025': { name: '2025 Annual Fund', total: 5000.00, count: 2 } },
      byCampaign: { 'annual-2026': { name: '2026 Annual Fund', total: 10000.00, count: 1 }, 'building-future': { name: 'Building the Future', total: 90000.00, count: 2 }, 'annual-2025': { name: '2025 Annual Fund', total: 5000.00, count: 2 } },
      byYear: { 2021: { total: 2500.00, count: 2 }, 2022: { total: 3500.00, count: 2 }, 2023: { total: 4000.00, count: 2 }, 2024: { total: 5000.00, count: 3 }, 2025: { total: 25000.00, count: 2 }, 2026: { total: 75000.00, count: 1 } },
      firstTransaction: { amount: 1000.00, date: '2021-06-15' },
      lastTransaction: { amount: 75000.00, date: '2026-01-15' },
      largestTransaction: { amount: 75000.00, date: '2026-01-15' }
    },
    address: '425 Belvedere Ave, Belvedere, CA 94920',
    source: 'import',
    createdDate: '2021-04-01'
  },

  // Sarah Blackwood - new prospect, first major gift opp (assigned to AL)
  {
    id: 'sarah-blackwood',
    firstName: 'Sarah',
    lastName: 'Blackwood',
    photo: null,
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
        { month: '2025-11', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 115 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-12', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 120 }] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 115 }] }, { activities: [] }, { activities: [] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 350, totalGifts: 0, revenue: 350, giftCount: 0, lastGift: null },
    address: '701 Grant Ave, Apt 4B, Novato, CA 94945',
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
        { month: '2025-02', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 2, value: 550 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-03', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 2, value: 600 }] }, { activities: [] }, { activities: [{ type: 'gift', count: 1, value: 5000 }] }] },
        { month: '2025-04', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 550 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-05', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 2, value: 600 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-06', weeks: [{ activities: [{ type: 'purchase', count: 2, value: 650 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'gift', count: 1, value: 5000 }] }] },
        { month: '2025-07', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 550 }] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-08', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 2, value: 550 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-09', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 2, value: 600 }] }, { activities: [] }, { activities: [{ type: 'gift', count: 1, value: 10000 }] }, { activities: [] }] },
        { month: '2025-10', weeks: [{ activities: [{ type: 'purchase', count: 2, value: 600 }] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-11', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 2, value: 550 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-12', weeks: [{ activities: [{ type: 'purchase', count: 2, value: 600 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'gift', count: 1, value: 5000 }] }] },
        { month: '2026-01', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 2, value: 600 }] }, { activities: [] }, { activities: [] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 52000, totalGifts: 45000, revenue: 7000, giftCount: 9, averageGift: 5000, lastGift: '2026-01-15',
      byFund: { 'annual-operating': { name: 'Annual Operating', total: 30000.00, count: 7 }, 'capital-building': { name: 'Capital & Building', total: 10000.00, count: 1 } },
      byCampaign: { 'annual-2026': { name: '2026 Annual Fund', total: 20000.00, count: 4 }, 'spring-gala-2026': { name: 'Spring Gala 2026', total: 5000.00, count: 1 }, 'building-future': { name: 'Building the Future', total: 10000.00, count: 1 }, 'annual-2025': { name: '2025 Annual Fund', total: 5000.00, count: 1 } },
      byYear: { 2021: { total: 2000.00, count: 1 }, 2022: { total: 3000.00, count: 1 }, 2023: { total: 5000.00, count: 1 }, 2024: { total: 5000.00, count: 1 }, 2025: { total: 25000.00, count: 4 }, 2026: { total: 5000.00, count: 1 } },
      firstTransaction: { amount: 2000.00, date: '2021-03-15' },
      lastTransaction: { amount: 5000.00, date: '2026-01-15' },
      largestTransaction: { amount: 10000.00, date: '2025-09-18' }
    },
    address: '240 El Camino Del Mar, San Francisco, CA 94121',
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
        { month: '2025-02', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 125 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-03', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 150 }] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-04', weeks: [{ activities: [] }, { activities: [{ type: 'gift', count: 1, value: 2000 }] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 150 }] }, { activities: [] }] },
        { month: '2025-05', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 150 }] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-06', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 125 }] }, { activities: [] }] },
        { month: '2025-07', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 150 }] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-08', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 125 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-09', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'gift', count: 1, value: 3000 }] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 150 }] }] },
        { month: '2025-10', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 125 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-11', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 125 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-12', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 125 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 9500, totalGifts: 8000, revenue: 1500, giftCount: 4, averageGift: 2000, lastGift: '2025-09-18',
      byFund: { 'education': { name: 'Education', total: 6000.00, count: 3 }, 'annual-operating': { name: 'Annual Operating', total: 2000.00, count: 1 } },
      byCampaign: { 'education-2026': { name: 'Education 2026', total: 5000.00, count: 2 }, 'annual-2025': { name: '2025 Annual Fund', total: 2000.00, count: 1 } },
      byYear: { 2024: { total: 3000.00, count: 2 }, 2025: { total: 5000.00, count: 2 } },
      firstTransaction: { amount: 1000.00, date: '2024-06-15' },
      lastTransaction: { amount: 3000.00, date: '2025-09-18' },
      largestTransaction: { amount: 3000.00, date: '2025-09-18' }
    },
    address: '520 6th Ave, San Francisco, CA 94118',
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
        { month: '2025-02', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 2, value: 500 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-03', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 2, value: 550 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-04', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 500 }] }, { activities: [] }, { activities: [{ type: 'gift', count: 1, value: 2500 }] }, { activities: [] }] },
        { month: '2025-05', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 2, value: 550 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-06', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 2, value: 550 }] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-07', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 2, value: 500 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-08', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 2, value: 550 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-09', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [{ type: 'purchase', count: 1, value: 75 }] }] },
        { month: '2025-10', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 2, value: 575 }] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-11', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 2, value: 650 }] }, { activities: [{ type: 'gift', count: 1, value: 10000 }] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-12', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 65000, totalGifts: 60000, revenue: 5000, giftCount: 10, averageGift: 6000, lastGift: '2025-11-15',
      byFund: { 'annual-operating': { name: 'Annual Operating', total: 60000.00, count: 10 } },
      byCampaign: { 'annual-2025': { name: '2025 Annual Fund', total: 10000.00, count: 1 }, 'annual-2026': { name: '2026 Annual Fund', total: 12500.00, count: 2 } },
      byYear: { 2020: { total: 7500.00, count: 2 }, 2021: { total: 10000.00, count: 2 }, 2022: { total: 5000.00, count: 1 }, 2023: { total: 15000.00, count: 2 }, 2024: { total: 10000.00, count: 1 }, 2025: { total: 12500.00, count: 2 } },
      firstTransaction: { amount: 2500.00, date: '2020-03-15' },
      lastTransaction: { amount: 10000.00, date: '2025-11-15' },
      largestTransaction: { amount: 10000.00, date: '2024-06-15' }
    },
    address: '3550 Jackson St, San Francisco, CA 94118',
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
        { month: '2025-04', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 300 }] }, { activities: [] }] },
        { month: '2025-05', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 300 }] }] },
        { month: '2025-06', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-07', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 2, value: 400 }] }, { activities: [] }, { activities: [{ type: 'gift', count: 1, value: 25000 }] }, { activities: [] }] },
        { month: '2025-08', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 300 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-09', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 2, value: 600 }] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-10', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 300 }] }] },
        { month: '2025-11', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 2, value: 400 }] }, { activities: [] }, { activities: [{ type: 'gift', count: 1, value: 25000 }] }, { activities: [] }] },
        { month: '2025-12', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 2, value: 400 }] }, { activities: [] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 78000, totalGifts: 75000, revenue: 3000, giftCount: 5, averageGift: 15000, lastGift: '2025-11-10',
      byFund: { 'annual-operating': { name: 'Annual Operating', total: 25000.00, count: 3 }, 'capital-building': { name: 'Capital & Building', total: 50000.00, count: 2 } },
      byCampaign: { 'annual-2025': { name: '2025 Annual Fund', total: 10000.00, count: 1 }, 'building-future': { name: 'Building the Future', total: 50000.00, count: 2 } },
      byYear: { 2023: { total: 15000.00, count: 2 }, 2024: { total: 10000.00, count: 1 }, 2025: { total: 50000.00, count: 2 } },
      firstTransaction: { amount: 5000.00, date: '2023-06-15' },
      lastTransaction: { amount: 25000.00, date: '2025-11-10' },
      largestTransaction: { amount: 25000.00, date: '2025-07-18' }
    },
    address: '1250 Marlborough Rd, Hillsborough, CA 94010',
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
        { month: '2025-03', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 100 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-04', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 100 }] }] },
        { month: '2025-05', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 100 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-06', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 100 }] }, { activities: [] }] },
        { month: '2025-07', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 100 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-08', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 100 }] }, { activities: [] }] },
        { month: '2025-09', weeks: [{ activities: [{ type: 'purchase', count: 1, value: 100 }] }, { activities: [{ type: 'gift', count: 1, value: 1000 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-10', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 100 }] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }, { activities: [] }] },
        { month: '2025-11', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-12', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 2800, totalGifts: 2000, revenue: 800, giftCount: 2, averageGift: 1000, lastGift: '2025-09-10',
      byFund: { 'annual-operating': { name: 'Annual Operating', total: 2000.00, count: 2 } },
      byCampaign: { 'annual-2025': { name: '2025 Annual Fund', total: 1000.00, count: 1 }, 'annual-2026': { name: '2026 Annual Fund', total: 1000.00, count: 1 } },
      byYear: { 2024: { total: 1000.00, count: 1 }, 2025: { total: 1000.00, count: 1 } },
      firstTransaction: { amount: 1000.00, date: '2024-08-15' },
      lastTransaction: { amount: 1000.00, date: '2025-09-10' },
      largestTransaction: { amount: 1000.00, date: '2024-08-15' }
    },
    address: '2200 Vine St, Berkeley, CA 94709',
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
    householdId: 'hh-fairfax',
    assignedToId: 'lj',
    engagement: {
      level: 'warm',
      visits: 14,
      lastVisit: '2025-12-10',
      activityHistory: [
        { month: '2025-02', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 45 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-03', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 45 }] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-04', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'gift', count: 1, value: 500 }] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 45 }] }] },
        { month: '2025-05', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 45 }] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-06', weeks: [{ activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 45 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-07', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 45 }] }, { activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }] }] },
        { month: '2025-08', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 45 }] }, { activities: [] }] },
        { month: '2025-09', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 45 }] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2025-10', weeks: [{ activities: [] }, { activities: [{ type: 'purchase', count: 1, value: 45 }] }, { activities: [] }, { activities: [] }] },
        { month: '2025-11', weeks: [{ activities: [] }, { activities: [] }, { activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 50 }] }, { activities: [] }] },
        { month: '2025-12', weeks: [{ activities: [{ type: 'attendance', count: 1 }, { type: 'purchase', count: 1, value: 45 }] }, { activities: [] }, { activities: [{ type: 'gift', count: 1, value: 200 }] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 3200, totalGifts: 2700, revenue: 500, giftCount: 3, averageGift: 900, lastGift: '2025-12-20' },
    address: '280 Cascade Dr, Mill Valley, CA 94941',
    source: 'ticket',
    createdDate: '2024-03-15'
  },

  // Thomas Fairfax — Paul's son, exists in the system but not yet linked to household
  // Used during demo to show adding a household relationship
  {
    id: 'thomas-fairfax',
    firstName: 'Thomas',
    lastName: 'Fairfax',
    photo: null,
    email: 'thomas.fairfax@outlook.com',
    phone: null,
    address: '280 Cascade Dr, Mill Valley, CA 94941',
    dateOfBirth: '2010-07-22',
    tags: [],
    recordStatus: 'active',
    householdId: null, // Not yet in a household — added during demo
    engagement: {
      level: 'cool',
      visits: 2,
      lastVisit: '2025-11-15',
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
        { month: '2025-12', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] },
        { month: '2026-01', weeks: [{ activities: [] }, { activities: [] }, { activities: [] }, { activities: [] }] }
      ]
    },
    giving: { lifetimeValue: 0, totalGifts: 0, revenue: 0, giftCount: 0, averageGift: 0, lastGift: null },
    source: 'manual',
    createdDate: '2025-11-01'
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
    email: patronData.email || '',
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
      totalGifts: 0,
      revenue: 0,
      lastGift: null,
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
// In production, this data lives at the membership program/tier config level in Fever Zone.
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
    program: 'General Membership',
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
    autoRenewal: true,
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
      { category: 'complimentary', title: 'Welcome pack', description: 'Fonck Museum tote + exclusive goodies', usage: { used: 1, limit: 1, resetDate: null }, icon: 'fa-gift' }
    ],
    
    // Member events
    memberEvents: {
      earlyAccess: [
        { id: 1, name: 'Halloween Night Special', date: '2026-10-31', memberAccess: '2026-10-15', publicAccess: '2026-10-22', status: 'upcoming', image: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=100&h=60&fit=crop', eventUrl: 'https://feverup.com/m/166127' },
        { id: 3, name: 'Spring Gala 2026', date: '2026-04-20', memberAccess: '2026-03-01', publicAccess: '2026-03-15', status: 'unlocked', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&h=60&fit=crop', eventUrl: 'https://feverup.com/m/107418' },
        { id: 4, name: 'Summer Concert Series', date: '2026-07-04', memberAccess: '2026-06-01', publicAccess: '2026-06-15', status: 'upcoming', image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=100&h=60&fit=crop', eventUrl: 'https://feverup.com/m/107418' }
      ],
      memberOnly: [
        { id: 2, name: 'VIP Wine Tasting Evening', date: '2026-03-15', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=100&h=60&fit=crop', exclusive: true, eventUrl: 'https://feverup.com/m/164871' },
        { id: 5, name: 'Members Evening: Behind the Scenes', date: '2026-02-28', image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=100&h=60&fit=crop', exclusive: true, eventUrl: 'https://feverup.com/m/107228' },
        { id: 6, name: 'Curator Talk: Modern Art', date: '2026-03-22', image: 'https://images.unsplash.com/photo-1577083288073-40892c0860a4?w=100&h=60&fit=crop', exclusive: true, eventUrl: 'https://feverup.com/m/165333' }
      ]
    },
    
    // Membership history
    membershipHistory: [
      { date: '2023-12-02', event: 'Joined', tier: 'Silver', program: 'General Membership' },
      { date: '2024-06-15', event: 'Upgraded', tier: 'Gold', program: 'General Membership' },
      { date: '2024-12-02', event: 'Renewed', tier: 'Gold', program: 'General Membership' },
      { date: '2025-12-02', event: 'Renewed', tier: 'Gold', program: 'General Membership' }
    ],
    
    // Legacy alias for history
    history: [
      { date: '2023-12-02', event: 'Joined', tier: 'Silver', program: 'General Membership' },
      { date: '2024-06-15', event: 'Upgraded', tier: 'Gold', program: 'General Membership' },
      { date: '2024-12-02', event: 'Renewed', tier: 'Gold', program: 'General Membership' },
      { date: '2025-12-02', event: 'Renewed', tier: 'Gold', program: 'General Membership' }
    ]
  },

  // paul-fairfax Silver membership
  {
    id: 'mem-fairfax-silver',
    program: 'General Membership',
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
          image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&h=60&fit=crop',
          eventUrl: 'https://feverup.com/m/107418'
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
      { date: '2024-02-27', event: 'Joined', tier: 'Silver', program: 'General Membership' },
      { date: '2025-02-27', event: 'Renewed', tier: 'Silver', program: 'General Membership' }
    ],

    // Legacy alias for history
    history: [
      { date: '2024-02-27', event: 'Joined', tier: 'Silver', program: 'General Membership' },
      { date: '2025-02-27', event: 'Renewed', tier: 'Silver', program: 'General Membership' }
    ]
  },

  // lucas-taylor Silver membership
  {
    id: 'mem-taylor-silver',
    program: 'General Membership',
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
      { date: '2024-11-10', event: 'Joined', tier: 'Silver', program: 'General Membership' },
      { date: '2025-03-10', event: 'Renewed', tier: 'Silver', program: 'General Membership' }
    ],

    // Legacy alias for history
    history: [
      { date: '2024-11-10', event: 'Joined', tier: 'Silver', program: 'General Membership' },
      { date: '2025-03-10', event: 'Renewed', tier: 'Silver', program: 'General Membership' }
    ]
  },

  // john-martinez Gold membership
  {
    id: 'mem-martinez-gold',
    program: 'General Membership',
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
      { category: 'complimentary', title: 'Welcome pack', description: 'Fonck Museum tote + exclusive goodies', usage: { used: 1, limit: 1, resetDate: null }, icon: 'fa-gift' }
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
      { date: '2023-03-15', event: 'Joined', tier: 'Silver', program: 'General Membership' },
      { date: '2023-09-01', event: 'Upgraded', tier: 'Gold', program: 'General Membership' },
      { date: '2024-06-15', event: 'Renewed', tier: 'Gold', program: 'General Membership' },
      { date: '2025-06-15', event: 'Renewed', tier: 'Gold', program: 'General Membership' }
    ],

    // Legacy alias for history
    history: [
      { date: '2023-03-15', event: 'Joined', tier: 'Silver', program: 'General Membership' },
      { date: '2023-09-01', event: 'Upgraded', tier: 'Gold', program: 'General Membership' },
      { date: '2024-06-15', event: 'Renewed', tier: 'Gold', program: 'General Membership' },
      { date: '2025-06-15', event: 'Renewed', tier: 'Gold', program: 'General Membership' }
    ]
  },

  // ethan-davis Silver membership
  {
    id: 'mem-davis-silver',
    program: 'General Membership',
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
      { date: '2024-05-01', event: 'Joined', tier: 'Silver', program: 'General Membership' },
      { date: '2025-05-01', event: 'Renewed', tier: 'Silver', program: 'General Membership' }
    ],

    // Legacy alias for history
    history: [
      { date: '2024-05-01', event: 'Joined', tier: 'Silver', program: 'General Membership' },
      { date: '2025-05-01', event: 'Renewed', tier: 'Silver', program: 'General Membership' }
    ]
  },

  // rachel-kim Basic membership
  {
    id: 'mem-kim-basic',
    program: 'General Membership',
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
      { date: '2025-11-25', event: 'Joined', tier: 'Basic', program: 'General Membership' }
    ],

    // Legacy alias for history
    history: [
      { date: '2025-11-25', event: 'Joined', tier: 'Basic', program: 'General Membership' }
    ]
  },
  // maria-santos Silver membership
  {
    id: 'mem-santos-silver',
    program: 'General Membership',
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
      { date: '2025-10-15', event: 'Joined', tier: 'Silver', program: 'General Membership' }
    ],

    // Legacy alias for history
    history: [
      { date: '2025-10-15', event: 'Joined', tier: 'Silver', program: 'General Membership' }
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
    status: 'active',
    sortOrder: 0
  },
  {
    id: 'mb-2',
    membershipId: 'mem-anderson-gold',
    patronId: 'sarah-collingwood',
    role: 'additional_adult',
    roleLabel: 'Additional Adult',
    canManage: false,
    addedDate: '2023-12-02',
    removedDate: '2025-09-15',
    status: 'removed',
    sortOrder: 1
  },
  {
    id: 'mb-3',
    membershipId: 'mem-anderson-gold',
    patronId: 'emma-collingwood',
    role: 'dependent',
    roleLabel: 'Dependent',
    canManage: false,
    addedDate: '2024-01-15',
    removedDate: null,
    status: 'active',
    sortOrder: 2
  },
  {
    id: 'mb-4',
    membershipId: 'mem-fairfax-silver',
    patronId: 'paul-fairfax',
    role: 'primary',
    roleLabel: 'Primary Member',
    canManage: true,
    addedDate: '2024-02-27',
    status: 'active',
    sortOrder: 0
  },
  {
    id: 'mb-5',
    membershipId: 'mem-taylor-silver',
    patronId: 'lucas-taylor',
    role: 'primary',
    roleLabel: 'Primary Member',
    canManage: true,
    addedDate: '2024-11-10',
    status: 'active',
    sortOrder: 0
  },
  {
    id: 'mb-6',
    membershipId: 'mem-taylor-silver',
    patronId: 'sophia-thomas',
    role: 'additional_adult',
    roleLabel: 'Additional Adult',
    canManage: false,
    addedDate: '2024-11-10',
    status: 'active',
    sortOrder: 1
  },
  {
    id: 'mb-7',
    membershipId: 'mem-martinez-gold',
    patronId: 'john-martinez',
    role: 'primary',
    roleLabel: 'Primary Member',
    canManage: true,
    addedDate: '2023-03-15',
    status: 'active',
    sortOrder: 0
  },
  {
    id: 'mb-8',
    membershipId: 'mem-martinez-gold',
    patronId: 'samantha-carter',
    role: 'additional_adult',
    roleLabel: 'Additional Adult',
    canManage: false,
    addedDate: '2023-06-01',
    status: 'active',
    sortOrder: 1
  },
  {
    id: 'mb-9',
    membershipId: 'mem-davis-silver',
    patronId: 'ethan-davis',
    role: 'primary',
    roleLabel: 'Primary Member',
    canManage: true,
    addedDate: '2024-05-01',
    status: 'active',
    sortOrder: 0
  },
  {
    id: 'mb-10',
    membershipId: 'mem-davis-silver',
    patronId: 'olivia-brown',
    role: 'additional_adult',
    roleLabel: 'Additional Adult',
    canManage: false,
    addedDate: '2024-05-15',
    status: 'active',
    sortOrder: 1
  },
  {
    id: 'mb-11',
    membershipId: 'mem-kim-basic',
    patronId: 'rachel-kim',
    role: 'primary',
    roleLabel: 'Primary Member',
    canManage: true,
    addedDate: '2025-11-25',
    status: 'active',
    sortOrder: 0
  },
  {
    id: 'mb-12',
    membershipId: 'mem-santos-silver',
    patronId: 'maria-santos',
    role: 'primary',
    roleLabel: 'Primary Member',
    canManage: true,
    addedDate: '2025-10-15',
    status: 'active',
    sortOrder: 0
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
  // ── Anderson Collingwood (16 gifts: escalation arc from 2023 to 2026) ──────

  // 2023: First touch - joined as Silver member
  { id: 'gift-001', patronId: 'anderson-collingwood', date: '2023-12-02', amount: 89.99, type: 'membership', description: 'Silver Membership - Initial', fundId: 'annual-operating', campaignId: null, appealId: 'membership-renewal', deductible: 49.99, benefitsValue: 40.00, softCredits: [], pledgeId: null, recurringProfileId: null },

  // 2024: Escalation year - engaged more, upgraded to Gold, gave increasingly
  { id: 'gift-002', patronId: 'anderson-collingwood', date: '2024-03-15', amount: 500.00, type: 'one-time', description: 'First Annual Gift', fundId: 'annual-operating', campaignId: 'annual-2025', appealId: 'online-2025', deductible: 500.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-003', patronId: 'anderson-collingwood', date: '2024-06-20', amount: 750.00, type: 'one-time', description: 'Emergency Relief Gift', fundId: 'restricted', campaignId: 'emergency-2024', appealId: 'emergency-email', deductible: 750.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-004', patronId: 'anderson-collingwood', date: '2024-06-15', amount: 145.99, type: 'membership', description: 'Gold Membership Upgrade', fundId: 'annual-operating', campaignId: 'annual-2025', appealId: 'membership-renewal', deductible: 95.99, benefitsValue: 50.00, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-005', patronId: 'anderson-collingwood', date: '2024-10-15', amount: 1000.00, type: 'one-time', description: 'Fall Campaign Gift', fundId: 'annual-operating', campaignId: 'annual-2025', appealId: 'year-end-2025', deductible: 1000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-006', patronId: 'anderson-collingwood', date: '2024-12-18', amount: 2500.00, type: 'one-time', description: 'Year-End Major Gift', fundId: 'annual-operating', campaignId: 'annual-2025', appealId: 'year-end-2025', deductible: 2500.00, benefitsValue: 0, softCredits: [{ patronId: '999', name: 'Margaret Williams', type: 'solicitor' }], pledgeId: null, recurringProfileId: null },

  // 2025: Major commitment year - pledge, gala sponsorship, recurring sustainer
  { id: 'gift-007', patronId: 'anderson-collingwood', date: '2025-06-15', amount: 1250.00, type: 'pledge-payment', description: 'Building Campaign - Q1 Payment', fundId: 'capital-building', campaignId: 'building-future', appealId: 'leadership-gifts', deductible: 1250.00, benefitsValue: 0, softCredits: [{ patronId: '888', name: 'Robert Chen', type: 'influencer' }], pledgeId: 'pledge-001', recurringProfileId: null },
  { id: 'gift-008', patronId: 'anderson-collingwood', date: '2025-06-15', amount: 2500.00, type: 'one-time', description: 'Spring Gala Sponsorship', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'gala-sponsorship', deductible: 2100.00, benefitsValue: 400.00, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-009', patronId: 'anderson-collingwood', date: '2025-09-15', amount: 1250.00, type: 'pledge-payment', description: 'Building Campaign - Q2 Payment', fundId: 'capital-building', campaignId: 'building-future', appealId: 'leadership-gifts', deductible: 1250.00, benefitsValue: 0, softCredits: [], pledgeId: 'pledge-001', recurringProfileId: null },
  { id: 'gift-010', patronId: 'anderson-collingwood', date: '2025-11-15', amount: 100.00, type: 'recurring', description: 'Monthly Sustainer - Nov 2025', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: null, deductible: 100.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: 'rec-001' },
  { id: 'gift-011', patronId: 'anderson-collingwood', date: '2025-12-02', amount: 145.99, type: 'membership', description: 'Gold Membership Renewal', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'membership-renewal', deductible: 95.99, benefitsValue: 50.00, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-012', patronId: 'anderson-collingwood', date: '2025-12-15', amount: 100.00, type: 'recurring', description: 'Monthly Sustainer - Dec 2025', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: null, deductible: 100.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: 'rec-001' },
  { id: 'gift-013', patronId: 'anderson-collingwood', date: '2025-12-15', amount: 1250.00, type: 'pledge-payment', description: 'Building Campaign - Q3 Payment', fundId: 'capital-building', campaignId: 'building-future', appealId: 'leadership-gifts', deductible: 1250.00, benefitsValue: 0, softCredits: [], pledgeId: 'pledge-001', recurringProfileId: null },
  { id: 'gift-014', patronId: 'anderson-collingwood', date: '2025-12-20', amount: 2500.00, type: 'one-time', description: 'Year-End Major Gift', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'year-end-mailer', deductible: 2500.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },

  // 2026: Continuing momentum
  { id: 'gift-015', patronId: 'anderson-collingwood', date: '2026-01-15', amount: 100.00, type: 'recurring', description: 'Monthly Sustainer - Jan 2026', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: null, deductible: 100.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: 'rec-001' },
  { id: 'gift-016', patronId: 'anderson-collingwood', date: '2026-01-28', amount: 2500.00, type: 'one-time', description: 'New Year Major Gift', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'year-end-mailer', deductible: 2500.00, benefitsValue: 0, softCredits: [{ patronId: '999', name: 'Margaret Williams', type: 'solicitor' }], pledgeId: null, recurringProfileId: null },

  // ── Elizabeth Fairfax ──────────────────────────────────────────────────────
  { id: 'gift-017', patronId: 'elizabeth-fairfax', date: '2025-04-15', amount: 500.00, type: 'pledge-payment', description: 'Annual Fund Pledge - Q1 Payment', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'spring-gala-2025', deductible: 500.00, benefitsValue: 0, softCredits: [], pledgeId: 'pledge-002', recurringProfileId: null },
  { id: 'gift-018', patronId: 'elizabeth-fairfax', date: '2025-12-20', amount: 200.00, type: 'one-time', description: 'Year-End Online Gift', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'year-end-mailer', deductible: 200.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },

  // ── Paul Fairfax (5 gifts: unmanaged donor giving on his own) ──────────
  { id: 'gift-030', patronId: 'paul-fairfax', date: '2024-02-27', amount: 89.99, type: 'membership', description: 'Silver Membership - Initial', fundId: 'annual-operating', campaignId: null, appealId: null, deductible: 49.99, benefitsValue: 40.00, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-031', patronId: 'paul-fairfax', date: '2024-11-18', amount: 500.00, type: 'one-time', description: 'Year-End Online Gift', fundId: 'annual-operating', campaignId: 'annual-2025', appealId: 'online-2025', deductible: 500.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-032', patronId: 'paul-fairfax', date: '2025-02-27', amount: 89.99, type: 'membership', description: 'Silver Membership Renewal', fundId: 'annual-operating', campaignId: 'annual-2025', appealId: 'membership-renewal', deductible: 49.99, benefitsValue: 40.00, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-033', patronId: 'paul-fairfax', date: '2025-06-15', amount: 200.00, type: 'one-time', description: 'Spring Gala Gift', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'gala-tickets', deductible: 200.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-034', patronId: 'paul-fairfax', date: '2025-09-10', amount: 500.00, type: 'one-time', description: 'Online Gift', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'online-giving', deductible: 500.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },

  // ── Samantha Carter (7 gifts: $120K major donor, on-fire engagement) ────
  { id: 'gift-035', patronId: 'samantha-carter', date: '2025-02-05', amount: 10000.00, type: 'one-time', description: 'Annual Leadership Gift', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'online-giving', deductible: 10000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-036', patronId: 'samantha-carter', date: '2025-03-10', amount: 15000.00, type: 'one-time', description: 'Spring Gala Sponsorship', fundId: 'annual-operating', campaignId: 'spring-gala-2026', appealId: 'gala-sponsorship', deductible: 14000.00, benefitsValue: 1000.00, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-037', patronId: 'samantha-carter', date: '2025-04-18', amount: 5000.00, type: 'one-time', description: 'Education Program Gift', fundId: 'education', campaignId: 'education-2026', appealId: 'school-partnership', deductible: 5000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-038', patronId: 'samantha-carter', date: '2025-05-25', amount: 25000.00, type: 'one-time', description: 'Building Campaign Major Gift', fundId: 'capital-building', campaignId: 'building-future', appealId: 'leadership-gifts', deductible: 25000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-039', patronId: 'samantha-carter', date: '2025-07-12', amount: 20000.00, type: 'one-time', description: 'Summer Leadership Gift', fundId: 'capital-building', campaignId: 'building-future', appealId: 'capital-kickoff', deductible: 20000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-040', patronId: 'samantha-carter', date: '2025-08-28', amount: 15000.00, type: 'one-time', description: 'Exhibition Sponsorship', fundId: 'exhibitions', campaignId: 'impressionist-2026', appealId: null, deductible: 15000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-041', patronId: 'samantha-carter', date: '2025-10-15', amount: 30000.00, type: 'one-time', description: 'Year-End Major Gift', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'year-end-mailer', deductible: 30000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },

  // ── Mia Wilson (7 gifts: $80K major donor) ─────────────────────────────
  { id: 'gift-042', patronId: 'mia-wilson', date: '2025-02-05', amount: 5000.00, type: 'one-time', description: 'Annual Fund Gift', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'online-giving', deductible: 5000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-043', patronId: 'mia-wilson', date: '2025-03-12', amount: 10000.00, type: 'one-time', description: 'Spring Major Gift', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'spring-gala', deductible: 10000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-044', patronId: 'mia-wilson', date: '2025-04-28', amount: 15000.00, type: 'one-time', description: 'Building Campaign Gift', fundId: 'capital-building', campaignId: 'building-future', appealId: 'leadership-gifts', deductible: 15000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-045', patronId: 'mia-wilson', date: '2025-06-03', amount: 10000.00, type: 'one-time', description: 'Education Endowment Gift', fundId: 'education', campaignId: 'education-2026', appealId: 'school-partnership', deductible: 10000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-046', patronId: 'mia-wilson', date: '2025-07-28', amount: 15000.00, type: 'one-time', description: 'Summer Campaign Gift', fundId: 'capital-building', campaignId: 'building-future', appealId: 'capital-mailer', deductible: 15000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-047', patronId: 'mia-wilson', date: '2025-09-05', amount: 10000.00, type: 'one-time', description: 'Fall Annual Gift', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'online-giving', deductible: 10000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-048', patronId: 'mia-wilson', date: '2025-10-30', amount: 15000.00, type: 'one-time', description: 'Year-End Major Gift', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'year-end-mailer', deductible: 15000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },

  // ── James Morrison (12 gifts: $115K board member, multi-year arc) ──────
  { id: 'gift-049', patronId: 'james-morrison', date: '2021-06-15', amount: 1000.00, type: 'one-time', description: 'First Annual Gift', fundId: 'annual-operating', campaignId: null, appealId: null, deductible: 1000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-050', patronId: 'james-morrison', date: '2021-12-20', amount: 1500.00, type: 'one-time', description: 'Year-End Gift', fundId: 'annual-operating', campaignId: null, appealId: null, deductible: 1500.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-051', patronId: 'james-morrison', date: '2022-06-10', amount: 1500.00, type: 'one-time', description: 'Spring Gala Gift', fundId: 'annual-operating', campaignId: null, appealId: null, deductible: 1500.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-052', patronId: 'james-morrison', date: '2022-12-18', amount: 2000.00, type: 'one-time', description: 'Year-End Gift', fundId: 'annual-operating', campaignId: null, appealId: null, deductible: 2000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-053', patronId: 'james-morrison', date: '2023-06-15', amount: 2000.00, type: 'one-time', description: 'Annual Fund Gift', fundId: 'annual-operating', campaignId: null, appealId: null, deductible: 2000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-054', patronId: 'james-morrison', date: '2023-12-20', amount: 2000.00, type: 'one-time', description: 'Year-End Gift', fundId: 'annual-operating', campaignId: null, appealId: null, deductible: 2000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-055', patronId: 'james-morrison', date: '2024-06-12', amount: 2000.00, type: 'one-time', description: 'Board Member Annual Gift', fundId: 'annual-operating', campaignId: 'annual-2025', appealId: null, deductible: 2000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-056', patronId: 'james-morrison', date: '2024-09-15', amount: 1500.00, type: 'one-time', description: 'Fall Campaign Gift', fundId: 'annual-operating', campaignId: 'annual-2025', appealId: 'year-end-2025', deductible: 1500.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-057', patronId: 'james-morrison', date: '2024-12-18', amount: 1500.00, type: 'one-time', description: 'Year-End Gift', fundId: 'annual-operating', campaignId: 'annual-2025', appealId: 'year-end-2025', deductible: 1500.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-058', patronId: 'james-morrison', date: '2025-03-18', amount: 10000.00, type: 'one-time', description: 'Annual Leadership Gift', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'spring-gala', deductible: 10000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-059', patronId: 'james-morrison', date: '2025-06-28', amount: 15000.00, type: 'one-time', description: 'Building Campaign Gift', fundId: 'capital-building', campaignId: 'building-future', appealId: 'leadership-gifts', deductible: 15000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-060', patronId: 'james-morrison', date: '2026-01-15', amount: 75000.00, type: 'one-time', description: 'Building Campaign Major Gift', fundId: 'capital-building', campaignId: 'building-future', appealId: 'capital-kickoff', deductible: 75000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },

  // ── Eleanor Whitfield (8 gifts: $35K, long-tenured major donor) ────────
  { id: 'gift-061', patronId: 'eleanor-whitfield', date: '2022-12-15', amount: 500.00, type: 'one-time', description: 'Year-End Gift', fundId: 'annual-operating', campaignId: null, appealId: null, deductible: 500.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-062', patronId: 'eleanor-whitfield', date: '2023-06-20', amount: 1000.00, type: 'one-time', description: 'Annual Fund Gift', fundId: 'annual-operating', campaignId: null, appealId: null, deductible: 1000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-063', patronId: 'eleanor-whitfield', date: '2024-06-15', amount: 1500.00, type: 'one-time', description: 'Annual Fund Gift', fundId: 'annual-operating', campaignId: 'annual-2025', appealId: 'spring-2025', deductible: 1500.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-064', patronId: 'eleanor-whitfield', date: '2025-02-18', amount: 5000.00, type: 'one-time', description: 'Leadership Circle Gift', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'online-giving', deductible: 5000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-065', patronId: 'eleanor-whitfield', date: '2025-05-18', amount: 10000.00, type: 'one-time', description: 'Spring Gala Major Gift', fundId: 'annual-operating', campaignId: 'spring-gala-2026', appealId: 'gala-sponsorship', deductible: 9000.00, benefitsValue: 1000.00, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-066', patronId: 'eleanor-whitfield', date: '2025-08-18', amount: 5000.00, type: 'one-time', description: 'Education Program Gift', fundId: 'education', campaignId: 'education-2026', appealId: 'summer-camp', deductible: 5000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-067', patronId: 'eleanor-whitfield', date: '2025-11-25', amount: 10000.00, type: 'one-time', description: 'Year-End Major Gift', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'year-end-mailer', deductible: 10000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-068', patronId: 'eleanor-whitfield', date: '2026-01-22', amount: 2000.00, type: 'one-time', description: 'New Year Gift', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'online-giving', deductible: 2000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },

  // ── William Hartford (9 gifts: $45K, planned giving prospect) ──────────
  { id: 'gift-069', patronId: 'william-hartford', date: '2021-03-15', amount: 2000.00, type: 'one-time', description: 'First Annual Gift', fundId: 'annual-operating', campaignId: null, appealId: null, deductible: 2000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-070', patronId: 'william-hartford', date: '2022-06-15', amount: 3000.00, type: 'one-time', description: 'Annual Fund Gift', fundId: 'annual-operating', campaignId: null, appealId: null, deductible: 3000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-071', patronId: 'william-hartford', date: '2023-03-10', amount: 5000.00, type: 'one-time', description: 'Spring Major Gift', fundId: 'annual-operating', campaignId: null, appealId: null, deductible: 5000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-072', patronId: 'william-hartford', date: '2024-06-15', amount: 5000.00, type: 'one-time', description: 'Annual Leadership Gift', fundId: 'annual-operating', campaignId: 'annual-2025', appealId: 'spring-2025', deductible: 5000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-073', patronId: 'william-hartford', date: '2025-03-28', amount: 5000.00, type: 'one-time', description: 'Annual Fund Gift', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'online-giving', deductible: 5000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-074', patronId: 'william-hartford', date: '2025-06-28', amount: 5000.00, type: 'one-time', description: 'Spring Gala Sponsorship', fundId: 'annual-operating', campaignId: 'spring-gala-2026', appealId: 'gala-sponsorship', deductible: 4500.00, benefitsValue: 500.00, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-075', patronId: 'william-hartford', date: '2025-09-18', amount: 10000.00, type: 'one-time', description: 'Building Campaign Gift', fundId: 'capital-building', campaignId: 'building-future', appealId: 'leadership-gifts', deductible: 10000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-076', patronId: 'william-hartford', date: '2025-12-28', amount: 5000.00, type: 'one-time', description: 'Year-End Gift', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'year-end-mailer', deductible: 5000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-077', patronId: 'william-hartford', date: '2026-01-15', amount: 5000.00, type: 'one-time', description: 'New Year Gift', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'online-giving', deductible: 5000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },

  // ── Theodore Banks (10 gifts: $60K, long-tenured annual donor) ─────────
  { id: 'gift-078', patronId: 'theodore-banks', date: '2020-03-15', amount: 2500.00, type: 'one-time', description: 'First Annual Gift', fundId: 'annual-operating', campaignId: null, appealId: null, deductible: 2500.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-079', patronId: 'theodore-banks', date: '2020-12-18', amount: 5000.00, type: 'one-time', description: 'Year-End Gift', fundId: 'annual-operating', campaignId: null, appealId: null, deductible: 5000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-080', patronId: 'theodore-banks', date: '2021-06-15', amount: 5000.00, type: 'one-time', description: 'Annual Fund Gift', fundId: 'annual-operating', campaignId: null, appealId: null, deductible: 5000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-081', patronId: 'theodore-banks', date: '2021-12-20', amount: 5000.00, type: 'one-time', description: 'Year-End Gift', fundId: 'annual-operating', campaignId: null, appealId: null, deductible: 5000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-082', patronId: 'theodore-banks', date: '2022-06-10', amount: 5000.00, type: 'one-time', description: 'Annual Fund Gift', fundId: 'annual-operating', campaignId: null, appealId: null, deductible: 5000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-083', patronId: 'theodore-banks', date: '2023-03-15', amount: 7500.00, type: 'one-time', description: 'Spring Major Gift', fundId: 'annual-operating', campaignId: null, appealId: null, deductible: 7500.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-084', patronId: 'theodore-banks', date: '2023-12-18', amount: 7500.00, type: 'one-time', description: 'Year-End Major Gift', fundId: 'annual-operating', campaignId: null, appealId: null, deductible: 7500.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-085', patronId: 'theodore-banks', date: '2024-06-15', amount: 10000.00, type: 'one-time', description: 'Annual Leadership Gift', fundId: 'annual-operating', campaignId: 'annual-2025', appealId: 'spring-2025', deductible: 10000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-086', patronId: 'theodore-banks', date: '2025-04-18', amount: 2500.00, type: 'one-time', description: 'Annual Fund Gift', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'online-giving', deductible: 2500.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-087', patronId: 'theodore-banks', date: '2025-11-15', amount: 10000.00, type: 'one-time', description: 'Year-End Major Gift', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'year-end-mailer', deductible: 10000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },

  // ── Victoria Sterling (5 gifts: $75K, high-value donor) ────────────────
  { id: 'gift-088', patronId: 'victoria-sterling', date: '2023-06-15', amount: 5000.00, type: 'one-time', description: 'First Annual Gift', fundId: 'annual-operating', campaignId: null, appealId: null, deductible: 5000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-089', patronId: 'victoria-sterling', date: '2023-12-20', amount: 10000.00, type: 'one-time', description: 'Year-End Major Gift', fundId: 'annual-operating', campaignId: null, appealId: null, deductible: 10000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-090', patronId: 'victoria-sterling', date: '2024-06-15', amount: 10000.00, type: 'one-time', description: 'Annual Fund Major Gift', fundId: 'annual-operating', campaignId: 'annual-2025', appealId: 'spring-2025', deductible: 10000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-091', patronId: 'victoria-sterling', date: '2025-07-18', amount: 25000.00, type: 'one-time', description: 'Building Campaign Gift', fundId: 'capital-building', campaignId: 'building-future', appealId: 'leadership-gifts', deductible: 25000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-092', patronId: 'victoria-sterling', date: '2025-11-10', amount: 25000.00, type: 'one-time', description: 'Year-End Transformational Gift', fundId: 'capital-building', campaignId: 'building-future', appealId: 'capital-kickoff', deductible: 25000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },

  // ── Marcus Chen (3 gifts: $15K corporate sponsor) ──────────────────────
  { id: 'gift-093', patronId: 'marcus-chen', date: '2024-03-15', amount: 5000.00, type: 'one-time', description: 'Corporate Sponsorship', fundId: 'annual-operating', campaignId: 'annual-2025', appealId: 'spring-2025', deductible: 5000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-094', patronId: 'marcus-chen', date: '2024-12-18', amount: 5000.00, type: 'one-time', description: 'Year-End Corporate Gift', fundId: 'annual-operating', campaignId: 'annual-2025', appealId: 'year-end-2025', deductible: 5000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-095', patronId: 'marcus-chen', date: '2025-09-22', amount: 5000.00, type: 'one-time', description: 'Exhibition Sponsorship', fundId: 'exhibitions', campaignId: 'impressionist-2026', appealId: null, deductible: 5000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },

  // ── Patricia Hawthorne (2 gifts: $12K foundation grants) ───────────────
  { id: 'gift-096', patronId: 'patricia-hawthorne', date: '2023-06-15', amount: 6000.00, type: 'one-time', description: 'Hawthorne Foundation Grant - Education', fundId: 'restricted', campaignId: null, appealId: null, deductible: 6000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-097', patronId: 'patricia-hawthorne', date: '2023-12-10', amount: 6000.00, type: 'one-time', description: 'Hawthorne Foundation Grant - Operations', fundId: 'restricted', campaignId: null, appealId: null, deductible: 6000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },

  // ── Diana Rothschild (4 gifts: $8K education supporter) ────────────────
  { id: 'gift-098', patronId: 'diana-rothschild', date: '2024-06-15', amount: 1000.00, type: 'one-time', description: 'Education Program Gift', fundId: 'education', campaignId: null, appealId: null, deductible: 1000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-099', patronId: 'diana-rothschild', date: '2024-09-18', amount: 2000.00, type: 'one-time', description: 'Fall Annual Gift', fundId: 'annual-operating', campaignId: 'annual-2025', appealId: 'online-2025', deductible: 2000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-100', patronId: 'diana-rothschild', date: '2025-04-10', amount: 2000.00, type: 'one-time', description: 'Education Program Gift', fundId: 'education', campaignId: 'education-2026', appealId: 'school-partnership', deductible: 2000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-101', patronId: 'diana-rothschild', date: '2025-09-18', amount: 3000.00, type: 'one-time', description: 'Summer Camp Sponsorship', fundId: 'education', campaignId: 'education-2026', appealId: 'summer-camp', deductible: 3000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },

  // ── Ava Anderson (5 gifts: $7K engaged volunteer-donor) ────────────────
  { id: 'gift-102', patronId: 'ava-anderson', date: '2025-03-10', amount: 1000.00, type: 'one-time', description: 'Spring Gift', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'online-giving', deductible: 1000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-103', patronId: 'ava-anderson', date: '2025-05-18', amount: 2000.00, type: 'one-time', description: 'Annual Fund Gift', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'spring-gala', deductible: 2000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-104', patronId: 'ava-anderson', date: '2025-07-18', amount: 1500.00, type: 'one-time', description: 'Summer Gift', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'online-giving', deductible: 1500.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-105', patronId: 'ava-anderson', date: '2025-09-18', amount: 1000.00, type: 'one-time', description: 'Fall Gift', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'online-giving', deductible: 1000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-106', patronId: 'ava-anderson', date: '2025-11-01', amount: 1500.00, type: 'one-time', description: 'Year-End Gift', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'year-end-mailer', deductible: 1500.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },

  // ── John Martinez (4 gifts: $2K corporate quarterly donor) ─────────────
  { id: 'gift-107', patronId: 'john-martinez', date: '2025-03-28', amount: 500.00, type: 'one-time', description: 'Q1 Corporate Gift', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'online-giving', deductible: 500.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-108', patronId: 'john-martinez', date: '2025-06-28', amount: 500.00, type: 'one-time', description: 'Q2 Corporate Gift', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'spring-gala', deductible: 500.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-109', patronId: 'john-martinez', date: '2025-09-28', amount: 500.00, type: 'one-time', description: 'Q3 Corporate Gift', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'online-giving', deductible: 500.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-110', patronId: 'john-martinez', date: '2025-11-10', amount: 500.00, type: 'one-time', description: 'Q4 Corporate Gift', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'year-end-mailer', deductible: 500.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },

  // ── Margaret Chen (2 gifts: $2K prospect) ──────────────────────────────
  { id: 'gift-111', patronId: 'margaret-chen', date: '2024-08-15', amount: 1000.00, type: 'one-time', description: 'First Gift - Online', fundId: 'annual-operating', campaignId: 'annual-2025', appealId: 'online-2025', deductible: 1000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-112', patronId: 'margaret-chen', date: '2025-09-10', amount: 1000.00, type: 'one-time', description: 'Annual Fund Gift', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'online-giving', deductible: 1000.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },

  // ── Lucas Taylor (3 gifts: $1,500 regular donor) ───────────────────────
  { id: 'gift-113', patronId: 'lucas-taylor', date: '2025-05-18', amount: 500.00, type: 'one-time', description: 'Spring Gift', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'spring-gala', deductible: 500.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-114', patronId: 'lucas-taylor', date: '2025-08-28', amount: 500.00, type: 'one-time', description: 'Summer Gift', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'online-giving', deductible: 500.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-115', patronId: 'lucas-taylor', date: '2025-10-18', amount: 500.00, type: 'one-time', description: 'Fall Gift', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'online-giving', deductible: 500.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },

  // ── Olivia Brown (3 gifts: $1,200 steady donor) ────────────────────────
  { id: 'gift-116', patronId: 'olivia-brown', date: '2025-03-28', amount: 400.00, type: 'one-time', description: 'Spring Online Gift', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'online-giving', deductible: 400.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-117', patronId: 'olivia-brown', date: '2025-06-18', amount: 400.00, type: 'one-time', description: 'Spring Gala Gift', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'spring-gala', deductible: 400.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
  { id: 'gift-118', patronId: 'olivia-brown', date: '2025-09-28', amount: 400.00, type: 'one-time', description: 'Fall Gift', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'online-giving', deductible: 400.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },

  // ── Sophia Thomas (1 gift: $750) ───────────────────────────────────────
  { id: 'gift-119', patronId: 'sophia-thomas', date: '2025-09-18', amount: 750.00, type: 'one-time', description: 'Online Gift', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'online-giving', deductible: 750.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },

  // ── Ethan Davis (1 gift: $250) ─────────────────────────────────────────
  { id: 'gift-120', patronId: 'ethan-davis', date: '2025-05-25', amount: 250.00, type: 'one-time', description: 'Online Gift', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'online-giving', deductible: 250.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },

  // ── Sarah Collingwood (1 gift: $250, Anderson's spouse) ────────────────
  { id: 'gift-121', patronId: 'sarah-collingwood', date: '2024-07-20', amount: 250.00, type: 'one-time', description: 'Personal Gift', fundId: 'annual-operating', campaignId: 'annual-2025', appealId: 'online-2025', deductible: 250.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },

  // ── David Chen (1 gift: $200, online donor) ────────────────────────────
  { id: 'gift-122', patronId: 'david-chen', date: '2025-08-18', amount: 200.00, type: 'one-time', description: 'Online Gift', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'online-giving', deductible: 200.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },

  // ── Maria Santos (1 gift: $150, membership convert) ────────────────────
  { id: 'gift-123', patronId: 'maria-santos', date: '2025-12-18', amount: 150.00, type: 'one-time', description: 'Year-End Gift', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'year-end-mailer', deductible: 150.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },

  // ── Rachel Kim (1 gift: $100, recent donor) ────────────────────────────
  { id: 'gift-124', patronId: 'rachel-kim', date: '2025-12-18', amount: 100.00, type: 'one-time', description: 'Holiday Gift', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'year-end-mailer', deductible: 100.00, benefitsValue: 0, softCredits: [], pledgeId: null, recurringProfileId: null },
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
    type: giftData.type || 'one-time',
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
    balance: 1250.00,
    totalPaid: 3750.00,
    startDate: '2025-06-01',
    endDate: '2026-03-15',
    frequency: 'quarterly',
    nextPaymentDate: '2026-03-15',
    status: 'active',
    fundId: 'capital-building',
    campaignId: 'building-future',
    appealId: 'leadership-gifts',
    assignedToId: 'lj',
    notes: 'Committed at leadership dinner. Quarterly installments. 3 of 4 payments received.',
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
// RECURRING PROFILES (sustainer / monthly giving schedules)
// =============================================================================

export const RECURRING_PROFILES = [
  {
    id: 'rec-001',
    patronId: 'anderson-collingwood',
    amount: 100.00,
    frequency: 'monthly',
    startDate: '2025-10-15',
    nextDate: '2026-02-15',
    endDate: null,
    status: 'active',
    fundId: 'annual-operating',
    campaignId: 'annual-2026',
    paymentMethod: { type: 'visa', last4: '4242' },
    totalGiven: 300.00,
    giftCount: 3,
    createdDate: '2025-10-15',
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
  // gift-016 ($2,500 New Year Major Gift) split across two funds
  { id: 'alloc-001', giftId: 'gift-016', fundId: 'annual-operating', campaignId: 'annual-2026', appealId: 'year-end-mailer', amount: 1750.00 },
  { id: 'alloc-002', giftId: 'gift-016', fundId: 'education', campaignId: 'annual-2026', appealId: 'year-end-mailer', amount: 750.00 },
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
    description: 'Follow-up after recent gift',
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
      venue: 'Fonck Museum - Rooftop Terrace',
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
      location: 'The Trident, Sausalito'
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
  // Paul Fairfax interactions
  {
    id: 'int-009',
    patronId: 'paul-fairfax',
    opportunityId: null,
    type: 'ticket',
    direction: null,
    date: '2025-09-10T14:00:00',
    description: 'Online gift via website',
    details: {
      channel: 'Website',
      amount: '$500',
      campaign: '2026 Annual Fund'
    },
    amount: 500.00,
    staffId: null,
    createdDate: '2025-09-10',
  },
  {
    id: 'int-010',
    patronId: 'paul-fairfax',
    opportunityId: null,
    type: 'event',
    direction: null,
    date: '2025-07-04T18:00:00',
    description: 'Attended Summer Concert Series',
    details: {
      venue: 'Fonck Museum - Main Hall',
      guests: 1,
      ticketType: 'General Admission'
    },
    staffId: null,
    createdDate: '2025-07-04',
  },
  {
    id: 'int-011',
    patronId: 'paul-fairfax',
    opportunityId: null,
    type: 'ticket',
    direction: null,
    date: '2025-06-15T10:00:00',
    description: 'Spring Gala gift at checkout',
    details: {
      channel: 'Ticket checkout add-on',
      amount: '$200',
      campaign: '2026 Annual Fund'
    },
    amount: 200.00,
    staffId: null,
    createdDate: '2025-06-15',
  },
  {
    id: 'int-012',
    patronId: 'paul-fairfax',
    opportunityId: null,
    type: 'event',
    direction: null,
    date: '2025-03-22T19:30:00',
    description: 'Attended Curator Talk: Impressionist Masters',
    details: {
      venue: 'Fonck Museum - Lecture Hall',
      guests: 2,
      ticketType: 'Member Access'
    },
    staffId: null,
    createdDate: '2025-03-22',
  },
  {
    id: 'int-013',
    patronId: 'paul-fairfax',
    opportunityId: null,
    type: 'ticket',
    direction: null,
    date: '2025-02-27T09:00:00',
    description: 'Silver membership renewal',
    details: {
      membershipTier: 'Silver',
      amount: '$89.99',
      autoRenewal: false
    },
    amount: 89.99,
    staffId: null,
    createdDate: '2025-02-27',
  },
  {
    id: 'int-014',
    patronId: 'paul-fairfax',
    opportunityId: null,
    type: 'ticket',
    direction: null,
    date: '2024-11-18T12:00:00',
    description: 'Year-end online gift',
    details: {
      channel: 'Website',
      amount: '$500',
      campaign: '2025 Annual Fund'
    },
    amount: 500.00,
    staffId: null,
    createdDate: '2024-11-18',
  },

  // ============================================
  // TICKET / EVENT PURCHASE INTERACTIONS
  // Auto-created from Fever ticketing transactions
  // ============================================

  // --- James Morrison (Major Donor) ---
  { id: 'int-015', patronId: 'james-morrison', opportunityId: null, type: 'ticket', direction: null, date: '2025-02-14T19:00:00', description: 'Purchased Valentine Art Night tickets', details: { event: 'Valentine Art Night', quantity: 4, ticketType: 'VIP Table' }, amount: 750, staffId: null, createdDate: '2025-02-14' },
  { id: 'int-016', patronId: 'james-morrison', opportunityId: null, type: 'ticket', direction: null, date: '2025-03-08T18:30:00', description: 'Purchased Spring Gala 2025 tickets', details: { event: 'Spring Gala 2025', quantity: 4, ticketType: 'VIP Table' }, amount: 850, staffId: null, createdDate: '2025-03-08' },
  { id: 'int-017', patronId: 'james-morrison', opportunityId: null, type: 'ticket', direction: null, date: '2025-04-05T18:00:00', description: 'Purchased Impressionist Masters Opening Night tickets', details: { event: 'Impressionist Masters Opening Night', quantity: 4, ticketType: 'Patron Circle' }, amount: 600, staffId: null, createdDate: '2025-04-05' },
  { id: 'int-018', patronId: 'james-morrison', opportunityId: null, type: 'ticket', direction: null, date: '2025-05-10T19:00:00', description: 'Purchased Wine and Art Evening tickets', details: { event: 'Wine and Art Evening', quantity: 6, ticketType: 'VIP Table' }, amount: 900, staffId: null, createdDate: '2025-05-10' },
  { id: 'int-019', patronId: 'james-morrison', opportunityId: null, type: 'ticket', direction: null, date: '2025-06-07T18:00:00', description: 'Purchased Summer Exhibition Opening Gala tickets', details: { event: 'Summer Exhibition Opening Gala', quantity: 8, ticketType: 'Sponsor Package' }, amount: 1200, staffId: null, createdDate: '2025-06-07' },
  { id: 'int-020', patronId: 'james-morrison', opportunityId: null, type: 'ticket', direction: null, date: '2025-07-04T19:30:00', description: 'Purchased Summer Concert Series tickets', details: { event: 'Summer Concert Series', quantity: 4, ticketType: 'Premium Reserved' }, amount: 800, staffId: null, createdDate: '2025-07-04' },
  { id: 'int-021', patronId: 'james-morrison', opportunityId: null, type: 'ticket', direction: null, date: '2025-08-02T18:00:00', description: 'Purchased Summer Concert VIP Reception tickets', details: { event: 'Summer Concert VIP Reception', quantity: 6, ticketType: 'VIP Table' }, amount: 950, staffId: null, createdDate: '2025-08-02' },
  { id: 'int-022', patronId: 'james-morrison', opportunityId: null, type: 'ticket', direction: null, date: '2025-09-06T18:30:00', description: 'Purchased Fall Exhibition Opening tickets', details: { event: 'Fall Exhibition: Emerging Artists', quantity: 6, ticketType: 'Sponsor Package' }, amount: 1100, staffId: null, createdDate: '2025-09-06' },
  { id: 'int-023', patronId: 'james-morrison', opportunityId: null, type: 'ticket', direction: null, date: '2025-10-04T18:00:00', description: 'Purchased Impressionist Masters Evening Tour tickets', details: { event: 'Impressionist Masters Evening Tour', quantity: 4, ticketType: 'VIP Tour Package' }, amount: 900, staffId: null, createdDate: '2025-10-04' },
  { id: 'int-024', patronId: 'james-morrison', opportunityId: null, type: 'ticket', direction: null, date: '2025-11-08T18:30:00', description: 'Purchased Annual Benefit Dinner tickets', details: { event: 'Annual Benefit Dinner', quantity: 4, ticketType: 'VIP Table' }, amount: 850, staffId: null, createdDate: '2025-11-08' },
  { id: 'int-025', patronId: 'james-morrison', opportunityId: null, type: 'ticket', direction: null, date: '2025-12-06T18:00:00', description: 'Purchased Holiday Spectacular tickets', details: { event: 'Holiday Spectacular', quantity: 6, ticketType: 'Patron Circle' }, amount: 1100, staffId: null, createdDate: '2025-12-06' },

  // --- Eleanor Whitfield (Major Donor) ---
  { id: 'int-026', patronId: 'eleanor-whitfield', opportunityId: null, type: 'ticket', direction: null, date: '2025-02-14T19:00:00', description: 'Purchased Valentine Art Night tickets', details: { event: 'Valentine Art Night', quantity: 4, ticketType: 'VIP Table' }, amount: 800, staffId: null, createdDate: '2025-02-14' },
  { id: 'int-027', patronId: 'eleanor-whitfield', opportunityId: null, type: 'ticket', direction: null, date: '2025-03-22T14:00:00', description: 'Purchased Photography Exhibition tickets', details: { event: 'Photography Exhibition: Urban Landscapes', quantity: 4, ticketType: 'Patron Circle' }, amount: 750, staffId: null, createdDate: '2025-03-22' },
  { id: 'int-028', patronId: 'eleanor-whitfield', opportunityId: null, type: 'ticket', direction: null, date: '2025-04-19T14:00:00', description: 'Purchased Curator Talk tickets', details: { event: 'Curator Talk: Modern Sculpture', quantity: 2, ticketType: 'Premium' }, amount: 120, staffId: null, createdDate: '2025-04-19' },
  { id: 'int-029', patronId: 'eleanor-whitfield', opportunityId: null, type: 'ticket', direction: null, date: '2025-05-10T19:00:00', description: 'Purchased Wine and Art Evening tickets', details: { event: 'Wine and Art Evening', quantity: 4, ticketType: 'VIP Table' }, amount: 800, staffId: null, createdDate: '2025-05-10' },
  { id: 'int-030', patronId: 'eleanor-whitfield', opportunityId: null, type: 'ticket', direction: null, date: '2025-06-21T14:00:00', description: 'Purchased Architecture Lecture tickets', details: { event: 'Architecture and Design Lecture', quantity: 2, ticketType: 'Reserved' }, amount: 85, staffId: null, createdDate: '2025-06-21' },
  { id: 'int-031', patronId: 'eleanor-whitfield', opportunityId: null, type: 'ticket', direction: null, date: '2025-07-04T19:30:00', description: 'Purchased Summer Concert Series tickets', details: { event: 'Summer Concert Series', quantity: 4, ticketType: 'VIP Table' }, amount: 750, staffId: null, createdDate: '2025-07-04' },
  { id: 'int-032', patronId: 'eleanor-whitfield', opportunityId: null, type: 'ticket', direction: null, date: '2025-08-02T18:00:00', description: 'Purchased Summer Concert VIP Reception tickets', details: { event: 'Summer Concert VIP Reception', quantity: 4, ticketType: 'Patron Circle' }, amount: 800, staffId: null, createdDate: '2025-08-02' },
  { id: 'int-033', patronId: 'eleanor-whitfield', opportunityId: null, type: 'ticket', direction: null, date: '2025-09-20T14:00:00', description: 'Purchased Curator Talk tickets', details: { event: 'Curator Talk: Impressionist Masters', quantity: 4, ticketType: 'VIP Reception' }, amount: 750, staffId: null, createdDate: '2025-09-20' },
  { id: 'int-034', patronId: 'eleanor-whitfield', opportunityId: null, type: 'ticket', direction: null, date: '2025-10-18T18:00:00', description: 'Purchased Wine and Cheese Gallery Hours tickets', details: { event: 'Wine and Cheese: Gallery After Hours', quantity: 2, ticketType: 'Premium' }, amount: 200, staffId: null, createdDate: '2025-10-18' },
  { id: 'int-035', patronId: 'eleanor-whitfield', opportunityId: null, type: 'ticket', direction: null, date: '2025-11-08T18:30:00', description: 'Purchased Annual Benefit Dinner tickets', details: { event: 'Annual Benefit Dinner', quantity: 4, ticketType: 'VIP Table' }, amount: 800, staffId: null, createdDate: '2025-11-08' },
  { id: 'int-036', patronId: 'eleanor-whitfield', opportunityId: null, type: 'ticket', direction: null, date: '2025-12-06T18:00:00', description: 'Purchased Holiday Spectacular tickets', details: { event: 'Holiday Spectacular', quantity: 4, ticketType: 'Patron Circle' }, amount: 850, staffId: null, createdDate: '2025-12-06' },
  { id: 'int-037', patronId: 'eleanor-whitfield', opportunityId: null, type: 'ticket', direction: null, date: '2026-01-10T18:00:00', description: 'Purchased Winter Exhibition Opening tickets', details: { event: 'Winter Exhibition: Light and Shadow', quantity: 4, ticketType: 'VIP Preview' }, amount: 795, staffId: null, createdDate: '2026-01-10' },

  // --- William Hartford (Major Donor) ---
  { id: 'int-038', patronId: 'william-hartford', opportunityId: null, type: 'ticket', direction: null, date: '2025-02-22T18:00:00', description: 'Purchased Photography Exhibition tickets', details: { event: 'Photography Exhibition: Urban Landscapes', quantity: 4, ticketType: 'VIP Table' }, amount: 550, staffId: null, createdDate: '2025-02-22' },
  { id: 'int-039', patronId: 'william-hartford', opportunityId: null, type: 'ticket', direction: null, date: '2025-03-08T18:30:00', description: 'Purchased Spring Gala 2025 tickets', details: { event: 'Spring Gala 2025', quantity: 4, ticketType: 'VIP Table' }, amount: 600, staffId: null, createdDate: '2025-03-08' },
  { id: 'int-040', patronId: 'william-hartford', opportunityId: null, type: 'ticket', direction: null, date: '2025-04-05T18:00:00', description: 'Purchased Impressionist Masters Opening tickets', details: { event: 'Impressionist Masters Opening Night', quantity: 4, ticketType: 'Patron Circle' }, amount: 550, staffId: null, createdDate: '2025-04-05' },
  { id: 'int-041', patronId: 'william-hartford', opportunityId: null, type: 'ticket', direction: null, date: '2025-05-10T19:00:00', description: 'Purchased Wine and Art Evening tickets', details: { event: 'Wine and Art Evening', quantity: 4, ticketType: 'VIP Table' }, amount: 600, staffId: null, createdDate: '2025-05-10' },
  { id: 'int-042', patronId: 'william-hartford', opportunityId: null, type: 'ticket', direction: null, date: '2025-06-07T18:00:00', description: 'Purchased Summer Exhibition Opening tickets', details: { event: 'Summer Exhibition: Contemporary Voices', quantity: 4, ticketType: 'VIP Table' }, amount: 650, staffId: null, createdDate: '2025-06-07' },
  { id: 'int-043', patronId: 'william-hartford', opportunityId: null, type: 'ticket', direction: null, date: '2025-07-04T19:30:00', description: 'Purchased Summer Concert Series tickets', details: { event: 'Summer Concert Series', quantity: 4, ticketType: 'Premium Reserved' }, amount: 550, staffId: null, createdDate: '2025-07-04' },
  { id: 'int-044', patronId: 'william-hartford', opportunityId: null, type: 'ticket', direction: null, date: '2025-08-16T14:00:00', description: 'Purchased Photography Workshop tickets', details: { event: 'Photography Workshop and Exhibition Tour', quantity: 4, ticketType: 'VIP Table' }, amount: 550, staffId: null, createdDate: '2025-08-16' },
  { id: 'int-045', patronId: 'william-hartford', opportunityId: null, type: 'ticket', direction: null, date: '2025-09-06T18:30:00', description: 'Purchased Fall Exhibition Opening tickets', details: { event: 'Fall Exhibition: Emerging Artists', quantity: 4, ticketType: 'VIP Table' }, amount: 600, staffId: null, createdDate: '2025-09-06' },
  { id: 'int-046', patronId: 'william-hartford', opportunityId: null, type: 'ticket', direction: null, date: '2025-10-04T18:00:00', description: 'Purchased Impressionist Masters Evening Tour tickets', details: { event: 'Impressionist Masters Evening Tour', quantity: 4, ticketType: 'VIP Tour Package' }, amount: 600, staffId: null, createdDate: '2025-10-04' },
  { id: 'int-047', patronId: 'william-hartford', opportunityId: null, type: 'ticket', direction: null, date: '2025-11-08T18:30:00', description: 'Purchased Annual Benefit Dinner tickets', details: { event: 'Annual Benefit Dinner', quantity: 4, ticketType: 'VIP Table' }, amount: 550, staffId: null, createdDate: '2025-11-08' },
  { id: 'int-048', patronId: 'william-hartford', opportunityId: null, type: 'ticket', direction: null, date: '2025-12-06T18:00:00', description: 'Purchased Holiday Spectacular tickets', details: { event: 'Holiday Spectacular', quantity: 4, ticketType: 'VIP Table' }, amount: 600, staffId: null, createdDate: '2025-12-06' },
  { id: 'int-049', patronId: 'william-hartford', opportunityId: null, type: 'ticket', direction: null, date: '2026-01-10T18:00:00', description: 'Purchased Winter Exhibition Opening tickets', details: { event: 'Winter Exhibition: Light and Shadow', quantity: 4, ticketType: 'VIP Preview' }, amount: 600, staffId: null, createdDate: '2026-01-10' },

  // --- Theodore Banks (Major Donor) ---
  { id: 'int-050', patronId: 'theodore-banks', opportunityId: null, type: 'ticket', direction: null, date: '2025-02-14T19:00:00', description: 'Purchased Valentine Art Night tickets', details: { event: 'Valentine Art Night', quantity: 4, ticketType: 'VIP Table' }, amount: 500, staffId: null, createdDate: '2025-02-14' },
  { id: 'int-051', patronId: 'theodore-banks', opportunityId: null, type: 'ticket', direction: null, date: '2025-03-08T18:30:00', description: 'Purchased Spring Gala tickets', details: { event: 'Spring Gala 2025', quantity: 4, ticketType: 'Patron Circle' }, amount: 550, staffId: null, createdDate: '2025-03-08' },
  { id: 'int-052', patronId: 'theodore-banks', opportunityId: null, type: 'ticket', direction: null, date: '2025-04-05T18:00:00', description: 'Purchased Impressionist Masters Opening tickets', details: { event: 'Impressionist Masters Opening Night', quantity: 4, ticketType: 'Patron Circle' }, amount: 500, staffId: null, createdDate: '2025-04-05' },
  { id: 'int-053', patronId: 'theodore-banks', opportunityId: null, type: 'ticket', direction: null, date: '2025-05-10T19:00:00', description: 'Purchased Wine and Art Evening tickets', details: { event: 'Wine and Art Evening', quantity: 4, ticketType: 'VIP Table' }, amount: 550, staffId: null, createdDate: '2025-05-10' },
  { id: 'int-054', patronId: 'theodore-banks', opportunityId: null, type: 'ticket', direction: null, date: '2025-06-07T18:00:00', description: 'Purchased Summer Exhibition Opening tickets', details: { event: 'Summer Exhibition: Contemporary Voices', quantity: 4, ticketType: 'VIP Table' }, amount: 550, staffId: null, createdDate: '2025-06-07' },
  { id: 'int-055', patronId: 'theodore-banks', opportunityId: null, type: 'ticket', direction: null, date: '2025-07-04T19:30:00', description: 'Purchased Summer Concert Series tickets', details: { event: 'Summer Concert Series', quantity: 4, ticketType: 'Premium Reserved' }, amount: 500, staffId: null, createdDate: '2025-07-04' },
  { id: 'int-056', patronId: 'theodore-banks', opportunityId: null, type: 'ticket', direction: null, date: '2025-08-02T18:00:00', description: 'Purchased Summer Concert VIP Reception tickets', details: { event: 'Summer Concert VIP Reception', quantity: 4, ticketType: 'VIP Table' }, amount: 550, staffId: null, createdDate: '2025-08-02' },
  { id: 'int-057', patronId: 'theodore-banks', opportunityId: null, type: 'ticket', direction: null, date: '2025-09-20T14:00:00', description: 'Purchased Curator Talk tickets', details: { event: 'Curator Talk: Impressionist Masters', quantity: 2, ticketType: 'Reserved' }, amount: 75, staffId: null, createdDate: '2025-09-20' },
  { id: 'int-058', patronId: 'theodore-banks', opportunityId: null, type: 'ticket', direction: null, date: '2025-10-04T18:00:00', description: 'Purchased Impressionist Masters Evening Tour tickets', details: { event: 'Impressionist Masters Evening Tour', quantity: 4, ticketType: 'VIP Tour Package' }, amount: 575, staffId: null, createdDate: '2025-10-04' },
  { id: 'int-059', patronId: 'theodore-banks', opportunityId: null, type: 'ticket', direction: null, date: '2025-11-08T18:30:00', description: 'Purchased Annual Benefit Dinner tickets', details: { event: 'Annual Benefit Dinner', quantity: 4, ticketType: 'VIP Table' }, amount: 650, staffId: null, createdDate: '2025-11-08' },

  // --- Samantha Carter (Major Donor) ---
  { id: 'int-060', patronId: 'samantha-carter', opportunityId: null, type: 'ticket', direction: null, date: '2025-02-14T19:00:00', description: 'Purchased Valentine Art Night tickets', details: { event: 'Valentine Art Night', quantity: 4, ticketType: 'VIP Table' }, amount: 625, staffId: null, createdDate: '2025-02-14' },
  { id: 'int-061', patronId: 'samantha-carter', opportunityId: null, type: 'ticket', direction: null, date: '2025-03-08T18:30:00', description: 'Purchased Spring Gala tickets', details: { event: 'Spring Gala 2025', quantity: 4, ticketType: 'Patron Circle' }, amount: 589, staffId: null, createdDate: '2025-03-08' },
  { id: 'int-062', patronId: 'samantha-carter', opportunityId: null, type: 'ticket', direction: null, date: '2025-04-05T18:00:00', description: 'Purchased Impressionist Masters Opening tickets', details: { event: 'Impressionist Masters Opening Night', quantity: 4, ticketType: 'VIP Table' }, amount: 550, staffId: null, createdDate: '2025-04-05' },
  { id: 'int-063', patronId: 'samantha-carter', opportunityId: null, type: 'ticket', direction: null, date: '2025-05-10T19:00:00', description: 'Purchased Wine and Art Evening tickets', details: { event: 'Wine and Art Evening', quantity: 6, ticketType: 'VIP Table' }, amount: 656, staffId: null, createdDate: '2025-05-10' },
  { id: 'int-064', patronId: 'samantha-carter', opportunityId: null, type: 'ticket', direction: null, date: '2025-06-07T18:00:00', description: 'Purchased Summer Exhibition Opening tickets', details: { event: 'Summer Exhibition: Contemporary Voices', quantity: 4, ticketType: 'Patron Circle' }, amount: 478, staffId: null, createdDate: '2025-06-07' },
  { id: 'int-065', patronId: 'samantha-carter', opportunityId: null, type: 'ticket', direction: null, date: '2025-07-04T19:30:00', description: 'Purchased Summer Concert Series tickets', details: { event: 'Summer Concert Series', quantity: 4, ticketType: 'VIP Table' }, amount: 475, staffId: null, createdDate: '2025-07-04' },
  { id: 'int-066', patronId: 'samantha-carter', opportunityId: null, type: 'ticket', direction: null, date: '2025-08-02T18:00:00', description: 'Purchased Summer Concert VIP Reception tickets', details: { event: 'Summer Concert VIP Reception', quantity: 4, ticketType: 'VIP Table' }, amount: 462, staffId: null, createdDate: '2025-08-02' },
  { id: 'int-067', patronId: 'samantha-carter', opportunityId: null, type: 'ticket', direction: null, date: '2025-09-06T18:30:00', description: 'Purchased Fall Exhibition Opening tickets', details: { event: 'Fall Exhibition: Emerging Artists', quantity: 4, ticketType: 'Patron Circle' }, amount: 465, staffId: null, createdDate: '2025-09-06' },
  { id: 'int-068', patronId: 'samantha-carter', opportunityId: null, type: 'ticket', direction: null, date: '2025-10-04T18:00:00', description: 'Purchased Impressionist Masters Evening Tour tickets', details: { event: 'Impressionist Masters Evening Tour', quantity: 4, ticketType: 'VIP Tour Package' }, amount: 600, staffId: null, createdDate: '2025-10-04' },

  // --- Mia Wilson (Major Donor) ---
  { id: 'int-069', patronId: 'mia-wilson', opportunityId: null, type: 'ticket', direction: null, date: '2025-02-14T19:00:00', description: 'Purchased Valentine Art Night tickets', details: { event: 'Valentine Art Night', quantity: 4, ticketType: 'VIP Table' }, amount: 545, staffId: null, createdDate: '2025-02-14' },
  { id: 'int-070', patronId: 'mia-wilson', opportunityId: null, type: 'ticket', direction: null, date: '2025-03-22T14:00:00', description: 'Purchased Curator Talk tickets', details: { event: 'Curator Talk: Renaissance to Modern', quantity: 4, ticketType: 'VIP Reception' }, amount: 550, staffId: null, createdDate: '2025-03-22' },
  { id: 'int-071', patronId: 'mia-wilson', opportunityId: null, type: 'ticket', direction: null, date: '2025-04-05T18:00:00', description: 'Purchased Impressionist Masters Opening tickets', details: { event: 'Impressionist Masters Opening Night', quantity: 4, ticketType: 'VIP Table' }, amount: 595, staffId: null, createdDate: '2025-04-05' },
  { id: 'int-072', patronId: 'mia-wilson', opportunityId: null, type: 'ticket', direction: null, date: '2025-05-24T10:00:00', description: 'Purchased Family Day Art Workshop tickets', details: { event: 'Family Day: Interactive Art Workshop', quantity: 4, ticketType: 'VIP Table' }, amount: 528, staffId: null, createdDate: '2025-05-24' },
  { id: 'int-073', patronId: 'mia-wilson', opportunityId: null, type: 'ticket', direction: null, date: '2025-06-07T18:00:00', description: 'Purchased Summer Exhibition Opening tickets', details: { event: 'Summer Exhibition: Contemporary Voices', quantity: 4, ticketType: 'VIP Table' }, amount: 550, staffId: null, createdDate: '2025-06-07' },
  { id: 'int-074', patronId: 'mia-wilson', opportunityId: null, type: 'ticket', direction: null, date: '2025-07-04T19:30:00', description: 'Purchased Summer Concert Series tickets', details: { event: 'Summer Concert Series', quantity: 4, ticketType: 'Patron Circle' }, amount: 562, staffId: null, createdDate: '2025-07-04' },
  { id: 'int-075', patronId: 'mia-wilson', opportunityId: null, type: 'ticket', direction: null, date: '2025-08-02T18:00:00', description: 'Purchased Summer Concert VIP Reception tickets', details: { event: 'Summer Concert VIP Reception', quantity: 4, ticketType: 'VIP Table' }, amount: 565, staffId: null, createdDate: '2025-08-02' },
  { id: 'int-076', patronId: 'mia-wilson', opportunityId: null, type: 'ticket', direction: null, date: '2025-09-06T18:30:00', description: 'Purchased Fall Exhibition Opening tickets', details: { event: 'Fall Exhibition: Emerging Artists', quantity: 4, ticketType: 'VIP Table' }, amount: 550, staffId: null, createdDate: '2025-09-06' },
  { id: 'int-077', patronId: 'mia-wilson', opportunityId: null, type: 'ticket', direction: null, date: '2025-10-18T18:00:00', description: 'Purchased Wine and Cheese Gallery Hours tickets', details: { event: 'Wine and Cheese: Gallery After Hours', quantity: 4, ticketType: 'VIP Table' }, amount: 555, staffId: null, createdDate: '2025-10-18' },

  // --- Victoria Sterling (Major Donor) ---
  { id: 'int-078', patronId: 'victoria-sterling', opportunityId: null, type: 'ticket', direction: null, date: '2025-04-19T14:00:00', description: 'Purchased Members Preview Night tickets', details: { event: 'Members Preview: New Acquisitions', quantity: 2, ticketType: 'Patron Circle' }, amount: 300, staffId: null, createdDate: '2025-04-19' },
  { id: 'int-079', patronId: 'victoria-sterling', opportunityId: null, type: 'ticket', direction: null, date: '2025-05-10T19:00:00', description: 'Purchased Wine and Art Evening tickets', details: { event: 'Wine and Art Evening', quantity: 2, ticketType: 'Patron Circle' }, amount: 300, staffId: null, createdDate: '2025-05-10' },
  { id: 'int-080', patronId: 'victoria-sterling', opportunityId: null, type: 'ticket', direction: null, date: '2025-07-04T19:30:00', description: 'Purchased Summer Concert Series tickets', details: { event: 'Summer Concert Series', quantity: 4, ticketType: 'VIP Table' }, amount: 400, staffId: null, createdDate: '2025-07-04' },
  { id: 'int-081', patronId: 'victoria-sterling', opportunityId: null, type: 'ticket', direction: null, date: '2025-08-16T14:00:00', description: 'Purchased Photography Workshop tickets', details: { event: 'Photography Workshop and Exhibition Tour', quantity: 2, ticketType: 'Premium' }, amount: 300, staffId: null, createdDate: '2025-08-16' },
  { id: 'int-082', patronId: 'victoria-sterling', opportunityId: null, type: 'ticket', direction: null, date: '2025-09-06T18:30:00', description: 'Purchased Fall Exhibition Opening tickets', details: { event: 'Fall Exhibition: Emerging Artists', quantity: 4, ticketType: 'VIP Table' }, amount: 600, staffId: null, createdDate: '2025-09-06' },
  { id: 'int-083', patronId: 'victoria-sterling', opportunityId: null, type: 'ticket', direction: null, date: '2025-10-04T18:00:00', description: 'Purchased Impressionist Masters Evening Tour tickets', details: { event: 'Impressionist Masters Evening Tour', quantity: 2, ticketType: 'VIP Tour Package' }, amount: 300, staffId: null, createdDate: '2025-10-04' },
  { id: 'int-084', patronId: 'victoria-sterling', opportunityId: null, type: 'ticket', direction: null, date: '2025-11-08T18:30:00', description: 'Purchased Annual Benefit Dinner tickets', details: { event: 'Annual Benefit Dinner', quantity: 2, ticketType: 'VIP Table' }, amount: 400, staffId: null, createdDate: '2025-11-08' },
  { id: 'int-085', patronId: 'victoria-sterling', opportunityId: null, type: 'ticket', direction: null, date: '2025-12-06T18:00:00', description: 'Purchased Holiday Spectacular tickets', details: { event: 'Holiday Spectacular', quantity: 2, ticketType: 'Patron Circle' }, amount: 400, staffId: null, createdDate: '2025-12-06' },

  // --- Marcus Chen (Mid-tier) ---
  { id: 'int-086', patronId: 'marcus-chen', opportunityId: null, type: 'ticket', direction: null, date: '2025-02-14T19:00:00', description: 'Purchased Valentine Art Night tickets', details: { event: 'Valentine Art Night', quantity: 2, ticketType: 'Premium' }, amount: 250, staffId: null, createdDate: '2025-02-14' },
  { id: 'int-087', patronId: 'marcus-chen', opportunityId: null, type: 'ticket', direction: null, date: '2025-03-08T18:30:00', description: 'Purchased Spring Gala tickets', details: { event: 'Spring Gala 2025', quantity: 2, ticketType: 'Reserved' }, amount: 250, staffId: null, createdDate: '2025-03-08' },
  { id: 'int-088', patronId: 'marcus-chen', opportunityId: null, type: 'ticket', direction: null, date: '2025-04-05T18:00:00', description: 'Purchased Impressionist Masters Opening tickets', details: { event: 'Impressionist Masters Opening Night', quantity: 2, ticketType: 'Premium' }, amount: 250, staffId: null, createdDate: '2025-04-05' },
  { id: 'int-089', patronId: 'marcus-chen', opportunityId: null, type: 'ticket', direction: null, date: '2025-05-10T19:00:00', description: 'Purchased Wine and Art Evening tickets', details: { event: 'Wine and Art Evening', quantity: 2, ticketType: 'Premium' }, amount: 250, staffId: null, createdDate: '2025-05-10' },
  { id: 'int-090', patronId: 'marcus-chen', opportunityId: null, type: 'ticket', direction: null, date: '2025-06-07T18:00:00', description: 'Purchased Summer Exhibition Opening tickets', details: { event: 'Summer Exhibition: Contemporary Voices', quantity: 2, ticketType: 'Reserved' }, amount: 250, staffId: null, createdDate: '2025-06-07' },
  { id: 'int-091', patronId: 'marcus-chen', opportunityId: null, type: 'ticket', direction: null, date: '2025-07-04T19:30:00', description: 'Purchased Summer Concert Series tickets', details: { event: 'Summer Concert Series', quantity: 2, ticketType: 'Premium' }, amount: 250, staffId: null, createdDate: '2025-07-04' },
  { id: 'int-092', patronId: 'marcus-chen', opportunityId: null, type: 'ticket', direction: null, date: '2025-08-02T18:00:00', description: 'Purchased Summer Concert VIP Reception tickets', details: { event: 'Summer Concert VIP Reception', quantity: 4, ticketType: 'Reserved' }, amount: 500, staffId: null, createdDate: '2025-08-02' },
  { id: 'int-093', patronId: 'marcus-chen', opportunityId: null, type: 'ticket', direction: null, date: '2025-09-06T18:30:00', description: 'Purchased Fall Exhibition Opening tickets', details: { event: 'Fall Exhibition: Emerging Artists', quantity: 2, ticketType: 'Premium' }, amount: 250, staffId: null, createdDate: '2025-09-06' },
  { id: 'int-094', patronId: 'marcus-chen', opportunityId: null, type: 'ticket', direction: null, date: '2025-10-04T18:00:00', description: 'Purchased Impressionist Masters Evening Tour tickets', details: { event: 'Impressionist Masters Evening Tour', quantity: 2, ticketType: 'Premium' }, amount: 250, staffId: null, createdDate: '2025-10-04' },
  { id: 'int-095', patronId: 'marcus-chen', opportunityId: null, type: 'ticket', direction: null, date: '2025-11-08T18:30:00', description: 'Purchased Annual Benefit Dinner tickets', details: { event: 'Annual Benefit Dinner', quantity: 2, ticketType: 'Reserved' }, amount: 250, staffId: null, createdDate: '2025-11-08' },
  { id: 'int-096', patronId: 'marcus-chen', opportunityId: null, type: 'ticket', direction: null, date: '2025-12-06T18:00:00', description: 'Purchased Holiday Spectacular tickets', details: { event: 'Holiday Spectacular', quantity: 2, ticketType: 'Premium' }, amount: 250, staffId: null, createdDate: '2025-12-06' },

  // --- Anderson Collingwood (Mid-tier, already has int-007 for Mar) ---
  { id: 'int-097', patronId: 'anderson-collingwood', opportunityId: null, type: 'ticket', direction: null, date: '2025-02-14T19:00:00', description: 'Purchased Valentine Art Night tickets', details: { event: 'Valentine Art Night', quantity: 2, ticketType: 'Premium' }, amount: 235, staffId: null, createdDate: '2025-02-14' },
  { id: 'int-098', patronId: 'anderson-collingwood', opportunityId: null, type: 'ticket', direction: null, date: '2025-04-05T18:00:00', description: 'Purchased Impressionist Masters Opening tickets', details: { event: 'Impressionist Masters Opening Night', quantity: 2, ticketType: 'Member Plus' }, amount: 250, staffId: null, createdDate: '2025-04-05' },
  { id: 'int-099', patronId: 'anderson-collingwood', opportunityId: null, type: 'ticket', direction: null, date: '2025-05-10T19:00:00', description: 'Purchased Wine and Art Evening tickets', details: { event: 'Wine and Art Evening', quantity: 2, ticketType: 'Premium' }, amount: 228, staffId: null, createdDate: '2025-05-10' },
  { id: 'int-100', patronId: 'anderson-collingwood', opportunityId: null, type: 'ticket', direction: null, date: '2025-06-07T18:00:00', description: 'Purchased Summer Exhibition Opening tickets', details: { event: 'Summer Exhibition: Contemporary Voices', quantity: 2, ticketType: 'Member Plus' }, amount: 175, staffId: null, createdDate: '2025-06-07' },
  { id: 'int-101', patronId: 'anderson-collingwood', opportunityId: null, type: 'ticket', direction: null, date: '2025-07-04T19:30:00', description: 'Purchased Summer Concert Series tickets', details: { event: 'Summer Concert Series', quantity: 2, ticketType: 'Premium' }, amount: 250, staffId: null, createdDate: '2025-07-04' },
  { id: 'int-102', patronId: 'anderson-collingwood', opportunityId: null, type: 'ticket', direction: null, date: '2025-08-02T18:00:00', description: 'Purchased Summer Concert VIP Reception tickets', details: { event: 'Summer Concert VIP Reception', quantity: 2, ticketType: 'Reserved' }, amount: 300, staffId: null, createdDate: '2025-08-02' },
  { id: 'int-103', patronId: 'anderson-collingwood', opportunityId: null, type: 'ticket', direction: null, date: '2025-09-06T18:30:00', description: 'Purchased Fall Exhibition Opening tickets', details: { event: 'Fall Exhibition: Emerging Artists', quantity: 2, ticketType: 'Premium' }, amount: 192, staffId: null, createdDate: '2025-09-06' },
  { id: 'int-104', patronId: 'anderson-collingwood', opportunityId: null, type: 'ticket', direction: null, date: '2025-10-04T18:00:00', description: 'Purchased Impressionist Masters Evening Tour tickets', details: { event: 'Impressionist Masters Evening Tour', quantity: 2, ticketType: 'Premium' }, amount: 205, staffId: null, createdDate: '2025-10-04' },
  { id: 'int-105', patronId: 'anderson-collingwood', opportunityId: null, type: 'ticket', direction: null, date: '2025-11-22T18:00:00', description: 'Purchased Holiday Preview Night tickets', details: { event: 'Holiday Preview Night', quantity: 2, ticketType: 'Member Plus' }, amount: 134, staffId: null, createdDate: '2025-11-22' },
  { id: 'int-106', patronId: 'anderson-collingwood', opportunityId: null, type: 'ticket', direction: null, date: '2025-12-06T18:00:00', description: 'Purchased Holiday Spectacular tickets', details: { event: 'Holiday Spectacular', quantity: 2, ticketType: 'Premium' }, amount: 156, staffId: null, createdDate: '2025-12-06' },
  { id: 'int-107', patronId: 'anderson-collingwood', opportunityId: null, type: 'ticket', direction: null, date: '2026-01-10T18:00:00', description: 'Purchased Winter Exhibition Opening tickets', details: { event: 'Winter Exhibition: Light and Shadow', quantity: 2, ticketType: 'Member Plus' }, amount: 180, staffId: null, createdDate: '2026-01-10' },

  // --- Diana Rothschild (Mid-tier) ---
  { id: 'int-108', patronId: 'diana-rothschild', opportunityId: null, type: 'ticket', direction: null, date: '2025-02-14T19:00:00', description: 'Purchased Valentine Art Night tickets', details: { event: 'Valentine Art Night', quantity: 2, ticketType: 'Reserved' }, amount: 125, staffId: null, createdDate: '2025-02-14' },
  { id: 'int-109', patronId: 'diana-rothschild', opportunityId: null, type: 'ticket', direction: null, date: '2025-03-08T18:30:00', description: 'Purchased Spring Gala tickets', details: { event: 'Spring Gala 2025', quantity: 2, ticketType: 'Premium' }, amount: 150, staffId: null, createdDate: '2025-03-08' },
  { id: 'int-110', patronId: 'diana-rothschild', opportunityId: null, type: 'ticket', direction: null, date: '2025-04-05T18:00:00', description: 'Purchased Impressionist Masters Opening tickets', details: { event: 'Impressionist Masters Opening Night', quantity: 2, ticketType: 'Premium' }, amount: 150, staffId: null, createdDate: '2025-04-05' },
  { id: 'int-111', patronId: 'diana-rothschild', opportunityId: null, type: 'ticket', direction: null, date: '2025-05-10T19:00:00', description: 'Purchased Wine and Art Evening tickets', details: { event: 'Wine and Art Evening', quantity: 2, ticketType: 'Premium' }, amount: 150, staffId: null, createdDate: '2025-05-10' },
  { id: 'int-112', patronId: 'diana-rothschild', opportunityId: null, type: 'ticket', direction: null, date: '2025-06-21T14:00:00', description: 'Purchased Architecture Lecture tickets', details: { event: 'Architecture and Design Lecture', quantity: 2, ticketType: 'Reserved' }, amount: 125, staffId: null, createdDate: '2025-06-21' },
  { id: 'int-113', patronId: 'diana-rothschild', opportunityId: null, type: 'ticket', direction: null, date: '2025-07-04T19:30:00', description: 'Purchased Summer Concert Series tickets', details: { event: 'Summer Concert Series', quantity: 2, ticketType: 'Premium' }, amount: 150, staffId: null, createdDate: '2025-07-04' },
  { id: 'int-114', patronId: 'diana-rothschild', opportunityId: null, type: 'ticket', direction: null, date: '2025-08-16T14:00:00', description: 'Purchased Photography Workshop tickets', details: { event: 'Photography Workshop and Exhibition Tour', quantity: 2, ticketType: 'Reserved' }, amount: 125, staffId: null, createdDate: '2025-08-16' },
  { id: 'int-115', patronId: 'diana-rothschild', opportunityId: null, type: 'ticket', direction: null, date: '2025-09-20T14:00:00', description: 'Purchased Curator Talk tickets', details: { event: 'Curator Talk: Impressionist Masters', quantity: 2, ticketType: 'Premium' }, amount: 150, staffId: null, createdDate: '2025-09-20' },
  { id: 'int-116', patronId: 'diana-rothschild', opportunityId: null, type: 'ticket', direction: null, date: '2025-10-18T18:00:00', description: 'Purchased Wine and Cheese Gallery Hours tickets', details: { event: 'Wine and Cheese: Gallery After Hours', quantity: 2, ticketType: 'Reserved' }, amount: 125, staffId: null, createdDate: '2025-10-18' },
  { id: 'int-117', patronId: 'diana-rothschild', opportunityId: null, type: 'ticket', direction: null, date: '2025-11-22T18:00:00', description: 'Purchased Holiday Preview Night tickets', details: { event: 'Holiday Preview Night', quantity: 2, ticketType: 'Reserved' }, amount: 125, staffId: null, createdDate: '2025-11-22' },
  { id: 'int-118', patronId: 'diana-rothschild', opportunityId: null, type: 'ticket', direction: null, date: '2026-01-10T18:00:00', description: 'Purchased Winter Exhibition Opening tickets', details: { event: 'Winter Exhibition: Light and Shadow', quantity: 2, ticketType: 'Premium' }, amount: 125, staffId: null, createdDate: '2026-01-10' },

  // --- Ava Anderson (Mid-tier) ---
  { id: 'int-119', patronId: 'ava-anderson', opportunityId: null, type: 'ticket', direction: null, date: '2025-02-14T19:00:00', description: 'Purchased Valentine Art Night tickets', details: { event: 'Valentine Art Night', quantity: 2, ticketType: 'Premium' }, amount: 165, staffId: null, createdDate: '2025-02-14' },
  { id: 'int-120', patronId: 'ava-anderson', opportunityId: null, type: 'ticket', direction: null, date: '2025-03-08T18:30:00', description: 'Purchased Spring Gala tickets', details: { event: 'Spring Gala 2025', quantity: 2, ticketType: 'Reserved' }, amount: 145, staffId: null, createdDate: '2025-03-08' },
  { id: 'int-121', patronId: 'ava-anderson', opportunityId: null, type: 'ticket', direction: null, date: '2025-04-19T14:00:00', description: 'Purchased Members Preview Night tickets', details: { event: 'Members Preview: New Acquisitions', quantity: 2, ticketType: 'Member Plus' }, amount: 138, staffId: null, createdDate: '2025-04-19' },
  { id: 'int-122', patronId: 'ava-anderson', opportunityId: null, type: 'ticket', direction: null, date: '2025-05-24T10:00:00', description: 'Purchased Family Day Art Workshop tickets', details: { event: 'Family Day: Interactive Art Workshop', quantity: 2, ticketType: 'Premium' }, amount: 120, staffId: null, createdDate: '2025-05-24' },
  { id: 'int-123', patronId: 'ava-anderson', opportunityId: null, type: 'ticket', direction: null, date: '2025-06-07T18:00:00', description: 'Purchased Summer Exhibition Opening tickets', details: { event: 'Summer Exhibition: Contemporary Voices', quantity: 2, ticketType: 'Premium' }, amount: 178, staffId: null, createdDate: '2025-06-07' },
  { id: 'int-124', patronId: 'ava-anderson', opportunityId: null, type: 'ticket', direction: null, date: '2025-07-04T19:30:00', description: 'Purchased Summer Concert Series tickets', details: { event: 'Summer Concert Series', quantity: 2, ticketType: 'Reserved' }, amount: 220, staffId: null, createdDate: '2025-07-04' },
  { id: 'int-125', patronId: 'ava-anderson', opportunityId: null, type: 'ticket', direction: null, date: '2025-08-16T14:00:00', description: 'Purchased Photography Workshop tickets', details: { event: 'Photography Workshop and Exhibition Tour', quantity: 2, ticketType: 'Premium' }, amount: 155, staffId: null, createdDate: '2025-08-16' },
  { id: 'int-126', patronId: 'ava-anderson', opportunityId: null, type: 'ticket', direction: null, date: '2025-09-06T18:30:00', description: 'Purchased Fall Exhibition Opening tickets', details: { event: 'Fall Exhibition: Emerging Artists', quantity: 2, ticketType: 'Premium' }, amount: 182, staffId: null, createdDate: '2025-09-06' },
  { id: 'int-127', patronId: 'ava-anderson', opportunityId: null, type: 'ticket', direction: null, date: '2025-10-04T18:00:00', description: 'Purchased Impressionist Masters Evening Tour tickets', details: { event: 'Impressionist Masters Evening Tour', quantity: 2, ticketType: 'Reserved' }, amount: 142, staffId: null, createdDate: '2025-10-04' },
  { id: 'int-128', patronId: 'ava-anderson', opportunityId: null, type: 'ticket', direction: null, date: '2025-11-22T18:00:00', description: 'Purchased Holiday Preview Night tickets', details: { event: 'Holiday Preview Night', quantity: 2, ticketType: 'Member Plus' }, amount: 120, staffId: null, createdDate: '2025-11-22' },

  // --- John Martinez (Mid-tier) ---
  { id: 'int-129', patronId: 'john-martinez', opportunityId: null, type: 'ticket', direction: null, date: '2025-02-22T18:00:00', description: 'Purchased Photography Exhibition tickets', details: { event: 'Photography Exhibition: Urban Landscapes', quantity: 2, ticketType: 'Reserved' }, amount: 150, staffId: null, createdDate: '2025-02-22' },
  { id: 'int-130', patronId: 'john-martinez', opportunityId: null, type: 'ticket', direction: null, date: '2025-03-22T14:00:00', description: 'Purchased Curator Talk tickets', details: { event: 'Curator Talk: Renaissance to Modern', quantity: 2, ticketType: 'Premium' }, amount: 150, staffId: null, createdDate: '2025-03-22' },
  { id: 'int-131', patronId: 'john-martinez', opportunityId: null, type: 'ticket', direction: null, date: '2025-05-10T19:00:00', description: 'Purchased Wine and Art Evening tickets', details: { event: 'Wine and Art Evening', quantity: 2, ticketType: 'Premium' }, amount: 150, staffId: null, createdDate: '2025-05-10' },
  { id: 'int-132', patronId: 'john-martinez', opportunityId: null, type: 'ticket', direction: null, date: '2025-06-07T18:00:00', description: 'Purchased Summer Exhibition Opening tickets', details: { event: 'Summer Exhibition: Contemporary Voices', quantity: 2, ticketType: 'Reserved' }, amount: 150, staffId: null, createdDate: '2025-06-07' },
  { id: 'int-133', patronId: 'john-martinez', opportunityId: null, type: 'ticket', direction: null, date: '2025-08-02T18:00:00', description: 'Purchased Summer Concert VIP Reception tickets', details: { event: 'Summer Concert VIP Reception', quantity: 2, ticketType: 'Premium' }, amount: 150, staffId: null, createdDate: '2025-08-02' },
  { id: 'int-134', patronId: 'john-martinez', opportunityId: null, type: 'ticket', direction: null, date: '2025-09-20T14:00:00', description: 'Purchased Curator Talk tickets', details: { event: 'Curator Talk: Impressionist Masters', quantity: 2, ticketType: 'Reserved' }, amount: 150, staffId: null, createdDate: '2025-09-20' },
  { id: 'int-135', patronId: 'john-martinez', opportunityId: null, type: 'ticket', direction: null, date: '2025-11-08T18:30:00', description: 'Purchased Annual Benefit Dinner tickets', details: { event: 'Annual Benefit Dinner', quantity: 2, ticketType: 'Premium' }, amount: 165, staffId: null, createdDate: '2025-11-08' },

  // --- Lucas Taylor (Mid-tier) ---
  { id: 'int-136', patronId: 'lucas-taylor', opportunityId: null, type: 'ticket', direction: null, date: '2025-02-14T19:00:00', description: 'Purchased Valentine Art Night tickets', details: { event: 'Valentine Art Night', quantity: 2, ticketType: 'Reserved' }, amount: 175, staffId: null, createdDate: '2025-02-14' },
  { id: 'int-137', patronId: 'lucas-taylor', opportunityId: null, type: 'ticket', direction: null, date: '2025-04-05T18:00:00', description: 'Purchased Impressionist Masters Opening tickets', details: { event: 'Impressionist Masters Opening Night', quantity: 2, ticketType: 'Premium' }, amount: 200, staffId: null, createdDate: '2025-04-05' },
  { id: 'int-138', patronId: 'lucas-taylor', opportunityId: null, type: 'ticket', direction: null, date: '2025-05-24T10:00:00', description: 'Purchased Family Day Art Workshop tickets', details: { event: 'Family Day: Interactive Art Workshop', quantity: 2, ticketType: 'Premium' }, amount: 175, staffId: null, createdDate: '2025-05-24' },
  { id: 'int-139', patronId: 'lucas-taylor', opportunityId: null, type: 'ticket', direction: null, date: '2025-06-07T18:00:00', description: 'Purchased Summer Exhibition Opening tickets', details: { event: 'Summer Exhibition: Contemporary Voices', quantity: 2, ticketType: 'Reserved' }, amount: 200, staffId: null, createdDate: '2025-06-07' },
  { id: 'int-140', patronId: 'lucas-taylor', opportunityId: null, type: 'ticket', direction: null, date: '2025-08-02T18:00:00', description: 'Purchased Summer Concert VIP Reception tickets', details: { event: 'Summer Concert VIP Reception', quantity: 2, ticketType: 'Premium' }, amount: 200, staffId: null, createdDate: '2025-08-02' },
  { id: 'int-141', patronId: 'lucas-taylor', opportunityId: null, type: 'ticket', direction: null, date: '2025-09-06T18:30:00', description: 'Purchased Fall Exhibition Opening tickets', details: { event: 'Fall Exhibition: Emerging Artists', quantity: 2, ticketType: 'Reserved' }, amount: 215, staffId: null, createdDate: '2025-09-06' },

  // --- Margaret Chen (Mid-tier) ---
  { id: 'int-142', patronId: 'margaret-chen', opportunityId: null, type: 'ticket', direction: null, date: '2025-03-22T14:00:00', description: 'Purchased Curator Talk tickets', details: { event: 'Curator Talk: Renaissance to Modern', quantity: 2, ticketType: 'Reserved' }, amount: 100, staffId: null, createdDate: '2025-03-22' },
  { id: 'int-143', patronId: 'margaret-chen', opportunityId: null, type: 'ticket', direction: null, date: '2025-04-19T14:00:00', description: 'Purchased Members Preview Night tickets', details: { event: 'Members Preview: New Acquisitions', quantity: 2, ticketType: 'Member Plus' }, amount: 100, staffId: null, createdDate: '2025-04-19' },
  { id: 'int-144', patronId: 'margaret-chen', opportunityId: null, type: 'ticket', direction: null, date: '2025-05-24T10:00:00', description: 'Purchased Family Day Art Workshop tickets', details: { event: 'Family Day: Interactive Art Workshop', quantity: 2, ticketType: 'Reserved' }, amount: 100, staffId: null, createdDate: '2025-05-24' },
  { id: 'int-145', patronId: 'margaret-chen', opportunityId: null, type: 'ticket', direction: null, date: '2025-06-21T14:00:00', description: 'Purchased Architecture Lecture tickets', details: { event: 'Architecture and Design Lecture', quantity: 2, ticketType: 'Reserved' }, amount: 100, staffId: null, createdDate: '2025-06-21' },
  { id: 'int-146', patronId: 'margaret-chen', opportunityId: null, type: 'ticket', direction: null, date: '2025-07-19T14:00:00', description: 'Purchased Film Series tickets', details: { event: 'Film Series: Art in Cinema', quantity: 2, ticketType: 'Reserved' }, amount: 100, staffId: null, createdDate: '2025-07-19' },
  { id: 'int-147', patronId: 'margaret-chen', opportunityId: null, type: 'ticket', direction: null, date: '2025-08-16T14:00:00', description: 'Purchased Photography Workshop tickets', details: { event: 'Photography Workshop and Exhibition Tour', quantity: 2, ticketType: 'Reserved' }, amount: 100, staffId: null, createdDate: '2025-08-16' },
  { id: 'int-148', patronId: 'margaret-chen', opportunityId: null, type: 'ticket', direction: null, date: '2025-09-20T14:00:00', description: 'Purchased Curator Talk tickets', details: { event: 'Curator Talk: Impressionist Masters', quantity: 2, ticketType: 'Reserved' }, amount: 100, staffId: null, createdDate: '2025-09-20' },
  { id: 'int-149', patronId: 'margaret-chen', opportunityId: null, type: 'ticket', direction: null, date: '2025-10-04T18:00:00', description: 'Purchased Impressionist Masters Evening Tour tickets', details: { event: 'Impressionist Masters Evening Tour', quantity: 2, ticketType: 'Reserved' }, amount: 100, staffId: null, createdDate: '2025-10-04' },

  // --- Ethan Davis (Small) ---
  { id: 'int-150', patronId: 'ethan-davis', opportunityId: null, type: 'ticket', direction: null, date: '2025-02-14T19:00:00', description: 'Purchased Valentine Art Night tickets', details: { event: 'Valentine Art Night', quantity: 1, ticketType: 'General Admission' }, amount: 75, staffId: null, createdDate: '2025-02-14' },
  { id: 'int-151', patronId: 'ethan-davis', opportunityId: null, type: 'ticket', direction: null, date: '2025-03-22T14:00:00', description: 'Purchased Curator Talk tickets', details: { event: 'Curator Talk: Renaissance to Modern', quantity: 1, ticketType: 'Standard' }, amount: 45, staffId: null, createdDate: '2025-03-22' },
  { id: 'int-152', patronId: 'ethan-davis', opportunityId: null, type: 'ticket', direction: null, date: '2025-04-05T18:00:00', description: 'Purchased Impressionist Masters Opening tickets', details: { event: 'Impressionist Masters Opening Night', quantity: 1, ticketType: 'General Admission' }, amount: 80, staffId: null, createdDate: '2025-04-05' },
  { id: 'int-153', patronId: 'ethan-davis', opportunityId: null, type: 'ticket', direction: null, date: '2025-05-24T10:00:00', description: 'Purchased Family Day Workshop tickets', details: { event: 'Family Day: Interactive Art Workshop', quantity: 1, ticketType: 'Standard' }, amount: 75, staffId: null, createdDate: '2025-05-24' },
  { id: 'int-154', patronId: 'ethan-davis', opportunityId: null, type: 'ticket', direction: null, date: '2025-07-04T19:30:00', description: 'Purchased Summer Concert Series tickets', details: { event: 'Summer Concert Series', quantity: 1, ticketType: 'General Admission' }, amount: 80, staffId: null, createdDate: '2025-07-04' },
  { id: 'int-155', patronId: 'ethan-davis', opportunityId: null, type: 'ticket', direction: null, date: '2025-08-02T18:00:00', description: 'Purchased Summer Concert tickets', details: { event: 'Summer Concert VIP Reception', quantity: 2, ticketType: 'Standard' }, amount: 132, staffId: null, createdDate: '2025-08-02' },
  { id: 'int-156', patronId: 'ethan-davis', opportunityId: null, type: 'ticket', direction: null, date: '2025-09-06T18:30:00', description: 'Purchased Fall Exhibition tickets', details: { event: 'Fall Exhibition: Emerging Artists', quantity: 1, ticketType: 'General Admission' }, amount: 80, staffId: null, createdDate: '2025-09-06' },
  { id: 'int-157', patronId: 'ethan-davis', opportunityId: null, type: 'ticket', direction: null, date: '2025-10-04T18:00:00', description: 'Purchased Impressionist Masters tickets', details: { event: 'Impressionist Masters Evening Tour', quantity: 1, ticketType: 'Standard' }, amount: 95, staffId: null, createdDate: '2025-10-04' },

  // --- Olivia Brown (Small) ---
  { id: 'int-158', patronId: 'olivia-brown', opportunityId: null, type: 'ticket', direction: null, date: '2025-02-22T18:00:00', description: 'Purchased Photography Exhibition tickets', details: { event: 'Photography Exhibition: Urban Landscapes', quantity: 1, ticketType: 'General Admission' }, amount: 65, staffId: null, createdDate: '2025-02-22' },
  { id: 'int-159', patronId: 'olivia-brown', opportunityId: null, type: 'ticket', direction: null, date: '2025-03-22T14:00:00', description: 'Purchased Curator Talk tickets', details: { event: 'Curator Talk: Renaissance to Modern', quantity: 1, ticketType: 'Standard' }, amount: 65, staffId: null, createdDate: '2025-03-22' },
  { id: 'int-160', patronId: 'olivia-brown', opportunityId: null, type: 'ticket', direction: null, date: '2025-04-19T14:00:00', description: 'Purchased Members Preview tickets', details: { event: 'Members Preview: New Acquisitions', quantity: 1, ticketType: 'Member Access' }, amount: 65, staffId: null, createdDate: '2025-04-19' },
  { id: 'int-161', patronId: 'olivia-brown', opportunityId: null, type: 'ticket', direction: null, date: '2025-06-21T14:00:00', description: 'Purchased Architecture Lecture tickets', details: { event: 'Architecture and Design Lecture', quantity: 1, ticketType: 'Standard' }, amount: 65, staffId: null, createdDate: '2025-06-21' },
  { id: 'int-162', patronId: 'olivia-brown', opportunityId: null, type: 'ticket', direction: null, date: '2025-07-19T14:00:00', description: 'Purchased Film Series tickets', details: { event: 'Film Series: Art in Cinema', quantity: 1, ticketType: 'General Admission' }, amount: 65, staffId: null, createdDate: '2025-07-19' },
  { id: 'int-163', patronId: 'olivia-brown', opportunityId: null, type: 'ticket', direction: null, date: '2025-09-20T14:00:00', description: 'Purchased Curator Talk tickets', details: { event: 'Curator Talk: Impressionist Masters', quantity: 1, ticketType: 'Standard' }, amount: 65, staffId: null, createdDate: '2025-09-20' },
  { id: 'int-164', patronId: 'olivia-brown', opportunityId: null, type: 'ticket', direction: null, date: '2025-10-18T18:00:00', description: 'Purchased Wine and Cheese Gallery Hours tickets', details: { event: 'Wine and Cheese: Gallery After Hours', quantity: 1, ticketType: 'General Admission' }, amount: 68, staffId: null, createdDate: '2025-10-18' },
  { id: 'int-165', patronId: 'olivia-brown', opportunityId: null, type: 'ticket', direction: null, date: '2025-11-22T18:00:00', description: 'Purchased Holiday Preview Night tickets', details: { event: 'Holiday Preview Night', quantity: 1, ticketType: 'Member Access' }, amount: 65, staffId: null, createdDate: '2025-11-22' },

  // --- Sophia Thomas (Small) ---
  { id: 'int-166', patronId: 'sophia-thomas', opportunityId: null, type: 'ticket', direction: null, date: '2025-05-24T10:00:00', description: 'Purchased Family Day Workshop tickets', details: { event: 'Family Day: Interactive Art Workshop', quantity: 1, ticketType: 'General Admission' }, amount: 80, staffId: null, createdDate: '2025-05-24' },
  { id: 'int-167', patronId: 'sophia-thomas', opportunityId: null, type: 'ticket', direction: null, date: '2025-06-07T18:00:00', description: 'Purchased Summer Exhibition tickets', details: { event: 'Summer Exhibition: Contemporary Voices', quantity: 1, ticketType: 'General Admission' }, amount: 80, staffId: null, createdDate: '2025-06-07' },
  { id: 'int-168', patronId: 'sophia-thomas', opportunityId: null, type: 'ticket', direction: null, date: '2025-07-04T19:30:00', description: 'Purchased Summer Concert Series tickets', details: { event: 'Summer Concert Series', quantity: 1, ticketType: 'General Admission' }, amount: 80, staffId: null, createdDate: '2025-07-04' },
  { id: 'int-169', patronId: 'sophia-thomas', opportunityId: null, type: 'ticket', direction: null, date: '2025-08-16T14:00:00', description: 'Purchased Photography Workshop tickets', details: { event: 'Photography Workshop and Exhibition Tour', quantity: 1, ticketType: 'Standard' }, amount: 80, staffId: null, createdDate: '2025-08-16' },
  { id: 'int-170', patronId: 'sophia-thomas', opportunityId: null, type: 'ticket', direction: null, date: '2025-09-06T18:30:00', description: 'Purchased Fall Exhibition tickets', details: { event: 'Fall Exhibition: Emerging Artists', quantity: 1, ticketType: 'General Admission' }, amount: 90, staffId: null, createdDate: '2025-09-06' },
  { id: 'int-171', patronId: 'sophia-thomas', opportunityId: null, type: 'ticket', direction: null, date: '2025-10-04T18:00:00', description: 'Purchased Impressionist Masters tickets', details: { event: 'Impressionist Masters Evening Tour', quantity: 1, ticketType: 'Standard' }, amount: 90, staffId: null, createdDate: '2025-10-04' },

  // --- Paul Fairfax (Small, already has int-009/Sep, int-011/Jun, int-013/Feb, int-014/Nov2024) ---
  { id: 'int-172', patronId: 'paul-fairfax', opportunityId: null, type: 'ticket', direction: null, date: '2025-03-22T14:00:00', description: 'Purchased Curator Talk tickets', details: { event: 'Curator Talk: Renaissance to Modern', quantity: 2, ticketType: 'Member Access' }, amount: 90, staffId: null, createdDate: '2025-03-22' },
  { id: 'int-173', patronId: 'paul-fairfax', opportunityId: null, type: 'ticket', direction: null, date: '2025-05-24T10:00:00', description: 'Purchased Family Day Workshop tickets', details: { event: 'Family Day: Interactive Art Workshop', quantity: 2, ticketType: 'Standard' }, amount: 90, staffId: null, createdDate: '2025-05-24' },
  { id: 'int-174', patronId: 'paul-fairfax', opportunityId: null, type: 'ticket', direction: null, date: '2025-07-04T19:30:00', description: 'Purchased Summer Concert Series tickets', details: { event: 'Summer Concert Series', quantity: 2, ticketType: 'General Admission' }, amount: 112, staffId: null, createdDate: '2025-07-04' },
  { id: 'int-175', patronId: 'paul-fairfax', opportunityId: null, type: 'ticket', direction: null, date: '2025-10-04T18:00:00', description: 'Purchased Impressionist Masters tickets', details: { event: 'Impressionist Masters Evening Tour', quantity: 2, ticketType: 'Member Access' }, amount: 90, staffId: null, createdDate: '2025-10-04' },
  { id: 'int-176', patronId: 'paul-fairfax', opportunityId: null, type: 'ticket', direction: null, date: '2025-11-22T18:00:00', description: 'Purchased Holiday Preview Night tickets', details: { event: 'Holiday Preview Night', quantity: 2, ticketType: 'Member Access' }, amount: 88, staffId: null, createdDate: '2025-11-22' },

  // --- Elizabeth Fairfax (Small) ---
  { id: 'int-177', patronId: 'elizabeth-fairfax', opportunityId: null, type: 'ticket', direction: null, date: '2025-02-14T19:00:00', description: 'Purchased Valentine Art Night tickets', details: { event: 'Valentine Art Night', quantity: 1, ticketType: 'Member Access' }, amount: 45, staffId: null, createdDate: '2025-02-14' },
  { id: 'int-178', patronId: 'elizabeth-fairfax', opportunityId: null, type: 'ticket', direction: null, date: '2025-03-22T14:00:00', description: 'Purchased Curator Talk tickets', details: { event: 'Curator Talk: Renaissance to Modern', quantity: 1, ticketType: 'Standard' }, amount: 45, staffId: null, createdDate: '2025-03-22' },
  { id: 'int-179', patronId: 'elizabeth-fairfax', opportunityId: null, type: 'ticket', direction: null, date: '2025-04-19T14:00:00', description: 'Purchased Members Preview tickets', details: { event: 'Members Preview: New Acquisitions', quantity: 1, ticketType: 'Member Access' }, amount: 45, staffId: null, createdDate: '2025-04-19' },
  { id: 'int-180', patronId: 'elizabeth-fairfax', opportunityId: null, type: 'ticket', direction: null, date: '2025-05-24T10:00:00', description: 'Purchased Family Day Workshop tickets', details: { event: 'Family Day: Interactive Art Workshop', quantity: 1, ticketType: 'Standard' }, amount: 45, staffId: null, createdDate: '2025-05-24' },
  { id: 'int-181', patronId: 'elizabeth-fairfax', opportunityId: null, type: 'ticket', direction: null, date: '2025-06-21T14:00:00', description: 'Purchased Architecture Lecture tickets', details: { event: 'Architecture and Design Lecture', quantity: 1, ticketType: 'Standard' }, amount: 45, staffId: null, createdDate: '2025-06-21' },
  { id: 'int-182', patronId: 'elizabeth-fairfax', opportunityId: null, type: 'ticket', direction: null, date: '2025-07-19T14:00:00', description: 'Purchased Film Series tickets', details: { event: 'Film Series: Art in Cinema', quantity: 1, ticketType: 'General Admission' }, amount: 45, staffId: null, createdDate: '2025-07-19' },
  { id: 'int-183', patronId: 'elizabeth-fairfax', opportunityId: null, type: 'ticket', direction: null, date: '2025-08-16T14:00:00', description: 'Purchased Photography Workshop tickets', details: { event: 'Photography Workshop and Exhibition Tour', quantity: 1, ticketType: 'Standard' }, amount: 45, staffId: null, createdDate: '2025-08-16' },
  { id: 'int-184', patronId: 'elizabeth-fairfax', opportunityId: null, type: 'ticket', direction: null, date: '2025-09-20T14:00:00', description: 'Purchased Curator Talk tickets', details: { event: 'Curator Talk: Impressionist Masters', quantity: 1, ticketType: 'Member Access' }, amount: 45, staffId: null, createdDate: '2025-09-20' },
  { id: 'int-185', patronId: 'elizabeth-fairfax', opportunityId: null, type: 'ticket', direction: null, date: '2025-11-22T18:00:00', description: 'Purchased Holiday Preview Night tickets', details: { event: 'Holiday Preview Night', quantity: 1, ticketType: 'Member Access' }, amount: 50, staffId: null, createdDate: '2025-11-22' },
  { id: 'int-186', patronId: 'elizabeth-fairfax', opportunityId: null, type: 'ticket', direction: null, date: '2025-12-06T18:00:00', description: 'Purchased Holiday Spectacular tickets', details: { event: 'Holiday Spectacular', quantity: 1, ticketType: 'Standard' }, amount: 45, staffId: null, createdDate: '2025-12-06' },

  // --- Maria Santos (Small) ---
  { id: 'int-187', patronId: 'maria-santos', opportunityId: null, type: 'ticket', direction: null, date: '2025-06-07T18:00:00', description: 'Purchased Summer Exhibition tickets', details: { event: 'Summer Exhibition: Contemporary Voices', quantity: 1, ticketType: 'General Admission' }, amount: 85, staffId: null, createdDate: '2025-06-07' },
  { id: 'int-188', patronId: 'maria-santos', opportunityId: null, type: 'ticket', direction: null, date: '2025-07-04T19:30:00', description: 'Purchased Summer Concert Series tickets', details: { event: 'Summer Concert Series', quantity: 1, ticketType: 'General Admission' }, amount: 55, staffId: null, createdDate: '2025-07-04' },
  { id: 'int-189', patronId: 'maria-santos', opportunityId: null, type: 'ticket', direction: null, date: '2025-09-06T18:30:00', description: 'Purchased Fall Exhibition tickets', details: { event: 'Fall Exhibition: Emerging Artists', quantity: 1, ticketType: 'General Admission' }, amount: 55, staffId: null, createdDate: '2025-09-06' },
  { id: 'int-190', patronId: 'maria-santos', opportunityId: null, type: 'ticket', direction: null, date: '2025-10-04T18:00:00', description: 'Purchased Impressionist Masters tickets', details: { event: 'Impressionist Masters Evening Tour', quantity: 1, ticketType: 'Standard' }, amount: 55, staffId: null, createdDate: '2025-10-04' },
  { id: 'int-191', patronId: 'maria-santos', opportunityId: null, type: 'ticket', direction: null, date: '2025-11-22T18:00:00', description: 'Purchased Holiday Preview Night tickets', details: { event: 'Holiday Preview Night', quantity: 1, ticketType: 'General Admission' }, amount: 55, staffId: null, createdDate: '2025-11-22' },
  { id: 'int-192', patronId: 'maria-santos', opportunityId: null, type: 'ticket', direction: null, date: '2025-12-06T18:00:00', description: 'Purchased Holiday Spectacular tickets', details: { event: 'Holiday Spectacular', quantity: 1, ticketType: 'Standard' }, amount: 55, staffId: null, createdDate: '2025-12-06' },
  { id: 'int-193', patronId: 'maria-santos', opportunityId: null, type: 'ticket', direction: null, date: '2026-01-10T18:00:00', description: 'Purchased Winter Exhibition tickets', details: { event: 'Winter Exhibition: Light and Shadow', quantity: 1, ticketType: 'General Admission' }, amount: 55, staffId: null, createdDate: '2026-01-10' },

  // --- Rachel Kim (Small) ---
  { id: 'int-194', patronId: 'rachel-kim', opportunityId: null, type: 'ticket', direction: null, date: '2025-10-04T18:00:00', description: 'Purchased Impressionist Masters Evening Tour tickets', details: { event: 'Impressionist Masters Evening Tour', quantity: 2, ticketType: 'General Admission' }, amount: 115, staffId: null, createdDate: '2025-10-04' },
  { id: 'int-195', patronId: 'rachel-kim', opportunityId: null, type: 'ticket', direction: null, date: '2025-11-08T18:30:00', description: 'Purchased Annual Benefit Dinner tickets', details: { event: 'Annual Benefit Dinner', quantity: 2, ticketType: 'Standard' }, amount: 115, staffId: null, createdDate: '2025-11-08' },
  { id: 'int-196', patronId: 'rachel-kim', opportunityId: null, type: 'ticket', direction: null, date: '2025-12-06T18:00:00', description: 'Purchased Holiday Spectacular tickets', details: { event: 'Holiday Spectacular', quantity: 2, ticketType: 'General Admission' }, amount: 120, staffId: null, createdDate: '2025-12-06' },

  // --- Sarah Blackwood (Small) ---
  { id: 'int-197', patronId: 'sarah-blackwood', opportunityId: null, type: 'ticket', direction: null, date: '2025-11-22T18:00:00', description: 'Purchased Holiday Preview Night tickets', details: { event: 'Holiday Preview Night', quantity: 2, ticketType: 'General Admission' }, amount: 115, staffId: null, createdDate: '2025-11-22' },
  { id: 'int-198', patronId: 'sarah-blackwood', opportunityId: null, type: 'ticket', direction: null, date: '2025-12-06T18:00:00', description: 'Purchased Holiday Spectacular tickets', details: { event: 'Holiday Spectacular', quantity: 2, ticketType: 'Standard' }, amount: 120, staffId: null, createdDate: '2025-12-06' },
  { id: 'int-199', patronId: 'sarah-blackwood', opportunityId: null, type: 'ticket', direction: null, date: '2026-01-10T18:00:00', description: 'Purchased Winter Exhibition Opening tickets', details: { event: 'Winter Exhibition: Light and Shadow', quantity: 2, ticketType: 'General Admission' }, amount: 115, staffId: null, createdDate: '2026-01-10' },

  // --- Jake Thompson (Small) ---
  { id: 'int-200', patronId: 'jake-thompson', opportunityId: null, type: 'ticket', direction: null, date: '2025-07-04T19:30:00', description: 'Purchased Summer Concert Series tickets', details: { event: 'Summer Concert Series', quantity: 1, ticketType: 'General Admission' }, amount: 50, staffId: null, createdDate: '2025-07-04' },
  { id: 'int-201', patronId: 'jake-thompson', opportunityId: null, type: 'ticket', direction: null, date: '2025-09-06T18:30:00', description: 'Purchased Fall Exhibition tickets', details: { event: 'Fall Exhibition: Emerging Artists', quantity: 1, ticketType: 'General Admission' }, amount: 50, staffId: null, createdDate: '2025-09-06' },
  { id: 'int-202', patronId: 'jake-thompson', opportunityId: null, type: 'ticket', direction: null, date: '2025-10-04T18:00:00', description: 'Purchased Impressionist Masters tickets', details: { event: 'Impressionist Masters Evening Tour', quantity: 1, ticketType: 'Standard' }, amount: 50, staffId: null, createdDate: '2025-10-04' },

  // --- David Chen (Small) ---
  { id: 'int-203', patronId: 'david-chen', opportunityId: null, type: 'ticket', direction: null, date: '2025-08-16T14:00:00', description: 'Purchased Photography Workshop tickets', details: { event: 'Photography Workshop and Exhibition Tour', quantity: 1, ticketType: 'General Admission' }, amount: 40, staffId: null, createdDate: '2025-08-16' },
  { id: 'int-204', patronId: 'david-chen', opportunityId: null, type: 'ticket', direction: null, date: '2025-09-06T18:30:00', description: 'Purchased Fall Exhibition tickets', details: { event: 'Fall Exhibition: Emerging Artists', quantity: 1, ticketType: 'General Admission' }, amount: 35, staffId: null, createdDate: '2025-09-06' },

  // --- James Wilson (Small) ---
  { id: 'int-205', patronId: 'james-wilson', opportunityId: null, type: 'ticket', direction: null, date: '2026-01-10T18:00:00', description: 'Purchased Winter Exhibition Opening tickets', details: { event: 'Winter Exhibition: Light and Shadow', quantity: 1, ticketType: 'General Admission' }, amount: 50, staffId: null, createdDate: '2026-01-10' },
]

// ============================================
// Fever event URL mapping (real Fever SF links)
// ============================================
const EVENT_FEVER_URLS = {
  'Summer Concert VIP Reception': 'https://feverup.com/m/107418',
  'Summer Concert Series VIP Reception': 'https://feverup.com/m/107418',
  'Summer Concert Series': 'https://feverup.com/m/107418',
  'Valentine Art Night': 'https://feverup.com/m/107228',
  'Spring Gala 2025': 'https://feverup.com/m/107418',
  'Impressionist Masters Opening Night': 'https://feverup.com/m/165333',
  'Impressionist Masters Evening Tour': 'https://feverup.com/m/165333',
  'Wine and Art Evening': 'https://feverup.com/m/164871',
  'Summer Exhibition Opening Gala': 'https://feverup.com/m/107228',
  'Summer Exhibition: Contemporary Voices': 'https://feverup.com/m/107228',
  'Fall Exhibition: Emerging Artists': 'https://feverup.com/m/133864',
  'Annual Benefit Dinner': 'https://feverup.com/m/107228',
  'Holiday Spectacular': 'https://feverup.com/m/166127',
  'Holiday Preview Night': 'https://feverup.com/m/166127',
  'Photography Exhibition: Urban Landscapes': 'https://feverup.com/m/127375',
  'Photography Workshop and Exhibition Tour': 'https://feverup.com/m/127375',
  'Curator Talk: Modern Sculpture': 'https://feverup.com/m/165333',
  'Curator Talk: Impressionist Masters': 'https://feverup.com/m/165333',
  'Curator Talk: Renaissance to Modern': 'https://feverup.com/m/165333',
  'Architecture and Design Lecture': 'https://feverup.com/m/107418',
  'Wine and Cheese: Gallery After Hours': 'https://feverup.com/m/164871',
  'Winter Exhibition: Light and Shadow': 'https://feverup.com/m/127375',
  'Members Preview: New Acquisitions': 'https://feverup.com/m/133864',
  'Family Day: Interactive Art Workshop': 'https://feverup.com/m/166127',
  'Film Series: Art in Cinema': 'https://feverup.com/m/133864',
}

// Sorted keys by length (longest first) for best-match lookup
const FEVER_KEYS_BY_LENGTH = Object.keys(EVENT_FEVER_URLS).sort((a, b) => b.length - a.length)

// Enrich event/ticket interactions with Fever URLs and order IDs
let _orderCounter = 104672401
INTERACTIONS.forEach(interaction => {
  if (interaction.type === 'event' || (interaction.type === 'ticket' && interaction.details?.event)) {
    const searchText = interaction.details?.event || interaction.description || ''
    const matchedKey = FEVER_KEYS_BY_LENGTH.find(k => searchText.includes(k))
    interaction.eventUrl = matchedKey ? EVENT_FEVER_URLS[matchedKey] : 'https://feverup.com/m/107228'
    interaction.orderId = `R${_orderCounter++}`
  }
})

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
  // gift-016: New Year Major Gift ($2,500) - fully acknowledged
  { id: 'ack-001', giftId: 'gift-016', patronId: 'anderson-collingwood', type: 'thank-you-letter', method: 'email', status: 'sent', date: '2026-01-29', staffId: 'lj', templateUsed: 'major-gift-thanks', notes: null },
  { id: 'ack-002', giftId: 'gift-016', patronId: 'anderson-collingwood', type: 'tax-receipt', method: 'email', status: 'sent', date: '2026-01-29', staffId: null, templateUsed: 'standard-receipt', notes: null },

  // gift-006: Year-End Major Gift 2024 ($2,500) - acknowledged
  { id: 'ack-003', giftId: 'gift-006', patronId: 'anderson-collingwood', type: 'thank-you-letter', method: 'email', status: 'sent', date: '2024-12-19', staffId: 'lj', templateUsed: 'major-gift-thanks', notes: null },
  { id: 'ack-004', giftId: 'gift-006', patronId: 'anderson-collingwood', type: 'tax-receipt', method: 'email', status: 'sent', date: '2024-12-19', staffId: null, templateUsed: 'standard-receipt', notes: null },

  // gift-008: Spring Gala Sponsorship ($2,500) - acknowledged
  { id: 'ack-005', giftId: 'gift-008', patronId: 'anderson-collingwood', type: 'thank-you-letter', method: 'email', status: 'sent', date: '2025-06-16', staffId: 'lj', templateUsed: 'event-gift-thanks', notes: null },

  // gift-007: Building Campaign Q1 Payment ($1,250) - acknowledged
  { id: 'ack-006', giftId: 'gift-007', patronId: 'anderson-collingwood', type: 'thank-you-letter', method: 'email', status: 'sent', date: '2025-06-16', staffId: 'lj', templateUsed: 'pledge-payment-thanks', notes: null },

  // gift-013: Building Campaign Q3 Payment ($1,250) - PENDING acknowledgment
  { id: 'ack-007', giftId: 'gift-013', patronId: 'anderson-collingwood', type: 'thank-you-letter', method: 'email', status: 'pending', date: null, staffId: 'lj', templateUsed: 'pledge-payment-thanks', notes: 'Queued for next batch' },

  // gift-002: First Annual Gift ($500) - auto-acknowledged
  { id: 'ack-008', giftId: 'gift-002', patronId: 'anderson-collingwood', type: 'thank-you-email', method: 'email', status: 'sent', date: '2024-03-16', staffId: null, templateUsed: 'online-auto-thanks', notes: 'Auto-generated' },

  // gift-014: Year-End Major Gift 2025 ($2,500) - acknowledged
  { id: 'ack-009', giftId: 'gift-014', patronId: 'anderson-collingwood', type: 'thank-you-letter', method: 'email', status: 'sent', date: '2025-12-21', staffId: 'lj', templateUsed: 'major-gift-thanks', notes: null },

  // Elizabeth Fairfax - gift-017 acknowledged, gift-018 PENDING
  { id: 'ack-010', giftId: 'gift-017', patronId: 'elizabeth-fairfax', type: 'thank-you-letter', method: 'email', status: 'sent', date: '2025-04-16', staffId: 'lj', templateUsed: 'pledge-payment-thanks', notes: null },
  { id: 'ack-011', giftId: 'gift-018', patronId: 'elizabeth-fairfax', type: 'thank-you-email', method: 'email', status: 'pending', date: null, staffId: 'lj', templateUsed: 'online-auto-thanks', notes: 'Queued for batch processing' },
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

// ============================================
// HOUSEHOLDS
// ============================================

export const HOUSEHOLDS = [
  {
    id: 'hh-collingwood',
    name: 'Collingwood Family',
    formalSalutation: 'Mr. Anderson & Mrs. Sarah Collingwood',
    informalSalutation: 'Anderson & Sarah',
    primaryContactId: 'anderson-collingwood',
    verified: true,
    createdDate: '2024-06-15'
  },
  {
    id: 'hh-fairfax',
    name: 'Fairfax Family',
    formalSalutation: 'Mr. Paul & Mrs. Elizabeth Fairfax',
    informalSalutation: 'Paul & Elizabeth',
    primaryContactId: 'paul-fairfax',
    verified: true,
    createdDate: '2024-09-01'
  },
  {
    id: 'hh-martinez-carter',
    name: 'Martinez-Carter Family',
    formalSalutation: 'Mr. John Martinez & Mrs. Samantha Carter',
    informalSalutation: 'John & Samantha',
    primaryContactId: 'john-martinez',
    verified: false,
    createdDate: '2025-01-10'
  },
  {
    id: 'hh-taylor-thomas',
    name: 'Taylor-Thomas Family',
    formalSalutation: 'Mr. Lucas Taylor & Ms. Sophia Thomas',
    informalSalutation: 'Lucas & Sophia',
    primaryContactId: 'lucas-taylor',
    verified: true,
    createdDate: '2025-03-20'
  }
]

export const HOUSEHOLD_MEMBERS = [
  // Collingwood Family
  { id: 'hhm-1', householdId: 'hh-collingwood', patronId: 'anderson-collingwood', role: 'Head', isPrimary: true, joinedDate: '2024-06-15' },
  { id: 'hhm-2', householdId: 'hh-collingwood', patronId: 'sarah-collingwood', role: 'Spouse', isPrimary: false, joinedDate: '2024-06-15' },
  { id: 'hhm-3', householdId: 'hh-collingwood', patronId: 'emma-collingwood', role: 'Child', isPrimary: false, joinedDate: '2024-06-15' },
  // Fairfax Family
  { id: 'hhm-4', householdId: 'hh-fairfax', patronId: 'paul-fairfax', role: 'Head', isPrimary: true, joinedDate: '2024-09-01' },
  { id: 'hhm-5', householdId: 'hh-fairfax', patronId: 'elizabeth-fairfax', role: 'Spouse', isPrimary: false, joinedDate: '2024-09-01' },
  // Martinez-Carter Family
  { id: 'hhm-6', householdId: 'hh-martinez-carter', patronId: 'john-martinez', role: 'Head', isPrimary: true, joinedDate: '2025-01-10' },
  { id: 'hhm-7', householdId: 'hh-martinez-carter', patronId: 'samantha-carter', role: 'Spouse', isPrimary: false, joinedDate: '2025-01-10' },
  // Taylor-Thomas Family
  { id: 'hhm-8', householdId: 'hh-taylor-thomas', patronId: 'lucas-taylor', role: 'Head', isPrimary: true, joinedDate: '2025-03-20' },
  { id: 'hhm-9', householdId: 'hh-taylor-thomas', patronId: 'sophia-thomas', role: 'Spouse', isPrimary: false, joinedDate: '2025-03-20' }
]

// Household helper functions
export const getHouseholdById = (id) => {
  if (!id) return null
  return HOUSEHOLDS.find(h => h.id === id) || null
}

export const updateHouseholdName = (householdId, newName) => {
  const household = HOUSEHOLDS.find(h => h.id === householdId)
  if (household) {
    household.name = newName
  }
}

export const getHouseholdForPatron = (patronId) => {
  if (!patronId) return null
  const membership = HOUSEHOLD_MEMBERS.find(m => m.patronId === patronId)
  if (!membership) return null
  return getHouseholdById(membership.householdId)
}

export const getHouseholdMembers = (householdId) => {
  if (!householdId) return []
  const members = HOUSEHOLD_MEMBERS.filter(m => m.householdId === householdId)
  return members.map(m => {
    const patron = patrons.find(p => p.id === m.patronId)
    return {
      ...m,
      patron: patron ? {
        id: patron.id,
        firstName: patron.firstName,
        lastName: patron.lastName,
        name: `${patron.firstName} ${patron.lastName}`,
        email: patron.email,
        photo: patron.photo
      } : null
    }
  }).filter(m => m.patron !== null)
}

export const getHouseholdAddress = (household) => {
  if (!household) return null
  const primaryMember = HOUSEHOLD_MEMBERS.find(
    m => m.householdId === household.id && m.isPrimary
  )
  if (!primaryMember) return null
  const patron = patrons.find(p => p.id === primaryMember.patronId)
  return patron?.address || null
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
  // Anderson's organization relationships
  {
    id: 'rel-14',
    fromPatronId: 'anderson-collingwood',
    toPatronId: null,
    type: 'organization',
    role: 'Employee',
    reciprocalRole: 'Employer',
    isPrimary: false,
    startDate: '2018-03-01',
    endDate: null,
    notes: 'Chief Technology Officer',
    externalContact: { name: 'Apex Innovations', company: 'Apex Innovations', initials: 'AI', title: 'CTO' }
  },
  // Fairfax household relationships
  {
    id: 'rel-8',
    fromPatronId: 'paul-fairfax',
    toPatronId: 'elizabeth-fairfax',
    type: 'household',
    role: 'Spouse',
    reciprocalRole: 'Spouse',
    isPrimary: true,
    startDate: null,
    endDate: null,
    notes: null
  },
  {
    id: 'rel-9',
    fromPatronId: 'elizabeth-fairfax',
    toPatronId: 'paul-fairfax',
    type: 'household',
    role: 'Spouse',
    reciprocalRole: 'Spouse',
    isPrimary: true,
    startDate: null,
    endDate: null,
    notes: null
  },
  // Martinez-Carter household relationships
  {
    id: 'rel-10',
    fromPatronId: 'john-martinez',
    toPatronId: 'samantha-carter',
    type: 'household',
    role: 'Spouse',
    reciprocalRole: 'Spouse',
    isPrimary: true,
    startDate: null,
    endDate: null,
    notes: null
  },
  {
    id: 'rel-11',
    fromPatronId: 'samantha-carter',
    toPatronId: 'john-martinez',
    type: 'household',
    role: 'Spouse',
    reciprocalRole: 'Spouse',
    isPrimary: true,
    startDate: null,
    endDate: null,
    notes: null
  },
  // Taylor-Thomas household relationships
  {
    id: 'rel-12',
    fromPatronId: 'lucas-taylor',
    toPatronId: 'sophia-thomas',
    type: 'household',
    role: 'Spouse',
    reciprocalRole: 'Spouse',
    isPrimary: true,
    startDate: null,
    endDate: null,
    notes: null
  },
  {
    id: 'rel-13',
    fromPatronId: 'sophia-thomas',
    toPatronId: 'lucas-taylor',
    type: 'household',
    role: 'Spouse',
    reciprocalRole: 'Spouse',
    isPrimary: true,
    startDate: null,
    endDate: null,
    notes: null
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
  
  // Sort by sortOrder (primary first, then user-defined order)
  links.sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999))
  
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

// Reorder beneficiaries for a membership (primary stays at 0)
export const reorderBeneficiaries = (membershipId, orderedPatronIds) => {
  orderedPatronIds.forEach((patronId, index) => {
    const entry = membershipBeneficiaries.find(
      mb => mb.membershipId === membershipId && mb.patronId === patronId && mb.status === 'active'
    )
    if (entry) {
      entry.sortOrder = index
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

// Map membership role IDs to display labels
const membershipRoleLabelMap = {
  'additional_adult': 'Additional Adult',
  'dependent': 'Dependent'
}

// Add a beneficiary to a membership
export const addBeneficiaryToMembership = (membershipId, patronId, membershipRole, relationship = null) => {
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
  
  // Assign sortOrder after existing active beneficiaries
  const activeBeneficiaries = membershipBeneficiaries.filter(
    mb => mb.membershipId === membershipId && mb.status === 'active'
  )
  const maxOrder = activeBeneficiaries.reduce((max, mb) => Math.max(max, mb.sortOrder ?? 0), 0)

  const newBeneficiary = {
    id: `mb-${Date.now()}`,
    membershipId,
    patronId,
    role: membershipRole,
    roleLabel: membershipRoleLabelMap[membershipRole] || membershipRole,
    canManage: false,
    addedDate: new Date().toISOString().split('T')[0],
    removedDate: null,
    status: 'active',
    sortOrder: maxOrder + 1
  }
  
  membershipBeneficiaries.push(newBeneficiary)
  
  // Optionally create household relationship (from relationship object)
  if (relationship && relationship.create) {
    const primary = getPrimaryPatronForMembership(membershipId)
    if (primary && primary.id !== patronId) {
      // Dedup: skip if an active household relationship already exists
      const existingRelationship = patronRelationships.find(
        r => r.fromPatronId === primary.id && r.toPatronId === patronId
          && r.type === 'household' && !r.endDate
      )
      if (!existingRelationship) {
        addPatronRelationship(primary.id, patronId, 'household', relationship.type, relationship.reciprocalType || null)
      }
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

  // If this is a household relationship, also add the target patron to HOUSEHOLD_MEMBERS
  if (type === 'household') {
    const fromPatron = patrons.find(p => p.id === fromPatronId)
    const toPatron = patrons.find(p => p.id === toPatronId)
    const householdId = fromPatron?.householdId || toPatron?.householdId

    if (householdId) {
      // Add target patron to household if not already a member
      const alreadyMember = HOUSEHOLD_MEMBERS.some(m => m.householdId === householdId && m.patronId === toPatronId)
      if (!alreadyMember) {
        HOUSEHOLD_MEMBERS.push({
          id: `hhm-${Date.now()}`,
          householdId,
          patronId: toPatronId,
          role: role, // e.g. 'Son', 'Child', etc.
          isPrimary: false,
          joinedDate: new Date().toISOString().split('T')[0]
        })
        // Update the patron's householdId
        if (toPatron && !toPatron.householdId) {
          toPatron.householdId = householdId
        }
      }

      // Also ensure the from patron is a member (in case of reverse add)
      const fromAlreadyMember = HOUSEHOLD_MEMBERS.some(m => m.householdId === householdId && m.patronId === fromPatronId)
      if (!fromAlreadyMember && fromPatron) {
        HOUSEHOLD_MEMBERS.push({
          id: `hhm-${Date.now()}-from`,
          householdId,
          patronId: fromPatronId,
          role: reciprocal,
          isPrimary: false,
          joinedDate: new Date().toISOString().split('T')[0]
        })
        if (!fromPatron.householdId) {
          fromPatron.householdId = householdId
        }
      }
    }
  }
  
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

// Get reciprocal role (exported for UI auto-suggest)
export const getReciprocalRole = (role) => {
  const reciprocals = {
    'Spouse': 'Spouse',
    'Partner': 'Partner',
    'Child': 'Parent',
    'Son': 'Father',
    'Daughter': 'Mother',
    'Parent': 'Child',
    'Father': 'Son',
    'Mother': 'Daughter',
    'Sibling': 'Sibling',
    'Brother': 'Sibling',
    'Sister': 'Sibling',
    'Friend': 'Friend',
    'Colleague': 'Colleague',
    'Financial Advisor': 'Client',
    'Client': 'Financial Advisor',
    'Employee': 'Employer',
    'Employer': 'Employee',
    'Board Member': 'Organization',
    'Volunteer': 'Organization'
  }
  return reciprocals[role] || role
}

// Check if an active household relationship exists between two patrons
export const hasHouseholdRelationship = (patronId1, patronId2) => {
  return patronRelationships.some(
    r => r.fromPatronId === patronId1 && r.toPatronId === patronId2
      && r.type === 'household' && !r.endDate
  )
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

// =============================================================================
// DATE SHIFTING — keeps demo dates relative to today (applied once at load time)
// =============================================================================
;[
  patrons,
  memberships,
  membershipBeneficiaries,
  membershipUsage,
  GIFTS,
  PLEDGES,
  RECURRING_PROFILES,
  GIFT_ALLOCATIONS,
  INTERACTIONS,
  ACKNOWLEDGMENTS,
  HOUSEHOLDS,
  HOUSEHOLD_MEMBERS,
  patronRelationships,
].forEach(arr => {
  const shifted = shiftDemoData(arr)
  arr.splice(0, arr.length, ...shifted)
})

// Recompute daysToRenewal dynamically from shifted validUntil dates
memberships.forEach(m => {
  if (m.validUntil) {
    m.daysToRenewal = computeDaysToRenewal(m.validUntil)
  }
})

