import React, { useState } from 'react'
import { XClose, SearchMd, FilterLines } from '@untitled-ui/icons-react'
import {
  MyModal,
  MyBgPatternDecorativeCircle,
  MyDataTable,
  MyColumn,
  MyButton,
} from '@interstellar-component'

/**
 * @typedef {Object} CreditUtilizationModalProps
 * @property {boolean} open
 * @property {() => void} onClose
 */

/**
 * @param {CreditUtilizationModalProps} props
 */
export default function CreditUtilizationModal({ open, onClose }) {
  const [searchTerm, setSearchTerm] = useState('')

  const data = [
    {
      pelapor: 'PT Home Credit Indonesia',
      id: '252909',
      jenis: 'Konsumsi',
      bakiDebet: 'Rp 45,123,000',
      plafon: 'Rp 45,123,000',
      penggunaan: 90,
    },
    {
      pelapor: 'PT Adira Dinamika Multi Finance',
      id: '251030',
      jenis: 'Konsumsi',
      bakiDebet: 'Rp 45,123,000',
      plafon: 'Rp 45,123,000',
      penggunaan: 10,
    },
    {
      pelapor: 'PT Bank Seabank Indonesia',
      id: '535',
      jenis: 'Konsumsi',
      bakiDebet: 'Rp 45,123,000',
      plafon: 'Rp 45,123,000',
      penggunaan: 0,
    },
    {
      pelapor: 'PT Home Credit Indonesia',
      id: '252909',
      jenis: 'Konsumsi',
      bakiDebet: 'Rp 45,123,000',
      plafon: 'Rp 45,123,000',
      penggunaan: 60,
    },
    {
      pelapor: 'PT Home Credit Indonesia',
      id: '252909',
      jenis: 'Konsumsi',
      bakiDebet: 'Rp 45,123,000',
      plafon: 'Rp 45,123,000',
      penggunaan: 30,
    },
    {
      pelapor: 'PT Home Credit Indonesia',
      id: '252909',
      jenis: 'Konsumsi',
      bakiDebet: 'Rp 45,123,000',
      plafon: 'Rp 45,123,000',
      penggunaan: 60,
    },
  ]

  const filteredData = data.filter((item) =>
    item.pelapor.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
              <div className="relative flex-1 max-w-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <SearchMd className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="blur-none block w-full rounded-lg border border-gray-300 bg-white p-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-brand/500 focus:outline-none focus:ring-1 focus:ring-brand/500"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                        className="h-full bg-brand/600 rounded-full"
                        style={{ width: `${row.penggunaan}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{row.penggunaan}%</span>
                  </div>
                )}
              />
            </MyDataTable>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between p-4 border-t border-gray-200">
              <span className="text-sm text-gray-600 font-medium">Page 1 of 4</span>
              <div className="flex items-center gap-3">
                <MyButton color="secondary" variant="outlined" size="md" customClassname="px-4">
                  Previous
                </MyButton>
                <MyButton color="secondary" variant="outlined" size="md" customClassname="px-4">
                  Next
                </MyButton>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MyModal>
  )
}
