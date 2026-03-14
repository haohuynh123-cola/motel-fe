import { createRouter, createWebHistory } from 'vue-router';
import AdminLayout from '../layouts/AdminLayout.vue';
import LoginView from '../views/LoginView.vue';
import HouseListView from '../views/HouseListView.vue';
import DashboardView from '../views/DashboardView.vue';
import authService from '../api/authService';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: DashboardView
      },
      {
        path: 'dashboard',
        redirect: '/'
      },
      {
        path: 'houses',
        name: 'HouseList',
        component: HouseListView
      },
      {
        path: 'houses/:id/rooms',
        name: 'HouseRooms',
        component: () => import('../views/RoomListView.vue'),
        props: true,
      },
      {
        path: 'houses/:id/contracts',
        name: 'HouseContracts',
        component: () => import('../views/ContractListView.vue'),
        props: true,
      },
      {
        path: 'contracts',
        name: 'ContractList',
        component: () => import('../views/ContractListView.vue'),
      },
      {
        path: 'customers',
        name: 'CustomerList',
        component: () => import('../views/CustomerListView.vue'),
      },
      {
        path: 'users',
        name: 'UserList',
        component: () => import('../views/UserListView.vue'),
      },
      {
        path: 'settings',
        name: 'Settings',
        component: HouseListView, // Placeholder
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard: Bảo vệ các route yêu cầu đăng nhập
router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated();

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;
