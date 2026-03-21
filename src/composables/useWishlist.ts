import { ref } from 'vue'

const STORAGE_KEY = 'tro_go_wishlist'

const wishlist = ref<string[]>(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist.value))
}

export function useWishlist() {
  function toggleWishlist(id: string): void {
    const idx = wishlist.value.indexOf(id)
    if (idx === -1) {
      wishlist.value = [...wishlist.value, id]
    } else {
      wishlist.value = wishlist.value.filter((i) => i !== id)
    }
    persist()
  }

  function isWishlisted(id: string): boolean {
    return wishlist.value.includes(id)
  }

  function clearWishlist(): void {
    wishlist.value = []
    persist()
  }

  return { wishlist, toggleWishlist, isWishlisted, clearWishlist }
}
