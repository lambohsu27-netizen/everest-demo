import { Save01, XClose } from '@untitled-ui/icons-react'
import { useForm } from 'react-hook-form'

import {
  MyBgPatternDecorativeCircle,
  MyButton,
  MyModal,
} from '@interstellar-component'

function MyConfirmUnsavedModal({
  handleCurrentModal,
  handleCurrentSlider,
  currentModal,
}) {
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
      open={currentModal?.current === 'unsaved-modal'}
      children={
        <ConfirmModalView
          handleCurrentModal={handleCurrentModal}
          handleCurrentSlider={handleCurrentSlider}
          isSubmitting={isSubmitting}
        />
      }
      onClose={() => handleCurrentModal(null)}
    />
  )
}

export default MyConfirmUnsavedModal

function ConfirmModalView({
  handleCurrentModal,
  handleCurrentSlider,
  isSubmitting,
}) {
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
                <div className="w-fit rounded-xl border bg-warning/100 p-3">
                  <Save01 className="text-warning/600" />
                </div>
              }
            />
          </div>
          <div className="z-40 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-lg-semibold text-gray-light/900">
                Perubahan belum tersimpan
              </p>
              <p className="text-sm-regular text-gray-light/600">
                Anda memiliki perubahan yang belum disimpan. Apakah Anda yakin
                ingin meninggalkan form ini?
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
              handleCurrentSlider(null)
            }}
          >
            <p className="text-sm-semibold">Tinggalkan</p>
          </MyButton>
          <MyButton
            disabled={isSubmitting}
            expanded
            // type="submit"
            onClick={() => handleCurrentModal(null)}
            color="primary"
            variant="filled"
            size="lg"
          >
            <p className="text-sm-semibold">Lanjutkan mengedit</p>
          </MyButton>
        </div>
      </form>
    </div>
  )
}
