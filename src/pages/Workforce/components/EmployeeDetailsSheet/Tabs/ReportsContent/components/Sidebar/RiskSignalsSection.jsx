import { useNavigate, useParams } from 'react-router-dom'
import {
  Briefcase02,
  FileSearch02,
  MarkerPin01,
  PenTool01,
  Phone,
  Stars01,
} from '@untitled-ui/icons-react'
import { useWorkforce } from '../../../../../../Context'
import RiskSignalCard from './RiskSignalCard'

export default function RiskSignalsSection() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { workforceDetail } = useWorkforce()
  const rs = workforceDetail?.credit_report?.risk_signals ?? {}

  const handleViewDetails = (signal) => {
    navigate(`/workforce/employee/${id}/risk-signals?tab=${signal.title}`)
  }

  const signals = [
    {
      icon: Phone,
      title: 'Phone numbers',
      count: String(rs.contact_count ?? 0),
      highlightText: 'contact records',
      description: `${rs.contact_count ?? 0} contact record(s) found across reports.`,
      color: 'text-green-400',
    },
    {
      icon: MarkerPin01,
      title: 'Address Records',
      count: String(rs.address_count ?? 0),
      highlightText: 'address',
      description: `${rs.address_count ?? 0} address record(s) associated with this subject.`,
      color: 'text-blue-light/600',
    },
    {
      icon: PenTool01,
      title: 'Negative Events',
      count: String(rs.negative_event_count ?? 0),
      highlightText: 'negative events',
      description: `${rs.negative_event_count ?? 0} negative event(s) detected (write-offs, petitions, etc.).`,
      color: 'text-error/600',
    },
    {
      icon: Briefcase02,
      title: 'Employment Records',
      count: String(rs.employment_count ?? 0),
      highlightText: 'employment',
      description: `${rs.employment_count ?? 0} employment record(s) on file.`,
      color: 'text-fuchsia-600',
    },
    {
      icon: FileSearch02,
      title: 'Footprints',
      count: String(rs.footprint_enquiry_count ?? 0),
      highlightText: 'Footprints enquiry',
      description: `${rs.footprint_enquiry_count ?? 0} external enquiry/ies across financial institutions.`,
      color: 'text-yellow-600',
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          Risk & background signals
          <Stars01 className="h-5 w-5 text-brand/900" />
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
