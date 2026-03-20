<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeftOutlined,
  EnvironmentOutlined,
  ExpandOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  LinkOutlined,
  PictureOutlined,
} from '@ant-design/icons-vue'
import listingService, { type MarketListing } from '@/api/listingService'
import SingleListingMap from './components/SingleListingMap.vue'

const props = defineProps<{ id: string }>()
const router = useRouter()

const listing = ref<MarketListing | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const activeImage = ref(0)

onMounted(async () => {
  try {
    loading.value = true
    const res = await listingService.getListingById(props.id)
    if (res.status) listing.value = res.data
  } catch {
    error.value = 'Không tìm thấy tin đăng này.'
  } finally {
    loading.value = false
  }
})

const allImages = computed(() => {
  if (!listing.value) return []
  const imgs = listing.value.images?.length ? listing.value.images : []
  if (listing.value.image_url && !imgs.includes(listing.value.image_url)) {
    return [listing.value.image_url, ...imgs]
  }
  return imgs
})

const formattedPrice = computed(() =>
  listing.value
    ? new Intl.NumberFormat('vi-VN').format(listing.value.price) + ' đ/tháng'
    : '',
)

const timeAgo = computed(() => {
  if (!listing.value) return ''
  const diff = Date.now() - new Date(listing.value.posted_at).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 24) return `${h} giờ trước`
  return `${Math.floor(h / 24)} ngày trước`
})

const descriptionLines = computed(() =>
  listing.value?.description?.split('\n').filter(Boolean) ?? [],
)
</script>

<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- Back bar -->
    <div class="bg-white border-b border-gray-100 px-4 py-3 sticky top-[80px] z-30">
      <div class="max-w-5xl mx-auto flex items-center gap-3">
        <button
          @click="router.back()"
          class="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold text-sm transition-colors"
        >
          <ArrowLeftOutlined />
          Quay lại danh sách
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="max-w-5xl mx-auto px-4 py-16 flex justify-center">
      <a-spin size="large" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="max-w-5xl mx-auto px-4 py-20 text-center">
      <a-result status="404" :title="error">
        <template #extra>
          <a-button type="primary" @click="router.push('/explore')">Về trang tìm kiếm</a-button>
        </template>
      </a-result>
    </div>

    <!-- Content -->
    <div v-else-if="listing" class="max-w-5xl mx-auto px-4 pt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

      <!-- LEFT: Images + Description -->
      <div class="lg:col-span-2 flex flex-col gap-5">

        <!-- Image gallery -->
        <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <!-- Main image -->
          <div class="relative h-80 md:h-[420px] bg-gray-100">
            <img
              v-if="allImages[activeImage]"
              :src="allImages[activeImage]"
              :alt="listing.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <PictureOutlined class="text-5xl text-gray-300" />
            </div>

            <span class="absolute top-4 right-4 bg-black/50 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
              {{ activeImage + 1 }} / {{ allImages.length }}
            </span>
          </div>

          <!-- Thumbnails -->
          <div v-if="allImages.length > 1" class="flex gap-2 p-3 overflow-x-auto no-scrollbar">
            <button
              v-for="(img, i) in allImages"
              :key="i"
              @click="activeImage = i"
              class="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all"
              :class="i === activeImage ? 'border-blue-500' : 'border-transparent opacity-60 hover:opacity-100'"
            >
              <img :src="img" class="w-full h-full object-cover" loading="lazy" />
            </button>
          </div>
        </div>

        <!-- Title + info -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div class="flex items-start justify-between gap-4 mb-4">
            <h1 class="text-xl md:text-2xl font-black text-gray-800 leading-snug">
              {{ listing.title }}
            </h1>
            <span class="bg-orange-500 text-white text-[10px] font-black uppercase tracking-wide px-3 py-1.5 rounded-lg flex-shrink-0">
              Chợ Tốt
            </span>
          </div>

          <div class="flex flex-wrap gap-4 text-sm text-gray-500 mb-5">
            <span class="flex items-center gap-1.5">
              <ExpandOutlined class="text-blue-500" />
              <strong class="text-gray-700">{{ listing.area }}</strong> m²
            </span>
            <span class="flex items-center gap-1.5">
              <EnvironmentOutlined class="text-blue-500" />
              {{ listing.address }}
            </span>
            <span class="flex items-center gap-1.5">
              <ClockCircleOutlined class="text-gray-400" />
              {{ timeAgo }}
            </span>
          </div>

          <div class="border-t border-gray-50 pt-5">
            <p class="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Mô tả tin đăng</p>
            <div class="text-gray-600 text-sm leading-relaxed space-y-1.5">
              <p v-for="(line, i) in descriptionLines" :key="i">{{ line }}</p>
            </div>
          </div>
        </div>

        <!-- Map vị trí -->
        <div
          v-if="listing.latitude && listing.longitude"
          class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <SingleListingMap
            :latitude="listing.latitude"
            :longitude="listing.longitude"
            :title="listing.title"
          />
        </div>
      </div>

      <!-- RIGHT: Price + Contact -->
      <div class="flex flex-col gap-4">

        <!-- Price card -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p class="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Giá thuê</p>
          <p class="text-3xl font-black text-blue-600 mb-1">
            {{ new Intl.NumberFormat('vi-VN').format(listing.price) }}
            <span class="text-base text-gray-400 font-bold">đ</span>
          </p>
          <p class="text-gray-400 text-sm font-medium">/ tháng</p>
        </div>

        <!-- Contact card -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p class="text-xs text-gray-400 uppercase tracking-widest font-bold mb-4">Liên hệ</p>

          <div v-if="listing.contact_phone" class="mb-4">
            <a
              :href="`tel:${listing.contact_phone}`"
              class="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3.5 rounded-xl transition-colors"
            >
              <PhoneOutlined />
              {{ listing.contact_phone }}
            </a>
          </div>

          <a
            :href="listing.url"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-center gap-2 w-full border-2 border-orange-400 text-orange-500 hover:bg-orange-50 font-bold py-3 rounded-xl transition-colors text-sm"
          >
            <LinkOutlined />
            Xem trên Chợ Tốt
          </a>
        </div>

        <!-- Meta -->
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-xs text-gray-400 space-y-2">
          <div class="flex justify-between">
            <span>Mã tin</span>
            <span class="font-bold text-gray-600">#{{ listing.id }}</span>
          </div>
          <div class="flex justify-between">
            <span>Nguồn</span>
            <span class="font-bold text-orange-500 capitalize">{{ listing.source }}</span>
          </div>
          <div class="flex justify-between">
            <span>Đăng lúc</span>
            <span class="font-bold text-gray-600">{{ timeAgo }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
