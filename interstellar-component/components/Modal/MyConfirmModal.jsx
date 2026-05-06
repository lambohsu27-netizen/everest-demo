import { Save01, XClose } from '@untitled-ui/icons-react'
import {
  MyBgPatternDecorativeCircle,
  MyButton,
  MyModal,
} from '@interstellar-component'
import { useEffect } from 'react'

function MyConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  icon,
  bgColor = 'bg-warning/100',
  negativeActionWord = 'Batal',
  positiveActionWord = 'Yakin',
  positiveButtonColor = 'primary',
  forceBlur = false,
}) {
  useEffect(() => {
    if (open) {
      const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
          event.preventDefault()
          onConfirm()
          onClose()
        }
        return undefined
      }

      window.addEventListener('keydown', handleKeyPress)

      return () => {
        window.removeEventListener('keydown', handleKeyPress)
      }
    }
  }, [open, onConfirm, onClose])

  return (
    <MyModal
      open={open}
      forceBlur={forceBlur}
      children={
        <ConfirmModalView
          onClose={onClose}
          onConfirm={onConfirm}
          title={title}
          message={message}
          icon={icon}
          bgColor={bgColor}
          negativeActionWord={negativeActionWord}
          positiveActionWord={positiveActionWord}
          positiveButtonColor={positiveButtonColor}
        />
      }
      onClose={onClose}
    />
  )
}

export default MyConfirmModal

function ConfirmModalView({
  onClose,
  onConfirm,
  title,
  message,
  icon,
  bgColor,
  negativeActionWord,
  positiveActionWord,
  positiveButtonColor,
}) {
  return (
    <div className="flex w-[400px] flex-col gap-5 overflow-hidden rounded-xl bg-base-white">
      <header className="relative flex items-start gap-x-4 pt-6">
        <button
          onClick={onClose}
          className="absolute right-[12px] top-[12px] z-10 flex h-11 w-11 items-center justify-center rounded-lg p-2"
        >
          <XClose
            size={24}
            className="text-gray-light/400"
            stroke="currentColor"
          />
        </button>
        <div className="flex w-full flex-col gap-4 px-4">
          <div className="z-0">
            <MyBgPatternDecorativeCircle
              children={
                <div className={`w-fit rounded-full border ${bgColor} p-3`}>
                  {icon || <Save01 className="text-warning/600" />}
                </div>
              }
            />
          </div>
          <div className="z-40 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-lg-semibold text-gray-light/900">
                {title || 'Confirm Action'}
              </p>
              <p className="text-sm-regular text-gray-light/600">
                {message ||
                  'Are you sure you want to proceed with this action?'}
              </p>
            </div>
          </div>
        </div>
      </header>
      <div className="z-40 flex flex-col gap-10 px-6">
        <div className="mb-6 flex gap-3 pt-4">
          <MyButton
            expanded
            color="secondary"
            variant="outlined"
            size="lg"
            onClick={onClose}
          >
            <p className="text-sm-semibold">{negativeActionWord}</p>
          </MyButton>
          <MyButton
            expanded
            color={positiveButtonColor}
            variant="filled"
            size="lg"
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            <p className="text-sm-semibold">{positiveActionWord}</p>
          </MyButton>
        </div>
      </div>
    </div>
  )
}
