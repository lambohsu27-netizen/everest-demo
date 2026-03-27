import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { SearchMd, XClose } from '@untitled-ui/icons-react'
import { useSettings } from '../Context'

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
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsVisible(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  const animateClose = (callback) => {
    setIsVisible(false)
    setTimeout(callback, 300)
  }

  // Pre-fill when editing
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

  const toggleSub = (moduleKey, subKey) => {
    setSelected((prev) => {
      const current = new Set(prev[moduleKey] ?? [])
      if (current.has(subKey)) current.delete(subKey)
      else current.add(subKey)
      return { ...prev, [moduleKey]: current }
    })
  }

  const toggleModule = (moduleKey, subKeys) => {
    setSelected((prev) => {
      const current = prev[moduleKey] ?? new Set()
      const allChecked = subKeys.every((k) => current.has(k))
      const next = new Set(allChecked ? [] : subKeys)
      return { ...prev, [moduleKey]: next }
    })
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
    if (!name.trim()) { setNameError('Role name is required.'); return }
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
    if (isEdit) animateClose(() => openRoleDetail(activePanelRoleId))
    else animateClose(closeRolePanel)
  }

  const handleClose = () => animateClose(closeRolePanel)

  const filteredPermissions = allPermissions.filter((module) => {
    if (!searchTerm) return true
    const lower = searchTerm.toLowerCase()
    const labelMatch = (module.label ?? module.module_key).toLowerCase().includes(lower)
    const descMatch = (module.description ?? '').toLowerCase().includes(lower)
    return labelMatch || descMatch
  })

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-3xl flex-col bg-white shadow-xl transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Close button */}
        <div className="flex justify-end px-6 pt-5">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:text-gray-600"
          >
            <XClose size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col min-h-0">
          {/* Two-column content */}
          <div className="flex flex-1 min-h-0 px-6 gap-8">
            {/* Left: Access menu */}
            <div className="flex w-1/2 flex-col min-h-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Access menu</h3>

              {/* Search */}
              <div className="relative my-3">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <SearchMd className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full rounded-lg border border-gray-300 bg-white p-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="Search for feature"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Permissions list (scrollable) */}
              <div className="flex-1 overflow-y-auto -mr-2 pr-2">
                {allPermissions.length === 0 ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="h-6 w-6 animate-spin rounded-full border-4 border-brand-300 border-t-brand-600" />
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Result</p>
                    {filteredPermissions.map((module) => {
                      const moduleKey = module.module_key
                      const subKeys = module.sub_permissions?.map((s) => s.key ?? s) ?? []
                      const currentSet = selected[moduleKey] ?? new Set()
                      const allChecked = subKeys.length > 0 && subKeys.every((k) => currentSet.has(k))
                      const someChecked = subKeys.some((k) => currentSet.has(k))

                      return (
                        <div key={moduleKey} className="py-3">
                          <label className="flex cursor-pointer items-start gap-3">
                            <input
                              type="checkbox"
                              checked={allChecked}
                              ref={(el) => { if (el) el.indeterminate = !allChecked && someChecked }}
                              onChange={() => toggleModule(moduleKey, subKeys)}
                              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                            />
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-gray-900">
                                {module.label ?? moduleKey.replace(/_/g, ' ')}
                              </span>
                              {module.description && (
                                <span className="text-xs text-gray-500 mt-0.5">{module.description}</span>
                              )}
                            </div>
                          </label>

                          <div className="ml-7 mt-2 flex flex-col gap-1.5">
                            {module.sub_permissions?.map((sub) => {
                              const subKey = sub.key ?? sub
                              const subLabel = sub.label ?? subKey
                              return (
                                <label key={subKey} className="flex cursor-pointer items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={currentSet.has(subKey)}
                                    onChange={() => toggleSub(moduleKey, subKey)}
                                    className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                                  />
                                  <span className="text-sm text-gray-600">{subLabel}</span>
                                </label>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="w-px bg-gray-200" />

            {/* Right: Form */}
            <div className="flex w-1/2 flex-col">
              <div className="flex flex-col gap-1 mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {isEdit ? 'Edit role' : 'Add role'}
                </h3>
                <p className="text-sm text-gray-500">
                  {isEdit
                    ? 'Please provide the details you would like to edit.'
                    : 'Please provide the details for a new case.'}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-sm font-semibold text-gray-900">Role</p>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Role name <span className="text-error-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); if (nameError) setNameError('') }}
                    placeholder="e.g. Customer Service Team"
                    className={`block w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-1 ${
                      nameError
                        ? 'border-error-300 focus:border-error-500 focus:ring-error-500'
                        : 'border-gray-300 focus:border-brand-500 focus:ring-brand-500'
                    }`}
                  />
                  {nameError && <p className="text-xs text-error-600">{nameError}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
            <button
              type="button"
              onClick={handleBack}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 disabled:opacity-60"
            >
              {isSubmitting ? 'Saving…' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

RoleForm.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']).isRequired,
}
