import { z } from 'zod'

export const registerSchema = z
  .object({
    email: z.string().email('Vui lòng nhập địa chỉ email hợp lệ'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
  })
  .superRefine((val, ctx) => {
    if (val.password !== val.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Mật khẩu nhập lại không khớp',
        path: ['confirmPassword'],
      })
    }
  })

export const loginSchema = z.object({
  email: z.string().email('Vui lòng nhập địa chỉ email hợp lệ'),
  password: z.string().min(1, 'Mật khẩu là bắt buộc'),
})

export type RegisterFormData = z.infer<typeof registerSchema>
export type LoginFormData = z.infer<typeof loginSchema>