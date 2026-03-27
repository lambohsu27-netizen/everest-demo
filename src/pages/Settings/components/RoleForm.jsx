import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useSettings } from '../Context'
import SettingsPanel from './SettingsPanel'

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
    if (isEdit) openRoleDetail(activePanelRoleId)
    else closeRolePanel()
  }

  return (
    <SettingsPanel
      onBack={handleBack}
      onClose={closeRolePanel}
      backLabel={isEdit ? roleDetail?.name ?? 'Role detail' : 'Role access'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-900">
          {isEdit ? 'Edit role' : 'New role'}
        </h2>

        {/* Role name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Role name <span className="text-error-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); if (nameError) setNameError('') }}
            placeholder="Enter role name"
            className={`block w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-1 ${
              nameError
                ? 'border-error-300 focus:border-error-500 focus:ring-error-500'
                : 'border-gray-300 focus:border-brand-500 focus:ring-brand-500'
            }`}
          />
          {nameError && <p className="text-xs text-error-600">{nameError}</p>}
        </div>

        {/* Permissions */}
        <div className="flex flex-col gap-4">
          <h3 className="text-base font-semibold text-gray-900">Permissions</h3>
          {allPermissions.length === 0 ? (
            <div className="flex items-center justify-center py-10">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-brand-300 border-t-brand-600" />
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-gray-100 rounded-xl border border-gray-200">
              {allPermissions.map((module) => {
                const moduleKey = module.module_key
                const subKeys = module.sub_permissions?.map((s) => s.key ?? s) ?? []
                const currentSet = selected[moduleKey] ?? new Set()
                const allChecked = subKeys.length > 0 && subKeys.every((k) => currentSet.has(k))
                const someChecked = subKeys.some((k) => currentSet.has(k))

                return (
                  <div key={moduleKey} className="px-5 py-4">
                    {/* Module header checkbox */}
                    <label className="flex cursor-pointer items-center gap-3 mb-3">
                      <input
                        type="checkbox"
                        checked={allChecked}
                        ref={(el) => { if (el) el.indeterminate = !allChecked && someChecked }}
                        onChange={() => toggleModule(moduleKey, subKeys)}
                        className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                      />
                      <span className="text-sm font-semibold text-gray-700 capitalize">
                        {module.module_name ?? moduleKey.replace(/_/g, ' ')}
                      </span>
                    </label>

                    {/* Sub-permissions */}
                    <div className="ml-7 flex flex-wrap gap-x-6 gap-y-2">
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
                            <span className="text-sm text-gray-600 capitalize">
                              {subLabel.replace(/_/g, ' ')}
                            </span>
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

        {/* Actions */}
        <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
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
            {isSubmitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create role'}
          </button>
        </div>
      </form>
    </SettingsPanel>
  )
}

RoleForm.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']).isRequired,
}
