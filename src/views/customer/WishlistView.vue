<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { HeartFilled } from '@ant-design/icons-vue'
import { useWishlist } from '@/composables/useWishlist'
import listingService, { type MarketListing } from '@/api/listingService'
import ListingCard from './components/ListingCard.vue'

const router = useRouter()
const { wishlist, clearWishlist } = useWishlist()

const listings = ref<MarketListing[]>([])
const loading = ref(false)

onMounted(async () => {
  if (!wishlist.value.length) return
  loading.value = true
  try {
    const results = await Promise.allSettled(
      wishlist.value.map((id) => listingService.getListingById(id)),
    )
    listings.value = results
      .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled' && r.value.status)
      .map((r) => r.value.data)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="bg-white min-h-screen pb-20">
    <!-- Header -->
    <div class="bg-blue-600 pt-16 pb-20 px-4 text-center relative overflow-hidden">
      <div class="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
      <div class="relative z-10">
        <HeartFilled class="text-5xl text-red-400 mb-4" />
        <h1 class="text-3xl md:text-4xl font-black text-white mb-3">Trọ yêu thích</h1>
        <p class="text-blue-100 text-base md:text-lg max-w-xl mx-auto">
          Những phòng trọ bạn đã lưu lại để xem sau.
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
      <!-- Loading skeletons -->
      <div
        v-if="loading"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
      >
        <div v-for="i in 4" :key="i" class="animate-pulse bg-gray-50 rounded-2xl overflow-hidden">
          <div class="h-52 bg-gray-200"></div>
          <div class="p-4 space-y-3">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
            <div class="h-3 bg-gray-100 rounded w-full"></div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="!wishlist.length || !listings.length"
        class="flex flex-col items-center justify-center py-32 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 mt-4"
      >
        <HeartFilled class="text-6xl text-gray-200 mb-6" />
        <p class="text-gray-500 font-semibold text-lg mb-2">Chưa có trọ yêu thích</p>
        <p class="text-gray-400 text-sm text-center max-w-sm mb-6">
          Khám phá và lưu lại những phòng bạn thích!
        </p>
        <a-button
          type="primary"
          size="large"
          class="rounded-xl bg-blue-600 font-bold px-8"
          @click="router.push('/explore')"
        >
          Khám phá ngay
        </a-button>
      </div>

      <!-- Listings Grid -->
      <template v-else>
        <div class="flex items-center justify-between mb-6 mt-4">
          <p class="text-gray-500 text-sm font-medium">
            <span class="text-blue-600 font-black text-base">{{ listings.length }}</span>
            phòng trọ yêu thích
          </p>
          <a-button
            type="text"
            danger
            class="font-bold text-sm"
            @click="clearWishlist(); listings = []"
          >
            Xoá tất cả
          </a-button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <ListingCard v-for="listing in listings" :key="listing.id" :listing="listing" />
        </div>
      </template>
    </div>
  </div>
</template>
