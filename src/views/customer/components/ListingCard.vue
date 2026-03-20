<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  EnvironmentOutlined,
  ExpandOutlined,
  ClockCircleOutlined,
  RightOutlined,
} from '@ant-design/icons-vue'
import type { MarketListing } from '@/api/listingService'

const props = defineProps<{ listing: MarketListing }
const router = useRouter()

const formattedPrice = computed(() =>
  new Intl.NumberFormat('vi-VN').format(props.listing.price) + ' đ/tháng',
)

const timeAgo = computed(() => {
  const diff = Date.now() - new Date(props.listing.posted_at).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes} phút trước`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} giờ trước`
  return `${Math.floor(hours / 24)} ngày trước`
})

const coverImage = computed(
  () => props.listing.image_url || props.listing.images?.[0] || '',
)

const shortAddress = computed(() => {
  const parts = props.listing.address?.split(',') ?? []
  return parts.slice(-2).join(',').trim() || props.listing.address
})

const goToDetail = () => router.push({ name: 'ListingDetail', params: { id: props.listing.id } })
</script>

<template>
  <div
    @click="goToDetail"
    class="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-50 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
  >
    <div class="relative h-52 overflow-hidden bg-gray-100 flex-shrink-0">
      <img
        v-if="coverImage"
        :src="coverImage"
        :alt="listing.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div v-else class="w-full h-full flex items-center justify-center bg-gray-100">
        <ExpandOutlined class="text-4xl text-gray-300" />
      </div>

      <div class="absolute top-3 left-3 flex gap-2">
        <span class="bg-orange-500 text-white text-[10px] font-black uppercase tracking-wide px-2.5 py-1 rounded-lg">Chợ Tốt</span>
        <span v-if="listing.images?.length > 1" class="bg-black/50 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm">
          📷 {{ listing.images.length }}
        </span>
      </div>

      <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8">
        <p class="text-white font-black text-lg leading-none">{{ formattedPrice }}</p>
      </div>
    </div>

    <div class="p-4 flex flex-col gap-2 flex-1">
      <h3 class="font-bold text-gray-800 text-sm leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors min-h-[2.5rem]">
        {{ listing.title }}
      </h3>

      <div class="flex items-center gap-3 text-gray-400 text-xs">
        <span class="flex items-center gap-1">
          <ExpandOutlined class="text-blue-400" />{{ listing.area }} m²
        </span>
        <span class="w-1 h-1 rounded-full bg-gray-200"></span>
        <span class="flex items-center gap-1 truncate">
          <EnvironmentOutlined class="text-blue-400 flex-shrink-0" />
          <span class="truncate">{{ shortAddress }}</span>
        </span>
      </div>

      <div class="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
        <span class="flex items-center gap-1 text-gray-300 text-[11px]">
          <ClockCircleOutlined />{{ timeAgo }}
        </span>
        <span class="flex items-center gap-1 text-blue-500 text-[11px] font-bold">
          Xem chi tiết <RightOutlined />
        </span>
      </div>
    </div>
  </div>
</template>
