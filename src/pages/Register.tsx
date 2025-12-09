import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { useRegister } from '../hooks/useAuth'
import type { RegisterFormData } from '../utils/validation'
import { registerSchema } from '../utils/validation'

const Register = () => {
  const navigate = useNavigate()
  const { mutate: register, isPending, error, isSuccess } = useRegister()
  
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = (data: RegisterFormData) => {
    // only send fields expected by API
    const payload = { email: data.email, password: data.password }
    register(payload, {
      onSuccess: () => {
        setTimeout(() => navigate('/'), 2000)
      },
    })
  }

  const getErrorMessage = (err: any) => {
      if (err?.response?.data?.message) {
          if (Array.isArray(err.response.data.message)) {
              return err.response.data.message[0];
          }
          return err.response.data.message;
      }
      return err?.message || "Có lỗi xảy ra, vui lòng thử lại.";
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Tạo tài khoản mới
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Hoặc{' '}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            đăng nhập vào tài khoản hiện có
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                Địa chỉ email
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  {...registerField('email')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="email@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                Mật khẩu
              </label>
              <div className="mt-2">
                <input
                  type="password"
                  {...registerField('password')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ít nhất 6 ký tự"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900">
                Xác nhận mật khẩu
              </label>
              <div className="mt-2">
                <input
                  id="confirmPassword"
                  type="password"
                  {...registerField('confirmPassword')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập lại mật khẩu"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-800">
                    {getErrorMessage(error)}
                </p>
              </div>
            )}

            {isSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <p className="text-sm text-green-800">Đăng ký thành công! Đang chuyển hướng...</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register