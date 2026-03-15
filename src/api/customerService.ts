import apiClient from './axios'

export default {
  async getCustomers({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) {
    try {
      const params = { page, limit }
      const response = await apiClient.get('/customers', { params })
      return response.data
    } catch (error) {
      console.error('Lỗi khi fetch danh sách khách thuê:', error)
      throw error
    }
  },

  async getCustomerById(id: string | number) {
    const response = await apiClient.get(`/customers/${id}`)
    return response.data
  },

  async registerCustomer(customerData: any) {
    const response = await apiClient.post('/customers', customerData)
    return response.data
  },

  async updateCustomer(id: string | number, customerData: any) {
    const response = await apiClient.put(`/customers/${id}`, customerData)
    return response.data
  },

  async deleteCustomer(id: string | number) {
    const response = await apiClient.delete(`/customers/${id}`)
    return response.data
  },
}
