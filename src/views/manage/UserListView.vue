<script setup>
import { ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { SyncOutlined, UserAddOutlined } from '@ant-design/icons-vue';
import userService from '@/api/userService';

const users = ref([]);
const loading = ref(false);

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: 'Tên đăng nhập',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: 'Họ và tên',
    dataIndex: 'full_name',
    key: 'full_name',
  },
  {
    title: 'Quyền hạn',
    dataIndex: 'permissions',
    key: 'permissions',
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'created_at',
    key: 'created_at',
    customRender: ({ text }) => new Date(text).toLocaleDateString('vi-VN')
  },
];

const fetchUsers = async () => {
  try {
    loading.value = true;
    const response = await userService.getUsers();
    if (response.status) {
      users.value = (response.data || []).map(item => ({
        ...item,
        key: item.id
      }));
    }
  } catch (error) {
    message.error('Lỗi tải danh sách người dùng!');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold m-0">Quản lý người dùng</h2>
      <div class="flex gap-2">
        <a-button type="default" class="inline-flex items-center">
          <template #icon><UserAddOutlined /></template>
          <span>Thêm người dùng</span>
        </a-button>
        <a-button type="primary" @click="fetchUsers" :loading="loading" class="inline-flex items-center">
          <template #icon><SyncOutlined /></template>
          <span>Làm mới</span>
        </a-button>
      </div>
    </div>

    <a-card :bordered="false" class="shadow-sm rounded-lg">
      <a-table
        :dataSource="users"
        :columns="columns"
        :loading="loading"
        :pagination="{ pageSize: 10 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'permissions'">
            <div class="flex flex-wrap gap-1">
              <a-tag v-for="p in record.permissions" :key="p" color="blue">{{ p }}</a-tag>
            </div>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>
