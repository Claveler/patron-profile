# Technical Specification: Unified Patron-Membership Model

## 1. Overview

### 1.1 Problem Statement
The current data model embeds membership and beneficiary data directly within individual patron records. This creates several limitations:
- Beneficiaries exist only as names, not as trackable patron entities
- No individual usage tracking for family members
- No lifecycle continuity when relationships change
- Inconsistency between Relationships and Beneficiaries data

### 1.2 Solution
Implement a normalized data model where:
- **Memberships** are first-class entities shared across patrons
- **Beneficiaries** are real patron records linked to memberships
- **Relationships** provide the CRM context layer connecting patrons
- All three concepts work together but serve distinct purposes

### 1.3 Scope
This spec covers:
- Data model changes
- UI changes to Memberships tab (Primary vs Beneficiary views)
- Beneficiaries card enhancements
- Add/Remove Beneficiary workflows
- Relationship synchronization

Out of scope (future phases):
- Household giving aggregation
- Soft credit automation
- Membership purchase flow redesign
- Self-service patron portal

---

## 2. Entity Model

### 2.1 Core Entities

```
┌─────────────────────────────────────────────────────────────────┐
│                           PATRON                                │
│  Central entity for all individuals in the system               │
├─────────────────────────────────────────────────────────────────┤
│  id: string (uuid)                                              │
│  firstName: string                                              │
│  lastName: string                                               │
│  email: string (optional)                                       │
│  phone: string (optional)                                       │
│  dateOfBirth: date (optional)                                   │
│  status: "active" | "archived"                                  │
│  ** Proposed extensions (not yet in DATA_MODEL): **              │
│  **   "stub" | "deceased" | "merged"                  **        │
│  mergedIntoId: string (if merged, points to surviving record)   │
│  source: "ticket" | "online" | "membership" | "manual" | "import" │
│  createdDate: datetime                                          │
│  ...existing patron fields...                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         MEMBERSHIP                              │
│  Represents a membership account (can have multiple patrons)    │
├─────────────────────────────────────────────────────────────────┤
│  id: string (uuid)                                              │
│  program: string ("General Membership", "Patron Circle", etc.) │
│  tier: string ("Basic", "Silver", "Gold", "Platinum")           │
│  status: "active" | "expired" | "cancelled" | "pending"         │
│  startDate: date                                                │
│  renewalDate: date                                              │
│  expirationDate: date                                           │
│  autoRenewal: boolean                                           │
│  paymentMethod: object { type, last4, expiry }                  │
│  benefits: object (tier-specific benefits config)               │
│  createdDate: datetime                                          │
│  updatedDate: datetime                                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   MEMBERSHIP_BENEFICIARY                        │
│  Join table linking patrons to memberships                      │
├─────────────────────────────────────────────────────────────────┤
│  id: string (uuid)                                              │
│  membershipId: string (FK → Membership)                         │
│  patronId: string (FK → Patron)                                 │
│  role: "primary" | "beneficiary" | "dependent"                  │
│  roleLabel: string ("Spouse", "Child", "Partner", etc.)         │
│  canManage: boolean (can modify membership settings)            │
│  addedDate: date                                                │
│  removedDate: date (null if active)                             │
│  status: "active" | "removed"                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   PATRON_RELATIONSHIP                           │
│  CRM connections between patrons (broader than membership)      │
├─────────────────────────────────────────────────────────────────┤
│  id: string (uuid)                                              │
│  fromPatronId: string (FK → Patron)                             │
│  toPatronId: string (FK → Patron)                               │
│  type: "household" | "professional" | "organization"            │
│  role: string ("Spouse", "Child", "Financial Advisor", etc.)    │
│  reciprocalRole: string ("Spouse", "Parent", "Client", etc.)    │
│  isPrimary: boolean (primary household contact)                 │
│  startDate: date (optional)                                     │
│  endDate: date (optional, for former relationships)             │
│  notes: string (optional)                                       │
│  createdDate: datetime                                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      MEMBERSHIP_USAGE                           │
│  Tracks individual usage of membership benefits                 │
├─────────────────────────────────────────────────────────────────┤
│  id: string (uuid)                                              │
│  membershipId: string (FK → Membership)                         │
│  patronId: string (FK → Patron, the person who used it)         │
│  benefitType: string ("admission", "guest_pass", "discount")    │
│  usedDate: datetime                                             │
│  quantity: number                                               │
│  context: string (optional, e.g., "Spring Gala")                │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Entity Relationship Diagram

```
                    ┌──────────────┐
                    │   PATRON     │
                    └──────┬───────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
    ┌───────────┐   ┌─────────────┐   ┌──────────────┐
    │PATRON_    │   │MEMBERSHIP_  │   │MEMBERSHIP_   │
    │RELATIONSHIP│  │BENEFICIARY  │   │USAGE         │
    └───────────┘   └──────┬──────┘   └──────┬───────┘
                           │                  │
                           ▼                  │
                    ┌──────────────┐          │
                    │  MEMBERSHIP  │◄─────────┘
                    └──────────────┘
