import { Stars01 } from '@untitled-ui/icons-react'
import { MyDoubleCard } from '@interstellar-component'
import { useWorkforce } from '../../../../../../Context'
import RiskAssessmentTable from './RiskAssessmentTable'

// DEMO DATA — overview.key_takeaway is null when the AI step errored or CLIK
// returned no parseable data. Shown so the section never collapses to blank.
const DEMO_KEY_TAKEAWAY =
  'Watch-list: profil kredit kandidat masih tipis dan belum dapat dinilai secara penuh. '
  + 'Tidak ada kejadian negatif yang tercatat, namun riwayat kontrak yang ditolak menandakan '
  + 'reputasi pengajuan yang perlu diverifikasi langsung dengan kandidat sebelum onboarding.'

export default function OverviewSection() {
  const { workforceDetailReport } = useWorkforce()
  const apiTakeaway = workforceDetailReport?.overview?.key_takeaway
  const takeaway = apiTakeaway ?? DEMO_KEY_TAKEAWAY

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          Overview
          <Stars01 className="h-5 w-5 text-brand/900" />
        </h3>
        <p className="text-sm text-gray-500">Key insights from credit and background data.</p>
      </div>

      <div className="flex flex-col gap-5">
        <MyDoubleCard heading="Key takeaway">
          <p className="text-md-regular text-gray-900 leading-relaxed">{takeaway}</p>
        </MyDoubleCard>

        <RiskAssessmentTable />
      </div>
    </div>
  )
}
