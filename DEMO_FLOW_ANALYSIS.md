# Demo Flow Analysis

## Target Audience
Museum decision-makers evaluating replacements for Tessitura, Blackbaud Altru, or Bloomerang.

## Demo Objectives
1. Show how patrons enter the system (automatic + manual)
2. Demonstrate small donation handling (ticket add-ons, online gifts)
3. Demonstrate major gift cultivation (opportunities, pipeline)
4. Show tax documentation generation
5. Explain campaign/fund/appeal structure
6. Prove we can replace their current system

---

## Proposed Demo Flow

### Act 1: "The Platform Overview" (2 min)

| Step | Screen | Status | Notes |
|------|--------|--------|-------|
| 1.1 | **Dashboard** | MISSING | Should show: pipeline summary, recent activity, tasks due, key metrics |
| 1.2 | Sidebar navigation tour | EXISTS | Quick overview of modules |

**Gap**: No dashboard. Users currently land on Patrons List. Need a home screen that shows "what needs my attention today."

---

### Act 2: "How Patrons Enter Your System" (5 min)

#### Scenario A: Automatic (Ticket Purchase)

| Step | Screen | Status | Notes |
|------|--------|--------|-------|
| 2.1 | Show ticket purchase flow (consumer side) | MISSING | Could be a simple mockup or screenshot |
| 2.2 | Show patron auto-created in system | NEEDS REFINEMENT | PatronsList exists but need to show "New" badge or recent additions |
| 2.3 | Patron Profile with ticket history | EXISTS | Summary tab shows activity |

**Gap**: Need to demonstrate the Fever advantage (automatic patron creation from tickets). Could add:
- "Recently Added" section to PatronsList
- Visual indicator showing "Created from: Ticket Purchase"
- Demo flow showing consumer purchase → patron appears

#### Scenario B: Manual Entry

| Step | Screen | Status | Notes |
|------|--------|--------|-------|
| 2.4 | Click "Add Patron" button | EXISTS (button only) | Button exists but does nothing |
| 2.5 | **Patron Creation Form** | MISSING | Form with: name, email, phone, address, tags, notes |
| 2.6 | New patron appears in list | N/A | Would work once form exists |

**Gap**: No patron creation form. Critical for demo.

---

### Act 3: "Recording Donations" (8 min)

#### Scenario A: Small Donation (Ticket Add-on)

| Step | Screen | Status | Notes |
|------|--------|--------|-------|
| 3.1 | Show donation appearing in patron timeline | EXISTS | ActivityTimeline shows donations |
| 3.2 | Show donation in GivingSummary | EXISTS | Charts and breakdowns work |
| 3.3 | Show Fund/Campaign/Appeal attribution | NEEDS REFINEMENT | Data exists but attribution UI could be clearer |

**Gap**: Need to show HOW the small donation was recorded. Options:
- Show a "ticket checkout with donation add-on" mockup
- Or show a quick "Add Gift" form for manual entry

#### Scenario B: Manual Gift Entry (Walk-in, Check, etc.)

| Step | Screen | Status | Notes |
|------|--------|--------|-------|
| 3.4 | Click "Record Gift" or "Add Donation" | MISSING | No button exists |
| 3.5 | **Gift Entry Form** | MISSING | Form needs: Amount, Date, Fund, Campaign, Appeal, Payment method, Notes, Soft credits |
| 3.6 | Gift appears in timeline and totals update | N/A | Would work once form exists |

**Gap**: No gift entry form. This is CRITICAL. Museums must be able to record:
- Check donations
- Cash donations
- Wire transfers
- In-kind gifts
- Matching gifts

---

### Act 4: "Setting Up Your Fundraising Structure" (5 min)

| Step | Screen | Status | Notes |
|------|--------|--------|-------|
| 4.1 | Navigate to Campaigns | EXISTS | CampaignManagement page |
| 4.2 | Show existing campaigns with progress | EXISTS | Cards with goals, raised, appeals |
| 4.3 | Click "New Campaign" | EXISTS (button only) | Button exists but does nothing |
| 4.4 | **Campaign Creation Form** | MISSING | Form needs: Name, Fund, Goal, Start/End dates, Description |
| 4.5 | **Fund Management Screen** | MISSING | List/create/edit Funds (accounting buckets) |
| 4.6 | **Appeal Management** | MISSING | Create appeals within campaigns |

