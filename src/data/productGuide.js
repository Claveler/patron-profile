/**
 * Product Guide — contextual product reasoning for every page and tab.
 *
 * Content is distilled from:
 *   - product-management/PRD_PATRON_PROFILE.md
 *   - product-management/PRODUCT_SPECS.md
 *   - product-management/PRODUCT_STRATEGY.md
 *   - product-management/DEMO_WALKTHROUGH.md
 *
 * Each entry is keyed by route (and optionally by tab for PatronProfile).
 */

const GUIDE_CONTENT = {
  /* ─────────────────────── Dashboard ─────────────────────── */
  '/': {
    title: 'Dashboard',
    persona: 'Development Director',
    epic: 'Epic 4 — Campaign Intelligence & Dashboard',
    why:
      'The dashboard answers the daily question: "What needs my attention today?" It surfaces pipeline health, overdue follow-ups, and closing opportunities so nothing falls through the cracks. Development directors and VPs of Advancement need a single screen that replaces morning spreadsheet reviews.',
    competitive:
      'Tessitura has no real-time dashboard. Bloomerang offers one but lacks pipeline integration. Blackbaud Altru has dashboards but they are siloed from ticketing data. Fever\'s dashboard uniquely blends fundraising pipeline with behavioral attendance data.',
    wowMoment:
      'The "Follow-ups Needed" panel showing 126+ days since last contact, highlighted in red. The system surfaces overdue relationships automatically — no one falls through the cracks.',
    components: [
      {
        name: 'Quick Stats Cards',
        reasoning:
          'Four KPIs at a glance — open opportunities, pipeline value, weighted pipeline, managed prospects — give directors an instant health check without scrolling.',
      },
      {
        name: 'Pipeline Overview',
        reasoning:
          'A stage-by-stage bar chart shows where dollar value concentrates. Healthy pipelines have value in Cultivation and Solicitation; heavy Identification signals prospecting needs.',
      },
      {
        name: 'Follow-ups Needed',
        reasoning:
          'Accountability engine. Displays opportunities with no contact in 14+ days, sorted by staleness. This is the #1 feature development directors asked for in user interviews.',
      },
      {
        name: 'Closing Soon',
        reasoning:
          'Opportunities with expected close within 30 days. Forces attention on imminent asks so they don\'t slip.',
      },
      {
        name: 'Gift Officer Filter',
        reasoning:
          'Allows directors to see any gift officer\'s portfolio in isolation — critical for weekly 1:1 meetings.',
      },
    ],
  },

  /* ─────────────────────── Patrons List ─────────────────────── */
  '/patrons': {
    title: 'Patrons List',
    persona: 'Gift Officer',
    epic: 'Epic 1 — Patron Data Platform',
    why:
      'The patrons list is the front door of the CRM. Gift officers start their day here: finding patrons, triaging unassigned prospects, and identifying high-potential donors. Every column was chosen to answer the question "Who should I focus on?"',
    competitive:
      'Competitors require manual data entry to build a patron database. Fever auto-creates patron records from ticket purchases — the "NEW" badges prove this. No CSV import, no integration, no delay.',
    wowMoment:
      '"NEW" badges on recently-added patrons. These are ticket buyers who became patrons automatically — no data entry required. This is the Fever advantage.',
    components: [
      {
        name: 'Source Indicators',
        reasoning:
          'The Fever-logo dot vs. edit-icon dot instantly tells staff which patrons were auto-created from transactions vs. manually entered. This is the core "Fever advantage" story.',
      },
      {
        name: 'Engagement Column',
        reasoning:
          'Cold → On Fire engagement levels let gift officers spot cultivation-ready patrons at a glance. No competitor surfaces behavioral engagement in the list view.',
      },
      {
        name: 'Assign Button',
        reasoning:
          'Unassigned patrons show a pill-style "Assign" button. This is the bridge between passive data (General Constituent) and active cultivation (Managed Prospect).',
      },
      {
        name: 'Tags Column',
        reasoning:
          'Up to 2 tags visible + overflow. Tags replaced a single-category system for richer segmentation. The 3-tier tagging model (system + computed + custom) gives museums flexibility.',
      },
      {
        name: 'Filter Panel',
        reasoning:
          'Multi-facet filtering lets gift officers slice the database by Tags, Membership Tier, Engagement Level, Patron Type, Gift Officer, Source, Lifetime Value range, and Last Gift — including industry-standard LYBUNT/SYBUNT donor lapse segmentation. Combined with CSV export, this replaces the need for a separate report builder for most daily workflows.',
      },
      {
        name: 'Add New Patron Modal',
        reasoning:
          'Includes duplicate prevention: email uniqueness check and fuzzy name suggestions. Reduces duplicates at the point of entry while preserving staff autonomy to override.',
      },
    ],
  },

  /* ─────────────────────── Patron Profile (tabs) ─────────────────────── */
  '/patrons/:patronId': {
    tabs: {
      summary: {
        title: 'Patron Profile — Summary',
        persona: 'Gift Officer',
        epic: 'Epic 1 — Patron Data Platform',
        why:
          'The Summary tab is the 360° patron view — the single most requested feature by museum development teams. It consolidates identity, engagement, activity, relationships, and pipeline into one screen so a gift officer can prepare for a call in 30 seconds.',
        competitive:
          'Tessitura buries engagement data behind multiple clicks. Bloomerang has a good summary but lacks ticketing data. Raiser\'s Edge requires integrations to display behavioral signals. Fever\'s Summary tab natively combines giving + attendance + engagement + pipeline.',
        wowMoment: null,
        components: [
          {
            name: 'PatronInfoBox',
            reasoning:
              'The header consolidates photo, contact info, patron ID, tags popover, membership badge with role, household popover, status banners, actions dropdown, and gift officer field. It adapts based on patron type: General Constituents see "Add to Portfolio," Managed Prospects see opportunity summary.',
          },
          {
            name: 'EngagementPanel',
            reasoning:
              'Engagement scoring (Cold → On Fire) replaces gut feel with data. The 12-month activity heatmap visualizes seasonal patterns — a gift officer can see that Anderson visits heavily in fall/winter, making December the right time for an ask.',
          },
          {
            name: 'ActivityTimeline',
            reasoning:
              'Chronological log of every interaction — communications, earned revenue, contributed revenue, engagement. Multi-expand with staff attribution and direction indicators (inbound/outbound). Gift officers need this to prepare for calls: "Last time we spoke was about the gallery tour."',
          },
          {
            name: 'RelationshipsSummary',
            reasoning:
              'Shows household, personal, and professional relationships at a glance with consolidated entries. Bridging patrons (appearing in both personal and professional groups) are shown once under Professional with stacked badges. Household members with extra non-household relationships display inline badges on the household row. Professional badges use purple (#6f41d7), personal use pink — matching the graph tab\'s type-based color system. Cross-profile navigation lets gift officers understand the full relational context before a conversation.',
          },
          {
            name: 'OpportunitiesPanel / AddToPortfolioBar',
            reasoning:
              'These two components are mutually exclusive based on patron type. Managed Prospects see their active opportunities with pipeline value. General Constituents see a prompt to assign — this is the bridge between passive data and active cultivation. The two-speed system reflects how development teams actually operate.',
          },
          {
            name: 'WealthInsights / SmartTips',
            reasoning:
              'Post-MVP placeholders that demonstrate the product roadmap to stakeholders. Wealth screening (DonorSearch) and AI recommendations are Tier 4 features — important but not MVP. Showing the UI signals to prospects and the squad that we know where the product is going.',
          },
        ],
      },

      giving: {
        title: 'Patron Profile — Giving',
        persona: 'Gift Officer',
        epic: 'Epic 2 — Giving & Membership Management',
        why:
          'The Giving tab is the financial heart of the patron profile. Museums need to track every financial relationship — one-time gifts, pledges, recurring donations, and memberships — all with DCAP attribution (Fund/Campaign/Appeal). Without this, they cannot report to their boards or manage donor stewardship.',
        competitive:
          'Raiser\'s Edge and Tessitura have strong giving history but require separate modules. Bloomerang has basic gift tracking but weak campaign attribution. Fever integrates giving with membership and revenue data on the same screen, eliminating the need for cross-system reconciliation.',
        wowMoment: null,
        components: [
          {
            name: 'GivingSummary',
            reasoning:
              'Lifetime value with donations/revenue split, average gift, hybrid chart (cumulative area / nominal bars), and attribution by Fund/Campaign/Year. The hybrid chart toggle was designed because directors think in cumulative growth while gift officers think in individual period amounts.',
          },
          {
            name: 'PledgesPanel',
            reasoning:
              'Multi-year pledges are common in capital campaigns. Showing balance remaining, frequency, and next payment date helps gift officers manage pledge fulfillment and send timely reminders.',
          },
          {
            name: 'RecurringPanel',
            reasoning:
              'Monthly/quarterly recurring gifts are the most reliable revenue stream. Tracking active profiles with start dates and next charge dates ensures no lapses go unnoticed.',
          },
          {
            name: 'GiftHistoryTable',
            reasoning:
              'Every gift with DCAP attribution, type badge, acknowledgment status, and soft credits. Clicking a row opens the GiftDetailPanel slide-out with full detail — the same panel is available from the Gifts list page for consistency.',
          },
          {
            name: 'AcknowledgmentsPanel',
            reasoning:
              'Thank-you letters are legally required for gifts over $250 and best practice for all gifts. Tracking sent/pending status ensures compliance and donor stewardship. Museums report on acknowledgment turnaround time.',
          },
        ],
      },

      memberships: {
        title: 'Patron Profile — Memberships',
        persona: 'Membership Coordinator',
        epic: 'Epic 2 — Giving & Membership Management',
        why:
          'Membership is the "top of funnel" for future major donors. The Memberships tab gives staff a complete picture of a patron\'s membership lifecycle — card, benefits, usage, beneficiaries, and upgrade eligibility. It was designed for partner employees, not patron self-service.',
        competitive:
          'Tessitura has membership tracking but limited usage analytics. Bloomerang treats memberships as simple gift types without benefits tracking. Fever natively tracks visit frequency, perk redemptions, and benefit usage because the ticketing and POS data already exists.',
        wowMoment:
          'The "At Risk" warning (renewal approaching, auto-renewal OFF, low usage) combined with an empty beneficiary slot. Paul has a wife in his household who is NOT on the membership — a natural upsell conversation.',
        components: [
          {
            name: 'MembershipOverview (Card)',
            reasoning:
              'CR80-standard card with QR code, tier color, and tenure badge mirrors the physical membership card. The Key Stats Panel shows days to renewal with urgency warning, auto-renewal status, and payment method — all actionable data for retention conversations.',
          },
          {
            name: 'Benefits & Usage',
            reasoning:
              'Two-section approach: "Your Benefits" (categorized, scannable) and "Usage This Period" (trackable consumption with progress bars). This answers the staff question: "Is this member actually using their benefits?" Low usage = churn risk.',
          },
          {
            name: 'Beneficiaries',
            reasoning:
              'Family memberships are a major retention driver. The drag-and-drop reorder, role assignment, and the distinction between "membership beneficiary" and "household member" reflect how real institutions work — a daughter goes to college, you remove her from the membership but she stays in the household.',
          },
          {
            name: 'Upgrade Modal (Payment Link Workflow)',
            reasoning:
              'Because Fever Zone is partner-facing, upgrades use a payment link sent to the patron — not direct checkout. The modal shows tier comparison, new benefits, and price difference, then generates a shareable link. This respects the partner-staff boundary.',
          },
          {
            name: 'Empty State (No Membership)',
            reasoning:
              'Instead of a bland "No active membership," shows actionable tier cards with pricing and a behavioral nudge banner ("47 visits this year — membership would save them $X"). Powered by Fever\'s own engagement data, this is something no competitor can replicate.',
          },
          {
            name: 'MembershipActions',
            reasoning:
              'Grouped action panel covering the full membership lifecycle — Cancel, Pause, and Extend (lifecycle); Renew and Downgrade (tier changes); Transfer Primary (account). Each action opens a dedicated modal with multi-step confirmations, impact warnings (beneficiary effects, refund options, slot changes), and safety gates (e.g., "Type CANCEL to confirm"). Only visible to primary members, ensuring role-aware access control.',
          },
        ],
      },

      profile: {
        title: 'Patron Profile — Profile',
        persona: 'Gift Officer / Development Coordinator',
        epic: 'Epic 1 — Patron Data Platform',
        why:
          'The Profile tab is the full patron record editor. It supports an inline edit/save/cancel workflow with structured fields for personal information, contact details, professional relationships, communication preferences, and notes. The 4-status lifecycle (Active, Inactive, Deceased, Archived) with the Status Change modal handles real-world complexity.',
        competitive:
          'Most competitors use form-heavy multi-page editors. Fever\'s single-page view/edit toggle with instant save reduces clicks and keeps context visible. Professional information is derived from Relationships (single source of truth) rather than duplicated as flat fields.',
        wowMoment: null,
        components: [
          {
            name: 'Photo Section',
            reasoning:
              'Profile photos make patron records feel human. The 96px circular avatar with drag-and-drop upload, preview, and remove option follows modern UX patterns.',
          },
          {
            name: 'Professional Information (Read-Only)',
            reasoning:
              'Employer and job title are derived from Relationship records, not flat fields. This eliminates data inconsistency — if an organization relationship changes, it updates everywhere. The "Manage" link navigates to the Relationships tab.',
          },
          {
            name: 'Communication Preferences',
            reasoning:
              'GDPR/CCPA compliance requires tracking consent per channel. The "Do Not Contact" master override immediately disables all channels — a legal safeguard that must be prominent and impossible to miss.',
          },
          {
            name: 'StatusChangeModal',
            reasoning:
              'A dedicated modal for the 4 lifecycle statuses (Active, Inactive, Deceased, Archived). Each status has conditional fields (e.g., Date of Death for Deceased). A 2-step flow with confirmation and impact warning prevents accidental status changes.',
          },
        ],
      },

      timeline: {
        title: 'Patron Profile — Timeline',
        persona: 'Gift Officer',
        epic: 'Epic 1 — Patron Data Platform',
        why:
          'The Timeline tab is the complete, chronological, filterable log of all interactions. While the Summary tab shows a compact version, the full Timeline provides search, filters, and unlimited scroll — it\'s where gift officers do deep research before a meeting.',
        competitive:
          'Tessitura tracks interactions but separates them by module. Bloomerang has a good timeline but limited to donor-initiated actions. Fever\'s timeline uniquely blends staff actions (calls, meetings, emails) with system-tracked events (ticket purchases, F&B, attendance) because Fever already captures the transactional side.',
        wowMoment: null,
        components: [
          {
            name: 'Full Variant Layout',
            reasoning:
              'Search bar + Filters dropdown + "Add activity" button at the top. Loads 10 items initially, increments by 10. This matches the Figma design and handles patrons with hundreds of interactions.',
          },
          {
            name: 'Multi-Expand with Detail Context',
            reasoning:
              'Multiple timeline entries can be open simultaneously. Each expanded entry shows amount, staff attribution (initials badge), direction (inbound/outbound), opportunity chips, and order ID. This density is intentional — gift officers compare interactions side by side.',
          },
          {
            name: 'Activity Types',
            reasoning:
              '15 activity types across Communication, Earned Revenue, Contributed Revenue, and Engagement categories. Direction indicators (inbound/outbound) for communications distinguish "we called them" from "they called us" — critical for tracking cultivation cadence.',
          },
        ],
      },

      relationships: {
        title: 'Patron Profile — Relationships',
        persona: 'Gift Officer',
        epic: 'Epic 1 — Patron Data Platform',
        why:
          'Donors exist in networks. The Relationships tab maps household, personal, professional, and organization connections. Understanding that Anderson\'s sister Eleanor runs the Whitfield Gallery, or that his financial advisor is Marcus Chen, fundamentally changes the cultivation approach.',
        competitive:
          'Raiser\'s Edge has strong relationship mapping but requires a separate module. Tessitura embeds relationships but with dated UI. Bloomerang has basic household linking but no personal relationship type. Fever\'s approach groups relationships by type (household, personal, professional, organization) with cross-profile navigation, plus smart edge case handling (conflict detection, cascade removal, two-option dissolution, automatic Personal fallback so family bonds are never silently lost).',
        wowMoment: 'Try adding a patron who already belongs to another household — the system detects the conflict and lets you choose whether to transfer them or pick someone else. If they\'re the Head of a 3+ member household, it asks you to pick a successor before completing the transfer.',
        components: [
          {
            name: 'Household Section',
            reasoning:
              'Groups family members with head-of-household designation, verified badge, and cross-profile navigation. The household popover in PatronInfoBox is a compact version; this tab is the full management view with add/edit/end/move-out capabilities. Adding a household relationship that matches an existing Personal relationship (same role) automatically absorbs the Personal one — and dissolving the household recreates it via fallback. Each non-current member row has two distinct actions: dismiss (x) to sever the bond entirely, and move-out (arrow) to remove from the household while preserving family ties as Personal connections.',
          },
          {
            name: 'Household Conflict Detection',
            reasoning:
              'When adding a household relationship, detects if the selected patron already belongs to another household. Shows a warning with transfer or cancel options. If the departing patron is the Head and the old household has 3+ members, prompts the user to select a new Head before completing the transfer. Prevents silent data corruption — a patron cannot belong to two households, and no household is left without a Head.',
          },
          {
            name: 'Context-Aware End Relationship',
            reasoning:
              'End Relationship warnings adapt to household size: 2-member households show a dissolution warning, 3+ member households explain the cascade removal. Removing the Head of household triggers an additional warning. Cascade-ended relationships with other household members automatically get Personal-type fallbacks to preserve family connections.',
          },
          {
            name: 'Two-Option Household Dissolution',
            reasoning:
              'Delete household offers two distinct outcomes: "dissolve everything" ends all household relationships with no fallbacks — members vanish from the graph. "Dissolve grouping only" converts household relationships to personal type, preserving continuous history — members stay visible as Personal connections. The two options give gift officers explicit control over whether family bonds survive the dissolution.',
          },
          {
            name: 'Remove from Household',
            reasoning:
              'The move-out button (arrow icon) lets gift officers remove a member from the household unit without severing the family bond. All household relationships are soft-deleted and automatically recreated as Personal connections. Models real-world scenarios like a child leaving for college — they leave the address, not the family.',
          },
          {
            name: 'Undo / Redo',
            reasoning:
              'Snapshot-based undo/redo for all relationship actions — add, end, dissolve, transfer, move-out, and household edits. Appears as a compact toolbar in the top-left of the graph when history is available. Lets gift officers safely experiment with relationship changes and reverse mistakes without reloading.',
          },
          {
            name: 'Personal Relationships',
            reasoning:
              'Connects patrons through family bonds, friendships, mentorships, and other personal connections outside the household — e.g., siblings in separate families, friends, godparents, or neighbors. Uses pink/magenta badges and edges to visually differentiate from professional (purple) and household (blue) connections. Cross-household cards show the external patron\'s household name as a muted subtitle, giving gift officers at-a-glance context about which household unit the connected patron belongs to.',
          },
          {
            name: 'Professional & Organization Relationships',
            reasoning:
              'Financial advisors, attorneys, employers, and board affiliations use a distinct purple color scheme. Edge connector labels show the actual role name (e.g., "Client", "Managing Partner") instead of abstract categories, so the label on the connector matches the badge on the card — no cognitive overhead.',
          },
          {
            name: 'Bridging Relationship Consolidation',
            reasoning:
              'When a patron appears in both personal and professional relationship categories (e.g., Marcus Chen is both Anderson\'s friend and his financial advisory client), the graph consolidates them into a single card with stacked role badges and typed connector edges. Supports 2+ simultaneous relationships. The Summary sidebar also consolidates: Marcus appears once under Professional with both badges stacked.',
          },
          {
            name: 'Household Dual-Relationship Annotation',
            reasoning:
              'When a household member also has non-household relationships with the current patron (e.g., Marianne is both Spouse and Business Partner), the extra relationships appear as inline badges on the household member row in both the graph and the summary sidebar. No duplicate external card is created.',
          },
          {
            name: 'Unified Per-Badge Dismiss',
            reasoning:
              'Every relationship badge — on org cards, bridging cards, and household member rows — has an inline dismiss button. No card-level X buttons; the per-badge pattern is consistent everywhere. Type-scoped deletion lets a user end one relationship without affecting others on the same patron.',
          },
          {
            name: 'Type-Based Color System',
            reasoning:
              'A single getColorForType(type) function returns canonical colors: blue (#0079ca) for household, pink (#d946a8) for personal, purple (#6f41d7) for professional and organization. Colors are consistent across badges, connector edges, connector labels, and the summary sidebar. A color legend in the top-right corner of the graph dynamically shows only the types present on the current patron\'s map.',
          },
          {
            name: 'Cross-Type Duplicate Guard',
            reasoning:
              'When adding a new relationship, the modal shows an informational callout if active relationships already exist between the two patrons (across all types). Non-blocking — the user can still proceed. Prevents accidental duplicates while supporting legitimate multi-type relationships.',
          },
          {
            name: 'Keyboard Accessibility',
            reasoning:
              'All clickable graph cards (org, bridging, household member rows) have role="button", tabIndex, and Enter/Space keyboard handlers, matching the pattern already used in RelationshipsSummary. Ensures gift officers can navigate the relationship map without a mouse.',
          },
        ],
        walkthrough: {
          sections: [
            {
              id: 'overview',
              title: 'Graph Overview',
              steps: [
                {
                  title: 'Relationship Graph',
                  description:
                    'The graph displays all relationship types color-coded: blue for Household, pink for Personal, purple for Professional/Organization. A legend in the top-right shows which types are present. The central patron sits inside the household card (if they belong to one), with external connections branching outward.',
                  media: '/screenshots/relationships/09-graph-fitview.png',
                  mediaType: 'image',
                },
                {
                  title: 'Bridging Cards & Staggered Routing',
                  description:
                    'When a patron has both personal and professional relationships (e.g., Marcus Chen as Friend + Client + Mentor), the graph consolidates them into a single bridging card with stacked role badges. Each connector edge arrives at a different vertical offset to prevent overlap.',
                  media: '/screenshots/relationships/01-graph-overview.png',
                  mediaType: 'image',
                },
                {
                  title: 'Edge Labels & Color Coding',
                  description:
                    'Connector edges display the role name (e.g., "Spouse", "Sister", "Client") as an inline label, color-matched to the relationship type. This keeps the graph self-documenting — no need to hover or click to understand each connection.',
                  media: '/screenshots/relationships/14-edge-labels.png',
                  mediaType: 'image',
                },
                {
                  title: 'Empty State',
                  description:
                    'Patrons with no relationships see a centered "No Relationships Mapped" message with a prominent "+ Add relationship" CTA. The empty state helps onboard new patrons into the relationship graph.',
                  media: '/screenshots/relationships/12-empty-state.png',
                  mediaType: 'image',
                },
              ],
            },
            {
              id: 'add-relationship',
              title: 'Adding Relationships',
              steps: [
                {
                  title: '1. Choose Relationship Type',
                  description:
                    'Click "+ Add relationship" to open the type selector. Four types are available: Household (spouse, child, parent living together), Personal (family, friends, mentors), Professional (financial advisor, attorney), and Organization (employer, board, volunteer affiliation).',
                  media: '/screenshots/relationships/02a-add-type-selection.png',
                  mediaType: 'image',
                },
                {
                  title: '2. Search for Patron',
                  description:
                    'Type a name or email to search existing patrons. Results show avatar, name, email, and whether they belong to a household. Select the patron to proceed to role assignment.',
                  media: '/screenshots/relationships/02b-add-search-results.png',
                  mediaType: 'image',
                },
                {
                  title: '3. Assign Roles',
                  description:
                    'Choose the role that describes how the selected patron relates to the current patron. The system auto-fills the reciprocal role based on gender (e.g., Father → Son, Mother → Daughter). Both dropdowns are editable.',
                  media: '/screenshots/relationships/02c-add-roles-step.png',
                  mediaType: 'image',
                },
                {
                  title: '4. Gender-Aware Reciprocal Roles',
                  description:
                    'When selecting a gendered role like "Father", the system auto-suggests the correct reciprocal ("Son" for male, "Daughter" for female) based on the target patron\'s gender field. Gender-neutral roles like "Sibling" or "Friend" map to the same role on both sides.',
                  media: '/screenshots/relationships/02d-gender-reciprocal.png',
                  mediaType: 'image',
                },
                {
                  title: 'Adding an Organization',
                  description:
                    'Organization relationships link patrons to their employers, boards, or volunteer affiliations. The search shows organization records, and the role field uses titles like "Managing Partner" or "Board Member".',
                  media: '/screenshots/relationships/11-add-org-search.png',
                  mediaType: 'image',
                },
              ],
            },
            {
              id: 'household-management',
              title: 'Household Management',
              steps: [
                {
                  title: 'Edit Household',
                  description:
                    'Click "Edit household" to rename the household, change the Head of household (radio selection), or delete the household. The current Head is marked with a "Current" badge. All members are listed with their roles.',
                  media: '/screenshots/relationships/03a-edit-household.png',
                  mediaType: 'image',
                },
                {
                  title: 'Dissolve Household — Option A: End Everything',
                  description:
                    'Click "Delete household" to reveal dissolution options. Option A (default): "Dissolve household and end all family relationships" — removes the household and marks all relationships between members as ended. Members disappear from the graph.',
                  media: '/screenshots/relationships/03b-dissolve-options.png',
                  mediaType: 'image',
                },
                {
                  title: 'After Dissolve Everything',
                  description:
                    'Result: the household card is gone. Marianne and Josiah are removed entirely. Anderson becomes a standalone node. The legend no longer shows blue Household — only Personal (pink) and Professional (purple) remain. Undo/redo buttons appear.',
                  media: '/screenshots/relationships/03b-after-dissolve-all.png',
                  mediaType: 'image',
                },
                {
                  title: 'Dissolve Household — Option B: Keep Records',
                  description:
                    'Option B: "Dissolve household but keep relationship records" — removes only the household grouping. Individual family relationships are converted to Personal type and remain active. Members stay visible on the graph as personal connections.',
                  media: '/screenshots/relationships/03c-dissolve-keep-rels.png',
                  mediaType: 'image',
                },
                {
                  title: 'After Keep Records',
                  description:
                    'Result: the household card dissolves but all members remain visible as standalone Personal cards — Marianne (Spouse), Josiah (Son), Eleanor (Sister). Pink badges confirm relationships were preserved. Compare with Option A where members vanish.',
                  media: '/screenshots/relationships/03c-after-keep-rels.png',
                  mediaType: 'image',
                },
                {
                  title: 'Remove from Household (Move Out)',
                  description:
                    'The arrow icon on each household member row removes that member from the household without severing the family bond. Household relationships are soft-deleted and automatically recreated as Personal connections — modeling real-world scenarios like a child leaving for college.',
                  media: '/screenshots/relationships/07-move-out-modal.png',
                  mediaType: 'image',
                },
                {
                  title: 'After Move Out',
                  description:
                    'Result: Josiah leaves the household card and appears as a standalone Personal card with a "Son" badge. The household card now shows only Anderson and Marianne. The family bond is preserved — Josiah just lives independently.',
                  media: '/screenshots/relationships/07-after-move-out.png',
                  mediaType: 'image',
                },
              ],
            },
            {
              id: 'edge-cases',
              title: 'Edge Cases & Safety',
              steps: [
                {
                  title: 'Cross-Household Conflict',
                  description:
                    'Adding a patron who already belongs to another household triggers a conflict modal. The system warns about the existing household, explains if transfer would dissolve it (when only one member would remain), and offers "Transfer to this household" or "Choose different contact".',
                  media: '/screenshots/relationships/05-cross-household-conflict.png',
                  mediaType: 'image',
                },
                {
                  title: 'End Relationship — 3+ Member Household',
                  description:
                    'Ending a household relationship in a 3+ member household warns about cascade removal: the departing member\'s relationships with ALL household members will be ended (not just with the current patron). The system also explains that removed relationships get Personal-type fallbacks.',
                  media: '/screenshots/relationships/06-end-rel-3member.png',
                  mediaType: 'image',
                },
                {
                  title: 'After Ending — 3+ Member Cascade',
                  description:
                    'Result: Josiah is removed from the household. The household card shrinks to Anderson + Marianne only. All other connections (Eleanor, Marcus, Collingwood Capital Partners) are unaffected. The cascade only touches the departing member.',
                  media: '/screenshots/relationships/06-after-end-rel-3member.png',
                  mediaType: 'image',
                },
                {
                  title: 'End Relationship — 2-Member Household (Dissolution)',
                  description:
                    'In a 2-member household, ending the only relationship triggers a dissolution warning: both patrons will become standalone. The system clearly states this only removes the CRM relationship, not shared memberships — use the Memberships tab for beneficiary access.',
                  media: '/screenshots/relationships/08-end-rel-2member.png',
                  mediaType: 'image',
                },
                {
                  title: 'After 2-Member Dissolution',
                  description:
                    'Result: the graph shows the empty state — "No Relationships Mapped". The household and its sole remaining member\'s connection are both gone. The patron is now completely standalone with an "Add relationship" prompt.',
                  media: '/screenshots/relationships/08-after-end-rel-2member.png',
                  mediaType: 'image',
                },
                {
                  title: 'Undo / Redo',
                  description:
                    'All relationship actions (add, end, dissolve, transfer, move-out, household edits) support undo/redo. A compact toolbar appears in the top-left of the graph when action history exists. Gift officers can safely experiment with changes and reverse mistakes.',
                  media: '/screenshots/relationships/13-undo-toast.png',
                  mediaType: 'image',
                },
              ],
            },
          ],
        },
      },

      documents: {
        title: 'Patron Profile — Documents',
        persona: 'Development Coordinator',
        epic: 'Epic 2 — Giving & Membership Management',
        why:
          'US nonprofits must provide year-end tax summaries to donors. The Documents tab generates consolidated tax documents with proper deductibility calculations (gift amount minus fair market value of benefits received). Come January, this saves hours of manual work.',
        competitive:
          'Bloomerang pioneered easy tax documentation for small nonprofits. Raiser\'s Edge requires extensive configuration. Fever\'s approach follows Bloomerang\'s simplicity while integrating membership payments (partially deductible) alongside donations (fully deductible) — something Bloomerang cannot do natively because it lacks membership management.',
        wowMoment: null,
        components: [
          {
            name: 'TaxSummary',
            reasoning:
              'Year-end summary generator with preview. Shows organization info (name, EIN), patron info, itemized contributions with type badges (Membership vs. Donation), and legal disclaimer. Actions: Copy Link, Download PDF, Send via Email.',
          },
          {
            name: 'DocumentHistory',
            reasoning:
              'Chronological log of all documents generated for this patron with sent/not-sent status. Ensures compliance and prevents duplicate sends.',
          },
        ],
      },
    },
  },

  /* ─────────────────────── Gifts List ─────────────────────── */
  '/gifts': {
    title: 'Gifts',
    persona: 'Gift Officer / Development Director',
    epic: 'Epic 2 — Giving & Membership Management',
    why:
      'The Gifts page provides a cross-organization view of all giving. While the patron profile shows individual giving history, this page answers organization-wide questions: "How much did we raise this month?", "Which gifts are unacknowledged?", "What\'s our average gift size by campaign?"',
    competitive:
      'All competitors have gift list views. Fever\'s advantage is the slide-out detail panel (same GiftDetailPanel from the patron profile) providing full DCAP attribution, tax info, and soft credits without navigating away from the list.',
    wowMoment:
      'Navigating from a single patron\'s giving history to a cross-organization view of all 113 gifts — searchable, filterable, sortable — with the same slide-out detail panel available from every row.',
    components: [
      {
        name: 'Summary Stats',
        reasoning:
          'Total gifts count, total amount, and average gift update live as filters are applied. This provides instant feedback on any segment.',
      },
      {
        name: 'Filter System',
        reasoning:
          'Date range, gift type (multi-select), fund, campaign, amount range, and acknowledgment status. Filter chips show active filters with individual remove. Designed for ad-hoc reporting until a full reporting module is built.',
      },
      {
        name: 'GiftDetailPanel',
        reasoning:
          'The same slide-out panel used in the patron\'s Giving tab and Timeline tab. Consistency across contexts reduces cognitive load. Full DCAP attribution, tax breakdown, soft credits, linked pledges/recurring profiles, and acknowledgment status in one panel.',
      },
    ],
  },

  /* ─────────────────────── Opportunities (Pipeline + List) ─────────────────────── */
  '/opportunities': {
    title: 'Opportunities (Pipeline)',
    persona: 'Major Gifts Manager',
    epic: 'Epic 3 — Fundraising Pipeline',
    why:
      'The Opportunities page is the "Moves Management" pipeline — the structured process of cultivating major gifts. It tracks Opportunities (specific asks), not patrons directly. A single donor can have multiple active opportunities across different campaigns. The Kanban and List views serve different workflows: visual pipeline health vs. detailed filtering.',
    competitive:
      'Raiser\'s Edge tracks "Actions" (interactions) but lacks a visual pipeline. Tessitura has proposals but no Kanban view. Bloomerang has no pipeline at all. Fever\'s opportunity-based architecture with 5 stages (Identification → Stewardship) and drag-and-drop matches modern sales CRM patterns that fundraisers increasingly expect.',
    wowMoment: null,
    components: [
      {
        name: 'Kanban Board (Pipeline View)',
        reasoning:
          'Five stages: Identification, Qualification, Cultivation, Solicitation, Stewardship. Each card shows patron name, ask amount, next action, and contact staleness. Drag-and-drop between stages updates the opportunity record. Pipeline totals per stage and overall.',
      },
      {
        name: 'List View',
        reasoning:
          'Table format for filtering and sorting by stage, campaign, assignee, probability, and expected close date. Color-coded staleness indicators surface overdue contacts. Better for bulk review and reporting.',
      },
      {
        name: 'Campaign & Assigned To Filters',
        reasoning:
          'Directors filter by campaign to see pipeline health per initiative. Gift officers filter by their own name to see their portfolio. These two filters serve different personas on the same page.',
      },
    ],
  },

  /* ─────────────────────── Opportunity Detail ─────────────────────── */
  '/opportunities/:oppId': {
    title: 'Opportunity Detail',
    persona: 'Major Gifts Manager',
    epic: 'Epic 3 — Fundraising Pipeline',
    why:
      'Each opportunity represents a specific ask to a specific patron. The detail page shows everything needed to advance the cultivation: stage progress, ask/weighted amounts, contact history, and next action. The "Close as Won" workflow is the culmination of the pipeline — it creates a gift record and completes the lifecycle.',
    competitive:
      'No competitor in the museum space offers a dedicated opportunity detail page with pipeline stepper and close-as-won workflow. This is adapted from Salesforce-style CRM patterns that major gift teams increasingly demand.',
    wowMoment:
      'The "Close as Won" modal pre-fills the gift amount from the ask, shows campaign attribution, and explains: "This will create a gift record for $50,000 attributed to Building the Future and move the opportunity to Stewardship." One click completes the cycle.',
    components: [
      {
        name: 'Pipeline Stepper',
        reasoning:
          'Visual progress indicator showing which of the 5 stages are complete. Gift officers can see at a glance whether an opportunity is early-stage or ready to close.',
      },
      {
        name: 'Close as Won / Close as Lost',
        reasoning:
          '"Close as Won" creates a gift record with inherited DCAP attribution — the lifecycle from prospect identification to gift receipt is captured. "Close as Lost" preserves the opportunity for analysis (why did we lose it?) without creating a gift. Both are essential for pipeline reporting.',
      },
      {
        name: 'Contact Section',
        reasoning:
          'Last contact date with staleness indicator. Every touchpoint (calls, meetings, emails) is logged. This keeps gift officers accountable and helps managers coach their teams.',
      },
    ],
  },

  /* ─────────────────────── Campaigns ─────────────────────── */
  '/campaigns': {
    title: 'Campaign Management',
    persona: 'Development Director / VP of Advancement',
    epic: 'Epic 4 — Campaign Intelligence & Dashboard',
    why:
      'Campaign dashboards answer the board-level question: "Are we on track?" Each campaign card shows goal progress, donor count, gift count, and average gift. The Appeal ROI breakdown (raised vs. cost) helps directors allocate marketing budget. Active vs. completed grouping provides both forward-looking and historical context.',
    competitive:
      'Raiser\'s Edge has strong campaign reporting but requires extensive configuration. Tessitura buries campaign data in reports. Bloomerang has basic campaign tracking. Fever\'s card-based grid dashboard with expandable appeal ROI provides instant visual comprehension.',
    wowMoment:
      'The 2025 Annual Fund completed campaign showing 102% of goal with a green "Goal Met" badge, displayed alongside active campaigns. Past performance validates the system; active campaigns show where you\'re headed.',
    components: [
      {
        name: 'Campaign Cards',
        reasoning:
          'Each card is self-contained: goal, progress bar, donor count, gift count, average gift, date range, and manager. Cards are the right abstraction because campaigns are discrete initiatives, not table rows.',
      },
      {
        name: 'Appeal ROI Breakdown',
        reasoning:
          'Expandable section on each card showing raised vs. cost for each appeal (Spring Gala, Year-End Mailer, etc.). This is the data directors use to decide "should we repeat this appeal next year?"',
      },
      {
        name: 'Aggregate Totals',
        reasoning:
          'Header shows total goal, total raised, and overall progress across all campaigns. Development directors use this for board presentations and quarterly reviews.',
      },
    ],
  },

  /* ─────────────────────── Settings ─────────────────────── */
  '/settings': {
    title: 'Settings',
    persona: 'Development Director / Admin',
    epic: 'Epic 1 — Patron Data Platform',
    why:
      'The Settings page manages the global tag configuration that powers patron segmentation. The 3-tier tagging model (system tags, computed tags with configurable thresholds, and custom tags) gives museums flexibility while maintaining data integrity. The Import Data wizard (mockup) demonstrates the onboarding story.',
    competitive:
      'Bloomerang has simple tag management. Raiser\'s Edge has over-engineered configuration. Fever\'s approach sits in between: system tags are predefined and immutable, computed tags auto-derive from data with editable thresholds (e.g., Major Donor = $10K+), and custom tags are fully user-managed.',
    wowMoment: null,
    components: [
      {
        name: 'System Tags',
        reasoning:
          'Predefined tags (Prospect, Board Member, Volunteer, etc.) with usage counts. Labels are editable but tags can\'t be deleted — this prevents accidental loss of patron segmentation.',
      },
      {
        name: 'Computed Tags',
        reasoning:
          'Auto-derived from giving data: Donor (totalGifts > 0), Major Donor (totalGifts >= $10,000), Lapsed Donor (no gift in 18 months). Thresholds are configurable per organization — what counts as a "Major Donor" varies widely by institution size.',
      },
      {
        name: 'Custom Tags',
        reasoning:
          'Full CRUD for organization-specific tags ("Gala 2026 Prospect", "Museum Circle"). Delete confirmation warns if the tag is in use. Usage counts help admins audit before deleting.',
      },
      {
        name: 'Import Data Wizard (Mockup)',
        reasoning:
          'A 3-step wizard for importing from Blackbaud, Tessitura, or CSV. This is a UI mockup only — actual import is post-MVP. Showing it in the demo proves we understand the onboarding pain point and have a plan.',
      },
    ],
  },
}

export default GUIDE_CONTENT
