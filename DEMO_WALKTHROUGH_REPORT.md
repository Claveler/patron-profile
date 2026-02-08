# Demo Walkthrough Report

**Date**: February 8, 2026
**Walkthrough method**: Headed agent-browser at 1280x720 (agent-browser 0.9.1 default), with reference to 1400px screenshots from resolution-issues/
**Anchor patrons**: Anderson Collingwood (Managed Prospect), Paul Fairfax (General Constituent)

---

## 1. Gap Inventory (Updated from Feb 6 Analysis)

### Previously Missing -- Now Built

| Screen | Feb 6 Status | Feb 8 Status | Verified |
|--------|-------------|-------------|----------|
| **Dashboard (Home)** | MISSING | BUILT | Yes -- KPI cards (10 opps, $1.0M, $560K, 21 managed), Pipeline Overview, Closing Soon, Follow-ups Needed, Quick Actions, Patron Summary (28/21/7) |
| **Patron Creation Form** | MISSING | BUILT | Yes -- PatronModal opens from "Add new patron" on Patrons list |
| **Gift Entry Form** | MISSING (CRITICAL) | BUILT | Yes -- GiftModal accessible from Summary tab "Record gift" button |
| **Opportunity Creation Modal** | MISSING (CRITICAL) | BUILT | Yes -- OpportunityModal accessible from pipeline and patron profile |
| **Assign to Portfolio Modal** | MISSING | BUILT | Yes -- AssignPortfolioModal with GC→MP conversion explanation, gift officer dropdown, optional "Create first opportunity" checkbox |
| **Close as Won Flow** | MISSING | BUILT | Yes -- CloseWonModal pre-fills amount from ask, creates gift record, moves to Stewardship |

### Still Missing or Incomplete

| Screen | Status | Impact | Priority |
|--------|--------|--------|----------|
| **Relationships Tab** | Placeholder ("No Relationships Mapped") | Anderson has 3 relationships in data (Sarah/Spouse, Emma/Daughter, Robert Chen/Financial Advisor) visible in Summary widget, but the dedicated tab is empty | HIGH -- confusing during demo |
| **Activity Log Modal** | Button exists ("Log Contact" on OpportunityDetail) | Clicking it from the Actions dropdown is available, but the modal was not opened during this walkthrough | MEDIUM -- verify |
| **Fund/Appeal Management** | No admin UI | No CRUD for funds or appeals; the DCAP hierarchy exists in data but can't be created/edited | LOW for demo (explain verbally) |
| **Dedicated Reporting Page** | Not built | No LYBUNT/SYBUNT, pipeline forecast, or export. Dashboard partially fills this gap | LOW for MVP demo |
| **Campaign Creation Form** | Button exists ("New campaign" on Campaigns page) | Not tested -- button may open a modal or do nothing | LOW for demo (use existing campaigns) |
| **Paul Fairfax Activity Data** | Missing | Summary tab shows "No activities found" despite $1,380 in gifts and $470 in revenue | HIGH -- demo-breaking for Paul |
| **Giving Tab "Record Gift" Button** | Missing from Giving tab | "Record gift" is only on Summary tab's activity section; the Giving tab (which is where you'd expect it) has no action button | MEDIUM -- UX gap |

### Features Built Since Feb 6 Summary

