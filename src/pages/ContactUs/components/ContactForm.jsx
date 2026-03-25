import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { MyButton, MyTextField } from '@interstellar-component'

import ContactUsSchema from '../schema'

function ContactForm() {
  const {
    control,
    handleSubmit,
    trigger,
    watch,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(ContactUsSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: '',
      agree: false,
    },
  })

  const onSubmit = handleSubmit(() => {
    // Submit real data
  })

  // Watch fields
  const { firstName, lastName, email, phone } = watch()

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center justify-center gap-16 px-8">
      <div className="flex w-full flex-col items-center justify-center gap-5 text-center">
        <div className="flex flex-col items-center justify-center gap-3">
          <span className="text-base font-semibold text-brand/700">Contact us</span>
          <h2 className="text-4xl font-semibold tracking-tight text-[#101828]">Get in touch</h2>
        </div>
        <p className="text-xl text-[#535862]">
          We’d love to hear from you. Please fill out this form.
        </p>
      </div>

      <div className="flex w-full max-w-[480px] flex-col">
        <form onSubmit={onSubmit} className="flex w-full flex-col gap-8">
          <div className="flex w-full flex-col gap-6">
            <div className="flex w-full flex-col gap-6 md:flex-row">
              <div className="flex flex-1 flex-col gap-[6px]">
                <label className="text-sm font-medium text-gray-700">
                  First name <span className="text-brand/600">*</span>
                </label>
                <MyTextField
                  name="firstName"
                  trigger={trigger}
                  placeholder="First name"
                  control={control}
                  value={firstName}
                  errors={errors?.firstName?.message}
                  focusColor="#01172D"
                  focusShadow="#E6EBF0"
                />
              </div>
              <div className="flex flex-1 flex-col gap-[6px]">
                <label className="text-sm font-medium text-gray-700">
                  Last name <span className="text-brand/600">*</span>
                </label>
                <MyTextField
                  name="lastName"
                  trigger={trigger}
                  placeholder="Last name"
                  control={control}
                  value={lastName}
                  errors={errors?.lastName?.message}
                  focusColor="#01172D"
                  focusShadow="#E6EBF0"
                />
              </div>
            </div>

            <div className="flex flex-col gap-[6px]">
              <label className="text-sm font-medium text-gray-700">
                Email <span className="text-brand/600">*</span>
              </label>
              <MyTextField
                name="email"
                trigger={trigger}
                placeholder="you@company.com"
                control={control}
                value={email}
                errors={errors?.email?.message}
                focusColor="#01172D"
                focusShadow="#E6EBF0"
              />
            </div>

            <div className="flex flex-col gap-[6px]">
              <label className="text-sm font-medium text-gray-700">Phone number</label>
              <MyTextField
                name="phone"
                trigger={trigger}
                placeholder="+1 (555) 000-0000"
                control={control}
                value={phone}
                errors={errors?.phone?.message}
                focusColor="#01172D"
                focusShadow="#E6EBF0"
              />
            </div>

            <div className="flex flex-col gap-[6px]">
              <label className="text-sm font-medium text-gray-700">
                Message <span className="text-brand/600">*</span>
              </label>
              <textarea
                {...register('message')}
                onChange={(e) => {
                  register('message').onChange(e)
                  trigger('message')
                }}
                className={`w-full rounded-lg border ${
                  errors?.message ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-brand/500 focus:ring-brand/500'
                } px-3 py-2.5 text-base text-gray-900 shadow-sm focus:outline-none focus:ring-1`}
                placeholder="Leave us a message..."
                rows={4}
              />
              {errors?.message && (
                <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
              )}
            </div>

            <div className="flex items-start gap-3 mt-2">
              <input
                type="checkbox"
                id="agree"
                {...register('agree')}
                onChange={(e) => {
                  register('agree').onChange(e)
                  trigger('agree')
                }}
                className={`mt-1 h-4 w-4 rounded border-gray-300 text-brand/600 focus:ring-brand/600 ${
                  errors?.agree ? 'border-red-300' : ''
                }`}
              />
              <div className="flex flex-col">
                <label htmlFor="agree" className="text-base text-[#535862]">
                  You agree to our friendly{' '}
                  <a href="/" className="underline">
                    privacy policy
                  </a>
                  .
                </label>
                {errors?.agree && (
                  <p className="mt-1 text-sm text-red-500">{errors.agree.message}</p>
                )}
              </div>
            </div>
          </div>

          <MyButton
            type="submit"
            color="primary"
            variant="filled"
            size="lg"
            expanded
            disabled={isSubmitting}
          >
            <p className="text-md-semibold">Send message</p>
          </MyButton>
        </form>
      </div>
    </div>
  )
}

export default ContactForm
