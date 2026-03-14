<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute, RouterLink } from 'vue-router';
import authService from '../api/authService';
import Sidebar from '../components/Sidebar.vue';
import {
  UserOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BellOutlined,
  HomeOutlined,
  HeartFilled
} from '@ant-design/icons-vue';

const router = useRouter();
const route = useRoute();
const collapsed = ref(false);

const breadcrumbs = computed(() => {
  const pathArray = route.path.split('/').filter((i) => i);
  const crumbs = pathArray.map((path, index) => {
    const url = `/${pathArray.slice(0, index + 1).join('/')}`;
    let label = path.charAt(0).toUpperCase() + path.slice(1);
    if (path === 'houses') label = 'Nhà trọ';
    if (path === 'rooms') label = 'Phòng';
    if (path === 'contracts') label = 'Hợp đồng';
    if (path === 'customers') label = 'Khách thuê';
    if (path === 'users') label = 'Người dùng';

    return { label, url };
  });
  return crumbs;
});

const handleLogout = () => {
  authService.logout();
  router.push('/login');
};
</script>

<template>
  <a-layout class="h-screen overflow-hidden">
    <!-- Sidebar Component -->
    <Sidebar :collapsed="collapsed" />

    <a-layout class="flex flex-col h-screen">
      <!-- Header -->
      <a-layout-header class="!bg-white px-4 flex justify-between items-center shadow-sm z-10 h-16 flex-shrink-0 border-b border-gray-100">
        <div class="flex items-center gap-6">
          <div @click="() => (collapsed = !collapsed)"
               class="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 cursor-pointer transition-colors duration-200">
            <menu-unfold-outlined v-if="collapsed" class="text-lg text-gray-600" />
            <menu-fold-outlined v-else class="text-lg text-gray-600" />
          </div>

          <a-breadcrumb class="hidden md:flex">
            <a-breadcrumb-item>
              <router-link to="/" class="hover:text-blue-500 transition-colors">
                <home-outlined />
              </router-link>
            </a-breadcrumb-item>
            <a-breadcrumb-item v-for="crumb in breadcrumbs" :key="crumb.url">
              <router-link :to="crumb.url" class="font-medium text-gray-500 hover:text-blue-500 transition-colors">
                {{ crumb.label }}
              </router-link>
            </a-breadcrumb-item>
          </a-breadcrumb>
        </div>

        <div class="flex items-center gap-4 pr-5">
          <a-badge :count="5" size="small" :offset="[-10, 10]">
            <div class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer transition-colors duration-200 group">
              <BellOutlined class="text-xl text-gray-500 group-hover:text-blue-500" />
            </div>
          </a-badge>

          <a-dropdown :trigger="['click']">
            <div class="flex items-center cursor-pointer transition-all duration-200 group pr-2 ps-2 py-1 bg-gray-100 rounded hover:bg-gray-200">
                <a-avatar size="large" class="bg-blue-500 shadow-sm border-2 border-white">A</a-avatar>
              <div class="ml-3 hidden sm:block">
                <span class="text-sm font-bold text-gray-700 block leading-none">Quản trị viên</span>
              </div>
            </div>
            <template #overlay>
              <a-menu class="min-w-[180px] rounded-xl shadow-xl border-none p-2 mt-2">
                <a-menu-item key="profile" class="rounded-lg py-2">
                  <div class="flex items-center gap-2">
                    <user-outlined /> <span>Thông tin cá nhân</span>
                  </div>
                </a-menu-item>
                <a-menu-divider class="my-1" />
                <a-menu-item key="logout" @click="handleLogout" class="rounded-lg py-2 group hover:bg-red-50">
                  <div class="flex items-center gap-2 text-red-500 group-hover:text-red-600">
                    <logout-outlined /> <span>Đăng xuất</span>
                  </div>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>

      <!-- Scrollable Area -->
      <div class="flex-1 overflow-y-auto bg-[#f8fafc] custom-scrollbar flex flex-col">
        <!-- Content Area -->
        <a-layout-content class="p-6 flex-shrink-0">
          <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100/50">
            <router-view />
          </div>
        </a-layout-content>
      </div>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}

 .ant-layout .ant-layout-header{
  padding-inline:0 !important
 }

</style>