```

### 2.3 Key Constraints

1. **One Primary per Membership**: Each membership must have exactly one beneficiary with `role: "primary"`
2. **Beneficiary Limits**: Tier configuration defines max beneficiaries (e.g., Basic=1, Gold=4, Platinum=unlimited)
3. **Patron Uniqueness**: A patron can only be linked to a membership once (no duplicate links)
4. **Relationship Reciprocity**: When creating "Spouse" relationship A→B, auto-create B→A with reciprocal role

---

## 3. UI Specifications

### 3.1 Memberships Tab: Primary Member View (Current User = Primary)

**Header Area**
```
┌─────────────────────────────────────────────────────────────────┐
│  🏛️ General Membership                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                                │
│  GOLD MEMBER                           You are the primary      │
│  Member since Dec 2, 2023              account holder           │
│                                                                 │
│  Renews: Dec 2, 2026 (327 days)     [Manage Payment] [Upgrade] │
└─────────────────────────────────────────────────────────────────┘
```

**Beneficiaries Card (Primary View)**
```
┌─────────────────────────────────────────────────────────────────┐
│  Beneficiaries                                      3/4 slots   │
├─────────────────────────────────────────────────────────────────┤
│  ┌────┐                                                         │
│  │ AC │  Anderson Collingwood                    ★ Primary      │
│  └────┘  You                                                    │
│  ─────────────────────────────────────────────────────────────  │
│  ┌────┐                                                         │
│  │ SC │  Sarah Collingwood                       Spouse      ▶  │
│  └────┘  sarah@collingwood.com                        [Remove]  │
│  ─────────────────────────────────────────────────────────────  │
│  ┌────┐                                                         │
│  │ EC │  Emma Collingwood                        Child       ▶  │
│  └────┘  (no email)                                   [Remove]  │
├─────────────────────────────────────────────────────────────────┤
│  [+ Add Beneficiary]                                            │
└─────────────────────────────────────────────────────────────────┘
```

**Usage Stats (shows breakdown by person)**
```
┌─────────────────────────────────────────────────────────────────┐
│  Usage This Period                                              │
├─────────────────────────────────────────────────────────────────┤
│                          TOTAL    Anderson   Sarah    Emma      │
│  Admissions              47       12         28       7         │
│  Guest Passes            3/5      1          2        0         │
│  Store Discount Uses     12       4          8        0         │
│  Event Tickets           5        2          3        0         │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Memberships Tab: Beneficiary View (Current User ≠ Primary)

**Header Area**
```
┌─────────────────────────────────────────────────────────────────┐
│  🏛️ General Membership                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                                │
│  GOLD MEMBER                           You are a beneficiary    │
│  Beneficiary since Jun 15, 2024        on this membership       │
│                                                                 │
│  Primary account holder: Anderson Collingwood ▶                 │
│  Renews: Dec 2, 2026 (327 days)                                │
└─────────────────────────────────────────────────────────────────┘
│  ⓘ Contact Anderson Collingwood for payment or upgrade options │
└─────────────────────────────────────────────────────────────────┘
```

