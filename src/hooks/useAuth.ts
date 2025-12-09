import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { RegisterRequest, LoginRequest, AuthResponse, ProfileResponse } from '../services/api'
import { authAPI, getCurrentUser, isAuthenticated } from '../services/api'

export const useRegister = () => {
  const queryClient = useQueryClient()
  
  return useMutation<AuthResponse, Error, RegisterRequest>({
    mutationFn: (data: RegisterRequest) => authAPI.register(data),
    onSuccess: (data) => {
      // Lưu token và user vào localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      // Invalidate queries để refetch user data
      queryClient.invalidateQueries({ queryKey: ['user'] })
      
      console.log('Đăng ký thành công:', data)
    },
    onError: (error) => {
      console.error('Đăng ký thất bại:', error)
    },
  })
}

export const useLogin = () => {
  const queryClient = useQueryClient()
  
  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: (data: LoginRequest) => authAPI.login(data),
    onSuccess: (data) => {
      // Lưu token và user vào localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      // Invalidate queries để refetch user data
      queryClient.invalidateQueries({ queryKey: ['user'] })
      
      console.log('Đăng nhập thành công:', data)
    },
    onError: (error) => {
      console.error('Đăng nhập thất bại:', error)
    },
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()
  
  return () => {
    authAPI.logout()
    localStorage.removeItem('token'); 
    localStorage.removeItem('user'); 
    queryClient.clear()
    window.location.href = '/login'
  }
}

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      if (!isAuthenticated()) {
        return null
      }
      try {
        const response = await authAPI.verifyToken()
        if (response.valid) {
          return response.user
        }
        return null
      } catch (error) {
        return null
      }
    },
    initialData: getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 phút
  })
}

export const useProfile = () => {
  return useQuery<ProfileResponse, Error>({
    queryKey: ['profile'],
    queryFn: () => authAPI.getProfile(),
    enabled: isAuthenticated(),
    retry: 1,
  })
}