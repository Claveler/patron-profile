import { useState } from 'react'
import TaxSummary from '../TaxSummary/TaxSummary'
import DocumentHistory from '../DocumentHistory/DocumentHistory'
import './DocumentsTab.css'

function DocumentsTab({ patron }) {
  const [selectedYear, setSelectedYear] = useState(2025)
  
  // Use patron's tax document data
  const taxData = patron.taxDocuments || {
    organization: { name: '', ein: '', address: '' },
    yearEndSummaries: [],
    receipts: [],
    inKindGifts: []
  }

  // Calculate totals for selected year
  const yearReceipts = taxData.receipts.filter(r => r.date.includes(selectedYear.toString()))
  const totalAmount = yearReceipts.reduce((sum, r) => sum + r.amount, 0)
  const totalDeductible = yearReceipts.reduce((sum, r) => sum + r.deductible, 0)

  return (
    <div className="documents-tab">
      <div className="documents-tab__main">
        {/* Left Column - Tax Summary */}
        <div className="documents-tab__left">
          <TaxSummary 
            patron={patron}
            organization={taxData.organization}
            receipts={yearReceipts}
            totalAmount={totalAmount}
            totalDeductible={totalDeductible}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
          />
        </div>
        
        {/* Right Column - Document History & Receipts */}
        <div className="documents-tab__right">
          <DocumentHistory 
            summaries={taxData.yearEndSummaries}
            receipts={taxData.receipts}
            inKindGifts={taxData.inKindGifts}
          />
        </div>
      </div>
    </div>
  )
}

export default DocumentsTab