**Beneficiaries Card (Beneficiary View - Read Only)**
```
┌─────────────────────────────────────────────────────────────────┐
│  Beneficiaries                                      3/4 slots   │
├─────────────────────────────────────────────────────────────────┤
│  ┌────┐                                                         │
│  │ AC │  Anderson Collingwood                    ★ Primary   ▶  │
│  └────┘  anderson@collingwood.com                               │
│  ─────────────────────────────────────────────────────────────  │
│  ┌────┐                                                         │
│  │ SC │  Sarah Collingwood                       Spouse         │
│  └────┘  You                                                    │
│  ─────────────────────────────────────────────────────────────  │
│  ┌────┐                                                         │
│  │ EC │  Emma Collingwood                        Child       ▶  │
│  └────┘  (no email)                                             │
└─────────────────────────────────────────────────────────────────┘
│  (No "Add Beneficiary" button - only primary can manage)        │
```

**Usage Stats (shows personal usage with household context)**
```
┌─────────────────────────────────────────────────────────────────┐
│  Your Usage This Period                   Household Total: 47   │
├─────────────────────────────────────────────────────────────────┤
│  Admissions              28       ████████████████████░░░░░     │
│  Guest Passes            2/5      (shared pool)                 │
│  Store Discount Uses     8        ████████░░░░░░░░░░░░░░░░     │
└─────────────────────────────────────────────────────────────────┘
```

### 3.3 Multiple Memberships View

When a patron is on multiple memberships, show cards:

```
┌─────────────────────────────────────────────────────────────────┐
│  Your Memberships (2)                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────┐  ┌─────────────────────────┐   │
│  │ 🏛️ MoMA                    │  │ 🌿 Brooklyn Botanic     │   │
│  │ Gold Family                │  │ Family Plus             │   │
│  │ ────────────────────────── │  │ ────────────────────────│   │
│  │ Role: Beneficiary          │  │ Role: Primary           │   │
│  │ Primary: Anderson C.       │  │ Renews: Mar 15, 2027    │   │
│  │ Expires: Dec 2, 2026       │  │                         │   │
│  │                            │  │                         │   │
│  │ [View Details]             │  │ [View Details] [Manage] │   │
│  └─────────────────────────────┘  └─────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.4 Add Beneficiary Modal

```
┌─────────────────────────────────────────────────────────────────┐
│  Add Beneficiary                                           ✕    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Search for an existing patron or create a new one.             │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🔍 Search by name or email...                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─ Results ──────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  ┌────┐  Sarah Collingwood                              │    │
│  │  │ SC │  sarah@collingwood.com                  [Add]   │    │
│  │  └────┘  Existing patron • No current membership        │    │
│  │                                                         │    │
│  │  ┌────┐  Sara Collins                                   │    │
│  │  │ SC │  s.collins@email.com                    [Add]   │    │
│  │  └────┘  Existing patron • Gold Member (own acct)       │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ─────────────────── OR ───────────────────                     │
│                                                                 │
│  [+ Create New Patron]                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**After selecting/creating, show role assignment:**

```
┌─────────────────────────────────────────────────────────────────┐
│  Add Beneficiary                                           ✕    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Adding: Sarah Collingwood                                      │
│          sarah@collingwood.com                                  │
│                                                                 │
│  Relationship to primary account holder:                        │
│                                                                 │
│  ○ Spouse / Partner                                             │
│  ○ Child                                                        │
│  ○ Parent                                                       │
│  ○ Sibling                                                      │
│  ○ Other: [_______________]                                     │
│                                                                 │
│  ☑ Also create household relationship                          │
│    (Links these patrons in CRM for gift crediting)              │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                              [Cancel]  [Add as Beneficiary]     │
└─────────────────────────────────────────────────────────────────┘
```

### 3.5 Create New Patron (Inline in Modal)

```
┌─────────────────────────────────────────────────────────────────┐
│  Add Beneficiary → Create New Patron                       ✕    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  First Name *          Last Name *                              │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │ Emma             │  │ Collingwood      │                    │
│  └──────────────────┘  └──────────────────┘                    │
│                                                                 │
│  Email                           Date of Birth                  │
│  ┌──────────────────────────┐   ┌──────────────────┐           │
│  │                          │   │ 03/15/2012       │           │
│  └──────────────────────────┘   └──────────────────┘           │
│                                  (Used for age-out tracking)    │
│                                                                 │
│  Relationship to Anderson Collingwood:                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Child                                                 ▼  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ☑ Create household relationship                               │
│  ☐ Copy address from primary (123 Park Avenue...)              │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                      [Cancel]  [Create & Add as Beneficiary]    │
└─────────────────────────────────────────────────────────────────┘
```

