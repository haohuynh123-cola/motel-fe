<script setup lang="ts">
import { onMounted, onUnmounted, watch, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
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
  latitude: number
  longitude: number
  title: string
}>()

const mapContainer = ref<HTMLElement | null>(null)
let map: L.Map | null = null

onMounted(() => {
  if (!mapContainer.value || !props.latitude || !props.longitude) return

  map = L.map(mapContainer.value, { zoomControl: true, scrollWheelZoom: false }).setView(
    [props.latitude, props.longitude],
    16,
  )

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map)

  L.marker([props.latitude, props.longitude])
    .addTo(map)
    .bindPopup(`<strong style="font-size:13px">${props.title}</strong>`, { closeButton: false })
    .openPopup()
})

watch(
  () => [props.latitude, props.longitude],
  ([lat, lng]) => {
    if (!map || !lat || !lng) return
    map.setView([lat as number, lng as number], 16)
  },
)

onUnmounted(() => {
  map?.remove()
  map = null
})
</script>

<template>
  <div v-if="latitude && longitude">
    <p class="text-xs text-gray-400 uppercase tracking-widest font-bold mb-3">Vị trí trên bản đồ</p>
    <div ref="mapContainer" class="single-map" />
    <p class="text-xs text-gray-400 mt-2 flex items-center gap-1">
      <span>📍</span>
      {{ latitude.toFixed(6) }}, {{ longitude.toFixed(6) }}
    </p>
  </div>
</template>

<style scoped>
.single-map {
  width: 100%;
  height: 280px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}
</style>
