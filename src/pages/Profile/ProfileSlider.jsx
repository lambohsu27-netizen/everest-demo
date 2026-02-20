import { useState, React, useEffect } from 'react'
import SimpleBar from 'simplebar-react'
import { XClose } from '@untitled-ui/icons-react'
import { useLogin } from '../../pages/Login/Context'
import ProfileForm from './Components/ProfileForm'
import PasswordForm from './Components/PasswordForm'

function ProfileSlider() {
  const { isProfileSliderOpen, setIsProfileSliderOpen, User } = useLogin()
  const [title] = useState('Personal info')
  const [disableClose, setDisableClose] = useState(false)

  useEffect(() => {
    setDisableClose(User?.data?.should_change_password || false)
  }, [User])

  return (
    <div className="z-40 flex h-screen w-[375px] flex-col gap-6">
      <header className="relative flex items-start gap-x-4 px-4 pt-6">
        <button
          type="button"
          onClick={() => {
            if (disableClose) return
            setIsProfileSliderOpen(false)
          }}
          className="absolute right-[12px] top-[12px] flex h-11 w-11 items-center justify-center rounded-lg"
        >
          <XClose className="size-6" stroke="currentColor" />
        </button>
        <div className="flex flex-1 flex-col gap-6">
          <section className="flex flex-col gap-1">
            <p className="text-xl-semibold text-gray-light-900">{title}</p>
            <p className="text-sm-regular text-gray-light-600">
              Perbaharui foto dan informasi pribadi disini.
            </p>
          </section>
        </div>
      </header>

      <section className="flex-1 overflow-hidden">
        <SimpleBar forceVisible="y" style={{ height: '100%' }}>
          <ProfileForm />
          <PasswordForm />
        </SimpleBar>
      </section>
    </div>
  )
}

export default ProfileSlider
