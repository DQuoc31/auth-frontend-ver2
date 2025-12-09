import type { User } from '../services/api'

// Safely read the stored user from localStorage
export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem('user')
  if (!raw || raw === 'null' || raw === 'undefined') return null
  try {
    const parsed = JSON.parse(raw) as User | null
    if (parsed && (parsed._id || parsed.email)) return parsed
  } catch (e) {
    // ignore
  }
  return null
}

export default getStoredUser
