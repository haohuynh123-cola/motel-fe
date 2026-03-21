<script setup lang="ts">
import { ref, computed } from 'vue'
import { EnvironmentOutlined, DownOutlined, CloseCircleFilled } from '@ant-design/icons-vue'
import locationService, { type Province, type District, type Ward } from '@/api/locationService'

export interface LocationValue {
  province?: Province
  district?: District
  ward?: Ward
}

const props = defineProps<{ modelValue?: LocationValue }>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: LocationValue): void
}>()

const open = ref(false)
const provinces = ref<Province[]>([])
const districts = ref<District[]>([])
const wards = ref<Ward[]>([])
const loadingProvinces = ref(false)
const loadingDistricts = ref(false)
const loadingWards = ref(false)

const selectedProvince = ref<Province | undefined>(props.modelValue?.province)
const selectedDistrict = ref<District | undefined>(props.modelValue?.district)
const selectedWard = ref<Ward | undefined>(props.modelValue?.ward)

async function loadProvinces() {
  if (provinces.value.length) return
  loadingProvinces.value = true
  try {
    provinces.value = await locationService.getProvinces()
  } finally {
    loadingProvinces.value = false
  }
}

async function onProvinceChange(code: number) {
  selectedProvince.value = provinces.value.find((p) => p.code === code)
  selectedDistrict.value = undefined
  selectedWard.value = undefined
  districts.value = []
  wards.value = []
  if (code) {
    loadingDistricts.value = true
    try {
      districts.value = await locationService.getDistricts(code)
    } finally {
      loadingDistricts.value = false
    }
  }
}

async function onDistrictChange(code: number) {
  selectedDistrict.value = districts.value.find((d) => d.code === code)
  selectedWard.value = undefined
  wards.value = []
  if (code) {
    loadingWards.value = true
    try {
      wards.value = await locationService.getWards(code)
    } finally {
      loadingWards.value = false
    }
  }
}

function onWardChange(code: number) {
  selectedWard.value = wards.value.find((w) => w.code === code)
}

function apply() {
  emit('update:modelValue', {
    province: selectedProvince.value,
    district: selectedDistrict.value,
    ward: selectedWard.value,
  })
  open.value = false
}

function reset() {
  selectedProvince.value = undefined
  selectedDistrict.value = undefined
  selectedWard.value = undefined
  districts.value = []
  wards.value = []
  emit('update:modelValue', {})
}

const displayLabel = computed(() => {
  if (!props.modelValue?.province) return 'Khu vực'
  const parts = [props.modelValue.province.name]
  if (props.modelValue.district) parts.push(props.modelValue.district.name)
  if (props.modelValue.ward) parts.push(props.modelValue.ward.name)
  return parts.join(' › ')
})

const hasValue = computed(() => !!props.modelValue?.province)
</script>

<template>
  <a-popover
    v-model:open="open"
    trigger="click"
    placement="bottomLeft"
    :arrow="false"
    :overlay-inner-style="{ padding: 0, borderRadius: '16px', overflow: 'hidden', minWidth: '320px' }"
    @open-change="(v: boolean) => { if (v) loadProvinces() }"
  >
    <template #content>
      <div class="p-4 w-80">
        <h4 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <EnvironmentOutlined class="text-blue-500" />
          Khu vực
        </h4>
        <div class="space-y-3">
          <a-select
            :value="selectedProvince?.code"
            placeholder="Chọn tỉnh thành"
            class="w-full"
            :loading="loadingProvinces"
            show-search
            :filter-option="(input: string, option: any) => option.label?.toLowerCase().includes(input.toLowerCase())"
            allow-clear
            :options="provinces.map((p) => ({ value: p.code, label: p.name }))"
            @change="onProvinceChange"
            @clear="() => { selectedProvince = undefined; selectedDistrict = undefined; selectedWard = undefined; districts = []; wards = [] }"
          />
          <a-select
            :value="selectedDistrict?.code"
            placeholder="Chọn quận huyện"
            class="w-full"
            :loading="loadingDistricts"
            :disabled="!selectedProvince"
            show-search
            :filter-option="(input: string, option: any) => option.label?.toLowerCase().includes(input.toLowerCase())"
            allow-clear
            :options="districts.map((d) => ({ value: d.code, label: d.name }))"
            @change="onDistrictChange"
            @clear="() => { selectedDistrict = undefined; selectedWard = undefined; wards = [] }"
          />
          <a-select
            :value="selectedWard?.code"
            placeholder="Chọn phường xã"
            class="w-full"
            :loading="loadingWards"
            :disabled="!selectedDistrict"
            show-search
            :filter-option="(input: string, option: any) => option.label?.toLowerCase().includes(input.toLowerCase())"
            allow-clear
            :options="wards.map((w) => ({ value: w.code, label: w.name }))"
            @change="onWardChange"
            @clear="() => { selectedWard = undefined }"
          />
        </div>
        <div class="flex gap-2 mt-4">
          <a-button class="flex-1" @click="reset">Xoá</a-button>
          <a-button type="primary" class="flex-1 bg-blue-600" @click="apply">Áp dụng</a-button>
        </div>
      </div>
    </template>

    <button
      :class="[
        'flex items-center gap-2 h-10 px-4 rounded-xl border transition-all font-bold text-sm',
        hasValue
          ? 'bg-blue-50 border-blue-300 text-blue-700'
          : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600',
      ]"
    >
      <EnvironmentOutlined :class="hasValue ? 'text-blue-500' : 'text-blue-400'" />
      <span class="max-w-[180px] truncate">{{ displayLabel }}</span>
      <CloseCircleFilled
        v-if="hasValue"
        class="text-gray-300 hover:text-gray-500 ml-1"
        @click.stop="reset"
      />
      <DownOutlined v-else class="text-gray-300 text-xs" />
    </button>
  </a-popover>
</template>
