# Fever Zone - Patron Profile Product Specifications

## Product Overview

### What is Fever Zone?
Fever Zone is Fever's **back-office interface** for museum and cultural institution partners. While Fever started as a ticketing platform, it is evolving into a **Museum Relationship Platform** that helps institutions manage not just admissions, but the entire patron lifecycle from visitor to member to major donor.

### What is a Patron?
A **Patron** is any individual or entity (household, corporation) that has a relationship with a museum. This includes:
- Visitors and ticket buyers
- Members (various tiers)
- Donors (one-time or recurring)
- Major donors and planned giving donors
- Board members
- Volunteers
- Corporate sponsors
- Event attendees
- Prospects

This concept is also known as a "**Constituent**" in competitor platforms like Tessitura and Bloomerang.

---

## The Problem

### Fragmented Data Landscape
Museums today face critical challenges:

1. **Data Silos**: Patron information is spread across multiple platforms:
   - Ticketing system
   - Donor CRM
   - Email marketing platform
   - On-site POS systems
   - Membership management

2. **Limited Engagement Visibility**: Existing systems track donations but miss critical engagement signals like:
   - Attendance frequency
   - Purchase history
   - Digital interactions
   - Communication responses

3. **Operational Inefficiency**: Teams waste significant time:
   - Manually reconciling data between systems
   - Creating reports from multiple sources
   - Tracking patron interactions in spreadsheets

4. **Weak Personalization**: Without unified data:
   - Communications are generic
   - Cultivation efforts are not data-driven
   - Conversion and retention rates suffer

