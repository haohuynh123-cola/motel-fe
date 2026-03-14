<script setup>
import { ref, onMounted, computed } from 'vue';
import { 
  HomeOutlined, 
  TeamOutlined, 
  FileProtectOutlined, 
  DollarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  AppstoreOutlined,
  ArrowUpOutlined,
  RiseOutlined
} from '@ant-design/icons-vue';
import dashboardService from '../api/dashboardService';

const stats = ref([
  { title: 'Tổng nhà trọ', value: '0', icon: HomeOutlined, color: 'text-blue-500', bgColor: 'bg-blue-50', desc: 'Hệ thống quản lý' },
  { title: 'Hợp đồng mới', value: '0', icon: FileProtectOutlined, color: 'text-green-500', bgColor: 'bg-green-50', desc: 'Đang hiệu lực' },
  { title: 'Khách thuê', value: '0', icon: TeamOutlined, color: 'text-purple-500', bgColor: 'bg-purple-50', desc: 'Đang cư trú' },
  { title: 'Doanh thu tháng', value: '0đ', icon: DollarOutlined, color: 'text-yellow-500', bgColor: 'bg-yellow-50', desc: 'Dự kiến thu' },
]);

const roomStats = ref({
  total: 0,
  available: 0,
  occupied: 0
});

const loading = ref(false);

const fillRate = computed(() => {
  if (roomStats.value.total === 0) return 0;
  return Math.round((roomStats.value.occupied / roomStats.value.total) * 100);
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);
};

const fetchDashboardData = async () => {
  try {
    loading.value = true;
    const response = await dashboardService.getStats();

    if (response.status) {
      const data = response.data;
      stats.value[0].value = data.total_houses;
      stats.value[1].value = data.total_contracts;
      stats.value[2].value = data.total_customers;
      stats.value[3].value = formatCurrency(data.total_revenue);
      
      roomStats.value = data.room_stats;
    }
  } catch (error) {
    console.error('Lỗi tải dữ liệu dashboard:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDashboardData();
});
</script>

<template>
  <div class="p-1">
    <!-- Header Section -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h2 class="text-2xl font-extrabold text-gray-800 m-0">Bảng điều khiển</h2>
        <p class="text-gray-500 mt-1">Chào mừng bạn trở lại, đây là tình hình kinh doanh hôm nay.</p>
      </div>
      <a-button type="primary" class="h-10 rounded-lg inline-flex items-center shadow-md shadow-blue-100">
        <template #icon><RiseOutlined /></template>
        <span class="ml-1">Xem báo cáo chi tiết</span>
      </a-button>
    </div>
    
    <!-- Professional Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      <div v-for="item in stats" :key="item.title" 
           class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
        <div class="flex justify-between items-start mb-4">
          <div :class="['p-3 rounded-xl transition-colors group-hover:scale-110 duration-300', item.bgColor]">
            <component :is="item.icon" :class="['text-2xl', item.color]" />
          </div>
          <div class="flex items-center text-green-500 text-xs font-bold bg-green-50 px-2.5 py-1 rounded-full">
            <ArrowUpOutlined class="mr-1" /> 12%
          </div>
        </div>
        <div>
          <p class="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{{ item.title }}</p>
          <div class="flex items-baseline gap-2">
            <h3 class="text-2xl font-black m-0 text-gray-800">
              <a-skeleton-button v-if="loading" active size="small" />
              <span v-else>{{ item.value }}</span>
            </h3>
          </div>
          <p class="text-gray-400 text-[11px] mt-2 font-medium">{{ item.desc }}</p>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
      <!-- Room Status Card -->
      <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-bold text-gray-800 m-0">Trạng thái phòng trọ</h3>
          <a-tag color="blue" class="rounded-full px-3">Tháng này</a-tag>
        </div>
        
        <div class="flex flex-col md:flex-row items-center gap-12">
          <div class="relative flex flex-col items-center">
            <a-progress
              type="dashboard"
              :percent="fillRate"
              :stroke-width="10"
              :stroke-color="{ '0%': '#3b82f6', '100%': '#10b981' }"
              :width="200"
            />
            <div class="text-center mt-[-20px]">
              <span class="text-sm text-gray-400 font-medium uppercase">Tỉ lệ lấp đầy</span>
            </div>
          </div>

          <div class="flex-1 w-full space-y-4">
            <div class="flex items-center justify-between p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 transition-hover hover:bg-blue-50">
              <div class="flex items-center gap-4">
                <div class="bg-blue-500 p-2 rounded-lg text-white">
                  <AppstoreOutlined />
                </div>
                <span class="text-gray-600 font-semibold">Tổng số phòng</span>
              </div>
              <span class="text-xl font-black text-blue-600">{{ roomStats.total }}</span>
            </div>

            <div class="flex items-center justify-between p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50 transition-hover hover:bg-emerald-50">
              <div class="flex items-center gap-4">
                <div class="bg-emerald-500 p-2 rounded-lg text-white">
                  <CheckCircleOutlined />
                </div>
                <span class="text-gray-600 font-semibold">Phòng đang trống</span>
              </div>
              <span class="text-xl font-black text-emerald-600">{{ roomStats.available }}</span>
            </div>

            <div class="flex items-center justify-between p-4 bg-rose-50/50 rounded-2xl border border-rose-100/50 transition-hover hover:bg-rose-50">
              <div class="flex items-center gap-4">
                <div class="bg-rose-500 p-2 rounded-lg text-white">
                  <CloseCircleOutlined />
                </div>
                <span class="text-gray-600 font-semibold">Phòng đã thuê</span>
              </div>
              <span class="text-xl font-black text-rose-600">{{ roomStats.occupied }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Recent Activities -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-bold text-gray-800 m-0">Hoạt động</h3>
          <a href="#" class="text-blue-500 text-xs font-bold hover:underline">Xem tất cả</a>
        </div>
        
        <a-timeline class="mt-4">
          <a-timeline-item color="#10b981">
            <template #dot><div class="w-2 h-2 rounded-full bg-emerald-500"></div></template>
            <p class="font-bold text-gray-700 m-0">Hợp đồng mới</p>
            <p class="text-xs text-gray-400">Phòng 101 - Nhà A • 2h trước</p>
          </a-timeline-item>
          <a-timeline-item color="#3b82f6">
            <p class="font-bold text-gray-700 m-0">Khách thuê đăng ký</p>
            <p class="text-xs text-gray-400">Nguyễn Văn A • 5h trước</p>
          </a-timeline-item>
          <a-timeline-item color="#f43f5e">
            <p class="font-bold text-gray-700 m-0">Yêu cầu sửa chữa</p>
            <p class="text-xs text-gray-400">Hệ thống điện lầu 2 • Hôm qua</p>
          </a-timeline-item>
          <a-timeline-item color="#94a3b8">
            <p class="font-bold text-gray-700 m-0">Thanh toán hóa đơn</p>
            <p class="text-xs text-gray-400">Tiền điện tháng 3 • 2 ngày trước</p>
          </a-timeline-item>
        </a-timeline>
      </div>
    </div>
  </div>
</template>
