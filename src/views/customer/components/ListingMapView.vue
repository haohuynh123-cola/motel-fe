<script setup lang="ts">
import { onMounted, onUnmounted, watch, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { MarketListing } from '@/api/listingService'
import { useRouter } from 'vue-router'

// Fix default marker icon path issue with Vite/webpack bundlers
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const props = defineProps<{
  listings: MarketListing[]
}>()

const router = useRouter()
const mapContainer = ref<HTMLElement | null>(null)
let map: L.Map | null = null
let markersLayer: L.LayerGroup | null = null

function formatPrice(price: number): string {
  if (price >= 1_000_000) return `${(price / 1_000_000).toFixed(1)} tr/th`
  if (price >= 1_000) return `${(price / 1_000).toFixed(0)}k/th`
  return `${price.toLocaleString('vi-VN')} đ`
}

function createPopupContent(listing: MarketListing): string {
  const img = listing.image_url
    ? `<img src="${listing.image_url}" alt="${listing.title}" style="width:100%;height:100px;object-fit:cover;border-radius:6px;margin-bottom:8px;">`
    : ''
  return `
    <div style="width:200px;font-family:sans-serif;">
      ${img}
      <div style="font-weight:600;font-size:13px;margin-bottom:4px;line-height:1.3;">${listing.title}</div>
      <div style="color:#e53e3e;font-weight:700;font-size:14px;margin-bottom:4px;">${formatPrice(listing.price)}</div>
      ${listing.area ? `<div style="color:#666;font-size:12px;margin-bottom:8px;">📐 ${listing.area} m²</div>` : ''}
      <button
        onclick="window.__goToListing('${listing.id}')"
        style="width:100%;padding:6px;background:#f97316;color:white;border:none;border-radius:6px;cursor:pointer;font-size:13px;font-weight:600;"
      >Xem chi tiết →</button>
    </div>
  `
}

function buildMarkers() {
  if (!map || !markersLayer) return
  markersLayer.clearLayers()

  const validListings = props.listings.filter(l => l.latitude !== 0 && l.longitude !== 0)

  validListings.forEach(listing => {
    const marker = L.marker([listing.latitude, listing.longitude])
    marker.bindPopup(createPopupContent(listing), { maxWidth: 220 })
    markersLayer!.addLayer(marker)
  })

  // Fit map bounds to all markers
  if (validListings.length > 0) {
    const bounds = L.latLngBounds(validListings.map(l => [l.latitude, l.longitude]))
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 })
  }
}

onMounted(() => {
  if (!mapContainer.value) return

  // Expose router navigation to popup button onclick
  ;(window as any).__goToListing = (id: string) => {
    router.push(`/listings/${id}`)
  }

  map = L.map(mapContainer.value).setView([21.028511, 105.804817], 12)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map)

  markersLayer = L.layerGroup().addTo(map)
  buildMarkers()
})

watch(() => props.listings, buildMarkers)

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
  delete (window as any).__goToListing
})
</script>

<template>
  <div ref="mapContainer" class="listing-map" />
</template>

<style scoped>
.listing-map {
  width: 100%;
  height: 600px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
}
</style>
