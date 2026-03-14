<script setup lang="ts">
  import { onMounted, computed } from 'vue'
  import { message } from 'ant-design-vue'
  import { SyncOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
  import { useHouses } from '@/composables/useHouses'
  import { formatDate } from '@/utils/format'

  const { houses, loading, fetchHouses } = useHouses()

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Tên Nhà Trọ',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Ngày đăng ký',
      dataIndex: 'created_at',
      key: 'created_at',
      customRender: ({ text }: { text: string }) => formatDate(text),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      align: 'center',
    },
  ]

  const dataSource = computed(() =>
    houses.value.map((item) => ({
      ...item,
      key: item.id,
    }))
  )

  const handleRefresh = async () => {
    try {
      await fetchHouses()
    } catch (error) {
      message.error('Lỗi tải dữ liệu. Vui lòng kiểm tra kết nối Backend!')
    }
  }

  onMounted(handleRefresh)
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold m-0">Danh sách Nhà Trọ</h2>
      <a-button type="primary" @click="handleRefresh" :loading="loading">
        <template #icon><SyncOutlined /></template>
        Làm mới
      </a-button>
    </div>

    <a-card :bordered="false" class="shadow-sm rounded-lg">
      <a-table
        :dataSource="dataSource"
        :columns="columns"
        :loading="loading"
        :pagination="{ pageSize: 10 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <a class="font-semibold">{{ record.name }}</a>
          </template>

          <template v-if="column.key === 'action'">
            <div class="flex justify-center gap-3">
              <a-tooltip title="Sửa">
                <a-button type="text" class="text-blue-500">
                  <template #icon><EditOutlined /></template>
                </a-button>
              </a-tooltip>
              <a-tooltip title="Xóa">
                <a-button type="text" danger>
                  <template #icon><DeleteOutlined /></template>
                </a-button>
              </a-tooltip>
            </div>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>
