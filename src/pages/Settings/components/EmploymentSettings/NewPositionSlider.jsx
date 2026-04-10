import { useEffect, useState } from 'react'
import { XClose } from '@untitled-ui/icons-react'
import { MyButton, MyTextField } from '@interstellar-component'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { checkErrorYup, handleError } from '@src/services/Helper'
import { useEmploymentSettings } from './Context'

const schema = yup.object({
  name: yup.string().trim().required('Position name is required'),
})

export default function NewPositionSlider({
  open,
  mode = 'create',
  initialData,
  onClose,
  inModalSlider = false,
}) {
  const [isVisible, setIsVisible] = useState(false)
  const { createEmploymentPosition, updateEmploymentPosition, setErr } = useEmploymentSettings()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
    },
  })

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData) {
        reset({
          name: initialData.name ?? '',
        })
      } else {
        reset({ name: '' })
      }
      const frame = requestAnimationFrame(() => setIsVisible(true))
      return () => cancelAnimationFrame(frame)
    }
    setIsVisible(false)
    return undefined
  }, [open, mode, initialData, reset])

  useEffect(() => () => setErr(null), [setErr])

  const animateClose = () => {
    if (inModalSlider) {
      onClose()
      reset()
      return
    }
    setIsVisible(false)
    setTimeout(() => {
      onClose()
      reset()
    }, 300)
  }

  const onSubmit = handleSubmit(
    handleError(
      async (data) => {
        if (mode === 'edit') {
          await updateEmploymentPosition(data)
        } else {
          await createEmploymentPosition(data)
        }
        animateClose()
      },
      control
    ),
    checkErrorYup
  )

  if (inModalSlider) {
    if (!open) return null
  } else if (!open && !isVisible) {
    return null
  }

  const formClassName = inModalSlider
    ? 'flex h-full min-h-0 w-[375px] flex-col overflow-hidden border-l border-gray-200 bg-white font-inter'
    : 'flex w-[375px] flex-col border-l border-gray-200 bg-white shadow-xl font-inter'

  const formEl = (
    <form className={formClassName} onSubmit={onSubmit} noValidate>
      <div className="flex flex-1 flex-col overflow-y-auto">
        <header className="border-b border-gray-200 px-6 pb-4 pt-8">
          <div className="flex flex-col gap-1">
            <p className="text-lg font-semibold text-gray-900">
              {mode === 'edit' ? 'Edit Position' : 'New Position'}
            </p>
            <p className="pr-6 text-sm font-medium leading-relaxed text-gray-500">
              {mode === 'edit'
                ? 'Update the position.'
                : 'Define a position and fill the field to complete.'}
            </p>
          </div>
        </header>

        <div className="mt-8 px-4 pb-8">
          <div className="rounded-xl border border-gray-200 bg-gray-25 shadow-xs">
            <div className="px-5 pb-2 pt-3">
              <h3 className="text-sm font-semibold text-gray-900">Position Information</h3>
            </div>
            <div className="flex flex-col gap-4 overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-sm font-medium text-gray-700 after:ml-0.5 after:text-blue-500 after:content-['*']"
                  htmlFor="position-name"
                >
                  Position Name
                </label>
                <MyTextField
                  name="name"
                  control={control}
                  placeholder="e.g. Product Manager"
                  errors={errors?.name?.message}
                  onChangeForm={() => setErr(null)}
                  cypress="position-name"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 bg-white px-6 py-4">
        <div className="flex flex-row items-center gap-3">
          <MyButton
            expanded
            color="secondary"
            size="md"
            variant="outlined"
            onClick={animateClose}
            type="button"
            disabled={isSubmitting}
          >
            Cancel
          </MyButton>
          <MyButton
            expanded
            color="primary"
            size="md"
            variant="filled"
            type="submit"
            disabled={isSubmitting}
            cypress="submit-position"
          >
            Submit
          </MyButton>
        </div>
      </div>
    </form>
  )

  if (inModalSlider) {
    return formEl
  }

  return (
    <>
      <div
        role="presentation"
        className={`fixed inset-0 z-40 bg-gray-950/70 backdrop-blur-md transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={animateClose}
      />

      <div
        className={`fixed right-0 top-0 z-50 flex h-full items-stretch pl-10 transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          type="button"
          onClick={animateClose}
          className="absolute left-[344px] top-3 z-10 rounded-lg p-2 text-gray-400 transition-colors hover:text-gray-600"
        >
          <XClose size={20} />
        </button>
        {formEl}
      </div>
    </>
  )
}
