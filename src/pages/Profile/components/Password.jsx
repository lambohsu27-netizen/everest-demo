/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react'
import { Eye, EyeOff } from '@untitled-ui/icons-react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { MyButton, MyTextField, myToaster } from '@interstellar-component'
import { handleError, checkErrorYup } from '../../../services/Helper'
import ProfileService from '../service'
import { PasswordProfileSchema } from '../schema'
// import CheckIcon from '../../Forget-password/Assets/Check-icon.svg'

// function ga di context untuk keperluan reset form nya setelah ganti password
function Password() {
  const {
    reset,
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting, errors },
    setValue,
  } = useForm({
    resolver: yupResolver(PasswordProfileSchema),
    defaultValues: {
      newPassword: '',
    },
  })
  const resetForm = () => {
    reset()
    setValue('newPassword', '')
  }

  const changePassword = async (body) => {
    const formData = new FormData()
    formData.append('old_password', body.old_password)
    formData.append('new_password', body.newPassword)
    return await ProfileService.changePassword(formData).then(myToaster).then(resetForm)
  }

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const { newPassword } = watch()

  const passwordChecks = {
    containUppercase: newPassword?.length ? /[A-Z]/.test(newPassword) : false,
    containLowercase: newPassword?.length ? /[a-z]/.test(newPassword) : false,
    containNumber: newPassword?.length ? /\d/.test(newPassword) : false,
    containSpecialCharacter: newPassword?.length
      ? /[@$!%*?&#~^\-\\_+=|/]/.test(newPassword)
      : false,
    minimumLength: newPassword?.length >= 8,
  }

  // console.log(passwordChecks)

  const onSubmit = handleSubmit(handleError(changePassword, control), checkErrorYup)

  return (
    <div>
      <div className="flex gap-8 max-sm:flex-col">
        <div className="w-[340px]">
          <p className="text-md-semibold">Password</p>
          <p className="text-sm-regular">Update your password.</p>
        </div>

        <form className="mb-12 flex w-full flex-col rounded-xl border-2" onSubmit={onSubmit}>
          <section className="flex flex-col gap-y-6 border-b-2 px-8 py-6">
            <div className="flex flex-col gap-6">
              <div className="border-b-2 pb-5">
                <p className="text-lg-semibold">Password</p>
                <p className="text-sm-regular">
                  Please enter your current password to change your password
                </p>
              </div>

              <div className="flex gap-8">
                <label
                  htmlFor="old_password"
                  className="text-sm-medium w-[280px] text-gray-light/700"
                >
                  Current password
                </label>
                <MyTextField
                  name="old_password"
                  type={showCurrent ? 'text' : 'password'}
                  placeholder="Current password"
                  control={control}
                  endAdornment={
                    <div className="flex justify-center">
                      <span
                        style={{
                          padding: '4px',
                          cursor: 'pointer',
                        }}
                        onClick={() => setShowCurrent(!showCurrent)}
                      >
                        {showCurrent ? <Eye /> : <EyeOff />}
                      </span>
                    </div>
                  }
                />
              </div>

              <hr />

              <div className="flex gap-8">
                <label
                  htmlFor="newPassword"
                  className="text-sm-medium w-[280px] text-gray-light/700"
                >
                  New password
                </label>
                <MyTextField
                  name="newPassword"
                  type={showNew ? 'text' : 'password'}
                  placeholder="New password"
                  control={control}
                  endAdornment={
                    <div className="flex justify-center">
                      <span
                        onClick={() => setShowNew(!showNew)}
                        style={{
                          padding: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        {showNew ? <Eye /> : <EyeOff />}
                      </span>
                    </div>
                  }
                />
              </div>

              <div className="flex gap-8">
                <label
                  htmlFor="ConfirmPassword"
                  className="text-sm-medium w-[280px] text-gray-light/700"
                >
                  Confirm new password
                </label>
                <MyTextField
                  name="ConfirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  control={control}
                  endAdornment={
                    <div className="flex justify-center">
                      <span
                        style={{
                          padding: '4px',
                          cursor: 'pointer',
                        }}
                        onClick={() => setShowConfirm(!showConfirm)}
                      >
                        {showConfirm ? <Eye /> : <EyeOff />}
                      </span>
                    </div>
                  }
                />
              </div>
            </div>
            <div className="flex gap-8">
              <div className="w-[280px]" />
              <div className="mb-6 flex flex-col gap-y-2">
                <div className="text-sm-regular flex items-center gap-2 text-gray-light/600">
                  {/* {passwordChecks.minimumLength !== true ? (
                    <div className="">
                      <img src={CheckIcon} alt="CheckIcon" />
                    </div>
                  ) : (
                    <div className="text-success/600">
                      <CheckCircle className="size-5" />
                    </div>
                  )} */}
                  Must be at least 12 characters
                </div>
                {/* 2 */}
                <div className="text-sm-regular flex items-center gap-2 text-gray-light/600">
                  {/* {passwordChecks.containUppercase !== true ? (
                    <img src={CheckIcon} alt="CheckIcon" />
                  ) : (
                    <div className="flex items-center text-success/600">
                      <CheckCircle className="size-5" />
                    </div>
                  )} */}
                  <p className="">Password must contain at least one uppercase letter</p>
                </div>

                {/* 3 */}
                <div className="text-sm-regular flex items-center gap-2 text-gray-light/600">
                  {/* {passwordChecks.containLowercase !== true ? (
                    <img src={CheckIcon} alt="CheckIcon" />
                  ) : (
                    <div className="text-success/600">
                      <CheckCircle className="size-5" />
                    </div>
                  )} */}
                  Password must contain at least one lowercase letter
                </div>
                {/* 4 */}
                <div className="text-sm-regular flex items-center gap-2 text-gray-light/600">
                  {/* {passwordChecks.containNumber !== true ? (
                    <img src={CheckIcon} alt="CheckIcon" />
                  ) : (
                    <div className="text-success/600">
                      <CheckCircle className="size-5" />
                    </div>
                  )} */}
                  Password must contain at least one number
                </div>
                {/* 5 */}
                <div className="text-sm-regular flex items-center gap-2 text-gray-light/600">
                  {/* {passwordChecks.containSpecialCharacter !== true ? (
                    <img src={CheckIcon} alt="CheckIcon" />
                  ) : (
                    <div className="text-success/600">
                      <CheckCircle className="size-5" />
                    </div>
                  )} */}
                  Password must contain at least one special character
                </div>
              </div>
            </div>
          </section>

          <footer className="flex justify-end gap-3 px-6 py-4">
            <MyButton color="secondary" variant="outlined" size="sm" onClick={reset}>
              <p className="text-sm-semibold">Cancel</p>
            </MyButton>
            <MyButton
              color="primary"
              variant="filled"
              size="sm"
              type="submit"
              disabled={isSubmitting}
            >
              <p className="text-sm-semibold">Update password</p>
            </MyButton>
          </footer>
        </form>
      </div>
    </div>
  )
}

export default Password
