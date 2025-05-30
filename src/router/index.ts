import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/user";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/admin",
      name: "Admin",
      component: () => import("@/layout/index.vue"),
      redirect: "/admin/dashboard",
      children: [
        {
          path: "dashboard",
          name: "Dashboard",
          component: () => import("@/views/dashboard.vue"),
        },
        {
          path: "member",
          name: "Member",
          component: () => import("@/views/member/index.vue"),
        },
        {
          path: "member-select",
          name: "MemberSelect",
          component: () => import("@/views/member-select/index.vue"),
        },
        {
          path: "succession",
          name: "Succession",
          component: () => import("@/views/succession/index.vue"),
        },
        {
          path: "content",
          name: "Content",
          component: () => import("@/views/content/index.vue"),
        },
        {
          path: "activity",
          name: "Activity",
          component: () => import("@/views/activity/index.vue"),
        },
        {
          path: "news",
          name: "News",
          component: () => import("@/views/news/index.vue"),
        },
        {
          path: "safe-wind-wall",
          name: "SafeWindWall",
          component: () => import("@/views/safe-wind-wall/index.vue"),
        },
        {
          path: "apply",
          name: "Apply",
          component: () => import("@/views/apply/index.vue"),
        },
        {
          path: "user",
          name: "User",
          component: () => import("@/views/user/index.vue"),
        },
      ],
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("@/views/login.vue"),
    },
    {
      path: "/privacy",
      name: "Privacy",
      component: () => import("@/views/privacy.vue"),
    },
  ],
});

// 添加全局前置守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  // 如果访问登录页面，直接放行
  if (to.path === "/login") {
    next();
    return;
  }

  // 如果未登录，重定向到登录页
  if (!userStore.isLoggedIn) {
    next("/login");
    return;
  }

  // 其他情况放行
  next();
});

export default router;
