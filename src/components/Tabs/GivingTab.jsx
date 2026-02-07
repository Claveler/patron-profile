import PledgesPanel from '../PledgesPanel/PledgesPanel'
import RecurringPanel from '../RecurringPanel/RecurringPanel'
import GiftHistoryTable from '../GiftHistoryTable/GiftHistoryTable'
import AcknowledgmentsPanel from '../AcknowledgmentsPanel/AcknowledgmentsPanel'
import './GivingTab.css'

function GivingTab({ patronId }) {
  return (
    <div className="giving-tab">
      <div className="giving-tab__main">
        {/* Left Column - Pledges, Recurring, Gift History */}
        <div className="giving-tab__left">
          <PledgesPanel patronId={patronId} />
          <RecurringPanel patronId={patronId} />
          <GiftHistoryTable patronId={patronId} />
        </div>

        {/* Right Column - Acknowledgments */}
        <div className="giving-tab__right">
          <AcknowledgmentsPanel patronId={patronId} />
        </div>
      </div>
    </div>
  )
}

export default GivingTab
