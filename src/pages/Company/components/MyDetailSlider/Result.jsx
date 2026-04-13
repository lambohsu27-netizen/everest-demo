import React, { useMemo } from 'react'
import moment from 'moment'
import { MyAvatar, MyButton, MyTextField } from '@interstellar-component'
import SimpleBar from 'simplebar-react'
import { Key01, Passcode, Save01, User01 } from '@untitled-ui/icons-react'

function formatActivityTimestamp(iso) {
  if (!iso) return '—'
  return moment(iso).format('h:mma D MMM YYYY')
}

export default function Result({ loading, data }) {
  const credentials = useMemo(() => {
    const g = data?.general_information
    if (!g || typeof g !== 'object') {
      return { username: '', password: '', apiKey: '' }
    }
    const s = (v) => (v == null ? '' : String(v))
    return {
      username: s(g.clik_username),
      password: s(g.clik_password),
      apiKey: s(g.clik_api_key),
    }
  }, [data?.general_information])

  const activities = useMemo(() => {
    const raw = data?.activity
    if (!Array.isArray(raw)) return []
    return [...raw].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  }, [data?.activity])

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
        <div className="flex flex-1 flex-col gap-y-6 px-4">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 bg-gray-50 px-5 py-3">
              <h2 className="text-sm-semibold text-gray-900">General Information</h2>
            </div>
            <div className="flex flex-col gap-4 px-5 py-4">
              <div>
                <h3 className="text-sm-medium text-gray-800">Credentials</h3>
                <p className="mt-1 text-xs-regular leading-relaxed text-gray-600">
                  Used to authenticate and authorize API requests from system.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm-medium text-gray-700" htmlFor="company-result-username">
                    Username
                  </label>
                  <MyTextField
                    id="company-result-username"
                    name="username"
                    value={credentials.username}
                    placeholder="e.g. 3h3nnrf8inni871bb31884h12"
                    margin="7px 12px"
                    startAdornment={
                      <User01 className="size-[18px] text-gray-400" stroke="currentColor" />
                    }
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm-medium text-gray-700" htmlFor="company-result-password">
                    Password
                  </label>
                  <MyTextField
                    id="company-result-password"
                    name="password"
                    type="password"
                    value={credentials.password}
                    placeholder="e.g. 3h3nnrf8inni871bb31884h12"
                    margin="7px 12px"
                    startAdornment={
                      <Passcode className="size-[18px] text-gray-400" stroke="currentColor" />
                    }
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm-medium text-gray-700" htmlFor="company-result-api-key">
                    API key
                  </label>
                  <MyTextField
                    id="company-result-api-key"
                    name="api_key"
                    value={credentials.apiKey}
                    placeholder="e.g. 3h3nnrf8inni871bb31884h12"
                    margin="7px 12px"
                    startAdornment={
                      <Key01 className="size-[18px] text-gray-400" stroke="currentColor" />
                    }
                  />
                </div>
              </div>

              <hr className="border-gray-200" />
              <div className="flex justify-end gap-3 pt-1">
                <MyButton color="secondary" variant="outlined" size="sm" type="button">
                  <p className="text-sm-semibold">Reset</p>
                </MyButton>
                <MyButton color="primary" variant="outlined" size="sm" type="button">
                  <Save01 className="size-4" stroke="currentColor" aria-hidden />
                  <p className="text-sm-semibold">Validate</p>
                </MyButton>
              </div>
            </div>
          </div>

          <div className="mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
              <h2 className="text-sm-semibold text-gray-900">Activity</h2>
            </div>
            <div className="px-4 py-5">
              {activities.length === 0 ? (
                <p className="text-sm-regular text-gray-500">No activity yet.</p>
              ) : (
                <div className="relative">
                  <div
                    className="absolute bottom-4 left-5 top-5 w-px bg-gray-200"
                    aria-hidden
                  />
                  <ul className="relative flex flex-col gap-6">
                    {activities.map((act) => (
                      <li key={act.id} className="relative flex gap-3">
                        <div className="relative z-[1] shrink-0 rounded-full bg-white p-0.5 ring-2 ring-white">
                          <MyAvatar
                            photo={act.user?.avatar_url ?? null}
                            size={40}
                          />
                        </div>
                        <div className="min-w-0 flex-1 pt-0.5">
                          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                            <span className="text-sm-medium text-gray-800">
                              {act.user?.name ?? '—'}
                            </span>
                            <time
                              className="text-sm-regular text-gray-500"
                              dateTime={act.created_at}
                            >
                              {formatActivityTimestamp(act.created_at)}
                            </time>
                          </div>
                          <p className="mt-1 text-sm-regular text-gray-600">
                            {act.action ?? '—'}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SimpleBar>
  )
}
