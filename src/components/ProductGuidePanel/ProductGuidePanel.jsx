import { useState, useEffect, useContext, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { GuideContext } from '../../App'
import GUIDE_CONTENT from '../../data/productGuide'
import './ProductGuidePanel.css'

/**
 * Match the current pathname + guideTab to a content entry in GUIDE_CONTENT.
 */
function resolveContent(pathname, guideTab) {
  // Exact match first (/, /patrons, /gifts, /campaigns, /settings)
  if (GUIDE_CONTENT[pathname]) {
    return GUIDE_CONTENT[pathname]
  }

  // Patron profile: /patrons/:patronId
  if (/^\/patrons\/[^/]+$/.test(pathname)) {
    const patronEntry = GUIDE_CONTENT['/patrons/:patronId']
    if (patronEntry && patronEntry.tabs) {
      const tab = guideTab || 'summary'
      return patronEntry.tabs[tab] || patronEntry.tabs.summary
    }
    return null
  }

  // Opportunity detail: /opportunities/:oppId
  if (/^\/opportunities\/[^/]+$/.test(pathname)) {
    return GUIDE_CONTENT['/opportunities/:oppId'] || null
  }

  return null
}

function ProductGuidePanel() {
  const { guideOpen, toggleGuide, guideTab } = useContext(GuideContext)
  const location = useLocation()

  // Track which component sections are expanded
  const [expandedComponents, setExpandedComponents] = useState(true)

  // Resolve content based on route + tab
  const content = useMemo(
    () => resolveContent(location.pathname, guideTab),
    [location.pathname, guideTab]
  )

  // Close on Escape key
  useEffect(() => {
    if (!guideOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') toggleGuide()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [guideOpen, toggleGuide])

  if (!guideOpen) return null

  return (
    <div className="guide-panel__overlay" onClick={toggleGuide}>
      <div
        className="guide-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ────────────────────────────────────────── */}
        <div className="guide-panel__header">
          <div className="guide-panel__header-top">
            <div className="guide-panel__brand">
              <i className="fa-solid fa-compass guide-panel__brand-icon"></i>
              <span className="guide-panel__brand-label">Product Guide</span>
            </div>
            <button className="guide-panel__close" onClick={toggleGuide} aria-label="Close guide">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {content ? (
            <>
              <h2 className="guide-panel__title">{content.title}</h2>
              <div className="guide-panel__badges">
                {content.persona && (
                  <span className="guide-panel__badge guide-panel__badge--persona">
                    <i className="fa-solid fa-user"></i>
                    {content.persona}
                  </span>
                )}
                {content.epic && (
                  <span className="guide-panel__badge guide-panel__badge--epic">
                    <i className="fa-solid fa-layer-group"></i>
                    {content.epic}
                  </span>
                )}
              </div>
            </>
          ) : (
            <h2 className="guide-panel__title">No Guide Content</h2>
          )}
        </div>

        {/* ── Scrollable Body ───────────────────────────────── */}
        <div className="guide-panel__body">
          {content ? (
            <>
              {/* Section: Why This Exists */}
              <div className="guide-panel__section">
                <h5 className="guide-panel__section-title">
                  <i className="fa-solid fa-lightbulb"></i>
                  Why This Exists
                </h5>
                <p className="guide-panel__text">{content.why}</p>
              </div>

              {/* Section: Competitive Edge */}
              {content.competitive && (
                <div className="guide-panel__section">
                  <h5 className="guide-panel__section-title">
                    <i className="fa-solid fa-chess"></i>
                    Competitive Edge
                  </h5>
                  <p className="guide-panel__text">{content.competitive}</p>
                </div>
              )}

              {/* Section: Demo Talking Point (wow moment) */}
              {content.wowMoment && (
                <div className="guide-panel__section">
                  <h5 className="guide-panel__section-title">
                    <i className="fa-solid fa-star"></i>
                    Demo Talking Point
                  </h5>
                  <div className="guide-panel__callout">
                    <p className="guide-panel__text">{content.wowMoment}</p>
                  </div>
                </div>
              )}

              {/* Section: Key Components */}
              {content.components && content.components.length > 0 && (
                <div className="guide-panel__section">
                  <button
                    className="guide-panel__section-title guide-panel__section-title--toggle"
                    onClick={() => setExpandedComponents(!expandedComponents)}
                  >
                    <span className="guide-panel__section-title-left">
                      <i className="fa-solid fa-cubes"></i>
                      Key Components
                      <span className="guide-panel__component-count">
                        {content.components.length}
                      </span>
                    </span>
                    <i className={`fa-solid fa-chevron-${expandedComponents ? 'up' : 'down'} guide-panel__toggle-icon`}></i>
                  </button>

                  {expandedComponents && (
                    <div className="guide-panel__components">
                      {content.components.map((comp, idx) => (
                        <div key={idx} className="guide-panel__component-card">
                          <div className="guide-panel__component-name">
                            {comp.name}
                          </div>
                          <p className="guide-panel__component-reasoning">
                            {comp.reasoning}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="guide-panel__empty">
              <i className="fa-solid fa-compass"></i>
              <p>No product guide content has been authored for this page yet.</p>
              <p className="guide-panel__empty-hint">
                Navigate to a different page to see product reasoning, competitive context, and demo talking points.
              </p>
            </div>
          )}
        </div>

        {/* ── Footer ────────────────────────────────────────── */}
        <div className="guide-panel__footer">
          <span className="guide-panel__footer-text">
            <i className="fa-solid fa-book-open"></i>
            Content sourced from product-management/ docs
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProductGuidePanel
