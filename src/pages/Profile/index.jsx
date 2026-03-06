import { useEffect, useState } from 'react'
import { Mail01 } from '@untitled-ui/icons-react'
import SimpleBar from 'simplebar-react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { MyButton, MyTextField, WhatsApp, MyAvatar } from '@interstellar-component'
import { ProfileSchema } from './schema'
import { useProfile } from './context'
import { handleError, checkErrorYup } from '../../services/Helper'
import Password from './components/Password'

function Profile() {
  const { getProfile, updateProfile } = useProfile()

  const [initialValues, setInitialValues] = useState({
    name: '',
    username: '',
    email: '',
    whatsapp: '',
    photo: '',
    role: '',
  })

  const {
    setValue,
    handleSubmit,
    control,
    watch,
    trigger,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: yupResolver(ProfileSchema),
  })
  const watched = watch()
  const { photo, name } = watched
  const [role, setRole] = useState(null)
  const [isProfileLoaded, setIsProfileLoaded] = useState(false)

  const hasChanges =
    isProfileLoaded &&
    ((watched.name ?? '').trim() !== (initialValues.name ?? '').trim() ||
      (watched.email ?? '').trim() !== (initialValues.email ?? '').trim() ||
      (watched.username ?? '').trim() !== (initialValues.username ?? '').trim() ||
      (watched.whatsapp ?? '').trim() !== (initialValues.whatsapp ?? '').trim() ||
      watched.photo instanceof File ||
      watched.delete_photo === true)
  // console.log('error', errors)

  const onSubmit = handleSubmit(handleError(updateProfile, control), checkErrorYup)

  useEffect(() => {
    getProfile().then((data) => {
      setInitialValues({
        name: data?.name ?? '',
        username: data?.username ?? '',
        email: data?.email ?? '',
        whatsapp: data?.whatsapp ?? '',
        photo: data?.photo_url ?? '',
        role: data?.role?.name ?? '',
      })
      setValue('name', data?.name)
      setValue('username', data?.username)
      setValue('email', data?.email)
      setValue('whatsapp', data?.whatsapp)
      setValue('photo', data?.photo_url)
      setValue('role', data?.role?.name)
      setRole(data?.role?.name)
      setIsProfileLoaded(true)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCancel = () => {
    Object.keys(initialValues).forEach((key) => {
      setValue(key, initialValues[key])
    })
    setValue('delete_photo', false)
  }

  return (
    <SimpleBar forceVisible="y" style={{ height: '100%' }}>
      <div className="relative -top-28 mb-12 bg-brand/600">
        <div className="relative top-28 mx-4 mt-16 flex gap-6 px-2 md:mx-10 md:mt-20 md:px-0 max-sm:flex-col max-sm:items-center">
          <div className="rounded-full p-1 ring-4 ring-inset ring-white max-sm:ring-transparent">
            <MyAvatar size={160} iconSize={48} photo={photo} />
          </div>
          <div className="flex flex-col justify-center max-sm:items-center max-sm:text-center">
            <p className="text-lg-semibold mt-10 text-gray-light/900 max-sm:mt-4">{name ?? ''}</p>
            <p className="text-sm-regular">{role ?? ''}</p>
          </div>
        </div>
        <hr className="h-3 border-t-0 bg-brand/900" />
      </div>

      <div className="px-4 md:px-8">
        <form className="flex flex-col gap-6 md:flex-row md:gap-8" onSubmit={onSubmit}>
          <div className="w-full shrink-0 md:w-[340px]">
            <p className="text-md-semibold">Personal Info</p>
            <p className="text-sm-regular">Update your photo and personal details.</p>
          </div>
          <div className="flex min-w-0 w-full flex-col rounded-xl border-2">
            <div className="flex flex-col gap-y-6 border-b-2 p-4 md:p-6">
              <div>
                {/* name */}
                <label htmlFor="name" className="text-sm-medium text-gray-light/700">
                  Full name
                </label>
                <MyTextField
                  name="name"
                  control={control}
                  //   errors={errors?.name}
                />
              </div>

              <div>
                {/* email */}
                <label htmlFor="email" className="text-sm-medium text-gray-light/700">
                  Email address
                </label>
                <MyTextField
                  name="email"
                  trigger={trigger}
                  control={control}
                  //   errors={errors?.email}
                  startAdornment={<Mail01 stroke="grey" />}
                />
              </div>

              <div className="flex flex-col gap-4 max-sm:items-start md:flex-row md:flex-1 md:items-end">
                <label htmlFor="fileInput" />
                <MyAvatar id="newLogo" size={64} photo={photo} />
                <div className="flex flex-wrap justify-start gap-3 md:ml-5 md:flex-1 md:gap-5">
                  <MyButton
                    color="gray"
                    variant="text"
                    onClick={() => {
                      setValue('photo', null)
                      setValue('delete_photo', true)
                    }}
                  >
                    <p className="text-sm-semibold">Delete</p>
                  </MyButton>
                  <input
                    accept=".png,.jpeg,.jpg"
                    id="photo"
                    type="file"
                    className="hidden"
                    multiple={false}
                    onChange={(e) => {
                      setValue('photo', e.target.files[0])
                    }}
                  />
                  <MyButton
                    color="primary"
                    variant="text"
                    onClick={() => {
                      setValue('delete_photo', false)
                    }}
                  >
                    <label htmlFor="photo" className="text-sm-semibold hover:cursor-pointer">
                      Update
                    </label>
                  </MyButton>
                </div>
              </div>
            </div>

            <footer className="flex flex-wrap justify-end gap-3 px-4 py-4 md:px-6">
              <MyButton color="secondary" variant="outlined" size="sm" onClick={handleCancel}>
                <p className="text-sm-semibold">Cancel</p>
              </MyButton>
              <MyButton
                color="primary"
                variant="filled"
                size="sm"
                type="submit"
                disabled={isSubmitting || !hasChanges}
              >
                <p className="text-sm-semibold">Save changes</p>
              </MyButton>
            </footer>
          </div>
        </form>

        <hr className="my-5" />
        <Password />
      </div>
    </SimpleBar>
  )
}

export default Profile
