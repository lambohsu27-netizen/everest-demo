import React, { useMemo } from 'react'
import { XClose } from '@untitled-ui/icons-react'
import {
  MyDoubleCard,
  MyDetailView,
  MyChip,
  MyBgPatternDecorativeCircle,
  MySkeuomorphicContainer,
} from '@interstellar-component'
import { useWorkforce } from '../Context'

function formatIDR(n) {
  const v = Number(n) || 0
  return `Rp${v.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

function formatDate(value) {
  if (!value) return '—'
  const d = new Date(String(value).replace(/\//g, '-'))
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatMonthYear(value) {
  if (!value) return '—'
  const d = new Date(String(value).replace(/\//g, '-'))
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}

function deriveBankCode(provider) {
  if (!provider) return '??'
  return String(provider)
    .replace(/^PT\.?\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)[0]
    ?.slice(0, 4)
    .toUpperCase() ?? '??'
}

function deriveAging(startDate) {
  if (!startDate) return '—'
  const start = new Date(String(startDate).replace(/\//g, '-'))
  if (Number.isNaN(start.getTime())) return '—'
  const now = new Date()
  const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
  if (months < 1) return '< 1 month'
  if (months < 12) return `${months} month${months > 1 ? 's' : ''}`
  const years = Math.floor(months / 12)
  const rem = months % 12
  return rem > 0 ? `${years}y ${rem}m` : `${years} year${years > 1 ? 's' : ''}`
}

function LoanAccountSlider() {
  const { sliderStack, popSlider, workforceDetail } = useWorkforce()

  const activeSlider = useMemo(
    () => (sliderStack.length > 0 ? sliderStack[sliderStack.length - 1] : null),
    [sliderStack]
  )

  // Find the matching facility from BE data
  const accountData = activeSlider?.data || {}
  const facilities = workforceDetail?.credit_report?.major_credit_facilities ?? []
  const creditReport = workforceDetail?.credit_report

  // Match by provider name + category (best effort)
  const facility = useMemo(() => {
    if (accountData.name) {
      return facilities.find((f) => f.provider === accountData.name) ?? null
    }
    return null
  }, [facilities, accountData.name])

  const provider = facility?.provider ?? accountData.name ?? 'Account Detail'
  const bankCode = deriveBankCode(provider)
  const creditLimit = Number(facility?.credit_limit) || 0
  const debitBalance = Number(facility?.debit_balance) || 0
  const available = creditLimit > 0 ? creditLimit - debitBalance : null
  const reportDate = creditReport?.report_date
  const kol = workforceDetail?.credit_report?.credit_summary?.collectability_status?.kol

  const informationData = {
    'Collectibility status': kol ? (
      <MyChip
        label={`Kol ${kol}`}
        color={kol >= 3 ? 'error' : kol === 2 ? 'warning' : 'success'}
        variant="filled"
        size="sm"
        rounded="full"
      />
    ) : '—',
    Limit: formatIDR(creditLimit),
    Outstanding: formatIDR(debitBalance),
    Available: available != null ? formatIDR(available) : '—',
    'Credit type': facility?.contract_type ?? '—',
    'Start date': formatDate(facility?.start_date),
    'Account aging': deriveAging(facility?.start_date),
    'Account expired': formatMonthYear(facility?.due_date),
  }

  return (
    <div className="flex h-screen w-[420px] flex-col bg-white">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="relative px-6 py-8 border-b border-gray/100">
        <button
          type="button"
          onClick={popSlider}
          className="absolute right-[16px] top-[16px] flex h-10 w-10 items-center justify-center rounded-lg p-2 text-gray/400 hover:bg-gray/50"
        >
          <XClose size={24} />
        </button>

        {/* Decorative background pattern */}
        <div className="absolute left-0 top-0 -z-10 opacity-20">
          <MyBgPatternDecorativeCircle size="sm" />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <MySkeuomorphicContainer className="size-14 flex items-center justify-center bg-white border border-gray/200 rounded-xl shadow-xs">
              <span className="text-xl-bold text-[#0060AF]">{bankCode}</span>
            </MySkeuomorphicContainer>

            <div className="flex flex-col gap-1">
              <h3 className="text-lg-semibold text-gray/900">{provider}</h3>
              <p className="text-sm-regular text-gray/600">
                {reportDate ? `Data as ${formatDate(reportDate)}` : '—'}
              </p>
            </div>
          </div>

          {facility?.contract_status && (
            <div className="flex">
              <div className="flex items-center gap-2 rounded-full border border-gray/200 bg-gray/50 px-3 py-1">
                <span className="text-xs-medium text-gray/600">Status</span>
                <span className="text-xs-semibold text-gray/900">{facility.contract_status}</span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="flex flex-col gap-6 px-4 py-6">
            {/* Information Section */}
            <MyDoubleCard heading="Information" innerClassName="p-0">
              <MyDetailView datas={informationData} />
            </MyDoubleCard>

            {/* Payment History Section */}
            <MyDoubleCard heading="Payment history" innerClassName="p-4">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between border-b border-gray/100 pb-3">
                  <span className="text-sm text-gray/600">Contract phase</span>
                  <span className="text-sm-semibold text-gray/900">
                    {facility?.contract_phase ?? '—'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray/100 pb-3">
                  <span className="text-sm text-gray/600">Overdue amount</span>
                  <span className="text-sm-semibold text-gray/900">
                    {formatIDR(facility?.overdue)}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray/100 pb-3">
                  <span className="text-sm text-gray/600">Interest rate</span>
                  <span className="text-sm-semibold text-gray/900">
                    {facility?.interest_rate ?? '—'}
                  </span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-sm text-gray/600">Due date</span>
                  <span className="text-sm-semibold text-gray/900">
                    {formatDate(facility?.due_date)}
                  </span>
                </div>
              </div>
            </MyDoubleCard>
          </div>
      </div>
    </div>
  )
}

export default LoanAccountSlider
