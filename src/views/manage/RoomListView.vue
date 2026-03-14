<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { SyncOutlined, ArrowLeftOutlined, FileTextOutlined } from '@ant-design/icons-vue';
import roomService from '../api/roomService';

const route = useRoute();
const router = useRouter();
const houseId = route.params.id;

const rooms = ref([]);
const loading = ref(false);

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
    customRender: ({ text }) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(text)
  },
  {
    title: 'Trạng thái',
    dataIndex: 'is_available',
    key: 'is_available',
    customRender: ({ text }) => text ? 'Còn trống' : 'Đã thuê'
  },
  {
    title: 'Thao tác',
    key: 'action',
    width: 200,
    align: 'center'
  },
];

const fetchRooms = async () => {
  try {
    loading.value = true;
    const response = await roomService.getRoomsByHouse(houseId);
    if (response.status) {
      rooms.value = response.data.map(item => ({
        ...item,
        key: item.id
      }));
    }
  } catch (error) {
    message.error('Lỗi tải danh sách phòng!');
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.push('/manage/houses');
};

const viewContracts = () => {
  router.push(`/manage/houses/${houseId}/contracts`);
};

onMounted(() => {
  fetchRooms();
});
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
        <a-button type="primary" @click="fetchRooms" :loading="loading" class="inline-flex items-center">
          <template #icon><SyncOutlined /></template>
          <span>Làm mới</span>
        </a-button>
      </div>
    </div>

    <a-card :bordered="false" class="shadow-sm rounded-lg">
      <a-table
        :dataSource="rooms"
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
