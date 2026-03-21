<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { HomeOutlined, LoginOutlined, HeartOutlined } from '@ant-design/icons-vue'
  import { useWishlist } from '@/composables/useWishlist'
  import SupportChatWidget from '@/components/shared/SupportChatWidget.vue'

  const router = useRouter()
  const goToLogin = () => router.push('/login')
  const goToHome = () => router.push('/explore')

  const { wishlist } = useWishlist()
</script>

<template>
  <a-layout class="min-h-screen bg-white">
    <!-- Header tinh chỉnh -->
    <a-layout-header
      class="!bg-white border-b border-gray-100 px-4 md:px-12 flex justify-between items-center h-20 sticky top-0 z-50 shadow-sm"
    >
      <div class="flex items-center cursor-pointer group" @click="goToHome">
        <div
          class="bg-blue-600 w-10 h-10 rounded-xl flex items-center justify-center mr-3 group-hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-100"
        >
          <HomeOutlined class="text-white text-lg" />
        </div>
        <span class="text-2xl font-black text-gray-800 tracking-tighter"
          >Tro<span class="text-blue-600">-</span>Go</span
        >
      </div>

      <div class="flex items-center gap-2 sm:gap-6">
        <a-button
          type="text"
          class="font-bold text-gray-500 hover:text-blue-600 hidden md:block uppercase text-xs tracking-widest"
          >Khám phá</a-button
        >
        <a-button
          type="text"
          class="font-bold text-gray-500 hover:text-blue-600 hidden md:block uppercase text-xs tracking-widest"
          >Về chúng tôi</a-button
        >
        <a-badge :count="wishlist.length" :offset="[0, 0]" color="red">
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all"
            @click="router.push('/wishlist')"
          >
            <HeartOutlined class="text-xl" />
          </div>
        </a-badge>
        <a-button
          @click="goToLogin"
          type="primary"
          class="h-11 rounded-xl px-6 font-bold flex items-center shadow-md shadow-blue-100 border-none bg-blue-600"
        >
          <template #icon><LoginOutlined /></template>
          <span class="ml-2">Dành cho Chủ trọ</span>
        </a-button>
      </div>
    </a-layout-header>

    <a-layout-content>
      <router-view />
    </a-layout-content>

    <!-- Support Chat Widget -->
    <SupportChatWidget />

    <!-- Footer hiện đại -->
    <a-layout-footer class="bg-gray-50 border-t border-gray-100 pt-20 pb-10">
      <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-left mb-16">
        <div class="col-span-1 md:col-span-1">
          <div class="flex items-center mb-6">
            <div class="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center mr-2">
              <HomeOutlined class="text-white text-sm" />
            </div>
            <span class="text-xl font-bold text-gray-800">Tro-Go</span>
          </div>
          <p class="text-gray-500 text-sm leading-relaxed">
            Nền tảng tìm kiếm và quản lý nhà trọ hàng đầu Việt Nam. Kết nối khách thuê và chủ trọ
            một cách nhanh chóng, minh bạch.
          </p>
        </div>
        <div>
          <h4 class="text-gray-800 font-bold mb-6 uppercase text-xs tracking-widest">Dịch vụ</h4>
          <ul class="list-none p-0 space-y-3 text-sm">
            <li>
              <a href="#" class="text-gray-500 hover:text-blue-600 transition-colors"
                >Tìm phòng trọ</a
              >
            </li>
            <li>
              <a href="#" class="text-gray-500 hover:text-blue-600 transition-colors"
                >Đăng tin cho thuê</a
              >
            </li>
            <li>
              <a href="#" class="text-gray-500 hover:text-blue-600 transition-colors"
                >Quản lý vận hành</a
              >
            </li>
          </ul>
        </div>
        <div>
          <h4 class="text-gray-800 font-bold mb-6 uppercase text-xs tracking-widest">Hỗ trợ</h4>
          <ul class="list-none p-0 space-y-3 text-sm">
            <li>
              <a href="#" class="text-gray-500 hover:text-blue-600 transition-colors"
                >Trung tâm trợ giúp</a
              >
            </li>
            <li>
              <a href="#" class="text-gray-500 hover:text-blue-600 transition-colors"
                >Quy định đăng tin</a
              >
            </li>
            <li>
              <a href="#" class="text-gray-500 hover:text-blue-600 transition-colors"
                >Chính sách bảo mật</a
              >
            </li>
          </ul>
        </div>
        <div>
          <h4 class="text-gray-800 font-bold mb-6 uppercase text-xs tracking-widest">Liên hệ</h4>
          <p class="text-gray-500 text-sm mb-2">
            Hotline: <span class="text-gray-800 font-bold">1900 1234</span>
          </p>
          <p class="text-gray-500 text-sm mb-6">
            Email: <span class="text-gray-800 font-bold">hello@trogo.vn</span>
          </p>
          <div class="flex gap-4">
            <div
              class="w-8 h-8 rounded-full bg-gray-200 hover:bg-blue-600 hover:text-white flex items-center justify-center cursor-pointer transition-all duration-300"
            >
              f
            </div>
            <div
              class="w-8 h-8 rounded-full bg-gray-200 hover:bg-blue-400 hover:text-white flex items-center justify-center cursor-pointer transition-all duration-300"
            >
              t
            </div>
          </div>
        </div>
      </div>
      <div
        class="text-center text-gray-400 text-xs border-t border-gray-200/60 pt-8 max-w-7xl mx-auto px-6"
      >
        © {{ new Date().getFullYear() }} Tro-Go Project. Designed and Developed by
        <span class="text-gray-600 font-bold">Hào Huỳnh</span>
      </div>
    </a-layout-footer>
  </a-layout>
</template>

<style scoped>
  :deep(.ant-layout-header) {
    line-height: normal; /* Sửa lỗi icon bị dãn theo line-height */
  }
</style>
