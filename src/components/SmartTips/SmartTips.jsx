import './SmartTips.css'

// Generate dynamic insights based on actual patron data
function generateInsights(patron) {
  if (!patron) return { intro: '', points: [], tips: [] }

  const points = []
  const tips = []
  const giving = patron.giving || {}
  const engagement = patron.engagement || {}
  const hasGifts = giving.totalGifts > 0
  const hasRevenue = giving.revenue > 0
  const lifetimeValue = giving.lifetimeValue || 0

  // Giving behavior insight
  if (hasGifts && giving.totalGifts >= 1000) {
    points.push(`Strong giving history with $${giving.totalGifts.toLocaleString()} in total gifts`)
  } else if (hasGifts) {
    points.push(`Has given $${giving.totalGifts.toLocaleString()} — potential for increased giving with cultivation`)
  } else if (hasRevenue) {
    points.push(`Revenue of $${(giving.revenue || 0).toLocaleString()} from tickets, F&B, and merchandise — no gifts recorded yet`)
  }

  // Engagement insight
  const level = engagement.level
  const visits = engagement.visits || 0
  if (level === 'on-fire' || level === 'hot') {
    points.push(`${level === 'on-fire' ? 'Exceptional' : 'High'} engagement — ${visits} visits recorded, very active patron`)
  } else if (level === 'warm') {
    points.push(`Warm engagement with ${visits} visits — steady but room to deepen the relationship`)
  } else if (level === 'cool') {
    points.push(`Cool engagement with only ${visits} visits — consider re-engagement strategies`)
  } else if (level === 'cold') {
    points.push(`Cold engagement — minimal recent activity, may need outreach to reconnect`)
  }

  // Assignment / prospect status
  if (patron.assignedToId) {
    points.push('Managed prospect with an assigned gift officer — relationship is actively cultivated')
  } else {
    points.push('General constituent with no assigned gift officer — a candidate for portfolio assignment')
  }

  // Membership insight
  if (patron.membership || patron.membershipId) {
    const daysToRenewal = patron.daysToRenewal
    if (daysToRenewal !== undefined && daysToRenewal < 60) {
      points.push(`Membership renewal approaching in ${daysToRenewal} days — retention touchpoint recommended`)
    }
  }

  // Generate tips
  if (level === 'on-fire' || level === 'hot' || level === 'warm') {
    tips.push({
      id: 1,
      icon: 'fa-calendar',
      title: 'Schedule a meeting',
      description: 'Their engagement score suggests they\'re ready for a personal touchpoint.',
      action: 'Schedule'
    })
  } else {
    tips.push({
      id: 1,
      icon: 'fa-envelope',
      title: 'Send a re-engagement email',
      description: 'A personal note could help rekindle this relationship.',
      action: 'Send'
    })
  }

  if (hasGifts && giving.lastGift) {
    const daysSinceLast = Math.floor((new Date() - new Date(giving.lastGift)) / (1000 * 60 * 60 * 24))
    tips.push({
      id: 2,
      icon: 'fa-envelope',
      title: daysSinceLast > 90 ? 'Follow up on giving' : 'Send thank you note',
      description: daysSinceLast > 90
        ? `It's been ${daysSinceLast} days since their last gift. Consider a follow-up.`
        : `It's been ${daysSinceLast} days since their last gift.`,
      action: 'Send'
    })
  } else if (!hasGifts && lifetimeValue > 0) {
    tips.push({
      id: 2,
      icon: 'fa-hand-holding-dollar',
      title: 'First gift ask',
      description: 'This patron has revenue history but no gifts. Consider a soft ask.',
      action: 'Plan'
    })
  }

  const hasEnoughData = points.length >= 2

  return {
    intro: hasEnoughData
      ? "Here's what we know about this patron:"
      : "Limited data available for this patron:",
    points,
    tips,
    hasEnoughData
  }
}

function SmartTips({ patron }) {
  const { intro, points, tips, hasEnoughData } = generateInsights(patron)
  return (
    <div className="ai-insights wrapper-card">
      <div className="ai-insights__header">
        <div className="ai-insights__title">
          <img 
            src="/fever-logo.svg" 
            alt="Fever" 
            className="ai-insights__logo"
          />
          <span className="ai-insights__title-text">
            <span className="ai-insights__title-highlight">AI</span> Insights
          </span>
          <i className="fa-solid fa-sparkles ai-insights__sparkles"></i>
        </div>
        <button className="ai-insights__configure">Configure</button>
      </div>

      {/* AI Summary */}
      <div className="ai-insights__summary">
        <p className="ai-insights__summary-intro">{intro}</p>
        {points.length > 0 ? (
          <ul className="ai-insights__summary-list">
            {points.map((point, index) => (
              <li key={index} className="ai-insights__summary-item">{point}</li>
            ))}
          </ul>
        ) : (
          <p className="ai-insights__summary-empty">
            Not enough activity data to generate meaningful insights. As this patron interacts with your organization, insights will appear here.
          </p>
        )}
      </div>

      {/* Tips */}
      <div className="ai-insights__tips">
        {tips.map((tip) => (
          <div key={tip.id} className="ai-insights__tip-card">
            <i className={`fa-solid ${tip.icon} ai-insights__tip-icon`}></i>
            <div className="ai-insights__tip-content">
              <h5 className="ai-insights__tip-title">{tip.title}</h5>
              <p className="ai-insights__tip-description">{tip.description}</p>
            </div>
            <button className="ai-insights__tip-action">{tip.action}</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SmartTips
