<script setup>
import { ref, onMounted } from 'vue';
import { 
  SearchOutlined, 
  EnvironmentOutlined, 
  DollarOutlined,
  ThunderboltOutlined,
  CheckCircleFilled,
  FireOutlined
} from '@ant-design/icons-vue';
import houseService from '@/api/houseService';

const houses = ref([]);
const loading = ref(false);
const searchQuery = ref('');

const fetchHouses = async () => {
  try {
    loading.value = true;
    const response = await houseService.getHouses({ limit: 20 });
    if (response.status) {
      houses.value = response.data || [];
    }
  } catch (error) {
    console.error('Error fetching houses:', error);
  } finally {
    loading.value = false;
  }
};

const formatPrice = (value) => {
  return new Intl.NumberFormat('vi-VN').format(value || 2000000);
};

onMounted(() => {
  fetchHouses();
});
</script>

<template>
  <div class="bg-white min-h-screen pb-20">
    <!-- Hero Section tinh gọn hơn -->
    <div class="relative bg-blue-600 pt-20 pb-40 px-4 overflow-hidden">
      <!-- Background trang trí -->
      <div class="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
      <div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-400 rounded-full opacity-10 blur-3xl"></div>

      <div class="relative z-10 text-center">
        <h1 class="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">Tìm trọ ưng ý, <br class="hidden sm:block"/>thuê phòng cực dễ.</h1>
        <p class="text-blue-100 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium opacity-90">Hệ thống nhà trọ minh bạch, tiện nghi và được xác thực 100%.</p>
        
        <!-- Search Bar chuyên nghiệp -->
        <div class="max-w-4xl mx-auto bg-white p-2.5 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-2 border-4 border-blue-500/20">
          <div class="flex-1 flex items-center px-5 py-2">
            <SearchOutlined class="text-blue-500 text-xl mr-4" />
            <input v-model="searchQuery" type="text" placeholder="Bạn muốn tìm nhà trọ ở đâu?" class="w-full h-10 outline-none text-gray-700 font-bold placeholder:text-gray-300 placeholder:font-medium" />
          </div>
          <div class="w-px h-8 bg-gray-100 hidden md:block self-center"></div>
          <div class="flex-1 flex items-center px-5 py-2 hidden sm:flex">
            <EnvironmentOutlined class="text-blue-500 text-xl mr-4" />
            <select class="w-full h-10 outline-none text-gray-700 font-bold bg-transparent appearance-none">
              <option>Toàn thành phố</option>
              <option>Quận 1</option>
              <option>Quận Bình Thạnh</option>
              <option>Quận 7</option>
            </select>
          </div>
          <a-button type="primary" class="h-14 md:px-12 rounded-2xl font-black text-lg flex items-center justify-center bg-blue-600 hover:bg-blue-700 border-none shadow-lg shadow-blue-200">
            TÌM KIẾM
          </a-button>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
      <!-- Quick Filters with Pills style -->
      <div class="flex flex-wrap items-center gap-3 mb-12 overflow-x-auto pb-4 no-scrollbar">
        <span class="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] mr-2">Lọc nhanh:</span>
        <button class="bg-white hover:bg-blue-50 text-gray-600 hover:text-blue-600 px-5 py-2.5 rounded-full font-bold text-sm shadow-sm border border-gray-100 transition-all flex items-center gap-2">
          <FireOutlined class="text-orange-500" /> Hot nhất
        </button>
        <button class="bg-white hover:bg-blue-50 text-gray-600 hover:text-blue-600 px-5 py-2.5 rounded-full font-bold text-sm shadow-sm border border-gray-100 transition-all flex items-center gap-2">
          <DollarOutlined class="text-green-500" /> Giá rẻ
        </button>
        <button class="bg-white hover:bg-blue-50 text-gray-600 hover:text-blue-600 px-5 py-2.5 rounded-full font-bold text-sm shadow-sm border border-gray-100 transition-all">Gần trung tâm</button>
        <button class="bg-white hover:bg-blue-50 text-gray-600 hover:text-blue-600 px-5 py-2.5 rounded-full font-bold text-sm shadow-sm border border-gray-100 transition-all">Phòng mới</button>
      </div>

      <!-- House Grid -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <div v-for="i in 8" :key="i" class="animate-pulse bg-gray-50 h-[400px] rounded-3xl"></div>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        <div v-for="house in houses" :key="house.id" 
             class="group bg-white rounded-[40px] overflow-hidden border border-gray-50 shadow-sm hover:shadow-[0_20px_50px_rgba(8,112,184,0.1)] transition-all duration-500 hover:-translate-y-2">
          <!-- Thumbnail -->
          <div class="relative h-64 overflow-hidden">
            <img :src="`https://picsum.photos/seed/${house.id}/800/600`" 
                 class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
            
            <div class="absolute top-5 left-5 flex flex-col gap-2">
              <span class="bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-lg">Mới đăng</span>
            </div>

            <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
              <div class="flex items-center gap-2 text-white">
                <CheckCircleFilled class="text-blue-400 text-base" />
                <span class="text-xs font-bold tracking-wide">Xác thực bởi Tro-Go</span>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="p-8">
            <h3 class="text-xl font-black text-gray-800 mb-3 truncate group-hover:text-blue-600 transition-colors">
              {{ house.name }}
            </h3>
            <p class="text-gray-400 text-sm flex items-start gap-2 mb-6 h-10 line-clamp-2 leading-relaxed">
              <EnvironmentOutlined class="mt-1 text-blue-500 flex-shrink-0" />
              {{ house.address }}
            </p>
            
            <div class="flex items-end justify-between border-t border-gray-50 pt-6">
              <div>
                <p class="text-gray-300 text-[9px] font-black uppercase tracking-[0.2em] mb-1">Giá thuê từ</p>
                <div class="flex items-baseline gap-1">
                  <span class="text-2xl font-black text-gray-800">{{ formatPrice(3500000) }}</span>
                  <span class="text-gray-400 text-xs font-bold">/tháng</span>
                </div>
              </div>
              <button class="bg-gray-900 text-white p-4 rounded-2xl hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-200">
                <ThunderboltOutlined class="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && houses.length === 0" class="flex flex-col items-center justify-center py-32 bg-gray-50 rounded-[50px] border-2 border-dashed border-gray-200">
        <a-empty description="Hiện tại khu vực này chưa có nhà trọ nào." />
        <a-button type="link" @click="fetchHouses" class="mt-4 font-bold">Thử tải lại dữ liệu</a-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
