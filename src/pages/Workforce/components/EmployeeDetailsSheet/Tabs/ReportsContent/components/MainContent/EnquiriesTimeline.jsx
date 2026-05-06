import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkforce } from '../../../../../../Context'

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

const STATUS_TONE = {
  completed: 'bg-success-50 text-success-700 border-success-200',
  sent_to_clik: 'bg-blue-50 text-blue-700 border-blue-200',
  verification: 'bg-warning-50 text-warning-700 border-warning-200',
  awaiting_admin: 'bg-warning-50 text-warning-700 border-warning-200',
  awaiting_form: 'bg-gray-100 text-gray-700 border-gray-200',
  awaiting_consent: 'bg-gray-100 text-gray-700 border-gray-200',
  form_revision: 'bg-orange-50 text-orange-700 border-orange-200',
  failed: 'bg-error-50 text-error-700 border-error-200',
  canceled: 'bg-gray-50 text-gray-500 border-gray-200',
}

const formatDate = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function EnquiriesTimeline() {
  const { workforceDetailReport } = useWorkforce()
  const navigate = useNavigate()

  const enquiries = useMemo(() => {
    const list = workforceDetailReport?.linked_enquiries
    if (!Array.isArray(list)) return []
    return list
      .slice()
      .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
  }, [workforceDetailReport?.linked_enquiries])

  if (!enquiries.length) return null

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Linked Enquiries</h3>
          <p className="mt-0.5 text-xs text-gray-500">
            Background check requests that reference this employee.
          </p>
        </div>
        <span className="rounded-full border border-gray-blue/200 bg-gray-blue/50 px-2 py-0.5 text-xs font-medium text-gray-blue/700">
          {enquiries.length} item{enquiries.length === 1 ? '' : 's'}
        </span>
      </header>
      <ul className="divide-y divide-gray-100">
        {enquiries.map((enq) => {
          const tone = STATUS_TONE[enq.status] ?? 'bg-gray-50 text-gray-600 border-gray-200'
          return (
            <li
              key={enq.id}
              className="flex flex-col gap-2 px-5 py-3 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => navigate('/report-enquiry', { state: { focus: enq.id } })}
                  className="text-left text-sm font-semibold text-brand/700 hover:text-brand/600"
                >
                  {enq.reference_number}
                </button>
                <span className="text-xs text-gray-500">
                  Requested by {enq.requester?.name ?? '—'} · {formatDate(enq.created_at)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {enq.completed_at ? (
                  <span className="text-xs text-gray-500">
                    Completed {formatDate(enq.completed_at)}
                  </span>
                ) : enq.submitted_at ? (
                  <span className="text-xs text-gray-500">
                    Submitted {formatDate(enq.submitted_at)}
                  </span>
                ) : null}
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${tone}`}
                >
                  {STATUS_DISPLAY[enq.status] ?? enq.status}
                </span>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
