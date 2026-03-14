import { ref, computed, shallowRef } from 'vue'
import dashboardService from '@/api/dashboardService'
import { formatCurrency } from '@/utils/format'

export interface RoomStats {
  total: number
  available: number
  occupied: number
}

export interface DashboardStats {
  total_houses: number
  total_contracts: number
  total_customers: number
  total_revenue: number
  room_stats: RoomStats
}

export function useDashboard() {
  const loading = shallowRef(false)
  const dashboardData = ref<DashboardStats | null>(null)

  const roomStats = computed<RoomStats>(
    () =>
      dashboardData.value?.room_stats || {
        total: 0,
        available: 0,
        occupied: 0,
      }
  )

  const fillRate = computed(() => {
    const { total, occupied } = roomStats.value
    if (total === 0) return 0
    return Math.round((occupied / total) * 100)
  })

  const formattedRevenue = computed(() => formatCurrency(dashboardData.value?.total_revenue || 0))

  const fetchDashboardData = async () => {
    try {
      loading.value = true
      const response = (await dashboardService.getStats()) as any
      if (response.status) {
        dashboardData.value = response.data
      }
    } catch (error) {
      console.error('Lỗi tải dữ liệu dashboard:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    dashboardData,
    roomStats,
    fillRate,
    formattedRevenue,
    fetchDashboardData,
  }
}
