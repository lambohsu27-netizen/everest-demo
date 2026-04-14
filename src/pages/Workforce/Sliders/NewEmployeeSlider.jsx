import { useEffect, useMemo, useState } from 'react'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import SimpleBar from 'simplebar-react'
import { XClose, User01, Mail01 } from '@untitled-ui/icons-react'
import {
  MyButton,
  MyTextField,
  MyAsyncDropdown,
  MyDoubleCard,
  MyHorizontalTabV2,
  WhatsApp,
  myToaster,
} from '@interstellar-component'
import { useWorkforce } from '../Context'
import { WorkforceService } from '../service'

const schema = yup.object({
  category: yup.string().required('Category is required'),
  entity: yup.object().nullable().required('Entity is required'),
  fullName: yup.string().required('Full name is required'),
  level: yup.object().nullable().required('Level is required'),
  position: yup.object().nullable().required('Position is required'),
  whatsapp: yup.string().required('WhatsApp number is required'),
  email: yup.string().email('Invalid email').optional(),
})

function pickIdNameList(res) {
  const list = Array.isArray(res?.data) ? res.data : []
  return list.map((item) => ({ id: item.id, name: item.name ?? item.title ?? '' }))
}

function FieldLabel({ children, required }) {
  return (
    <p className="text-sm-medium text-gray/700 mb-1">
      {children}
      {required && <span className="ml-0.5 text-error/500">*</span>}
    </p>
  )
}

