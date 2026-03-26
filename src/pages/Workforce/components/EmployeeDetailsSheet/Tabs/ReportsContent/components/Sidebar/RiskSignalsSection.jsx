import React from 'react'
import RiskSignalCard from './RiskSignalCard'
import { Phone, MarkerPin01, Scale01, Briefcase01, SearchSm, MagicWand01 } from '@untitled-ui/icons-react'

export default function RiskSignalsSection() {
  const signals = [
    {
      icon: Phone,
      title: 'Phone numbers',
      count: '8',
      highlightText: 'number with 348 label',
      description: '8 numbers with multiple inconsistent contact labels detected, which may indicate unstable contact history.',
    },
    {
      icon: MarkerPin01,
      title: 'Address Records',
      count: '12',
      highlightText: 'address',
      description: '12 recorded addresses with frequent location changes, suggesting low residential stability.',
    },
    {
      icon: Scale01,
      title: 'Court Decision',
      count: '2',
      highlightText: 'court decisions',
      description: 'Records include financial disputes and debt-related cases, which may increase financial risk exposure.',
    },
    {
      icon: Briefcase01,
      title: 'Employment Records',
      count: '10',
      highlightText: 'employment',
      description: 'Frequent job changes across several employers may indicate limited employment stability.',
    },
    {
      icon: SearchSm,
      title: 'Footprints',
      count: '27',
      highlightText: 'Footprints enquiry',
      description: 'High number of external enquiries across financial institutions may suggest frequent loan applications or financial distress.',
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          Risk & background signals
          <MagicWand01 className="h-5 w-5 text-gray-400" />
        </h3>
        <p className="text-sm text-gray-500">Aggregated records used to assess potential risk.</p>
      </div>
      
      <div className="flex flex-col gap-5">
        {signals.map((signal, index) => (
          <RiskSignalCard key={index} {...signal} />
        ))}
      </div>
    </div>
  )
}
