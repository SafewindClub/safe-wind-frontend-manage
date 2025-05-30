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
        <div class="info-grid">
          <div class="info-item"><span class="label">ID：</span><span class="value">{{ userInfo.userId }}</span></div>
          <div class="info-item"><span class="label">年级：</span><span class="value">{{ userInfo.grade }}</span></div>
          <div class="info-item"><span class="label">性别：</span><span class="value">{{ userInfo.sex === 1 ? '男' : '女' }}</span></div>
          <div class="info-item"><span class="label">学号：</span><span class="value">{{ userInfo.studentId }}</span></div>
          <div class="info-item"><span class="label">邮箱：</span><span class="value">{{ userInfo.email }}</span></div>
          <div class="info-item"><span class="label">部门：</span><span class="value">{{ userInfo.deptName }}</span></div>
          <div class="info-item"><span class="label">学院：</span><span class="value">{{ userInfo.faculty }}</span></div>
          <div class="info-item"><span class="label">专业：</span><span class="value">{{ userInfo.speciality }}</span></div>
          <div class="info-item"><span class="label">班级：</span><span class="value">{{ userInfo.className }}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getUserInfo } from '@/api/user'
import defaultAvatar from '@/assets/images/logo.jpg'
import { storage } from '@/utils/storage'
import type { UserInfo } from '@/types/userInfo'

const userInfo = ref<UserInfo>({
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
})

onMounted(async () => {
  const savedUserInfo = storage.get<UserInfo>('userInfo')
  if (savedUserInfo) {
    userInfo.value = savedUserInfo
  } else {
    const res = await getUserInfo()
    if (res) {
      userInfo.value = res.data
      storage.set('userInfo', userInfo.value)
    }
  }
})
</script>

<style scoped>
.user-center {
  height: 100%;
  width: 100%;
  background: linear-gradient(135deg, #e0e7ef 0%, #f5f7fa 100%);
  overflow: auto;
  box-sizing: border-box;
}

.user-card {
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 0;
  box-shadow: none;
  overflow: auto;
}

.user-header {
  padding: 36px 0 24px 0;
  text-align: center;
  background: linear-gradient(90deg, #409eff 0%, #36cfc9 100%);
  color: #fff;
}

.avatar-container {
  margin: 0 auto 12px;
}

.avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  border: 4px solid #fff;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
}

.username {
  margin: 10px 0 4px;
  font-size: 26px;
  font-weight: 600;
  letter-spacing: 1px;
}

.user-role {
  font-size: 15px;
  opacity: 0.85;
  margin: 0;
  font-weight: 400;
}

.info-section {
  padding: 28px 32px 32px 32px;
  background: #fff;
}

.section-title {
  font-size: 18px;
  color: #303133;
  margin-bottom: 18px;
  font-weight: 500;
  border-left: 3px solid #409eff;
  padding-left: 10px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 14px 18px;
}

.info-item {
  display: flex;
  font-size: 14px;
  line-height: 22px;
}

.label {
  color: #909399;
  width: 60px;
  flex-shrink: 0;
}

.value {
  color: #303133;
  flex: 1;
  word-break: break-all;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .info-section {
    padding: 20px 16px;
  }
  
  .user-header {
    padding: 24px 0 16px 0;
  }
  
  .avatar {
    width: 80px;
    height: 80px;
  }
  
  .username {
    font-size: 22px;
  }
}
</style>
