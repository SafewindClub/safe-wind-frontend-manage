import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getUserRoutes } from '@/api/user';
import type { MenuData } from '@/api/menu';

// 定义转换后的菜单项类型
interface TransformedMenuItem {
  title: string;
  name: string;
  icon: string;
  path: string;
  component: string | null;
  perms: string;
  orderNum: number;
  children: TransformedMenuItem[];
}

export const useMenuStore = defineStore('menu', () => {
  // 左侧宽度，默认210
  const asideWidth = ref(210);
  // 是否折叠，默认false
  const isCollapse = ref(false);
  // 是否全屏，默认false
  const isFullscreen = ref(false);
  // 底部高度
  const footerHeight = ref(0);
  // 头部高度
  const headerHeight = ref(78);
  // 当前激活的标签
  const activeName = ref('dashboard');
  // 标签导航栏
  const tabs = ref([
    {
      title: '首页',
      name: 'Dashboard',
      withClose: false,
    },
  ]);
  
  // 动态菜单数据
  const dynamicMenus = ref<MenuData[]>([]);
  
  // 默认首页菜单
  const defaultDashboardMenu: MenuData = {
    menuId: 1,
    menuName: "首页",
    parentId: 0,
    orderNum: 1,
    path: "dashboard",
    component: "dashboard",
    routeName: "Dashboard",
    isFrame: 0,
    isCache: 0,
    menuType: "M",
    visible: "0",
    status: "0",
    perms: "dashboard",
    icon: "dashboard",
    menuVOList: []
  };
  
  // 获取用户路由权限并生成菜单
  const generateMenus = async (): Promise<MenuData[]> => {
    try {
      const response = await getUserRoutes();
      console.log('获取到的菜单数据:', response);
      
      // 直接使用 response.data，因为响应拦截器已经处理过了
      if (response && response.success && response.data) {
        console.log('设置菜单数据:', response.data);
        
        // 检查是否包含首页菜单，如果没有则添加
        const hasDashboard = response.data.some((menu: MenuData) => 
          menu.routeName === 'Dashboard' || menu.path === 'dashboard'
        );
        
        if (!hasDashboard) {
          // 将首页菜单添加到最前面
          dynamicMenus.value = [defaultDashboardMenu, ...response.data];
        } else {
          dynamicMenus.value = response.data;
        }
        
        return dynamicMenus.value;
      }
    } catch (error) {
      console.error('获取用户路由失败:', error);
    }
    
    // 如果获取菜单失败或没有数据，使用默认菜单（包含首页）
    const defaultMenus: MenuData[] = [
      defaultDashboardMenu,
      {
        menuId: 2,
        menuName: "用户管理",
        parentId: 0,
        orderNum: 2,
        path: "user",
        component: "user/index",
        routeName: "User",
        isFrame: 0,
        isCache: 0,
        menuType: "C",
        visible: "0",
        status: "0",
        perms: "user",
        icon: "user",
        menuVOList: []
      },
      {
        menuId: 3,
        menuName: "角色管理",
        parentId: 0,
        orderNum: 3,
        path: "role",
        component: "role/index",
        routeName: "Role",
        isFrame: 0,
        isCache: 0,
        menuType: "C",
        visible: "0",
        status: "0",
        perms: "role",
        icon: "peoples",
        menuVOList: []
      }
    ];
    
    dynamicMenus.value = defaultMenus;
    return defaultMenus;
  };

  // 将后端菜单数据转换为前端菜单格式
  const transformMenus = (menus: MenuData[]): TransformedMenuItem[] => {
    console.log('transformMenus 接收到的数据:', menus);
    console.log('transformMenus 数据类型:', typeof menus);
    console.log('transformMenus 数据长度:', menus?.length);
    
    if (!menus || menus.length === 0) {
      console.log('菜单数据为空，返回默认首页菜单');
      return [{
        title: "首页",
        name: "Dashboard",
        icon: "dashboard",
        path: "dashboard",
        component: "dashboard",
        perms: "dashboard",
        orderNum: 1,
        children: []
      }];
    }
    
    const result = menus
      .filter(menu => menu.visible === '0' && menu.status === '0') // 只显示可见且启用的菜单
      .map(menu => ({
        title: menu.menuName,
        name: menu.routeName,
        icon: menu.icon,
        path: menu.path,
        component: menu.component,
        perms: menu.perms,
        orderNum: menu.orderNum,
        children: menu.menuVOList ? transformMenus(menu.menuVOList) : []
      }))
      .sort((a, b) => a.orderNum - b.orderNum);
      
    console.log('转换后的菜单数据:', result);
    return result;
  };

  // 折叠
  const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value;
    asideWidth.value = isCollapse.value ? 64 : 210;
  };
  
  //全屏
  const toggleFullscreen = () => {
    isFullscreen.value = !isFullscreen.value;
  };
  
  // 添加标签导航栏
  const addTab = (info: any) => {
    const { name, title, withClose } = info;
    const isExist = tabs.value.some((tab) => tab.name === name);

    if (!isExist) {
      tabs.value.push({
        title: title || '未命名',
        name: name,
        withClose: withClose,
      });
    }
    activeName.value = name;
  };

  return {
    asideWidth,
    isCollapse,
    isFullscreen,
    footerHeight,
    headerHeight,
    activeName,
    tabs,
    dynamicMenus,
    generateMenus,
    transformMenus,
    addTab,
    toggleCollapse,
    toggleFullscreen,
  };
});
