import { ref, shallowRef } from 'vue'
import userService, { type User } from '@/api/userService'

export function useUsers() {
  const loading = shallowRef(false)
  const users = ref<User[]>([])

  const fetchUsers = async () => {
    try {
      loading.value = true
      const response = (await userService.getUsers()) as any
      if (response.status) {
        users.value = response.data || []
      }
    } catch (error) {
      console.error('Lỗi fetch danh sách người dùng:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    users,
    fetchUsers,
  }
}
