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

export default function CreditCompositionSlider() {
  const { handleCurrentSlider, workforceDetail } = useWorkforce()
  const facilities = workforceDetail?.credit_report?.major_credit_facilities ?? []

  const handleClose = () => handleCurrentSlider(null)

  const data = facilities.map((f, i) => ({
    id: i,
    tanggal: formatDate(f.start_date),
    jenis: f.contract_type ?? '—',
    total: formatIDR(f.debit_balance),
  }))

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
