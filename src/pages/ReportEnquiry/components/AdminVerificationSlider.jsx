import React, { useCallback, useEffect, useState } from 'react'
import SimpleBar from 'simplebar-react'
import { XClose, File02 } from '@untitled-ui/icons-react'
import {
  MyButton,
  MyDoubleCard,
  WhatsApp,
  MyAvatar,
  myToaster,
  MyHorizontalTabV2,
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

const CATEGORY_DISPLAY = {
  employee: 'Employee',
  candidate: 'Candidate',
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  try {
    return format(new Date(dateStr), 'MMM d, yyyy')
  } catch {
    return dateStr
  }
}

function formatEventLabel(eventType) {
  if (!eventType) return ''
  return eventType.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

const TABS = [
  { label: 'Verification', value: 'verification' },
  { label: 'General info', value: 'general_info' },
  { label: 'Activity', value: 'activity' },
]

export default function AdminVerificationSlider({ data }) {
  const { popSlider, getList } = useReportEnquiry()
  const [isLetterModalOpen, setIsLetterModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('verification')
  const [tabData, setTabData] = useState({})
  const [loadingTabs, setLoadingTabs] = useState({})

  const enquiryId = data?._raw?.id || data?.id

  const fetchTab = useCallback(
    (type) => {
      if (!enquiryId) return
      setLoadingTabs((prev) => ({ ...prev, [type]: true }))
      Service.show(enquiryId, { type })
        .then((res) => {
          setTabData((prev) => ({ ...prev, [type]: res.data }))
        })
        .catch(myToaster)
        .finally(() => {
          setLoadingTabs((prev) => ({ ...prev, [type]: false }))
        })
    },
    [enquiryId]
  )

  useEffect(() => {
    fetchTab('verification')
    fetchTab('general_info')
  }, [fetchTab])

  const handleTabChange = (next) => {
    setActiveTab(next)
    fetchTab(next)
  }

  const identityData = tabData.verification
  const generalInfo = tabData.general_info?.general_information
  const activities = tabData.activity?.activity || []

  const headerSource =
    identityData || tabData.general_info || tabData.activity || {}
  const referenceNumber = headerSource.reference_number || data?.order || '-'
  const createdAt = formatDate(headerSource.created_at)
  const statusLabel =
    STATUS_DISPLAY[headerSource.status] || headerSource.status || 'Verification'

  const identity = identityData?.verification?.identity || {}
  const whatsappNumber = identityData?.verification?.whatsapp?.number || '-'

  const target = generalInfo?.target || {}
  const employmentLevel = generalInfo?.employment_level || {}
  const company = generalInfo?.company || {}

  const identityFields = {
    nik: identity.nik || '-',
    fullName: identity.full_name || '-',
    dob: formatDate(identity.date_of_birth),
    gender:
      identity.gender === 'male'
        ? 'Male'
        : identity.gender === 'female'
          ? 'Female'
          : identity.gender || '-',
    city: identity.city || '-',
    district: identity.district || '-',
    subdistrict: identity.subdistrict || '-',
    postalCode: identity.postal_code || '-',
    address: identity.street_address || identity.address || '-',
  }

  const generalFields = {
    targetName: target.full_name || '-',
    targetCode: target.code || '-',
    targetPosition: target.position?.name || '',
    category: CATEGORY_DISPLAY[generalInfo?.category] || generalInfo?.category || '-',
    level: employmentLevel.name || '-',
    whatsapp: target.phone || whatsappNumber || '-',
    email: generalInfo?.email || '-',
    entity: company.name || '-',
    consentExpiry: formatDate(generalInfo?.consent_expiry),
    repeatEvery:
      REPEAT_DISPLAY[generalInfo?.repeat_every] || generalInfo?.repeat_every || '-',
  }

  const handleClose = () => popSlider()

  const ocrOpen = !!identityData
  const ocrData = {
    portrait: identityData?.selfie_photo_url,
    ktp: identityData?.ktp_photo_url,
    score: parseInt(identityData?.face_match_score) || 0,
  }

  const tabLoading = !!loadingTabs[activeTab]
  const hasTabData = !!tabData[activeTab]

  return (
    <div className="relative flex h-screen w-[420px] flex-col bg-white shadow-xl">
      <VerificationOCRModal
        open={ocrOpen}
        data={ocrData}
        enquiryId={enquiryId}
        onActionComplete={() => {
          getList()
          popSlider()
        }}
      />

      {/* Header */}
      <header className="relative flex items-start gap-x-4 border-b border-gray-100 px-6 pb-4 pt-6">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-[12px] top-[12px] flex h-10 w-10 items-center justify-center rounded-lg border-none p-2 text-gray-400 shadow-none outline-none hover:bg-gray-50 active:bg-gray-100"
        >
          <XClose size={24} stroke="currentColor" />
        </button>

        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold text-gray-900">{referenceNumber}</h2>
            <p className="text-sm text-gray-500">{createdAt}</p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="w-max">
              <MySLAStatusChip status={statusLabel} />
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

            <MyHorizontalTabV2
              value={activeTab}
              onChange={handleTabChange}
              tabs={TABS}
            />
          </div>
        </div>
      </header>

      {/* Scrollable body */}
      <section className="flex-1 overflow-hidden bg-gray-50/30">
        <SimpleBar forceVisible="y" style={{ maxHeight: '100%' }}>
          <div className="flex flex-col gap-6 px-6 py-6">
            {tabLoading && !hasTabData && (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-gray-500">Loading...</p>
              </div>
            )}

            {activeTab === 'verification' && hasTabData && (
              <>
                <MyDoubleCard heading="Identity" innerClassName="p-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="text-sm font-medium text-gray-700">NIK</div>
                      <MyTextField readOnly value={identityFields.nik} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="text-sm font-medium text-gray-700">Full Name</div>
                      <MyTextField readOnly value={identityFields.fullName} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="text-sm font-medium text-gray-700">
                        Date of Birth
                      </div>
                      <MyTextField readOnly value={identityFields.dob} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="text-sm font-medium text-gray-700">Gender</div>
                      <MyTextField readOnly value={identityFields.gender} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="text-sm font-medium text-gray-700">City</div>
                        <MyTextField readOnly value={identityFields.city} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <div className="text-sm font-medium text-gray-700">District</div>
                        <MyTextField readOnly value={identityFields.district} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="text-sm font-medium text-gray-700">
                          Subdistrict
                        </div>
                        <MyTextField readOnly value={identityFields.subdistrict} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <div className="text-sm font-medium text-gray-700">
                          Postal Code
                        </div>
                        <MyTextField readOnly value={identityFields.postalCode} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="text-sm font-medium text-gray-700">
                        Address (as stated on ID)
                      </div>
                      <MyTextArea readOnly value={identityFields.address} />
                    </div>
                  </div>
                </MyDoubleCard>

                <MyDoubleCard heading="WhatsApp" innerClassName="p-0">
                  <div className="flex items-center gap-2 p-4 px-5">
                    <WhatsApp className="size-4 text-green-500" />
                    <span className="text-sm font-semibold text-gray-900">
                      {whatsappNumber}
                    </span>
                  </div>
                </MyDoubleCard>
              </>
            )}

            {activeTab === 'general_info' && hasTabData && (
              <MyDoubleCard heading="General Information" innerClassName="p-0">
                <div className="divide-y divide-gray-100">
                  <div className="flex items-start justify-between gap-3 p-4 px-5">
                    <span className="text-sm text-gray-500">Target</span>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-semibold text-gray-900">
                        {generalFields.targetName}
                        {generalFields.targetCode !== '-' && (
                          <span className="text-gray-500"> / {generalFields.targetCode}</span>
                        )}
                      </span>
                      {generalFields.targetPosition && (
                        <span className="text-xs text-gray-500">
                          {generalFields.targetPosition}
                        </span>
                      )}
                    </div>
                  </div>
                  {[
                    ['Category', generalFields.category],
                    ['Level', generalFields.level],
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
                      <span className="text-sm font-semibold text-gray-900">
                        {generalFields.whatsapp}
                      </span>
                    </div>
                  </div>
                  {[
                    ['Email address', generalFields.email],
                    ['Entity', generalFields.entity],
                    ['Consent expiry', generalFields.consentExpiry],
                    ['Repeat every', generalFields.repeatEvery],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between p-4 px-5">
                      <span className="text-sm text-gray-500">{label}</span>
                      <span className="text-sm font-semibold text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </MyDoubleCard>
            )}

            {activeTab === 'activity' && hasTabData && (
              <MyDoubleCard heading="Activity" innerClassName="p-4">
                <div className="flex flex-col gap-0 antialiased">
                  {activities.map((act, idx) => (
                    <div
                      key={act.id}
                      className={`relative flex gap-4 ${idx < activities.length - 1 ? 'pb-8' : ''
                        }`}
                    >
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
                            {formatEventLabel(act.event_type)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(act.occurred_at)}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed text-gray-500">
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
            )}
          </div>
        </SimpleBar>
      </section>

      <JobApplicationLetterModal
        open={isLetterModalOpen}
        onClose={() => setIsLetterModalOpen(false)}
        zIndex={4000}
        data={{
          companyName: company.name,
          fullName: identity.full_name || target.full_name,
          birthPlace: identity.birth_place || identity.city,
          dateOfBirth: identity.date_of_birth,
          email: generalInfo?.email,
        }}
      />
    </div>
  )
}
