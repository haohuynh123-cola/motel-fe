<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { SyncOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import houseService from '@/api/houseService';

const router = useRouter();
const houses = ref([]);
const loading = ref(false);
const page = ref(1);
const limit = ref(10);
const total = ref(0);

const goToRooms = (id) => {
  router.push(`/manage/houses/${id}/rooms`);
};

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
  },
  {
    title: 'Thao tác',
    key: 'action',
    width: 150,
    align: 'center'
  },
];

const fetchHouses = async () => {
  try {
    loading.value = true;
    const response = await houseService.getHouses({
      page: page.value,
      limit: limit.value,
    });

    if (response.status) {
      // Dữ liệu nhà trọ nằm trong response.data
      houses.value = response.data.map(item => ({
        ...item,
        key: item.id,
        created_at: new Date(item.created_at).toLocaleDateString('vi-VN')
      }));

      // Thông tin phân trang nằm trong response.meta
      if (response.meta) {
        total.value = response.meta.total;
        page.value = response.meta.current_page;
        limit.value = response.meta.limit;
      }
    }
  } catch (error) {
    console.error('Fetch error:', error);
    message.error('Lỗi tải dữ liệu. Vui lòng kiểm tra kết nối Backend!');
  } finally {
    loading.value = false;
  }
};

const handleTableChange = (pagination) => {
  page.value = pagination.current;
  limit.value = pagination.pageSize;
  fetchHouses();
};

onMounted(() => {
  fetchHouses();
});
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold m-0">Danh sách Nhà Trọ</h2>
      <a-button type="primary" @click="fetchHouses" :loading="loading" class="inline-flex items-center">
        <template #icon><SyncOutlined /></template>
        <span>Làm mới</span>
      </a-button>
    </div>

    <a-card :bordered="false" class="shadow-sm rounded-lg">
      <a-table
        :dataSource="houses"
        :columns="columns"
        :loading="loading"
        :pagination="{
          current: page,
          pageSize: limit,
          total: total,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20', '50'],
          showTotal: (total) => `Tổng cộng ${total} mục`
        }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <a class="font-semibold" @click="goToRooms(record.id)">{{ record.name }}</a>
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
