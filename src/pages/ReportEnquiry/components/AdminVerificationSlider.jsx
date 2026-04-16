import React, { useCallback, useEffect, useState } from 'react'
import SimpleBar from 'simplebar-react'
import { XClose, File02, Trash01, Send01 } from '@untitled-ui/icons-react'
import {
  MyButton,
  MyDoubleCard,
  WhatsApp,
  MyAvatar,
  myToaster,
  MyConfirmModal,
} from '@interstellar-component'
import { format } from 'date-fns'
import { useReportEnquiry } from '../Context'
import MySLAStatusChip from './MySLAStatusChip'
import MyTextField from '../../../../interstellar-component/components/TextField/MyTextField'
import MyTextArea from '../../../../interstellar-component/components/TextField/MyTextArea'
import VerificationOCRModal from './VerificationOCRModal'
import JobApplicationLetterModal from './JobApplicationLetterModal'
import Service from '../service'

const STATUS_DISPLAY = {
  awaiting_form: 'Awaiting Form',
  awaiting_admin: 'Admin verification',
  awaiting_consent: 'Awaiting Consent',
  verification: 'Verification',
  form_revision: 'Form Revision',
  sent_to_clik: 'Sent to CLIK',
  completed: 'Completed',
  failed: 'Failed',
  canceled: 'Canceled',
}

const REPEAT_DISPLAY = {
  none: 'None',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  semi_annually: 'Semiannual',
  annually: 'Annual',
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  try {
    return format(new Date(dateStr), 'MMM d, yyyy')
  } catch {
    return dateStr
  }
}