function NewEmployeeSlider({ mode, employee, onClose } = {}) {
  const { handleCurrentSlider, getWorkforce, currentSlider, fetchWorkforceDetail } = useWorkforce()

  const isEdit = mode === 'edit' || currentSlider?.mode === 'edit'
  const editingEmployee = employee ?? currentSlider?.employee ?? null
  const editingId = editingEmployee?.id ?? null
  const closeSlider = () => {
    if (typeof onClose === 'function') onClose()
    else handleCurrentSlider(null)
  }

  const [fullEmployee, setFullEmployee] = useState(null)
  const [isPrefillReady, setIsPrefillReady] = useState(!isEdit)

  // Edit mode: fetch full detail for employment_detail IDs
  useEffect(() => {
    if (!isEdit || !editingId) return undefined
    let cancelled = false
    ;(async () => {
      try {
        const res = await WorkforceService.getWorkforceDetail(editingId)
        const data = res?.data !== undefined ? res.data : res
        if (!cancelled) {
          setFullEmployee(data)
          setIsPrefillReady(true)
        }
      } catch (e) {
        if (!cancelled) {
          myToaster(e)
          setIsPrefillReady(true)
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [isEdit, editingId])

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      category: 'Candidate',
      entity: null,
      fullName: '',
      level: null,
      position: null,
      whatsapp: '',
      email: '',
    },
  })

  useEffect(() => {
    if (!isEdit || !editingEmployee || !isPrefillReady) return
    const src = { ...(editingEmployee ?? {}), ...(fullEmployee ?? {}) }
    const ed = fullEmployee?.employment_detail ?? {}
    const companyId = src.company?.id ?? src.company_id ?? ed.company_id
    const companyName = src.company?.name ?? ed.company?.name
    const levelId =
      src.employment_level?.id ?? src.employment_level_id ?? ed.employment_level_id
    const levelName = src.employment_level?.name ?? ed.employment_level?.name
    const positionId = src.position?.id ?? src.position_id ?? ed.position_id
    const positionName = src.position?.name ?? ed.position?.name

    const cat = typeof src.category === 'string' ? src.category : 'candidate'
    reset({
      category: cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase(),
      entity: companyId ? { id: companyId, name: companyName ?? '' } : null,
      fullName: src.full_name ?? '',
      level: levelId ? { id: levelId, name: levelName ?? '' } : null,
      position: positionId ? { id: positionId, name: positionName ?? '' } : null,
      whatsapp: src.phone ?? '',
      email: src.email ?? '',
    })
  }, [isEdit, editingEmployee, fullEmployee, isPrefillReady, reset])

  const asyncEntityOptions = useMemo(
    () => async (paramsArg) => {
      try {
        const res = await WorkforceService.getCompanyOptions({
          search: paramsArg?.search ?? '',
        })
        return { loading: false, data: pickIdNameList(res) }
      } catch {
        return { loading: false, data: [] }
      }
    },
    []
  )

  const asyncLevelOptions = useMemo(
    () => async (paramsArg) => {
      try {
        const res = await WorkforceService.getLevelOptions({
          limit: 100,
          ...(paramsArg?.search ? { search: paramsArg.search } : {}),
        })
        return { loading: false, data: pickIdNameList(res) }
      } catch {
        return { loading: false, data: [] }
      }
    },
    []
  )

  const asyncPositionOptions = useMemo(
    () => async (paramsArg) => {
      try {
        const res = await WorkforceService.getPositionOptions({
          limit: 100,
          ...(paramsArg?.search ? { search: paramsArg.search } : {}),
        })
        return { loading: false, data: pickIdNameList(res) }
      } catch {
        return { loading: false, data: [] }
      }
    },
    []
  )

  const onSubmit = handleSubmit(async (values) => {
    const basePayload = {
      full_name: values.fullName,
      company_id: values.entity?.id,
      employment_level_id: values.level?.id,
      position_id: values.position?.id,
      phone: values.whatsapp,
      ...(values.email ? { email: values.email } : {}),
    }
    try {
      if (isEdit && editingId) {
        await WorkforceService.updateWorkforce(editingId, basePayload)
        myToaster({ status: 'success', message: 'Employee updated successfully.' })
        await fetchWorkforceDetail(editingId)
      } else {
        await WorkforceService.createWorkforce({
          ...basePayload,
          category: values.category.toLowerCase(),
        })
        myToaster({ status: 'success', message: 'Employee created successfully.' })
      }
      closeSlider()
      await getWorkforce()
    } catch (e) {
      myToaster(e)
    }
  })

  const handleClose = () => closeSlider()

  return (
    <div className="flex h-screen w-[420px] flex-col">
      <header className="relative flex items-start gap-x-4 px-6 py-6 border-b border-gray/100">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-[12px] top-[12px] flex h-10 w-10 items-center justify-center rounded-lg p-2 text-gray-light/400 hover:bg-gray-light/50 active:bg-gray-light/100"
        >
          <XClose size={24} stroke="currentColor" />
        </button>

        <div className="flex flex-1 flex-col gap-1 pt-1">
          <p className="text-lg-semibold text-gray/900">
            {isEdit ? 'Edit employee' : 'New employee'}
          </p>
          <p className="text-sm-regular text-gray/600">
            {isEdit
              ? 'Update employee details and save your changes.'
              : 'Enter employee details to save them in the system.'}
          </p>
        </div>
      </header>

      <form noValidate onSubmit={onSubmit} className="flex flex-1 flex-col overflow-hidden">
        <section className="flex-1 overflow-hidden">
          <SimpleBar forceVisible="y" style={{ maxHeight: '100%' }}>
            <div className="flex flex-col gap-6 px-6 py-6">
              <MyDoubleCard heading="General Information" innerClassName="p-4">
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5">
                    <FieldLabel>Category</FieldLabel>
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <MyHorizontalTabV2
                          fitContent
                          value={field.value}
                          onChange={field.onChange}
                          tabs={[
                            { label: 'Candidate', value: 'Candidate' },
                            { label: 'Employee', value: 'Employee' },
                          ]}
                        />
                      )}
                    />
                    {errors.category && (
                      <p className="text-xs text-error/500 mt-0.5">{errors.category.message}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <FieldLabel required>Entity</FieldLabel>
                    <Controller
                      name="entity"
                      control={control}
                      render={({ field }) => (
                        <MyAsyncDropdown
                          asyncFunction={asyncEntityOptions}
                          value={field.value}
                          placeholder="Select entity"
                          error={errors?.entity?.message}
                          isOptionEqualToValue={(option, val) => option?.id === val?.id}
                          getOptionLabel={(e) => e?.name || ''}
                          onChange={(_e, val) => field.onChange(val)}
                        />
                      )}
                    />
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <FieldLabel required>Full name</FieldLabel>
                    <MyTextField
                      name="fullName"
                      control={control}
                      placeholder="e.g. Kania Elfira"
                      errors={errors?.fullName?.message}
                      startAdornment={<User01 className="size-4 text-gray/400" />}
                    />
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <FieldLabel required>Level</FieldLabel>
                    <Controller
                      name="level"
                      control={control}
                      render={({ field }) => (
                        <MyAsyncDropdown
                          asyncFunction={asyncLevelOptions}
                          value={field.value}
                          placeholder="Select level"
                          error={errors?.level?.message}
                          isOptionEqualToValue={(option, val) => option?.id === val?.id}
                          getOptionLabel={(e) => e?.name || ''}
                          onChange={(_e, val) => field.onChange(val)}
                        />
                      )}
                    />
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <FieldLabel required>Position</FieldLabel>
                    <Controller
                      name="position"
                      control={control}
                      render={({ field }) => (
                        <MyAsyncDropdown
                          asyncFunction={asyncPositionOptions}
                          value={field.value}
                          placeholder="Select position"
                          error={errors?.position?.message}
                          isOptionEqualToValue={(option, val) => option?.id === val?.id}
                          getOptionLabel={(e) => e?.name || ''}
                          onChange={(_e, val) => field.onChange(val)}
                        />
                      )}
                    />
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <FieldLabel required>WhatsApp</FieldLabel>
                    <MyTextField
                      name="whatsapp"
                      control={control}
                      placeholder="e.g. 0817766544"
                      errors={errors?.whatsapp?.message}
                      startAdornment={<WhatsApp className="size-4 text-success/500" />}
                    />
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <FieldLabel>Email</FieldLabel>
                    <MyTextField
                      name="email"
                      control={control}
                      placeholder="e.g. kania.elfira@starling.com"
                      errors={errors?.email?.message}
                      startAdornment={<Mail01 className="size-4 text-gray/400" />}
                    />
                    <p className="text-xs-regular text-gray/500 mt-0.5">
                      Used as an alternative method for sending the form link.
                    </p>
                  </div>
                </div>
              </MyDoubleCard>
            </div>
          </SimpleBar>
        </section>

        <footer className="flex items-center justify-end gap-3 border-t border-gray/200 px-6 py-4">
          <MyButton
            type="button"
            color="secondary"
            variant="outlined"
            size="md"
            onClick={handleClose}
          >
            <p className="text-sm-semibold">Cancel</p>
          </MyButton>

          <MyButton type="submit" color="primary" variant="filled" size="md" disabled={isSubmitting}>
            <p className="text-sm-semibold">{isSubmitting ? 'Submitting...' : 'Submit'}</p>
          </MyButton>
        </footer>
      </form>
    </div>
  )
}

export default NewEmployeeSlider
