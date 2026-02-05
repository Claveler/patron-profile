import { useState } from 'react'
import './MembershipSavings.css'

function MembershipSavings({ totalSavings, membershipName }) {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = () => {
    navigator.clipboard.writeText(`$${totalSavings.toFixed(2)}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <div className="membership-savings wrapper-card">
      <div className="membership-savings__header">
        <h4 className="membership-savings__title">Savings</h4>
        <a href="#" className="membership-savings__link">See details</a>
      </div>
      
      <div className="membership-savings__content">
        <span className="membership-savings__label">
          Total savings-to-date
          <i className="fa-solid fa-circle-info membership-savings__info"></i>
        </span>
        
        <div className="membership-savings__value-row">
          <div className="membership-savings__value-info">
            <span className="membership-savings__amount">${totalSavings.toFixed(2)}</span>
            <span className="membership-savings__membership">{membershipName}</span>
          </div>
          <button 
            className="membership-savings__copy"
            onClick={handleCopy}
            title={copied ? 'Copied!' : 'Copy amount'}
          >
            <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`}></i>
          </button>
        </div>
      </div>
    </div>
  )
}

export default MembershipSavings
