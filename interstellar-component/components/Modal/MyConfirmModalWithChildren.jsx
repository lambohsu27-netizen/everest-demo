import { Save01, XClose } from '@untitled-ui/icons-react'
import { MyBgPatternDecorativeCircle, MyButton, MyModal } from '@interstellar-component'
import { useEffect } from 'react'

/**
 * @typedef {Object} MyConfirmModalWithChildrenProps
 * @property {boolean} open
 * @property {() => void} onClose
 * @property {() => void} onConfirm
 * @property {import('react').ReactNode} [title]
 * @property {import('react').ReactNode} [icon]
 * @property {string} [bgColor='bg-warning/100']
 * @property {import('react').ReactNode} [negativeActionWord='Cancel']
 * @property {import('react').ReactNode} [positiveActionWord='Confirm']
 * @property {import('react').ReactNode} [message]
 * @property {boolean} [confirmDisabled=false]
 * @property {boolean} [submitOnEnter=true]
 * @property {boolean} [closeOnConfirm=true]
 * @property {import('react').ReactNode} [children]
 * @property {string} [contentClassName]
 *   Kelas tambahan untuk section konten anak; di-append setelah `px-6`.
 * @property {string} [footerClassName]
 *   Kelas tambahan yang di-append langsung pada elemen `<footer>`.
 * @property {boolean} [disableBgPattern=false]
 *   Nonaktifkan pola dekoratif di belakang ikon header.
 * @property {boolean} [enableDoubleRing=false]
 *   Aktifkan cincin tebal (border-[8px] border-brand/50) di sekitar ikon.
 * @property {boolean} [forceBlur=false]
 *   Aktifkan efek blur dan overlay gelap pada background modal.
 */

/**
 * @param {MyConfirmModalWithChildrenProps} props
 */
function MyConfirmModalWithChildren({
  open,
  onClose,
  onConfirm,
  title,
  icon,
  bgColor = 'bg-warning/100',
  negativeActionWord,
  positiveActionWord,
  message,
  confirmDisabled = false,
  submitOnEnter = true,
  closeOnConfirm = true,
  children,
  contentClassName,
  footerClassName,
  disableBgPattern = false,
  enableDoubleRing = false,
  forceBlur = false,
  zIndex,
}) {
  useEffect(() => {
    if (open) {
      const handleKeyPress = (event) => {
        if (event.key === 'Enter' && submitOnEnter) {
          event.preventDefault()
          event.stopPropagation()
          if (!confirmDisabled) {
            onConfirm?.()
            if (closeOnConfirm) onClose?.()
          }
        }
      }
      window.addEventListener('keydown', handleKeyPress)
      return () => window.removeEventListener('keydown', handleKeyPress)
    }
    return undefined
  }, [open, submitOnEnter, confirmDisabled, onConfirm, onClose, closeOnConfirm])

  return (
    <MyModal open={open} onClose={onClose} forceBlur={forceBlur} zIndex={zIndex}>
      <MyConfirmModalWithChildrenView
        onClose={onClose}
        onConfirm={onConfirm}
        title={title}
        icon={icon}
        bgColor={bgColor}
        negativeActionWord={negativeActionWord}
        positiveActionWord={positiveActionWord}
        message={message}
        confirmDisabled={confirmDisabled}
        closeOnConfirm={closeOnConfirm}
        contentClassName={contentClassName}
        footerClassName={footerClassName}
        disableBgPattern={disableBgPattern}
        enableDoubleRing={enableDoubleRing}
      >
        {children}
      </MyConfirmModalWithChildrenView>
    </MyModal>
  )
}

export default MyConfirmModalWithChildren

/**
 * @typedef {Object} MyConfirmModalWithChildrenViewProps
 * @property {() => void} onClose
 * @property {() => void} onConfirm
 * @property {import('react').ReactNode} [title]
 * @property {import('react').ReactNode} [icon]
 * @property {string} bgColor
 * @property {import('react').ReactNode} negativeActionWord
 * @property {import('react').ReactNode} positiveActionWord
 * @property {import('react').ReactNode} [message]
 * @property {boolean} [confirmDisabled]
 * @property {boolean} [closeOnConfirm]
 * @property {import('react').ReactNode} [children]
 * @property {string} [contentClassName]
 * @property {string} [footerClassName]
 * @property {boolean} [disableBgPattern]
 * @property {boolean} [enableDoubleRing]
 */

