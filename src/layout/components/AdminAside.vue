<template>
  <div class="aside-container" :class="{ collapse: menuStore.isCollapse }">
    <div class="aside-header" @click="handleSelect('dashboard')">
      <img class="logo" :src="logoUrl" alt="logo" />
      <span class="title" v-if="!menuStore.isCollapse">社团管理系统</span>
    </div>
    <div class="menu-container">
      <!-- 动态菜单 -->
      <template v-for="(item, index) in transformedMenus" :key="item.name">
        <div class="menu-item" :class="{
          'is-active': activeIndex === Number(index),
          collapse: menuStore.isCollapse,
        }" @click="handleSelect(item.name)">
          <div class="icon-wrap">
            <svg-icon :icon="item.icon" class="menu-icon" />
            <span class="menu-title">{{ item.title }}</span>
          </div>
          <div class="tooltip" v-if="menuStore.isCollapse">{{ item.title }}</div>
        </div>
        
        <!-- 子菜单 -->
        <div v-if="item.children && item.children.length > 0" class="submenu-container">
          <div v-for="(child, childIndex) in item.children" :key="child.name" class="submenu-item" :class="{
            'is-active': activeIndex === Number(`${index}-${childIndex}`),
            collapse: menuStore.isCollapse,
          }" @click="handleSelect(child.name)">
            <div class="icon-wrap">
              <svg-icon :icon="child.icon" class="menu-icon" />
              <span class="menu-title">{{ child.title }}</span>
            </div>
            <div class="tooltip" v-if="menuStore.isCollapse">{{ child.title }}</div>
          </div>
        </div>
      </template>
      
      <!-- 如果没有菜单数据，显示默认首页 -->
      <div v-if="transformedMenus.length === 0" class="menu-item" :class="{
        'is-active': activeIndex === 0,
        collapse: menuStore.isCollapse,
      }" @click="handleSelect('dashboard')">
        <div class="icon-wrap">
          <svg-icon icon="dashboard" class="menu-icon" />
          <span class="menu-title">首页</span>
        </div>
        <div class="tooltip" v-if="menuStore.isCollapse">首页</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import logo from "@/assets/images/logo.jpg";
import SvgIcon from "@/components/SvgIcon/index.vue";
import { useMenuStore } from "@/stores/menu";
import { useRouter } from "vue-router";

const router = useRouter();
const menuStore = useMenuStore();

const logoUrl = logo;
const activeIndex = ref<number | string>(0);

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

// 转换后的菜单数据
const transformedMenus = computed((): TransformedMenuItem[] => {
  console.log('AdminAside computed 触发');
  console.log('AdminAside 当前菜单数据:', menuStore.dynamicMenus);
  console.log('AdminAside 当前菜单数据类型:', typeof menuStore.dynamicMenus);
  console.log('AdminAside 当前菜单数据长度:', menuStore.dynamicMenus?.length);
  
  const result = menuStore.transformMenus(menuStore.dynamicMenus);
  console.log('AdminAside 转换后的菜单:', result);
  return result;
});

// 处理菜单选择
const handleSelect = (name: string) => {
  const routeName = name.charAt(0).toUpperCase() + name.slice(1);
  const route = router.getRoutes().find((route) => route.name === routeName);
  if (route) {
    router.push({ name: routeName });
    // 查找菜单标题
    const findMenuTitle = (menus: TransformedMenuItem[], targetName: string): string => {
      console.log('开始查找菜单标题，目标名称:', targetName, '路由名称:', routeName);
      
      for (const menu of menus) {
        console.log('检查主菜单:', menu.name, '标题:', menu.title);
        // 检查主菜单 - 同时检查原始名称和转换后的路由名称
        if (menu.name === targetName || menu.name === routeName || menu.name.toLowerCase() === targetName.toLowerCase()) {
          console.log('找到主菜单匹配:', menu.title);
          return menu.title;
        }
        // 检查子菜单
        if (menu.children && menu.children.length > 0) {
          console.log('检查子菜单，子菜单数量:', menu.children.length);
          for (const child of menu.children) {
            console.log('检查子菜单:', child.name, '标题:', child.title);
            if (child.name === targetName || child.name === routeName || child.name.toLowerCase() === targetName.toLowerCase()) {
              console.log('找到子菜单匹配:', child.title);
              return child.title;
            }
          }
        }
      }
      console.log('未找到匹配的菜单');
      return '未命名';
    };
    
    console.log('查找菜单标题，目标名称:', name);
    console.log('路由名称:', routeName);
    console.log('当前菜单数据:', JSON.stringify(transformedMenus.value, null, 2));
    const title = findMenuTitle(transformedMenus.value, name);
    console.log('找到的标题:', title);
    
    menuStore.addTab({
      title: title || '首页',
      name: name,
      withClose: true,
    });
  }
};

