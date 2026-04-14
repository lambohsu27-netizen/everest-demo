import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { SearchMd, XClose } from '@untitled-ui/icons-react'
import { MyButton, MyTextField } from '@interstellar-component'
import { useSettings } from '../../Context'

export default function RoleForm({ mode }) {
  const {
    allPermissions,
    roleDetail,
    closeRolePanel,
    openRoleDetail,
    activePanelRoleId,
    createRole,
    updateRole,
  } = useSettings()

  const isEdit = mode === 'edit'

  const [name, setName] = useState('')
  const [selected, setSelected] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [nameError, setNameError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (isEdit && roleDetail) {
      setName(roleDetail.name ?? '')
      const map = {}
      roleDetail.permissions?.forEach((perm) => {
        map[perm.module_key] = new Set(
          perm.sub_permissions?.map((s) => s.key ?? s) ?? []
        )
      })
      setSelected(map)
    }
  }, [isEdit, roleDetail])

  const toggleModule = (moduleKey) => {
    setSelected((prev) => {
      const current = prev[moduleKey] ?? new Set()
      const allPerms = allPermissions.find((m) => m.module_key === moduleKey)
      const subKeys = allPerms?.sub_permissions?.map((s) => s.key ?? s) ?? []
      const allChecked = subKeys.length > 0 && subKeys.every((k) => current.has(k))
      if (allChecked) {
        const next = { ...prev }
        delete next[moduleKey]
        return next
      }
      return { ...prev, [moduleKey]: new Set(subKeys) }
    })
  }

  const toggleSub = (moduleKey, subKey) => {
    setSelected((prev) => {
      const current = new Set(prev[moduleKey] ?? [])
      if (current.has(subKey)) current.delete(subKey)
      else current.add(subKey)
      return { ...prev, [moduleKey]: current }
    })
  }

  const isModuleEnabled = (moduleKey) => {
    const current = selected[moduleKey]
    return current && current.size > 0
  }

  const buildPayload = () => {
    const permissions = Object.entries(selected)
      .filter(([, subs]) => subs.size > 0)
      .map(([module_key, subs]) => ({
        module_key,
        sub_permissions: Array.from(subs),
      }))
    return { name: name.trim(), permissions }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setNameError('Role name is required.')
      return
    }
    setNameError('')
    setIsSubmitting(true)
    try {
      const payload = buildPayload()
      if (isEdit) {
        await updateRole(activePanelRoleId, payload)
      } else {
        await createRole(payload)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    if (isEdit) openRoleDetail(activePanelRoleId)
    else closeRolePanel()
  }

  const clearSearch = () => setSearchTerm('')

  const filteredPermissions = allPermissions.filter((module) => {
    if (!searchTerm) return true
    const lower = searchTerm.toLowerCase()
    const labelMatch = (module.label ?? module.module_key).toLowerCase().includes(lower)
    const descMatch = (module.description ?? '').toLowerCase().includes(lower)
    return labelMatch || descMatch
  })

  return (
    <div className="relative flex h-screen w-[750px] flex-col">
      {/* Close button */}
      <button
        type="button"
        onClick={closeRolePanel}
        className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-lg p-2 text-gray-light/400 hover:bg-gray-light/50"
      >
        <XClose size={24} stroke="currentColor" />
      </button>

      <form onSubmit={handleSubmit} className="flex h-full flex-col">
        {/* Two-column content */}
        <div className="flex flex-1 min-h-0">
          {/* ── Left: Access menu ── */}
          <div className="flex w-[375px] flex-col gap-8 border-r border-gray/200 pt-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-5 px-4">
                <div className="flex flex-col gap-4">
                  <h3 className="text-xl font-semibold leading-[30px] text-gray/900 font-inter">
                    Access menu
                  </h3>

                  <div className="flex items-center gap-2 rounded-lg border border-gray/200 bg-base-white px-3 py-2 shadow-shadows/shadow-xs focus-within:border-brand/500 focus-within:shadow-focus-rings/ring-brand-shadow-xs">
                    <SearchMd className="h-5 w-5 text-gray/500" />
                    <input
                      type="text"
                      className="flex-1 bg-transparent text-base font-medium leading-6 text-gray/900 placeholder-gray/500 outline-none font-inter"
                      placeholder="Search for feature"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="rounded-full bg-brand/900 px-2.5 py-0.5 text-xs font-medium text-base-white hover:bg-brand/700"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col overflow-hidden">
              <div className="px-4 pb-1">
                <span className="text-sm font-medium leading-5 text-gray/600 font-inter">
                  Results
                </span>
              </div>

              <div className="flex-1 overflow-y-auto">
                {allPermissions.length === 0 ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="h-6 w-6 animate-spin rounded-full border-4 border-brand/200 border-t-brand/900" />
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {filteredPermissions.map((module, idx) => {
                      const moduleKey = module.module_key
                      const subKeys = module.sub_permissions?.map((s) => s.key ?? s) ?? []
                      const currentSet = selected[moduleKey] ?? new Set()
                      const enabled = isModuleEnabled(moduleKey)

                      return (
                        <div key={moduleKey}>
                          {idx > 0 && <div className="h-px bg-gray/200" />}

                          <div className="px-6 py-4">
                            <div className="flex flex-col gap-3">
                              <div className="flex items-start gap-2">
                                <button
                                  type="button"
                                  onClick={() => toggleModule(moduleKey)}
                                  className={`relative mt-0.5 inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${enabled ? 'bg-brand/900' : 'bg-gray/200'}`}
                                >
                                  <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-base-white shadow-shadows/shadow-xs transition-transform duration-200 ${enabled ? 'translate-x-[17px]' : 'translate-x-[2px]'} mt-[2px]`}
                                  />
                                </button>

                                <div className="flex flex-col gap-0.5">
                                  <span className="text-sm font-medium leading-5 text-gray/700 font-inter">
                                    {module.label ?? moduleKey.replace(/_/g, ' ')}
                                  </span>
                                  {module.description && (
                                    <span className="text-sm font-normal leading-5 text-gray/600 font-inter">
                                      {module.description}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {subKeys.length > 0 && (
                                <div className="ml-11 flex flex-col gap-2">
                                  {module.sub_permissions?.map((sub) => {
                                    const subKey = sub.key ?? sub
                                    const subLabel = sub.label ?? subKey
                                    const checked = currentSet.has(subKey)
                                    return (
                                      <label key={subKey} className="flex cursor-pointer items-center gap-2">
                                        <span
                                          onClick={() => toggleSub(moduleKey, subKey)}
                                          className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border ${checked ? 'border-brand/900 bg-brand/900' : 'border-gray/300 bg-base-white'}`}
                                        >
                                          {checked && (
                                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                              <path d="M9 1L3.5 6.5L1 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                          )}
                                        </span>
                                        <span className="text-sm font-normal leading-5 text-gray/600 font-inter">
                                          {subLabel}
                                        </span>
                                      </label>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Right: Form ── */}
          <div className="flex w-[375px] flex-col">
            <div className="flex flex-1 flex-col gap-8 pt-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-5 px-4">
                  <div className="flex flex-col gap-0.5">
                    <h3 className="text-xl font-semibold leading-[30px] text-gray/900 font-inter">
                      {isEdit ? 'Edit role' : 'Add role'}
                    </h3>
                    <p className="text-base font-normal leading-6 text-gray/600 font-inter">
                      {isEdit
                        ? 'Please provide the details you would like to edit.'
                        : 'Please provide the details for a new role.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6 px-4">
                <div className="rounded-xl border border-gray/200 bg-gray/25 shadow-shadows/shadow-xs">
                  <div className="flex items-center gap-4 px-5 pb-2 pt-3">
                    <span className="text-sm font-semibold leading-5 text-gray/900 font-inter">
                      Role
                    </span>
                  </div>

                  <div className="rounded-xl border border-gray/200 bg-base-white pt-5 shadow-shadows/shadow-xs">
                    <div className="flex flex-col gap-5 px-4 pb-5">
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                          <p className="text-sm font-medium leading-5 text-gray/700 font-inter">
                            Role name <span className="text-brand/900">*</span>
                          </p>
                          <MyTextField
                            name="role_name"
                            value={name}
                            placeholder="e.g. Customer Service Team"
                            isError={!!nameError}
                            helperText={nameError || ''}
                            onChangeForm={(e) => {
                              setName(e.target.value)
                              if (nameError) setNameError('')
                            }}
                            focusColor="#42307D"
                            focusShadow="#42307D3D"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-4 py-3">
              <MyButton
                color="secondary"
                size="md"
                variant="outlined"
                type="button"
                onClick={handleBack}
              >
                Cancel
              </MyButton>
              <MyButton
                color="primary"
                size="md"
                variant="filled"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Submit'}
              </MyButton>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

RoleForm.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']).isRequired,
}
