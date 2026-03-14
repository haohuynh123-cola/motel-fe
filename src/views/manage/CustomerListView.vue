<script setup>
import { ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { SyncOutlined, UserAddOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import customerService from '@/api/customerService';

const customers = ref([]);
const loading = ref(false);
const page = ref(1);
const limit = ref(10);
const total = ref(0);

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: 'Họ và tên',
    dataIndex: 'full_name',
    key: 'full_name',
  },
  {
    title: 'Số điện thoại',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'CCCD',
    dataIndex: 'identity_number',
    key: 'identity_number',
  },
  {
    title: 'Địa chỉ',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Thao tác',
    key: 'action',
    width: 150,
    align: 'center'
  },
];

const fetchCustomers = async () => {
  try {
    loading.value = true;
    const response = await customerService.getCustomers({
      page: page.value,
      limit: limit.value,
    });

    if (response.status) {
      customers.value = (response.data || []).map(item => ({
        ...item,
        key: item.id
      }));

      if (response.meta) {
        total.value = response.meta.total;
        page.value = response.meta.current_page;
        limit.value = response.meta.limit;
      }
    }
  } catch (error) {
    message.error('Lỗi tải danh sách khách thuê!');
  } finally {
    loading.value = false;
  }
};

const handleTableChange = (pagination) => {
  page.value = pagination.current;
  limit.value = pagination.pageSize;
  fetchCustomers();
};

onMounted(() => {
  fetchCustomers();
});
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold m-0">Quản lý khách thuê</h2>
      <div class="flex gap-2">
        <a-button type="default" class=" rounded-lg inline-flex items-center shadow-md shadow-blue-100">
          <template #icon><UserAddOutlined /></template>
          Thêm khách thuê
        </a-button>
        <a-button type="primary" @click="fetchCustomers" :loading="loading" class=" rounded-lg inline-flex items-center shadow-md shadow-blue-100">
          <template #icon><SyncOutlined /></template>
          Làm mới
        </a-button>
      </div>
    </div>

    <a-card :bordered="false" class="shadow-sm rounded-lg">
      <a-table
        :dataSource="customers"
        :columns="columns"
        :loading="loading"
        :pagination="{
          current: page,
          pageSize: limit,
          total: total,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20', '50'],
          showTotal: (total) => `Tổng cộng ${total} khách thuê`
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
      </a-table>
    </a-card>
  </div>
</template>
