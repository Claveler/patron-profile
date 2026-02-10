import { useState, useEffect, useContext, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'
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

/* ── Walkthrough Section Renderer ─────────────────────────────────────── */

function WalkthroughView({ walkthrough }) {
  const [expandedSections, setExpandedSections] = useState(() =>
    Object.fromEntries(walkthrough.sections.map((s) => [s.id, true]))
  )
  const [lightbox, setLightbox] = useState(null)

  const toggleSection = useCallback((id) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const openLightbox = useCallback((src, title, description) => {
    setLightbox({ src, title, description })
  }, [])

  const closeLightbox = useCallback(() => {
    setLightbox(null)
  }, [])

  // Close lightbox on Escape
  useEffect(() => {
    if (!lightbox) return
    const handleKey = (e) => {
      if (e.key === 'Escape') closeLightbox()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [lightbox, closeLightbox])

  return (
    <div className="guide-walkthrough">
      {walkthrough.sections.map((section) => (
        <div key={section.id} className="guide-walkthrough__section">
          <button
            className="guide-walkthrough__section-header"
            onClick={() => toggleSection(section.id)}
          >
            <span className="guide-walkthrough__section-title">
              {section.title}
              <span className="guide-panel__component-count">{section.steps.length}</span>
            </span>
            <i
              className={`fa-solid fa-chevron-${expandedSections[section.id] ? 'up' : 'down'} guide-panel__toggle-icon`}
            ></i>
          </button>

          {expandedSections[section.id] && (
            <div className="guide-walkthrough__steps">
              {section.steps.map((step, idx) => (
                <div key={idx} className="guide-walkthrough__step">
                  <div className="guide-walkthrough__step-header">
                    <span className="guide-walkthrough__step-number">{idx + 1}</span>
                    <span className="guide-walkthrough__step-title">{step.title}</span>
                  </div>
                  <p className="guide-walkthrough__step-desc">{step.description}</p>
                  {step.media && (
                    <div
                      className="guide-walkthrough__media"
                      onClick={() => openLightbox(step.media, step.title, step.description)}
                    >
                      <img
                        src={step.media}
                        alt={step.title}
                        className="guide-walkthrough__img"
                        loading="lazy"
                      />
                      <span className="guide-walkthrough__media-hint">
                        <i className="fa-solid fa-expand"></i>
                        Click to expand
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Full-screen lightbox — portaled to body to escape panel stacking context */}
      {lightbox &&
        createPortal(
          <div className="guide-lightbox__overlay" onClick={closeLightbox}>
            <button
              className="guide-lightbox__close"
              onClick={closeLightbox}
              aria-label="Close"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="guide-lightbox__content" onClick={(e) => e.stopPropagation()}>
              <img
                src={lightbox.src}
                alt={lightbox.title}
                className="guide-lightbox__img"
              />
              <div className="guide-lightbox__caption">
                <strong className="guide-lightbox__caption-title">{lightbox.title}</strong>
                <p className="guide-lightbox__caption-desc">{lightbox.description}</p>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}

/* ── Main Panel ───────────────────────────────────────────────────────── */

function ProductGuidePanel() {
  const { guideOpen, toggleGuide, guideTab } = useContext(GuideContext)
  const location = useLocation()

  // Track which component sections are expanded
  const [expandedComponents, setExpandedComponents] = useState(true)

  // Active internal view: overview (existing content) or walkthrough
  const [activeView, setActiveView] = useState('overview')

  // Resolve content based on route + tab
  const content = useMemo(
    () => resolveContent(location.pathname, guideTab),
    [location.pathname, guideTab]
  )

  // Does the current content have a walkthrough?
  const hasWalkthrough = content?.walkthrough?.sections?.length > 0

  // Reset to overview when content changes if walkthrough not available
  useEffect(() => {
    if (!hasWalkthrough && activeView === 'walkthrough') {
      setActiveView('overview')
    }
  }, [hasWalkthrough, activeView])

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

              {/* Tab bar (only when walkthrough is available) */}
              {hasWalkthrough && (
                <div className="guide-panel__tab-bar">
                  <button
                    className={`guide-panel__tab ${activeView === 'overview' ? 'guide-panel__tab--active' : ''}`}
                    onClick={() => setActiveView('overview')}
                  >
                    <i className="fa-solid fa-lightbulb"></i>
                    Overview
                  </button>
                  <button
                    className={`guide-panel__tab ${activeView === 'walkthrough' ? 'guide-panel__tab--active' : ''}`}
                    onClick={() => setActiveView('walkthrough')}
                  >
                    <i className="fa-solid fa-images"></i>
                    Walkthrough
                  </button>
                </div>
              )}
            </>
          ) : (
            <h2 className="guide-panel__title">No Guide Content</h2>
          )}
        </div>

        {/* ── Scrollable Body ───────────────────────────────── */}
        <div className="guide-panel__body">
          {content ? (
            <>
              {activeView === 'walkthrough' && hasWalkthrough ? (
                <WalkthroughView walkthrough={content.walkthrough} />
              ) : (
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
