<script setup lang="ts">
  import { onMounted, computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { message } from 'ant-design-vue'
  import { SyncOutlined, ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons-vue'
  import { useRooms } from '@/composables/useRooms'
  import { formatCurrency } from '@/utils/format'
  import AppTable from '@/components/shared/AppTable.vue'
  import RoomFormDrawer from './components/RoomFormDrawer.vue'

  const route = useRoute()
  const router = useRouter()
  const houseId = route.params.id as string

  const { loading, rooms, fetchRooms } = useRooms()

  const drawerOpen = ref(false)
  const currentRoom = ref<any>(null)

  const columns = [
    { title: 'Số phòng', dataIndex: 'room_number', key: 'room_number' },
    { title: 'Tầng', dataIndex: 'floor', key: 'floor' },
    {
      title: 'Giá thuê',
      dataIndex: 'price',
      key: 'price',
      customRender: ({ text }: { text: number }) => formatCurrency(text),
    },
    { title: 'Trạng thái', dataIndex: 'is_available', key: 'is_available' },
    { title: 'Thao tác', key: 'action', width: 150, align: 'center' },
  ]

  const dataSource = computed(() =>
    rooms.value.map((item) => ({
      ...item,
      key: item.id,
    }))
  )

  const handleRefresh = () => fetchRooms(houseId)

  const handleAdd = () => {
    currentRoom.value = null
    drawerOpen.value = true
  }

  const goBack = () => router.push({ name: 'HouseList' })

  onMounted(handleRefresh)
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center gap-4">
        <a-button @click="goBack" class="inline-flex items-center justify-center">
          <template #icon><ArrowLeftOutlined /></template>
        </a-button>
        <h2 class="text-2xl font-bold m-0">Danh sách phòng</h2>
      </div>
      <a-space>
        <a-button type="primary" @click="handleAdd">
          <template #icon><PlusOutlined /></template>
          Thêm Phòng
        </a-button>
        <a-button @click="handleRefresh" :loading="loading">
          <template #icon><SyncOutlined /></template>
          Làm mới
        </a-button>
      </a-space>
    </div>

    <a-card :bordered="false" class="shadow-sm rounded-lg">
      <AppTable
        :columns="columns"
        :dataSource="dataSource"
        :loading="loading"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'is_available'">
            <a-tag :color="record.is_available ? 'green' : 'red'">
              {{ record.is_available ? 'Còn trống' : 'Đã thuê' }}
            </a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <a-button type="link">Chi tiết</a-button>
          </template>
        </template>
      </AppTable>
    </a-card>

    <RoomFormDrawer
      v-model:open="drawerOpen"
      :houseId="houseId"
      :initialValues="currentRoom"
      @success="handleRefresh"
    />
  </div>
</template>
