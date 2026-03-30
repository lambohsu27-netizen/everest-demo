import { useNavigate, useParams } from 'react-router-dom'
import {
  Briefcase02,
  FileSearch02,
  MarkerPin01,
  PenTool01,
  Phone,
  SearchSm,
  Stars01,
} from '@untitled-ui/icons-react'
import RiskSignalCard from './RiskSignalCard'

export default function RiskSignalsSection() {
  const navigate = useNavigate()
  const { id } = useParams()

  const handleViewDetails = (signal) => {
    // Navigate to the details sheet with the correct tab selected
    navigate(`/workforce/employee/${id}/risk-signals?tab=${signal.title}`)
  }
  const signals = [
    {
      icon: Phone,
      title: 'Phone numbers',
      count: '8',
      highlightText: 'number with 348 label',
      description:
        '8 numbers with multiple inconsistent contact labels detected, which may indicate unstable contact history.',
      color: 'text-green-400',
    },
    {
      icon: MarkerPin01,
      title: 'Address Records',
      count: '12',
      highlightText: 'address',
      description:
        '12 recorded addresses with frequent location changes, suggesting low residential stability.',
      color: 'text-blue-light/600',
    },
    {
      icon: PenTool01,
      title: 'Court Decision',
      count: '2',
      highlightText: 'court decisions',
      description:
        'Records include financial disputes and debt-related cases, which may increase financial risk exposure.',
      color: 'text-error/600',
    },
    {
      icon: Briefcase02,
      title: 'Employment Records',
      count: '10',
      highlightText: 'employment',
      description:
        'Frequent job changes across several employers may indicate limited employment stability.',
      color: 'text-fuchsia-600',
    },
    {
      icon: FileSearch02,
      title: 'Footprints',
      count: '27',
      highlightText: 'Footprints enquiry',
      description:
        'High number of external enquiries across financial institutions may suggest frequent loan applications or financial distress.',
      color: 'text-yellow-600',
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          Risk & background signals
          <Stars01 className="h-5 w-5 text-brand/600" />
        </h3>
        <p className="text-sm text-gray-500">Aggregated records used to assess potential risk.</p>
      </div>

      <div className="flex flex-col gap-5">
        {signals.map((signal, index) => (
          <RiskSignalCard key={index} {...signal} onClick={() => handleViewDetails(signal)} />
        ))}
      </div>
    </div>
  )
}