// 组件挂载时获取用户菜单
onMounted(async () => {
  console.log('AdminAside 组件挂载，开始获取菜单');
  await menuStore.generateMenus();
  console.log('AdminAside 菜单获取完成，当前菜单数据:', menuStore.dynamicMenus);
  console.log('AdminAside 菜单获取完成，当前菜单数据长度:', menuStore.dynamicMenus.length);
});
</script>

<style scoped>
.aside-container {
  height: 100%;
  background: #fff;
  color: #222;
  width: 220px;
  box-shadow: 1px 0 0 #f0f0f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.aside-container.collapse {
  width: 64px;
}

.aside-header {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 24px 0 16px 0;
  border-bottom: 1px solid #f0f0f0;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.logo {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  margin-bottom: 8px;
}

.title {
  font-size: 15px;
  font-weight: bold;
  color: #222;
  letter-spacing: 2px;
  margin-left: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 1;
  white-space: nowrap;
}

.aside-container.collapse .title {
  opacity: 0;
  width: 0;
  margin-left: 0;
}

.menu-container {
  width: 100%;
  padding: 16px 0;
  overflow-y: auto;
  flex: 1;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 0 12px 32px;
  font-size: 14px;
  color: #222;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  white-space: nowrap;
}

.menu-item.collapse {
  justify-content: center;
  padding: 12px 0;
}

.menu-item .icon-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-item .menu-icon {
  font-size: 18px;
  margin-right: 12px;
  transition: color 0.2s;
  width: 18px;
  height: 18px;
}

.menu-item.collapse .menu-icon {
  margin-right: 0;
}

.menu-item.is-active,
.menu-item:hover {
  background: #e6f4ff;
  color: #1890ff;
}

.menu-item.is-active .menu-icon,
.menu-item:hover .menu-icon {
  color: #1890ff;
}

.menu-item.collapse .tooltip {
  display: none;
  position: absolute;
  left: 60px;
  top: 50%;
  transform: translateY(-50%);
  background: #222;
  color: #fff;
  padding: 4px 12px;
  border-radius: 4px;
  white-space: nowrap;
  font-size: 14px;
  z-index: 10;
  pointer-events: none;
}

.menu-item.collapse:hover .tooltip {
  display: block;
}

.menu-item span {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 1;
}

.menu-item.collapse span {
  opacity: 0;
  width: 0;
  margin-left: 0;
}

/* 自定义滚动条样式 */
.menu-container::-webkit-scrollbar {
  width: 6px;
}

.menu-container::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.menu-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.submenu-container {
  margin-left: 20px;
}

.submenu-item {
  display: flex;
  align-items: center;
  padding: 8px 0 8px 32px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  white-space: nowrap;
}

.submenu-item.collapse {
  justify-content: center;
  padding: 8px 0;
}

.submenu-item.is-active,
.submenu-item:hover {
  background: #f0f8ff;
  color: #1890ff;
}

.submenu-item.is-active .menu-icon,
.submenu-item:hover .menu-icon {
  color: #1890ff;
}

.submenu-item .menu-icon {
  font-size: 16px;
  margin-right: 8px;
  width: 16px;
  height: 16px;
}

.submenu-item.collapse .menu-icon {
  margin-right: 0;
}
</style>
