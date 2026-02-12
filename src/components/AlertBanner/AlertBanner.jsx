import { isManagedProspect, getPrimaryMembershipForPatron, getPendingAcknowledgments, getPledgesByPatronId } from '../../data/patrons'
import { useEpicScope } from '../../hooks/useEpicScope'
import './AlertBanner.css'

// Calculate days since a date
const getDaysSince = (dateStr) => {
  if (!dateStr) return null
  const date = new Date(dateStr)
  const today = new Date()
  const diffTime = today - date
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

// Format currency for alert messages
const formatCurrency = (amount) => {
  if (!amount) return '$0'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function AlertBanner({ patron }) {
  const membership = getPrimaryMembershipForPatron(patron.id)
  const alerts = []
  const isManaged = isManagedProspect(patron)
  const { show } = useEpicScope()

  // Check for contact overdue (prospect pipeline) - ONLY for Managed Prospects
  // Gated behind pipeline epic scope
  if (show('alertBanner.pipelineAlert') && isManaged && patron.prospect?.lastContact) {
    const daysSince = getDaysSince(patron.prospect.lastContact)
    if (daysSince >= 14) {
      alerts.push({
        id: 'contact-overdue',
        type: daysSince >= 21 ? 'warning' : 'info',
        icon: 'fa-circle-exclamation',
        title: `Contact overdue`,
        message: `${daysSince} days since last touch`,
        action: patron.prospect.nextAction,
        actionLabel: 'Take Action',
        isPipeline: true
      })
    }
  }

  // Check for renewal approaching - Universal alert (all patrons)
  if (membership?.daysToRenewal <= 14 && !membership?.autoRenewal) {
    alerts.push({
      id: 'renewal-approaching',
      type: membership.daysToRenewal <= 7 ? 'warning' : 'info',
      icon: 'fa-circle-info',
      title: 'Renewal approaching',
      message: `${membership.daysToRenewal} days to renewal`,
      action: 'Send renewal reminder',
      actionLabel: 'Remind',
      isPipeline: false
    })
  }

  // Check for pending acknowledgments
  const pendingAcks = getPendingAcknowledgments(patron.id)
  if (pendingAcks.length > 0) {
    alerts.push({
      id: 'pending-acknowledgments',
      type: 'info',
      icon: 'fa-envelope-open-text',
      title: `${pendingAcks.length} gift${pendingAcks.length > 1 ? 's' : ''} awaiting acknowledgment`,
      message: 'Send thank-you letters to maintain patron relations',
      action: 'Review & Send',
      actionLabel: 'Review',
      isPipeline: false
    })
  }

  // Check for overdue pledge payments
  const pledges = getPledgesByPatronId(patron.id)
  const overduePledges = pledges.filter(p => {
    if (p.status !== 'active') return false
    return new Date(p.nextPaymentDate) < new Date()
  })
  if (overduePledges.length > 0) {
    alerts.push({
      id: 'overdue-pledge',
      type: 'warning',
      icon: 'fa-file-invoice-dollar',
      title: 'Pledge payment overdue',
      message: `${formatCurrency(overduePledges[0].amount)} pledge has a past-due installment`,
      action: 'Record Payment',
      actionLabel: 'Record',
      isPipeline: false
    })
  }

  // Don't render if no alerts
  if (alerts.length === 0) return null

  // Show only the most urgent alert (first one)
  const alert = alerts[0]

  return (
    <div className={`alert-banner alert-banner--${alert.type}`}>
      <div className="alert-banner__accent-bar"></div>
      <div className="alert-banner__body">
        <div className="alert-banner__icon">
          <i className={`fa-solid ${alert.icon}`}></i>
        </div>
        <div className="alert-banner__content">
          <div className="alert-banner__header">
            <span className="alert-banner__title">{alert.title}</span>
            {alert.isPipeline && (
              <span className="alert-banner__pipeline-badge">
                <i className="fa-solid fa-chart-line"></i>
                PIPELINE
              </span>
            )}
          </div>
          <p className="alert-banner__message">
            {alert.message}
            {alert.action && (
              <span className="alert-banner__action-hint">
                {' · '}<i className="fa-solid fa-arrow-right"></i> {alert.action}
              </span>
            )}
          </p>
        </div>
        <button className="alert-banner__action-btn">
          {alert.actionLabel}
        </button>
      </div>
    </div>
  )
}

export default AlertBanner
