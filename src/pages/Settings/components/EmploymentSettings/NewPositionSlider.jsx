import { useEffect, useState } from 'react'
import { XClose } from '@untitled-ui/icons-react'
import { MyButton } from '@interstellar-component'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const schema = yup.object().shape({
  positionName: yup.string().required('Position name is required'),
})

export default function NewPositionSlider({ open, mode = 'create', initialData, onClose }) {
  const [isVisible, setIsVisible] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      positionName: '',
    },
  })

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData) {
        reset({
          positionName: initialData.name || '',
        })
      } else {
        reset({
          positionName: '',
        })
      }
      const frame = requestAnimationFrame(() => setIsVisible(true))
      return () => cancelAnimationFrame(frame)
    }
    setIsVisible(false)
    return undefined
  }, [open, mode, initialData, reset])

  const animateClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  const onSubmit = handleSubmit(() => {
    animateClose()
  })

  if (!open && !isVisible) return null

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
          onClick={animateClose}
          className="absolute left-[344px] top-3 z-10 rounded-lg p-2 text-gray-400 transition-colors hover:text-gray-600"
        >
          <XClose size={20} />
        </button>

        <form
          className="flex w-[375px] flex-col border-l border-gray-200 bg-white shadow-xl font-inter"
          onSubmit={onSubmit}
        >
          <div className="flex flex-1 flex-col overflow-y-auto">
            <header className="px-6 pb-4 pt-8 border-b border-gray-200">
              <div className="flex flex-col gap-1">
                <p className="text-lg font-semibold text-gray-900">
                  {mode === 'edit' ? 'Edit Position' : 'New Position'}
                </p>
                <p className="text-sm text-gray-500 font-medium leading-relaxed pr-6">
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
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs p-4 flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      Position Name<span className="text-error-500 ml-0.5">*</span>
                    </label>
                    <Controller
                      name="positionName"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          placeholder="e.g. Product Manager"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                        />
                      )}
                    />
                    {errors.positionName && (
                      <span className="text-xs text-error-500">
                        {errors.positionName.message}
                      </span>
                    )}
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
              >
                Cancel
              </MyButton>
              <MyButton expanded color="primary" size="md" variant="filled" type="submit">
                Submit
              </MyButton>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
