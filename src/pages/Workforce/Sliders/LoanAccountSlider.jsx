import React, { useMemo } from 'react'
import ReactApexChart from 'react-apexcharts'
import { XClose } from '@untitled-ui/icons-react'
import {
  MyDoubleCard,
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

const MONTH_LABELS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']

function LoanAccountSlider() {
  const { sliderStack, popSlider, workforceDetail } = useWorkforce()

  const activeSlider = useMemo(
    () => (sliderStack.length > 0 ? sliderStack[sliderStack.length - 1] : null),
    [sliderStack]
  )

  // DEMO DATA — backend dropped major_credit_facilities and report_date in
  // the new shape, so per-account fields aren't queryable. We surface the
  // slider context's chosen account label and demo all the per-account
  // numerics. Real values will return once the account-level joiner ships.
  const accountData = activeSlider?.data || {}

  const provider = accountData.name ?? 'Account Detail'
  const bankCode = deriveBankCode(provider)
  // DEMO DATA — synthetic account financials.
  const creditLimit = 12000000
  const debitBalance = 8200000
  const available = creditLimit - debitBalance
  const reportDate = null
  // KOL still derivable from credit_summary.collectibility_status on the new shape.
  const kol = workforceDetail?.credit_summary?.collectibility_status?.kol
    ?? workforceDetail?.credit_summary?.collectability_status?.kol
  const facility = null

  const informationRows = [
    {
      label: 'Collectibility status',
      value: kol ? (
        <MyChip
          label={`Kol ${kol}`}
          color={kol >= 3 ? 'error' : kol === 2 ? 'warning' : 'success'}
          variant="filled"
          size="sm"
          rounded="full"
        />
      ) : '—',
    },
    { label: 'Limit', value: formatIDR(creditLimit) },
    { label: 'Outstanding', value: formatIDR(debitBalance) },
    { label: 'Available', value: available != null ? formatIDR(available) : '—' },
    { label: 'Credit type', value: facility?.contract_type ?? '—' },
    { label: 'Start date', value: formatDate(facility?.start_date) },
    { label: 'Account aging', value: deriveAging(facility?.start_date) },
    { label: 'Account expired', value: formatMonthYear(facility?.due_date) },
  ]

  // TODO: wire from BE when per-account payment history available
  // Example shape for BE reference:
  // { perform: 3, non_perform: 7, last_update: "2025-11-10",
  //   monthly: [ { year: 2024, months: ["perform","perform",null,...,"non_perform"] },
  //              { year: 2025, months: ["perform","perform","non_perform",...,null] } ] }
  const paymentHistory = {
    perform: 3,
    nonPerform: 7,
    lastUpdate: '10 Nov 2025',
    monthly: [
      {
        year: 2024,
        months: [null, null, null, null, null, null, null, null, null, null, null, 'perform'],
      },
      {
        year: 2025,
        months: ['perform', 'perform', 'non_perform', 'non_perform', 'non_perform', 'non_perform', 'non_perform', 'non_perform', 'non_perform', null, null, null],
      },
    ],
  }

  // TODO: wire from BE when per-account collectibility history available
  // Example shape: [{ month: "Jun", kol: 4 }, { month: "Jul", kol: 4 }, ...]
  const collectibilityData = [4, 4, 5, 5, 5, 5, 5, 5]
  const collectibilityLabels = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan']

  const chartOptions = {
    chart: {
      type: 'line',
      height: 180,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: ['#42307D'],
    stroke: { curve: 'straight', width: 2 },
    markers: { size: 4, strokeWidth: 0 },
    dataLabels: { enabled: false },
    grid: {
      borderColor: '#F2F4F7',
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: { top: 0, bottom: 0, left: 4, right: 4 },
    },
    xaxis: {
      categories: collectibilityLabels,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: '#667085', fontSize: '12px', fontFamily: 'Inter' },
      },
    },
    yaxis: {
      min: 1,
      max: 5,
      reversed: true,
      tickAmount: 4,
      labels: {
        style: { colors: '#667085', fontSize: '12px', fontFamily: 'Inter' },
      },
    },
    tooltip: { theme: 'light' },
    legend: { show: false },
  }

  return (
    <div className="flex h-screen w-[420px] flex-col bg-white">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="relative px-6 py-8 border-b border-gray/100">
        <button
          type="button"
          onClick={popSlider}
          className="absolute right-[12px] top-[12px] flex h-10 w-10 items-center justify-center rounded-lg p-2 text-gray/400 hover:bg-gray/50"
        >
          <XClose size={24} />
        </button>

        <div className="absolute left-0 top-0 -z-10 opacity-20">
          <MyBgPatternDecorativeCircle size="sm" />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <MySkeuomorphicContainer className="size-14  flex items-center justify-center bg-white border border-gray/200 rounded-xl shadow-xs">
              <span className="text-xl-bold text-[#0060AF] ">{bankCode}</span>
            </MySkeuomorphicContainer>

            <div className="flex flex-col gap-1">
              <h3 className="text-lg-semibold text-gray/900">{provider}</h3>
              <p className="text-sm-regular text-gray/600">
                {reportDate ? `Data as ${formatDate(reportDate)}` : '—'}
              </p>
            </div>
          </div>

          {/* Loan ID badge (Figma) */}
          <div className="flex">
            <div className="flex items-center gap-2 rounded-full border border-gray/200 bg-gray/50 px-3 py-1">
              <span className="text-xs-medium text-gray/600">Loan ID</span>
              <span className="text-xs-semibold text-gray/900">
                {/* TODO: wire real loan ID when BE provides it */}
                —
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="flex flex-col gap-6 px-4 py-6">
          {/* Information Section */}
          <MyDoubleCard heading="Information" innerClassName="p-0">
            <div className="flex flex-col">
              {informationRows.map((row, i) => (
                <React.Fragment key={row.label}>
                  <div className="flex items-center justify-between gap-4 px-5 py-3.5">
                    <span className="text-sm-regular text-gray/600 shrink-0">{row.label}</span>
                    <div className="text-sm-medium text-gray/900 text-right">{row.value}</div>
                  </div>
                  {i < informationRows.length - 1 && <hr className="border-gray-100 mx-5" />}
                </React.Fragment>
              ))}
            </div>
          </MyDoubleCard>

          {/* Payment History Section */}
          <MyDoubleCard heading="Payment history" innerClassName="p-4">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between border-b border-gray/100 pb-3">
                <span className="text-sm text-gray/600">Perform</span>
                <span className="text-sm-semibold text-gray/900">
                  {paymentHistory.perform} times
                </span>
              </div>
              <div className="flex justify-between border-b border-gray/100 pb-3">
                <span className="text-sm text-gray/600">Non-perform</span>
                <span className="text-sm-semibold text-gray/900">
                  {paymentHistory.nonPerform} times
                </span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-sm text-gray/600">Last update</span>
                <span className="text-sm-semibold text-gray/900">
                  {paymentHistory.lastUpdate}
                </span>
              </div>

              {/* Monthly dot grid */}
              <div className="rounded-[5px] bg-brand/25 px-1 py-0.5 flex flex-col gap-0.5">
                {/* Month headers */}
                <div className="flex items-center">
                  <span className="w-8 shrink-0" />
                  <div className="flex-1 flex">
                    {MONTH_LABELS.map((m, i) => (
                      <span key={i} className="flex-1 text-center text-[10px] font-medium leading-[12px] text-gray/700 py-1">{m}</span>
                    ))}
                  </div>
                </div>
                {/* Year rows */}
                {paymentHistory.monthly.map((row) => (
                  <div key={row.year} className="flex items-center gap-1">
                    <span className="text-[10px] font-medium text-gray/700 w-7 shrink-0 py-1">{row.year}</span>
                    <div className="flex-1 flex">
                      {row.months.map((status, i) => {
                        const bg =
                          status === 'perform'
                            ? 'bg-brand/100'
                            : status === 'non_perform'
                              ? 'bg-error/100'
                              : 'bg-gray/200'
                        const icon =
                          status === 'perform'
                            ? '✓'
                            : status === 'non_perform'
                              ? '✕'
                              : null
                        const iconColor =
                          status === 'perform'
                            ? 'text-brand/600'
                            : 'text-error/600'
                        return (
                          <div key={i} className="flex-1 flex justify-center py-1 px-1.5">
                            <div className={`size-3 rounded-[6px] ${bg} flex items-center justify-center`}>
                              {icon && <span className={`text-[7px] font-bold leading-none ${iconColor}`}>{icon}</span>}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
                {/* Legend */}
                <div className="flex items-center justify-center gap-4 py-1">
                  <div className="flex items-center gap-1">
                    <div className="size-3 rounded-[3px] bg-brand/100 flex items-center justify-center">
                      <span className="text-[6px] font-bold text-brand/600">✓</span>
                    </div>
                    <span className="text-[10px] font-medium text-gray/600">Perform</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="size-3 rounded-[3px] bg-error/100 flex items-center justify-center">
                      <span className="text-[6px] font-bold text-error/600">✕</span>
                    </div>
                    <span className="text-[10px] font-medium text-gray/600">Non-perform</span>
                  </div>
                </div>
              </div>
            </div>
          </MyDoubleCard>

          {/* Collectibility History */}
          <MyDoubleCard heading="Collectibility history" innerClassName="p-4">
            <div className="w-full">
              <ReactApexChart
                options={chartOptions}
                series={[{ name: 'Kol Status', data: collectibilityData }]}
                type="line"
                height={180}
              />
            </div>
          </MyDoubleCard>
        </div>
      </div>
    </div>
  )
}

export default LoanAccountSlider
