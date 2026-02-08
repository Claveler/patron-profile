import { useState } from 'react'
import PledgesPanel from '../PledgesPanel/PledgesPanel'
import RecurringPanel from '../RecurringPanel/RecurringPanel'
import GiftHistoryTable from '../GiftHistoryTable/GiftHistoryTable'
import AcknowledgmentsPanel from '../AcknowledgmentsPanel/AcknowledgmentsPanel'
import GiftDetailPanel from '../GiftDetailPanel/GiftDetailPanel'
import './GivingTab.css'

function GivingTab({ patronId, onRecordGift }) {
  const [selectedGift, setSelectedGift] = useState(null)

  return (
    <div className="giving-tab">
      <div className="giving-tab__main">
        {/* Left Column - Pledges, Recurring, Gift History */}
        <div className="giving-tab__left">
          <PledgesPanel patronId={patronId} />
          <RecurringPanel patronId={patronId} />
          <GiftHistoryTable
            patronId={patronId}
            onRecordGift={onRecordGift}
            onGiftSelect={setSelectedGift}
            selectedGiftId={selectedGift?.id}
          />
        </div>

        {/* Right Column - Acknowledgments */}
        <div className="giving-tab__right">
          <AcknowledgmentsPanel patronId={patronId} />
        </div>
      </div>

      {/* Gift Detail Slide-Out Panel */}
      {selectedGift && (
        <GiftDetailPanel
          gift={selectedGift}
          onClose={() => setSelectedGift(null)}
        />
      )}
    </div>
  )
}

export default GivingTab
