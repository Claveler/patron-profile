/**
 * Epic Scope — centralized mapping of features to delivery epics.
 *
 * Each feature has a minimum epic number. A feature is "in scope" when
 * activeEpic >= its minimum epic.  The special value 5 means post-MVP
 * (only visible when activeEpic is Infinity, i.e. "All").
 *
 * Source: product-management/MVP_ROADMAP.md
 */

export const EPIC_SCOPE = {
  /* ── Sidebar navigation items ─────────────────────────────── */
  sidebar: {
    Dashboard: 4,
    Patrons: 1,
    Gifts: 2,
    Opportunities: 3,
    Campaigns: 4,
    'Donation Prompts': 4,
    'Donation Pages': 4,
    Settings: 1,
  },

  /* ── Routes ────────────────────────────────────────────────── */
  routes: {
    '/': 4,
    '/patrons': 1,
    '/patrons/:patronId': 1,
    '/gifts': 2,
    '/opportunities': 3,
    '/opportunities/:oppId': 3,
    '/campaigns': 4,
    '/settings': 1,
  },

  /* ── Patron Profile tabs ───────────────────────────────────── */
  patronTabs: {
    summary: 1,
    giving: 2,
    memberships: 2,
    profile: 1,
    timeline: 1,
    relationships: 1,
    documents: 2,
  },

  /* ── Summary tab components ────────────────────────────────── */
  summaryComponents: {
    GivingSummary: 2,
    OpportunitiesPanel: 3,
    EngagementPanel: 1,
    ActivityTimeline: 1,
    RelationshipsSummary: 1,
    WealthInsights: 5,      // post-MVP
    SmartTips: 5,            // post-MVP
    AddToPortfolioBar: 1,
  },

  /* ── Dashboard widgets ─────────────────────────────────────── */
  dashboardWidgets: {
    quickStats: 4,
    pipelineOverview: 3,
    closingSoon: 3,
    followUpsNeeded: 3,
    quickActions: 1,
    patronSummary: 1,
  },
}

/**
 * Labels for the stepper UI.
 * value = Infinity means "show everything including post-MVP".
 */
export const EPIC_LABELS = [
  { value: 1, label: 'Epic 1', subtitle: 'Patron Data' },
  { value: 2, label: 'Epic 2', subtitle: 'Giving' },
  { value: 3, label: 'Epic 3', subtitle: 'Pipeline' },
  { value: 4, label: 'Epic 4', subtitle: 'Campaigns' },
  { value: Infinity, label: 'All', subtitle: 'Full Vision' },
]

/**
 * Check whether a feature is in scope for the active epic.
 * @param {number} minEpic  The minimum epic required for this feature.
 * @param {number} activeEpic  The currently selected epic (Infinity = All).
 * @returns {boolean}
 */
export function isInScope(minEpic, activeEpic) {
  return minEpic <= activeEpic
}
