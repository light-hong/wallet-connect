'use client'

import QueryBalance from './QueryBalance'
import SendToken from './SendToken'
import CallBalanceof from './CallBalanceof'
import ListenTransfer from './ListenTransfer'
import TransferToken from './TransferToken'
export default function WagmiHome() {
  return (
    <div className="bg-amber-100">
      <div className="bg-white w-[50vw] mx-auto px-5 py-5">
        <QueryBalance />
        <SendToken />
        <CallBalanceof />
        <TransferToken />
        <ListenTransfer />
      </div>
    </div>
  )
}
