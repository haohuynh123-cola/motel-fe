import { ref, shallowRef } from 'vue'
import houseService, { type House } from '@/api/houseService'

export function useHouses() {
  const loading = shallowRef(false)
  const houses = ref<House[]>([])
  const page = shallowRef(1)
  const limit = shallowRef(10)
  const total = shallowRef(0)

  const fetchHouses = async (params?: { cursor?: number; limit?: number }) => {
    try {
      loading.value = true
      const actualParams = params || {
        cursor: page.value,
        limit: limit.value,
      }

      const response = (await houseService.getHouses(actualParams)) as any
      if (response.status) {
        houses.value = response.data || []
        if (response.meta) {
          total.value = response.meta.total
        }
      }
    } catch (error) {
      console.error('Lỗi fetch danh sách nhà trọ:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    houses,
    page,
    limit,
    total,
    fetchHouses,
  }
}
