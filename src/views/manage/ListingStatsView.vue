<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
  HomeOutlined,
  DollarOutlined,
  ExpandOutlined,
  FireOutlined,
} from '@ant-design/icons-vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Bar, Doughnut } from 'vue-chartjs'
import listingService, { type ListingStats } from '@/api/listingService'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

const loading = ref(true)
const error = ref<string | null>(null)
const stats = ref<ListingStats | null>(null)
const source = ref('chotot')

function formatPrice(price: number): string {
  if (price >= 1000000) return (price / 1000000).toFixed(1) + ' triệu'
  return price.toLocaleString('vi-VN') + ' đ'
}

const statCards = computed(() => {
  if (!stats.value) return []
  return [
    {
      title: 'Tổng tin đăng',
      value: stats.value.total.toLocaleString('vi-VN'),
      icon: HomeOutlined,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      desc: 'Toàn bộ tin đăng',
    },
    {
      title: 'Giá trung bình',
      value: formatPrice(stats.value.avg_price) + '/tháng',
      icon: DollarOutlined,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
      desc: `Min: ${formatPrice(stats.value.min_price)} · Max: ${formatPrice(stats.value.max_price)}`,
    },
    {
      title: 'Diện tích TB',
      value: stats.value.avg_area.toFixed(1) + ' m²',
      icon: ExpandOutlined,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      desc: 'Trung bình diện tích phòng',
    },
    {
      title: 'Mới 24h',
      value: stats.value.recent_count.toLocaleString('vi-VN'),
      icon: FireOutlined,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      desc: 'Tin đăng trong 24 giờ qua',
    },
  ]
})

const priceChartData = computed(() => {
  if (!stats.value) return { labels: [], datasets: [] }
  return {
    labels: stats.value.price_ranges.map((r) => r.label),
    datasets: [
      {
        label: 'Số tin đăng',
        data: stats.value.price_ranges.map((r) => r.count),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(99, 102, 241, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(217, 70, 239, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  }
})

const areaChartData = computed(() => {
  if (!stats.value) return { labels: [], datasets: [] }
  return {
    labels: stats.value.area_ranges.map((r) => r.label),
    datasets: [
      {
        data: stats.value.area_ranges.map((r) => r.count),
        backgroundColor: [
          'rgba(16, 185, 129, 0.85)',
          'rgba(59, 130, 246, 0.85)',
          'rgba(139, 92, 246, 0.85)',
          'rgba(245, 158, 11, 0.85)',
          'rgba(239, 68, 68, 0.85)',
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  }
})

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: { display: false },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(0,0,0,0.05)' },
      ticks: { font: { size: 12 } },
    },
    x: {
      grid: { display: false },
      ticks: { font: { size: 11 } },
    },
  },
}

const doughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: { font: { size: 12 }, padding: 16 },
    },
  },
}

async function fetchStats() {
  loading.value = true
  error.value = null
  try {
    const res = await listingService.getStats(source.value)
    if (res.status) {
      stats.value = res.data
    } else {
      error.value = 'Không thể tải dữ liệu thống kê'
    }
  } catch (e) {
    error.value = 'Lỗi kết nối đến máy chủ'
  } finally {
    loading.value = false
  }
}

onMounted(fetchStats)
</script>

<template>
  <div class="p-1">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h2 class="text-2xl font-extrabold text-gray-800 m-0">Thống kê thị trường trọ</h2>
        <p class="text-gray-500 mt-1">Phân tích dữ liệu tin đăng từ nền tảng {{ source }}</p>
      </div>
      <div class="flex items-center gap-3">
        <a-select v-model:value="source" style="width: 140px" @change="fetchStats">
          <a-select-option value="chotot">Chợ Tốt</a-select-option>
          <a-select-option value="nhatot">Nhà Tốt</a-select-option>
        </a-select>
        <a-button type="primary" class="h-10 rounded-lg shadow-md shadow-blue-100" @click="fetchStats">
          Làm mới
        </a-button>
      </div>
    </div>

    <!-- Error state -->
    <a-alert v-if="error" :message="error" type="error" show-icon class="mb-6 rounded-xl" />

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center py-24">
      <a-spin size="large" />
    </div>

    <template v-else-if="stats">
      <!-- Stat Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <div
          v-for="item in statCards"
          :key="item.title"
          class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
        >
          <div class="flex justify-between items-start mb-4">
            <div :class="['p-3 rounded-xl transition-colors group-hover:scale-110 duration-300', item.bgColor]">
              <component :is="item.icon" :class="['text-2xl', item.color]" />
            </div>
          </div>
          <div>
            <p class="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{{ item.title }}</p>
            <h3 class="text-2xl font-black m-0 text-gray-800">{{ item.value }}</h3>
            <p class="text-gray-400 text-[11px] mt-2 font-medium">{{ item.desc }}</p>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <!-- Price Distribution Bar Chart -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-gray-800 m-0">Phân bố giá thuê</h3>
            <a-tag color="blue" class="rounded-full px-3">Giá/tháng</a-tag>
          </div>
          <div style="height: 280px">
            <Bar :data="priceChartData" :options="barChartOptions" />
          </div>
        </div>

        <!-- Area Distribution Doughnut Chart -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-gray-800 m-0">Phân bố diện tích</h3>
            <a-tag color="purple" class="rounded-full px-3">m²</a-tag>
          </div>
          <div style="height: 280px">
            <Doughnut :data="areaChartData" :options="doughnutChartOptions" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
