import { ref, shallowRef } from 'vue'
import contractService, { type Contract } from '@/api/contractService'

export function useContracts() {
  const loading = shallowRef(false)
  const contracts = ref<Contract[]>([])

  const fetchContracts = async (houseId?: string | number) => {
    try {
      loading.value = true
      let response: any
      if (houseId) {
        response = await contractService.getContractsByHouse(houseId)
      } else {
        response = await contractService.getAllContracts()
      }

      if (response.status) {
        contracts.value = response.data || []
      }
    } catch (error) {
      console.error('Lỗi fetch danh sách hợp đồng:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    contracts,
    fetchContracts,
  }
}
