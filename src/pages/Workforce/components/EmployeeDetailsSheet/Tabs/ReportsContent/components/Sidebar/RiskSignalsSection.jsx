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

// Map risk_background_signals key → card config + fallback description used
// when the AI rationale is not present.
// DEMO DATA — backend can return a null rationale when the AI errors; the
// static description is used as a placeholder so cards always render copy.
const SIGNAL_DEFS = [
  {
    key: 'phone_numbers',
    icon: Phone,
    title: 'Phone Numbers',
    highlightText: 'contact records',
    fallback: (count) => `${count} contact record(s) found across reports.`,
    color: 'text-green-400',
  },
  {
    key: 'address_records',
    icon: MarkerPin01,
    title: 'Address Records',
    highlightText: 'address',
    fallback: (count) => `${count} address record(s) associated with this subject.`,
    color: 'text-blue-light/600',
  },
  {
    key: 'court_decisions',
    icon: PenTool01,
    title: 'Court Decision',
    highlightText: 'court decisions',
    fallback: () =>
      'Records include financial disputes and debt-related cases, which may increase financial risk exposure.',
    color: 'text-error/600',
  },
  {
    key: 'employment_records',
    icon: Briefcase02,
    title: 'Employment Records',
    highlightText: 'employment',
    fallback: (count) => `${count} employment record(s) on file.`,
    color: 'text-fuchsia-600',
  },
  {
    key: 'footprint',
    icon: FileSearch02,
    title: 'Footprints',
    highlightText: 'Footprints enquiry',
    fallback: (count) => `${count} external enquiry/ies across financial institutions.`,
    color: 'text-yellow-600',
  },
]

export default function RiskSignalsSection() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { workforceDetailReport } = useWorkforce()
  const signalsApi = workforceDetailReport?.risk_background_signals ?? {}

  const handleViewDetails = (signal) => {
    navigate(`/workforce/employee/${id}/risk-signals?tab=${signal.title}`)
  }

  // Older snapshots ship bare numbers for each signal (e.g. phone_numbers: 4).
  // The new shape wraps each signal as { count, rationale }. We accept both
  // so partially-baked records still render counts even when the AI rationale
  // hasn't been produced yet.
  const signals = SIGNAL_DEFS.map((def) => {
    const cell = signalsApi[def.key]
    const isObj = cell && typeof cell === 'object'
    const count = Number(isObj ? cell.count : cell) || 0
    const apiRationale = isObj ? cell.rationale : null
    const description = apiRationale || def.fallback(count)
    return {
      icon: def.icon,
      title: def.title,
      count: String(count),
      highlightText: def.highlightText,
      description,
      color: def.color,
    }
  })

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
