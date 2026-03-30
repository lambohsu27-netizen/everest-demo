import React from 'react'
import SimpleBar from 'simplebar-react'
import {
  Edit01,
  XClose,
} from '@untitled-ui/icons-react'
import {
  MyAvatar,
  MyHorizontalTabV2,
} from '@interstellar-component'

// ── helpers ────────────────────────────────────────────────────────────────────
function CirclesBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
      <div className="absolute top-[-48px] left-[-48px] w-[336px] h-[336px] pointer-events-none">
        {[96, 144, 192, 240, 288, 336].map((size, index) => (
          <div
            key={index}
            className="absolute top-1/2 left-1/2 rounded-full border border-gray-100"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>
    </div>
  )
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500 font-medium">{label}</span>
      <span className="text-sm text-gray-900 font-semibold">{value}</span>
    </div>
  )
}

// ── main component ─────────────────────────────────────────────────────────────
function EmployeeDetailHoverCard({ employee, isVisible, style, onMouseEnter, onMouseLeave }) {
  if (!employee || !isVisible) return null

  return (
    <div
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`fixed z-[1100] w-[375px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 transform ${
        isVisible
          ? 'opacity-100 translate-x-0'
          : 'opacity-0 -translate-x-4 pointer-events-none'
      } flex flex-col max-h-[calc(100vh-48px)]`}
    >
      <SimpleBar forceVisible="y" style={{ maxHeight: '100%' }}>
        <div className="flex flex-col">
          {/* ── Header Decor ────────────────────────────────────────────────────── */}
          <div className="relative h-[160px] bg-white shrink-0">
            <CirclesBackground />

            {/* Close button (top right) */}
            <button className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <XClose size={20} />
            </button>

            {/* Profile Info Overlay */}
            <div className="absolute -bottom-[20px] left-6">
              <div className="relative">
                <MyAvatar
                  name={employee.label}
                  src={employee.avatar}
                  size="xl"
                  customClassname="w-24 h-24 ring-4 ring-white shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* ── Employee Info ───────────────────────────────────────────────────── */}
          <div className="px-6 pt-8 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-2xl font-bold text-gray-900">
                {employee.label}
              </p>
              {employee.status === 'Expired' && (
                <span className="rounded-full bg-error/50 border border-error/200 px-2 py-0.5 text-xs font-semibold text-error/700">
                  Expired
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-2">
              ID-{employee.id}
            </p>
            <p className="text-base text-gray-500 font-medium pb-6">
              {employee.position}
            </p>

            {/* Navigation Tabs */}
            <div className="mb-6">
              <MyHorizontalTabV2
                fitContent
                value="Employment"
                tabs={[
                  { label: 'Overview', value: 'Overview' },
                  { label: 'Employment', value: 'Employment' },
                  { label: 'History', value: 'History' },
                ]}
              />
            </div>

            {/* ── Employment Section ──────────────────────────────────────────────── */}
            <div className="rounded-xl border border-gray-200 bg-gray-50/30 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white">
                <h4 className="text-sm font-bold text-gray-900 tracking-tight">
                  Employment
                </h4>
                <button className="flex items-center gap-1.5 text-brand/700 hover:text-brand/800 transition-colors">
                  <Edit01 className="size-4" />
                  <span className="text-sm font-semibold">Edit</span>
                </button>
              </div>

              <div className="bg-white px-5 py-2">
                <DetailRow label="Level" value={employee.level?.label || 'Staff'} />
                <DetailRow label="Division" value={employee.division || 'Design'} />
                <DetailRow label="Entity" value={employee.entityObj?.label || 'PT Everest'} />
                <DetailRow label="WhatsApp" value={employee.whatsapp || '+62 000 0000'} />
                <DetailRow label="Email" value={employee.email || 'N/A'} />
              </div>
            </div>
          </div>

          {/* ── Padding for bottom ── */}
          <div className="h-10 shrink-0" />
        </div>
      </SimpleBar>
    </div>
  )
}

export default EmployeeDetailHoverCard
