import { LockUnlocked01, XClose } from '@untitled-ui/icons-react'

import {
  MyBgPatternDecorativeCircle,
  MyButton,
  MyModal,
} from '@interstellar-component'

function ModalEnableUser({ handleCurrentModal, currentModal, onConfirm }) {

  return (
    <MyModal
      open={currentModal?.current === 'enable-user-modal'}
      children={
        <ModalEnableUserView
          handleCurrentModal={handleCurrentModal}
          error={currentModal?.error}
          onConfirm={onConfirm}
        />
      }
      onClose={() => handleCurrentModal(null)}
      forceBlur={true}
    />
  )
}

export default ModalEnableUser

function ModalEnableUserView({ handleCurrentModal, error, onConfirm }) {
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
            className="text-gray-light-400"
            stroke="currentColor"
          />
        </button>
        <div className="flex w-full flex-col gap-4 px-4">
          <div className="z-0">
            <MyBgPatternDecorativeCircle
              children={
                <div className="w-fit rounded-full border-8 border-warning-50 bg-warning-100 p-3">
                  <LockUnlocked01 className="text-warning-600" />
                </div>
              }
            />
          </div>
          <div className="z-40 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-lg-semibold text-gray-light-900">
                Buka akun?
              </p>
              <p className="text-sm-regular text-gray-light-600">
                Apakah anda yakin ingin membuka akun ini?
              </p>
            </div>
          </div>
        </div>
      </header>
      <form className="z-40 flex flex-col gap-10 px-4">
        <div className="mb-6 flex gap-4 pt-4">
          <MyButton
            expanded
            color="secondary"
            variant="outlined"
            size="lg"
            onClick={() => {
              handleCurrentModal(null)
            }}
          >
            <p className="text-sm-semibold">Batalkan</p>
          </MyButton>
          <MyButton
            expanded
            color="primary"
            variant="filled"
            size="lg"
            onClick={() => {
              onConfirm()
            }}
          >
            <p className="text-sm-semibold">Ya</p>
          </MyButton>
        </div>
      </form>
    </div>
  )
}
