import { yupResolver } from '@hookform/resolvers/yup'
import {
  MyAsyncDropdown,
  MyButton,
  MyCheckbox,
  MyConfirmModalWithChildren,
  MyDropzone,
  MyTextArea,
} from '@interstellar-component'
import { LinkBroken02 } from '@untitled-ui/icons-react'
import PropTypes from 'prop-types'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import revokeReportSchema from './revokeReportSchema'

export default function RevokeReportForm({ open, onClose, onRevoke }) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
    setValue,
  } = useForm({
    resolver: yupResolver(revokeReportSchema),
    defaultValues: {
      reason: null,
      evidence: [],
      notes: '',
      effectiveDate: null,
      consent: false,
    },
    mode: 'onChange',
  })

  useEffect(() => {
    if (open) {
      reset()
    }
  }, [open, reset])

  const onSubmit = useCallback(
    (data) => {
      onRevoke?.(data)
      onClose()
    },
    [onRevoke, onClose]
  )

  const reasonOptions = [
    'Employee resigned',
    'Employee contract ended',
    'Consent withdrawn',
    'Incorrect subject data',
    'Duplicate monitoring',
    'Monitoring no longer required',
  ].map((label) => ({ label, value: label }))

  const effectiveOptions = ['Immediately', 'On next cycle', 'Custom date'].map((label) => ({
    label,
    value: label,
  }))

  const mockAsync = (options) => (params) =>
    Promise.resolve({
      loading: false,
      data: options.filter((o) =>
        o.label.toLowerCase().includes(params?.search?.toLowerCase() || '')
      ),
    })

  return (
    <MyConfirmModalWithChildren
      open={open}
      onClose={onClose}
      onConfirm={handleSubmit(onSubmit)}
      forceBlur
      title="Revoke form"
      message="Stop future credit monitoring enquiries for this individual."
      icon={<LinkBroken02 className="text-error/600" />}
      bgColor="bg-error/100"
      negativeActionWord="Cancel"
      positiveActionWord={
        <MyButton
          expanded
          color="error"
          variant="outlined"
          size="lg"
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid || isSubmitting}
        >
          <span className="text-sm-semibold">Revoke</span>
        </MyButton>
      }
    >
      <div className="flex flex-col gap-3">
        {/* Reason for revocation */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm-medium text-gray-light/700">
            Reason for revocation <span className="text-brand/900">*</span>
          </label>
          <MyAsyncDropdown
            name="reason"
            control={control}
            placeholder="Select reason"
            asyncFunction={mockAsync(reasonOptions)}
            error={errors?.reason?.message}
          />
        </div>

        {/* Supporting evidence */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm-medium text-gray-light/700">
            Supporting evidence (optional)
          </label>
          <MyDropzone
            accept={['.svg', '.png', '.jpg', '.gif']}
            maxSize={800 * 400} // based on Figma suggestion
            onChange={(files) => setValue('evidence', files)}
          />
        </div>

        {/* Additional notes */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm-medium text-gray-light/700">
            Additional notes <span className="text-brand/900">*</span>
          </label>
          <MyTextArea
            name="notes"
            control={control}
            placeholder="Enter a notes..."
            errors={errors?.notes?.message}
            rows={4}
          />
        </div>

        {/* Revocation effective */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm-medium text-gray-light/700">
            Revocation effective <span className="text-brand/900">*</span>
          </label>
          <MyAsyncDropdown
            name="effectiveDate"
            control={control}
            placeholder="Select reason"
            asyncFunction={mockAsync(effectiveOptions)}
            error={errors?.effectiveDate?.message}
          />
        </div>

        {/* Consent Checkbox */}
        <div className="flex items-start gap-3">
          <MyCheckbox name="consent" control={control} isError={!!errors?.consent} value />
          <p className="text-sm-regular text-gray-light/700">
            I agree by revoking this monitoring will mark the existing consent as no longer valid.
            Any future credit bureau enquiries will require a new consent from the individual.
          </p>
        </div>
        {errors?.consent?.message && (
          <p className="text-sm text-error/600 -mt-3">{errors.consent.message}</p>
        )}
      </div>
    </MyConfirmModalWithChildren>
  )
}

RevokeReportForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onRevoke: PropTypes.func,
}

RevokeReportForm.defaultProps = {
  onRevoke: undefined,
}
