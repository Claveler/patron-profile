/**
 * Get initials from a name string (e.g. "Jake Thompson" → "JT")
 * @param {string} name - Full name
 * @returns {string} Up to 2-character initials, uppercase
 */
export const getInitials = (name) => {
  if (!name) return '??'
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}
