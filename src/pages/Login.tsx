import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import type { AxiosError } from 'axios'
import type { ApiError } from '../services/api'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useLogin } from '../hooks/useAuth'
import type { LoginFormData } from '../utils/validation'
import { loginSchema } from '../utils/validation'

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

// Tài khoản mẫu
const SAMPLE_ACCOUNTS = [
  { email: 'user@example.com', password: 'password123'},
]

const Login = () => {
  const { mutate: login, isPending, error, isSuccess } = useLogin()
  const navigate = useNavigate()

  // Nếu đã đăng nhập, chuyển hướng về trang chủ
  useEffect(() => {
    const user = getStoredUser()
    if (user) navigate('/', { replace: true })
  }, [navigate])

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormData) => {
    login(data)
  }

  // Chuyển hướng sau khi đăng nhập thành công
  useEffect(() => {
    if (isSuccess) {
      navigate('/', { replace: true })
    }
  }, [isSuccess, navigate])

  // Hàm điền thông tin tài khoản mẫu vào form
  const fillSampleAccount = (email: string, password: string) => {
    setValue('email', email)
    setValue('password', password)
  }

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

      <div className="mt-8 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Container tài khoản mẫu - Chiếm 1/3 trên desktop */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 h-full">
              <div className="flex items-center mb-4">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <h3 className="text-lg font-semibold text-blue-900">
                  Tài khoản mẫu (Click để điền)
                </h3>
              </div>
              
              <div className="space-y-4">
                {SAMPLE_ACCOUNTS.map((account, index) => (
                  <div 
                    key={index}
                    className="bg-white/70 hover:bg-white border border-blue-100 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-blue-300 hover:scale-[1.02] active:scale-[0.99]"
                    onClick={() => fillSampleAccount(account.email, account.password)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-sm">
                            {index + 1}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {account.email}
                            </p>
                            <div className="mt-1 flex items-center">
                              <span className="text-xs text-gray-500 mr-2">Mật khẩu:</span>
                              <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                {account.password}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center text-xs text-blue-600">
                          <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                          </svg>
                          <span>Click để điền thông tin</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form đăng nhập - Chiếm 2/3 trên desktop */}
          <div className="lg:col-span-2">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 h-full">
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                    Địa chỉ email
                  </label>
                  <div className="mt-2">
                    <input
                      type="email"
                      {...register('email')}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm hover:shadow-md"
                >
                  {isPending ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang đăng nhập...
                    </span>
                  ) : 'Đăng nhập'}
                </button>

                
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login