### Business Impact
- The lack of a holistic patron view is a **major blocker in sales deals** with US museums
- Museums either require integration with their existing systems OR a demonstration of Fever's own unified solution
- Competitors (Tessitura, Raiser's Edge, Bloomerang) have established donor dashboards

---

## The Solution: Unified Patron Profile

### Vision
Transform Fever from a ticketing platform into a **Museum Relationship Platform** by providing a **360° Patron View** that consolidates all interactions into a single, intuitive profile.

### Key Value Propositions

1. **360° Patron View**: Consolidate all interactions (tickets, visits, donations, communications) into one profile
2. **Data-driven Cultivation**: Provide engagement insights and lifetime value metrics to guide donor stewardship
3. **Operational Streamlining**: Eliminate data silos and manual imports between systems
4. **Competitive Differentiation**: Modern, integrated, museum-tailored alternative to legacy systems

---

## Target Users

### Primary Users
1. **Development (Fundraising) Teams**
   - Responsible for donor cultivation and stewardship
   - Need to identify high-potential prospects
   - Track giving history and engagement signals

2. **Marketing Teams**
   - Manage patron communications
   - Segment audiences for targeted campaigns
   - Track engagement and conversion

### Secondary Users
- Executive leadership (reporting and insights)
- Operations teams (data management)
- Customer service representatives

### User Context

**Important**: Fever Zone is exclusively a **partner-facing interface**. Patrons (members, donors, visitors) do not access Fever Zone directly.

- **Primary Interface Users**: Partner employees (museum staff, box office, membership desk, development team)
- **NOT for Patrons**: Patrons interact with Fever through consumer-facing apps and websites, not Fever Zone
- **Implication for Features**: 
  - Membership upgrades require **payment links** sent to patrons (not direct checkout)
  - Actions are performed "on behalf of" patrons by staff
  - POS interfaces exist separately for in-person transactions

---

## Feature Overview

### Patron Profile Components

#### 1. Patron Header / Info Box
- **Profile Photo**: Visual identification
- **Name**: Primary patron name
- **Household/Family**: Link to related patrons
- **Tags**: Patron category (Member, Donor, etc.)
- **Contact Info**: Email (primary starred), phone, address
- **Membership Status**: Programme, tier, member since, renewal countdown
- **Quick Actions**: Dropdown for common tasks

#### 2. Tab Navigation
- **Summary**: Dashboard view of all key metrics
- **Memberships**: Detailed membership management (see detailed spec below)
- **Profile**: Editable contact information and preferences
- **Timeline**: Complete chronological activity log
- **Relationships**: Family/household/corporate connections
- **Documents**: Tax documentation and receipts (see detailed spec below)

#### 2a. Memberships Tab (Detailed Specification)

The Memberships tab provides comprehensive membership management for partners. It consists of a two-column layout:

**Left Column Components:**

##### Membership Overview
The primary component showing the patron's membership status:

- **Membership Card**
  - CR80 standard aspect ratio (1.586:1, matching physical card dimensions)
  - Dynamic background color based on membership tier configuration
  - QR code for scanning at venue (encodes `patronId-membershipId`)
  - Tenure badge (e.g., "2-YEAR MEMBER") for members with 1+ years
  - Patron name, ID, and validity date
  - Active/Inactive status indicator

- **Key Stats Panel**
  - Current period with period type (yearly/monthly)
  - Days to renewal with urgency warning (highlighted if ≤14 days)
  - Membership price
  - Auto-renewal status (ON/OFF badge)
  - Payment method on file (card type + last 4 digits)

- **Benefits Display** (Two-Section Approach)
  
  The benefits display is split into two distinct sections for clarity:
  
  **Section 1: "Your Benefits" (Categorized)**
  - Benefits grouped by category (from PRD: Membership Perks Management)
  - Three categories:
    - **Access**: EntryPass to venues, unlimited visits, priority entry
    - **Discounts**: F&B discounts, event discounts, guest/friend tickets
    - **Complimentary**: Welcome packs, parking, coat check
  - Clean list showing icon, title, and description only
  - No usage data in this section (keeps it scannable)
  
  **Section 2: "Usage This Period"**
  - Only shows benefits with trackable consumption
  - Progress bars for limited benefits (e.g., "3/5 guest passes")
  - Count display for unlimited benefits (e.g., "used 34x")
  - Reset dates where applicable
  - Visual distinction for exhausted benefits ("Used up")

- **Upgrade CTA** (if eligible)
  - Secondary-style button below the card
  - Opens upgrade modal (see Upgrade Flow section)

##### Early Access Events
Shows upcoming events where members get early ticket access:
- Event name, date, and thumbnail image
- Member access date vs public access date
- Status badges: "Early access in X days", "Member access open", "Public sale live"
- Timeline visualization of access windows

##### Redemption History
Chronological log of perk usage with savings tracking:
- Perk name and icon
- Location where redeemed
- Date of redemption
- Savings amount per redemption
- Total savings summary in header
- "View full history" link for extended log

##### Membership Documentation
Access to membership-related documents:
- Terms & Conditions
- Membership receipts
- Renewal invoices

**Right Column Components:**

##### Membership Actions
Quick action links for common membership operations:
- Renew membership
- Modify membership
- Cancel membership
- Resend confirmation email
- Assign beneficiaries (future feature)

#### 2b. Membership Upgrade Flow

Since Fever Zone is partner-facing (not patron-facing), membership upgrades use a **payment link workflow** rather than direct checkout.

**Flow Overview:**
```
Partner clicks "Upgrade" → Modal opens → Partner copies/emails payment link → Patron receives link → Patron completes payment
```

**Upgrade Modal Components:**

1. **Header**
   - Title: "Upgrade your membership"
   - Tier transition badges: [Current Tier] → [Upgrade Tier]
   - Close button

2. **Enhanced Features Section**
   - Side-by-side comparison of current vs upgrade values
   - Example: "Guest passes: 5/year → Unlimited"
   - Strikethrough styling on current values

3. **New Benefits Section**
   - List of benefits only available in upgrade tier
   - Checkmark icons for each new benefit

4. **Price Summary**
   - Upgrade tier price (e.g., "$249.99/year")
   - Additional cost calculation (upgrade price - current price)

5. **Payment Link Section**
   - Generated URL: `https://pay.fever.co/upgrade/{patronId}/{tier}`
   - Read-only input field displaying the link
   - "Copy" button with "Copied!" feedback state

6. **Actions**
   - "Close" (secondary button)
   - "Send Payment Link via Email" (primary button)

**Email Template (auto-generated):**
- **To**: Patron's email address
- **Subject**: "Upgrade your membership to [Tier]"
- **Body**:
  - Personalized greeting with patron name
  - Current tier → Upgrade tier explanation
  - Bullet list of new benefits
  - Price information
  - Payment link
  - Contact information for questions

#### 2c. Documents Tab (Detailed Specification)

The Documents tab provides centralized access to tax documentation for both membership payments and donations. This follows Bloomerang's pattern for year-end tax documentation.

**Key Features:**

##### Year-End Tax Summary (Primary Feature)
Generate and send consolidated tax summaries to patrons for any calendar year.

- **Year Selector**: Dropdown to select the tax year (default: previous calendar year)
- **Preview Panel**: Shows the complete tax summary document including:
  - Organization info (name, EIN, address)
  - Patron name and address
  - Itemized contributions table with:
    - Date, description, amount, tax-deductible amount
    - Type badges (Membership vs Donation)
  - Total amounts
  - Legal disclaimer about 501(c)(3) status
- **Actions**:
  - "Copy Link" - Copy patron portal link for self-service access
  - "Download PDF" - Generate PDF for mailing
  - "Send via Email" - Primary action to email the summary to patron

**Deductibility Rules:**
- Donations: Fully tax-deductible
- Membership payments: Partially deductible (payment minus fair market value of benefits received)

##### Document History
Chronological log of all documents generated for this patron.

- Document type (Tax Summary, Receipt)
- Year/Period covered
- Date generated
- Sent status (Sent / Not sent)
- Actions: View, Download, Resend

##### Individual Receipts
Per-transaction receipt access with filtering.

- Date range filter
- Type filter (Membership, Donation, In-Kind)
- Receipt details: Date, type, description, amount, deductible amount
- Download individual receipts

##### In-Kind Donations (If Applicable)
Separate section for non-monetary gifts.

- Note banner explaining that donors assign fair market value
- List of in-kind gifts with descriptions and acknowledgement status

**Workflow (Partner-Facing):**
```
Partner opens Documents tab → Selects year → Generates/Previews summary → Sends via email OR downloads PDF for mailing → Patron receives documentation
```

**Sample Tax Document Data:**
| Field | Value |
|-------|-------|
| Organization | Paradox Museum |
| EIN | 12-3456789 |
| 2025 Contributions | $895.99 total |
| 2025 Deductible | $845.99 |

#### 3. Giving Summary
- **Lifetime Contributions**: Total giving with breakdown (donations vs. revenue)
- **Average Contribution**: Mean gift size
- **Visual Chart**: Area chart showing giving trends over time
- **Time Filters**: 1 year, 5 years, YTD, All time
- **Transaction Highlights**:
  - First transaction (date and amount)
  - Last transaction (date and amount)
  - Largest transaction (date and amount)
- **Fundraising Metrics**: Funds, Campaigns, Appeals contributed to

#### 4. Engagement Module
- **Engagement Level**: Visual indicator with 5 levels:
  - Cold (snowflake icon)
  - Cool (meh face)
  - Warm (smile)
  - Hot (laugh)
  - On Fire (fire icon)
- **Attendance Tracking**: Total visits and last visit date
- **Manual Override**: Staff can adjust engagement level

#### 5. Wealth Insights (Phase 3)
- **Integration**: DonorSearch third-party service
- **Propensity to Give Score**: Financial capacity indicator
- **Wealth Screening Data**: Estimated net worth, real estate, etc.

#### 6. Fever Insights / Smart Tips (Phase 3)
- **AI Summary**: Natural language summary of patron activity
- **Actionable Recommendations**:
  - "Offer membership" (frequent visitors)
  - "Renew membership" (approaching expiration)
  - "Send invitation" (upcoming relevant events)
  - "Donation capacity" (high-capacity, low-giving patrons)
- **Quick Actions**: Direct links to take recommended actions

#### 7. Recent Activity / Timeline
- **Activity Types**:
  - Communication: Phone calls, emails, messaging, meetings
  - Earned Revenue: Ticket purchases, transfers, reschedules, upgrades, retail, F&B
  - Contributed Revenue: Donations, membership purchases/renewals
  - Engagement: Event attendance, reviews, notes
- **Manual Logging**: Staff can add external interactions
- **Expandable Details**: Click to see full activity context

#### 8. Relationships
- **Household Members**: Spouse, children, head of household status
- **Corporate Connections**: Employer, board positions (Phase 3)
- **Shared Benefits**: Membership sharing within households

---

## Patron Categories

### Philanthropic Supporters
- Donor
- Major Donor
- Planned Giving Donor

### Institutional Funders
- Corporate Sponsor
- Foundation

### Participants and Members
- Member
- Lapsed Member
- Event Attendee
- Prospect

### Internal Roles
- Board Member
- Volunteer
- Staff

---

## Patron Statuses
- Active
- Inactive
- Pending
- Prospect

---

## Engagement Levels

| Level | Icon | Description |
|-------|------|-------------|
| Cold | Snowflake | No recent engagement |
| Cool | Meh face | Minimal engagement |
| Warm | Smile | Moderate engagement |
| Hot | Laugh | Strong engagement |
| On Fire | Fire | Highly engaged, ready for cultivation |

---

## Phased Rollout

### Phase 1: Demoable Vision (Q1 2026)
- Patron creation through Fever accounts (online purchases)
- Basic patron profile with PII and contact info
- Transaction history (tickets, orders) - no chart
- Attendance tracking
- Basic search/filtering
- Patron category and wealth insight placeholders
- Mobile responsive view

### Phase 2: Enhanced Fundraising Profile
- Manual patron creation with account linking
- Onsite patron creation with opt-in
- Giving summary with chart visualization
- Donation history in timeline
- Membership tracking and renewal reminders
- Relationships/family connections (individual only)
- Engagement scoring (manual)
- Action shortcuts (email, call)

### Phase 3: Advanced CRM & Automation
- User ownership and internal assignment
- Full DonorSearch wealth screening integration
- AI/Smart Tips with recommendations
- Full activity logging with manual entries
- Advanced filtering and donor segmentation

---

## Competitive Landscape

| Competitor | Focus | Strengths | Fever Opportunity |
|------------|-------|-----------|-------------------|
| **Blackbaud Altru** | General admission orgs | True 360° view, all-in-one | Dated UI, weak reporting |
| **Raiser's Edge NXT** | Fundraising | Industry-leading major gifts | Weak ticketing integration |
| **Tessitura** | Arts & cultural | Unified enterprise, deep customization | Slow releases, dated UI |
| **Bloomerang** | Small-mid nonprofits | Donor retention focus, ease of use | Limited ticketing features |

---

## Competitive Features Checklist

The following 10 features are **table stakes** for donor management software targeting mid-to-large US museums. We assess each feature we build against this list to ensure competitive viability, while prioritizing capabilities where Fever's existing platform (ticketing, events) provides a unique advantage.

### 1. Unified Constituent 360° View
Large institutions suffer from "data silos." A single profile must aggregate:
- **Giving History**: Lifetime value and recent gifts
- **Visitor Behavior**: Visit frequency, exhibit scans, ticketing history
- **Commercial Activity**: Gift shop (POS) and cafe spending

**Fever Advantage**: Native ticketing + event data already in platform.

### 2. Campaign Management (DCAP Hierarchy)
Professional fundraising requires tracking **why** a gift was given and **where** it goes. The DCAP hierarchy enables this:

- **Fund**: The accounting destination (Annual Operating, Capital Building, Education, Endowment)
- **Campaign**: The strategic goal, often multi-year (2026 Annual Fund, Building the Future 2025-2030)
- **Appeal**: The marketing trigger that solicited the gift (Spring Gala, Year-End Mailer, Website Donate)
- **Package**: The specific variant for A/B testing (optional)

**Key Capabilities:**
- Every gift is tagged with Fund/Campaign/Appeal for full attribution
- Soft Credits track influencers (Board members who solicited) separate from legal credit
- Campaign progress dashboards show goal vs. actual
- Appeal ROI reports compare cost-to-solicit vs. revenue generated
- LYBUNT/SYBUNT reports identify lapsing donors by year

### 3. Sophisticated Membership Management
Membership is the "top of funnel" for future major donors.
- **Multi-Tiered Benefits**: Individual, Family, Patron, Director's Circle
- **Auto-Renewals**: Credit card updater integration to prevent churn
- **Digital Cards**: Apple/Google Wallet for contactless entry

### 4. Major Gift & "Moves Management" Pipeline
Dedicated Gift Officers cultivate wealthy donors over years.
- **Pipeline Tracking**: Kanban-style board (Qualification → Solicitation → Stewardship)
- **Task/Activity Reminders**: "Call Donor X three days after gallery tour"

### 5. Advanced Prospect Research Integration
Integration with wealth screening services (WealthEngine, DonorSearch).
- **Wealth Screening**: Flag donors with high real estate/stock holdings
- **Propensity to Give**: AI/third-party scoring for major gift likelihood

### 6. Automated Quid Pro Quo & Fair Market Value (FMV)
Museums are unique: donations often include perks.
- **Logic**: $500 donation with $100 dinner → $400 tax-deductible (auto-calculated)
- **Receipt Generation**: Automatic FMV deduction on tax receipts

### 7. Relational Household & Organization Mapping
Donors exist in networks.
- **Householding**: Group spouses while maintaining individual records
- **Employer Matching**: Link donors to companies (Boeing, Google) for matching gifts
- **Soft Credits**: Foundation gives legally, individual gets recognition credit

### 8. Grant & Foundation Tracking
Significant funding from NEA/NEH and private foundations.
- **Deadline Management**: Application windows and reporting requirements
- **Deliverables Storage**: Impact data for grant reports

### 9. Event & Gala Management
Fundraising galas are high-stakes.
- **Table Seating**: Drag-and-drop interfaces for strategic placement
- **Sponsorship Tracking**: Corporate sponsors with ticket blocks

**Fever Advantage**: Native event management capabilities.

### 10. Bi-Directional Financial Integration
Required by accounting departments.
- **GL Mapping**: Every donation maps to General Ledger codes
- **ERP Sync**: Integration with QuickBooks, Sage Intacct, Blackbaud Financial Edge

### 11. Robust Custom Reporting & Dashboards
Museum boards demand data.
- **LYBUNT/SYBUNT Reports**: Identify lapsing donors (Last/Some Year But Not This)
- **Campaign Dashboards**: Real-time progress against capital goals

---

### Coverage Assessment

| Feature | Current Status | Notes |
|---------|----------------|-------|
| 1. Unified 360° View | **Mockup Complete** | Summary tab with giving, activity, engagement |
| 2. Campaign Management | **Mockup Complete** | DCAP hierarchy in data model; Campaign dashboard with goal progress, appeals ROI; GivingSummary shows patron Fund/Campaign breakdown; GivingHistory shows gifts with soft credits |
| 3. Membership Management | **Mockup Complete** | Full Memberships tab with card, benefits, upgrades |
| 4. Moves Management | **Mockup Complete** | Pipeline Kanban board with 5 stages, drag-and-drop |
| 5. Prospect Research | **Placeholder** | WealthInsights component (needs DonorSearch API) |
| 6. FMV Calculation | **Mockup Complete** | Documents tab with tax receipts showing deductible amounts |
| 7. Household Mapping | **Partial** | RelationshipsSummary on Summary tab; full tab placeholder |
| 8. Grant Tracking | Not Started | Future roadmap |
| 9. Event/Gala Mgmt | **Partial** | MemberEvents component; no table seating |
| 10. Financial Integration | Not Started | Future roadmap |
| 11. Custom Reporting | Not Started | Future roadmap |

---

## Mockup Specifications

### Scope
- **Full north star vision**: All features shown in Figma design
- **Audience**: Internal stakeholders for design iteration
- **Interactivity**: Fully interactive with working tabs, filters, expandable items

### Sample Data
Using patron "Anderson Collingwood" with:
- Household: Collingwood Family (verified)
- Category: Member
- Membership: General Membership - Gold
- Member since: 09/08/2025
- Lifetime contributions: $3,222.50
- Average contribution: $214.83
- Total visits: 54
- Engagement: On Fire
- Assigned To: Liam Johnson

#### Financial Data Structure (DCAP Model)

The financial data separates donations (charitable gifts) from revenue (earned income), with donations following the industry-standard DCAP hierarchy (Designation → Campaign → Appeal → Package).

**Terminology Clarification:**
- **Lifetime Value**: Total financial relationship (donations + revenue)
- **Donations**: Charitable gifts that are tax-deductible; attributed to Funds/Campaigns
- **Revenue**: Earned income from Fever core business (tickets, F&B, merchandise); NOT attributed to Funds/Campaigns
- **Average Gift**: Average donation amount (donations-only)

**Aggregates:**
| Field | Value | Notes |
|-------|-------|-------|
| Lifetime Value | $3,222.50 | Total (donations + revenue) |
| Donations | $1,975.00 | Charitable gifts |
| Revenue | $1,247.50 | Tickets, F&B, merch |
| Gift Count | 6 | Number of donation gifts |
| Average Gift | $329.17 | Donations-only average |

**By Fund:**
| Fund | Total | Count |
|------|-------|-------|
| Annual Operating | $1,895.99 | 3 |
| Education Programs | $500.00 | 1 |
| Capital Building | $750.00 | 1 |

**By Campaign:**
| Campaign | Total | Count | Goal |
|----------|-------|-------|------|
| 2026 Annual Fund | $2,145.99 | 3 | $500,000 |
| Building the Future | $750.00 | 1 | $50,000,000 |
| 2025 Annual Fund | $250.00 | 1 | $450,000 |

**Sample Gifts (5 records):**
| Date | Amount | Type | Description | Fund | Campaign | Appeal | Soft Credit |
|------|--------|------|-------------|------|----------|--------|-------------|
| 12/15/2025 | $1,000 | Donation | Year-End Major Gift | Annual Operating | 2026 Annual Fund | Year-End Direct Mail | Margaret Williams (Solicitor) |
| 06/15/2025 | $500 | Donation | Spring Gala Donation | Education | 2026 Annual Fund | Spring Gala 2025 | — |
| 12/02/2025 | $145.99 | Membership | Gold Membership Renewal | Annual Operating | 2026 Annual Fund | Membership Renewal | — |
| 03/22/2025 | $750 | Donation | Building Campaign Gift | Capital Building | Building the Future | Capital Campaign Appeal | Robert Chen (Influencer) |
| 11/18/2024 | $250 | Donation | Online Donation | Annual Operating | 2025 Annual Fund | Website Donate Button | — |

#### Membership Data Structure
Detailed membership sample data used in mockup:

| Field | Value |
|-------|-------|
| Programme | General Membership |
| Tier | Gold |
| Status | Active |
| Member Since | 12/02/2023 |
| Valid Until | 12/02/2026 |
| Days to Renewal | 9 |
| Period Type | Yearly |
| Price | $145.99/year |
| Auto-Renewal | ON |
| Payment Method | Visa •••• 4242 |
| Tenure | 2-year member |
| Total Savings | $248.40 |

**Benefits (6 total):**
| Category | Benefit | Allowance | Used | Reset Date |
|----------|---------|-----------|------|------------|
| Access | Unlimited visits | Unlimited | 34 | — |
| Access | Priority entry | — | — | — |
| Discount | Bring a friend for free | 5/year | 3 | 12/02/2026 |
| Discount | 20% off special events | — | — | — |
| Discount | 10% F&B discount | Unlimited | 12 | — |
| Complimentary | Welcome pack | 1 | 1 | — |

**Upgrade Comparison (Gold → Platinum):**
| Feature | Current (Gold) | Upgrade (Platinum) |
|---------|----------------|-------------------|
| Guest Passes | 5/year | Unlimited |
| Shop Discount | 10% | 15% |
| Parking Discount | 20% | Free |
| Price | $145.99/year | $249.99/year |

**New Benefits at Platinum:**
- Complimentary coat check
- Behind-the-scenes tours
- Exclusive member lounge access
- Private exhibition viewings

---

## Implementation Status (Mockup)

### Completed Tabs

#### Summary Tab
| Component | Description | Status |
|-----------|-------------|--------|
| PatronInfoBox | Profile photo, contact info, membership badge, actions dropdown | Done |
| FinancialSummary | Lifetime value (donations + revenue), donations/revenue split with avg gift, monthly chart, donation attribution (by Fund/Campaign) | Done |
| RecentActivity | Timeline with filters (donations, events, communications) | Done |
| EngagementPanel | Visual engagement level (Cold → On Fire), visit stats | Done |
| WealthInsights | Propensity score, DonorSearch placeholder | Done |
| SmartTips | AI insights panel with actionable recommendations | Done |
| RelationshipsSummary | Household/professional/organization connections | Done |

#### Memberships Tab
| Component | Description | Status |
|-----------|-------------|--------|
| MembershipOverview | Card with QR, benefits by category, usage pills, period progress | Done |
| MemberEvents | Early access + exclusive events with access windows | Done |
| Beneficiaries | Linked family members on membership | Done |
| MembershipHistory | Timeline of membership events | Done |
| UpgradeModal | Tier comparison, payment link workflow | Done |

#### Documents Tab
| Component | Description | Status |
|-----------|-------------|--------|
| TaxSummary | Year-end tax summary generator with preview | Done |
| DocumentHistory | Generated docs, receipts, in-kind donations | Done |

### Completed Pages

#### Pipeline (Moves Management)
| Component | Description | Status |
|-----------|-------------|--------|
| MovesManagement | Kanban board with 5 stages (Identification → Stewardship) | Done |
| Pipeline Cards | Prospect cards with ask amount, last contact, next action | Done |
| Drag-and-Drop | HTML5 native drag between stages | Done |
| Assigned To Filter | Filter pipeline by assigned staff | Done |
| Pipeline Totals | Stage and total pipeline value calculations | Done |

#### Campaigns (Campaign Management)
| Component | Description | Status |
|-----------|-------------|--------|
| CampaignManagement | Card-based grid dashboard for fundraising campaigns | Done |
| Campaign Cards | Goal progress, donor count, gift count, avg gift, timeline | Done |
| Status Grouping | Active and Completed campaign sections | Done |
| Filters | Filter by status (Active/Completed) and by Fund | Done |
| Aggregate Totals | Total goal, total raised, overall progress | Done |
| Expandable Appeals | ROI breakdown (raised vs cost) for each appeal | Done |

**Campaign Data Model:**
- Campaign belongs to a Fund (DCAP hierarchy)
- Campaign has goal, raised, donor count, gift count, avg gift
- Campaign has start/end dates and manager
- Appeals belong to campaigns with raised, cost, and response count
- ROI calculated as raised/cost multiplier

**Sample Campaigns:**
- 2026 Annual Fund: $500K goal, 3 appeals
- Building the Future: $50M capital campaign, 3 appeals
- Education Initiative 2026: $150K goal, 2 appeals
- 2025 Annual Fund (completed): $450K goal met at 102%
- Emergency Relief Fund (completed): $100K goal exceeded

#### Not Yet Implemented
| Tab | Status |
|-----|--------|
| Profile | Placeholder ("coming soon") |
| Timeline | Placeholder ("coming soon") |
| Relationships | Placeholder ("coming soon") |

---

## Design System

Using **Fever Ignite Design System**:
- Primary color: #0089E3
- Accent color: #6F41D7
- Font: Montserrat
- See `design-tokens.json` and `design-system.css` for full token reference

---

## Existing Fever Zone UI Patterns

Patterns observed from the existing Fever Zone application to ensure consistency:

### Layout Structure
- **Header height**: 72px
- **Sidebar width**: 256px (collapsible)
- **Header background**: `#06232c` (dark blue-gray)
- **Sidebar background**: `#06232c` (same as header)
- **Content background**: `#f2f3f3` (light gray)

### CSS Naming Convention
BEM (Block Element Modifier):
- `headerbar__lead-side`
- `headerbar__show-menu`
- `menu-actions__button`
- `menu-actions__user-name`
- `bl-main--logged`

### Icons
- Font Awesome 6 Pro
- Light variant for most icons
- Solid variant for emphasis

### Header Components
- Toggle sidebar button (hamburger menu)
- Fever logo (links to home)
- User menu with name + organization
- User circle icon

### Sidebar Components
- Collapsible with smooth transition
- Menu sections with icons
- Active state highlighting
- Nested sub-menus

### Content Area
- Padding from edges
- Cards with subtle shadows
- White background for cards on gray content area

---

## Design Decisions

### Memberships Tab

The Memberships tab was designed with partner employees in mind, focusing on actionable information rather than patron self-service features.

**Included Components:**
| Component | Purpose |
|-----------|---------|
| MembershipOverview | Card visualization, key stats, benefits with usage |
| EarlyAccessEvents | Shows value of membership to patron |
| PerkRedemptionHistory | Usage log with savings (demonstrates ROI) |
| MembershipDocumentation | Quick access to receipts and terms |
| MembershipActions | Common operations for staff |

**Excluded Components (and rationale):**

| Component | Reason Excluded |
|-----------|-----------------|
| PerksUsage Timeline | Redundant with RedemptionHistory; removed to reduce clutter |
| Standalone Savings Widget | Value is shown in RedemptionHistory header instead |
| ReadyToRedeem Section | Patron-facing feature; not useful for partner staff |
| TierComparison (sidebar) | Moved into upgrade modal for cleaner default view |

**Key Design Principles:**

1. **Partner-First**: All features designed for staff context, not patron self-service
2. **Reduce Redundancy**: Consolidated overlapping information (e.g., savings shown once, not twice)
3. **Progressive Disclosure**: Detailed comparisons in modal, not cluttering main view
4. **Actionable**: Quick actions prominently placed; secondary actions grouped logically

### Staff Assignment Terminology

The platform uses **"Assigned To"** as the standardized term for the staff member responsible for a patron relationship. This decision was made to:

1. **Unify Terminology**: Previously, "Owner" was used in the Patron Profile and "Gift Officer" in the Pipeline. Using a single neutral term reduces confusion.

2. **Broaden Applicability**: "Assigned To" works for all patron types (general members, donors, prospects), unlike "Gift Officer" which implies major gift fundraising context.

3. **Maintain Industry Compatibility**: While "Gift Officer" is industry-standard for major gift cultivation, the broader "Assigned To" still communicates the same concept.

**Data Model:**
- `assignedTo`: Staff member initials (e.g., "LJ")
- `assignedToFull`: Full name (e.g., "Liam Johnson")

**Cross-Screen Consistency:**
Patrons like Anderson Collingwood can appear in both the general Patron Profile AND the Pipeline simultaneously. The `assignedTo` field is shared to ensure consistency. A patron being in the Pipeline doesn't change their general profile data.

---

## Document History
- Created: February 5, 2026
- Updated: February 5, 2026 (Memberships tab detailed specifications)
- Updated: February 5, 2026 (Documents tab for tax documentation)
- Updated: February 5, 2026 (Competitive Features Checklist, Implementation Status, Coverage Assessment)
- Updated: February 5, 2026 (Staff Assignment Terminology - unified "Owner"/"Gift Officer" to "Assigned To")
- Product Manager: Andres Clavel
- Designer: Pablo Rubio Retolaza
- Tech Lead: Victor Almaraz Sanchez
