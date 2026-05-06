import { COMPANIES, findCompany } from '../fixtures/companies'
import { matchesSearch, ok, okList, paginate } from '../utils'

export const companyHandlers = {
  'GET /v1/company': ({ params }) => {
    const page = Number(params?.page || 1)
    const limit = Number(params?.limit || 10)
    const search = params?.search
    const filtered = COMPANIES.filter((c) => matchesSearch(c, search))
    return okList(paginate(filtered, page, limit), page, limit, filtered.length)
  },
  'GET /v1/company/:id': ({ pathParams }) =>
    ok(findCompany(pathParams.id) ?? COMPANIES[0]),
  'POST /v1/company': () => ok(COMPANIES[0], { message: 'Company created.' }),
  'PUT /v1/company/:id': ({ pathParams }) =>
    ok(findCompany(pathParams.id) ?? COMPANIES[0], { message: 'Company updated.' }),
  'DELETE /v1/company': () => ok(null, { message: 'Company deleted.' }),

  'GET /v1/company/:id/enrollment': ({ pathParams }) =>
    ok({
      ...(findCompany(pathParams.id) ?? COMPANIES[0]),
      enrollment_step: 4,
      docusign_status: 'completed',
      docusign_envelope_id: 'demo-envelope-123',
    }),
  'PATCH /v1/company/:id/enroll-step-2': () => ok(null, { message: 'Step 2 saved.' }),
  'PATCH /v1/company/:id/enroll-step-3': () => ok(null, { message: 'Step 3 saved.' }),
  'PATCH /v1/company/:id/enroll-step-4': () =>
    ok({ docusign_url: null, status: 'completed' }, { message: 'Enrollment completed.' }),
  'GET /v1/company/:id/signing-status': () => ok({ status: 'completed' }),
  'POST /v1/company/:id/refresh-signing-url': () => ok({ docusign_url: null }),
  'PATCH /v1/company/:id/signing/enroll-step-4': () => ok(null, { message: 'Signed.' }),
  'GET /v1/company/:id/signing/status': () => ok({ status: 'completed' }),
  'POST /v1/company/:id/signing/refresh-url': () => ok({ docusign_url: null }),
}
