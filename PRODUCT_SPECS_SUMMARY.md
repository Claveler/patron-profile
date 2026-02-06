# Fever Zone - Museum Relationship Platform

## Product Summary

Transform Fever from a ticketing platform into a **360° Patron Management System** that consolidates all museum-patron interactions into a unified platform.

---

## Key Capabilities

### 1. Unified Patron Profile
- **PatronInfoBox**: Complete identity, contact info, membership status, assigned relationship manager
- **Activity Timeline**: Chronological log of all interactions (donations, tickets, events, communications)
- **Engagement Scoring**: Visual 5-level indicator (Cold → On Fire) with activity heatmap
- **Wealth Insights**: Integration placeholder for DonorSearch prospect research

### 2. Two-Speed Patron Management

| Type | Definition | Features |
|------|------------|----------|
| **General Constituent** | No `assignedTo` | Automated campaigns, "Add to Portfolio" prompt |
| **Managed Prospect** | Has `assignedTo` | OpportunitiesPanel, opportunity summary in header, "Create Opportunity" action |

### 3. Opportunity-Based Moves Management
- **Opportunities as Entities**: Each potential gift is a distinct record (not an attribute on the patron)
- **Multiple Opportunities per Patron**: Track Annual Fund + Capital Campaign simultaneously
- **Pipeline Kanban**: 5 stages (Identification → Qualification → Cultivation → Solicitation → Stewardship)
- **OpportunitiesList**: Global table view with filters (Stage, Campaign, Assignee, Status)
- **OpportunityDetail**: Full edit page with pipeline stepper, close actions
- **Lifecycle**: "Close as Won" creates Gift record; "Close as Lost" preserves for analysis

### 4. Campaign Management (DCAP Hierarchy)
- **Fund → Campaign → Appeal → Package** structure
- **Campaign Dashboard**: Goal progress, donor count, appeals ROI
- **Opportunity-Campaign Link**: Every opportunity tied to a campaign for pipeline reporting
- **Attribution**: Gifts inherit Fund/Campaign/Appeal when opportunity closes

### 5. Membership Management
- **Digital Membership Card**: CR80 format with QR code, tier-based styling
- **Benefits Tracking**: Categorized benefits with usage meters
- **Upgrade Flow**: Payment link workflow (partner-facing, not patron self-service)
- **Early Access Events**: Member-exclusive event windows

### 6. Tax Documentation
- **Year-End Tax Summary**: Consolidated PDF with itemized contributions
- **FMV Calculation**: Membership deductibility (payment minus fair market value)
- **Document History**: All generated receipts and summaries

---

## Navigation Structure

```
Fever Zone
├── Fundraising
│   ├── Patrons (list → profile)
│   ├── Opportunities (list → detail)
│   ├── Pipeline (Kanban board)
│   └── Campaigns (dashboard)
└── [Other sections...]
```

---

## Entity Relationships

```
PATRON (has assignedTo?) 
    └── has 0-many → OPPORTUNITY (stage, askAmount, probability, campaign)
                          └── closes as → GIFT (attributed to Fund/Campaign/Appeal)
```

### Key Entities

| Entity | Purpose | Key Fields |
|--------|---------|------------|
| **Patron** | The constituent record | id, assignedTo, giving, engagement |
| **Opportunity** | A specific potential gift | patronId, name, askAmount, stage, probability, expectedClose, campaign, status |
| **Campaign** | Strategic fundraising goal | name, fund, goal, raised, startDate, endDate |
| **Gift** | Completed donation | patronId, amount, fund, campaign, appeal, date |
| **Fund** | Accounting destination | Annual Operating, Capital, Education, Endowment |
| **Appeal** | Marketing trigger | Spring Gala, Year-End Mailer, Website Donate |

---

## Competitive Positioning

Targets museums currently using Tessitura, Raiser's Edge, or Bloomerang with:

- **Modern UI** vs. dated legacy systems
- **Native ticketing integration** (Fever's core strength)
- **Opportunity-based pipeline** (industry standard architecture)
- **Unified constituent view** across all touchpoints

---

## Current Implementation Status

| Feature | Status |
|---------|--------|
| Unified 360° View | Mockup Complete |
| Campaign Management | Mockup Complete |
| Membership Management | Mockup Complete |
| Moves Management (Opportunities) | Mockup Complete |
| Prospect Research | Placeholder |
| Tax Documentation (FMV) | Mockup Complete |
| Household Mapping | Partial |
| Grant Tracking | Not Started |
| Event/Gala Management | Partial |
| Financial Integration | Not Started |
| Custom Reporting | Not Started |

---

*Last Updated: February 6, 2026*
