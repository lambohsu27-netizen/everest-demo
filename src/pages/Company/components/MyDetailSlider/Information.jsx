import { MyCardFile, MyChip, MyDetailView } from '@interstellar-component'
import SimpleBar from 'simplebar-react'

function rowKey(label) {
  if (!label) return ''
  return label.charAt(0).toLowerCase() + label.slice(1)
}

function formatDisplayValue(value) {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'object') {
    if (value && typeof value.name === 'string') return value.name
    try {
      return JSON.stringify(value)
    } catch {
      return '—'
    }
  }
  return String(value)
}

function absoluteFileUrl(path) {
  if (!path || typeof path !== 'string') return ''
  if (/^https?:\/\//i.test(path)) return path
  const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? ''
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

function getCompanyInfo(detail) {
  const ci = detail?.company_information
  return ci && typeof ci === 'object' ? ci : {}
}

function getCompliance(detail) {
  const cd = detail?.compliance_documents
  return cd && typeof cd === 'object' ? cd : {}
}

const COMPLIANCE_DOC_KEYS = ['npwp_doc', 'nib_doc', 'akta_pendirian', 'akta_perubahan_terbaru']

function buildCompanyInformationSection(detail) {
  const ci = getCompanyInfo(detail)
  const cd = getCompliance(detail)

  const rows = [
    ['Company Legal Name', formatDisplayValue(ci.legal_name)],
    ['Business / Brand Name', formatDisplayValue(ci.name)],
    ['Business Category', formatDisplayValue(ci.business_category)],
    ['Industry', formatDisplayValue(ci.industry)],
    ['Number of Employees', formatDisplayValue(ci.number_of_employees)],
    ['Company Website', formatDisplayValue(ci.company_website)],
    ['Company Email', formatDisplayValue(ci.email)],
    ['Company Address', formatDisplayValue(ci.company_address)],
    ['NPWP Number', formatDisplayValue(cd.npwp)],
    ['NIB Number', formatDisplayValue(cd.nib)],
    ['Date of Establishment', formatDisplayValue(cd.date_of_establishment)],
  ]

  return rows.reduce((acc, [label, value]) => {
    acc[rowKey(label)] = value
    return acc
  }, {})
}

function buildAuthorizedRepresentativeSection(rep) {
  const r = rep && typeof rep === 'object' ? rep : {}
  const pick = (...keys) => {
    const hit = keys.find((k) => {
      const v = r[k]
      return v != null && v !== ''
    })
    return hit != null ? formatDisplayValue(r[hit]) : '—'
  }

  const rows = [
    ['Full Name', pick('name', 'full_name', 'rep_name')],
    ['Job Title', pick('job_title', 'position', 'rep_position')],
    ['Email Address', pick('email_address', 'email', 'rep_email')],
    ['Phone Number', pick('phone_number', 'phone', 'rep_phone')],
    ['ID Type', pick('id_type')],
    ['ID Number', pick('id_number')],
  ]

  return rows.reduce((acc, [label, value]) => {
    acc[rowKey(label)] = value
    return acc
  }, {})
}

function listComplianceDocuments(detail) {
  const cd = getCompliance(detail)
  return COMPLIANCE_DOC_KEYS.map((key) => {
    const doc = cd[key]
    if (!doc || typeof doc !== 'object' || !doc.file_path) return null
    return {
      key,
      file_name: doc.file_name ?? doc.title ?? key,
      file_path: doc.file_path,
      file_size: doc.file_size,
      mime_type: doc.mime_type,
      status: doc.status,
    }
  }).filter(Boolean)
}

export default function Information({ data: detail, loading }) {
  const companyDatas = buildCompanyInformationSection(detail)
  const picDatas = buildAuthorizedRepresentativeSection(detail?.authorized_representative)
  const complianceFiles = listComplianceDocuments(detail)

  const industryKey = rowKey('Industry')
  const businessCategoryKey = rowKey('Business Category')

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-12 text-sm text-gray-light/600">
        Loading…
      </div>
    )
  }

  return (
    <SimpleBar forceVisible="y" style={{ height: '100%' }}>
      <div className="flex min-h-full flex-1 flex-col gap-6 bg-gray-50 pb-8 pt-4">
        <div className="flex flex-col gap-6 px-4">
          <MyDetailView
            header="Company Information"
            datas={companyDatas}
            func={{
              [industryKey]: (value) =>
                value === '—' ? (
                  '—'
                ) : (
                  <MyChip
                    label={value}
                    rounded="lg"
                    color="modern"
                    variant="outlined"
                    size="sm"
                  />
                ),
              [businessCategoryKey]: (value) =>
                value === '—' ? (
                  '—'
                ) : (
                  <MyChip
                    label={value}
                    rounded="lg"
                    color="modern"
                    variant="outlined"
                    size="sm"
                  />
                ),
            }}
          />

          <MyDetailView
            header="Authorized Representative (PIC)"
            datas={picDatas}
          />

          {complianceFiles.length > 0 ? (
            <div className="rounded-xl bg-gray-50 shadow-sm outline outline-1 outline-gray-200">
              <label
                className="text-sm-semibold block border-b border-gray-200 px-5 py-3 text-gray-900"
                htmlFor="company-compliance-docs"
              >
                Attachments
              </label>
              <div className="flex flex-col gap-3 px-4 py-4" id="company-compliance-docs">
                {complianceFiles.map((doc) => {
                  const href = absoluteFileUrl(doc.file_path)
                  const file = {
                    name: doc.file_name,
                    size: Number(doc.file_size) || 0,
                    type: doc.mime_type || '',
                  }
                  return (
                    <MyCardFile
                      key={doc.key}
                      file={file}
                      downloadHref={href}
                      showImage={false}
                    />
                  )
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </SimpleBar>
  )
}
