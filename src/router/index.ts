import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useMenuStore } from "@/stores/menu";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/admin/dashboard", // 直接重定向到管理后台首页
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
          meta: {
            title: "首页",
            icon: "dashboard",
            perms: "dashboard"
          }
        },
        {
          path: "member",
          name: "Member",
          component: () => import("@/views/member/index.vue"),
          meta: {
            title: "会员管理",
            icon: "people",
            perms: "member"
          }
        },
        {
          path: "member-select",
          name: "MemberSelect",
          component: () => import("@/views/member-select/index.vue"),
          meta: {
            title: "会员选择",
            icon: "people",
            perms: "member-select"
          }
        },
        {
          path: "succession",
          name: "Succession",
          component: () => import("@/views/succession/index.vue"),
          meta: {
            title: "传承管理",
            icon: "education",
            perms: "succession"
          }
        },
        {
          path: "content",
          name: "Content",
          component: () => import("@/views/content/index.vue"),
          meta: {
            title: "内容管理",
            icon: "documentation",
            perms: "content"
          }
        },
        {
          path: "activity",
          name: "Activity",
          component: () => import("@/views/activity/index.vue"),
          meta: {
            title: "活动管理",
            icon: "chart",
            perms: "activity"
          }
        },
        {
          path: "news",
          name: "News",
          component: () => import("@/views/news/index.vue"),
          meta: {
            title: "新闻管理",
            icon: "documentation",
            perms: "news"
          }
        },
        {
          path: "safe-wind-wall",
          name: "SafeWindWall",
          component: () => import("@/views/safe-wind-wall/index.vue"),
          meta: {
            title: "安全风墙",
            icon: "shield",
            perms: "safe-wind-wall"
          }
        },
        {
          path: "apply",
          name: "Apply",
          component: () => import("@/views/apply/index.vue"),
          meta: {
            title: "申请管理",
            icon: "form",
            perms: "apply"
          }
        },
        {
          path: "user-manage",
          name: "UserManage",
          component: () => import("@/views/user-manage/index.vue"),
          meta: {
            title: "用户管理",
            icon: "user",
            perms: "user"
          }
        },
        {
          path: "user",
          name: "User",
          component: () => import("@/views/user/index.vue"),
          meta: {
            title: "用户中心",
            icon: "user",
            perms: "user"
          }
        },
        {
          path: "menu",
          name: "Menu",
          component: () => import("@/views/menu/index.vue"),
          meta: {
            title: "菜单管理",
            icon: "menu",
            perms: "menu"
          }
        },
        {
          path: "role",
          name: "Role",
          component: () => import("@/views/role/index.vue"),
          meta: {
            title: "角色管理",
            icon: "peoples",
            perms: "role"
          }
        },
        {
          path: "distributionRole",
          name: "DistributionRole",
          component: () => import("@/views/role/DistributionRole.vue"),
          meta: {
            title: "分配角色",
            icon: "peoples",
            perms: "distributionRole"
          }
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

// 简化的动态路由添加（可选）
const addDynamicRoutes = (menus: any[]) => {
  console.log('开始添加动态路由:', menus);
  
  if (!menus || menus.length === 0) {
    console.log('没有菜单数据，跳过路由添加');
    return;
  }
  
  const addRoute = (menu: any) => {
    // 只处理组件类型的菜单
    if (menu.component && menu.menuType === 'C') {
      const route = {
        path: menu.path,
        name: menu.routeName,
        component: () => import(`@/views/${menu.component}.vue`),
        meta: {
          title: menu.menuName,
          perms: menu.perms,
          icon: menu.icon,
        }
      };
      
      console.log('添加动态路由:', route);
      
      // 检查路由是否已存在
      const existingRoute = router.getRoutes().find(r => r.name === route.name);
      if (!existingRoute) {
        router.addRoute('Admin', route);
        console.log('动态路由添加成功:', route.name);
      } else {
        console.log('动态路由已存在:', route.name);
      }
    }
    
    // 递归添加子路由
    if (menu.menuVOList) {
      menu.menuVOList.forEach(addRoute);
    }
  };
  
  menus.forEach(addRoute);
};

// 简化的路由守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const menuStore = useMenuStore();

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

  // 如果还没有加载用户菜单，先加载（可选）
  if (menuStore.dynamicMenus.length === 0) {
    try {
      const menus = await menuStore.generateMenus();
      
      if (menus && menus.length > 0) {
        addDynamicRoutes(menus);
        console.log('路由守卫：动态路由添加完成');
      } else {
        console.log('路由守卫：没有动态菜单数据');
      }
    } catch (error) {
      console.error('路由守卫：加载用户菜单失败:', error);
    }
  }

  // 其他情况放行
  next();
});

export default router;
