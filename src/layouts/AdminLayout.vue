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
  <a-layout class="admin-main-layout">
    <!-- Sidebar Component (Fixed) -->
    <Sidebar :collapsed="collapsed" />

    <!-- Right Side Layout -->
    <a-layout class="content-layout" :style="{ paddingLeft: collapsed ? '80px' : '260px' }">
      <!-- Header (Always top) -->
      <a-layout-header class="admin-header">
        <div class="flex items-center gap-4">
          <div
            class="text-xl cursor-pointer hover:text-emerald-600 transition-colors duration-200 text-slate-400 flex items-center justify-center w-10 h-10 rounded-lg hover:bg-emerald-50"
            @click="() => (collapsed = !collapsed)"
          >
            <menu-unfold-outlined v-if="collapsed" />
            <menu-fold-outlined v-else />
          </div>

          <div class="hidden md:flex items-center text-sm text-slate-400">
            <span class="hover:text-emerald-600 cursor-pointer transition-colors font-medium">Trang chủ</span>
            <span class="mx-2 text-slate-200">/</span>
            <span class="text-slate-600 font-semibold">Bảng điều khiển</span>
          </div>
        </div>

        <div class="flex items-center gap-5">
          <a-badge dot color="#10b981" :offset="[-2, 8]">
            <div
              class="w-9 h-9 rounded-lg hover:bg-emerald-50 flex items-center justify-center cursor-pointer transition-colors text-slate-400 hover:text-emerald-600"
            >
              <bell-outlined class="text-xl" />
            </div>
          </a-badge>

          <div class="h-8 w-px bg-slate-100 mx-1"></div>

          <a-dropdown placement="bottomRight" :trigger="['click']">
            <div
              class="flex items-center gap-2.5 cursor-pointer p-1 pr-2.5 rounded-lg hover:bg-emerald-50 transition-all border border-transparent"
            >
              <a-avatar
                :size="32"
                src="https://api.dicebear.com/7.x/notionists/svg?seed=Admin"
                class="bg-emerald-100 border border-emerald-200"
              />
              <div class="hidden sm:flex flex-col items-start leading-tight">
                <span class="text-[13px] font-bold text-slate-700">Admin User</span>
                <span class="text-emerald-600 text-[10px] font-bold uppercase">Quản trị viên</span>
              </div>
              <down-outlined class="text-[9px] text-slate-300" />
            </div>
            <template #overlay>
              <a-menu class="profile-dropdown-menu">
                <div class="px-4 py-3 border-b border-slate-50 mb-1">
                  <p class="text-sm font-bold text-slate-800 m-0">Admin User</p>
                  <p class="text-[11px] text-slate-400 m-0 mt-0.5">admin@trogo.vn</p>
                </div>
                <a-menu-item key="profile" class="py-2">
                  <template #icon><user-outlined /></template>
                  <span class="text-sm">Hồ sơ cá nhân</span>
                </a-menu-item>
                <a-menu-item key="settings" class="py-2">
                  <template #icon><setting-outlined /></template>
                  <span class="text-sm">Cài đặt tài khoản</span>
                </a-menu-item>
                <a-menu-divider class="my-1" />
                <a-menu-item key="logout" @click="handleLogout" class="py-2 text-rose-500">
                  <template #icon><logout-outlined class="text-rose-500" /></template>
                  <span class="text-sm font-bold">Đăng xuất</span>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>

      <!-- Scrollable Content Area -->
      <a-layout-content class="admin-content-scroll">
        <div class="content-body">
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 min-h-full">
            <router-view />
          </div>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped>
  /* Cố định khung layout chính, không cho scroll toàn trang */
  .admin-main-layout {
    height: 100vh;
    overflow: hidden;
  }

  /* Layout bên phải cũng full màn hình */
  .content-layout {
    height: 100vh;
    background-color: #f8fafc;
    display: flex;
    flex-direction: column;
    padding-left: 0 !important;
  }

  /* Header cố định chiều cao */
  .admin-header {
    background: #ffffff;
    height: 64px;
    padding: 0 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f1f5f9;
    flex-shrink: 0;
    z-index: 20;
  }

  /* Chỉ cho phép vùng content này cuộn */
  .admin-content-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
  }

  .admin-content-scroll::-webkit-scrollbar {
    width: 6px;
  }
  .admin-content-scroll::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
  }

  .content-body {
    height: auto;
    display: flex;
    flex-direction: column;
  }

  .profile-dropdown-menu {
    width: 200px !important;
    padding: 8px !important;
    border-radius: 12px !important;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
    border: 1px solid #f1f5f9 !important;
    margin-top: 12px !important;
  }

  :deep(.ant-dropdown-menu-item) {
    border-radius: 8px !important;
    margin-bottom: 2px !important;
  }

  :deep(.ant-dropdown-menu-item-active) {
    background-color: #f0fdf4 !important;
    color: #059669 !important;
  }
</style>