**Gap**: No creation UI for campaigns, funds, or appeals. The DCAP hierarchy is in the data model but there's no admin interface.

**Critical Question**: Should Fund/Appeal management be:
- A. Inline in Campaign creation (simpler)
- B. Separate admin screens (more flexible, like Raiser's Edge)

---

### Act 5: "Major Gift Cultivation" (10 min)

#### Scenario: Identifying and Cultivating a Major Donor

| Step | Screen | Status | Notes |
|------|--------|--------|-------|
| 5.1 | View PatronsList, filter to find high-value patron | EXISTS | Search and filters work |
| 5.2 | Open patron profile, see giving history | EXISTS | GivingSummary, timeline work |
| 5.3 | See "Add to Portfolio" prompt (General Constituent) | EXISTS | AddToPortfolioBar shows |
| 5.4 | **Assign to Portfolio Modal** | MISSING | Need: Select gift officer, optional first opportunity |
| 5.5 | Patron now shows as Managed Prospect | NEEDS REFINEMENT | Header shows assignedTo but transition isn't demoed |

**Gap**: The "Add to Portfolio" button shows an alert. Need actual modal to assign a patron to a gift officer.

#### Scenario: Creating and Working an Opportunity

| Step | Screen | Status | Notes |
|------|--------|--------|-------|
| 5.6 | Click "Create Opportunity" | EXISTS (button only) | Multiple places have this button |
| 5.7 | **Opportunity Creation Modal** | MISSING | Form needs: Name, Ask Amount, Campaign, Expected Close, Probability, Next Action |
| 5.8 | Opportunity appears in OpportunitiesPanel | EXISTS | Panel displays opportunities |
| 5.9 | Navigate to Pipeline (Kanban) | EXISTS | MovesManagement works |
| 5.10 | Drag opportunity through stages | EXISTS | Drag-and-drop works |
| 5.11 | Click opportunity card → OpportunityDetail | EXISTS | Detail page works |
| 5.12 | Edit opportunity fields | EXISTS | Edit mode works |
| 5.13 | Log a contact/activity | EXISTS (button only) | "Log Contact" button exists |
| 5.14 | **Activity Log Modal** | MISSING | Form needs: Type (call/email/meeting), Date, Notes, Next action |
| 5.15 | Close opportunity as Won | EXISTS (button only) | Button shows alert |
| 5.16 | **Close as Won Flow** | MISSING | Should: confirm amount, create gift record, show success |

**Gaps**:
- No opportunity creation modal
- No activity logging modal
- No "Close as Won" flow that actually creates a gift

---

### Act 6: "Tax Documentation" (3 min)

| Step | Screen | Status | Notes |
|------|--------|--------|-------|
| 6.1 | Navigate to patron's Documents tab | EXISTS | Tab works |
| 6.2 | View Year-End Tax Summary | EXISTS | TaxSummary component |
| 6.3 | See itemized contributions with deductibility | EXISTS | Table with amounts |
| 6.4 | Click "Send via Email" | EXISTS (button only) | Button exists |
| 6.5 | Click "Download PDF" | EXISTS (button only) | Button exists |
| 6.6 | View Document History | EXISTS | DocumentHistory component |

**Status**: This section is fairly complete for demo purposes. Buttons don't actually send/download but that's acceptable for a mockup demo.

---

### Act 7: "Reporting & Insights" (3 min)

| Step | Screen | Status | Notes |
|------|--------|--------|-------|
| 7.1 | Campaign progress overview | EXISTS | CampaignManagement shows totals |
| 7.2 | Pipeline report | PARTIAL | Can see totals on MovesManagement but no dedicated report |
| 7.3 | **Reporting Dashboard** | MISSING | LYBUNT/SYBUNT, campaign ROI, pipeline forecast |
| 7.4 | **Export functionality** | MISSING | No data export |

**Gap**: No dedicated reporting. For demo, the existing campaign dashboard may suffice, but this is a weakness vs. competitors.

---

## Summary: Screen Inventory

### EXISTS (Demo-Ready)
| Screen | Notes |
|--------|-------|
| PatronsList | Search, filter, view patrons |
| PatronProfile | Summary, Memberships, Documents tabs |
| OpportunitiesList | Filter, search opportunities |
| OpportunityDetail | View/edit opportunity |
| MovesManagement | Kanban pipeline |
| CampaignManagement | Campaign dashboard |
| GivingSummary | Charts and breakdowns |
| ActivityTimeline | Activity log display |
| TaxSummary | Year-end documentation |

### NEEDS REFINEMENT
| Screen | Issue |
|--------|-------|
| PatronsList | Add "Recently Added" section, source indicator |
| PatronProfile | Clearer "transition" to managed prospect |
| OpportunityDetail | "Close as Won" needs real flow |

### MISSING (Critical for Demo)
| Screen | Priority | Complexity |
|--------|----------|------------|
| **Dashboard (Home)** | HIGH | Medium |
| **Patron Creation Form** | HIGH | Low |
| **Gift Entry Form** | CRITICAL | Medium |
| **Opportunity Creation Modal** | CRITICAL | Low |
| **Activity Log Modal** | HIGH | Low |
| **Assign to Portfolio Modal** | HIGH | Low |
| **Close as Won Flow** | HIGH | Low |
| **Campaign Creation Form** | MEDIUM | Medium |
| **Fund/Appeal Management** | MEDIUM | Medium |
| **Reporting Dashboard** | LOW (for MVP demo) | High |

---

## Recommended Build Priority for Demo

### Phase 1: Critical Path (Must Have)
1. **Opportunity Creation Modal** - Can't demo major gift workflow without it
2. **Gift Entry Form** - Can't demo donation recording without it
3. **Activity Log Modal** - Essential for showing cultivation work
4. **Close as Won Flow** - Completes the opportunity lifecycle

### Phase 2: High Value
5. **Dashboard** - First impression matters
6. **Patron Creation Form** - Shows manual entry capability
7. **Assign to Portfolio Modal** - Completes the "promote to prospect" story

### Phase 3: Nice to Have for Demo
8. **Campaign Creation Form** - Can demo with existing campaigns
9. **Fund/Appeal Management** - Can explain verbally
10. **Reporting** - Defer, explain as "coming soon"

---

## Demo Script Outline

**Opening** (1 min)
> "Let me show you how Fever Zone helps you manage your entire patron lifecycle—from first ticket purchase to major gift."

**Act 1: The Fever Advantage** (2 min)
> "Unlike [competitor], we start with your ticketing data. When someone buys a ticket, they automatically become a patron in your database."
> Show: PatronsList with recent additions, click into profile showing ticket history

**Act 2: Recording Everyday Gifts** (3 min)
> "When a visitor adds a $10 donation at checkout, it's automatically recorded with the right campaign attribution."
> Show: Patron timeline with small gift, GivingSummary, campaign breakdown
> "For walk-in donations or checks, your staff can quickly record them here."
> Show: Gift Entry Form (NEEDS TO BE BUILT)

**Act 3: Major Gift Cultivation** (8 min)
> "Now let's talk about your major donors. You've identified Anderson Collingwood as someone with capacity..."
> Show: Patron profile, wealth insights, "Add to Portfolio"
> "Once assigned, your gift officer creates an opportunity..."
> Show: Opportunity creation, Pipeline, drag through stages
> "Every touchpoint is logged..."
> Show: Activity log
> "And when they make the gift..."
> Show: Close as Won, gift created

**Act 4: Campaign Management** (3 min)
> "All of this rolls up to your campaigns..."
> Show: Campaign dashboard with goals, progress, appeals

**Act 5: Tax Season** (2 min)
> "Come January, generating tax documentation is one click..."
> Show: Documents tab, year-end summary

**Close** (1 min)
> "Questions?"

---

## Competitor Comparison Points to Address

| Competitor Says | Our Response | Screen to Show |
|-----------------|--------------|----------------|
| "We have wealth screening" | "So do we, plus your ticket data" | WealthInsights + ActivityTimeline |
| "We have moves management" | "Ours is opportunity-based, industry standard" | Pipeline + OpportunityDetail |
| "We integrate with your ticketing" | "Ours IS your ticketing—no integration needed" | PatronProfile showing ticket history |
| "We've been around for 30 years" | "And look 30 years old. We're modern." | Any screen (UI is our advantage) |

---

*Analysis Date: February 6, 2026*
