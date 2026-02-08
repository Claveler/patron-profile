# Fever Zone Fundraising -- Demo Walkthrough

**Version**: 1.0
**Last Updated**: February 8, 2026
**Duration**: ~25 minutes (6 acts)
**Prerequisites**: Dev server running on `http://localhost:3000`
**Dates**: All demo data dates are **relative to today** -- the demo always looks current regardless of when you run it (see [Evergreen Dates](#evergreen-dates) below).

---

## Product Positioning (Pre-Demo Context)

Fever Zone Fundraising is a donor management module built natively on the Fever ticketing platform. It targets museums and cultural institutions that already use Fever for admissions and events.

**The one-line pitch**: "Every ticket buyer becomes a patron automatically. No integration required."

**Key competitive advantages**:
1. **Native ticketing data** -- behavioral signals (visits, events, purchases) that no standalone CRM can match
2. **Modern UI** -- replaces 20-year-old interfaces from Tessitura, Raiser's Edge, and Bloomerang
3. **Unified platform** -- one login for ticketing, memberships, and fundraising

**Target audience for this demo**: Museum decision-makers evaluating replacements for legacy CRMs.

---

## Persona Directory

Each act is driven by a specific user persona, mapped to an MVP delivery epic from the [MVP Roadmap](MVP_ROADMAP.md).

| Persona | Role | Daily Question | MVP Epic |
|---------|------|----------------|----------|
| **Gift Officer** | Manages a portfolio of 50-100 donor relationships | "Who should I call today, and what should I say?" | Epic 1 (Patron Data), Epic 2 (Giving), Epic 3 (Pipeline) |
| **Development Director** | Oversees the fundraising team and strategic goals | "Are we on track to hit our annual goal?" | Epic 4 (Campaign Intelligence & Dashboard) |
| **Membership Coordinator** | Manages member benefits, renewals, and beneficiaries | "Who's at risk of lapsing, and how do I retain them?" | Epic 2 (Giving & Membership) |
| **Major Gifts Manager** | Cultivates $10K+ prospects through structured pipeline | "Where are my big opportunities, and what's the next step?" | Epic 3 (Fundraising Pipeline) |
| **VP of Advancement** | Reports to the board on fundraising performance | "What's our pipeline health and campaign ROI?" | Epic 4 (Campaign Intelligence) |

---

## Anchor Patrons

The demo follows two contrasting patrons throughout:

| | Anderson Collingwood | Paul Fairfax |
|---|---|---|
| **Status** | Managed Prospect | General Constituent |
| **Membership** | Gold (3/4 beneficiaries) | Silver (1/2 beneficiaries) |
| **Engagement** | On Fire (47 visits) | Cool (6 visits) |
| **Lifetime Value** | $19,232 | $1,850.00 |
| **Gift Officer** | Liam Johnson | *None (unassigned)* |
| **Household** | Collingwood Family (3 members) | Fairfax Family (2 members) |
| **Pipeline** | 2 active opportunities ($60K) | None |
| **Demo Role** | The model donor -- what success looks like | The unmanaged opportunity -- revenue left on the table |

---

## Act 1: "Your New Command Center"

**Duration**: 2 minutes
**Persona**: Development Director
**Epic**: Epic 4 -- Campaign Intelligence & Dashboard
**Screen**: Dashboard (`http://localhost:3000`)

> **WOW MOMENT**: The "Follow-ups Needed" panel showing Margaret Chen at **126 days** since last contact, highlighted in red. The system surfaces overdue relationships automatically -- no one falls through the cracks.

### Steps

| # | Action | What to Say |
|---|--------|-------------|
| 1.1 | Land on Dashboard (default page) | "Here's what you see when you log in. Everything that needs your attention today, in one place." |
| 1.2 | Point to the 4 KPI cards at top | "Ten open opportunities worth a million dollars in your pipeline, with $560K weighted by probability. Twenty-one patrons are actively managed by your team." |
| 1.3 | Point to Pipeline Overview bar chart | "Your pipeline is distributed across five cultivation stages. Most of the dollar value is in Cultivation and Solicitation -- that's healthy." |
| 1.4 | Point to Follow-ups Needed panel | **[WOW]** "Margaret Chen hasn't been contacted in 126 days. Anderson Collingwood needs a gallery tour follow-up. The system tracks this automatically -- no spreadsheet needed." |
| 1.5 | Point to Closing Soon | "You have a $100,000 leadership gift closing in three weeks. That needs attention." |
| 1.6 | Point to Patron Summary widget | "Twenty-eight patrons total: 21 managed, 7 general constituents. Those 7 are your next pipeline opportunities." |
| 1.7 | Point to Quick Actions | "From here you can add a patron, create an opportunity, check campaigns, or jump to the pipeline board." |

### What to Skip

- Don't click Quick Actions buttons (you'll visit those pages naturally)
- Don't change the Gift Officer dropdown (save that for Q&A if asked about filtering)

---

## Act 2: "How Patrons Enter Your System"

**Duration**: 3 minutes
**Persona**: Gift Officer
**Epic**: Epic 1 -- Patron Data Platform
**Screen**: Patrons list

> **WOW MOMENT**: The **NEW** badges on recently-added patrons. These are ticket buyers who became patrons *automatically* -- no data entry required. This is the Fever advantage.

### Steps

| # | Action | What to Say |
|---|--------|-------------|
| 2.1 | Click **Patrons** in the sidebar | "Let's look at your patron database." |
| 2.2 | Observe the list (28 patrons) | "Every ticket buyer from Fever becomes a patron automatically. You see names, lifetime value, membership tier, tags, gift officer, and engagement level -- all in one view." |
| 2.3 | Point to the NEW badges (James Wilson, Maria Santos, Rachel Kim, David Chen) | **[WOW]** "See those 'NEW' badges? James Wilson bought a ticket 3 days ago and he's already in your database with his contact info, ticket history, and engagement score. No manual entry. No CSV import. That's the Fever advantage." |
| 2.4 | Point to the "Assign" buttons (Paul Fairfax, David Chen) | "Notice some patrons show 'Assign' instead of a gift officer name. These are General Constituents -- they're in the system but nobody is cultivating them yet." |
| 2.5 | Click **Add new patron** button | "For walk-in donors, board members, or anyone who didn't buy a ticket, your team can create a patron manually." |
| 2.6 | Observe the PatronModal form, then close it | "Full contact info, tags, notes -- everything you need." |
| 2.7 | Scroll to find **Paul Fairfax** in the list | "Let's look at Paul Fairfax. He's a Silver member who's been giving, but nobody's managing him." |
| 2.8 | Click Paul Fairfax's row | *(transitions to Act 3)* |

### What to Skip

- Don't demonstrate search/filter (show only if asked)
- Don't click Export

---

## Act 3: "The Unmanaged Opportunity"

**Duration**: 5 minutes
**Persona**: Gift Officer discovering a prospect
**Epic**: Epic 1 (Patron Data) + Epic 2 (Giving & Membership)
**Screen**: Paul Fairfax's patron profile

> **WOW MOMENT**: Paul's Memberships tab showing the **"At Risk"** warning (renewal approaching, auto-renewal OFF, low usage 35%) combined with his empty beneficiary slot (1/2). His wife Elizabeth is in the household but NOT on the membership. This is a natural upsell conversation: "Paul, would you like to add Elizabeth to your membership?"

### Steps

| # | Action | What to Say |
|---|--------|-------------|
| 3.1 | Observe Paul's Summary tab header | "Paul is a 'General Constituent' -- see that gray badge? He has no gift officer. He's been giving $1,380 on his own, and his lifetime value including tickets is $1,850. But nobody's cultivating him." |
| 3.2 | Point to "Assigned To: Assign" | "Here's where you'd promote him. Click Assign..." |
| 3.3 | Click the **Assign** button | "This converts Paul from a General Constituent to a Managed Prospect." |
| 3.4 | Observe the AssignPortfolioModal | "See the explanation? 'Assigning a gift officer converts this patron from a General Constituent to a Managed Prospect for individual relationship management.' You pick a gift officer, and optionally create the first opportunity right away." |
| 3.5 | Point to "Create first opportunity" checkbox | "One click to start tracking a potential gift." |
| 3.6 | Cancel the modal, click **Memberships** tab | "Now let's look at Paul's membership. This is where it gets interesting." |
| 3.7 | Observe the Silver membership card | "Silver tier. Valid through February 27. But look at that red warning..." |
| 3.8 | Point to the **"At Risk"** warning | **[WOW]** "Renewal approaching. Auto-renewal is OFF. Usage is only 35%. This membership is at risk of lapsing." |
| 3.9 | Point to Beneficiaries panel (1/2 slots) | "And look -- Paul is the only beneficiary. One of two slots. But he has a spouse..." |
| 3.10 | Click **Fairfax Family** household link in header | "Click the household link... there's Elizabeth, his wife. She's in the household but she's NOT on the membership." |
| 3.11 | Close the household popup | "This is a natural conversation: 'Paul, would you like to add Elizabeth? She'd get museum access, and you'd use more of your benefits.' That's a retention conversation and an upsell in one." |
| 3.12 | Optionally click **Add Beneficiary** | "Adding Elizabeth is a 3-step process: search for her, assign a membership role, and optionally create the household link -- all in one flow." |

### What to Skip

- Don't explore the Giving, Timeline, or Documents tabs for Paul (save Anderson for the deep dive)
- Don't actually assign Paul to a portfolio (keep him as a General Constituent for re-demo)

---

## Act 4: "The Model Donor"

**Duration**: 8 minutes
**Persona**: Gift Officer working their portfolio
**Epic**: Epic 2 (Giving & Membership) + Epic 3 (Fundraising Pipeline)
**Screen**: Anderson Collingwood's patron profile

> **WOW MOMENT**: The Remove Beneficiary modal's **"Also remove household relationship"** checkbox with helper text "Uncheck if still family, just not on this membership." In one UI element, the system makes the conceptual separation between household membership and membership beneficiaries tangible and actionable.

### Steps

| # | Action | What to Say |
|---|--------|-------------|
| 4.1 | Navigate back to Patrons, click Anderson Collingwood | "Now let me show you what a fully cultivated patron looks like. Anderson Collingwood." |
| 4.2 | Observe Summary tab header | "Managed Prospect, assigned to Liam Johnson. $19,232 lifetime value. Engagement: On Fire. Gold member. Everything at a glance." |
| 4.3 | Point to Opportunities panel (right side) | "Two active opportunities: a $50,000 New Wing Major Gift in Cultivation, and a $10,000 Spring Gala sponsorship in Solicitation. $60K total pipeline for one patron." |
| 4.4 | Point to Relationships widget | "Sarah is his spouse, Emma is his daughter, Robert Chen is his financial advisor. These relationships are tracked to inform your cultivation strategy." |
| 4.5 | Click **Collingwood Family** household link | "Three household members. Click to navigate between family profiles." |
| 4.6 | Close household popup, click **Giving** tab | "Let's look at his giving history." |
| 4.7 | Point to Pledges panel | "A $5,000 pledge to Building the Future. $3,750 paid, $1,250 remaining. One final quarterly payment in March." |
| 4.8 | Point to Recurring Gifts | "$100 per month recurring gift to the Annual Fund. Active since October 2025." |
| 4.9 | Point to Gift History table | "Sixteen gifts total. Every type is tracked: donations, recurring, membership renewals, pledge payments -- with fund attribution and acknowledgment status. You can see the giving escalation from a $90 Silver membership in 2023 to $2,500 major gifts today." |
| 4.10 | Point to Acknowledgments panel | "Nine acknowledgments across sixteen gifts. One pending: a $1,250 building campaign payment needs a thank-you letter. Hit Send right from here." |
| 4.11 | Click **Memberships** tab | "Now the membership view." |
| 4.12 | Point to Gold card, benefits with usage | "Gold membership. 47 visits to exhibits. 3 of 5 guest passes used. Welcome Pack claimed." |
| 4.13 | Point to Beneficiaries (3/4 slots) | "Anderson, Sarah, and Emma are all on the membership. Three of four slots used. Compare that with Paul -- this is a fully enrolled family." |
| 4.14 | Click the remove (x) button on Sarah | **[WOW]** "Watch this. If you remove Sarah as a beneficiary..." |
| 4.15 | Observe RemoveBeneficiaryModal | "See that checkbox: 'Also remove household relationship.' It says 'Uncheck if still family, just not on this membership.' The system knows the difference between 'family member' and 'membership beneficiary.' You can remove someone from the membership without breaking the family connection." |
| 4.16 | Cancel the modal | "This is how real institutions work. A daughter goes to college -- you remove her as a beneficiary but she's still in the household." |
| 4.17 | Click **Documents** tab | "Come tax season, everything is ready." |
| 4.18 | Point to Year-End Tax Summary | "Fonck Museum, EIN included. Itemized contributions with deductibility calculations. Membership contributions are partially deductible -- the system handles the fair-market-value math." |
| 4.19 | Point to Copy Link / Download PDF / Send via Email | "One click to send, download, or share a link." |

### What to Skip

- Don't visit the Timeline tab (it duplicates Summary activity)
- Don't visit the Relationships tab (it's a placeholder -- acknowledge verbally if asked: "The dedicated relationships page is coming in the next release")
- Don't visit the Profile tab

