/**
 * Demo Date Shifting Utility
 * 
 * All demo data was authored relative to a fixed anchor date. This module
 * shifts every date forward (or backward) by the number of days between
 * the anchor and today, so the demo always looks current.
 * 
 * Architecture:
 *   - Called once per data file at module-load time
 *   - Recursively walks data structures and shifts any ISO date string
 *   - Components are completely unaware of the shifting
 */

// The date all demo data was authored relative to
const DEMO_ANCHOR = '2026-02-08'

// Compute offset once at module load
const anchorMs = new Date(DEMO_ANCHOR + 'T00:00:00').getTime()
const todayMs = new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00').getTime()
const OFFSET_MS = todayMs - anchorMs
const OFFSET_DAYS = Math.round(OFFSET_MS / 86400000)

// ISO date pattern: YYYY-MM-DD with optional THH:mm:ss
const FULL_DATE_RE = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?$/
// Month-only pattern: YYYY-MM (exactly 7 chars)
const MONTH_RE = /^\d{4}-\d{2}$/

/**
 * Shift a full date string (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss) by the offset.
 */
export function shiftDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return dateStr
  if (OFFSET_DAYS === 0) return dateStr

  const match = dateStr.match(FULL_DATE_RE)
  if (!match) return dateStr

  const hasTime = !!match[1]
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr

  d.setDate(d.getDate() + OFFSET_DAYS)

  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')

  if (hasTime) {
    const hh = String(d.getHours()).padStart(2, '0')
    const min = String(d.getMinutes()).padStart(2, '0')
    const ss = String(d.getSeconds()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}`
  }

  return `${yyyy}-${mm}-${dd}`
}

/**
 * Shift a month string (YYYY-MM) by the offset.
 */
export function shiftMonth(monthStr) {
  if (!monthStr || typeof monthStr !== 'string') return monthStr
  if (OFFSET_DAYS === 0) return monthStr
  if (!MONTH_RE.test(monthStr)) return monthStr

  // Parse as the 1st of that month, shift, return the new month
  const d = new Date(monthStr + '-01T00:00:00')
  if (isNaN(d.getTime())) return monthStr

  d.setDate(d.getDate() + OFFSET_DAYS)

  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${yyyy}-${mm}`
}

/**
 * Shift a year integer by the offset.
 */
export function shiftYear(year) {
  if (typeof year !== 'number') return year
  if (OFFSET_DAYS === 0) return year
  // Shift by full years (rounded)
  const yearOffset = Math.round(OFFSET_DAYS / 365)
  return year + yearOffset
}

// Keys whose numeric values represent years and should be shifted
const YEAR_KEYS = new Set(['year'])

// Keys whose values are objects with year-string keys (e.g. byYear: { "2025": {...} })
const YEAR_KEY_OBJECTS = new Set(['byYear'])

// Keys to skip entirely (they aren't dates despite looking like they could be)
const SKIP_KEYS = new Set(['id', 'patronId', 'opportunityId', 'fundId', 'campaignId', 'appealId', 'staffId', 'householdId', 'membershipId', 'pledgeId', 'recurringProfileId', 'primaryContactId', 'ein', 'phone', 'email', 'memberNumber', 'giftId'])

// Pattern for year-like object keys (4-digit numbers)
const YEAR_KEY_RE = /^\d{4}$/

/**
 * Recursively walk a data structure and shift all date values.
 * Returns a new object (does not mutate the original).
 */
export function shiftDemoData(data) {
  if (OFFSET_DAYS === 0) return data
  return _shift(data, null)
}

function _shift(value, key) {
  // Skip known non-date string keys
  if (key && SKIP_KEYS.has(key)) return value

  // Handle arrays
  if (Array.isArray(value)) {
    return value.map((item, i) => _shift(item, null))
  }

  // Handle plain objects
  if (value !== null && typeof value === 'object' && !(value instanceof Date)) {
    // Special case: objects whose keys are year strings (e.g. byYear)
    if (key && YEAR_KEY_OBJECTS.has(key)) {
      const result = {}
      for (const k of Object.keys(value)) {
        const newKey = YEAR_KEY_RE.test(k) ? String(shiftYear(Number(k))) : k
        result[newKey] = _shift(value[k], k)
      }
      return result
    }

    const result = {}
    for (const k of Object.keys(value)) {
      result[k] = _shift(value[k], k)
    }
    return result
  }

  // Handle strings -- try date patterns
  if (typeof value === 'string') {
    if (FULL_DATE_RE.test(value)) return shiftDate(value)
    if (MONTH_RE.test(value)) return shiftMonth(value)
    return value
  }

  // Handle year integers (only for known year keys)
  if (typeof value === 'number' && key && YEAR_KEYS.has(key)) {
    return shiftYear(value)
  }

  return value
}

/**
 * Compute daysToRenewal dynamically from a (shifted) validUntil date.
 */
export function computeDaysToRenewal(validUntil) {
  if (!validUntil) return undefined
  const until = new Date(validUntil + 'T00:00:00')
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return Math.max(0, Math.ceil((until - now) / 86400000))
}

/**
 * Get the current offset for debugging/display purposes.
 */
export function getOffsetDays() {
  return OFFSET_DAYS
}
