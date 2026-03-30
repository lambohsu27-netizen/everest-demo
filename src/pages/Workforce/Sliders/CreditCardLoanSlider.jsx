import React from 'react'
import SimpleBar from 'simplebar-react'
import { XClose, CreditCard02 } from '@untitled-ui/icons-react'
import { MyChip, MyHorizontalTabV2 } from '@interstellar-component'
import { useWorkforce } from '../Context'

export default function CreditCardLoanSlider() {
  const { handleCurrentSlider } = useWorkforce()
  const [selectedStatus, setSelectedStatus] = React.useState('All')
  const [selectedCategory, setSelectedCategory] = React.useState('Credit card')

  const handleClose = () => handleCurrentSlider(null)

  const accounts = [
    {
      id: 1,
      bank: 'BCA',
      name: 'BCA Master Card',
      kol: 'Kol 2',
      label: 'Jumlah pinjaman',
      amount: 'Rp 1,523,000',
      isActive: false,
    },
    {
      id: 2,
      bank: 'BCA',
      name: 'BCA Master Card',
      kol: 'Kol 2',
      label: 'Jumlah pinjaman',
      amount: 'Rp 5,000,000',
      isActive: true,
    },
  ]

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
          <p className="text-lg-semibold text-gray/900">Loan</p>
          <p className="text-sm-regular text-gray/600">Details of loans</p>
        </div>
      </header>

      {/* ── Scrollable Body ─────────────────────────────────────────────────── */}
      <section className="flex-1 overflow-hidden">
        <SimpleBar forceVisible="y" style={{ maxHeight: '100%' }}>
          <div className="flex flex-col gap-6 px-6 py-6">
            {/* Filter Tabs */}
            <div className="flex flex-col gap-4">
              {/* Status tabs */}
              <MyHorizontalTabV2
                fitContent
                value={selectedStatus}
                onChange={setSelectedStatus}
                tabs={[
                  { label: 'All', value: 'All' },
                  {
                    label: (
                      <span className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-[#17B26A]" />
                        <span>On track</span>
                      </span>
                    ),
                    value: 'On track',
                  },
                  {
                    label: (
                      <span className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-[#F04438]" />
                        <span>Overdue</span>
                      </span>
                    ),
                    value: 'Overdue',
                  },
                ]}
              />

              {/* Category tabs */}
              <MyHorizontalTabV2
                fitContent
                value={selectedCategory}
                onChange={setSelectedCategory}
                tabs={[
                  { label: 'Credit card', value: 'Credit card' },
                  { label: 'Paylater', value: 'Paylater' },
                  { label: 'KKB', value: 'KKB' },
                  { label: 'KPR', value: 'KPR' },
                  { label: 'KTA', value: 'KTA' },
                ]}
              />
            </div>

            {/* Total Credit Section */}
            <div className="flex flex-col gap-1">
              <span className="text-sm-medium text-gray/600">Total credit</span>
              <h2 className="text-2xl-semibold text-gray/900">Rp 52,000,000</h2>
            </div>

            {/* Divider */}
            <div className="border-b border-gray/100" />

            {/* Section label */}
            <div className="flex items-center justify-between pb-2">
              <span className="text-sm-semibold text-gray/900">Daftar akun kartu kredit</span>
              <span className="text-sm-medium text-gray/600">2 account</span>
            </div>

            {/* Account list */}
            <div className="flex flex-col gap-3">
              {accounts.map((acc) => (
                <div
                  key={acc.id}
                  className={`flex flex-col gap-4 p-4 rounded-xl border transition-all ${
                    acc.isActive
                      ? 'border-primary-600 ring-4 ring-primary-50'
                      : 'border-gray-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {/* Logo placeholder - using skeuomorphic style */}
                      <div className="size-10 rounded-lg border border-gray/300 bg-white p-2 shadow-xs flex items-center justify-center">
                        <span className="text-xs-bold text-[#0060AF]">BCA</span>
                      </div>
                      <span className="text-sm-semibold text-gray/900">{acc.name}</span>
                    </div>
                    <MyChip
                      label={acc.kol}
                      color="warning"
                      variant="outlined"
                      size="sm"
                      rounded="full"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm-medium text-gray/500">{acc.label}</span>
                    <span className="text-sm-semibold text-gray/900">{acc.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SimpleBar>
      </section>

    </div>
  )
}
