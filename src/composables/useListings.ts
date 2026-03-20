import { ref, computed } from 'vue'
import listingService, { type MarketListing } from '@/api/listingService'

export function useListings() {
  const listings = ref<MarketListing[]>([])
  const total = ref(0)
  const page = ref(1)
  const limit = 20
  const loading = ref(false)
  const error = ref<string | null>(null)

  const hasMore = computed(() => listings.value.length < total.value)

  async function fetchListings(reset = false) {
    if (reset) {
      page.value = 1
      listings.value = []
    }
    try {
      loading.value = true
      error.value = null
      const res = await listingService.getListings({ page: page.value, limit })
      if (res.status) {
        listings.value = reset
          ? res.data.listings
          : [...listings.value, ...res.data.listings]
        total.value = res.data.total
      }
    } catch (e) {
      error.value = 'Không thể tải dữ liệu. Vui lòng thử lại.'
    } finally {
      loading.value = false
    }
  }

  async function loadMore() {
    page.value++
    await fetchListings()
  }

  return { listings, total, loading, error, hasMore, fetchListings, loadMore }
}
