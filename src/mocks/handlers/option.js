import {
  ROLES,
  USER_STATUSES,
  COMPANY_OPTIONS,
  USER_OPTIONS,
  BUSINESS_CATEGORIES,
  INDUSTRIES,
  EMPLOYEE_RANGES,
  REJECTION_REASONS,
  PROVINCES,
  CITIES,
  DISTRICTS,
  SUBDISTRICTS,
  POSTAL_CODES,
} from '../fixtures/options'
import { EMPLOYMENT_LEVELS, EMPLOYMENT_POSITIONS } from '../fixtures/settings'
import { ok } from '../utils'

const filterByQuery = (rows, params, key) => {
  if (!params || !params[key]) return rows
  return rows.filter((r) => String(r[key]) === String(params[key]))
}

export const optionHandlers = {
  'GET /v1/option/role-list': () => ok(ROLES),
  'GET /v1/option/active-status-list': () => ok(USER_STATUSES),
  'GET /v1/option/user-status-list': () => ok(USER_STATUSES),
  'GET /v1/option/company-list': () => ok(COMPANY_OPTIONS),
  'GET /v1/option/my-company-list': () => ok(COMPANY_OPTIONS),
  'GET /v1/option/user-list': () => ok(USER_OPTIONS),
  'GET /v1/option/business-category-list': () => ok(BUSINESS_CATEGORIES),
  'GET /v1/option/industry-list': () => ok(INDUSTRIES),
  'GET /v1/option/employee-range-list': () => ok(EMPLOYEE_RANGES),
  'GET /v1/option/rejection-reason-list': () => ok(REJECTION_REASONS),
  'GET /v1/option/level-list': () =>
    ok(EMPLOYMENT_LEVELS.map((l) => ({ id: l.id, name: l.name }))),
  'GET /v1/option/position-list': ({ params }) => {
    const levelId = params?.level_id
    const list = levelId
      ? EMPLOYMENT_POSITIONS.filter((p) => p.level_id === levelId)
      : EMPLOYMENT_POSITIONS
    return ok(list.map((p) => ({ id: p.id, name: p.name, level_id: p.level_id })))
  },
  'GET /v1/option/province-list': () => ok(PROVINCES),
  'GET /v1/option/city-list': ({ params }) => ok(filterByQuery(CITIES, params, 'province_id')),
  'GET /v1/option/district-list': ({ params }) => ok(filterByQuery(DISTRICTS, params, 'city_id')),
  'GET /v1/option/subdistrict-list': ({ params }) =>
    ok(filterByQuery(SUBDISTRICTS, params, 'district_id')),
  'GET /v1/option/postal-code-list': ({ params }) =>
    ok(filterByQuery(POSTAL_CODES, params, 'subdistrict_id')),
  'GET /v1/option/eauth-list': () => ok([]),
  'GET /v1/option/institution-list': () => ok([]),
  'GET /v1/option/branch-list': () => ok([]),
}
