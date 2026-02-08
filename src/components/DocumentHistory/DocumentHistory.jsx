import { useState } from 'react'
import { formatDate } from '../../data/patrons'
import './DocumentHistory.css'

function DocumentHistory({ summaries, receipts, inKindGifts }) {
  const [activeSection, setActiveSection] = useState('history')
  const [typeFilter, setTypeFilter] = useState('all')

  // formatDate imported from shared utility

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  // Filter receipts by type
  const filteredReceipts = typeFilter === 'all' 
    ? receipts 
    : receipts.filter(r => r.type === typeFilter)

  return (
    <div className="document-history">
      {/* Section Tabs */}
      <div className="document-history__tabs">
        <button 
          className={`document-history__tab ${activeSection === 'history' ? 'document-history__tab--active' : ''}`}
          onClick={() => setActiveSection('history')}
        >
          <i className="fa-solid fa-clock-rotate-left"></i>
          History
        </button>
        <button 
          className={`document-history__tab ${activeSection === 'receipts' ? 'document-history__tab--active' : ''}`}
          onClick={() => setActiveSection('receipts')}
        >
          <i className="fa-solid fa-receipt"></i>
          Receipts
        </button>
        {inKindGifts.length > 0 && (
          <button 
            className={`document-history__tab ${activeSection === 'inkind' ? 'document-history__tab--active' : ''}`}
            onClick={() => setActiveSection('inkind')}
          >
            <i className="fa-solid fa-gift"></i>
            In-Kind
          </button>
        )}
      </div>

      {/* Document History Section */}
      {activeSection === 'history' && (
        <div className="document-history__content">
          <div className="document-history__section-header">
            <h4 className="document-history__section-title">Generated Documents</h4>
          </div>
          
          {summaries.length > 0 ? (
            <div className="document-history__list">
              {summaries.map((summary, index) => (
                <div key={index} className="document-history__item">
                  <div className="document-history__item-icon">
                    <i className="fa-solid fa-file-invoice"></i>
                  </div>
                  <div className="document-history__item-content">
                    <p className="document-history__item-title">
                      {summary.year} Year-End Tax Summary
                    </p>
                    <p className="document-history__item-meta">
                      Generated {formatDate(summary.generated)}
                    </p>
                  </div>
                  <div className="document-history__item-status">
                    {summary.sent ? (
                      <span className="document-history__status-badge document-history__status-badge--sent">
                        <i className="fa-solid fa-check"></i>
                        Sent {formatDate(summary.sentDate)}
                      </span>
                    ) : (
                      <span className="document-history__status-badge document-history__status-badge--pending">
                        Not sent
                      </span>
                    )}
                  </div>
                  <div className="document-history__item-actions">
                    <button className="document-history__action-btn" title="View">
                      <i className="fa-solid fa-eye"></i>
                    </button>
                    <button className="document-history__action-btn" title="Download">
                      <i className="fa-solid fa-download"></i>
                    </button>
                    <button className="document-history__action-btn" title="Resend">
                      <i className="fa-solid fa-paper-plane"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="document-history__empty">
              <i className="fa-solid fa-folder-open"></i>
              <p>No documents generated yet</p>
              <span>Generate a tax summary to see it here</span>
            </div>
          )}
        </div>
      )}

      {/* Individual Receipts Section */}
      {activeSection === 'receipts' && (
        <div className="document-history__content">
          <div className="document-history__section-header">
            <h4 className="document-history__section-title">Transaction Receipts</h4>
            <select 
              className="document-history__filter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="membership">Membership</option>
              <option value="one-time">One-Time Gift</option>
            </select>
          </div>
          
          {filteredReceipts.length > 0 ? (
            <div className="document-history__receipts-list">
              {filteredReceipts.map((receipt) => (
                <div key={receipt.id} className="document-history__receipt">
                  <div className="document-history__receipt-main">
                    <div className="document-history__receipt-icon">
                      <i className={`fa-solid ${receipt.type === 'one-time' ? 'fa-hand-holding-heart' : 'fa-id-card'}`}></i>
                    </div>
                    <div className="document-history__receipt-details">
                      <p className="document-history__receipt-desc">{receipt.description}</p>
                      <p className="document-history__receipt-meta">
                        <span className={`document-history__receipt-type document-history__receipt-type--${receipt.type}`}>
                          {receipt.type === 'membership' ? 'Membership' : 'One-Time Gift'}
                        </span>
                        <span className="document-history__receipt-date">{formatDate(receipt.date)}</span>
                      </p>
                    </div>
                  </div>
                  <div className="document-history__receipt-amounts">
                    <p className="document-history__receipt-amount">{formatCurrency(receipt.amount)}</p>
                    <p className="document-history__receipt-deductible">
                      {receipt.deductible > 0 ? (
                        <>{formatCurrency(receipt.deductible)} deductible</>
                      ) : (
                        <span className="document-history__receipt-non-deductible">Non-deductible</span>
                      )}
                    </p>
                  </div>
                  <button className="document-history__receipt-view" title="View Receipt">
                    <i className="fa-solid fa-file-pdf"></i>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="document-history__empty">
              <i className="fa-solid fa-receipt"></i>
              <p>No receipts found</p>
              <span>Transactions will appear here</span>
            </div>
          )}
        </div>
      )}

      {/* In-Kind Gifts Section */}
      {activeSection === 'inkind' && (
        <div className="document-history__content">
          <div className="document-history__section-header">
            <h4 className="document-history__section-title">In-Kind Gifts</h4>
          </div>
          
          <div className="document-history__inkind-note">
            <i className="fa-solid fa-circle-info"></i>
            <p>In-kind gifts require the patron to determine fair market value for tax purposes. Acknowledgment letters confirm receipt only.</p>
          </div>

          {inKindGifts.length > 0 ? (
            <div className="document-history__inkind-list">
              {inKindGifts.map((donation, index) => (
                <div key={index} className="document-history__inkind-item">
                  <div className="document-history__inkind-icon">
                    <i className="fa-solid fa-gift"></i>
                  </div>
                  <div className="document-history__inkind-details">
                    <p className="document-history__inkind-desc">{donation.description}</p>
                    <p className="document-history__inkind-date">{formatDate(donation.date)}</p>
                  </div>
                  {donation.acknowledged && (
                    <span className="document-history__inkind-badge">
                      <i className="fa-solid fa-check"></i>
                      Acknowledged
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="document-history__empty">
              <i className="fa-solid fa-gift"></i>
              <p>No in-kind gifts</p>
              <span>Non-monetary gifts will appear here</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DocumentHistory
