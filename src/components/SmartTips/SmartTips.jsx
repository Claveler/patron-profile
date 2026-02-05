import './SmartTips.css'

const aiSummary = {
  intro: "Here's what we know about this patron:",
  points: [
    "Consistent donor with increasing contribution amounts over time",
    "High engagement with events - attended 12 events this year",
    "Prefers email communication, opens 89% of emails",
    "Connected to Johnson Family Foundation (DAF)"
  ]
}

const tips = [
  {
    id: 1,
    icon: 'fa-calendar',
    title: 'Schedule a meeting',
    description: 'Their engagement score suggests they\'re ready for a personal touchpoint.',
    action: 'Schedule'
  },
  {
    id: 2,
    icon: 'fa-envelope',
    title: 'Send thank you note',
    description: 'It\'s been 30 days since their last donation.',
    action: 'Send'
  }
]

function SmartTips() {
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
        <p className="ai-insights__summary-intro">{aiSummary.intro}</p>
        <ul className="ai-insights__summary-list">
          {aiSummary.points.map((point, index) => (
            <li key={index} className="ai-insights__summary-item">{point}</li>
          ))}
        </ul>
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