/**
 * @param {MyConfirmModalWithChildrenViewProps} props
 */
function MyConfirmModalWithChildrenView({
  onClose,
  onConfirm,
  title,
  icon,
  bgColor,
  negativeActionWord,
  positiveActionWord,
  message,
  confirmDisabled = false,
  closeOnConfirm = true,
  children,
  contentClassName,
  footerClassName,
  disableBgPattern = false,
  enableDoubleRing = false,
}) {
  const handleConfirmClick = () => {
    if (confirmDisabled) return
    onConfirm?.()
    if (closeOnConfirm) onClose?.()
  }

  function IconWrapper({ icon: internalIcon }) {
    return (
      <div
        className={`w-fit rounded-full border ${bgColor} p-3 ${
          enableDoubleRing ? 'border-[8px] border-brand/50' : ''
        }`}
      >
        {internalIcon}
      </div>
    )
  }

  return (
    <div className="flex w-[480px] max-h-[90vh] flex-col gap-0 border border-gray/100 overflow-hidden rounded-2xl bg-base-white shadow-shadows/shadow-xl">
      {/* ── Fixed Header ─────────────────────────────────────────────────── */}
      <header className="relative flex items-start gap-x-4 pt-6 shrink-0 z-10 bg-white">
        <button
          onClick={onClose}
          className="absolute right-[12px] top-[12px] flex h-11 w-11 items-center justify-center rounded-lg p-2 hover:bg-gray-light/50"
          aria-label="Close"
          type="button"
        >
          <XClose size={24} className="text-gray-light/400" stroke="currentColor" />
        </button>

        <div className="flex w-full flex-col gap-4 px-6 mb-4">
          <div className="z-0">
            {disableBgPattern ? (
              <IconWrapper icon={icon || <Save01 className="text-warning/600" />} />
            ) : (
              <MyBgPatternDecorativeCircle>
                <IconWrapper icon={icon || <Save01 className="text-warning/600" />} />
              </MyBgPatternDecorativeCircle>
            )}
          </div>

          <div className="z-40 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg-semibold text-gray-light/900">
                {title || 'Confirm Action'}
              </h3>
              {message != null && <p className="text-sm text-gray-light/600">{message}</p>}
            </div>
          </div>
        </div>
      </header>

      <div className="h-px w-full bg-gray/50 shrink-0" />

      {/* ── Native Scrollable Body ────────────────────────────────────────── */}
      <section 
        className={`flex-1 overflow-y-auto px-6 py-6 min-h-0 custom-scrollbar ${contentClassName || ''}`}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#D0D5DD transparent',
        }}
      >
        {children}
      </section>

      <div className="h-px w-full bg-gray/50 shrink-0" />

      {/* ── Fixed Footer ─────────────────────────────────────────────────── */}
      <div className="flex flex-col px-6 shrink-0 bg-white z-10">
        {negativeActionWord || positiveActionWord ? (
          <footer className={`mb-6 mt-6 flex gap-3 ${footerClassName || ''}`}>
            {negativeActionWord && typeof negativeActionWord === 'string' ? (
              <MyButton
                expanded
                color="secondary"
                variant="outlined"
                size="lg"
                onClick={onClose}
                type="button"
              >
                <span className="text-sm-semibold">{negativeActionWord}</span>
              </MyButton>
            ) : (
              negativeActionWord
            )}

            {positiveActionWord && typeof positiveActionWord === 'string' ? (
              <MyButton
                expanded
                color="primary"
                variant="filled"
                size="lg"
                onClick={handleConfirmClick}
                disabled={confirmDisabled}
                type="button"
              >
                <span className="text-sm-semibold">{positiveActionWord}</span>
              </MyButton>
            ) : (
              positiveActionWord
            )}
          </footer>
        ) : (
          <div className="mb-6" />
        )}
      </div>
    </div>
  )
}
