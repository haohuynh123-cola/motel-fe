<script setup lang="ts">
  import { onMounted, computed, ref } from 'vue'
  import { message } from 'ant-design-vue'
  import {
    SyncOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    EyeOutlined,
  } from '@ant-design/icons-vue'
  import { useRouter } from 'vue-router'
  import { useHouses } from '@/composables/useHouses'
  import { formatDate } from '@/utils/format'
  import AppTable from '@/components/shared/AppTable.vue'
  import HouseFormDrawer from './components/HouseFormDrawer.vue'

  const router = useRouter()
  const { houses, loading, fetchHouses, deleteHouse } = useHouses()

  const drawerOpen = ref(false)
  const currentHouse = ref<any>(null)

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Tên Nhà Trọ', dataIndex: 'name', key: 'name' },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
    {
      title: 'Ngày đăng ký',
      dataIndex: 'created_at',
      key: 'created_at',
      customRender: ({ text }: { text: string }) => formatDate(text),
    },
    { title: 'Thao tác', key: 'action', width: 200, align: 'center' },
  ]

  const dataSource = computed(() =>
    houses.value.map((item) => ({
      ...item,
      key: item.id,
    }))
  )

  const handleAdd = () => {
    currentHouse.value = null
    drawerOpen.value = true
  }

  const handleEdit = (record: any) => {
    currentHouse.value = record
    drawerOpen.value = true
  }

  const handleViewRooms = (record: any) => {
    router.push({ name: 'HouseRooms', params: { id: record.id } })
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteHouse(id)
      message.success('Xóa nhà trọ thành công')
    } catch (error) {
      message.error('Không thể xóa nhà trọ này')
    }
  }

  onMounted(fetchHouses)
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold m-0">Danh sách Nhà Trọ</h2>
      <a-space>
        <a-button type="primary" @click="handleAdd">
          <template #icon><PlusOutlined /></template>
          Thêm Nhà trọ
        </a-button>
        <a-button @click="fetchHouses" :loading="loading">
          <template #icon><SyncOutlined /></template>
          Làm mới
        </a-button>
      </a-space>
    </div>

    <a-card :bordered="false" class="shadow-sm rounded-lg">
      <AppTable :columns="columns" :dataSource="dataSource" :loading="loading">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <a class="font-semibold" @click="handleViewRooms(record)">{{ record.name }}</a>
          </template>

          <template v-if="column.key === 'action'">
            <div class="flex justify-center gap-2">
              <a-tooltip title="Xem phòng">
                <a-button type="text" @click="handleViewRooms(record)">
                  <template #icon><EyeOutlined /></template>
                </a-button>
              </a-tooltip>
              <a-tooltip title="Sửa">
                <a-button type="text" class="text-blue-500" @click="handleEdit(record)">
                  <template #icon><EditOutlined /></template>
                </a-button>
              </a-tooltip>
              <a-popconfirm
                title="Bạn có chắc chắn muốn xóa nhà trọ này?"
                @confirm="handleDelete(record.id)"
              >
                <a-tooltip title="Xóa">
                  <a-button type="text" danger>
                    <template #icon><DeleteOutlined /></template>
                  </a-button>
                </a-tooltip>
              </a-popconfirm>
            </div>
          </template>
        </template>
      </AppTable>
    </a-card>

    <HouseFormDrawer
      v-model:open="drawerOpen"
      :initialValues="currentHouse"
      @success="fetchHouses"
    />
  </div>
</template>
