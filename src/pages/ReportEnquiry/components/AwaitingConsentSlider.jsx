import React from 'react'
import SimpleBar from 'simplebar-react'
import { XClose, Trash01, Send01 } from '@untitled-ui/icons-react'
import { MyButton, MyDoubleCard, WhatsApp } from '@interstellar-component'
import { useReportEnquiry } from '../Context'
import MySLAStatusChip from './MySLAStatusChip'

export default function AwaitingConsentSlider({ data }) {
  const { popSlider } = useReportEnquiry()

  // Use provided data or defaults from screenshot/JSON for illustration
  const displayData = data || {
    order: 'REQ-0000001',
    orderDate: '21 Oct 2026',
    name: 'Phoenix Baker',
    employeeId: 'ID-357232',
    category: 'Employee',
    level: 'Supervisor',
    whatsapp: '62 882 1992 1992',
    email: 'phoenix.baker@gmail.com',
    entity: 'PT Everest Maju Sejahtera',
    consentExpiry: 'Jan 10, 2025',
    repeatEvery: 'End of month',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&auto=format&fit=crop',
    position: 'Product Manager',
  }

  const handleClose = () => popSlider()

  return (
    <div className="flex h-screen w-[420px] flex-col bg-white shadow-xl">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="relative flex items-start gap-x-4 px-6 py-6 border-b border-gray-100 pb-4">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-[12px] top-[12px] flex h-10 w-10 items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-gray-50 active:bg-gray-100"
        >
          <XClose size={24} stroke="currentColor" />
        </button>

        <div className="flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold text-gray-900">{displayData.order}</h2>
            <p className="text-sm text-gray-500">{displayData.orderDate}</p>
          </div>
          <div className="w-max">
            <MySLAStatusChip status="Awaiting Consent" />
          </div>
        </div>
      </header>

      {/* ── Scrollable body ─────────────────────────────────────────────────── */}
      <section className="flex-1 overflow-hidden bg-gray-50/30">
        <SimpleBar forceVisible="y" style={{ maxHeight: '100%' }}>
          <div className="flex flex-col gap-6 px-6 py-6">
            {/* General Information Card */}
            <MyDoubleCard heading="General Information" innerClassName="p-0">
              <div className="divide-y divide-gray-100">
                {/* Target */}
                <div className="flex items-center justify-between p-4">
                  <span className="text-sm text-gray-500">Target</span>
                  <div className="flex items-center gap-3 text-right">
                    <img
                      src={displayData.avatar}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover border border-gray-200"
                    />
                    <div className="flex flex-col text-right">
                      <span className="text-sm font-semibold text-gray-900">
                        {displayData.name}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {displayData.employeeId}
                      </span>
                      <span className="text-xs text-gray-500">{displayData.position}</span>
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div className="flex items-center justify-between p-4">
                  <span className="text-sm text-gray-500">Category</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {displayData.category}
                  </span>
                </div>

                {/* Level */}
                <div className="flex items-center justify-between p-4">
                  <span className="text-sm text-gray-500">Level</span>
                  <span className="text-sm font-semibold text-gray-900">{displayData.level}</span>
                </div>

                {/* WhatsApp */}
                <div className="flex items-center justify-between p-4">
                  <span className="text-sm text-gray-500">WhatsApp</span>
                  <div className="flex items-center gap-2">
                    <WhatsApp className="size-4 text-green-500" />
                    <span className="text-sm font-semibold text-gray-900">
                      {displayData.whatsapp}
                    </span>
                  </div>
                </div>

                {/* Email address */}
                <div className="flex items-center justify-between p-4">
                  <span className="text-sm text-gray-500">Email address</span>
                  <span className="text-sm font-semibold text-gray-900">{displayData.email}</span>
                </div>

                {/* Entity */}
                <div className="flex items-center justify-between p-4">
                  <span className="text-sm text-gray-500">Entity</span>
                  <span className="text-sm font-semibold text-gray-900">{displayData.entity}</span>
                </div>

                {/* Consent expiry */}
                <div className="flex items-center justify-between p-4">
                  <span className="text-sm text-gray-500">Consent expiry</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {displayData.consentExpiry}
                  </span>
                </div>

                {/* Repeat every */}
                <div className="flex items-center justify-between p-4">
                  <span className="text-sm text-gray-500">Repeat every</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {displayData.repeatEvery}
                  </span>
                </div>
              </div>
            </MyDoubleCard>

            {/* Activity Card */}
            <MyDoubleCard heading="Activity" innerClassName="p-4">
              <div className="flex gap-4">
                <img
                  src={displayData.avatar}
                  alt=""
                  className="h-10 w-10 rounded-full object-cover border border-gray-200 shrink-0"
                />
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">Request created</span>
                    <span className="text-xs text-gray-500">6 hours ago</span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Created by <span className="font-semibold text-brand/700">Lana Steiner</span>.
                    Form link sent to employee via WhatsApp
                  </p>
                </div>
              </div>
            </MyDoubleCard>
          </div>
        </SimpleBar>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
        <MyButton color="error" variant="link" size="md" customClassname="gap-2 px-0">
          <Trash01 size={20} />
          Cancel request
        </MyButton>

        <MyButton color="secondary" variant="outlined" size="md" customClassname="gap-2">
          <Send01 size={20} className="text-gray-500" />
          Resend form
        </MyButton>
      </footer>
    </div>
  )
}
