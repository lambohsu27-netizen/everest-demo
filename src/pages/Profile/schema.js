import * as Yup from 'yup'

export const schema = Yup.object().shape({
  name: Yup.string().required(),
  whatsapp: Yup.string().required(),
  // nip: Yup.string().required(),
  // penempatan: Yup.object().required(),
  // email: Yup.string()
  //   .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 'email must be a valid email')
  //   .required(),
})
export const PasswordSchema = Yup.object().shape({
  old_password: Yup.string()
    .required('Password lama harus diisi')
    .min(8, 'Minimal 8 karakter'),
  new_password: Yup.string()
    .required('Password baru harus diisi')
    .min(8, 'Minimal 8 karakter')
    // .matches(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#~^\-_+=|`'"\\/:.,])[-A-Za-z\d@$!%*?&#~^\-_+=|`'"\\/:.,]{8,}$/,
    //   'Invalid format'
    // )
    .matches(/(?=.*[a-z])(?=.*[A-Z])/, 'Password harus mengandung huruf kecil dan huruf besar')
    .matches(/\d/, 'Password harus mengandung angka')
    .matches(/[@$!%*?&#~^\-_+=|`'"\\/:.,]/, 'Password harus mengandung karakter spesial'),
  confirm_password: Yup.string()
    .required('Konfirmasi password baru harus diisi')
    .oneOf([Yup.ref('new_password')], 'Password baru dan konfirmasi password baru harus sama'),
})
