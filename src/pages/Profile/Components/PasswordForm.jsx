import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { MyTextField, MyButton } from '@interstellar-component'
import { PasswordSchema } from '../schema'
import { useLogin } from '../../Login/Context'
import { Check, Eye, EyeOff } from '@untitled-ui/icons-react'

function PasswordForm() {
  const { changePassword, isProfileSliderOpen, setIsProfileSliderOpen } =
    useLogin()
  const [isChangePass, setIsChangePass] = useState(false)
  const [show, setShow] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    setValue,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    trigger,
    setFocus,
    setError,
    watch,
  } = useForm({
    mode: 'all',
    resolver: yupResolver(PasswordSchema),
  })

  const { new_password } = watch()

  const passwordChecks = {
    containUppercase: /[A-Z]/.test(new_password),
    containLowercase: /[a-z]/.test(new_password),
    containNumber: /\d/.test(new_password),
    containSpecialCharacter: /[@$!%*?&#\-+=~^|`_'";:/.,\\]/.test(new_password),
    minimumLength: new_password?.length >= 8,
  }

  const resetForm = () => {
    setValue('old_password', '')
    setValue('new_password', '')
    setValue('confirm_password', '')
  }

  const onSubmit = handleSubmit(async (data) => {
    try {
      await changePassword(data)
      resetForm()
    } catch (error) {
      setValue('new_password', '')
      setValue('confirm_password', '')
      // setFocus('new_password')
      // console.log({error})
      setError('new_password', { message: error.message })
    }
  })

  return (
    <form className="flex flex-col gap-6 px-4" onSubmit={onSubmit}>
      <section className="flex flex-1 flex-col gap-4">
        {/* PERSONAL INFO */}
        <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 shadow-sm">
          <label className="text-sm-semibold block px-5 pb-2 pt-3 text-gray-900">
            Password
          </label>
          <div className="flex flex-col gap-y-4 rounded-xl bg-white px-5 py-5 pb-3 outline outline-1 outline-gray-200">
            {/* Current Pass */}
            <div className="flex flex-col gap-2">
              <label className="text-sm-medium text-gray-700 after:ml-0.5 after:text-brand-600 after:content-['*']">
                Password sekarang
              </label>
              <MyTextField
                type={show ? 'text' : 'password'}
                name="old_password"
                placeholder="Masukkan password sekarang"
                control={control}
                trigger={trigger}
                //   disabled={isArchived}
                errors={errors?.name?.message}
                focusColor={'#0A2349'}
                focusShadow={'#DCE3F1'}
                endAdornment={
                  <span
                    onClick={() => setShow(!show)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setShow(!show)
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    style={{
                      padding: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    {show ? (
                      <Eye width={17} height={17} />
                    ) : (
                      <EyeOff width={17} height={17} />
                    )}
                  </span>
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm-medium text-gray-700 after:ml-0.5 after:text-brand-600 after:content-['*']">
                  Password baru
                </label>
                <MyTextField
                  type={showNew ? 'text' : 'password'}
                  name="new_password"
                  placeholder="Masukkan password baru"
                  control={control}
                  trigger={trigger}
                  //   disabled={isArchived}
                  // errors={errors?.name?.message}
                  // isError={errors?.new_password?.message}
                  showErrorMessage={false}
                  focusColor={'#0A2349'}
                  focusShadow={'#DCE3F1'}
                  endAdornment={
                    <span
                      onClick={() => setShowNew(!showNew)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setShowNew(!showNew)
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      style={{
                        padding: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      {showNew ? (
                        <Eye width={17} height={17} />
                      ) : (
                        <EyeOff width={17} height={17} />
                      )}
                    </span>
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className={`flex items-center rounded-full p-[5px] ${passwordChecks.minimumLength ? 'bg-brand-600' : 'border border-gray-200'}`}>
                    {
                      passwordChecks.minimumLength ? (
                        <Check className="size-4 h-[10px] w-[10px] text-white" />
                      ) : (
                        <div className="size-4 h-[8px] w-[8px] bg-gray-300 rounded-full" />
                      )
                    }
                  </div>
                  <p className="text-sm-regular text-gray-500">
                    Minimal 8 karakter
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`flex items-center rounded-full p-[5px] ${passwordChecks.containUppercase && passwordChecks.containLowercase ? 'bg-brand-600' : 'border border-gray-200'}`}>
                    {
                      passwordChecks.containUppercase && passwordChecks.containLowercase ? (
                        <Check className="size-4 h-[10px] w-[10px] text-white" />
                      ) : (
                        <div className="size-4 h-[8px] w-[8px] bg-gray-300 rounded-full" />
                      )
                    }
                  </div>
                  <p className="text-sm-regular text-gray-500">
                    Mengandung huruf besar dan kecil
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`flex items-center rounded-full p-[5px] ${passwordChecks.containNumber ? 'bg-brand-600' : 'border border-gray-200'}`}>
                    {
                      passwordChecks.containNumber ? (
                        <Check className="size-4 h-[10px] w-[10px] text-white" />
                      ) : (
                        <div className="size-4 h-[8px] w-[8px] bg-gray-300 rounded-full" />
                      )
                    }
                  </div>
                  <p className="text-sm-regular text-gray-500">
                    Mengandung angka
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`flex items-center rounded-full p-[5px] ${passwordChecks.containSpecialCharacter ? 'bg-brand-600' : 'border border-gray-200'}`}>
                    {
                      passwordChecks.containSpecialCharacter ? (
                        <Check className="size-4 h-[10px] w-[10px] text-white" />
                      ) : (
                        <div className="size-4 h-[8px] w-[8px] bg-gray-300 rounded-full" />
                      )
                    }
                  </div>
                  <p className="text-sm-regular text-gray-500">
                    Mengandung spesial karakter
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm-medium text-gray-700 after:ml-0.5 after:text-brand-600 after:content-['*']">
                Konfirmasi password baru
              </label>
              <MyTextField
                type={showConfirm ? 'text' : 'password'}
                name="confirm_password"
                placeholder="Masukkan konfirmasi password baru"
                control={control}
                trigger={trigger}
                //   disabled={isArchived}
                errors={errors?.name?.message}
                focusColor={'#0A2349'}
                focusShadow={'#DCE3F1'}
                endAdornment={
                  <span
                    onClick={() => setShowConfirm(!showConfirm)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setShowConfirm(!showConfirm)
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    style={{
                      padding: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    {showConfirm ? (
                      <Eye width={17} height={17} />
                    ) : (
                      <EyeOff width={17} height={17} />
                    )}
                  </span>
                }
              />
            </div>

            <div className="flex items-center justify-end gap-4 border-t border-gray-light-200 bg-white pt-3">
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

export default PasswordForm
