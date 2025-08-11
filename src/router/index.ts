import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useMenuStore } from "@/stores/menu";

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
        {
          path: "menu",
          name: "Menu",
          component: () => import("@/views/menu/index.vue"),
        },
        {
          path: "role",
          name: "Role",
          component: () => import("@/views/role/index.vue"),
        },
        {
          path: "distributionRole",
          name: "DistributionRole",
          component: () => import("@/views/role/DistributionRole.vue"),
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

// 动态添加路由
const addDynamicRoutes = (menus: any[]) => {
  console.log('开始添加动态路由:', menus);
  
  if (!menus || menus.length === 0) {
    console.log('没有菜单数据，跳过路由添加');
    return;
  }
  
  const addRoute = (menu: any) => {
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
      
      console.log('添加路由:', route);
      
      // 检查路由是否已存在
      const existingRoute = router.getRoutes().find(r => r.name === route.name);
      if (!existingRoute) {
        router.addRoute('Admin', route);
        console.log('路由添加成功:', route.name);
      } else {
        console.log('路由已存在:', route.name);
      }
    }
    
    // 递归添加子路由
    if (menu.menuVOList) {
      menu.menuVOList.forEach(addRoute);
    }
  };
  
  menus.forEach(addRoute);
};

// 添加全局前置守卫
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

  // 如果还没有加载用户菜单，先加载
  if (menuStore.dynamicMenus.length === 0) {
    try {
      console.log('路由守卫：开始加载菜单');
      const menus = await menuStore.generateMenus();
      console.log('路由守卫：菜单加载完成，菜单数据:', menus);
      console.log('路由守卫：菜单数据长度:', menus?.length);
      
      if (menus && menus.length > 0) {
        console.log('路由守卫：开始添加路由');
        addDynamicRoutes(menus);
        console.log('路由守卫：路由添加完成');
      } else {
        console.log('路由守卫：没有菜单数据，跳过路由添加');
      }
      
      next();
      return;
    } catch (error) {
      console.error('路由守卫：加载用户菜单失败:', error);
      next();
      return;
    }
  }

  // 其他情况放行
  next();
});

export default router;
