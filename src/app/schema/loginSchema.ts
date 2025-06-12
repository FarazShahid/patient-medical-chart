import * as Yup from 'yup';

export const LoginSchemaValidation = Yup.object().shape({
    email: Yup.string()
    .transform((val:any) => val?.trim())
    .max(50, "Email must not exceed 50 characters")
    .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid Email format"
      ).required('Email is required'),
    password: Yup.string().required('Password is required'),
})