import * as Yup from 'yup'

export const ForgetPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'email must be a valid email')
    .required(),
})

export const setNewPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required('New password is required')
    .min(8, 'New password must be at least 8 characters.')
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
  confirmPassword: Yup.string()
    .required('Confirm new password is a required field')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
})
