<template>
  <div class="user-center">
    <div class="user-card">
      <div class="user-header">
        <div class="avatar-container">
          <img
            class="avatar"
            :src="userInfo.avatar || defaultAvatar"
            alt="头像"
          />
        </div>
        <h2 class="username">{{ userInfo.nickname }}</h2>
        <p class="user-role">{{ userInfo.roleName }}</p>
      </div>
      <div class="info-section">
        <h3 class="section-title">基本信息</h3>
        <div class="info-item">
          <span class="label">ID：</span>
          <span class="value">{{ userInfo.userId }}</span>
        </div>
        <div class="info-item">
          <span class="label">年级：</span>
          <span class="value">{{ userInfo.grade }}</span>
        </div>
        <div class="info-item">
          <span class="label">性别：</span>
          <span class="value">{{ userInfo.sex === 1 ? '男' : '女' }}</span>
        </div>
        <div class="info-item">
          <span class="label">学号：</span>
          <span class="value">{{ userInfo.studentId }}</span>
        </div>
        <div class="info-item">
          <span class="label">邮箱：</span>
          <span class="value">{{ userInfo.email }}</span>
        </div>
        <div class="info-item">
          <span class="label">部门：</span>
          <span class="value">{{ userInfo.deptName }}</span>
        </div>
        <div class="info-item">
          <span class="label">学院：</span>
          <span class="value">{{ userInfo.faculty }}</span>
        </div>
        <div class="info-item">
          <span class="label">专业：</span>
          <span class="value">{{ userInfo.speciality }}</span>
        </div>
        <div class="info-item">
          <span class="label">班级：</span>
          <span class="value">{{ userInfo.className }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onMounted } from 'vue';
import { getUserInfo } from '@/api/user';
import defaultAvatar from '@/assets/images/logo.jpg';
import { storage } from '@/utils/storage';
import type { UserInfo } from '@/types/userInfo';

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
}); // 初始为空对象

onMounted(async () => {
  // 先从本地存储获取数据
  const savedUserInfo = storage.get<UserInfo>('userInfo');

  if (savedUserInfo) {
    // 如果本地有数据，直接使用
    userInfo.value = savedUserInfo;
    console.log('从本地存储获取数据');
  } else {
    // 本地没有数据，请求API
    const res = await getUserInfo();
    if (res) {
      console.log('从API获取数据');
      userInfo.value = res.data;
      // 将API数据存入本地存储
      storage.set('userInfo', userInfo.value);
    }
  }
});
</script>

<style scoped>
.user-center {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
}

.user-card {
  width: 100%;
  background-color: #fff;
  overflow: hidden;
}

.user-header {
  padding: 30px 0;
  text-align: center;
  background-color: #409eff;
  color: white;
}

.avatar-container {
  margin: 0 auto 15px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.3);
  object-fit: cover;
}

.username {
  margin: 10px 0 5px;
  font-size: 24px;
  font-weight: 500;
}

.user-role {
  font-size: 14px;
  opacity: 0.8;
  margin: 0;
}

.info-section {
  padding: 20px 30px;
  border-bottom: 1px solid #ebeef5;
}

.section-title {
  font-size: 18px;
  color: #303133;
  margin-bottom: 20px;
  font-weight: 500;
}

.info-item {
  display: flex;
  margin-bottom: 15px;
  font-size: 14px;
  line-height: 24px;
}

.label {
  width: 80px;
  color: #606266;
}

.value {
  color: #303133;
  flex: 1;
}
</style>
