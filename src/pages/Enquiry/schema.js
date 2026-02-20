import * as Yup from 'yup'

export const schema = Yup.object().shape({
  email: Yup.string()
    .required('Email harus diisi')
    .email('Format email salah')
    .test(
      'is-bankmandiritaspen-email',
      'Email harus menggunakan domain @bankmandiritaspen.co.id',
      (value) => !!value && value.endsWith('@bankmandiritaspen.co.id')
    ),
  name: Yup.string().required('Nama harus diisi'),
  nip: Yup.string().required('NIP harus diisi'),
  whatsapp: Yup.string()
    .required('Nomor telpon harus diisi')
    .min(10, 'Nomor telepon minimal 10 digit')
    .max(15, 'Nomor telepon maksimal 15 digit'),
  role: Yup.object().required('Role harus diisi'),
  branch: Yup.object().required('Penempatan harus diisi'),
})

export const schemaImport = Yup.object().shape({
  samcards: Yup.mixed()
    .required()
    .test(
      'fileSize',
      'The file is too large',
      (value) => value.size <= 200000000
    ),
})
