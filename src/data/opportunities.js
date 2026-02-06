// Opportunities data - each opportunity represents a specific "ask" for a patron
// Pipeline stages track opportunities, not patrons

export const opportunities = [
  // Anderson Collingwood - 2 opportunities
  {
    id: 'opp-001',
    patronId: 'anderson-collingwood',
    patronName: 'Anderson Collingwood',
    
    name: 'New Wing Major Gift',
    description: 'Multi-year pledge for capital campaign',
    askAmount: 50000,
    
    stage: 'cultivation',
    probability: 75,
    expectedClose: '2026-06-01',
    
    nextAction: 'Follow up re: gallery tour',
    lastContact: '2026-01-15',
    
    fund: { id: 'capital-building', name: 'Capital Building Fund' },
    campaign: { id: 'building-future', name: 'Building the Future' },
    
    assignedTo: 'Liam Johnson',
    assignedToInitials: 'LJ',
    
    status: 'open',
    closedDate: null,
    closedReason: null,
    
    createdDate: '2025-09-15',
  },
  {
    id: 'opp-002',
    patronId: 'anderson-collingwood',
    patronName: 'Anderson Collingwood',
    
    name: 'Spring Gala Table Sponsor',
    description: 'Table sponsorship for Spring Gala 2026',
    askAmount: 10000,
    
    stage: 'solicitation',
    probability: 90,
    expectedClose: '2026-03-15',
    
    nextAction: 'Send formal sponsorship invitation',
    lastContact: '2026-01-20',
    
    fund: { id: 'annual-operating', name: 'Annual Operating Fund' },
    campaign: { id: 'spring-gala-2026', name: 'Spring Gala 2026' },
    
    assignedTo: 'Liam Johnson',
    assignedToInitials: 'LJ',
    
    status: 'open',
    closedDate: null,
    closedReason: null,
    
    createdDate: '2025-12-01',
  },
  
  // Eleanor Whitfield
  {
    id: 'opp-003',
    patronId: 'eleanor-whitfield',
    patronName: 'Eleanor Whitfield',
    
    name: 'Annual Fund Leadership Gift',
    description: 'Leadership level annual fund commitment',
    askAmount: 100000,
    
    stage: 'solicitation',
    probability: 85,
    expectedClose: '2026-02-28',
    
    nextAction: 'Schedule lunch meeting',
    lastContact: '2026-02-01',
    
    fund: { id: 'annual-operating', name: 'Annual Operating Fund' },
    campaign: { id: 'annual-2026', name: '2026 Annual Fund' },
    
    assignedTo: 'Jennifer Martinez',
    assignedToInitials: 'JM',
    
    status: 'open',
    closedDate: null,
    closedReason: null,
    
    createdDate: '2025-10-01',
  },
  
  // Marcus Chen
  {
    id: 'opp-004',
    patronId: 'marcus-chen',
    patronName: 'Marcus Chen',
    
    name: 'Exhibition Sponsorship',
    description: 'Corporate sponsorship for Impressionist exhibition',
    askAmount: 50000,
    
    stage: 'cultivation',
    probability: 60,
    expectedClose: '2026-05-01',
    
    nextAction: 'Send exhibition catalog',
    lastContact: '2026-01-28',
    
    fund: { id: 'exhibitions', name: 'Exhibitions Fund' },
    campaign: { id: 'impressionist-2026', name: 'Impressionist Exhibition 2026' },
    
    assignedTo: 'Robert Brown',
    assignedToInitials: 'RB',
    
    status: 'open',
    closedDate: null,
    closedReason: null,
    
    createdDate: '2025-11-15',
  },
  
  // Patricia Hawthorne
  {
    id: 'opp-005',
    patronId: 'patricia-hawthorne',
    patronName: 'Patricia Hawthorne',
    
    name: 'Foundation Grant',
    description: 'Grant from Hawthorne Family Foundation',
    askAmount: 15000,
    
    stage: 'qualification',
    probability: 40,
    expectedClose: '2026-04-15',
    
    nextAction: 'Research foundation giving history',
    lastContact: '2025-12-20',
    
    fund: { id: 'education', name: 'Education Programs' },
    campaign: { id: 'annual-2026', name: '2026 Annual Fund' },
    
    assignedTo: 'Robert Brown',
    assignedToInitials: 'RB',
    
    status: 'open',
    closedDate: null,
    closedReason: null,
    
    createdDate: '2025-11-01',
  },
  
  // James Morrison - Stewardship (recently closed won)
  {
    id: 'opp-006',
    patronId: 'james-morrison',
    patronName: 'James Morrison',
    
    name: 'Major Gift - Building Campaign',
    description: 'Major gift pledge for new wing',
    askAmount: 75000,
    
    stage: 'stewardship',
    probability: 100,
    expectedClose: '2026-01-15',
    
    nextAction: 'Thank you call for pledge',
    lastContact: '2026-02-03',
    
    fund: { id: 'capital-building', name: 'Capital Building Fund' },
    campaign: { id: 'building-future', name: 'Building the Future' },
    
    assignedTo: 'Jennifer Martinez',
    assignedToInitials: 'JM',
    
    status: 'won',
    closedDate: '2026-01-15',
    closedReason: null,
    
    createdDate: '2025-06-01',
  },
  
  // Sarah Blackwood
  {
    id: 'opp-007',
    patronId: 'sarah-blackwood',
    patronName: 'Sarah Blackwood',
    
    name: 'First Major Gift',
    description: 'Identified through wealth screening',
    askAmount: 30000,
    
    stage: 'identification',
    probability: 20,
    expectedClose: '2026-09-01',
    
    nextAction: 'Review wealth screening results',
    lastContact: '2026-01-10',
    
    fund: { id: 'annual-operating', name: 'Annual Operating Fund' },
    campaign: { id: 'annual-2026', name: '2026 Annual Fund' },
    
    assignedTo: 'Amanda Lee',
    assignedToInitials: 'AL',
    
    status: 'open',
    closedDate: null,
    closedReason: null,
    
    createdDate: '2026-01-05',
  },
  
  // William Hartford
  {
    id: 'opp-008',
    patronId: 'william-hartford',
    patronName: 'William Hartford',
    
    name: 'Planned Giving - Bequest',
    description: 'Bequest intention for estate planning',
    askAmount: 200000,
    
    stage: 'solicitation',
    probability: 70,
    expectedClose: '2026-03-30',
    
    nextAction: 'Prepare ask proposal',
    lastContact: '2026-01-25',
    
    fund: { id: 'endowment', name: 'Endowment Fund' },
    campaign: { id: 'legacy-society', name: 'Legacy Society' },
    
    assignedTo: 'Jennifer Martinez',
    assignedToInitials: 'JM',
    
    status: 'open',
    closedDate: null,
    closedReason: null,
    
    createdDate: '2025-08-01',
  },
  
  // Diana Rothschild
  {
    id: 'opp-009',
    patronId: 'diana-rothschild',
    patronName: 'Diana Rothschild',
    
    name: 'Education Program Support',
    description: 'Support for youth education initiatives',
    askAmount: 40000,
    
    stage: 'qualification',
    probability: 50,
    expectedClose: '2026-06-15',
    
    nextAction: 'Initial qualification call',
    lastContact: '2026-02-04',
    
    fund: { id: 'education', name: 'Education Programs' },
    campaign: { id: 'annual-2026', name: '2026 Annual Fund' },
    
    assignedTo: 'Amanda Lee',
    assignedToInitials: 'AL',
    
    status: 'open',
    closedDate: null,
    closedReason: null,
    
    createdDate: '2025-12-15',
  },
  
  // Theodore Banks - Stewardship
  {
    id: 'opp-010',
    patronId: 'theodore-banks',
    patronName: 'Theodore Banks',
    
    name: 'Annual Renewal',
    description: 'Annual major gift renewal',
    askAmount: 10000,
    
    stage: 'stewardship',
    probability: 100,
    expectedClose: '2025-11-30',
    
    nextAction: 'Annual stewardship report',
    lastContact: '2025-11-15',
    
    fund: { id: 'annual-operating', name: 'Annual Operating Fund' },
    campaign: { id: 'annual-2026', name: '2026 Annual Fund' },
    
    assignedTo: 'Robert Brown',
    assignedToInitials: 'RB',
    
    status: 'won',
    closedDate: '2025-11-30',
    closedReason: null,
    
    createdDate: '2025-09-01',
  },
  
  // Victoria Sterling
  {
    id: 'opp-011',
    patronId: 'victoria-sterling',
    patronName: 'Victoria Sterling',
    
    name: 'Transformational Gift',
    description: 'Potential naming opportunity',
    askAmount: 500000,
    
    stage: 'cultivation',
    probability: 45,
    expectedClose: '2026-12-01',
    
    nextAction: 'Board member introduction',
    lastContact: '2026-01-30',
    
    fund: { id: 'capital-building', name: 'Capital Building Fund' },
    campaign: { id: 'building-future', name: 'Building the Future' },
    
    assignedTo: 'Jennifer Martinez',
    assignedToInitials: 'JM',
    
    status: 'open',
    closedDate: null,
    closedReason: null,
    
    createdDate: '2025-07-01',
  },
  
  // Margaret Chen
  {
    id: 'opp-012',
    patronId: 'margaret-chen',
    patronName: 'Margaret Chen',
    
    name: 'Annual Fund Gift',
    description: 'Annual giving commitment',
    askAmount: 5000,
    
    stage: 'qualification',
    probability: 35,
    expectedClose: '2026-05-01',
    
    nextAction: 'Review wealth screening',
    lastContact: '2025-10-05',
    
    fund: { id: 'annual-operating', name: 'Annual Operating Fund' },
    campaign: { id: 'annual-2026', name: '2026 Annual Fund' },
    
    assignedTo: 'Liam Johnson',
    assignedToInitials: 'LJ',
    
    status: 'open',
    closedDate: null,
    closedReason: null,
    
    createdDate: '2025-09-15',
  },
]

