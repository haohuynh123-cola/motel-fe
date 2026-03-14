import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '@/api/authService'

export interface UserInfo {
  username: string
  email?: string
  role?: string
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<UserInfo | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  function setUser(userInfo: UserInfo) {
    user.value = userInfo
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    authService.logout()
  }

  return {
    token,
    user,
    isAuthenticated,
    setToken,
    setUser,
    logout,
  }
})
