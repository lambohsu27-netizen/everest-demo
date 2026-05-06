import { ENQUIRIES } from '../fixtures/enquiries'
import { ok, okList, paginate, matchesSearch } from '../utils'

export const inquiryHandlers = {
  'GET /v1/inquiry': ({ params }) => {
    const page = Number(params?.page || 1)
    const limit = Number(params?.limit || 10)
    const search = params?.search
    let filtered = ENQUIRIES.slice()
    if (search) filtered = filtered.filter((e) => matchesSearch({ ...e, name: e.workforce?.full_name }, search))
    return okList(paginate(filtered, page, limit), page, limit, filtered.length)
  },
  'GET /v1/inquiry/:id': ({ pathParams }) => {
    const e = ENQUIRIES.find((x) => x.id === pathParams.id) ?? ENQUIRIES[0]
    return ok(e)
  },
  'GET /v1/inquiry/:id/detail': ({ pathParams }) => {
    const e = ENQUIRIES.find((x) => x.id === pathParams.id) ?? ENQUIRIES[0]
    return ok(e)
  },
  'POST /v1/inquiry': () => ok(ENQUIRIES[0], { message: 'Inquiry created.' }),
  'POST /v1/inquiry/draft': () => ok(ENQUIRIES[0], { message: 'Draft saved.' }),
  'PATCH /v1/inquiry/:id': () => ok(ENQUIRIES[0], { message: 'Inquiry updated.' }),
  'PATCH /v1/inquiry/:id/enable': () => ok(null, { message: 'Inquiry enabled.' }),
  'DELETE /v1/inquiry': () => ok(null, { message: 'Inquiry deleted.' }),
  'PATCH /v1/inquiry/restore': () => ok(null, { message: 'Inquiry restored.' }),
  'POST /v1/inquiry/submit-draft': () => ok(null, { message: 'Drafts submitted.' }),
}
