<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import {
    SearchOutlined,
    EnvironmentOutlined,
    DollarOutlined,
    FireOutlined,
    ReloadOutlined,
    AppstoreOutlined,
    CompassOutlined,
  } from '@ant-design/icons-vue'
  import { useListings } from '@/composables/useListings'
  import ListingCard from './components/ListingCard.vue'
  import ListingMapView from './components/ListingMapView.vue'

  const { listings, total, loading, error, hasMore, fetchListings, loadMore } = useListings()

  const viewMode = ref<'grid' | 'map'>('grid')

  onMounted(() => fetchListings(true))
</script>

<template>
  <div class="bg-white min-h-screen pb-20">
    <!-- Hero Section -->
    <div class="relative bg-blue-600 pt-20 pb-40 px-4 overflow-hidden">
      <div
        class="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500 rounded-full opacity-20 blur-3xl"
      ></div>
      <div
        class="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-400 rounded-full opacity-10 blur-3xl"
      ></div>

      <div class="relative z-10 text-center">
        <h1 class="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
          Tìm trọ ưng ý, <br class="hidden sm:block" />thuê phòng cực dễ.
        </h1>
        <p class="text-blue-100 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium opacity-90">
          Tổng hợp tin đăng phòng trọ mới nhất từ Chợ Tốt, cập nhật mỗi giờ.
        </p>

        <div
          class="max-w-4xl mx-auto bg-white p-2.5 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-2 border-4 border-blue-500/20"
        >
          <div class="flex-1 flex items-center px-5 py-2">
            <SearchOutlined class="text-blue-500 text-xl mr-4" />
            <input
              type="text"
              placeholder="Bạn muốn tìm phòng trọ ở đâu?"
              class="w-full h-10 outline-none text-gray-700 font-bold placeholder:text-gray-300 placeholder:font-medium"
            />
          </div>
          <div class="w-px h-8 bg-gray-100 hidden md:block self-center"></div>
          <div class="flex-1 flex items-center px-5 py-2 hidden sm:flex">
            <EnvironmentOutlined class="text-blue-500 text-xl mr-4" />
            <select
              class="w-full h-10 outline-none text-gray-700 font-bold bg-transparent appearance-none"
            >
              <option>Toàn quốc</option>
              <option>TP. Hồ Chí Minh</option>
              <option>Hà Nội</option>
              <option>Đà Nẵng</option>
            </select>
          </div>
          <a-button
            type="primary"
            class="h-14 md:px-12 rounded-2xl font-black text-lg flex items-center justify-center bg-blue-600 hover:bg-blue-700 border-none shadow-lg shadow-blue-200"
          >
            TÌM KIẾM
          </a-button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
      <!-- Quick Filters -->
      <div class="flex flex-wrap items-center gap-3 mb-8 overflow-x-auto pb-4 no-scrollbar">
        <span class="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] mr-2">Lọc nhanh:</span>
        <button
          class="bg-white hover:bg-blue-50 text-gray-600 hover:text-blue-600 px-5 py-2.5 rounded-full font-bold text-sm shadow-sm border border-gray-100 transition-all flex items-center gap-2"
        >
          <FireOutlined class="text-orange-500" /> Mới nhất
        </button>
        <button
          class="bg-white hover:bg-blue-50 text-gray-600 hover:text-blue-600 px-5 py-2.5 rounded-full font-bold text-sm shadow-sm border border-gray-100 transition-all flex items-center gap-2"
        >
          <DollarOutlined class="text-green-500" /> Dưới 3 triệu
        </button>
        <button
          class="bg-white hover:bg-blue-50 text-gray-600 hover:text-blue-600 px-5 py-2.5 rounded-full font-bold text-sm shadow-sm border border-gray-100 transition-all"
        >
          Có nội thất
        </button>
        <button
          class="bg-white hover:bg-blue-50 text-gray-600 hover:text-blue-600 px-5 py-2.5 rounded-full font-bold text-sm shadow-sm border border-gray-100 transition-all"
        >
          Gần trường học
        </button>
      </div>

      <!-- Header đếm kết quả + Toggle view -->
      <div class="flex items-center justify-between mb-6">
        <p class="text-gray-500 text-sm font-medium">
          Tìm thấy
          <span class="text-blue-600 font-black text-base">{{ total.toLocaleString('vi-VN') }}</span>
          tin đăng phòng trọ
        </p>
        <div class="flex items-center gap-3">
          <!-- Grid / Map toggle -->
          <div class="flex items-center bg-gray-100 rounded-xl p-1">
            <button
              :class="[
                'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all',
                viewMode === 'grid'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700',
              ]"
              @click="viewMode = 'grid'"
            >
              <AppstoreOutlined />
              <span>Lưới</span>
            </button>
            <button
              :class="[
                'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all',
                viewMode === 'map'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700',
              ]"
              @click="viewMode = 'map'"
            >
              <CompassOutlined />
              <span>Bản đồ</span>
            </button>
          </div>
          <button
            @click="fetchListings(true)"
            class="flex items-center gap-2 text-gray-400 hover:text-blue-600 text-sm font-bold transition-colors"
          >
            <ReloadOutlined :class="{ 'animate-spin': loading }" />
            Làm mới
          </button>
        </div>
      </div>

      <!-- Skeleton loading -->
      <div
        v-if="loading && listings.length === 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
      >
        <div
          v-for="i in 8"
          :key="i"
          class="animate-pulse bg-gray-50 rounded-2xl overflow-hidden"
        >
          <div class="h-52 bg-gray-200"></div>
          <div class="p-4 space-y-3">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
            <div class="h-3 bg-gray-100 rounded w-full"></div>
          </div>
        </div>
      </div>

      <!-- Map View -->
      <div v-else-if="listings.length > 0 && viewMode === 'map'">
        <ListingMapView :listings="listings" />
        <p class="text-center text-gray-400 text-xs mt-3">
          Hiển thị {{ listings.length }} pin trên bản đồ · chỉ những tin có toạ độ mới có pin
        </p>
      </div>

      <!-- Listings Grid -->
      <div
        v-else-if="listings.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
      >
        <ListingCard
          v-for="listing in listings"
          :key="listing.id"
          :listing="listing"
        />
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="flex flex-col items-center justify-center py-24 bg-red-50 rounded-2xl border border-dashed border-red-200"
      >
        <p class="text-red-500 font-bold mb-4">{{ error }}</p>
        <a-button type="primary" danger @click="fetchListings(true)">Thử lại</a-button>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="flex flex-col items-center justify-center py-32 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200"
      >
        <a-empty description="Chưa có tin đăng nào. Crawler đang thu thập dữ liệu..." />
        <a-button type="link" @click="fetchListings(true)" class="mt-4 font-bold">
          Tải lại
        </a-button>
      </div>

      <!-- Load More — chỉ hiển thị ở chế độ lưới -->
      <div v-if="!loading && hasMore && viewMode === 'grid'" class="flex justify-center mt-10">
        <a-button
          size="large"
          @click="loadMore"
          class="rounded-full px-10 font-bold border-blue-200 text-blue-600 hover:border-blue-500"
        >
          Xem thêm {{ total - listings.length }} tin
        </a-button>
      </div>

      <!-- Loading more indicator -->
      <div v-if="loading && listings.length > 0" class="flex justify-center mt-10">
        <a-spin size="large" />
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
