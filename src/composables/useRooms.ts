import { ref, shallowRef } from 'vue'
import roomService, { type Room } from '@/api/roomService'

export function useRooms() {
  const loading = shallowRef(false)
  const rooms = ref<Room[]>([])

  const fetchRooms = async (houseId: string | number) => {
    try {
      loading.value = true
      const response = (await roomService.getRoomsByHouse(houseId)) as any
      if (response.status) {
        rooms.value = response.data || []
      }
    } catch (error) {
      console.error('Lỗi fetch danh sách phòng:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    rooms,
    fetchRooms,
  }
}
