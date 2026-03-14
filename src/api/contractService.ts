import apiClient from './axios'

export interface Contract {
  id: number
  house_id: number
  customer_id: number
  room_id: number
  start_date: string
  end_date: string
  price: number
  deposit: number
  status: string
  created_at: string
}

export default {
  async getAllContracts(): Promise<Contract[]> {
    try {
      const response = await apiClient.get<Contract[]>('/contracts')
      return response.data
    } catch (error) {
      console.error('Lỗi khi fetch tất cả hợp đồng:', error)
      throw error
    }
  },

  async getContractsByHouse(houseId: number | string): Promise<Contract[]> {
    try {
      const response = await apiClient.get<Contract[]>(`/houses/${houseId}/contracts`)
      return response.data
    } catch (error) {
      console.error(`Lỗi khi fetch hợp đồng của nhà ${houseId}:`, error)
      throw error
    }
  },

  async getContractById(id: number | string): Promise<Contract> {
    const response = await apiClient.get<Contract>(`/contracts/${id}`)
    return response.data
  },

  async createContract(contractData: Partial<Contract>): Promise<Contract> {
    const response = await apiClient.post<Contract>('/contracts', contractData)
    return response.data
  },
}
