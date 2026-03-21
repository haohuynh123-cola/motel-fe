<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import {
    HomeOutlined,
    UserOutlined,
    DashboardOutlined,
    FileProtectOutlined,
    SettingOutlined,
    TeamOutlined,
    MessageOutlined,
    BarChartOutlined,
  } from '@ant-design/icons-vue'

  const props = defineProps({
    collapsed: {
      type: Boolean,
      default: false,
    },
  })

  const route = useRoute()
  const router = useRouter()

  const selectedKeys = ref<string[]>([route.name as string])

  watch(
    () => route.name,
    (newName) => {
      selectedKeys.value = [newName as string]
    }
  )

  const handleMenuClick = ({ key }: { key: string }) => {
    router.push({ name: key })
  }
</script>

<template>
  <a-layout-sider
    :collapsed="props.collapsed"
    :trigger="null"
    collapsible
    theme="light"
    :width="260"
    :collapsed-width="80"
    class="sidebar-emerald shadow-sm z-30 h-screen fixed left-0 top-0 bottom-0"
  >
    <!-- Logo Emerald Style -->
    <div
      class="h-16 flex items-center justify-center m-4 rounded-xl bg-emerald-600 transition-all duration-300 overflow-hidden"
    >
      <div v-if="!props.collapsed" class="flex items-center gap-3 w-full px-4 justify-start">
        <div
          class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold text-lg border border-white/10"
        >
          T
        </div>
        <span class="text-white text-lg font-bold tracking-tight truncate">Tro-Go</span>
      </div>
      <div
        v-else
        class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold text-lg border border-white/10"
      >
        T
      </div>
    </div>

    <!-- Menu Emerald Style -->
    <div class="px-3 mt-4 custom-menu-container">
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="light"
        mode="inline"
        class="border-r-0 bg-transparent"
        @click="handleMenuClick"
      >
        <a-menu-item key="Dashboard" class="rounded-lg mb-1">
          <template #icon><DashboardOutlined class="text-lg" /></template>
          <span class="font-semibold text-slate-700">Tổng quan</span>
        </a-menu-item>

        <a-menu-item-group key="g1">
          <template #title v-if="!props.collapsed">
            <span class="text-[10px] font-bold text-emerald-500 uppercase tracking-widest pl-4">
              Quản lý tài sản
            </span>
          </template>
          <a-menu-item key="HouseList" class="rounded-lg mb-1">
            <template #icon><HomeOutlined class="text-lg" /></template>
            <span class="font-medium text-slate-600">Nhà trọ</span>
          </a-menu-item>
          <a-menu-item key="ContractList" class="rounded-lg mb-1">
            <template #icon><FileProtectOutlined class="text-lg" /></template>
            <span class="font-medium text-slate-600">Hợp đồng</span>
          </a-menu-item>
        </a-menu-item-group>

        <a-menu-item-group key="g2">
          <template #title v-if="!props.collapsed">
            <span class="text-[10px] font-bold text-emerald-500 uppercase tracking-widest pl-4">
              Đối tác & Nhân sự
            </span>
          </template>
          <a-menu-item key="CustomerList" class="rounded-lg mb-1">
            <template #icon><TeamOutlined class="text-lg" /></template>
            <span class="font-medium text-slate-600">Khách thuê</span>
          </a-menu-item>
          <a-menu-item key="UserList" class="rounded-lg mb-1">
            <template #icon><UserOutlined class="text-lg" /></template>
            <span class="font-medium text-slate-600">Người dùng</span>
          </a-menu-item>
        </a-menu-item-group>

        <a-menu-item-group key="g3">
          <template #title v-if="!props.collapsed">
            <span class="text-[10px] font-bold text-emerald-500 uppercase tracking-widest pl-4">
              Thị trường
            </span>
          </template>
          <a-menu-item key="ListingStats" class="rounded-lg mb-1">
            <template #icon><BarChartOutlined class="text-lg" /></template>
            <span class="font-medium text-slate-600">Thống kê trọ</span>
          </a-menu-item>
        </a-menu-item-group>

        <a-menu-divider class="my-4 mx-4 opacity-50" />
        <a-menu-item key="Settings" class="rounded-lg">
          <template #icon><SettingOutlined class="text-lg" /></template>
          <span class="font-medium text-slate-600">Hệ thống</span>
        </a-menu-item>

        <a-menu-item key="SupportChat" class="rounded-lg mb-1">
          <template #icon><MessageOutlined class="text-lg" /></template>
          <span class="font-medium text-slate-600">Hỗ trợ</span>
        </a-menu-item>
      </a-menu>
    </div>
  </a-layout-sider>
</template>

<style scoped>
  .sidebar-emerald {
    background: #ffffff;
    border-right: 1px solid #f1f5f9;
  }

  :deep(.ant-menu-item) {
    height: 44px !important;
    line-height: 44px !important;
    margin-inline: 8px !important;
    width: calc(100% - 16px) !important;
  }

  :deep(.ant-menu-item-selected) {
    background-color: #ecfdf5 !important;
    color: #059669 !important;
  }

  :deep(.ant-menu-item-selected .ant-menu-item-icon) {
    color: #059669 !important;
  }

  :deep(.ant-menu-item-selected::after) {
    display: none;
  }

  :deep(.ant-menu-item:hover:not(.ant-menu-item-selected)) {
    background-color: #f8fafc !important;
    color: #059669 !important;
  }

  :deep(.ant-menu-item-group-title) {
    padding-top: 16px;
    padding-bottom: 8px;
  }

  .custom-menu-container {
    height: calc(100vh - 100px);
    overflow-y: auto;
  }

  .custom-menu-container::-webkit-scrollbar {
    width: 4px;
  }
  .custom-menu-container::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
  }
</style>
