import * as yup from 'yup'

const revokeReportSchema = yup.object().shape({
  reason: yup
    .object()
    .shape({
      label: yup.string().required(),
      value: yup.string().required(),
    })
    .nullable()
    .required('Reason for revocation is required'),
  evidence: yup.array().nullable(),
  notes: yup.string().required('Additional notes are required'),
  effectiveDate: yup
    .object()
    .shape({
      label: yup.string().required(),
      value: yup.string().required(),
    })
    .nullable()
    .required('Revocation effective date is required'),
  consent: yup
    .boolean()
    .oneOf([true], 'You must agree to revoke this monitoring')
    .required(),
})

export default revokeReportSchema
