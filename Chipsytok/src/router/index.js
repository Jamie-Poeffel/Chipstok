import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '@/views/IndexView.vue'
import { useAuthStore } from '@/stores/auth'
import ResetPassword from '@/views/ResetPassword.vue';



const routes = [
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword
  },
];

// Assuming you have a Pinia store for auth

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: IndexView,
      meta: { requiresAuth: true },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('@/views/SignupView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/add',
      name: 'Add',
      component: () => import('@/views/AddView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'ProfileWithUsername',
      component: () => import('@/views/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/me',
      name: 'Profile',
      component: () => import('@/views/UserProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/oauth/authorize',
      name: 'OauthAuthorize',
      component: () => import('@/views/oauth/OauthAuthorizeView.vue'),
      meta: { requiresAuth: false }
    }
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  await authStore.Authenticate()


  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
