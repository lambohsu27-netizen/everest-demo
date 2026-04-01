import { useEffect, useState } from 'react'
import { Edit05, Trash01, XClose } from '@untitled-ui/icons-react'
import { MyButton, MyConfirmModal } from '@interstellar-component'

export default function LevelDetailsSlider({ open, data, onClose, onEdit }) {
  const [isVisible, setIsVisible] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  useEffect(() => {
    if (open) {
      const frame = requestAnimationFrame(() => setIsVisible(true))
      return () => cancelAnimationFrame(frame)
    }
    setIsVisible(false)
    return undefined
  }, [open])

  const animateClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  const handleConfirmDelete = async () => {
    setDeleteConfirmOpen(false)
    // TODO: implement actual delete logic
    animateClose()
  }

  if (!open && !isVisible) return null

  return (
    <>
      <MyConfirmModal
        open={deleteConfirmOpen}
        title="Delete level"
        message={`Are you sure you want to delete "${data?.level}"? This action cannot be undone.`}
        icon={<Trash01 className="text-error-600" />}
        bgColor="bg-error-100"
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      {/* Backdrop */}
      <div
        role="presentation"
        className={`fixed inset-0 z-40 bg-gray-950/70 backdrop-blur-md transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={animateClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full items-stretch pl-10 transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          onClick={animateClose}
          className="absolute left-[344px] top-3 z-10 rounded-lg p-2 text-gray-400 transition-colors hover:text-gray-600"
        >
          <XClose size={20} />
        </button>

        <div className="flex w-[375px] flex-col border-l border-gray-200 bg-white shadow-xl font-inter">
          <div className="flex flex-1 flex-col overflow-y-auto">
            {/* Header */}
            <div className="px-6 pb-4 pt-8 border-b border-gray-200">
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold text-gray-900">{data?.level}</h2>
                <p className="text-sm text-gray-500 font-medium">Employment Level</p>
              </div>
            </div>

            {/* Information Section */}
            <div className="mt-8 px-4">
              <div className="rounded-xl border border-gray-200 bg-gray-25 shadow-xs">
                <div className="px-5 pb-2 pt-3">
                  <h3 className="text-sm font-semibold text-gray-900">Information</h3>
                </div>
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
                  <div className="flex items-center border-b border-gray-200 last:border-b-0">
                    <div className="w-[180px] shrink-0 px-6 py-4">
                      <span className="text-sm font-normal text-gray-600">Employment Level Name</span>
                    </div>
                    <div className="flex-1 px-6 py-4 text-right">
                      <span className="text-sm font-medium text-gray-900">{data?.level}</span>
                    </div>
                  </div>
                  {/* Extracting 'from' and 'to' from salaryRange manually if possible, or just mock as per data */}
                  <div className="flex items-center border-b border-gray-200 last:border-b-0">
                    <div className="w-[180px] shrink-0 px-6 py-4">
                      <span className="text-sm font-normal text-gray-600">Salary Range (from)</span>
                    </div>
                    <div className="flex-1 px-6 py-4 text-right">
                      <span className="text-sm font-medium text-gray-900">
                        {data?.salaryRange?.split(' - ')[0] || '-'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center border-b border-gray-200 last:border-b-0">
                    <div className="w-[180px] shrink-0 px-6 py-4">
                      <span className="text-sm font-normal text-gray-600">Salary Range (to)</span>
                    </div>
                    <div className="flex-1 px-6 py-4 text-right">
                      <span className="text-sm font-medium text-gray-900">
                        {data?.salaryRange?.split(' - ')[1] || '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Screening Rules Section */}
            <div className="mt-8 px-4">
              <div className="rounded-xl border border-gray-200 bg-gray-25 shadow-xs">
                <div className="px-5 pb-2 pt-3">
                  <h3 className="text-sm font-semibold text-gray-900">Screening Rules</h3>
                </div>
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
                  <div className="flex items-center border-b border-gray-200 last:border-b-0">
                    <div className="w-[180px] shrink-0 px-6 py-4">
                      <span className="text-sm font-normal text-gray-600">Consent Expiry</span>
                    </div>
                    <div className="flex-1 px-6 py-4 text-right">
                      <span className="text-sm font-medium text-gray-900">
                        {data?.consentExpiry || '-'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center border-b border-gray-200 last:border-b-0">
                    <div className="w-[180px] shrink-0 px-6 py-4">
                      <span className="text-sm font-normal text-gray-600">Repeat Every</span>
                    </div>
                    <div className="flex-1 px-6 py-4 text-right">
                      <span className="text-sm font-medium text-gray-900">
                        {data?.repeatEvery || '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Changes Section */}
            <div className="mt-8 px-4 pb-8">
              <div className="rounded-xl border border-gray-200 bg-gray-25 shadow-xs">
                <div className="px-5 pb-2 pt-3">
                  <h3 className="text-sm font-semibold text-gray-900">Changes</h3>
                </div>
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
                  {/* Mock data per design JSON */}
                  <div className="flex items-center border-b border-gray-200 last:border-b-0">
                    <div className="w-[120px] shrink-0 self-start px-6 py-4 text-left">
                      <span className="text-sm font-normal text-gray-600">Last modified</span>
                    </div>
                    <div className="flex flex-1 items-center justify-end gap-3 px-6 py-4">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-medium text-gray-900">Loki Bright</span>
                        <span className="text-sm font-normal text-gray-600">Field Technician</span>
                        <span className="text-xs font-normal text-gray-500 mt-0.5">
                          18 Jun 2022 • 18:23
                        </span>
                      </div>
                      <img
                        src="https://i.pravatar.cc/150?u=loki"
                        alt="Loki Bright"
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex items-center border-b border-gray-200 last:border-b-0">
                    <div className="w-[120px] shrink-0 self-start px-6 py-4 text-left">
                      <span className="text-sm font-normal text-gray-600">Created</span>
                    </div>
                    <div className="flex flex-1 items-center justify-end gap-3 px-6 py-4">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-medium text-gray-900">Rosalee Melvin</span>
                        <span className="text-sm font-normal text-gray-600">Team Leader</span>
                        <span className="text-xs font-normal text-gray-500 mt-0.5">
                          17 Jun 2022 • 08:02
                        </span>
                      </div>
                      <img
                        src="https://i.pravatar.cc/150?u=rosal"
                        alt="Rosalee Melvin"
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <MyButton
                color="error"
                size="sm"
                variant="text"
                onClick={() => setDeleteConfirmOpen(true)}
              >
                <Trash01 className="h-4 w-4 mr-1.5" stroke="currentColor" />
                Delete
              </MyButton>
              <MyButton color="secondary" size="md" variant="outlined" onClick={onEdit}>
                <Edit05 className="h-4 w-4 mr-1.5" stroke="currentColor" />
                Edit
              </MyButton>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
