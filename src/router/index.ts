import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import AdminLayout from '../layouts/AdminLayout.vue'
import CustomerLayout from '../layouts/CustomerLayout.vue'
import LoginView from '../views/LoginView.vue'
import authService from '../api/authService'

const routes: Array<RouteRecordRaw> = [
  // --- Phân hệ Khách hàng (Public) ---
  {
    path: '/',
    component: CustomerLayout,
    children: [
      {
        path: '',
        name: 'Home',
        redirect: '/explore',
      },
      {
        path: 'explore',
        name: 'Explore',
        component: () => import('../views/customer/ExploreView.vue'),
      },
      {
        path: 'listings/:id',
        name: 'ListingDetail',
        component: () => import('../views/customer/ListingDetailView.vue'),
        props: true,
      },
      {
        path: 'wishlist',
        name: 'Wishlist',
        component: () => import('../views/customer/WishlistView.vue'),
      },
    ],
  },

  // --- Auth ---
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false },
  },

  // --- Phân hệ Quản lý (Sử dụng AdminLayout chuyên nghiệp) ---
  {
    path: '/manage',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/manage/DashboardView.vue'),
      },
      {
        path: 'houses',
        name: 'HouseList',
        component: () => import('@/views/manage/house/HouseListView.vue'),
      },
      {
        path: 'houses/:id/rooms',
        name: 'HouseRooms',
        component: () => import('@/views/manage/room/RoomListView.vue'),
        props: true,
      },
      {
        path: 'houses/:id/contracts',
        name: 'HouseContracts',
        component: () => import('@/views/manage/ContractListView.vue'),
        props: true,
      },
      {
        path: 'contracts',
        name: 'ContractList',
        component: () => import('@/views/manage/ContractListView.vue'),
      },
      {
        path: 'customers',
        name: 'CustomerList',
        component: () => import('@/views/manage/CustomerListView.vue'),
      },
      {
        path: 'users',
        name: 'UserList',
        component: () => import('@/views/manage/UserListView.vue'),
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/manage/house/HouseListView.vue'), // Placeholder
      },
      {
        path: 'support',
        name: 'SupportChat',
        component: () => import('@/views/manage/SupportChatView.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated()

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/manage')
  } else {
    next()
  }
})

export default router
