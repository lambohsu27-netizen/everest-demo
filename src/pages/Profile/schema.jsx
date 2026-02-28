// Libraries
import * as Yup from 'yup'

export const ProfileSchema = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string()
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'email must be a valid email')
    .required(),
})

export const PasswordProfileSchema = Yup.object().shape({
  old_password: Yup.string()
    .required('Current password is required')
    .min(12, 'Current password must be at least 12 characters'),
  newPassword: Yup.string()
    .required('New password is required')
    .min(12, 'New password must be at least 12 characters.') // Validasi panjang minimal
    .matches(/(?=.*[a-z])/, 'Must contain at least one lowercase letter.')
    .matches(/(?=.*[A-Z])/, 'Must contain at least one uppercase letter.')
    .matches(/(?=.*\d)/, 'Must contain at least one number.')
    .matches(
      // Regex ini mencakup simbol umum yang kompatibel dengan regex backend
      // /(?=.*[!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`-])/
      // Saya menyederhanakannya untuk Yup agar lebih mudah dibaca:
      /(?=.*[!@#$%^&*])/,
      'Must contain at least one symbol (e.g., !@#$%^&*).'
    ),
  ConfirmPassword: Yup.string()
    .required('Confirm new password is required')
    .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
})