// Helper functions

export const getOpportunitiesForPatron = (patronId) => {
  return opportunities.filter(opp => opp.patronId === patronId)
}

export const getOpenOpportunitiesForPatron = (patronId) => {
  return opportunities.filter(opp => opp.patronId === patronId && opp.status === 'open')
}

export const getOpportunitiesByStage = (stage) => {
  return opportunities.filter(opp => opp.stage === stage && opp.status === 'open')
}

export const getOpenOpportunities = () => {
  return opportunities.filter(opp => opp.status === 'open')
}

export const getOpportunityById = (id) => {
  return opportunities.find(opp => opp.id === id)
}

export const getOpportunitiesByAssignee = (assignedTo) => {
  return opportunities.filter(opp => opp.assignedTo === assignedTo && opp.status === 'open')
}

// Get unique campaigns from opportunities
export const getCampaigns = () => {
  const campaignMap = new Map()
  opportunities.forEach(opp => {
    if (opp.campaign && !campaignMap.has(opp.campaign.id)) {
      campaignMap.set(opp.campaign.id, opp.campaign)
    }
  })
  return Array.from(campaignMap.values())
}

// Get unique assignees from opportunities
export const getAssignees = () => {
  const assigneeMap = new Map()
  opportunities.forEach(opp => {
    if (!assigneeMap.has(opp.assignedToInitials)) {
      assigneeMap.set(opp.assignedToInitials, {
        initials: opp.assignedToInitials,
        name: opp.assignedTo
      })
    }
  })
  return Array.from(assigneeMap.values())
}

