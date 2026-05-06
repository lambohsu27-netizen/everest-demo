import React from 'react'
import { toast } from 'react-toastify'
import { CheckCircle, XClose, AlertCircle } from '@untitled-ui/icons-react'
import MyButton from '../Button/MyButton'
import MyIconDecorativeOutline from '../Decorative/MyIconDecorativeOutline'

function Content({
  closeToast,
  toastProps,
  response = {},
  onUndo,
  onDismiss,
  onViewChange,
  onSeeDetail,
}) {
  const toasterIcon = React.useMemo(() => {
    if (
      response?.status === 200 ||
      response?.status === 201 ||
      response?.status === '200' ||
      response?.status === '201'
    ) {
      return (
        <MyIconDecorativeOutline color="success">
          <CheckCircle className="size-5" stroke="currentColor" />
        </MyIconDecorativeOutline>
      )
    }
    if (
      (() => {
        const status = Number(response?.status)
        return !isNaN(status) && status >= 400
      })()
    ) {
      return (
        <MyIconDecorativeOutline color="warning">
          <AlertCircle className="size-5" stroke="currentColor" />
        </MyIconDecorativeOutline>
      )
    }

    return <></>
  }, [response])

  return (
    <div className="relative rounded-xl border border-gray-light/300 bg-white p-4 shadow-shadows/shadow-lg">
      <button
        onClick={closeToast}
        className="absolute right-0 top-0 p-2 text-gray-light/400"
      >
        <XClose className="size-5" stroke="currentColor" />
      </button>
      <div className="flex items-start gap-4">
        {toasterIcon && <div>{toasterIcon}</div>}
        <div className="flex w-full flex-col gap-3">
          <div className="flex w-full flex-col gap-y-1">
            <p className="text-sm-semibold text-gray-light/900">
              {response?.title ?? 'Informasi'}
            </p>
            <p
              className="text-sm-regular line-clamp-3 whitespace-pre-line text-gray-light/700"
              dangerouslySetInnerHTML={{ __html: response?.message ?? '-' }}
            />
          </div>
          {(onDismiss || onViewChange || onUndo || onSeeDetail) && (
            <div className="flex w-full items-center gap-x-3">
              {onDismiss && (
                <MyButton onClick={closeToast} color="gray" variant="text">
                  <p className="text-sm-semibold">Tutup</p>
                </MyButton>
              )}
              {onViewChange && (
                <MyButton color="primary" variant="text">
                  <p className="text-sm-semibold">Lihat perubahan</p>
                </MyButton>
              )}
              {onSeeDetail && (
                <MyButton onClick={onSeeDetail} color="primary" variant="text">
                  <p className="text-sm-semibold">Lihat detail</p>
                </MyButton>
              )}
              {onUndo && (
                <MyButton color="primary" variant="text">
                  <p className="text-sm-semibold">Batalkan aksi</p>
                </MyButton>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const myToaster = (
  response,
  {
    onUndo = null,
    onDismiss = null,
    onViewChange = null,
    onSeeDetail = null,
  } = {}
) => {
  // Stable toastId per (status + message) so a second call with the same payload
  // collapses onto the active toast instead of stacking. Prevents phantom replays
  // (e.g. "Login successful." re-firing while the original toast is still on screen).
  const status = response?.status ?? ''
  const message = response?.message ?? ''
  const toastId = message ? `${status}:${message}` : undefined
  toast(
    <Content
      response={response}
      onUndo={onUndo}
      onDismiss={onDismiss}
      onViewChange={onViewChange}
      onSeeDetail={onSeeDetail}
    />,
    { containerId: 'default', toastId }
  )
  return response
}

export default myToaster
