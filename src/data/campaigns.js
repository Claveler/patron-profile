// Campaign and Fund data with DCAP hierarchy
// DCAP = Designation (Fund) → Campaign → Appeal → Package

// =============================================================================
// FUNDS - The accounting destinations
// =============================================================================

export const FUNDS = [
  { id: 'annual-operating', name: 'Annual Operating Fund', type: 'unrestricted' },
  { id: 'capital-building', name: 'Capital Building Fund', type: 'restricted' },
  { id: 'education', name: 'Education Programs Fund', type: 'restricted' },
  { id: 'exhibitions', name: 'Exhibitions Fund', type: 'restricted' },
  { id: 'endowment', name: 'Endowment Fund', type: 'endowment' },
  { id: 'restricted', name: 'Restricted Funds', type: 'restricted' },
]

// =============================================================================
// CAMPAIGNS - Strategic fundraising goals
// =============================================================================

export const CAMPAIGNS = [
  {
    id: 'annual-2026',
    name: '2026 Annual Fund',
    fund: { id: 'annual-operating', name: 'Annual Operating Fund' },
    status: 'active',
    goal: 500000,
    raised: 215000,
    donorCount: 142,
    giftCount: 187,
    avgGift: 1150,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    manager: 'Jennifer Martinez',
    appeals: [
      { id: 'year-end-mailer', name: 'Year-End Direct Mail', raised: 85000, cost: 12000, responses: 234 },
      { id: 'spring-gala', name: 'Spring Gala 2026', raised: 95000, cost: 25000, responses: 156 },
      { id: 'membership-renewal', name: 'Membership Renewal', raised: 35000, cost: 2000, responses: 89 },
      { id: 'online-giving', name: 'Online Giving', raised: 0, cost: 0, responses: 0 },
    ]
  },
  {
    id: 'building-future',
    name: 'Building the Future',
    fund: { id: 'capital-building', name: 'Capital Building Fund' },
    status: 'active',
    goal: 50000000,
    raised: 2750000,
    donorCount: 47,
    giftCount: 63,
    avgGift: 43651,
    startDate: '2025-01-01',
    endDate: '2028-12-31',
    manager: 'Liam Johnson',
    appeals: [
      { id: 'capital-kickoff', name: 'Campaign Kickoff', raised: 1500000, cost: 45000, responses: 28 },
      { id: 'leadership-gifts', name: 'Leadership Gifts Circle', raised: 1000000, cost: 8000, responses: 12 },
      { id: 'capital-mailer', name: 'Capital Campaign Mailer', raised: 250000, cost: 15000, responses: 23 },
    ]
  },
  {
    id: 'education-2026',
    name: 'Education Initiative 2026',
    fund: { id: 'education', name: 'Education Programs Fund' },
    status: 'active',
    goal: 150000,
    raised: 67500,
    donorCount: 89,
    giftCount: 112,
    avgGift: 603,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    manager: 'Robert Brown',
    appeals: [
      { id: 'school-partnership', name: 'School Partnership Drive', raised: 42000, cost: 3500, responses: 67 },
      { id: 'summer-camp', name: 'Summer Camp Sponsorships', raised: 25500, cost: 1500, responses: 45 },
    ]
  },
  {
    id: 'spring-gala-2026',
    name: 'Spring Gala 2026',
    fund: { id: 'annual-operating', name: 'Annual Operating Fund' },
    status: 'active',
    goal: 200000,
    raised: 45000,
    donorCount: 12,
    giftCount: 15,
    avgGift: 3000,
    startDate: '2026-01-01',
    endDate: '2026-04-30',
    manager: 'Jennifer Martinez',
    appeals: [
      { id: 'gala-sponsorship', name: 'Sponsorship Packages', raised: 35000, cost: 2000, responses: 8 },
      { id: 'gala-tickets', name: 'Ticket Sales', raised: 10000, cost: 500, responses: 40 },
    ]
  },
  {
    id: 'impressionist-2026',
    name: 'Impressionist Exhibition 2026',
    fund: { id: 'exhibitions', name: 'Exhibitions Fund' },
    status: 'active',
    goal: 100000,
    raised: 25000,
    donorCount: 8,
    giftCount: 10,
    avgGift: 2500,
    startDate: '2026-01-01',
    endDate: '2026-08-31',
    manager: 'Robert Brown',
    appeals: [
      { id: 'exhibition-sponsor', name: 'Exhibition Sponsorship', raised: 25000, cost: 1000, responses: 8 },
    ]
  },
  {
    id: 'legacy-society',
    name: 'Legacy Society',
    fund: { id: 'endowment', name: 'Endowment Fund' },
    status: 'active',
    goal: 1000000,
    raised: 350000,
    donorCount: 15,
    giftCount: 18,
    avgGift: 19444,
    startDate: '2025-01-01',
    endDate: '2027-12-31',
    manager: 'Jennifer Martinez',
    appeals: [
      { id: 'planned-giving', name: 'Planned Giving Program', raised: 200000, cost: 5000, responses: 12 },
      { id: 'bequest-society', name: 'Bequest Society', raised: 150000, cost: 2000, responses: 6 },
    ]
  },
  {
    id: 'annual-2025',
    name: '2025 Annual Fund',
    fund: { id: 'annual-operating', name: 'Annual Operating Fund' },
    status: 'completed',
    goal: 450000,
    raised: 459000,
    donorCount: 328,
    giftCount: 412,
    avgGift: 1114,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    manager: 'Jennifer Martinez',
    appeals: [
      { id: 'year-end-2025', name: 'Year-End 2025', raised: 180000, cost: 11000, responses: 289 },
      { id: 'spring-2025', name: 'Spring Appeal 2025', raised: 150000, cost: 8000, responses: 203 },
      { id: 'online-2025', name: 'Online Giving', raised: 129000, cost: 500, responses: 178 },
    ]
  },
  {
    id: 'emergency-2024',
    name: 'Emergency Relief Fund',
    fund: { id: 'restricted', name: 'Restricted Funds' },
    status: 'completed',
    goal: 100000,
    raised: 127500,
    donorCount: 234,
    giftCount: 267,
    avgGift: 478,
    startDate: '2024-06-01',
    endDate: '2024-12-31',
    manager: 'Amanda Lee',
    appeals: [
      { id: 'emergency-email', name: 'Emergency Email Appeal', raised: 87500, cost: 200, responses: 198 },
      { id: 'matching-grant', name: 'Matching Grant Challenge', raised: 40000, cost: 500, responses: 69 },
    ]
  },
]

