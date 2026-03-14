<script setup lang="ts">
  import { ref, watchEffect } from 'vue'
  import { useRouter, useRoute } from 'vue-router'

  import authService from '../api/authService'
  import {
    HomeOutlined,
    UserOutlined,
    LogoutOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    SettingOutlined,
    BellOutlined,
    DownOutlined,
  } from '@ant-design/icons-vue'

  const router = useRouter()
  const route = useRoute()
  const collapsed = ref(false)
  const selectedKeys = ref(['houses'])

  // Auto-update selected menu item based on current route
  watchEffect(() => {
    if (route.path.includes('/users')) {
      selectedKeys.value = ['users']
    } else if (route.path.includes('/houses')) {
      selectedKeys.value = ['houses']
    } else if (route.path.includes('/settings')) {
      selectedKeys.value = ['settings']
    }
  })

  const handleLogout = () => {
    authService.logout()
    router.push('/login')
  }
</script>

<template>
  <a-layout style="min-height: 100vh">
    <!-- Sidebar -->
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      theme="dark"
      width="260px"
      class="shadow-xl z-20"
    >
      <!-- Logo -->
      <div
        class="h-16 flex items-center justify-center m-4 rounded-xl bg-white/10 transition-all duration-300 overflow-hidden backdrop-blur-sm border border-white/5"
      >
        <div v-if="!collapsed" class="flex items-center gap-3 w-full px-4 justify-start">
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
          v-if="!collapsed"
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
        >
          <a-menu-item key="houses" @click="router.push('/houses')" class="rounded-lg mb-1">
            <template #icon>
              <home-outlined class="text-lg" />
            </template>
            <span class="font-medium">Quản lý Nhà trọ</span>
          </a-menu-item>
          <a-menu-item key="users" class="rounded-lg mb-1">
            <template #icon>
              <user-outlined class="text-lg" />
            </template>
            <span class="font-medium">Quản lý Người dùng</span>
          </a-menu-item>

          <a-menu-divider
            v-if="!collapsed"
            class="my-4 border-gray-700 transition-all duration-300"
          />

          <a-menu-item key="settings" class="rounded-lg mb-1">
            <template #icon>
              <setting-outlined class="text-lg" />
            </template>
            <span class="font-medium">Cài đặt hệ thống</span>
          </a-menu-item>
        </a-menu>
      </div>
    </a-layout-sider>

    <a-layout class="bg-gray-50 transition-all duration-300">
      <!-- Header -->
      <a-layout-header
        style="background: rgba(255, 255, 255, 0.8)"
        class="flex justify-between items-center shadow-sm z-10 px-6 h-16 backdrop-blur-md sticky top-0 border-b border-gray-200"
      >
        <div class="flex items-center gap-4">
          <div
            class="text-xl cursor-pointer hover:text-blue-600 transition-colors duration-200 text-gray-500 flex items-center justify-center w-10 h-10 rounded-full hover:bg-blue-50 active:bg-blue-100"
            @click="() => (collapsed = !collapsed)"
          >
            <menu-unfold-outlined v-if="collapsed" />
            <menu-fold-outlined v-else />
          </div>

          <!-- Breadcrumb Placeholder -->
          <div class="hidden md:flex items-center text-sm text-gray-500">
            <span class="hover:text-blue-600 cursor-pointer transition-colors">Trang chủ</span>
            <span class="mx-2 text-gray-300">/</span>
            <span class="text-gray-900 font-medium">Bảng điều khiển</span>
          </div>
        </div>

        <div class="flex items-center gap-5">
          <!-- Notifications -->
          <a-badge dot color="red">
            <div
              class="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer transition-colors text-gray-500 hover:text-blue-600"
            >
              <bell-outlined class="text-xl" />
            </div>
          </a-badge>

          <!-- Divider -->
          <div class="h-8 w-px bg-gray-200 mx-1"></div>

          <!-- User Profile -->
          <a-dropdown placement="bottomRight" :trigger="['click']">
            <div
              class="flex items-center gap-3 cursor-pointer p-1 pr-3 rounded-full hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
            >
              <a-avatar
                src="https://api.dicebear.com/7.x/notionists/svg?seed=Admin"
                class="bg-indigo-50 border border-indigo-100 w-9 h-9"
              />
              <div class="hidden sm:flex flex-col items-start">
                <span class="text-sm font-bold text-gray-700 leading-tight">Admin User</span>
                <span class="text-[11px] text-gray-500 font-medium">Quản trị viên</span>
              </div>
              <down-outlined class="text-[10px] text-gray-400 ml-1" />
            </div>
            <template #overlay>
              <a-menu class="w-56 p-2 rounded-xl shadow-xl border border-gray-100 mt-2">
                <div class="px-4 py-3 border-b border-gray-100 mb-2">
                  <p class="text-sm font-semibold text-gray-800 m-0">Admin User</p>
                  <p class="text-xs text-gray-500 m-0 mt-0.5">admin@trogo.vn</p>
                </div>
                <a-menu-item
                  key="profile"
                  class="rounded-lg py-2.5 px-3 mb-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <user-outlined class="mr-2.5 text-lg" />
                  <span class="font-medium">Hồ sơ cá nhân</span>
                </a-menu-item>
                <a-menu-item
                  key="settings"
                  class="rounded-lg py-2.5 px-3 mb-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <setting-outlined class="mr-2.5 text-lg" />
                  <span class="font-medium">Cài đặt tài khoản</span>
                </a-menu-item>
                <div class="h-px bg-gray-100 my-2 mx-2"></div>
                <a-menu-item
                  key="logout"
                  @click="handleLogout"
                  class="rounded-lg py-2.5 px-3 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <logout-outlined class="mr-2.5 text-lg" />
                  <span class="font-medium">Đăng xuất</span>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>

      <!-- Main Content Area -->
      <a-layout-content style="margin: 24px; min-height: calc(100vh - 112px)">
        <div
          class="bg-white rounded-2xl shadow-sm border border-gray-100/50 h-full p-6 overflow-hidden"
        >
          <router-view />
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
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
