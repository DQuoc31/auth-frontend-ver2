import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import type { AxiosError } from 'axios'
import type { ApiError } from '../services/api'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

function getStoredUser() {
  const raw = typeof window !== 'undefined' ? localStorage.getItem('user') : null
  if (!raw || raw === 'null' || raw === 'undefined') return null
  try {
    const parsed = JSON.parse(raw)
    if (parsed && (parsed._id || parsed.email)) return parsed
  } catch (e) {
    // ignore
  }
  return null
}
import { useLogin } from '../hooks/useAuth'
import type { LoginFormData } from '../utils/validation'
import { loginSchema } from '../utils/validation'

const Login = () => {
  const { mutate: login, isPending, error, isSuccess } = useLogin()

  const navigate = useNavigate()

  // if already logged in (valid stored user), redirect to home
  useEffect(() => {
    const user = getStoredUser()
    if (user) navigate('/', { replace: true })
  }, [navigate])
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormData) => {
    login(data)
  }

  // navigate to home after successful login
  useEffect(() => {
    if (isSuccess) {
      navigate('/', { replace: true })
    }
  }, [isSuccess, navigate])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Đăng nhập tài khoản
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Hoặc{' '}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            tạo tài khoản mới
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
                  {...register('email')}
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
                  {...register('password')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập mật khẩu"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-800">
                  {(() => {
                    // prefer the backend message when available (AxiosError.response.data.message)
                    const axiosErr = error as unknown as AxiosError<ApiError>
                    return axiosErr?.response?.data?.message ?? axiosErr?.message ?? 'Đã có lỗi xảy ra. Vui lòng thử lại.'
                  })()}
                </p>
              </div>
            )}

            {isSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <p className="text-sm text-green-800">
                  Đăng nhập thành công! Chào mừng bạn trở lại.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login