// =============================================================================
// GIFT TYPES
// =============================================================================

export const GIFT_TYPES = [
  { id: 'cash', name: 'Cash' },
  { id: 'check', name: 'Check' },
  { id: 'credit-card', name: 'Credit Card' },
  { id: 'wire', name: 'Wire Transfer' },
  { id: 'stock', name: 'Stock/Securities' },
  { id: 'in-kind', name: 'In-Kind' },
  { id: 'pledge', name: 'Pledge' },
  { id: 'matching', name: 'Matching Gift' },
]

// =============================================================================
// STAFF / ASSIGNEES
// =============================================================================

export const STAFF = [
  { id: 'lj', initials: 'LJ', name: 'Liam Johnson', role: 'Major Gift Officer' },
  { id: 'jm', initials: 'JM', name: 'Jennifer Martinez', role: 'Director of Development' },
  { id: 'rb', initials: 'RB', name: 'Robert Brown', role: 'Gift Officer' },
  { id: 'al', initials: 'AL', name: 'Amanda Lee', role: 'Gift Officer' },
]

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

// Get all funds
export const getFunds = () => FUNDS

// Get fund by ID
export const getFundById = (id) => FUNDS.find(f => f.id === id)

// Get all campaigns
export const getAllCampaigns = () => CAMPAIGNS

// Get active campaigns only
export const getActiveCampaigns = () => CAMPAIGNS.filter(c => c.status === 'active')

// Get campaign by ID
export const getCampaignById = (id) => CAMPAIGNS.find(c => c.id === id)

// Get campaigns for a specific fund
export const getCampaignsForFund = (fundId) => CAMPAIGNS.filter(c => c.fund.id === fundId)

// Get appeals for a campaign
export const getAppealsForCampaign = (campaignId) => {
  const campaign = getCampaignById(campaignId)
  return campaign ? campaign.appeals : []
}

// Get unique funds from campaigns (for filters)
export const getUniqueFunds = () => {
  const funds = new Map()
  CAMPAIGNS.forEach(c => {
    if (!funds.has(c.fund.id)) {
      funds.set(c.fund.id, c.fund)
    }
  })
  return Array.from(funds.values())
}

// Get all staff
export const getAllStaff = () => STAFF

// Get staff by initials
export const getStaffByInitials = (initials) => STAFF.find(s => s.initials === initials)

// Get staff by name
export const getStaffByName = (name) => STAFF.find(s => s.name === name)

// Format currency
export const formatCurrency = (amount, compact = false) => {
  if (compact) {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`
    }
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}
