import { MyCardFile, MyChip, MyDetailView } from '@interstellar-component'
import SimpleBar from 'simplebar-react'

/** Backend field names (list response / detail) shown as labels in detail view. */
const COMPANY_FIELD_KEYS = [
  'id',
  'name',
  'legal_name',
  'logo_url',
  'province',
  'city',
  'district',
  'subdistrict',
  'postal_code',
  'company_address',
  'npwp',
  'nib',
  'date_of_establishment',
  'business_category',
  'industry',
  'number_of_employees',
  'company_website',
  'email',
  'enrollment_status',
  'enrollment_step',
  'verification_status',
  'agreement_signed_at',
  'agreement_signed_by',
  'created_by',
  'updated_by',
  'created_at',
  'updated_at',
  'deleted_at',
]

function formatValue(value) {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

function buildCompanyDatas(detail) {
  if (!detail || typeof detail !== 'object') return {}
  const datas = {}
  COMPANY_FIELD_KEYS.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(detail, key)) {
      datas[key] = formatValue(detail[key])
    }
  })
  if (Array.isArray(detail.user_companies)) {
    datas.user_companies = JSON.stringify(detail.user_companies)
  }
  return datas
}

export default function Information({ data: detail, loading }) {
  const companyDatas = buildCompanyDatas(detail)

  const representative = detail?.authorized_representative
  const attachments = Array.isArray(detail?.attachments) ? detail.attachments : []

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-12 text-sm text-gray-light/600">
        Loading…
        
      </div>
    )
  }

  return (
    <SimpleBar forceVisible="y" style={{ height: '100%' }}>
      <div className="flex flex-1 flex-col gap-8 pb-8 pt-4">
        <div className="flex flex-col gap-6">
          <div className="flex flex-1 flex-col gap-y-6 px-4 text-gray-600">
            <MyDetailView
              header="company"
              datas={companyDatas}
              func={{
                industry: (value) => (
                  <MyChip
                    label={value}
                    rounded="lg"
                    color="modern"
                    variant="outlined"
                    size="sm"
                  />
                ),
                business_category: (value) => (
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
          </div>

          {representative && typeof representative === 'object' ? (
            <div className="flex flex-col gap-6">
              <div className="flex flex-1 flex-col gap-y-6 px-4 text-gray/600">
                <MyDetailView
                  header="authorized_representative"
                  datas={representative}
                />
              </div>
            </div>
          ) : null}

          {attachments.length > 0 ? (
            <div className="mt-0.5 rounded-xl bg-gray/25 shadow-sm outline outline-1 outline-gray-200">
              <label
                className="text-sm-semibold block px-4 pb-2 pt-3 text-gray-900"
                htmlFor="company-attachments"
              >
                attachments
              </label>
              <div className="flex flex-col gap-4 rounded-xl bg-white px-4 py-5 outline outline-1 outline-gray-200">
                <div className="flex flex-col gap-1.5" id="company-attachments">
                  {attachments.map((value, index) => (
                    <MyCardFile
                      key={value.id ?? index}
                      onClickDownload
                      file={value}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </SimpleBar>
  )
}
