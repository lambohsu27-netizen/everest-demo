import { Lock01, Save01, XClose } from '@untitled-ui/icons-react'
import { useForm } from 'react-hook-form'

import {
  MyBgPatternDecorativeCircle,
  MyButton,
  MyModal,
} from '@interstellar-component'

function AlertModal({ handleCurrentModal, currentModal }) {
  const {
    setValue,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
    trigger,
    clearErrors,
  } = useForm({})

  return (
    <MyModal
      open={currentModal?.current === 'alert-modal'}
      children={
        <AlertModalView
          handleCurrentModal={handleCurrentModal}
          isSubmitting={isSubmitting}
          error={currentModal?.error}
        />
      }
      onClose={() => handleCurrentModal(null)}
      forceBlur={true}
    />
  )
}

export default AlertModal

function AlertModalView({ handleCurrentModal, isSubmitting, error }) {
  return (
    <div className="flex w-[400px] flex-col gap-5 overflow-hidden rounded-lg bg-base-white">
      <header className="relative flex items-start gap-x-4 pt-6">
        <button
          onClick={() => {
            handleCurrentModal(null)
          }}
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
                <div className="w-fit rounded-full border-8 border-error/50 bg-error/100 p-3">
                  <Lock01 className="text-error/600" />
                </div>
              }
            />
          </div>
          <div className="z-40 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-lg-semibold text-gray-light/900">
                Akun anda terkunci.
              </p>
              <p className="text-sm-regular text-gray-light/600">
                {error?.code === 'MAX_LOGIN_ATTEMPTS'
                  ? 'Kami mendeteksi 3 kali percobaan login yang gagal. Silakan hubungi admin untuk bantuan lebih lanjut.'
                  : error?.code === 'INACTIVE_SESSION'
                  ? 'Kami mendeteksi akun anda tidak aktif dalam beberapa periode. Silakan hubungi admin untuk bantuan lebih lanjut.'
                  : 'Akun anda terkunci. Silahkan hubungi admin untuk membuka akun anda.'}
              </p>
            </div>
          </div>
        </div>
      </header>
      <form className="z-40 flex flex-col gap-10 px-4">
        <div className="mb-6 flex gap-6 pt-4">
          <MyButton
            expanded
            color="secondary"
            variant="outlined"
            size="lg"
            onClick={() => {
              handleCurrentModal(null)
            }}
          >
            <p className="text-sm-semibold">Tutup</p>
          </MyButton>
        </div>
      </form>
    </div>
  )
}
