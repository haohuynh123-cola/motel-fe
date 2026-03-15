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
  } from '@ant-design/icons-vue'

  const props = defineProps({
    collapsed: {
      type: Boolean,
      default: false,
    },
  })

  const route = useRoute()
  const router = useRouter()

  // selectedKeys sẽ dựa trên name của route hiện tại
  const selectedKeys = ref<string[]>([route.name as string])

  // Cập nhật highlight menu khi URL thay đổi
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
    theme="dark"
    width="260px"
    class="shadow-xl z-20 min-h-screen"
  >
    <!-- Logo -->
    <div
      class="h-16 flex items-center justify-center m-4 rounded-xl bg-white/10 transition-all duration-300 overflow-hidden backdrop-blur-sm border border-white/5"
    >
      <div v-if="!props.collapsed" class="flex items-center gap-3 w-full px-4 justify-start">
        <div
          class="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shrink-0 font-bold text-lg"
        >
          T
        </div>
        <span class="text-white text-lg font-bold tracking-wide truncate">Tro-Go</span>
      </div>
      <div
        v-else
        class="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg font-bold text-lg"
      >
        T
      </div>
    </div>

    <!-- Menu -->
    <div class="px-3 mt-6">
      <p
        v-if="!props.collapsed"
        class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4 transition-all duration-300"
      >
        Menu Chính
      </p>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="inline"
        class="border-r-0 bg-transparent rounded-lg"
        :style="{ padding: '0' }"
        @click="handleMenuClick"
      >
        <a-menu-item key="Dashboard" class="rounded-lg mb-1">
          <template #icon>
            <DashboardOutlined class="text-lg" />
          </template>
          <span class="font-medium">Tổng quan</span>
        </a-menu-item>

        <a-menu-item key="HouseList" class="rounded-lg mb-1">
          <template #icon>
            <HomeOutlined class="text-lg" />
          </template>
          <span class="font-medium">Quản lý Nhà trọ</span>
        </a-menu-item>

        <a-menu-item key="ContractList" class="rounded-lg mb-1">
          <template #icon>
            <FileProtectOutlined class="text-lg" />
          </template>
          <span class="font-medium">Hợp đồng</span>
        </a-menu-item>

        <a-menu-item key="CustomerList" class="rounded-lg mb-1">
          <template #icon>
            <TeamOutlined class="text-lg" />
          </template>
          <span class="font-medium">Khách thuê</span>
        </a-menu-item>

        <a-menu-item key="UserList" class="rounded-lg mb-1">
          <template #icon>
            <UserOutlined class="text-lg" />
          </template>
          <span class="font-medium">Người dùng</span>
        </a-menu-item>

        <a-menu-divider v-if="!props.collapsed" class="my-4 border-gray-700 transition-all duration-300" />

        <a-menu-item key="Settings" class="rounded-lg mb-1">
          <template #icon>
            <SettingOutlined class="text-lg" />
          </template>
          <span class="font-medium">Cài đặt</span>
        </a-menu-item>
      </a-menu>
    </div>
  </a-layout-sider>
</template>

<style scoped>
  /* Customizing Ant Design Menu styles to be more modern */
  :deep(.ant-menu-dark.ant-menu-inline .ant-menu-item) {
    width: calc(100% - 16px);
    margin-inline: 8px;
    border-radius: 8px;
    transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  }

  :deep(.ant-menu-dark.ant-menu-inline .ant-menu-item-selected) {
    background-color: #1677ff !important;
    box-shadow: 0 4px 12px rgba(22, 119, 255, 0.3);
  }

  :deep(.ant-menu-dark .ant-menu-item:hover:not(.ant-menu-item-selected)) {
    background-color: rgba(255, 255, 255, 0.1);
  }

  /* Sider customization */
  :deep(.ant-layout-sider) {
    background: #001529; /* Deep dark blue */
    background: linear-gradient(180deg, #001529 0%, #000c17 100%);
  }
</style>
