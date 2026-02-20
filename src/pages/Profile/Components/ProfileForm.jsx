import { useCallback, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  MyTextField,
  MyButton,
  WhatsApp,
  MyAvatar,
  MyAsyncDropdown,
  myToaster,
} from '@interstellar-component'
import { schema } from '../schema'
import { useLogin } from '../../Login/Context'
import { Mail01 } from '@untitled-ui/icons-react'
import { get } from '../../../services/NetworkUtils'

function ProfileForm() {
  const {
    getUser,
    User,
    updateProfile,
    isProfileSliderOpen,
    setIsProfileSliderOpen,
  } = useLogin()

  const {
    setValue,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    trigger,
    watch,
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
  })
  const { name, email, username, whatsapp, branch, photo } = watch()
  console.log('errors', errors)

  useEffect(() => {
    getUser().catch(() => {})
  }, [])

  useEffect(() => {
    if (User?.data) {
      const { id, name, email, nip, whatsapp, photo_url, branch } = User.data
      setValue('id', id)
      setValue('name', name)
      setValue('email', email)
      setValue('nip', nip)
      setValue('whatsapp', whatsapp)
      setValue('photo', photo_url)
      setValue('branch', branch)
      setValue('delete_photo', false)
    }
  }, [User, setValue])

  const onSubmit = handleSubmit(async (data) => {
    try {
      await updateProfile(data, User?.data?.should_change_password)
    } catch (error) {
      /* empty */
    }
  })

  const Service = useMemo(
    () => ({
      searchBranch: async (params) =>
        await get(`/v1/option/branch-list`, params),
    }),
    []
  )

  const searchBranch = useCallback(
    (searchParams) => Service.searchBranch(searchParams).catch(myToaster),
    [Service]
  )

  return (
    <form className="flex flex-col gap-6 px-4 pb-3" onSubmit={onSubmit}>
      <section className="flex flex-1 flex-col gap-4">
        {/* PERSONAL INFO */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 shadow-sm">
          <label className="text-sm-semibold block px-5 pb-2 pt-3 text-gray-900">
            Personal info
          </label>
          <div className="flex flex-col gap-y-4 rounded-xl bg-white px-5 py-5 pb-3 outline outline-1 outline-gray-200">
            {/* name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm-medium text-gray/700 after:ml-0.5 after:text-brand/600 after:content-['*']">
                Nama lengkap
              </label>
              <MyTextField
                disabled={true}
                name="name"
                placeholder="Enter Full Name"
                control={control}
                trigger={trigger}
                //   disabled={isArchived}
                errors={errors?.name?.message}
                focusColor={'#0A2349'}
                focusShadow={'#DCE3F1'}
              />
            </div>
            {/* WhatsApp */}
            <div className="flex flex-col gap-2">
              <label className="text-sm-medium text-gray/700 after:ml-0.5 after:text-brand/600 after:content-['*']">
                Nomor telpon
              </label>
              <MyTextField
                name="whatsapp"
                placeholder="Enter WhatsApp"
                control={control}
                trigger={trigger}
                type="number"
                //   disabled={isArchived}
                errors={errors?.name?.message}
                startAdornment={<WhatsApp />}
                focusColor={'#0A2349'}
                focusShadow={'#DCE3F1'}
              />
            </div>
            {/* Username */}
            <div className="flex flex-col gap-2">
              <label className="text-sm-medium text-gray/700 after:ml-0.5 after:text-brand/600 after:content-['*']">
                Nip
              </label>
              <MyTextField
                name="nip"
                placeholder="Masukkan NIP"
                control={control}
                trigger={trigger}
                disabled={1}
                errors={errors?.nip?.message}
                focusColor={'#0A2349'}
                focusShadow={'#DCE3F1'}
              />
            </div>
            {/* email */}
            <div className="flex flex-col gap-2">
              <label className="text-sm-medium text-gray/700 after:ml-0.5 after:text-brand/600 after:content-['*']">
                Email
              </label>
              <MyTextField
                name="email"
                placeholder="Enter Email"
                control={control}
                trigger={trigger}
                disabled={1}
                errors={errors?.name?.message}
                startAdornment={<Mail01 />}
                focusColor={'#0A2349'}
                focusShadow={'#DCE3F1'}
              />
            </div>
            {/* Penempatan */}
            <div className="flex flex-col gap-2">
              <label className="text-sm-medium text-gray/700 after:ml-0.5 after:text-brand/600 after:content-['*']">
                Penempatan
              </label>
              <MyAsyncDropdown
                trigger={trigger}
                disabled={1}
                getOnRender={false}
                name={'branch'}
                placeholder={'Pilih penempatan'}
                control={control}
                error={errors?.branch?.message}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(e) => e?.name}
                value={branch}
                focusColor={'#0A2349'}
                focusShadow={'#DCE3F1'}
                asyncFunction={searchBranch}
                onChange={(e, value) => {
                  setValue('branch', value)
                }}
              />
            </div>
            {/* AVATAR PROFILE */}
            <section className="">
              <p className="text-sm-semibold text-gray-light/700">
                Photo profile
              </p>
              <p className="text-sm-regular text-gray-light/600">
                This will be displayed on user profile picture.
              </p>
            </section>
            <div className="flex justify-between">
              <MyAvatar size={64} photo={photo} />
              <div className="flex gap-2">
                <MyButton
                  onClick={() => {
                    setValue('photo', null)
                    setValue('delete_photo', true)
                  }}
                  color="gray"
                  variant="text"
                  // disabled={isArchived}
                >
                  <p className="text-sm-semibold text-error/500">Hapus</p>
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
                  // disabled={isArchived}
                />
                <MyButton
                  color="primary"
                  variant="text"
                  // disabled={isArchived}
                >
                  <label
                    htmlFor="photo"
                    className={`text-sm-semibold cursor-pointer`}
                  >
                    Perbaharui
                  </label>
                </MyButton>
              </div>
            </div>
            <div className="flex items-center justify-end gap-4 border-t border-gray-light/200 bg-white pt-3">
              <MyButton
                disabled={isSubmitting}
                onClick={() => setIsProfileSliderOpen(false)}
                type="reset"
                color="secondary"
                variant="outlined"
                size="md"
              >
                <span className="text-sm-semibold">Reset</span>
              </MyButton>
              <MyButton
                disabled={isSubmitting}
                type="submit"
                color="primary"
                variant="filled"
                size="md"
                // onClick={() => {
                //   setIsChangePass(false)
                //   setIsProfileSliderOpen(false)
                // }}
              >
                <span className="text-sm-semibold">Simpan</span>
              </MyButton>
            </div>
          </div>
        </div>
      </section>
    </form>
  )
}

export default ProfileForm
