import * as Yup from 'yup'

const ContactUsSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('must be a valid email').required('Email is required'),
  phone: Yup.string().optional(),
  message: Yup.string().required('Message is required'),
  agree: Yup.boolean().oneOf([true], 'You must agree to the privacy policy')
})

export default ContactUsSchema
