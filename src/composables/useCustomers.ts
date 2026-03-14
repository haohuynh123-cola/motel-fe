import { ref, shallowRef } from 'vue'
import customerService from '@/api/customerService'

export interface Customer {
  id: number
  full_name: string
  phone: string
  email: string
  identity_number: string
  address: string
}

export function useCustomers() {
  const loading = shallowRef(false)
  const customers = ref<Customer[]>([])
  const page = shallowRef(1)
  const limit = shallowRef(10)
  const total = shallowRef(0)

  const fetchCustomers = async (params?: { page?: number; limit?: number }) => {
    try {
      loading.value = true
      const actualParams = params || {
        page: page.value,
        limit: limit.value,
      }

      const response = (await customerService.getCustomers(actualParams)) as any
      if (response.status) {
        customers.value = response.data || []
        if (response.meta) {
          total.value = response.meta.total
          page.value = response.meta.current_page
          limit.value = response.meta.limit
        }
      }
    } catch (error) {
      console.error('Lỗi fetch danh sách khách thuê:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    customers,
    page,
    limit,
    total,
    fetchCustomers,
  }
}
