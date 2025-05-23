<template>
    <div class="aside-container" :class="{ collapse: menuStore.isCollapse }">
        <div class="aside-header">
            <img class="logo" :src="logoUrl" alt="logo" />
            <span class="title" v-if="!menuStore.isCollapse">社团管理系统</span>
        </div>
        <ul class="menu-list">
            <li
                v-for="(item, idx) in menuList"
                :key="item.label"
                :class="['menu-item', { active: activeIndex === idx, collapse: menuStore.isCollapse }]"
                @click="activeIndex = idx"
            >
                <div class="icon-wrap">
                    <component :is="item.icon" class="menu-icon" />
                    <span v-if="menuStore.isCollapse" class="tooltip">{{ item.label }}</span>
                </div>
                <span v-if="!menuStore.isCollapse">{{ item.label }}</span>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import logo from '@/assets/images/logo.jpg'
import {
    iconUser,
    iconSetting,
    iconFile,
    iconStarO,
    iconRefresh,
    iconMail
} from '@opentiny/vue-icon'
import { useMenuStore } from '@/stores/menu'

const menuStore = useMenuStore()                                  


const logoUrl = logo
const TinyIconUser = iconUser();
const TinyIconSetting = iconSetting();
const TinyIconFile = iconFile();
const TinyIconStar = iconStarO();
const TinyIconRefresh = iconRefresh();
const TinyIconMail = iconMail();

const activeIndex = ref(0)

const menuList = [
    { icon: TinyIconUser, label: '成员管理' },
    { icon: TinyIconSetting, label: '社团事务' },
    { icon: TinyIconFile, label: '申请管理' },
    { icon: TinyIconStar, label: '社员评选' },
    { icon: TinyIconRefresh, label: '换届管理' },
    { icon: TinyIconFile, label: '内容管理' },
    { icon: TinyIconMail, label: '活动管理' },
    { icon: TinyIconMail, label: '新闻管理' },
    { icon: TinyIconFile, label: '海风墙' },
]
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
.menu-list {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
    margin-top: 16px;
}
.menu-item {
    display: flex;
    align-items: center;
    padding: 12px 0 12px 32px;
    font-size: 16px;
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
    font-size: 20px;
    margin-right: 12px;
    transition: color 0.2s;
}
.menu-item.collapse .menu-icon {
    margin-right: 0;
}
.menu-item.active, .menu-item:hover {
    background: #e6f4ff;
    color: #1890ff;
}
.menu-item.active .menu-icon, .menu-item:hover .menu-icon {
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
</style>