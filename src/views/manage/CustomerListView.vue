<script setup lang="ts">
  import { onMounted, computed } from 'vue'
  import { message } from 'ant-design-vue'
  import {
    SyncOutlined,
    UserAddOutlined,
    EditOutlined,
    DeleteOutlined,
  } from '@ant-design/icons-vue'
  import { useCustomers } from '@/composables/useCustomers'
  import AppTable from '@/components/shared/AppTable.vue'

  const { loading, customers, page, limit, total, fetchCustomers } = useCustomers()

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Họ và tên', dataIndex: 'full_name', key: 'full_name' },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'CCCD', dataIndex: 'identity_number', key: 'identity_number' },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
    { title: 'Thao tác', key: 'action', width: 150, align: 'center' },
  ]

  const dataSource = computed(() =>
    customers.value.map((item) => ({
      ...item,
      key: item.id,
    }))
  )

  const handleTableChange = (pagination: any) => {
    page.value = pagination.current
    limit.value = pagination.pageSize
    fetchCustomers()
  }

  onMounted(fetchCustomers)
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold m-0">Quản lý khách thuê</h2>
      <div class="flex gap-2">
        <a-button
          type="default"
          class="rounded-lg inline-flex items-center shadow-md shadow-blue-100"
        >
          <template #icon><UserAddOutlined /></template>
          Thêm khách thuê
        </a-button>
        <a-button
          type="primary"
          @click="fetchCustomers()"
          :loading="loading"
          class="rounded-lg inline-flex items-center shadow-md shadow-blue-100"
        >
          <template #icon><SyncOutlined /></template>
          Làm mới
        </a-button>
      </div>
    </div>

    <a-card :bordered="false" class="shadow-sm rounded-lg">
      <AppTable
        :dataSource="dataSource"
        :columns="columns"
        :loading="loading"
        :pagination="{
          current: page,
          pageSize: limit,
          total: total,
        }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <div class="flex justify-center gap-3">
              <a-button type="text" class="text-blue-500">
                <template #icon><EditOutlined /></template>
              </a-button>
              <a-button type="text" danger>
                <template #icon><DeleteOutlined /></template>
              </a-button>
            </div>
          </template>
        </template>
      </AppTable>
    </a-card>
  </div>
</template>
