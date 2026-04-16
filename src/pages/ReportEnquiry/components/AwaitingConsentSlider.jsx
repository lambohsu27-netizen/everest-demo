import React, { useCallback, useEffect, useState } from 'react'
import SimpleBar from 'simplebar-react'
import { XClose, Trash01, Send01 } from '@untitled-ui/icons-react'
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
import Service from '../service'

const STATUS_DISPLAY = {
  awaiting_form: 'Awaiting Form',
  awaiting_admin: 'Awaiting Admin Approval',
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

export default function AwaitingConsentSlider({ data }) {
  const { popSlider, getList } = useReportEnquiry()
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
    status: STATUS_DISPLAY[d.status] || d.status || 'Awaiting Form',
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
    <div className="flex h-screen w-[420px] flex-col bg-white shadow-xl">
      {/* Header */}
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
            <MySLAStatusChip status={displayData.status} />
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
                {/* General Information Card */}
                <MyDoubleCard heading="General Information" innerClassName="p-0">
                  <div className="divide-y divide-gray-100">
                    {/* Target */}
                    <div className="flex items-center justify-between p-4">
                      <span className="text-sm text-gray-500">Target</span>
                      <div className="flex items-center gap-3 text-right">
                        <MyAvatar name={displayData.name} size={40} />
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

                    {[
                      ['Category', displayData.category],
                      ['Level', displayData.level],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between p-4">
                        <span className="text-sm text-gray-500">{label}</span>
                        <span className="text-sm font-semibold text-gray-900">{value}</span>
                      </div>
                    ))}

                    <div className="flex items-center justify-between p-4">
                      <span className="text-sm text-gray-500">WhatsApp</span>
                      <div className="flex items-center gap-2">
                        <WhatsApp className="size-4 text-green-500" />
                        <span className="text-sm font-semibold text-gray-900">
                          {displayData.whatsapp}
                        </span>
                      </div>
                    </div>

                    {[
                      ['Email address', displayData.email],
                      ['Entity', displayData.entity],
                      ['Consent expiry', displayData.consentExpiry],
                      ['Repeat every', displayData.repeatEvery],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between p-4">
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
    </div>
  )
}
