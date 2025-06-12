import * as Yup from 'yup';


export const ForgotEmailPasswordSchema = Yup.object().shape({
    newPassword: Yup.string()
        .required('Password is required')
        .min(8, 'Password must contain at least 8 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[!@#$%^&*]/, 'Password must contain at least one special character'),

    confirmNewPassword: Yup.string()
        .required('Confirm Password is required')
        .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
})