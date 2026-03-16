// Libraries
import * as Yup from 'yup'

const RegisterSchema = Yup.object().shape({
  email: Yup.string()
    // .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'email must be a valid email')
    .required(),
  password: Yup.string().required(),
})

export default RegisterSchema
