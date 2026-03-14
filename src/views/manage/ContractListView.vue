<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { SyncOutlined, ArrowLeftOutlined } from '@ant-design/icons-vue';
import contractService from '@/api/contractService';

const route = useRoute();
const router = useRouter();
const houseId = route.params.id; // Có thể null nếu đi từ menu Sidebar

const contracts = ref([]);
const loading = ref(false);

const isGeneralView = computed(() => !houseId);

const columns = [
  {
    title: 'Mã hợp đồng',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Phòng ID',
    dataIndex: 'room_id',
    key: 'room_id',
  },
  {
    title: 'Tiền cọc',
    dataIndex: 'deposit',
    key: 'deposit',
    customRender: ({ text }) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(text)
  },
  {
    title: 'Tiền thuê',
    dataIndex: 'monthly_rent',
    key: 'monthly_rent',
    customRender: ({ text }) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(text)
  },
  {
    title: 'Ngày bắt đầu',
    dataIndex: 'start_date',
    key: 'start_date',
    customRender: ({ text }) => new Date(text).toLocaleDateString('vi-VN')
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
  }
];

const fetchContracts = async () => {
  try {
    loading.value = true;
    let response;
    if (houseId) {
      response = await contractService.getContractsByHouse(houseId);
    } else {
      response = await contractService.getAllContracts();
    }

    if (response.status) {
      const data = response.data || [];
      contracts.value = data.map(item => ({
        ...item,
        key: item.id
      }));
    }
  } catch (error) {
    message.error('Lỗi tải danh sách hợp đồng!');
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  if (houseId) {
    router.push(`/manage/houses/${houseId}/rooms`);
  } else {
    router.push('/manage/houses');
  }
};

onMounted(() => {
  fetchContracts();
});
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center gap-4">
        <a-button @click="goBack" class="inline-flex items-center justify-center">
          <template #icon><ArrowLeftOutlined /></template>
        </a-button>
        <h2 class="text-2xl font-bold m-0">
          {{ isGeneralView ? 'Tất cả hợp đồng' : 'Hợp đồng của nhà' }}
        </h2>
      </div>
      <a-button type="primary" @click="fetchContracts" :loading="loading" class="inline-flex items-center">
        <template #icon><SyncOutlined /></template>
        <span>Làm mới</span>
      </a-button>
    </div>

    <a-card :bordered="false" class="shadow-sm rounded-lg">
      <a-table
        :dataSource="contracts"
        :columns="columns"
        :loading="loading"
        :pagination="{ pageSize: 10 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag color="blue">{{ record.status }}</a-tag>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>
