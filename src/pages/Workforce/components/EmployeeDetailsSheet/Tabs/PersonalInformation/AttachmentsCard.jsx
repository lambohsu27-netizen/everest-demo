import React from 'react'
import { File01, File02, Image01 } from '@untitled-ui/icons-react'

/**
 * @param {object} props
 * @param {object} props.employee
 */

const getIcon = (type) => {
  switch (type.toUpperCase()) {
    case 'PDF':
      return <File02 className="h-4 w-4 text-red-600" />
    case 'JPG':
    case 'PNG':
      return <Image01 className="h-4 w-4 text-blue-600" />
    case 'GIF':
      return <File01 className="h-4 w-4 text-purple-600" />
    default:
      return <File01 className="h-4 w-4 text-gray-600" />
  }
}

const getPillColor = (type) => {
  switch (type.toUpperCase()) {
    case 'PDF':
      return 'bg-red-50 text-red-700'
    case 'JPG':
    case 'PNG':
      return 'bg-blue-50 text-blue-700'
    case 'GIF':
      return 'bg-purple-50 text-purple-700'
    default:
      return 'bg-gray-50 text-gray-700'
  }
}

// DEMO DATA — backoffice-service/modules/workforce/workforce.repositories.js:147
// TODO: wire kyc_documents. The personal_information endpoint always returns
// `attachments: []` today; we keep the original 11-row mock so the card has
// something to render in demos.
const DEMO_ATTACHMENTS = [
  { type: 'PDF', name: 'Credit report PDF.pdf', date: '12 Feb 2026' },
  { type: 'PDF', name: 'Credit report PDF.pdf', date: '12 Feb 2026' },
  { type: 'PDF', name: 'Consent.pdf', date: '12 Feb 2026' },
  { type: 'JPG', name: 'KTP.jpg', date: '12 Jan 2026' },
  { type: 'GIF', name: 'Liveness.gif', date: '12 Feb 2026' },
  { type: 'PDF', name: 'Surat keterangan kerja.pdf', date: '12 Feb 2026' },
  { type: 'PDF', name: 'Credit report PDF.pdf', date: '12 Jan 2026' },
  { type: 'PDF', name: 'Consent.pdf', date: '12 Jan 2026' },
  { type: 'JPG', name: 'KTP.jpg', date: '12 Jan 2026' },
  { type: 'GIF', name: 'Liveness.gif', date: '12 Jan 2026' },
  { type: 'PDF', name: 'Surat lamaran kerja.pdf', date: '12 Jan 2026' },
]

function deriveType(att) {
  // Real records ship mime_type and file_name; the demo rows ship `type`.
  if (att.type) return String(att.type).toUpperCase()
  if (att.mime_type) {
    if (att.mime_type.includes('pdf')) return 'PDF'
    if (att.mime_type.includes('jpeg') || att.mime_type.includes('jpg')) return 'JPG'
    if (att.mime_type.includes('png')) return 'PNG'
    if (att.mime_type.includes('gif')) return 'GIF'
  }
  if (att.file_name) {
    const ext = att.file_name.split('.').pop()
    if (ext) return ext.toUpperCase()
  }
  return 'FILE'
}

function deriveName(att) {
  return att.name ?? att.file_name ?? '—'
}

function deriveDate(att) {
  if (att.date) return att.date
  const v = att.uploaded_at ?? att.created_at
  if (!v) return ''
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return String(v)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function AttachmentsCard({ personalDetail }) {
  const apiList = personalDetail?.attachments ?? []
  const attachments = apiList.length ? apiList : DEMO_ATTACHMENTS

  return (
    <div className="flex flex-col gap-[2px] rounded-xl border border-gray-200 bg-[#fdfdfd] shadow-sm overflow-hidden">
      {/* Heading wrapper */}
      <div className="flex items-center justify-between pl-5 pr-5 pt-3 pb-2">
        <h3 className="text-sm font-semibold text-[#181d27]">Attachments</h3>
      </div>

      {/* Table Container */}
      <div className="bg-white mx-[1px] mb-[1px] rounded-[12px] border border-[#e9eaeb] overflow-hidden shadow-sm">
        {attachments.map((item, index) => {
          const type = deriveType(item)
          return (
            <div
              key={index}
              className={`flex items-center justify-between px-4 py-3 ${
                index !== attachments.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getPillColor(type)}`}>
                  {getIcon(type)}
                </div>
                <span className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                  {deriveName(item)}
                </span>
              </div>
              <span className="text-sm text-gray-500 font-medium">
                {deriveDate(item)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

