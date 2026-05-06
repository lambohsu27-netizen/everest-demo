import { delay } from './delay'
import { MockError } from './utils'
import { authHandlers } from './handlers/auth'
import { optionHandlers } from './handlers/option'
import { settingHandlers } from './handlers/setting'
import { companyHandlers } from './handlers/company'
import { workforceHandlers } from './handlers/workforce'
import { reportEnquiryHandlers } from './handlers/report-enquiry'
import { inquiryHandlers } from './handlers/inquiry'

const ALL_HANDLERS = {
  ...authHandlers,
  ...optionHandlers,
  ...settingHandlers,
  ...companyHandlers,
  ...workforceHandlers,
  ...reportEnquiryHandlers,
  ...inquiryHandlers,
}

const compiled = Object.entries(ALL_HANDLERS).map(([key, handler]) => {
  const [method, pattern] = key.split(' ', 2)
  const paramNames = []
  const regexSource = pattern.replace(/:([a-zA-Z_]+)/g, (_, name) => {
    paramNames.push(name)
    return '([^/]+)'
  })
  return {
    method: method.toUpperCase(),
    regex: new RegExp(`^${regexSource}$`),
    paramNames,
    handler,
    pattern,
  }
})

const stripBaseUrl = (endpoint) => {
  if (!endpoint) return ''
  let path = endpoint
  try {
    if (/^https?:/i.test(path)) path = new URL(path).pathname
  } catch {
    /* noop */
  }
  path = path.replace(/^\/?backoffice/, '')
  if (!path.startsWith('/')) path = `/${path}`
  return path.split('?')[0]
}

const matchRoute = (method, endpoint) => {
  const path = stripBaseUrl(endpoint)
  for (const route of compiled) {
    if (route.method !== method.toUpperCase()) continue
    const m = path.match(route.regex)
    if (m) {
      const pathParams = {}
      route.paramNames.forEach((name, i) => {
        pathParams[name] = decodeURIComponent(m[i + 1])
      })
      return { route, pathParams, path }
    }
  }
  return null
}

export const mockDispatch = async (method, endpoint, body, params) => {
  await delay()
  const matched = matchRoute(method, endpoint)
  if (!matched) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn(`[mocks] no handler for ${method} ${endpoint}`)
    }
    throw new MockError(404, {
      status: 'error',
      message: `Mock endpoint not found: ${method} ${stripBaseUrl(endpoint)}`,
    })
  }
  try {
    const result = await matched.route.handler({
      method,
      path: matched.path,
      pathParams: matched.pathParams,
      params: params ?? {},
      body: body ?? {},
    })
    return result
  } catch (err) {
    if (err instanceof MockError) throw err
    throw new MockError(500, {
      status: 'error',
      message: err?.message || 'Mock handler error',
    })
  }
}
