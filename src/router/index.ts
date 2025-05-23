import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/admin'
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('@/layout/index.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login.vue')
    },
    {
      path: '/privacy',
      name: 'Privacy',
      component: () => import('@/views/privacy.vue')
    }
  ]
})

export default router

