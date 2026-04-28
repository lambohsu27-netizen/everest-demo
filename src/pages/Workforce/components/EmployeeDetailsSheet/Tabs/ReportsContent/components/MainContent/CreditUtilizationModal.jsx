import React, { useMemo, useState } from 'react'
import { debounce } from 'lodash'
import { XClose, SearchLg, FilterLines } from '@untitled-ui/icons-react'
import {
  MyModal,
  MyBgPatternDecorativeCircle,
  MyDataTable,
  MyColumn,
  MyButton,
  MyTextField,
} from '@interstellar-component'
import { useWorkforce } from '../../../../../../Context'

function formatIDR(n) {
  const v = Number(n) || 0
  return `Rp ${v.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

// DEMO DATA — backend dropped major_credit_facilities. The new shape only
// exposes credit_overview.credit_utilization (aggregate) — no per-facility
// breakdown. Until that data is re-exposed, we show a preview list so the
// modal still reads as a credit-bureau drill-down.
const DEMO_FACILITY_ROWS = [
  { id: 1, pelapor: 'PT Bank Mandiri', providerType: 'Bank Umum', jenis: 'Credit Card', bakiDebet: 'Rp 8.200.000', plafon: 'Rp 12.000.000', penggunaan: 68 },
  { id: 2, pelapor: 'PT Bank Central Asia', providerType: 'Bank Umum', jenis: 'Credit Card', bakiDebet: 'Rp 4.250.000', plafon: 'Rp 6.000.000', penggunaan: 71 },
  { id: 3, pelapor: 'Kredivo', providerType: 'Fintech P2P', jenis: 'Paylater', bakiDebet: 'Rp 850.000', plafon: 'Rp 2.000.000', penggunaan: 43 },
  { id: 4, pelapor: 'PT Bank Rakyat Indonesia', providerType: 'Bank Umum', jenis: 'KKB', bakiDebet: 'Rp 87.500.000', plafon: 'Rp 100.000.000', penggunaan: 88 },
  { id: 5, pelapor: 'PT Bank Negara Indonesia', providerType: 'Bank Umum', jenis: 'KPR', bakiDebet: 'Rp 412.300.000', plafon: 'Rp 500.000.000', penggunaan: 82 },
]

export default function CreditUtilizationModal({ open, onClose }) {
  const [search, setSearch] = useState('')

  const allData = useMemo(() => DEMO_FACILITY_ROWS, [])

  const filteredData = useMemo(() => {
    if (!search) return allData
    const q = search.toLowerCase()
    return allData.filter(
      (item) => item.pelapor.toLowerCase().includes(q) || item.jenis.toLowerCase().includes(q)
    )
  }, [allData, search])

  const onSearchChange = useMemo(() => debounce((e) => setSearch(e.target.value ?? ''), 500), [])

  return (
    <MyModal open={open} onClose={onClose} forceBlur maxWidth={1000}>
      <div className="flex flex-col bg-white rounded-xl shadow-xl overflow-hidden relative max-h-[90vh] w-full">
        {/* Background Pattern */}
        <div className="absolute top-0 left-0 pointer-events-none opacity-20 transform -translate-x-1/4 -translate-y-1/4 z-0">
          <MyBgPatternDecorativeCircle />
        </div>

        {/* Fixed Header */}
        <header className="relative pt-10 pb-6 px-10 flex justify-between items-start z-20 shrink-0 bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col gap-1">
            <h3 className="text-[24px] font-semibold text-gray-900">Credit Utilization</h3>
            <p className="text-[16px] text-gray-500">
              Insight into credit exposure and utilization levels to assess financial risk.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <XClose className="w-6 h-6 text-gray-400" />
          </button>
        </header>

        {/* Scrollable Content Area */}
        <section
          className="flex-1 overflow-y-auto px-6 pb-6 z-10 custom-scrollbar min-h-0"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#D0D5DD transparent',
          }}
        >
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
            {/* Table Header / Toolbar */}
            <div className="flex p-4 items-center justify-between border-b border-gray-200 gap-4 sticky top-0 bg-white z-20">
              <div className="w-full max-w-sm">
                <MyTextField
                  placeholder="Search"
                  startAdornment={
                    <SearchLg className="size-5 text-gray-light/600" stroke="currentColor" />
                  }
                  focusColor="#42307D"
                  onChangeForm={onSearchChange}
                />
              </div>
              <MyButton color="secondary" variant="outlined" size="md">
                <FilterLines className="h-5 w-5" />
                Filters
              </MyButton>
            </div>

            {/* Data Table */}
            <MyDataTable values={{ data: filteredData }} className="border-none shadow-none">
              <MyColumn
                header="Pelapor"
                field="pelapor"
                body={(row) => (
                  <div className="flex flex-col gap-0.5 py-2">
                    <span className="text-sm font-semibold text-gray-900">{row.pelapor}</span>
                    <span className="text-sm text-gray-500">{row.id}</span>
                  </div>
                )}
              />
              <MyColumn
                header="Jenis penggunaan"
                field="jenis"
                body={(row) => <span className="text-sm text-gray-900 py-4 block">{row.jenis}</span>}
              />
              <MyColumn
                header="Baki debet"
                field="bakiDebet"
                body={(row) => (
                  <span className="text-sm text-gray-600 font-medium py-4 block">
                    {row.bakiDebet}
                  </span>
                )}
              />
              <MyColumn
                header="Plafon"
                field="plafon"
                body={(row) => (
                  <span className="text-sm text-gray-600 font-medium py-4 block">{row.plafon}</span>
                )}
              />
              <MyColumn
                header="Penggunaan"
                field="penggunaan"
                body={(row) => (
                  <div className="flex items-center gap-3 py-4">
                    <div className="h-2 w-24 rounded-full bg-gray-100 overflow-hidden min-w-[96px]">
                      <div
                        className="h-full bg-brand/900 rounded-full"
                        style={{ width: `${row.penggunaan}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{row.penggunaan}%</span>
                  </div>
                )}
              />
            </MyDataTable>

            {/* Footer */}
            <div className="flex items-center px-6 py-4 border-t border-gray-200">
              <span className="text-sm text-gray-600 font-medium">
                {filteredData.length} record{filteredData.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>
        </section>
      </div>
    </MyModal>
  )
}
