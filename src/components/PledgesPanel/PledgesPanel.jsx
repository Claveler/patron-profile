import { getPledgesByPatronId, getPaymentsForPledge, getPledgeBalance } from '../../data/patrons'
import { getFundNameById, getCampaignNameById, getStaffNameById } from '../../data/campaigns'
import './PledgesPanel.css'

const formatCurrency = (amount) => {
  if (amount == null) return '$0'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const statusConfig = {
  active: { label: 'Active', className: 'pledges-panel__badge--active' },
  fulfilled: { label: 'Fulfilled', className: 'pledges-panel__badge--fulfilled' },
  cancelled: { label: 'Cancelled', className: 'pledges-panel__badge--cancelled' },
  delinquent: { label: 'Delinquent', className: 'pledges-panel__badge--delinquent' },
}

const frequencyLabels = {
  'one-time': 'One-Time',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  annually: 'Annually',
}

function PledgesPanel({ patronId }) {
  const pledges = getPledgesByPatronId(patronId)

  if (pledges.length === 0) {
    return (
      <div className="pledges-panel wrapper-card">
        <div className="pledges-panel__header">
          <h4 className="pledges-panel__title">Pledges</h4>
        </div>
        <div className="pledges-panel__empty">
          <i className="fa-solid fa-file-invoice-dollar"></i>
          <p>No pledges on file</p>
        </div>
      </div>
    )
  }

  // Summary stats
  const totalPledged = pledges.reduce((sum, p) => sum + p.amount, 0)
  const totalPaid = pledges.reduce((sum, p) => sum + p.totalPaid, 0)
  const totalBalance = pledges.reduce((sum, p) => sum + getPledgeBalance(p.id), 0)

  return (
    <div className="pledges-panel wrapper-card">
      <div className="pledges-panel__header">
        <h4 className="pledges-panel__title">
          Pledges
          <span className="pledges-panel__count">{pledges.length}</span>
        </h4>
      </div>

      {/* Summary stats */}
      <div className="pledges-panel__stats">
        <div className="pledges-panel__stat">
          <span className="pledges-panel__stat-value">{formatCurrency(totalPledged)}</span>
          <span className="pledges-panel__stat-label">Total Pledged</span>
        </div>
        <div className="pledges-panel__stat">
          <span className="pledges-panel__stat-value">{formatCurrency(totalPaid)}</span>
          <span className="pledges-panel__stat-label">Total Paid</span>
        </div>
        <div className="pledges-panel__stat">
          <span className="pledges-panel__stat-value">{formatCurrency(totalBalance)}</span>
          <span className="pledges-panel__stat-label">Balance</span>
        </div>
      </div>

      {/* Pledge cards */}
      <div className="pledges-panel__list">
        {pledges.map(pledge => {
          const payments = getPaymentsForPledge(pledge.id)
          const balance = getPledgeBalance(pledge.id)
          const progressPct = pledge.amount > 0 ? ((pledge.amount - balance) / pledge.amount) * 100 : 0
          const status = statusConfig[pledge.status] || statusConfig.active
          const fundName = getFundNameById(pledge.fundId)
          const campaignName = getCampaignNameById(pledge.campaignId)
          const assigneeName = pledge.assignedToId ? getStaffNameById(pledge.assignedToId) : null

          return (
            <div key={pledge.id} className="pledges-panel__card">
              {/* Top row: amount + status */}
              <div className="pledges-panel__card-top">
                <div className="pledges-panel__card-amount">
                  {formatCurrency(pledge.amount)}
                </div>
                <span className={`pledges-panel__badge ${status.className}`}>
                  {status.label}
                </span>
              </div>

              {/* Campaign / Fund */}
              <div className="pledges-panel__card-designation">
                {campaignName && <span className="pledges-panel__card-campaign">{campaignName}</span>}
                {fundName && <span className="pledges-panel__card-fund">{fundName}</span>}
              </div>

              {/* Progress bar */}
              <div className="pledges-panel__progress">
                <div className="pledges-panel__progress-bar">
                  <div 
                    className="pledges-panel__progress-fill"
                    style={{ width: `${Math.min(progressPct, 100)}%` }}
                  />
                </div>
                <div className="pledges-panel__progress-labels">
                  <span>{formatCurrency(pledge.amount - balance)} paid</span>
                  <span>{formatCurrency(balance)} remaining</span>
                </div>
              </div>

              {/* Details row */}
              <div className="pledges-panel__card-details">
                <div className="pledges-panel__detail">
                  <i className="fa-solid fa-calendar"></i>
                  <span>{frequencyLabels[pledge.frequency] || pledge.frequency}</span>
                </div>
                <div className="pledges-panel__detail">
                  <i className="fa-solid fa-receipt"></i>
                  <span>{payments.length} payment{payments.length !== 1 ? 's' : ''}</span>
                </div>
                {pledge.nextPaymentDate && pledge.status === 'active' && (
                  <div className="pledges-panel__detail">
                    <i className="fa-solid fa-clock"></i>
                    <span>Next: {pledge.nextPaymentDate}</span>
                  </div>
                )}
              </div>

              {/* Assignee */}
              {assigneeName && (
                <div className="pledges-panel__card-assignee">
                  <i className="fa-solid fa-user"></i>
                  <span>{assigneeName}</span>
                </div>
              )}

              {/* Notes */}
              {pledge.notes && (
                <div className="pledges-panel__card-notes">
                  <i className="fa-solid fa-note-sticky"></i>
                  <span>{pledge.notes}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PledgesPanel
