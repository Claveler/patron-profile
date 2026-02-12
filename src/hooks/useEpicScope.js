import { useContext, useCallback } from 'react'
import { GuideContext } from '../App'
import { EPIC_SCOPE, isInScope } from '../data/epicScope'

/**
 * Hook for inline epic-scope checks.
 *
 * Usage:
 *   const { show, filterGifts } = useEpicScope()
 *   {show('timeline.opportunityChip') && <OpportunityChip />}
 *   const visibleGifts = filterGifts(allGifts)
 */
export function useEpicScope() {
  const { activeEpic } = useContext(GuideContext)

  /**
   * Filter gift records by the active epic.
   * - Epic 1: only donation-prompt gifts (small checkout add-ons from ticketing)
   * - Epic 2+: all gifts
   * @param {Array} gifts
   * @returns {Array}
   */
  const filterGifts = useCallback(
    (gifts) => {
      if (!gifts) return []
      if (activeEpic >= 2) return gifts
      // Epic 1: only show donation-prompt gifts
      return gifts.filter((g) => g.source === 'donation-prompt')
    },
    [activeEpic],
  )

  return {
    activeEpic,
    /**
     * Returns true if the inline feature is in scope for the active epic.
     * @param {string} featureKey  Key from EPIC_SCOPE.inlineFeatures
     * @returns {boolean}
     */
    show: (featureKey) => {
      const minEpic = EPIC_SCOPE.inlineFeatures[featureKey]
      if (minEpic == null) return true // unknown key → always show
      return isInScope(minEpic, activeEpic)
    },
    filterGifts,
  }
}
