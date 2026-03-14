<script setup lang="ts">
  import { onMounted, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { message } from 'ant-design-vue'
  import { SyncOutlined, ArrowLeftOutlined, FileTextOutlined } from '@ant-design/icons-vue'
  import { useRooms } from '@/composables/useRooms'
  import { formatCurrency } from '@/utils/format'

  const route = useRoute()
  const router = useRouter()
  const houseId = route.params.id as string

  const { loading, rooms, fetchRooms } = useRooms()

  const columns = [
    {
      title: 'Số phòng',
      dataIndex: 'room_number',
      key: 'room_number',
    },
    {
      title: 'Tầng',
      dataIndex: 'floor',
      key: 'floor',
    },
    {
      title: 'Giá thuê',
      dataIndex: 'price',
      key: 'price',
      customRender: ({ text }: { text: number }) => formatCurrency(text),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'is_available',
      key: 'is_available',
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      align: 'center',
    },
  ]

  const dataSource = computed(() =>
    rooms.value.map((item) => ({
      ...item,
      key: item.id,
    }))
  )

  const handleRefresh = async () => {
    try {
      await fetchRooms(houseId)
    } catch (error) {
      message.error('Lỗi tải danh sách phòng!')
    }
  }

  const goBack = () => {
    router.push('/manage/houses')
  }

  const viewContracts = () => {
    router.push(`/manage/houses/${houseId}/contracts`)
  }

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
      <div class="flex gap-2">
        <a-button @click="viewContracts" type="default" class="inline-flex items-center">
          <template #icon><FileTextOutlined /></template>
          <span>Xem hợp đồng nhà này</span>
        </a-button>
        <a-button
          type="primary"
          @click="handleRefresh"
          :loading="loading"
          class="inline-flex items-center"
        >
          <template #icon><SyncOutlined /></template>
          <span>Làm mới</span>
        </a-button>
      </div>
    </div>

    <a-card :bordered="false" class="shadow-sm rounded-lg">
      <a-table
        :dataSource="dataSource"
        :columns="columns"
        :loading="loading"
        :pagination="{ pageSize: 10 }"
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
      </a-table>
    </a-card>
  </div>
</template>
