import * as Yup from 'yup'

const fullSchema = Yup.object().shape({
  isDraft: Yup.boolean(),
  name: Yup.string().required('Nama harus diisi'),
  email: Yup.string().required('Email harus diisi').email('Format email salah'),
  nik: Yup.string().required('NIK harus diisi').length(16, 'NIK harus 16 digit'),
  jenis_kelamin: Yup.string().required('Jenis kelamin harus diisi'),
  telepon: Yup.string()
    .required('Nomor telepon harus diisi')
    .min(10, 'Nomor telepon minimal 10 digit')
    .max(15, 'Nomor telepon maksimal 15 digit'),
  tempat_lahir: Yup.string().required('Tempat lahir harus diisi'),
  tanggal_lahir: Yup.date().nullable().required('Tanggal lahir harus diisi'),
  kode_pos: Yup.string()
    .required('Kode pos harus diisi')
    .matches(/^\d{5}$/, 'Kode pos harus 5 digit'),
  kota: Yup.object().nullable().required('Kota harus diisi'),
  kecamatan: Yup.object().nullable().required('Kecamatan harus diisi'),
  kelurahan: Yup.object().nullable().required('Kelurahan harus diisi'),
  alamat: Yup.string().required('Alamat harus diisi'),
  penjelasan: Yup.string().required('Penjelasan harus diisi'),
  nama_ibu: Yup.string().required('Nama ibu gadis kandung harus diisi'),
  agreement: Yup.boolean().oneOf([true], 'Persetujuan harus dicentang'),
  tujuan_permintaan: Yup.object().nullable().required('Tujuan permintaan harus diisi'),
})

const draftSchema = Yup.object().shape({
  isDraft: Yup.boolean(),
  name: Yup.string().nullable(),
  email: Yup.string().nullable().email('Format email salah'),
  nik: Yup.string().nullable(),
  jenis_kelamin: Yup.string().nullable(),
  telepon: Yup.string().nullable(),
  tempat_lahir: Yup.string().nullable(),
  tanggal_lahir: Yup.date().nullable(),
  kode_pos: Yup.string().nullable(),
  kota: Yup.object().nullable(),
  kecamatan: Yup.object().nullable(),
  kelurahan: Yup.object().nullable(),
  alamat: Yup.string().nullable(),
  penjelasan: Yup.string().nullable(),
  nama_ibu: Yup.string().nullable(),
  agreement: Yup.boolean(),
  tujuan_permintaan: Yup.object().nullable(),
})

export const schema = Yup.lazy((values) => (values?.isDraft ? draftSchema : fullSchema))

export const schemaImport = Yup.object().shape({
  samcards: Yup.mixed()
    .required()
    .test('fileSize', 'The file is too large', (value) => value.size <= 200000000),
})
