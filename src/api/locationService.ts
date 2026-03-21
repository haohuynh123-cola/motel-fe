import axios from 'axios'

const BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1') + '/locations'
const provinceApi = axios.create({ baseURL: BASE, timeout: 10000 })

export interface Province { code: number; name: string; codename: string }
export interface District { code: number; name: string; codename: string }
export interface Ward { code: number; name: string; codename: string }

export default {
  async getProvinces(): Promise<Province[]> {
    const res = await provinceApi.get<Province[]>('/provinces')
    return res.data
  },
  async getDistricts(provinceCode: number): Promise<District[]> {
    const res = await provinceApi.get<District[]>('/districts', { params: { province_code: provinceCode } })
    return Array.isArray(res.data) ? res.data : []
  },
  async getWards(districtCode: number): Promise<Ward[]> {
    const res = await provinceApi.get<Ward[]>('/wards', { params: { district_code: districtCode } })
    return Array.isArray(res.data) ? res.data : []
  },
}
