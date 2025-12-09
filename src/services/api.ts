import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Tạo instance axios với interceptor
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor để thêm token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor để xử lý lỗi 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401) {
      
      if (originalRequest && originalRequest.url?.includes('/auth/login')) {
        return Promise.reject(error)
      }
      localStorage.removeItem('token')
      localStorage.removeItem('user')
  
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Types
export interface RegisterRequest {
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  message: string
  user: {
    _id: string
    email: string
    createdAt: string
  }
  token: string
}

export interface ProfileResponse {
  _id: string
  email: string
  createdAt: string
}

export interface ApiError {
  message: string
  statusCode: number
  error?: string
}

// API functions
export const authAPI = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data)
    return response.data
  },

  getProfile: async (): Promise<ProfileResponse> => {
    const response = await api.get('/auth/profile')
    return response.data
  },

  verifyToken: async (): Promise<{ valid: boolean; user: ProfileResponse }> => {
    const response = await api.get('/auth/verify')
    return response.data
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
}

// Helper để kiểm tra đăng nhập
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token')
}

// Helper để lấy thông tin user
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}