---

## Act 5: "Managing the Pipeline"

**Duration**: 5 minutes
**Persona**: Major Gifts Manager
**Epic**: Epic 3 -- Fundraising Pipeline
**Screen**: Opportunities page

> **WOW MOMENT**: The **Close as Won** modal that pre-fills the gift amount from the ask, shows the campaign attribution, and explains: "This will create a gift record for $50,000 attributed to Building the Future and move the opportunity to Stewardship." One click completes the cycle from prospect to donor.

### Steps

| # | Action | What to Say |
|---|--------|-------------|
| 5.1 | Click **Opportunities** in sidebar | "This is your pipeline. Every major gift flows through five stages." |
| 5.2 | Observe Pipeline (Kanban) view | "Ten opportunities, one million dollars total. Drag cards between stages as you cultivate. The pipeline shows who owns each opportunity, how many days since last contact, and the next action." |
| 5.3 | Point to staleness indicators | "See the warning triangles? That means a contact is overdue. The system keeps your team accountable." |
| 5.4 | Click **List** tab | "Switch to a list view for filtering and sorting. Stage badges, probability, expected close, and days since contact -- all color-coded." |
| 5.5 | Click **New Wing Major Gift** (Anderson's opportunity) | "Let's open Anderson's $50,000 opportunity." |
| 5.6 | Observe OpportunityDetail page | "Pipeline stepper shows we're in Cultivation -- stages 1 and 2 are complete. Ask amount: $50,000. Probability: 75%. Weighted value: $37,500. Next action: follow up about the gallery tour." |
| 5.7 | Point to Contact section | "Last contact was 24 days ago. Every touchpoint is logged." |
| 5.8 | Click **Actions** dropdown | "From here you can edit, advance to the next stage, log a contact, or close the opportunity." |
| 5.9 | Click **Close as Won** | **[WOW]** "When the gift comes in, one click. The amount is pre-filled from the ask. The campaign -- Building the Future -- is attributed automatically. This creates a gift record AND moves the opportunity to Stewardship. The entire lifecycle, from identification to gift receipt, is captured." |
| 5.10 | Cancel the modal | "Let's leave this one open for now." |
| 5.11 | Click **Opportunities** breadcrumb to go back | *(transitions to Act 6)* |

### What to Skip

- Don't demonstrate drag-and-drop (mention it: "You can drag cards between stages")
- Don't click Edit Opportunity or Log Contact (acknowledge they exist)

---

## Act 6: "Campaign Performance"

**Duration**: 3 minutes
**Persona**: Development Director / VP of Advancement
**Epic**: Epic 4 -- Campaign Intelligence & Dashboard
**Screen**: Campaigns page

> **WOW MOMENT**: The **2025 Annual Fund** completed campaign showing **102% of goal** with a green "Goal Met" badge, displayed alongside 6 active campaigns. Past performance validates the system; active campaigns show where you're headed.

### Steps

| # | Action | What to Say |
|---|--------|-------------|
| 6.1 | Click **Campaigns** in sidebar | "Here's where leadership monitors strategic goals." |
| 6.2 | Observe header stats | "Fifty-two million in total campaign goals. Four million raised so far. Six active campaigns." |
| 6.3 | Point to top campaigns | "The 2026 Annual Fund is at 43% of goal with 142 donors. Building the Future -- that's Anderson's campaign -- is the big capital project at $50 million." |
| 6.4 | Point to campaign cards | "Each card shows the goal, progress bar, donor count, gift count, average gift, date range, and the campaign manager. Click 'View Appeals' for drill-down." |
| 6.5 | Scroll to Completed Campaigns | **[WOW]** "And look: the 2025 Annual Fund hit 102% of its $450,000 goal. The Emergency Relief Fund hit 127%. These green 'Goal Met' badges tell the board exactly what they want to hear: your fundraising engine works." |
| 6.6 | Point to filters | "Filter by status or fund to slice the data however you need." |

### Close (1 minute)

> "From the moment someone buys a ticket, they're in your system. You can find them, understand their engagement, cultivate them through a structured pipeline, manage their membership and benefits for the whole family, track every gift with full campaign attribution, generate tax documents with one click, and report on performance against strategic goals. All in the platform you already use for ticketing. No integration. No data silos. One unified view of every patron."

> "Questions?"

---

## Quick Reference: Wow Moments Summary

| Act | Title | Wow Moment | Why It Matters |
|-----|-------|------------|----------------|
| 1 | Command Center | 126-day overdue follow-up surfaced automatically | No patron falls through the cracks |
| 2 | Patron Discovery | NEW badges = automatic patron creation from tickets | The Fever advantage -- zero data entry |
| 3 | The Unmanaged Opportunity | At Risk warning + empty beneficiary slot | Revenue on the table; natural upsell conversation |
| 4 | The Model Donor | "Also remove household relationship" checkbox | Household vs. membership = real-world complexity, handled elegantly |
| 5 | Managing the Pipeline | Close as Won creates gift + moves to Stewardship | Complete lifecycle in one click |
| 6 | Campaign Performance | 102% goal met badge on completed campaign | Proof the engine works -- board-ready results |

---

## Evergreen Dates

All dates in the demo data (patron interactions, gift dates, campaign timelines, opportunity dates, membership periods, pledge schedules, etc.) are **automatically shifted** so they remain relative to today's date. This means:

- **You never need to update dates manually.** The demo always looks current whether you run it today or three months from now.
- **Membership renewal warnings stay accurate.** A membership "21 days from renewal" on the anchor date will still show the correct days-to-renewal relative to today.
- **Campaign timelines stay realistic.** Active campaigns remain in their expected date ranges; completed campaigns stay in the past.

**How it works**: A centralized utility (`src/utils/demoDate.js`) defines an anchor date (February 8, 2026 -- when the demo data was authored). At module load time, every date in every data array is shifted forward by the number of days between the anchor and today. Components are completely unaware of this -- they just see normal date strings and numbers. If the offset is zero (i.e., running on the anchor date), no shifting occurs and there is zero performance cost.

---

## Demo Recovery Tips

| Problem | Recovery |
|---------|----------|
| Page goes blank after search | The app uses state-based routing. Reload `http://localhost:3000` and navigate via sidebar. |
| Can't find a patron | Use the search box on the Patrons page. Anderson and Paul are always in the default list (no filter needed). |
| Modal doesn't close | Press `Escape` or click outside the modal overlay. |
| Lost navigation context | Use the breadcrumb trail at the top of each page (e.g., "Fundraising > Patrons > Anderson Collingwood"). |
| Asked about reporting | "Campaign dashboards and pipeline overview give you real-time reporting. The Patrons list has built-in LYBUNT and SYBUNT filters under 'Last Donation' -- try them. CSV export is also available." |
| Asked about email/comms | "The system logs all interactions. For email sending, venues use their existing tools -- Mailchimp, Fever's comms platform -- and we track the touchpoints here." |
| Asked about integrations | "This IS your ticketing platform. No integration needed. That's the whole point." |

---

## Post-Demo Follow-Up Points

1. **Data migration**: White-glove onboarding for existing Tessitura/RE data
2. **Mobile**: Responsive design works on tablets for event-day use
3. **Timeline**: MVP delivery in ~4 months (see [MVP_ROADMAP.md](MVP_ROADMAP.md))
4. **Pricing**: Included in Fever Zone subscription -- no separate CRM license
5. **Security**: Inherits Fever's enterprise auth and permissions

---

*Document created: February 8, 2026*