// Calculate pipeline totals
export const getPipelineTotals = () => {
  const openOpps = getOpenOpportunities()
  return {
    count: openOpps.length,
    totalValue: openOpps.reduce((sum, opp) => sum + opp.askAmount, 0),
    weightedValue: openOpps.reduce((sum, opp) => sum + (opp.askAmount * opp.probability / 100), 0)
  }
}

// Pipeline stages (for reference)
export const PIPELINE_STAGES = [
  { id: 'identification', label: 'Identification', description: 'Prospect discovered' },
  { id: 'qualification', label: 'Qualification', description: 'Validating capacity' },
  { id: 'cultivation', label: 'Cultivation', description: 'Building relationship' },
  { id: 'solicitation', label: 'Solicitation', description: 'Ready to ask' },
  { id: 'stewardship', label: 'Stewardship', description: 'Post-gift' },
]

// Probability options for dropdowns
export const PROBABILITY_OPTIONS = [
  { value: 10, label: '10%' },
  { value: 25, label: '25%' },
  { value: 50, label: '50%' },
  { value: 75, label: '75%' },
  { value: 90, label: '90%' },
]

// =============================================================================
// MUTATION FUNCTIONS (Mock - for demo purposes)
// =============================================================================

// Generate unique ID
const generateId = () => `opp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// Add new opportunity
export const addOpportunity = (opportunityData) => {
  const newOpportunity = {
    id: generateId(),
    patronId: opportunityData.patronId,
    patronName: opportunityData.patronName,
    
    name: opportunityData.name,
    description: opportunityData.description || '',
    askAmount: opportunityData.askAmount,
    
    stage: opportunityData.stage || 'identification',
    probability: opportunityData.probability || 25,
    expectedClose: opportunityData.expectedClose,
    
    nextAction: opportunityData.nextAction || '',
    lastContact: new Date().toISOString().split('T')[0],
    
    fund: opportunityData.fund,
    campaign: opportunityData.campaign,
    
    assignedTo: opportunityData.assignedTo,
    assignedToInitials: opportunityData.assignedToInitials || opportunityData.assignedTo?.split(' ').map(n => n[0]).join(''),
    
    status: 'open',
    closedDate: null,
    closedReason: null,
    
    createdDate: new Date().toISOString().split('T')[0],
  }
  
  opportunities.push(newOpportunity)
  return newOpportunity
}

// Update existing opportunity
export const updateOpportunity = (id, updates) => {
  const index = opportunities.findIndex(opp => opp.id === id)
  if (index === -1) return null
  
  opportunities[index] = {
    ...opportunities[index],
    ...updates,
  }
  
  return opportunities[index]
}

// Update opportunity stage (convenience function for drag-and-drop)
export const updateOpportunityStage = (id, newStage) => {
  return updateOpportunity(id, { stage: newStage })
}

// Close opportunity as Won
export const closeOpportunityAsWon = (id, actualAmount = null, notes = null) => {
  const opportunity = getOpportunityById(id)
  if (!opportunity) return null
  
  const closedOpportunity = updateOpportunity(id, {
    status: 'won',
    stage: 'stewardship',
    closedDate: new Date().toISOString().split('T')[0],
    closedReason: notes || 'Gift received',
    probability: 100,
    // If actual amount differs from ask, update it
    askAmount: actualAmount || opportunity.askAmount,
  })
  
  // In a real app, this would also create a Gift record
  // For demo, we return the opportunity with a gift reference
  return {
    opportunity: closedOpportunity,
    gift: {
      id: `gift-${Date.now()}`,
      patronId: opportunity.patronId,
      patronName: opportunity.patronName,
      amount: actualAmount || opportunity.askAmount,
      date: new Date().toISOString().split('T')[0],
      fund: opportunity.fund,
      campaign: opportunity.campaign,
      opportunityId: id,
      type: 'donation',
    }
  }
}

// Close opportunity as Lost
export const closeOpportunityAsLost = (id, reason = null) => {
  return updateOpportunity(id, {
    status: 'lost',
    closedDate: new Date().toISOString().split('T')[0],
    closedReason: reason || 'Declined',
  })
}

// Log contact (updates lastContact and optionally nextAction)
export const logContact = (id, contactDate, nextAction = null) => {
  const updates = {
    lastContact: contactDate || new Date().toISOString().split('T')[0],
  }
  
  if (nextAction !== null) {
    updates.nextAction = nextAction
  }
  
  return updateOpportunity(id, updates)
}
