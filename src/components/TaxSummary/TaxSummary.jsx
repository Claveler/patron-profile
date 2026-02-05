import { useState } from 'react'
import './TaxSummary.css'

function TaxSummary({ 
  patron, 
  organization, 
  receipts, 
  totalAmount, 
  totalDeductible, 
  selectedYear, 
  onYearChange 
}) {
  const [copied, setCopied] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  // Available years (current year and previous 3 years)
  const currentYear = new Date().getFullYear()
  const availableYears = [currentYear - 1, currentYear - 2, currentYear - 3]

  const handleCopyLink = () => {
    const link = `https://documents.fever.co/tax/${patron.id}/${selectedYear}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSendEmail = () => {
    setEmailSent(true)
    setTimeout(() => setEmailSent(false), 3000)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateStr) => {
    const [day, month, year] = dateStr.split('/')
    return new Date(year, month - 1, day).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Group receipts by type
  const membershipReceipts = receipts.filter(r => r.type === 'membership')
  const donationReceipts = receipts.filter(r => r.type === 'donation')

  return (
    <div className="tax-summary">
      {/* Header */}
      <div className="tax-summary__header">
        <div className="tax-summary__header-left">
          <h3 className="tax-summary__title">Year-End Tax Summary</h3>
          <p className="tax-summary__subtitle">Generate and send tax documentation to patron</p>
        </div>
        <div className="tax-summary__header-right">
          <select 
            className="tax-summary__year-select"
            value={selectedYear}
            onChange={(e) => onYearChange(Number(e.target.value))}
          >
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="tax-summary__preview">
        {/* Organization Info */}
        <div className="tax-summary__org-info">
          <div className="tax-summary__org-logo">
            <i className="fa-solid fa-building-columns"></i>
          </div>
          <div className="tax-summary__org-details">
            <h4 className="tax-summary__org-name">{organization.name}</h4>
            <p className="tax-summary__org-ein">EIN: {organization.ein}</p>
            <p className="tax-summary__org-address">{organization.address}</p>
          </div>
        </div>

        <div className="tax-summary__divider"></div>

        {/* Patron Info */}
        <div className="tax-summary__patron-info">
          <p className="tax-summary__patron-label">Tax Summary For:</p>
          <p className="tax-summary__patron-name">{patron.firstName} {patron.lastName}</p>
          <p className="tax-summary__patron-address">{patron.address}</p>
        </div>

        <div className="tax-summary__divider"></div>

        {/* Contributions Table */}
        <div className="tax-summary__contributions">
          <h5 className="tax-summary__section-title">
            {selectedYear} Tax-Deductible Contributions
          </h5>

          {receipts.length > 0 ? (
            <>
              <table className="tax-summary__table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Campaign</th>
                    <th className="text-right">Amount</th>
                    <th className="text-right">Tax Deductible</th>
                  </tr>
                </thead>
                <tbody>
                  {receipts.map((receipt, index) => (
                    <tr key={index}>
                      <td>{formatDate(receipt.date)}</td>
                      <td>
                        <span className={`tax-summary__type-badge tax-summary__type-badge--${receipt.type}`}>
                          {receipt.type === 'membership' ? 'Membership' : 'Donation'}
                        </span>
                        {receipt.description}
                      </td>
                      <td>
                        <div className="tax-summary__campaign-cell">
                          <span className="tax-summary__campaign-name">{receipt.campaign || '—'}</span>
                          {receipt.appeal && (
                            <span className="tax-summary__appeal-name">{receipt.appeal}</span>
                          )}
                        </div>
                      </td>
                      <td className="text-right">{formatCurrency(receipt.amount)}</td>
                      <td className="text-right">{formatCurrency(receipt.deductible)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3"><strong>Total</strong></td>
                    <td className="text-right"><strong>{formatCurrency(totalAmount)}</strong></td>
                    <td className="text-right"><strong>{formatCurrency(totalDeductible)}</strong></td>
                  </tr>
                </tfoot>
              </table>

              {/* Benefits Note */}
              {membershipReceipts.length > 0 && (
                <p className="tax-summary__benefits-note">
                  <i className="fa-solid fa-circle-info"></i>
                  Membership contributions are partially deductible. The tax-deductible amount excludes the fair market value of benefits received.
                </p>
              )}
            </>
          ) : (
            <div className="tax-summary__empty">
              <i className="fa-solid fa-file-circle-xmark"></i>
              <p>No tax-deductible contributions found for {selectedYear}</p>
            </div>
          )}
        </div>

        <div className="tax-summary__divider"></div>

        {/* Legal Footer */}
        <div className="tax-summary__legal">
          <p>
            {organization.name} is a 501(c)(3) nonprofit organization. 
            Contributions are tax deductible to the extent allowed by law. 
            No goods or services were provided in exchange for donations listed above.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="tax-summary__actions">
        <button 
          className="tax-summary__action tax-summary__action--secondary"
          onClick={handleCopyLink}
        >
          <i className={`fa-solid ${copied ? 'fa-check' : 'fa-link'}`}></i>
          {copied ? 'Link Copied!' : 'Copy Link'}
        </button>
        <button className="tax-summary__action tax-summary__action--secondary">
          <i className="fa-solid fa-download"></i>
          Download PDF
        </button>
        <button 
          className="tax-summary__action tax-summary__action--primary"
          onClick={handleSendEmail}
          disabled={receipts.length === 0}
        >
          <i className={`fa-solid ${emailSent ? 'fa-check' : 'fa-envelope'}`}></i>
          {emailSent ? 'Email Sent!' : 'Send via Email'}
        </button>
      </div>
    </div>
  )
}

export default TaxSummary