### 3.6 Remove Beneficiary Confirmation

```
┌─────────────────────────────────────────────────────────────────┐
│  Remove Beneficiary                                        ✕    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ⚠️ Remove Emma Collingwood from this membership?              │
│                                                                 │
│  Emma will no longer be able to use membership benefits.        │
│  Her patron record will be preserved for historical tracking.   │
│                                                                 │
│  ☐ Also remove household relationship                          │
│    (Uncheck if still family, just not on this membership)       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                    [Cancel]  [Remove]           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Workflows

### 4.1 Add Beneficiary Flow

```
┌─────────────────┐
│ Click "Add      │
│ Beneficiary"    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│ Search existing │────▶│ Patron found?   │
│ patrons         │     └────────┬────────┘
└─────────────────┘              │
                          ┌──────┴──────┐
                          │             │
                         YES           NO
                          │             │
                          ▼             ▼
                   ┌─────────────┐  ┌─────────────┐
                   │ Select      │  │ Create new  │
                   │ existing    │  │ patron form │
                   └──────┬──────┘  └──────┬──────┘
                          │                │
                          └───────┬────────┘
                                  │
                                  ▼
                          ┌─────────────────┐
                          │ Assign role     │
                          │ (Spouse, Child) │
                          └────────┬────────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │ Create          │
                          │ MEMBERSHIP_     │
                          │ BENEFICIARY     │
                          └────────┬────────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │ Optionally      │
                          │ create PATRON_  │
                          │ RELATIONSHIP    │
                          └────────┬────────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │ Done            │
                          └─────────────────┘
```

### 4.2 Remove Beneficiary Flow

```
┌─────────────────┐
│ Click "Remove"  │
│ on beneficiary  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Confirmation    │
│ modal           │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Set             │
│ MEMBERSHIP_     │
│ BENEFICIARY     │
│ status="removed"│
│ removedDate=now │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│ User chose to   │────▶│ Set PATRON_     │
│ remove          │ YES │ RELATIONSHIP    │
│ relationship?   │     │ endDate=now     │
                        └─────────────────┘
└────────┬────────┘
         │ NO
         ▼
┌─────────────────┐
│ Done            │
│ (relationship   │
│ preserved)      │
└─────────────────┘
```

### 4.3 View Patron Profile (from Beneficiary Click)

```
User clicks beneficiary name/chevron
         │
         ▼
Navigate to /patron/{patronId}
         │
         ▼
Load that patron's full profile
(Their memberships tab would show
 the shared membership from their
 perspective)
```

---

## 5. API Endpoints (Conceptual)

```
GET    /api/patrons/{patronId}/memberships
       Returns all memberships where patron is primary or beneficiary

GET    /api/memberships/{membershipId}
       Returns membership details including all beneficiaries

POST   /api/memberships/{membershipId}/beneficiaries
       Body: { patronId, role, roleLabel, createRelationship }
       Adds existing patron as beneficiary

POST   /api/memberships/{membershipId}/beneficiaries/create
       Body: { firstName, lastName, email?, dateOfBirth?, role, roleLabel, createRelationship }
       Creates new patron and adds as beneficiary

DELETE /api/memberships/{membershipId}/beneficiaries/{patronId}
       Body: { removeRelationship }
       Soft-deletes beneficiary link

GET    /api/memberships/{membershipId}/usage
       Query: { groupBy: "patron" | "benefit" }
       Returns usage stats, optionally broken down by person

GET    /api/patrons/search
       Query: { q: "sarah colling", limit: 10 }
       Fuzzy search for patron matching
```

---

## 6. Migration Strategy

### 6.1 Phase 1: Extract Memberships

**Current State:**
```javascript
// Membership embedded in patron
patron: {
  id: "anderson-collingwood",
  membership: {
    programme: "General",
    tier: "Gold",
    beneficiaries: [
      { name: "Sarah Collingwood", role: "Spouse" }
    ]
  }
}
```

**Target State:**
```javascript
// Separate membership entity
membership: {
  id: "mem-001",
  programme: "General",
  tier: "Gold"
}

