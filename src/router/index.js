import { createRouter, createWebHistory } from 'vue-router';
import AdminLayout from '../layouts/AdminLayout.vue';
import LoginView from '../views/LoginView.vue';
import HouseListView from '../views/HouseListView.vue';
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
        redirect: '/houses'
      },
      {
        path: 'houses',
        name: 'HouseList',
        component: HouseListView
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
