# Fever Zone Fundraising -- MVP Roadmap

**Author**: Andres Clavel, Product Manager
**Date**: February 7, 2026
**Status**: Planning
**Audience**: Engineering leadership, product stakeholders

---

## Executive Summary

Fever Zone Fundraising is a donor management module for Fever's back-office platform, targeting performing arts venues, museums, and cultural institutions that already use Fever for ticketing. The MVP delivers a fundraising CRM that enriches Fever's existing ticketing data with donor cultivation capabilities for individual patrons. A squad of 4 engineers (1 tech lead, 2 backend, 1 frontend) can deliver the full MVP in approximately 4 months (realistic estimate), structured across 4 delivery epics with strategic parallelization.

---

## Product Context

### Why this product exists

Fever started as a ticketing platform. Its core strength is the consumer relationship: millions of users who buy tickets, attend events, and engage with cultural experiences. But museums and cultural institutions need more than ticketing -- they need donor management. Today, these institutions run Fever for admissions alongside a separate CRM (Raiser's Edge, Tessitura, Bloomerang) for fundraising. This creates data silos: the gift officer doesn't know that a major donor attended three events last month, and the membership team doesn't know that a lapsed member just made a $5,000 donation.

The lack of a holistic patron view is a **major blocker in sales deals** with US museums. They either require integration with their existing CRM or a demonstration that Fever can handle donor management natively.

### The opportunity

Fever already has the hardest data to collect: behavioral signals (ticket purchases, event attendance, visit frequency, purchase patterns). Competitors have the fundraising workflow but lack this behavioral data. By layering donor management onto Fever's existing behavioral data, we create a unified platform that no competitor can match -- a 360-degree patron view where engagement data and giving data live side by side.

### Target market

Mid-size performing arts venues, museums, and cultural institutions (100-500 staff) that:
- Already use Fever for ticketing and admissions
- Have a development team of 2-10 people managing individual donor relationships
- Currently use a separate CRM or spreadsheets for donor tracking
- Are frustrated by the gap between their ticketing data and their fundraising data

---

## MVP Scope

### What the MVP is

A fundraising CRM that enriches Fever's ticketing data with donor management capabilities for **individual patrons**. It enables gift officers to manage their portfolio of donors, track giving and membership activity, cultivate major gift prospects through a structured pipeline, and monitor campaign performance -- all within the same platform where their ticketing and attendance data already lives.

### What the MVP is not

- Not a corporate/organization donor management tool (individual patrons only)
- Not an email marketing or communication platform (logs interactions, doesn't send them)
- Not a custom reporting engine (dashboard + CSV export, not a report builder)
- Not a wealth screening tool (placeholder UI, no third-party integration)
- Not a data migration utility (white-glove onboarding, not self-service import)

---

## Delivery Epics

The MVP is structured as 4 sequential epics. Each epic is independently demoable and delivers standalone value to the end user.

### Epic 1: Patron Data Platform

**What it delivers**: A searchable, filterable database of patrons enriched with Fever ticketing data. The core value proposition: "See everything about a patron in one place."

**Primary user**: Gift officer, development coordinator

**Key capabilities**:
- Searchable patron list with filtering, sorting, and CSV export
- Patron creation (manual entry + Fever account linking)
- Individual patron profile with contact info, photo, and tags
- Household management (group family members, navigate between profiles)
- Relationship tracking (household, professional, external contacts)
- Engagement scoring with 12-month activity heatmap (powered by Fever data)
- Flexible tagging system for patron segmentation
- Activity timeline showing all patron interactions chronologically
- Archive/restore for soft-deleting inactive patrons
- "Add to Portfolio" workflow to promote general constituents to managed prospects
- Settings page for tag management

**Dependencies**: None (this is the foundation)

### Epic 2: Giving & Membership Management

**What it delivers**: Complete financial relationship tracking. Every gift, pledge, recurring donation, and membership is visible and manageable from the patron profile.

**Primary user**: Gift officer, membership coordinator

**Key capabilities**:
- Giving summary with lifetime value, hybrid charts, and fund/campaign attribution
- Dedicated Giving tab with pledge tracking, recurring gift profiles, and full gift history
- Gift recording with fund/campaign/appeal attribution (DCAP hierarchy)
- Acknowledgment tracking (pending vs. sent, with send actions)
- Membership card display with QR code, benefits, and usage analytics
- Membership beneficiary management (add/remove family members)
- Membership upgrade workflow with tier comparison
- Tax document generation with year-end summaries and receipt history

**Dependencies**: Epic 1 (patron records must exist before tracking their giving)

### Epic 3: Fundraising Pipeline

**What it delivers**: The daily workflow tool for gift officers. A structured pipeline for cultivating major gift prospects from identification through stewardship.

**Primary user**: Gift officer, major gifts manager

**Key capabilities**:
- Opportunity creation and management (ask amount, stage, probability, campaign)
- Visual Kanban board with 5 cultivation stages and drag-and-drop
- Opportunity list view with filtering by stage, assignee, and campaign
- Detailed opportunity page with pipeline stepper and edit mode
- Close-as-Won workflow (automatically records the gift)
- Contact logging (phone calls, emails, meetings, events)
- Alert system for overdue pledge payments and pending acknowledgments

**Dependencies**: Epic 1 (patron records), but NOT Epic 2 (opportunities reference campaigns as dropdown data, not the campaign dashboard)

### Epic 4: Campaign Intelligence & Dashboard

**What it delivers**: The management reporting layer. How development directors track strategic fundraising goals and monitor team performance.

**Primary user**: Development director, VP of advancement

**Key capabilities**:
- Campaign management dashboard with goal progress tracking
- Campaign cards showing raised amount, donor count, gift count, and average gift
- Appeal-level ROI breakdown (raised vs. cost per appeal)
- Fundraising dashboard with pipeline overview, closing-soon alerts, and follow-up tracking
- Gift officer filtering (view any officer's portfolio and performance)
- Patron summary statistics across the entire database

**Dependencies**: Epics 2 and 3 (campaign reporting aggregates data from gifts and opportunities)

---

## Delivery Phasing & Parallelization

### Dependency structure

Epic 2 (Giving) and Epic 3 (Pipeline) both depend on Epic 1, but not on each other. This creates an opportunity for parallelization:

```
Phase A                    Phase B                     Phase C
┌─────────────────┐   ┌─────────────────────────┐   ┌──────────────────┐
│                 │   │ Epic 2: Giving &        │   │                  │
│  Epic 1:        │   │ Memberships             │   │  Epic 4:         │
│  Patron Data    │──>│ (1 BE + 1 FE)           │──>│  Campaign        │
│  Platform       │   ├─────────────────────────┤   │  Intelligence    │
│                 │   │ Epic 3: Fundraising     │   │  & Dashboard     │
│  (full squad)   │   │ Pipeline                │   │  (full squad)    │
│                 │   │ (1 BE + TL)             │   │                  │
└─────────────────┘   └─────────────────────────┘   └──────────────────┘
     6 weeks                 6 weeks                     3 weeks
```

### Phase A: Epic 1 (full squad)

The entire squad works together to build the patron data platform. This is the most critical phase because it establishes the data model, API patterns, search infrastructure, and Fever integration that everything else depends on. Having all 4 engineers aligned here ensures architectural decisions are shared and consistent.

### Phase B: Epic 2 + Epic 3 in parallel (split squad)

Once the patron foundation is solid, the squad splits:
- **Epic 2 team** (1 backend + 1 frontend): The giving and membership features are UI-heavy with complex data model work (DCAP hierarchy, pledge schedules, membership benefits/usage). This team needs both backend and frontend capacity.
- **Epic 3 team** (1 backend + tech lead): The pipeline is more logic-heavy (opportunity state machine, stage transitions, close-as-won gift creation). The tech lead provides architectural oversight while the backend engineer builds the API layer. Frontend work (Kanban board) can be handled by the FE engineer floating between teams.

### Phase C: Epic 4 (full squad, lighter epic)

Campaign dashboards and the fundraising overview are primarily aggregation and visualization. The data already exists from Epics 2 and 3; this phase builds the reporting layer on top. The full squad reunites for a shorter sprint to deliver the final piece.

---

## Feasibility & Timeline Estimates

### Squad composition

| Role | Count | Focus |
|------|-------|-------|
| Tech Lead | 1 | Architecture, code review, Epic 3 backend |
| Backend Engineer | 2 | API development, data model, Fever integration |
| Frontend Engineer | 1 | React UI, component library, responsive design |

### Estimates per phase

| Phase | Epic(s) | Optimistic | Realistic | Pessimistic |
|-------|---------|------------|-----------|-------------|
| **A** | Epic 1: Patron Data Platform | 4 weeks | 6 weeks | 9 weeks |
| **B** | Epic 2 + 3 (parallel) | 4 weeks | 6 weeks | 8 weeks |
| **C** | Epic 4: Campaign & Dashboard | 2 weeks | 3 weeks | 5 weeks |
| | **Total** | **10 weeks (~2.5 months)** | **15 weeks (~4 months)** | **22 weeks (~5.5 months)** |

### Without parallelization (sequential delivery)

| | Optimistic | Realistic | Pessimistic |
|---|---|---|---|
| **Total** | 13 weeks (~3 months) | 20 weeks (~5 months) | 29 weeks (~7 months) |

Parallelization saves approximately 3-7 weeks depending on execution.

### Key risk factors

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Fever API integration** | How clean is the patron data API? Is it real-time or batch? Conflict resolution for linked accounts? | Spike during Phase A week 1. If the API is messy, add 2-3 weeks to Epic 1. |
| **Membership data model** | Fever's existing membership system -- are we wrapping it or extending it? Tier/benefits/usage has many edge cases. | Align with the Memberships team early. Define the boundary clearly. |
| **Search infrastructure** | Full-text patron search at scale needs Elasticsearch or similar. | Decide build-vs-buy in Phase A. Can start with Postgres full-text and migrate later. |
| **Role-based access** | If gift officers should only see their own portfolio, that's a cross-cutting auth concern. | Defer RBAC to post-MVP unless a specific customer requires it. Use a simple "all staff see everything" model for V1. |
| **Squad availability** | Any engineer absence during Phase B (parallel work) creates a bottleneck since the squad is already split thin. | Build 1-week buffer into Phase B. Cross-train on both epics during Phase A. |

---

## What We're Not Building (and Why)

### Third-party integrations

| Feature | Why not now | Revisit when |
|---------|-----------|--------------|
| Wealth screening (DonorSearch/iWave) | Requires paid API contract; most target customers don't subscribe to these services | DonorSearch partnership established, or customer demand |
| Financial/ERP integration (QuickBooks, Sage) | Accounting infrastructure; target venues often use spreadsheets | Targeting organizations with dedicated finance teams |
| Email sending | Venues already use Mailchimp, Constant Contact, or Fever's own comms tools | Consider logging emails sent via Fever comms, not building a send engine |

### Enterprise features

| Feature | Why not now | Revisit when |
|---------|-----------|--------------|
| Corporate/organization patrons | Fever accounts are individual (1:1 person-to-account); organizations need a separate entity with different profile structure | Moving upmarket to institutions where corporate giving is 30-50% of revenue |
| Grant & foundation tracking | Specialized workflow (deadlines, deliverables, compliance) for NEA/NEH recipients | Same trigger as corporate patrons -- larger institutions |
| Custom reporting / LYBUNT-SYBUNT | Report builders are massive engineering investments; dashboard + CSV covers 80% | Customers outgrow dashboard + CSV workflow |
| User permissions (RBAC) | Requires auth system; all-staff-see-everything is acceptable for target market size | Multi-department access control becomes a requirement |

### Adjacent product areas

| Feature | Why not now | Revisit when |
|---------|-----------|--------------|
| AI / Smart Tips | Requires LLM integration, prompt engineering, guardrails; impressive in demos but not a daily workflow driver | Data platform mature enough for meaningful personalized recommendations |
| Import data processing | Every Blackbaud/Tessitura export is different; this is a services engagement (white-glove onboarding), not a product feature | Onboarding volume justifies productizing migration |
| Event/gala table seating | Complex specialized UI; Fever already handles event management | Fever's native tools don't cover gala-specific needs |
| PDF generation | Requires server-side rendering pipeline; browser print is sufficient | Tax receipt delivery becomes high-volume automated workflow |

---

## What the Prototype Has Validated

A fully functional frontend prototype has been built (React, Vite) that demonstrates every feature in the MVP scope with realistic demo data. This prototype is not production code -- it will not be shipped -- but it has produced significant artifacts that accelerate engineering delivery.

### Artifacts the engineering team inherits

| Artifact | What it provides | Estimated time saved |
|----------|-----------------|---------------------|
| **Defined data model** | 15+ entities with foreign keys, join tables, and helper functions. Entity relationships (patron-to-household, gift-to-campaign, opportunity-to-fund) are fully specified. | 1-2 weeks of data modeling and ER diagramming |
| **Component-level UI specs** | 40+ React components demonstrating exact layout, interaction patterns, and edge cases (empty states, loading states, error handling). Every modal, tab, panel, and card is designed and functional. | 2-3 weeks of UI/UX design and frontend specification |
| **Edge cases resolved** | Key architectural decisions documented with rationale: household vs. membership beneficiaries (decoupled), corporate patrons (separate entity, deferred), DCAP hierarchy (reference data), engagement scoring model. | 1 week of design debates and technical spikes |
| **Demo data as test fixtures** | 25+ patron records, 7 memberships, 12+ gifts, pledges, recurring profiles, interactions, acknowledgments, 4 households, and cross-entity relationships. Covers happy paths and edge cases. | 0.5-1 week of test data creation |
| **Product specs document** | 1,400+ line specification covering every feature, data model, design decision, competitive landscape, and implementation status. | The team starts building from day 1, not from a blank PRD |

### Total estimated acceleration

The prototype work eliminates approximately **2-3 weeks of discovery, design, and specification work** that would otherwise happen at the start of Phase A. This is factored into the timeline estimates above.

---

## Summary

| | |
|---|---|
| **Product** | Fever Zone Fundraising -- donor management for Fever's cultural institution partners |
| **MVP scope** | Individual patron CRM with giving, pipeline, and campaign management |
| **Delivery structure** | 4 epics, 3 phases (with parallelization in Phase B) |
| **Squad** | 1 TL + 2 BE + 1 FE |
| **Realistic timeline** | ~4 months (15 weeks) |
| **Timeline range** | 2.5 months (optimistic) to 5.5 months (pessimistic) |
| **Key differentiator** | Fever's behavioral data (tickets, attendance, engagement) enriches donor profiles in a way no standalone CRM can match |

---

*Product Manager: Andres Clavel*
*Designer: Pablo Rubio Retolaza*
*Tech Lead: Victor Almaraz Sanchez*