The prototype has advanced significantly. Of the 10 items listed as "MISSING (Critical for Demo)" on Feb 6, **6 are now fully built and verified**. The remaining gaps are either low priority for a demo (fund management, reporting) or specific data/UI issues (Relationships tab, Paul's activity data).

---

## 2. UI Issues

### Issue 1: Tags Column Truncation on Patrons List

**Observation**: At 1280px (and likely at 1400px too), the Tags column in the Patrons table truncates long tag names: "Major D..." for "Major Donor", "Foundat..." for "Foundation".

**Proposed fix**: Use pill-style tags with overflow: `display: flex; flex-wrap: wrap; gap: 4px;` and show a "+N more" badge for overflow. Alternatively, use a tooltip on hover to reveal the full tag name, and abbreviate to initials in the cell (e.g., "MD" for Major Donor).

### Issue 2: Kanban Card Text Truncation on Pipeline

**Observation**: Campaign names on Kanban cards truncate at narrow widths: "2026 Annual Fun...", "Building the Fu...". The 5-column layout is tight.

**Proposed fix**: Show campaign as a small badge/pill below the card title rather than inline text. On smaller viewports, hide the campaign and show it on hover or in a tooltip. Consider reducing card padding by 2-4px to gain space.

### Issue 3: Pipeline Filter Labels Wrap Awkwardly

**Observation**: "Assigned To:" and "Campaign:" filter labels on the Opportunities page wrap next to their dropdowns, creating uneven alignment.

**Proposed fix**: Remove the labels and use placeholder text inside the dropdowns instead ("Filter by assignee...", "Filter by campaign..."). This is a standard pattern and saves horizontal space.

### Issue 4: Sidebar Overlap on Memberships Tab

**Observation**: At narrower viewports, the sidebar occasionally overlaps the content area on the Memberships tab, especially when the membership card and benefits section render side by side.

**Proposed fix**: Add a `min-width: 0` to the content area flex child to prevent sidebar overlap, and ensure the content grid uses `grid-template-columns: minmax(0, 1fr) ...` instead of fixed widths.

### Issue 5: PatronInfoBox Membership Row Invisible on Some Tabs

**Observation**: On the Summary and Documents tabs, the PatronInfoBox shows membership, member-since, and days-to-renewal. On the Memberships tab, this row disappears (replaced by the Overview section). This is acceptable but could confuse users who expect consistent header info.

**No fix needed** -- the Memberships tab provides this info in the Overview section directly.

---

## 3. Data Consistency Issues

### Issue 1: AI Insights Are Hardcoded Generic Text (CRITICAL)

**Observation**: The AI Insights widget shows identical text for every patron:
- "Consistent donor with increasing contribution amounts over time"
- "High engagement with events -- attended 12 events this year"
- "Prefers email communication, opens 89% of emails"
- "Connected to Johnson Family Foundation (DAF)"

This text contradicts actual patron data. For example:
- **Paul Fairfax**: "Cool" engagement, "No activities found" -- yet AI says "High engagement" and "Consistent donor"
- **James Wilson** (from prior session): $0 in gifts, "Cold" engagement -- yet AI says "Consistent donor with increasing contributions"

**Impact**: Destroys credibility in a demo. A prospect evaluating the product will immediately notice the AI widget contradicting the data on the same screen.

**Proposed fix**: Either (a) make AI insights dynamic based on actual patron data (engagement level, gift count, last activity, membership status), or (b) remove/hide the AI Insights widget from patrons where it would contradict (e.g., show a "Not enough data" state for patrons with low activity).

### Issue 2: Paul Fairfax Has No Activity Data

**Observation**: Paul's Summary tab shows "No activities found" in the Recent Activity section, despite having:
- $1,380 in gifts (lifetime)
- $470 in revenue (tickets, F&B, merch)
- Silver membership (with renewal data)

**Impact**: Makes Paul's profile look broken during demo. The financial summary shows $1,850 but the timeline is empty.

**Proposed fix**: Add activity entries to Paul's patron data in `src/data/patrons.js` -- at minimum his gift transactions and membership events should appear in the timeline.

### Issue 3: Household Address vs. Personal Address Mismatch

**Observation**: Paul Fairfax's profile shows address "742 Maple Avenue, Boston, MA 02108" but his household (Fairfax Family) shows "234 Elm St, Austin, TX 73302". These are in different states.

**Impact**: Minor confusion during demo, but a detail-oriented prospect might notice.

**Proposed fix**: Align the household address to match Paul's personal address, or use a different address that's clearly a "family home" in the same metro area. For the demo, "742 Maple Avenue, Boston, MA 02108" should be the household address too.

### Issue 4: Close as Won Modal Missing Campaign

**Observation**: The CloseWonModal for "New Wing Major Gift" shows Campaign as "---" despite the opportunity being linked to "Building the Future" campaign.

**Impact**: The modal should pre-populate the campaign from the opportunity data. This is a minor data-passing bug.

**Proposed fix**: In `CloseWonModal`, read the campaign from the opportunity prop and display it. This is likely a 1-line fix where the campaign field isn't being passed through.

### Issue 5: "+2" Badge on PatronInfoBox Opens Tags (Not Household)

**Observation**: Clicking the "+2" badge next to the tag in Anderson's PatronInfoBox opens the Tags management popup, not the household members popup. The "Collingwood Family" text link is the correct way to access household navigation.

**Impact**: Confusing during demo -- a viewer might think "+2" means 2 household members.

**Proposed fix**: Either (a) rename the badge to clarify it's a tag count, or (b) separate the tags from the household count visually. Consider showing household count as a distinct element: "Collingwood Family (3 members)" rather than having "+2" inline with tags.

---

## 4. Household & Beneficiary Observations

### The Separation Is Well Demonstrated

The demo data and UI clearly demonstrate the intentional separation of **household membership** (family grouping) from **membership beneficiaries** (who gets museum benefits):

| Patron | Household Members | Membership Beneficiaries | Key Story |
|--------|-------------------|-------------------------|-----------|
| **Anderson Collingwood** | 3 (Anderson, Sarah, Emma) | 3 of 4 slots (Anderson, Sarah, Emma) | All household members are also beneficiaries -- the "fully enrolled family" |
| **Paul Fairfax** | 2 (Paul, Elizabeth) | 1 of 2 slots (Paul only) | Elizabeth is family but NOT a beneficiary -- the "opportunity to upsell" |

### Key Demo Moments

1. **Add Beneficiary Modal (3-step flow)**: Search or create a patron → assign a membership role (Spouse, Child, Guest) → optionally create a household relationship. This shows that adding someone as a beneficiary can also establish a household link, but doesn't have to.

2. **Remove Beneficiary Modal**: The "Also remove household relationship" checkbox with helper text "Uncheck if still family, just not on this membership" is the single best UI element demonstrating the conceptual separation. It makes the distinction tangible and actionable.

3. **Household Navigation Popup**: Clicking "Collingwood Family" or "Fairfax Family" opens a popup showing all household members with roles (Head, Spouse, Child). Members are clickable to navigate between profiles. This works correctly for both families.

4. **Paul's Memberships Tab**: The "1/2 slots" indicator with only Paul listed, combined with the "At Risk" warning (renewal approaching, auto-renewal OFF, low usage 35%), creates a natural upsell story: "Elizabeth could be added as a beneficiary, which might increase Paul's perceived value of the membership."

### Gap: Relationships Tab Not Connected

The **Relationships tab** on the patron profile shows "No Relationships Mapped" for all patrons, despite relationship data being present in the Summary tab's Relationships widget. This means:

- Anderson's 3 relationships (Sarah/Spouse, Emma/Daughter, Robert Chen/Financial Advisor) appear in the Summary widget but NOT in the dedicated Relationships tab
- The Relationships tab should aggregate: household members, membership beneficiaries, professional contacts, and organizational affiliations

**Recommendation**: Populate the Relationships tab with data from the existing relationship sources. Show a unified view with relationship type filters (Family, Professional, Organization).

---

## 5. Restructured Demo Flow

### Design Principles

1. **Two anchor patrons, two stories**: Anderson Collingwood (Managed Prospect with Gold membership, full household and beneficiaries) and Paul Fairfax (General Constituent with Silver membership, household but no beneficiaries)
2. **Persona-per-act**: Each act maps to an MVP epic and its primary persona
3. **Contrast as narrative device**: Show Anderson vs. Paul to highlight the General Constituent → Managed Prospect journey
4. **Household/beneficiary woven in**: Not a separate section, but demonstrated organically through the patron narratives

---

### Act 1: "Your New Command Center" (2 min)
**Persona**: Development Director
**Epic**: Epic 4 -- Campaign Intelligence & Dashboard

> "Here's what you see when you log in. Everything that needs your attention, in one place."

| Step | Action | What to Show |
|------|--------|--------------|
| 1.1 | Land on Dashboard | KPI cards: 10 open opportunities, $1M pipeline, $560K weighted, 21 managed prospects |
| 1.2 | Point out Pipeline Overview | Bar chart showing opportunity distribution across 5 stages |
| 1.3 | Point out Follow-ups Needed | Red "126d ago" on Margaret Chen -- overdue contacts bubble up automatically |
| 1.4 | Point out Closing Soon | $100K Annual Fund Leadership Gift closing Feb 28 -- 20 days away |
| 1.5 | Show Patron Summary | 28 total patrons: 21 managed, 7 general -- "These 7 general constituents are your next pipeline opportunities" |

**Transition**: "Let me show you who those 7 unmanaged patrons are."

---

### Act 2: "Finding and Understanding Your Patrons" (3 min)
**Persona**: Gift Officer
**Epic**: Epic 1 -- Patron Data Platform

> "Every ticket buyer becomes a patron automatically. Here's how you find and evaluate them."

| Step | Action | What to Show |
|------|--------|--------------|
| 2.1 | Navigate to Patrons list | 28 patrons with columns: Name, Lifetime Value, Membership, Tags, Gift Officer, Patron Since, Engagement |
| 2.2 | Point out NEW badges | James Wilson, Maria Santos, Rachel Kim, David Chen -- recent ticket buyers who became patrons automatically |
| 2.3 | Point out "Assign" buttons | Paul Fairfax, James Wilson, and others have "Assign" instead of a gift officer name -- these are General Constituents |
| 2.4 | Show "Add new patron" button | Click it → PatronModal opens (for walk-in donors, board members, etc. who didn't buy a ticket) |
| 2.5 | Close modal, search for "Paul" | Paul Fairfax appears -- click into his profile |

**Transition**: "Paul is a Silver member who bought tickets 2 years ago. He's been giving, but nobody's managing him."

---

### Act 3: "The Unmanaged Opportunity -- Paul Fairfax" (5 min)
**Persona**: Gift Officer discovering a prospect
**Epic**: Epic 1 + Epic 2

> "Paul represents the donors you're probably leaving on the table. He's engaged enough to give $1,380, but nobody's cultivating him."

| Step | Action | What to Show |
|------|--------|--------------|
| 3.1 | Paul's Summary tab | "General Constituent" badge, no gift officer assigned, $1,850 lifetime value, "Cool" engagement |
| 3.2 | Point out "Assign" button | "Right now, Paul isn't in anyone's portfolio. Let's change that." |
| 3.3 | Click "Assign" → AssignPortfolioModal | Show the conversion explanation: "Assigning a gift officer converts this patron from a General Constituent to a Managed Prospect" |
| 3.4 | Show "Create first opportunity" checkbox | "You can immediately start tracking a potential gift" |
| 3.5 | Cancel modal, go to Memberships tab | Silver membership card with "At Risk" warning: renewal approaching, auto-renewal OFF, low usage (35%) |
| 3.6 | Point out Beneficiaries: 1/2 slots | "Paul's the only one on the membership. But he has a spouse..." |
| 3.7 | Click "Fairfax Family" household link | Popup shows Paul (Head) + Elizabeth (Spouse) |
| 3.8 | Point out Elizabeth is NOT a beneficiary | "Elizabeth is his spouse in the household, but she's not on the membership. That's a natural conversation: 'Paul, would you like to add Elizabeth?'" |
| 3.9 | Click "Add Beneficiary" | Show the 3-step flow: search for Elizabeth → assign "Spouse" role → optionally link household relationship |

**Transition**: "Now let me show you what a fully cultivated patron looks like."

---

### Act 4: "The Model Donor -- Anderson Collingwood" (8 min)
**Persona**: Gift Officer working their portfolio
**Epic**: Epic 2 + Epic 3

> "Anderson is your major donor dream: Gold member, $50K ask in the pipeline, entire family on the membership."

| Step | Action | What to Show |
|------|--------|--------------|
| 4.1 | Navigate to Anderson's Summary | "Managed Prospect" badge, assigned to Liam Johnson, $19,232 lifetime, "On Fire" engagement |
| 4.2 | Point out Opportunities panel | 2 active: New Wing Major Gift ($50K, Cultivation), Spring Gala Table Sponsor ($10K, Solicitation) |
| 4.3 | Point out Relationships widget | Sarah (Spouse), Emma (Daughter), Robert Chen (Financial Advisor) |
| 4.4 | Click "Collingwood Family" | Household popup: Anderson (Head), Sarah (Spouse), Emma (Child) |
| 4.5 | Go to Giving tab | Pledges ($5K Building the Future, $2K paid/$3K remaining), Recurring ($100/mo), 9 gift history entries |
| 4.6 | Point out Acknowledgments panel | 4/9 acknowledged, 1 pending ($1,250 Building Campaign Q2 payment -- "Send" button) |
| 4.7 | Go to Memberships tab | Gold card, 47 visits, 3/5 guest passes used, Welcome Pack claimed |
| 4.8 | Point out Beneficiaries: 3/4 slots | Anderson (Primary), Sarah (Spouse), Emma (Child) -- "The whole family is on the membership" |
| 4.9 | Click remove (×) on Sarah | RemoveBeneficiaryModal: "Also remove household relationship" checkbox -- "This is the key distinction: you can remove someone from the membership without breaking the family connection" |
| 4.10 | Cancel, go to Documents tab | Year-End Tax Summary: Fonck Museum, itemized contributions with FMV deductibility, Copy Link / Download PDF / Send via Email |

**Transition**: "Now let's see how the $50K opportunity is being managed."

---

### Act 5: "Managing the Pipeline" (5 min)
**Persona**: Gift Officer / Major Gifts Manager
**Epic**: Epic 3 -- Fundraising Pipeline

> "Every major gift flows through a 5-stage pipeline. Here's Anderson's $50K opportunity."

| Step | Action | What to Show |
|------|--------|--------------|
| 5.1 | Navigate to Opportunities → Pipeline | Kanban board: 10 opportunities across 5 stages, $1M total pipeline |
| 5.2 | Switch to List view | Table with stage badges, probability, expected close, contact staleness indicators |
| 5.3 | Click "New Wing Major Gift" card | OpportunityDetail: pipeline stepper at Cultivation, $50K ask, 75% probability, $37,500 weighted, Jun 1 expected close |
| 5.4 | Show Next Action | "Follow up re: gallery tour" -- the gift officer always knows what to do next |
| 5.5 | Show Contact section | Last contact: Jan 15, 2026 (24 days ago) |
| 5.6 | Click Actions → show dropdown | Edit Opportunity, Advance to Solicitation, Log Contact, Close as Won, Close as Lost |
| 5.7 | Click "Close as Won" | CloseWonModal: pre-filled $50,000, "This will create a gift record and move to Stewardship" |
| 5.8 | Cancel, navigate back to pipeline | Show the full Kanban -- "Drag and drop to advance opportunities" |

**Transition**: "All of this rolls up to your campaign dashboard."

---

### Act 6: "Campaign Performance" (3 min)
**Persona**: Development Director
**Epic**: Epic 4 -- Campaign Intelligence

> "Here's where leadership monitors progress against strategic goals."

| Step | Action | What to Show |
|------|--------|--------------|
| 6.1 | Navigate to Campaigns | 6 active campaigns, 2 completed, Total: $52.5M goal, $4.0M raised, 7.7% progress |
| 6.2 | Point out top campaigns | 2026 Annual Fund: $215K of $500K (43%), Building the Future: $2.75M of $50M (5.5%) |
| 6.3 | Point out completed campaigns | 2025 Annual Fund: 102% of goal -- "Goal Met" badge |
| 6.4 | Show "View Appeals" drilldown | Each campaign has appeals with ROI tracking |
| 6.5 | Show filters | Status, Fund dropdowns for slicing the data |

**Close** (1 min):
> "From the moment someone buys a ticket, they're in your system. You can cultivate them, track every gift, manage their membership, and report on everything -- all in the platform you already use for ticketing. No integration required."

---

### Why This Structure Works

1. **Starts with impact** (Dashboard) rather than with feature inventory
2. **Paul's story creates urgency**: "You're leaving money on the table" -- shows the General Constituent gap
3. **Anderson's story shows maturity**: "Here's what a fully cultivated patron looks like" -- shows the system at full power
4. **Household/beneficiary is organic**: Not explained as a feature but discovered through the patron stories (Paul's empty beneficiary slot, Anderson's full household enrollment, the Remove modal's checkbox)
5. **Pipeline and campaigns are the payoff**: After seeing individual patrons, the audience understands why the aggregate views matter
6. **The contrast is the demo**: Paul (unmanaged, Silver, low engagement, 1 beneficiary) vs. Anderson (managed, Gold, on fire, full family) tells the product story without slides

---

## Appendix: Screenshots Captured

All screenshots saved to `/tmp/demo-act*` during this walkthrough:

| File | Description |
|------|-------------|
| `demo-act1-dashboard.png` | Dashboard with all widgets |
| `demo-act2-patrons.png` | Patrons list (28 patrons) |
| `demo-act3-anderson-summary.png` | Anderson Summary tab |
| `demo-act3-anderson-giving.png` | Anderson Giving tab (pledges, recurring, history, acks) |
| `demo-act3-anderson-memberships.png` | Anderson Memberships tab (Gold, 3/4 beneficiaries, events) |
| `demo-act3-add-beneficiary-modal.png` | Add Beneficiary Modal (step 1) |
| `demo-act3-remove-beneficiary.png` | Remove Beneficiary Modal (with household checkbox) |
| `demo-act3-household-nav.png` | Collingwood Family household popup |
| `demo-act3-anderson-timeline.png` | Anderson Timeline tab |
| `demo-act3-anderson-relationships.png` | Anderson Relationships tab (empty placeholder) |
| `demo-act3-anderson-documents.png` | Anderson Documents tab (tax summary) |
| `demo-act4-paul-summary.png` | Paul Summary tab (General Constituent) |
| `demo-act4-assign-modal.png` | Assign to Portfolio modal |
| `demo-act4-paul-memberships.png` | Paul Memberships tab (Silver, 1/2 beneficiaries, At Risk) |
| `demo-act4-paul-household.png` | Fairfax Family household popup |
| `demo-act5-opportunities.png` | Opportunities Pipeline (Kanban) |
| `demo-act5-opp-list.png` | Opportunities List view |
| `demo-act5-opp-detail.png` | New Wing Major Gift detail |
| `demo-act5-opp-actions.png` | Opportunity Actions dropdown |
| `demo-act5-close-won.png` | Close as Won modal |
| `demo-act6-campaigns.png` | Campaigns page (6 active + 2 completed) |

---

*Walkthrough completed: February 8, 2026*