export default function AdminVerificationSlider({ data }) {
  const { popSlider, getList } = useReportEnquiry()
  const [isLetterModalOpen, setIsLetterModalOpen] = useState(false)
  const [cancelModal, setCancelModal] = useState(false)
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(false)

  const enquiryId = data?._raw?.id || data?.id

  const fetchDetail = useCallback(() => {
    if (!enquiryId) return
    setLoading(true)
    Service.show(enquiryId)
      .then((res) => setDetail(res.data))
      .catch(myToaster)
      .finally(() => setLoading(false))
  }, [enquiryId])

  useEffect(() => {
    fetchDetail()
  }, [fetchDetail])

  const d = detail || {}
  const target = d.target || {}
  const identity = d.identity || {}
  const company = d.company || {}
  const creator = d.creator || {}
  const activities = d.activity || []

  const displayData = {
    order: d.reference_number || data?.order || '-',
    orderDate: formatDate(d.created_at),
    name: target.full_name || data?.name || '-',
    employeeId: target.code || data?.employeeId || '-',
    category: d.category === 'employee' ? 'Employee' : 'Candidate',
    level: d.employment_level?.name || '-',
    whatsapp: target.phone || '-',
    email: target.email || '-',
    entity: company.name || data?.entity || '-',
    consentExpiry: formatDate(d.consent_expiry),
    repeatEvery: REPEAT_DISPLAY[d.repeat_every] || d.repeat_every || '-',
    position: d.position?.name || '-',
    status: STATUS_DISPLAY[d.status] || d.status || 'Verification',
    // Identity (KYC)
    nik: identity.id_number || '-',
    fullName: identity.full_name || target.full_name || '-',
    dob: formatDate(identity.date_of_birth),
    gender: identity.gender === 'male' ? 'Male' : identity.gender === 'female' ? 'Female' : identity.gender || '-',
    city: identity.city || '-',
    district: identity.district || '-',
    subdistrict: identity.subdistrict || '-',
    postalCode: identity.postal_code || '-',
    address: identity.street_address || '-',
    creatorName: creator.name || 'System',
    creatorAvatar: creator.avatar_url,
  }

  const handleClose = () => popSlider()

  const handleCancel = async () => {
    await Service.cancel(enquiryId)
      .then((res) => {
        myToaster(res)
        getList()
        popSlider()
      })
      .catch(myToaster)
  }

  const handleResend = async () => {
    await Service.resend(enquiryId)
      .then((res) => {
        myToaster(res)
        fetchDetail()
      })
      .catch(myToaster)
  }

  return (
    <div className="relative flex h-screen w-[420px] flex-col bg-white shadow-xl">
      <VerificationOCRModal
        open={!!detail}
        onClose={handleClose}
        data={{
          // portrait: identity.portrait_url,
          // ktp: identity.ktp_url,
          // score: identity.face_match_score ?? 0,
          portrait: 'https://merpati-dev.s3.ap-southeast-1.amazonaws.com/everest/image+23.png',
          ktp: 'https://merpati-dev.s3.ap-southeast-1.amazonaws.com/everest/image+2.png',
          score: 95
        }}
      />

      {/* Header */}
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
              <MySLAStatusChip status={displayData.status} />
            </div>

            <MyButton
              color="secondary"
              variant="outlined"
              size="md"
              customClassname="gap-2"
              onClick={() => setIsLetterModalOpen(true)}
            >
              <File02 size={20} className="text-gray-500" />
              View Job Application Letter
            </MyButton>
          </div>
        </div>
      </header>

      {/* Scrollable body */}
      <section className="flex-1 overflow-hidden bg-gray-50/30">
        <SimpleBar forceVisible="y" style={{ maxHeight: '100%' }}>
          <div className="flex flex-col gap-6 px-6 py-6">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-gray-500">Loading...</p>
              </div>
            )}

            {!loading && (
              <>
                {/* Identity Card */}
                <MyDoubleCard heading="Identity" innerClassName="p-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="text-sm font-medium text-gray-700">NIK</div>
                      <MyTextField readOnly value={displayData.nik} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="text-sm font-medium text-gray-700">Full Name</div>
                      <MyTextField readOnly value={displayData.fullName} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="text-sm font-medium text-gray-700">Date of Birth</div>
                      <MyTextField readOnly value={displayData.dob} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="text-sm font-medium text-gray-700">Gender</div>
                      <MyTextField readOnly value={displayData.gender} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="text-sm font-medium text-gray-700">City</div>
                        <MyTextField readOnly value={displayData.city} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <div className="text-sm font-medium text-gray-700">District</div>
                        <MyTextField readOnly value={displayData.district} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="text-sm font-medium text-gray-700">Subdistrict</div>
                        <MyTextField readOnly value={displayData.subdistrict} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <div className="text-sm font-medium text-gray-700">Postal Code</div>
                        <MyTextField readOnly value={displayData.postalCode} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="text-sm font-medium text-gray-700">Address (as stated on ID)</div>
                      <MyTextArea readOnly value={displayData.address} />
                    </div>
                  </div>
                </MyDoubleCard>

                {/* Contact Information Card */}
                <MyDoubleCard heading="Contact information" innerClassName="p-0">
                  <div className="divide-y divide-gray-100">
                    {[
                      ['Category', displayData.category],
                      ['Level', displayData.level],
                      ['Entity', displayData.entity],
                      ['Role', displayData.position],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between p-4 px-5">
                        <span className="text-sm text-gray-500">{label}</span>
                        <span className="text-sm font-semibold text-gray-900">{value}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between p-4 px-5">
                      <span className="text-sm text-gray-500">WhatsApp</span>
                      <div className="flex items-center gap-2">
                        <WhatsApp className="size-4 text-green-500" />
                        <span className="text-sm font-semibold text-gray-900">{displayData.whatsapp}</span>
                      </div>
                    </div>
                    {[
                      ['Email', displayData.email],
                      ['Consent expiry', displayData.consentExpiry],
                      ['Repeat every', displayData.repeatEvery],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between p-4 px-5">
                        <span className="text-sm text-gray-500">{label}</span>
                        <span className="text-sm font-semibold text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </MyDoubleCard>

                {/* Activity Card */}
                <MyDoubleCard heading="Activity" innerClassName="p-4">
                  <div className="flex flex-col gap-0 antialiased">
                    {activities.map((act, idx) => (
                      <div key={act.id} className={`relative flex gap-4 ${idx < activities.length - 1 ? 'pb-8' : ''}`}>
                        {idx < activities.length - 1 && (
                          <div className="absolute left-[20px] top-[40px] h-[calc(100%-40px)] w-0.5 bg-gray-200" />
                        )}
                        <MyAvatar
                          name={act.actor_name}
                          src={act.actor?.avatar_url}
                          size={40}
                        />
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">
                              {act.event_type?.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(act.occurred_at)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 leading-relaxed">
                            {act.event_description}
                          </p>
                        </div>
                      </div>
                    ))}
                    {activities.length === 0 && (
                      <p className="text-sm text-gray-400">No activity yet</p>
                    )}
                  </div>
                </MyDoubleCard>
              </>
            )}
          </div>
        </SimpleBar>
      </section>

      {/* Footer */}
      <footer className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
        <MyButton
          color="error"
          variant="link"
          size="md"
          customClassname="gap-2 px-0"
          onClick={() => setCancelModal(true)}
        >
          <Trash01 size={20} />
          Cancel request
        </MyButton>

        <MyButton
          color="secondary"
          variant="outlined"
          size="md"
          customClassname="gap-2"
          onClick={handleResend}
        >
          <Send01 size={20} className="text-gray-500" />
          Resend form
        </MyButton>
      </footer>

      <MyConfirmModal
        open={cancelModal}
        onClose={() => setCancelModal(false)}
        onConfirm={handleCancel}
        title="Cancel request"
        description="Are you sure you want to cancel this enquiry request? This action cannot be undone."
        confirmText="Cancel request"
        confirmColor="error"
      />

      <JobApplicationLetterModal
        open={isLetterModalOpen}
        onClose={() => setIsLetterModalOpen(false)}
        zIndex={4000}
      />
    </div>
  )
}