membership_beneficiary: [
  { membershipId: "mem-001", patronId: "anderson-collingwood", role: "primary" },
  { membershipId: "mem-001", patronId: "sarah-collingwood", role: "beneficiary" }
]
```

**Migration Steps:**
1. Create `memberships` collection from embedded data
2. Create patron stubs for beneficiaries that don't exist
3. Create `membership_beneficiary` links
4. Create `relationships` for household connections
5. Update UI to read from new structure
6. Deprecate embedded `membership` field

### 6.2 Phase 2: Enrich Stub Patrons

After migration, stub patrons will have minimal data:
```javascript
{
  id: "sarah-collingwood",
  firstName: "Sarah",
  lastName: "Collingwood",
  recordStatus: "stub",  // Flag for staff attention
  email: null,
  source: "migration"
}
```

Provide staff with a "Data Quality" report showing stubs that need enrichment.

---

## 7. Implementation Phases

### Phase 1: Data Model (Foundation)
- [ ] Define new data structures in `/src/data/`
- [ ] Create `memberships.js` with membership entities
- [ ] Create `membershipBeneficiaries.js` with join records
- [ ] Update `relationships` to use patron IDs
- [ ] Create migration script for existing data
- [ ] Add helper functions: `getMembershipsByPatron()`, `getBeneficiariesByMembership()`

### Phase 2: Read Path (Display)
- [ ] Update `MembershipsTab` to detect primary vs beneficiary role
- [ ] Create `MembershipCard` component for multi-membership view
- [ ] Update `Beneficiaries` component to link to patron profiles
- [ ] Add usage breakdown by patron in `PerksUsage`
- [ ] Show "You are a beneficiary" messaging for non-primary

### Phase 3: Write Path (Management)
- [ ] Build `AddBeneficiaryModal` with search and create flows
- [ ] Build `RemoveBeneficiaryModal` with confirmation
- [ ] Implement relationship auto-creation option
- [ ] Add beneficiary slot limit enforcement by tier

### Phase 4: Relationships Integration
- [ ] Update `RelationshipsSummary` to use patron data (not hardcoded)
- [ ] Ensure beneficiary additions can create relationships
- [ ] Build full `RelationshipsTab` with household management

### Phase 5: Polish & Edge Cases
- [ ] Handle deceased patrons (don't show as addable)
- [ ] Handle merged patrons (redirect to surviving record)
- [ ] Age-out notifications for child dependents
- [ ] Audit log for beneficiary changes

---

## 8. Open Questions for Product Review

1. **Beneficiary limits by tier** - What are the actual limits?
   - Basic: 1 (individual only)?
   - Silver: 2?
   - Gold: 4?
   - Platinum: Unlimited?

2. **Can children age out automatically?** 
   - If Emma turns 18, should she be auto-removed or just flagged?
   - Age threshold: 18? 21? 26 (like health insurance)?

3. **Transfer of primary ownership**
   - If Anderson passes away, can Sarah become primary?
   - Is this a staff-only action or self-service?

4. **Guest vs Beneficiary distinction**
   - Beneficiaries are named and tracked
   - Guest passes are anonymous
   - Is this correct, or should guests also be tracked?

5. **Cross-institution memberships**
   - If Fever supports multiple museums, can one patron profile span them?
   - Or is each museum a separate tenant with separate patrons?

---

## 9. Success Metrics

| Metric | Target |
|--------|--------|
| Beneficiary data completeness | >80% have email or DOB |
| Duplicate patron rate | <5% flagged as potential dupes |
| Individual usage tracking | 100% of scans attributed to specific beneficiary |
| Staff adoption | >90% using linked profiles vs. name-only |

---

## Document History

- Created: February 6, 2026
- Updated: February 8, 2026 (Terminology alignment with DATA_MODEL.md: autoRenew -> autoRenewal, programme -> program, RELATIONSHIP -> PATRON_RELATIONSHIP, source values expanded, status field aligned with proposed extensions noted)
- Author: AI Assistant (based on product discussion with Andres Clavel)
- Status: Draft for Review
