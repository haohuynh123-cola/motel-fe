<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import authService from '../api/authService';
import { 
  HomeOutlined, 
  UserOutlined, 
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons-vue';

const router = useRouter();
const collapsed = ref(false);
const selectedKeys = ref(['houses']);

const handleLogout = () => {
  authService.logout();
  router.push('/login');
};
</script>

<template>
  <a-layout style="min-height: 100vh">
    <!-- Sidebar -->
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible theme="dark">
      <div class="logo">
        <h2 v-if="!collapsed" class="text-white text-center py-4 text-xl font-bold m-0">Tro-Go</h2>
        <h2 v-else class="text-white text-center py-4 text-xl font-bold m-0">TG</h2>
      </div>
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="houses" @click="router.push('/houses')">
          <home-outlined />
          <span>Quản lý Nhà trọ</span>
        </a-menu-item>
        <a-menu-item key="users">
          <user-outlined />
          <span>Quản lý Người dùng</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <!-- Header -->
      <a-layout-header style="background: #fff; padding: 0" class="flex justify-between items-center shadow-sm z-10 px-4">
        <div>
          <menu-unfold-outlined
            v-if="collapsed"
            class="trigger text-xl cursor-pointer hover:text-blue-500 transition"
            @click="() => (collapsed = !collapsed)"
          />
          <menu-fold-outlined
            v-else
            class="trigger text-xl cursor-pointer hover:text-blue-500 transition"
            @click="() => (collapsed = !collapsed)"
          />
        </div>
        
        <div class="flex items-center">
          <a-dropdown>
            <a class="ant-dropdown-link flex items-center gap-2 cursor-pointer text-gray-700 hover:text-blue-500" @click.prevent>
              <a-avatar style="background-color: #1890ff">A</a-avatar>
              <span class="font-medium">Admin</span>
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item key="profile">
                  <user-outlined /> Thông tin cá nhân
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="logout" @click="handleLogout" class="text-red-500">
                  <logout-outlined /> Đăng xuất
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>

      <!-- Main Content -->
      <a-layout-content style="margin: 24px 16px; padding: 24px; background: #fff; min-height: 280px; border-radius: 8px;">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.logo {
  height: 64px;
  background: rgba(255, 255, 255, 0.1);
  margin: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
</style>
