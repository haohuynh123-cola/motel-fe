<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import Sidebar from '../components/Sidebar.vue'
  import authService from '../api/authService'
  import {
    UserOutlined,
    LogoutOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    SettingOutlined,
    BellOutlined,
    DownOutlined,
  } from '@ant-design/icons-vue'

  const router = useRouter()
  const collapsed = ref(false)

  const handleLogout = () => {
    authService.logout()
    router.push('/login')
  }
</script>

<template>
  <a-layout style="min-height: 100vh">
    <!-- Sidebar Component -->
    <Sidebar :collapsed="collapsed" />

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

<style scoped></style>
