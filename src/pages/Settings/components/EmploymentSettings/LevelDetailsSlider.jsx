import { useEffect, useState } from 'react'
import moment from 'moment'
import 'moment/locale/id'
import { format, isValid, parseISO } from 'date-fns'
import { Edit05, Trash01, XClose } from '@untitled-ui/icons-react'
import { MyButton, MyConfirmModal, MyLoadingData } from '@interstellar-component'
import { useEmploymentSettings } from './Context'

function formatRupiah(value) {
  if (value === null || value === undefined || value === '') return ''
  const n = Number(String(value).replace(/\D/g, ''))
  if (Number.isNaN(n)) return ''
  return `Rp${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

function formatWhen(iso) {
  if (!iso) return null
  const d = typeof iso === 'string' ? parseISO(iso) : new Date(iso)
  if (!isValid(d)) return typeof iso === 'string' ? iso : null
  return format(d, 'dd MMM yyyy • HH:mm')
}

/** Tanggal penuh locale Indonesia, contoh: 26 Maret 2030 */
function formatConsentExpiryId(value) {
  if (value == null || value === '') return null
  const m = moment(value)
  if (!m.isValid()) return String(value)
  m.locale('id')
  return `${m.date()} ${m.format('MMMM')} ${m.year()}`
}

function pickActor(data, kind) {
  const rel = kind === 'updated' ? data?.updater ?? data?.updated_by : data?.creator ?? data?.created_by
  const direct = rel ?? data?.[`${kind}_by`]
  if (direct && typeof direct === 'object') {
    return {
      name: direct.name ?? direct.full_name ?? '—',
      role: direct.role ?? direct.job_title ?? direct.position ?? '',
      avatar: direct.avatar_url ?? direct.avatar_full_url ?? direct.photo_url,
    }
  }
  if (typeof direct === 'string') {
    return { name: direct, role: '', avatar: null }
  }
  return {
    name: data?.[`${kind}_by_name`] ?? null,
    role: data?.[`${kind}_by_role`] ?? '',
    avatar: data?.[`${kind}_by_avatar`] ?? null,
  }
}

export default function LevelDetailsSlider({
  open,
  data,
  loading,
  onClose,
  onEdit,
  inModalSlider = false,
}) {
  const { deleteEmploymentLevels } = useEmploymentSettings()
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
    if (inModalSlider) {
      onClose()
      return
    }
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  const handleConfirmDelete = async () => {
    setDeleteConfirmOpen(false)
    if (data?.id != null) {
      try {
        await deleteEmploymentLevels([data.id])
        animateClose()
      } catch {
        /* myToaster in context */
      }
    } else {
      animateClose()
    }
  }

  const levelName = data?.name ?? data?.level ?? '—'
  const salaryFrom = formatRupiah(data?.salary_from) || '—'
  const salaryTo = formatRupiah(data?.salary_to) || '—'
  const rawConsent = data?.consent_expiry ?? data?.consentExpiry
  const consent =
    rawConsent == null || rawConsent === ''
      ? '—'
      : formatConsentExpiryId(rawConsent) ?? '—'
  const repeat = data?.repeat_every ?? data?.repeatEvery ?? '—'

  const lastMod = pickActor(data, 'updated')
  const createdBy = pickActor(data, 'created')
  const updatedAt = formatWhen(data?.updated_at)
  const createdAt = formatWhen(data?.created_at)

  if (inModalSlider) {
    if (!open) return null
  } else if (!open && !isVisible) {
    return null
  }

  const standalonePanelClass =
    'flex w-[375px] flex-col border-l border-gray-200 bg-white shadow-xl font-inter'
  const embeddedPanelClass =
    'flex h-full min-h-0 w-[375px] flex-col overflow-hidden bg-white font-inter'

  const panelBody = (
    <>
      <div className="flex flex-1 flex-col overflow-y-auto">
            <div className="px-6 pb-4 pt-8 border-b border-gray-200">
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold text-gray-900">{levelName}</h2>
                <p className="text-sm text-gray-500 font-medium">Employment Level</p>
              </div>
            </div>

            {loading ? (
              <div className="flex min-h-[280px] flex-1 items-center justify-center px-6">
                <MyLoadingData />
              </div>
            ) : (
              <>
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
                          <span className="text-sm font-medium text-gray-900">{levelName}</span>
                        </div>
                      </div>
                      <div className="flex items-center border-b border-gray-200 last:border-b-0">
                        <div className="w-[180px] shrink-0 px-6 py-4">
                          <span className="text-sm font-normal text-gray-600">Salary Range (from)</span>
                        </div>
                        <div className="flex-1 px-6 py-4 text-right">
                          <span className="text-sm font-medium text-gray-900">{salaryFrom}</span>
                        </div>
                      </div>
                      <div className="flex items-center border-b border-gray-200 last:border-b-0">
                        <div className="w-[180px] shrink-0 px-6 py-4">
                          <span className="text-sm font-normal text-gray-600">Salary Range (to)</span>
                        </div>
                        <div className="flex-1 px-6 py-4 text-right">
                          <span className="text-sm font-medium text-gray-900">{salaryTo}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

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
                          <span className="text-sm font-medium text-gray-900">{consent}</span>
                        </div>
                      </div>
                      <div className="flex items-center border-b border-gray-200 last:border-b-0">
                        <div className="w-[180px] shrink-0 px-6 py-4">
                          <span className="text-sm font-normal text-gray-600">Repeat Every</span>
                        </div>
                        <div className="flex-1 px-6 py-4 text-right">
                          <span className="text-sm font-medium text-gray-900">{repeat}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {(updatedAt || createdAt || lastMod.name || createdBy.name) && (
                  <div className="mt-8 px-4 pb-8">
                    <div className="rounded-xl border border-gray-200 bg-gray-25 shadow-xs">
                      <div className="px-5 pb-2 pt-3">
                        <h3 className="text-sm font-semibold text-gray-900">Changes</h3>
                      </div>
                      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
                        {updatedAt && (
                          <div className="flex items-center border-b border-gray-200 last:border-b-0">
                            <div className="w-[120px] shrink-0 self-start px-6 py-4 text-left">
                              <span className="text-sm font-normal text-gray-600">Last modified</span>
                            </div>
                            <div className="flex flex-1 items-center justify-end gap-3 px-6 py-4">
                              <div className="flex flex-col items-end">
                                <span className="text-sm font-medium text-gray-900">
                                  {lastMod.name ?? '—'}
                                </span>
                                {!!lastMod.role && (
                                  <span className="text-sm font-normal text-gray-600">{lastMod.role}</span>
                                )}
                                <span className="text-xs font-normal text-gray-500 mt-0.5">{updatedAt}</span>
                              </div>
                              {lastMod.avatar ? (
                                <img
                                  src={lastMod.avatar}
                                  alt=""
                                  className="h-6 w-6 rounded-full object-cover"
                                />
                              ) : null}
                            </div>
                          </div>
                        )}
                        {createdAt && (
                          <div className="flex items-center border-b border-gray-200 last:border-b-0">
                            <div className="w-[120px] shrink-0 self-start px-6 py-4 text-left">
                              <span className="text-sm font-normal text-gray-600">Created</span>
                            </div>
                            <div className="flex flex-1 items-center justify-end gap-3 px-6 py-4">
                              <div className="flex flex-col items-end">
                                <span className="text-sm font-medium text-gray-900">
                                  {createdBy.name ?? '—'}
                                </span>
                                {!!createdBy.role && (
                                  <span className="text-sm font-normal text-gray-600">{createdBy.role}</span>
                                )}
                                <span className="text-xs font-normal text-gray-500 mt-0.5">{createdAt}</span>
                              </div>
                              {createdBy.avatar ? (
                                <img
                                  src={createdBy.avatar}
                                  alt=""
                                  className="h-6 w-6 rounded-full object-cover"
                                />
                              ) : null}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="border-t border-gray-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <MyButton
                color="error"
                size="sm"
                variant="text"
                disabled={loading || !data?.id}
                onClick={() => setDeleteConfirmOpen(true)}
              >
                <Trash01 className="h-4 w-4 mr-1.5" stroke="currentColor" />
                Delete
              </MyButton>
              <MyButton
                color="secondary"
                size="md"
                variant="outlined"
                disabled={loading || !data}
                onClick={onEdit}
              >
                <Edit05 className="h-4 w-4 mr-1.5" stroke="currentColor" />
                Edit
              </MyButton>
            </div>
          </div>
    </>
  )

  return (
    <>
      <MyConfirmModal
        open={deleteConfirmOpen}
        title="Delete level"
        message={`Are you sure you want to delete "${levelName}"? This action cannot be undone.`}
        icon={<Trash01 className="text-error-600" />}
        bgColor="bg-error-100"
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        negativeActionWord="Cancel"
        positiveActionWord="Delete"
        positiveButtonColor="error"
        forceBlur
      />

      {inModalSlider ? (
        <div className={embeddedPanelClass}>{panelBody}</div>
      ) : (
        <>
          <div
            role="presentation"
            className={`fixed inset-0 z-40 bg-gray-950/70 backdrop-blur-md transition-opacity duration-300 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={animateClose}
          />

          <div
            className={`fixed right-0 top-0 z-50 flex h-full items-stretch pl-10 transition-transform duration-300 ease-in-out ${
              isVisible ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <button
              type="button"
              onClick={animateClose}
              className="absolute left-[344px] top-3 z-10 rounded-lg p-2 text-gray-400 transition-colors hover:text-gray-600"
            >
              <XClose size={20} />
            </button>

            <div className={standalonePanelClass}>{panelBody}</div>
          </div>
        </>
      )}
    </>
  )
}
