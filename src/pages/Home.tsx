import { Link } from 'react-router-dom'
import { useUser } from '../hooks/useAuth'
import { Loader2 } from 'lucide-react'

const Home = () => {
  const { data: user, isLoading } = useUser()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  const isAuthenticated = !!user

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          {isAuthenticated ? `Xin chào, ${user.email}!` : 'Chào mừng đến với Auth App'}
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          {isAuthenticated 
            ? 'Bạn đã đăng nhập thành công vào hệ thống xác thực.'
            : 'Hệ thống xác thực được xây dựng với React và NestJS'}
        </p>

        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-sm"
              >
                Truy cập Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-sm"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="inline-block bg-white text-blue-600 border border-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 shadow-sm"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>

        {isAuthenticated && (
          <div className="mt-12 bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Thông tin đăng nhập
            </h3>
            <p className="text-gray-600">
              Token JWT của bạn đã được lưu và sẽ tự động được gửi trong các request.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home