interface Props {
  batchId: string
  onClose: () => void
}

const batchData: Record<string, {
  verified: boolean
  autoRunLabel: string
  settlementPeriod: string
  processor: string
  payouts: { name: string; txn: string; amount: string; platFee: string; net: string }[]
  totalGross: string
  estimatedFees: string
  feeRate: string
  finalNet: string
}> = {
  'BT-992011': {
    verified: true,
    autoRunLabel: 'Auto-Run Completed',
    settlementPeriod: 'Oct 24, 2023',
    processor: 'Stripe Connect',
    payouts: [
      { name: 'Global Logistics Ltd.', txn: 'TXN-49291', amount: '$42,000.00', platFee: '-$1,260.00', net: '$40,740.00' },
      { name: 'Nova Tech Solutions',   txn: 'TXN-49292', amount: '$12,500.00', platFee: '-$375.00',   net: '$12,125.00' },
      { name: 'Artisan Bakery Co.',    txn: 'TXN-49293', amount: '$4,250.00',  platFee: '-$127.50',   net: '$4,122.50' },
    ],
    totalGross: '$142,500.00',
    estimatedFees: '-$4,275.00',
    feeRate: '3%',
    finalNet: '$138,225.00',
  },
  'BT-992010': {
    verified: true,
    autoRunLabel: 'Auto-Run Completed',
    settlementPeriod: 'Oct 23, 2023',
    processor: 'Stripe Connect',
    payouts: [
      { name: 'Summit Realty Partners', txn: 'TXN-49288', amount: '$68,000.00', platFee: '-$2,040.00', net: '$65,960.00' },
      { name: 'Lumina Wellness',        txn: 'TXN-49289', amount: '$38,200.00', platFee: '-$1,146.00', net: '$37,054.00' },
      { name: 'Roast & Co. Retail',    txn: 'TXN-49290', amount: '$22,220.50', platFee: '-$666.62',  net: '$21,553.88' },
    ],
    totalGross: '$128,420.50',
    estimatedFees: '-$3,852.62',
    feeRate: '3%',
    finalNet: '$124,567.88',
  },
  'BT-992009': {
    verified: false,
    autoRunLabel: 'Pending Review',
    settlementPeriod: 'Oct 22, 2023',
    processor: 'Stripe Connect',
    payouts: [
      { name: 'Ignite Tech Solutions', txn: 'TXN-49285', amount: '$8,200.00', platFee: '-$246.00', net: '$7,954.00' },
    ],
    totalGross: '$8,200.00',
    estimatedFees: '-$246.00',
    feeRate: '3%',
    finalNet: '$7,954.00',
  },
  'BT-992008': {
    verified: false,
    autoRunLabel: 'Failed — Retry Required',
    settlementPeriod: 'Oct 22, 2023',
    processor: 'Stripe Connect',
    payouts: [
      { name: 'Vortex Logistics Group', txn: 'TXN-49280', amount: '$245,000.00', platFee: '-$7,350.00', net: '$237,650.00' },
    ],
    totalGross: '$245,000.00',
    estimatedFees: '-$7,350.00',
    feeRate: '3%',
    finalNet: '$237,650.00',
  },
}

export default function BatchAnalysis({ batchId, onClose }: Props) {
  const data = batchData[batchId] ?? batchData['BT-992011']

  return (
    <div className="bg-white flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-start justify-between gap-2 flex-shrink-0">
        <div>
          <span className="text-[9px] font-black tracking-[1.5px] uppercase text-[#1E40AF]">Batch Analysis</span>
          <div className="text-xl font-black text-[#0B1C30] tracking-tight mt-0.5">{batchId}</div>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {data.verified ? (
              <span className="text-[9px] font-black tracking-widest uppercase bg-emerald-500 text-white px-2 py-0.5 rounded-sm">Verified</span>
            ) : (
              <span className="text-[9px] font-black tracking-widest uppercase bg-slate-400 text-white px-2 py-0.5 rounded-sm">Unverified</span>
            )}
            <span className="text-xs text-slate-500">{data.autoRunLabel}</span>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 flex-shrink-0 mt-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/></svg>
        </button>
      </div>

      {/* Info Fields */}
      <div className="px-4 py-3 flex flex-col gap-0 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center justify-between py-2.5 border-b border-slate-50">
          <span className="text-xs text-slate-500">Settlement Period</span>
          <span className="text-xs font-bold text-[#0B1C30]">{data.settlementPeriod}</span>
        </div>
        <div className="flex items-center justify-between py-2.5">
          <span className="text-xs text-slate-500">Payment Processor</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#1E40AF] flex-shrink-0" />
            <span className="text-xs font-bold text-[#0B1C30]">{data.processor}</span>
          </div>
        </div>
      </div>

      {/* Business Payout Breakdown */}
      <div className="px-4 py-3 flex-1">
        <div className="flex items-center gap-2 mb-3">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z" fill="#94A3B8"/></svg>
          <span className="text-[9px] font-black tracking-[1.5px] uppercase text-slate-400">Business Payout Breakdown</span>
        </div>

        <div className="flex flex-col divide-y divide-slate-50">
          {data.payouts.map((p) => (
            <div key={p.txn} className="py-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-[#0B1C30]">{p.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">{p.txn}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="text-[9px] font-black tracking-wider uppercase text-slate-400 mb-0.5">Amount</div>
                  <div className="text-xs font-semibold text-slate-700">{p.amount}</div>
                </div>
                <div>
                  <div className="text-[9px] font-black tracking-wider uppercase text-slate-400 mb-0.5">Plat. Fee</div>
                  <div className="text-xs font-semibold text-red-500">{p.platFee}</div>
                </div>
                <div>
                  <div className="text-[9px] font-black tracking-wider uppercase text-[#1E40AF] mb-0.5">Net</div>
                  <div className="text-xs font-bold text-[#1E40AF]">{p.net}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals + CTA */}
      <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex-shrink-0">
        <div className="flex items-center justify-between py-1.5">
          <span className="text-xs text-slate-500">Batch Total Gross</span>
          <span className="text-xs font-bold text-[#0B1C30]">{data.totalGross}</span>
        </div>
        <div className="flex items-center justify-between py-1.5">
          <span className="text-xs text-slate-500">Estimated Fees ({data.feeRate})</span>
          <span className="text-xs font-bold text-red-500">{data.estimatedFees}</span>
        </div>
        <div className="flex items-center justify-between py-2 mt-1 border-t border-slate-100">
          <span className="text-[11px] font-black tracking-wider uppercase text-slate-600">Final Net Payout</span>
          <span className="text-base font-black text-[#1E40AF]">{data.finalNet}</span>
        </div>
        <button className="w-full mt-3 bg-[#0B1C30] text-white text-[10px] font-black tracking-[2px] uppercase py-3 hover:bg-slate-800 transition-colors">
          Release Batch Funds
        </button>
      </div>
    </div>
  )
}
