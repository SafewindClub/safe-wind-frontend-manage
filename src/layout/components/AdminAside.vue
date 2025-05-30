<template>
  <div class="aside-container" :class="{ collapse: menuStore.isCollapse }">
    <div class="aside-header" @click="handleSelect('dashboard')">
      <img class="logo" :src="logoUrl" alt="logo" />
      <span class="title" v-if="!menuStore.isCollapse">社团管理系统</span>
    </div>
    <div class="menu-container">
      <div
        v-for="(item, index) in menuData"
        :key="item.name"
        class="menu-item"
        :class="{
          'is-active': activeIndex === index,
          collapse: menuStore.isCollapse,
        }"
        @click="handleSelect(item.name)"
      >
        <div class="icon-wrap">
          <component :is="getIcon(item.icon)" class="menu-icon" />
          <span class="menu-title">{{ item.title }}</span>
        </div>
        <div class="tooltip" v-if="menuStore.isCollapse">{{ item.title }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import logo from "@/assets/images/logo.jpg";
import {
  iconUser,
  iconSetting,
  iconFile,
  iconStarO,
  iconRefresh,
  iconMail,
  iconAdd,
} from "@opentiny/vue-icon";
import { useMenuStore } from "@/stores/menu";
import { useRouter } from "vue-router";

const router = useRouter();
const menuStore = useMenuStore();

const logoUrl = logo;
const activeIndex = ref(0);

// 图标映射
const iconMap = {
  home: iconFile(),
  user: iconUser(),
  setting: iconSetting(),
  file: iconFile(),
  star: iconStarO(),
  refresh: iconRefresh(),
  mail: iconMail(),
  add: iconAdd(),
};

// 获取图标组件
const getIcon = (iconName: string) => {
  return iconMap[iconName as keyof typeof iconMap] || iconFile();
};

// 菜单数据
const menuData = ref([
  {
    title: "首页",
    name: "Dashboard",
    icon: "home",
  },
  {
    title: "社员管理",
    name: "Member",
    icon: "user",
  },
  {
    title: "优秀社员",
    name: "MemberSelect",
    icon: "user",
  },
  {
    title: "换届管理",
    name: "Succession",
    icon: "refresh",
  },
  {
    title: "活动管理",
    name: "Activity",
    icon: "star",
  },
  {
    title: "新闻管理",
    name: "News",
    icon: "mail",
  },
  {
    title: "海风墙",
    name: "SafeWindWall",
    icon: "shield",
  },
  {
    title: "申请管理",
    name: "Apply",
    icon: "add",
  },
]);

// 处理菜单选择
const handleSelect = (name: string) => {
  const index = menuData.value.findIndex((item) => item.name === name);
  if (index !== -1) {
    activeIndex.value = index;
    const routeName = name.charAt(0).toUpperCase() + name.slice(1);
    const route = router.getRoutes().find((route) => route.name === routeName);
    if (route) {
      router.push({ name: routeName });
      menuStore.addTab({
        title: menuData.value[index].title,
        name: name,
        withClose: true,
      });
    }
  }
};
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
</style>
