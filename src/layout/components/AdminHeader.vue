<template>
  <div class="header-container">
    <!--左边-->
    <div class="header-left" @click="menuStore.toggleCollapse">
      <tiny-icon-double-left class="icon-double-left" :class="{ 'is-collapse': menuStore.isCollapse }" />
    </div>

    <!--右边-->
    <div class="header-right">
      <div class="header-right-item" @click="menuStore.toggleFullscreen">
        <tiny-icon-fullscreen-right class="icon-fullscreen" v-if="!menuStore.isFullscreen" />
        <tiny-icon-minscreen-right class="icon-minscreen" v-else />
      </div>
      
      <div class="header-right-item">
        <tiny-user-head type="icon" min round></tiny-user-head>
        <tiny-dropdown :title="title">
          <template #dropdown>
            <tiny-dropdown-menu popper-class="my-class">
              <tiny-dropdown-item label="个人中心"></tiny-dropdown-item>
              <tiny-dropdown-item label="退出" @click="userStore.handleLogout"></tiny-dropdown-item>
              <tiny-dropdown-item label="设置"></tiny-dropdown-item>
            </tiny-dropdown-menu>
          </template>
        </tiny-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { iconDoubleLeft, iconFullscreenRight, iconMinscreenRight } from '@opentiny/vue-icon';
import { TinyUserHead, TinyDropdown, TinyDropdownMenu, TinyDropdownItem } from '@opentiny/vue';
import { ref } from 'vue';

const TinyIconDoubleLeft = iconDoubleLeft();
const TinyIconFullscreenRight = iconFullscreenRight();
const TinyIconMinscreenRight = iconMinscreenRight();
import { useMenuStore } from '@/stores/menu'
import { useUserStore } from '@/stores/user'

const menuStore = useMenuStore()
const userStore = useUserStore()

// 标题
const title = ref('海风');
</script>

<style scoped>
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 20px 0 0;
}

.header-left {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  cursor: pointer;
  border-radius: 0 4px 4px 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.header-left:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.header-left:active {
  background-color: rgba(0, 0, 0, 0.08);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-right-item {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.header-right-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.header-right-item:active {
  background-color: rgba(0, 0, 0, 0.08);
}

.icon-double-left {
  font-size: 20px;
  color: #666;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.icon-fullscreen,
.icon-minscreen {
  font-size: 20px;
  color: #666;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.icon-double-left.is-collapse {
  transform: rotate(180deg);
}

:deep(.tiny-user-head) {
  width: 32px;
  height: 32px;
}

:deep(.tiny-dropdown) {
  height: 32px;
  line-height: 32px;
}
</style>