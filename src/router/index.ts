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
      component: () => import('@/layout/index.vue'),
      redirect: '/admin/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/views/dashboard.vue')
        },
        {
          path: 'member',
          name: 'Member',
          component: () => import('@/views/member/index.vue')
        },
        {
          path: 'member-select',
          name: 'MemberSelect',
          component: () => import('@/views/member-select/index.vue')
        },
        {
          path: 'succession',
          name: 'Succession',
          component: () => import('@/views/succession/index.vue')
        },
        {
          path: 'content',
          name: 'Content',
          component: () => import('@/views/content/index.vue')
        },
        {
          path: 'activity',
          name: 'Activity',
          component: () => import('@/views/activity/index.vue')
        },
        {
          path: 'news',
          name: 'News',
          component: () => import('@/views/news/index.vue')
        },
        {
          path: 'safe-wind-wall',
          name: 'SafeWindWall',
          component: () => import('@/views/safe-wind-wall/index.vue')
        },
        {
          path: 'apply',
          name: 'Apply',
          component: () => import('@/views/apply/index.vue')
        }
      ]
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

