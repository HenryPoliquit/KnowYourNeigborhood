import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

const routes = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
  { path: '/stores', name: 'stores', component: () => import('../views/StoreListView.vue') },
  { path: '/map', name: 'map', component: () => import('../views/MapView.vue') },
  {
    path: '/stores/new',
    name: 'store-new',
    component: () => import('../views/StoreFormView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/stores/:id/edit',
    name: 'store-edit',
    component: () => import('../views/StoreFormView.vue'),
    meta: { requiresAuth: true },
  },
  { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
  { path: '/register', name: 'register', component: () => import('../views/RegisterView.vue') },
  { path: '/contact', name: 'contact', component: () => import('../views/ContactView.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }
  return true;
});

export default router;
