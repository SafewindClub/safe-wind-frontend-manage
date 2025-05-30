<template>
  <div class="header-container">
    <!--左边-->
    <div class="header-left" @click="menuStore.toggleCollapse">
      <tiny-icon-double-left
        class="icon-double-left"
        :class="{ 'is-collapse': menuStore.isCollapse }"
      />
    </div>

    <!--右边-->
    <div class="header-right">
      <div class="header-right-item" @click="menuStore.toggleFullscreen">
        <tiny-icon-fullscreen-right
          class="icon-fullscreen"
          v-if="!menuStore.isFullscreen"
        />
        <tiny-icon-minscreen-right class="icon-minscreen" v-else />
      </div>

      <div class="header-right-item">
        <tiny-user-head
          v-model="userInfo.avatar"
          type="image"
          min
          round
        ></tiny-user-head>
        <tiny-dropdown :title="title">
          <template #dropdown>
            <tiny-dropdown-menu popper-class="my-class">
              <tiny-dropdown-item
                label="个人中心"
                @click="goToUser"
              ></tiny-dropdown-item>
              <tiny-dropdown-item
                label="退出"
                @click="userStore.handleLogout"
              ></tiny-dropdown-item>
              <tiny-dropdown-item label="设置"></tiny-dropdown-item>
            </tiny-dropdown-menu>
          </template>
        </tiny-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  iconDoubleLeft,
  iconFullscreenRight,
  iconMinscreenRight,
} from '@opentiny/vue-icon';
import {
  TinyUserHead,
  TinyDropdown,
  TinyDropdownMenu,
  TinyDropdownItem,
} from '@opentiny/vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { getUserInfo } from '@/api/user';
import { storage } from '@/utils/storage';
import defaultAvatar from '@/assets/images/logo.jpg';
const router = useRouter();

const TinyIconDoubleLeft = iconDoubleLeft();
const TinyIconFullscreenRight = iconFullscreenRight();
const TinyIconMinscreenRight = iconMinscreenRight();
import { useMenuStore } from '@/stores/menu';
import { useUserStore } from '@/stores/user';
import type { UserInfo } from '@/types/userInfo';

const menuStore = useMenuStore();
const userStore = useUserStore();

// 头像与标题
const avatar = ref(defaultAvatar);
const title = ref('海风');
const goToUser = async () => {
  if (router.currentRoute.value.path !== '/User') {
    try {
      await router.push({ name: 'User' });
      menuStore.addTab({
        title: '个人中心',
        name: 'User',
        withClose: true,
      });
    } catch (e) {
      // 可以根据需要处理跳转异常
      console.error('跳转用户页失败', e);
    }
  }
};

const userInfo = ref({
  userId: -1,
  studentId: '',
  email: '',
  nickname: '',
  avatar: '',
  grade: '',
  speciality: '',
  faculty: '',
  userInfoName: '',
  sex: 1,
  className: '',
  roleName: '',
  deptName: '',
});

onMounted(async () => {
  // 先从本地存储获取数据
  const savedUserInfo = storage.get<UserInfo>('userInfo');

  if (savedUserInfo) {
    // 如果本地有数据，直接使用
    console.log('从本地存储获取数据');

    userInfo.value = savedUserInfo;
    avatar.value = savedUserInfo.avatar || defaultAvatar;
    title.value = savedUserInfo.userInfoName || '海风';
  } else {
    // 本地没有数据，请求API
    const res = await getUserInfo();
    if (res) {
      console.log('从API获取数据');
      userInfo.value = res.data;
      title.value = userInfo.value.userInfoName || '海风';
      avatar.value = userInfo.value.avatar || defaultAvatar;

      // 将API数据存入本地存储
      storage.set('userInfo', userInfo.value);
    }
  }
});
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
