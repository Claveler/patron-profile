import { getRecurringProfilesByPatronId } from '../../data/patrons'
import { getFundNameById, getCampaignNameById } from '../../data/campaigns'
import { useEpicScope } from '../../hooks/useEpicScope'
import './RecurringPanel.css'

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
  active: { label: 'Active', className: 'recurring-panel__badge--active' },
  paused: { label: 'Paused', className: 'recurring-panel__badge--paused' },
  cancelled: { label: 'Cancelled', className: 'recurring-panel__badge--cancelled' },
  completed: { label: 'Completed', className: 'recurring-panel__badge--completed' },
}

const frequencyLabels = {
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  annually: 'Annually',
}

const paymentIcons = {
  visa: 'fa-cc-visa',
  mastercard: 'fa-cc-mastercard',
  amex: 'fa-cc-amex',
  discover: 'fa-cc-discover',
  default: 'fa-credit-card',
}

function RecurringPanel({ patronId }) {
  const { show } = useEpicScope()
  const showFund = show('recurringPanel.fundName')
  const showCampaign = show('recurringPanel.campaignName')
  const profiles = getRecurringProfilesByPatronId(patronId)

  if (profiles.length === 0) {
    return (
      <div className="recurring-panel wrapper-card">
        <div className="recurring-panel__header">
          <h4 className="recurring-panel__title">Recurring Gifts</h4>
        </div>
        <div className="recurring-panel__empty">
          <i className="fa-solid fa-rotate"></i>
          <p>No recurring gifts</p>
        </div>
      </div>
    )
  }

  const totalMonthly = profiles
    .filter(p => p.status === 'active')
    .reduce((sum, p) => {
      if (p.frequency === 'monthly') return sum + p.amount
      if (p.frequency === 'quarterly') return sum + (p.amount / 3)
      if (p.frequency === 'annually') return sum + (p.amount / 12)
      return sum
    }, 0)

  return (
    <div className="recurring-panel wrapper-card">
      <div className="recurring-panel__header">
        <h4 className="recurring-panel__title">
          Recurring Gifts
          <span className="recurring-panel__count">{profiles.length}</span>
        </h4>
      </div>

      {/* Monthly equivalent */}
      <div className="recurring-panel__summary">
        <div className="recurring-panel__summary-item">
          <span className="recurring-panel__summary-value">{formatCurrency(totalMonthly)}</span>
          <span className="recurring-panel__summary-label">Monthly Equivalent</span>
        </div>
      </div>

      {/* Profile cards */}
      <div className="recurring-panel__list">
        {profiles.map(profile => {
          const status = statusConfig[profile.status] || statusConfig.active
          const fundName = showFund ? getFundNameById(profile.fundId) : null
          const campaignName = showCampaign ? getCampaignNameById(profile.campaignId) : null
          const paymentType = profile.paymentMethod?.type || 'default'
          const cardIcon = paymentIcons[paymentType] || paymentIcons.default

          return (
            <div key={profile.id} className="recurring-panel__card">
              {/* Top row: amount + frequency + status */}
              <div className="recurring-panel__card-top">
                <div className="recurring-panel__card-amount-row">
                  <span className="recurring-panel__card-amount">{formatCurrency(profile.amount)}</span>
                  <span className="recurring-panel__card-frequency">
                    / {(frequencyLabels[profile.frequency] || profile.frequency).toLowerCase().replace('ly', '')}
                  </span>
                </div>
                <span className={`recurring-panel__badge ${status.className}`}>
                  {status.label}
                </span>
              </div>

              {/* Designation */}
              <div className="recurring-panel__card-designation">
                {campaignName && <span className="recurring-panel__card-campaign">{campaignName}</span>}
                {fundName && <span className="recurring-panel__card-fund">{fundName}</span>}
              </div>

              {/* Details */}
              <div className="recurring-panel__card-details">
                {/* Payment method */}
                {profile.paymentMethod && (
                  <div className="recurring-panel__detail">
                    <i className={`fa-brands ${cardIcon}`}></i>
                    <span>
                      ••••{profile.paymentMethod.last4}
                    </span>
                  </div>
                )}

                {/* Total given */}
                <div className="recurring-panel__detail">
                  <i className="fa-solid fa-hand-holding-dollar"></i>
                  <span>{formatCurrency(profile.totalGiven)} total ({profile.giftCount} gifts)</span>
                </div>

                {/* Next date */}
                {profile.nextDate && profile.status === 'active' && (
                  <div className="recurring-panel__detail">
                    <i className="fa-solid fa-clock"></i>
                    <span>Next: {profile.nextDate}</span>
                  </div>
                )}

                {/* Since date */}
                <div className="recurring-panel__detail">
                  <i className="fa-solid fa-calendar-plus"></i>
                  <span>Since {profile.startDate}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RecurringPanel
