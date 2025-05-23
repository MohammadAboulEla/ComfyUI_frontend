import { z } from 'zod'

import { t } from '@/i18n'

export const signInSchema = z.object({
  email: z
    .string()
    .email(t('validation.invalidEmail'))
    .min(1, t('validation.required')),
  password: z.string().min(1, t('validation.required'))
})

export type SignInData = z.infer<typeof signInSchema>

const passwordSchema = z.object({
  password: z
    .string()
    .min(8, t('validation.minLength', { length: 8 }))
    .max(32, t('validation.maxLength', { length: 32 }))
    .regex(/[A-Z]/, t('validation.password.uppercase'))
    .regex(/[a-z]/, t('validation.password.lowercase'))
    .regex(/\d/, t('validation.password.number'))
    .regex(/[^A-Za-z0-9]/, t('validation.password.special')),
  confirmPassword: z.string().min(1, t('validation.required'))
})

export const updatePasswordSchema = passwordSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: t('validation.password.match'),
    path: ['confirmPassword']
  }
)

export type UpdatePasswordData = z.infer<typeof updatePasswordSchema>

export const signUpSchema = passwordSchema
  .extend({
    email: z
      .string()
      .email(t('validation.invalidEmail'))
      .min(1, t('validation.required')),
    personalDataConsent: z.boolean()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: t('validation.password.match'),
    path: ['confirmPassword']
  })
  .refine((data) => data.personalDataConsent === true, {
    message: t('validation.personalDataConsentRequired'),
    path: ['personalDataConsent']
  })

export type SignUpData = z.infer<typeof signUpSchema>
