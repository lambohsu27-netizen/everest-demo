import { useEffect } from 'react'
import { MyButton } from '@interstellar-component'
import { useApp } from '@src/AppContext'
import { Access } from '@src/services/Helper'
import { useSettings } from '../Context'

export default function GeneralSettings() {
  const { hasPermission } = useApp()
  const {
    sessionTimeout,
    setSessionTimeout,
    verificationThreshold,
    setVerificationThreshold,
    isLoadingGeneral,
    fetchGeneralSettings,
    updateGeneralSettings,
    cancelGeneralSettings,
  } = useSettings()

  const canEdit = hasPermission(Access.GENERAL_SETTINGS, 'edit')
  const canView = canEdit

  useEffect(() => {
    if (canView) fetchGeneralSettings()
  }, [canView, fetchGeneralSettings])

  if (isLoadingGeneral) {
    return (
      <div className="flex items-center justify-center pt-16">
        <span className="text-sm text-[#535862]">Loading...</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col pt-8">
      {/* General Settings Header */}
      <div className="flex flex-col gap-1 w-full pb-5 border-b border-[#e9eaeb]">
        <h2 className="text-lg font-semibold text-[#181d27]">General Settings</h2>
        <p className="text-sm text-[#535862]">
          Configure system-wide preferences and verification rules.
        </p>
      </div>

      {/* Session Auto Timeout Row */}
      <div className="flex flex-row w-full py-5 border-b border-[#e9eaeb] items-start">
        <div className="w-[300px] shrink-0 mr-8 flex flex-col gap-1">
          <label className="text-sm font-semibold text-[#344054]">Session Auto Timeout</label>
          <p className="text-sm text-[#475467]">
            Automatically sign out users after a period of inactivity.
          </p>
        </div>
        <div className="flex-1 max-w-[400px]">
          <div className="relative flex items-center w-full rounded-lg border border-[#D0D5DD] bg-white shadow-sm overflow-hidden focus-within:ring-1 focus-within:ring-[#6941C6] focus-within:border-[#6941C6]">
            <input
              type="text"
              name="timeout"
              id="timeout"
              className="block w-full border-0 py-2.5 pl-3.5 pr-16 text-gray-900 ring-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)}
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 sm:text-sm">minute</span>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Row */}
      <div className="flex flex-row w-full py-5 border-b border-[#e9eaeb] items-start">
        <div className="w-[300px] shrink-0 mr-8 flex flex-col gap-1">
          <label className="text-sm font-semibold text-[#344054]">
            Verification <span className="text-[#6941C6]">*</span>
          </label>
          <p className="text-sm text-[#475467]">
            Configure thresholds for automated and manual identity verification.
          </p>
        </div>
        <div className="flex-1 max-w-[400px]">
          <label className="block text-sm font-medium text-[#344054] mb-1.5">
            Auto verification threshold <span className="text-[#6941C6]">*</span>
          </label>
          <div className="relative flex items-center w-full rounded-lg border border-[#D0D5DD] bg-white shadow-sm overflow-hidden focus-within:ring-1 focus-within:ring-[#6941C6] focus-within:border-[#6941C6]">
            <input
              type="text"
              name="threshold"
              id="threshold"
              className="block w-full border-0 py-2.5 pl-3.5 pr-8 text-gray-900 ring-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
              value={verificationThreshold}
              onChange={(e) => setVerificationThreshold(e.target.value)}
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 sm:text-sm">%</span>
            </div>
          </div>
          <p className="mt-2 text-sm text-[#475467]">
            Minimum face similarity score required for automatic identity approval.
          </p>
        </div>
      </div>

      {/* Footer Buttons */}
      {canEdit && (
        <div className="flex w-full justify-end gap-3 pt-6 pb-2">
          <MyButton color="secondary" size="md" variant="outlined" onClick={cancelGeneralSettings}>
            Cancel
          </MyButton>
          <MyButton color="primary" size="md" variant="filled" onClick={updateGeneralSettings}>
            Save
          </MyButton>
        </div>
      )}
    </div>
  )
}
