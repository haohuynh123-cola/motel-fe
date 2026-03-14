<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  HomeOutlined,
  UserOutlined,
  DashboardOutlined,
  FileProtectOutlined,
  SettingOutlined,
  TeamOutlined
} from '@ant-design/icons-vue';

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
});

const route = useRoute();
const router = useRouter();

// selectedKeys sẽ dựa trên name của route hiện tại
const selectedKeys = ref([route.name]);

// Cập nhật highlight menu khi URL thay đổi
watch(() => route.name, (newName) => {
  selectedKeys.value = [newName];
});

const handleMenuClick = ({ key }) => {
  // Vì các route trong manage đều nằm dưới /manage, ta chỉ cần truyền name
  router.push({ name: key });
};
</script>

<template>
  <a-layout-sider
    :collapsed="props.collapsed"
    breakpoint="lg"
    collapsed-width="80"
    class="h-screen shadow-md flex-shrink-0"
    theme="light"
    :trigger="null"
    collapsible
  >
    <div class="logo-container flex items-center justify-center py-6 h-16 overflow-hidden">
      <h1 v-if="!props.collapsed" class="text-xl font-bold text-blue-600 m-0 transition-all duration-300">Tro-Go Admin</h1>
      <h1 v-else class="text-xl font-bold text-blue-600 m-0">TG</h1>
    </div>
    
    <a-menu
      v-model:selectedKeys="selectedKeys"
      theme="light"
      mode="inline"
      @click="handleMenuClick"
    >
      <a-menu-item key="Dashboard">
        <template #icon><DashboardOutlined /></template>
        <span>Tổng quan</span>
      </a-menu-item>
      
      <a-menu-item key="HouseList">
        <template #icon><HomeOutlined /></template>
        <span>Quản lý Nhà trọ</span>
      </a-menu-item>

      <a-menu-item key="ContractList">
        <template #icon><FileProtectOutlined /></template>
        <span>Hợp đồng</span>
      </a-menu-item>

      <a-menu-item key="CustomerList">
        <template #icon><TeamOutlined /></template>
        <span>Khách thuê</span>
      </a-menu-item>

      <a-menu-item key="UserList">
        <template #icon><UserOutlined /></template>
        <span>Người dùng</span>
      </a-menu-item>

      <a-menu-divider />

      <a-menu-item key="Settings">
        <template #icon><SettingOutlined /></template>
        <span>Cài đặt</span>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<style scoped>
.logo-container {
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 8px;
}
</style>
