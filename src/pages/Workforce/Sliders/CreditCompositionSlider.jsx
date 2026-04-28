import React from 'react'
import SimpleBar from 'simplebar-react'
import { XClose } from '@untitled-ui/icons-react'
import { MyDataTable, MyColumn } from '@interstellar-component'
import { useWorkforce } from '../Context'

function formatDate(value) {
  if (!value) return '—'
  const d = new Date(String(value).replace(/\//g, '-'))
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatIDR(n) {
  const v = Number(n) || 0
  return `Rp ${v.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

// DEMO DATA — backend dropped major_credit_facilities; the new shape only
// ships aggregate composition (no per-account rows). Until account-level
// data is re-exposed we render preview rows so the slider stays demonstrable.
const DEMO_COMPOSITION_ROWS = [
  { id: 1, tanggal: '12 Jan 2024', jenis: 'Credit Card — Active', total: 'Rp 8.200.000' },
  { id: 2, tanggal: '03 Mar 2024', jenis: 'Credit Card — Active', total: 'Rp 4.250.000' },
  { id: 3, tanggal: '20 Jun 2024', jenis: 'Paylater — Active', total: 'Rp 850.000' },
  { id: 4, tanggal: '15 Sep 2024', jenis: 'KKB — Active', total: 'Rp 87.500.000' },
  { id: 5, tanggal: '01 Nov 2024', jenis: 'KPR — Active', total: 'Rp 412.300.000' },
  { id: 6, tanggal: '08 Feb 2025', jenis: 'Other — Active', total: 'Rp 5.200.000' },
]

export default function CreditCompositionSlider() {
  const { handleCurrentSlider } = useWorkforce()

  const handleClose = () => handleCurrentSlider(null)

  // Backend ships credit_overview.credit_composition as 5 aggregate buckets
  // with phase counters but no per-account rows. We always render the demo
  // list here.
  const data = DEMO_COMPOSITION_ROWS

  return (
    <div className="flex h-screen w-[420px] flex-col bg-white">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="relative flex items-start gap-x-4 px-6 py-6 border-b border-gray/100">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-[12px] top-[12px] flex h-10 w-10 items-center justify-center rounded-lg p-2 text-gray-light/400 hover:bg-gray-light/50 active:bg-gray-light/100"
        >
          <XClose size={24} stroke="currentColor" />
        </button>

        <div className="flex flex-1 flex-col gap-1 pt-1">
          <p className="text-lg-semibold text-gray/900">Credit Composition</p>
          <p className="text-sm-regular text-gray/600">
            Overview of active credit types and historical loan records.
          </p>
        </div>
      </header>

      {/* ── Scrollable Body ─────────────────────────────────────────────────── */}
      <section className="flex-1 overflow-hidden">
        <SimpleBar forceVisible="y" style={{ maxHeight: '100%' }}>
          <div className="flex flex-col gap-6 px-0 py-0">
            <MyDataTable values={{ data }} className="border-none shadow-none">
              <MyColumn
                header="Tanggal mulai / jenis"
                field="tanggal"
                body={(row) => (
                  <div className="flex flex-col gap-0.5 py-1">
                    <span className="text-sm-semibold text-gray/900">{row.tanggal}</span>
                    <span className="text-sm-regular text-gray/600">{row.jenis}</span>
                  </div>
                )}
              />
              <MyColumn
                header="Total"
                field="total"
                body={(row) => (
                  <div className="flex justify-end pr-4">
                    <span className="text-sm-medium text-gray/700">{row.total}</span>
                  </div>
                )}
                headerStyle={{ textAlign: 'right', paddingRight: '1rem' }}
              />
            </MyDataTable>
          </div>
        </SimpleBar>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="flex items-center border-t border-gray/200 px-6 py-4 bg-white">
        <span className="text-sm-medium text-gray/700">
          {data.length} record{data.length === 1 ? '' : 's'}
        </span>
      </footer>
    </div>
  )
}
