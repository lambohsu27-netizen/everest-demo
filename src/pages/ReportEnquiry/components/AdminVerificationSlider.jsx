import React from 'react'
import SimpleBar from 'simplebar-react'
import { XClose, File02, Trash01, Send01 } from '@untitled-ui/icons-react'
import { MyButton, MyDoubleCard, WhatsApp, MyAvatar } from '@interstellar-component'
import { useReportEnquiry } from '../Context'
import MySLAStatusChip from './MySLAStatusChip'
import MyTextField from '../../../../interstellar-component/components/TextField/MyTextField'
import MyTextArea from '../../../../interstellar-component/components/TextField/MyTextArea'
import VerificationOCRModal from './VerificationOCRModal'

export default function AdminVerificationSlider({ data }) {
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
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&auto=format&fit=crop',
    position: 'Project Manager',
    nik: '3275 0427 0800 0007',
    dob: 'Jan 10, 2001',
    gender: 'Female',
    city: 'Jakarta Selatan',
    district: 'Setiabudi',
    subdistrict: 'Karet Kuningan',
    postalCode: '12180',
    address: 'Kawasan Rasuna Epicentrum, JL. HR. Rasuna Said'
  }

  const handleClose = () => popSlider()

  return (
    <div className="relative flex h-screen w-[420px] flex-col bg-white shadow-xl">
      <VerificationOCRModal 
        open 
        onClose={handleClose} 
        data={{
          portrait: displayData.avatar,
          ktp: 'https://images.unsplash.com/photo-1594819047050-99defca82545?q=80&w=800&h=500&auto=format&fit=crop',
          score: 63
        }} 
      />
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="relative flex items-start gap-x-4 px-6 py-6 border-b border-gray-100 pb-4">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-[12px] top-[12px] flex h-10 w-10 items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-gray-50 active:bg-gray-100 shadow-none border-none outline-none"
        >
          <XClose size={24} stroke="currentColor" />
        </button>

        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold text-gray-900">{displayData.order}</h2>
            <p className="text-sm text-gray-500">{displayData.orderDate}</p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="w-max">
              <MySLAStatusChip status="Admin verification" />
            </div>
            
            <MyButton
              color="secondary"
              variant="outlined"
              size="md"
              customClassname="gap-2"
            >
              <File02 size={20} className="text-gray-500" />
              View Job Application Letter
            </MyButton>
          </div>
        </div>
      </header>

      {/* ── Scrollable body ─────────────────────────────────────────────────── */}
      <section className="flex-1 overflow-hidden bg-gray-50/30">
        <SimpleBar forceVisible="y" style={{ maxHeight: '100%' }}>
          <div className="flex flex-col gap-6 px-6 py-6">
            
            {/* Identity Card */}
            <MyDoubleCard heading="Identity" innerClassName="p-4">
              <div className="flex flex-col gap-4">
                {/* NIK */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-0.5 text-sm font-medium text-gray-700">
                    NIK <span className="text-error-500">*</span>
                  </div>
                  <MyTextField
                    readOnly
                    value={displayData.nik}
                    placeholder="Enter NIK"
                  />
                </div>

                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-0.5 text-sm font-medium text-gray-700">
                    Full Name <span className="text-error-500">*</span>
                  </div>
                  <MyTextField
                    readOnly
                    value={displayData.name}
                    placeholder="Enter full name"
                  />
                </div>

                {/* Date of Birth */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-0.5 text-sm font-medium text-gray-700">
                    Date of Birth <span className="text-error-500">*</span>
                  </div>
                  <MyTextField
                    readOnly
                    value={displayData.dob}
                    placeholder="Select date"
                  />
                </div>

                {/* Gender */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-0.5 text-sm font-medium text-gray-700">
                    Gender <span className="text-error-500">*</span>
                  </div>
                  <MyTextField
                    readOnly
                    value={displayData.gender}
                    placeholder="Select gender"
                  />
                </div>

                {/* City and District split */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-0.5 text-sm font-medium text-gray-700">
                      City <span className="text-error-500">*</span>
                    </div>
                    <MyTextField
                      readOnly
                      value={displayData.city}
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-0.5 text-sm font-medium text-gray-700">
                      District <span className="text-error-500">*</span>
                    </div>
                    <MyTextField
                      readOnly
                      value={displayData.district}
                      placeholder="Enter district"
                    />
                  </div>
                </div>

                {/* Subdistrict and Postal Code split */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-0.5 text-sm font-medium text-gray-700">
                      Subdistrict <span className="text-error-500">*</span>
                    </div>
                    <MyTextField
                      readOnly
                      value={displayData.subdistrict}
                      placeholder="Enter subdistrict"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-0.5 text-sm font-medium text-gray-700">
                      Postal Code <span className="text-error-500">*</span>
                    </div>
                    <MyTextField
                      readOnly
                      value={displayData.postalCode}
                      placeholder="Enter postal code"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-0.5 text-sm font-medium text-gray-700">
                    Address (as stated on ID) <span className="text-error-500">*</span>
                  </div>
                  <MyTextArea
                    readOnly
                    value={displayData.address}
                    placeholder="Enter address"
                  />
                </div>
              </div>
            </MyDoubleCard>

            {/* Contact Information Card */}
            <MyDoubleCard heading="Contact information" innerClassName="p-0">
              <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between p-4 px-5">
                  <span className="text-sm text-gray-500">Category</span>
                  <span className="text-sm font-semibold text-gray-900">{displayData.category}</span>
                </div>
                <div className="flex items-center justify-between p-4 px-5">
                  <span className="text-sm text-gray-500">Level</span>
                  <span className="text-sm font-semibold text-gray-900">{displayData.level}</span>
                </div>
                <div className="flex items-center justify-between p-4 px-5">
                  <span className="text-sm text-gray-500">Entity</span>
                  <span className="text-sm font-semibold text-gray-900">{displayData.entity}</span>
                </div>
                <div className="flex items-center justify-between p-4 px-5">
                  <span className="text-sm text-gray-500">Role</span>
                  <span className="text-sm font-semibold text-gray-900">{displayData.position}</span>
                </div>
                <div className="flex items-center justify-between p-4 px-5">
                  <span className="text-sm text-gray-500">WhatsApp</span>
                  <div className="flex items-center gap-2">
                    <WhatsApp className="size-4 text-green-500" />
                    <span className="text-sm font-semibold text-gray-900">{displayData.whatsapp}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 px-5">
                  <span className="text-sm text-gray-500">Email</span>
                  <span className="text-sm font-semibold text-gray-900">{displayData.email}</span>
                </div>
                <div className="flex items-center justify-between p-4 px-5">
                  <span className="text-sm text-gray-500">Consent expiry</span>
                  <span className="text-sm font-semibold text-gray-900">{displayData.consentExpiry}</span>
                </div>
                <div className="flex items-center justify-between p-4 px-5">
                  <span className="text-sm text-gray-500">Repeat every</span>
                  <span className="text-sm font-semibold text-gray-900">{displayData.repeatEvery}</span>
                </div>
              </div>
            </MyDoubleCard>

            {/* Activity Card */}
            <MyDoubleCard heading="Activity" innerClassName="p-4">
              <div className="flex flex-col gap-0 antialiased">
                {/* Item 1 */}
                <div className="relative flex gap-4 pb-8">
                  <div className="absolute left-[20px] top-[40px] h-[calc(100%-40px)] w-0.5 bg-gray-200" />
                  <MyAvatar photo={displayData.avatar} size={40} />
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">Form resubmitted</span>
                      <span className="text-xs text-gray-500">2 mins ago</span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Resubmitted by <span className="font-semibold text-brand/700">{displayData.name}</span>. KTP photo and liveness verification uploaded.
                    </p>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="relative flex gap-4 pb-8">
                  <div className="absolute left-[20px] top-[40px] h-[calc(100%-40px)] w-0.5 bg-gray-200" />
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-50">
                    <div className="h-2 w-2 rounded-full bg-gray-400" />
                  </div>
                  <div className="flex flex-col gap-1 pt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">Form resent</span>
                      <span className="text-xs text-gray-500">3 hours ago</span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Form link resent automatically to employee with revision notes.
                    </p>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="relative flex gap-4 pb-8">
                  <div className="absolute left-[20px] top-[40px] h-[calc(100%-40px)] w-0.5 bg-gray-200" />
                  <MyAvatar photo="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=256&h=256&auto=format&fit=crop" size={40} />
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">Verification rejected</span>
                      <span className="text-xs text-gray-500">3 hours ago</span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Rejected by <span className="font-semibold text-brand/700">Candice Wu</span>. Issues found: KTP image is blurry and liveness photo is too dark.
                    </p>
                    <div className="mt-2 rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-600">
                      KTP image is blurry and liveness photo is too dark.
                    </div>
                  </div>
                </div>

                {/* Item 4 */}
                <div className="relative flex gap-4 pb-8">
                  <div className="absolute left-[20px] top-[40px] h-[calc(100%-40px)] w-0.5 bg-gray-200" />
                  <MyAvatar size={40} />
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">Form Submitted</span>
                      <span className="text-xs text-gray-500">6 hours ago</span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Submitted by <span className="font-semibold text-brand/700">{displayData.name}</span>. KTP photo and liveness verification uploaded.
                    </p>
                  </div>
                </div>

                {/* Item 5 */}
                <div className="relative flex gap-4">
                  <MyAvatar photo="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&auto=format&fit=crop" size={40} />
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">Request created</span>
                      <span className="text-xs text-gray-500">6 hours ago</span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Created by <span className="font-semibold text-brand/700">Lana Steiner</span>. Form link sent to employee via WhatsApp
                    </p>
                  </div>
                </div>
              </div>
            </MyDoubleCard>
          </div>
        </SimpleBar>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
        <MyButton
          color="error"
          variant="link"
          size="md"
          customClassname="gap-2 px-0"
        >
          <Trash01 size={20} />
          Cancel request
        </MyButton>

        <MyButton
          color="secondary"
          variant="outlined"
          size="md"
          customClassname="gap-2"
        >
          <Send01 size={20} className="text-gray-500" />
          Resend form
        </MyButton>
      </footer>
    </div>
  )
}
