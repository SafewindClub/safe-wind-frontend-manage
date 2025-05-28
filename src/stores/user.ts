// 用户状态，管理用户登录状态
import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '@/router'
import { logout } from '@/api/user'

export const useUserStore =defineStore('user',()=>{
  const token = ref(localStorage.getItem('token') || '')
  const isLoggedIn = ref(!!token.value)

  function setToken(newToken: string) {
    token.value = newToken
    isLoggedIn.value = true
    localStorage.setItem('token', newToken)
  }

  function clearToken() {
    token.value = ''
    isLoggedIn.value = false
    localStorage.removeItem('token')
  }

  const boxVisibility = ref(false)
  // 确认退出登录
  const confirmLogout = async () => {
    boxVisibility.value = false
    const res = await logout()
    if (res) {
      console.log(res)
      clearToken()
      router.push('/login')
    }
  }
  // 取消退出登录
  const handleLogout = () => {
    boxVisibility.value = true
  }

  // 强制退出
  const forceLogout = () => {
    clearToken()
    router.push('/login')
  }

  return {
    token,
    isLoggedIn,
    setToken,
    clearToken,
    boxVisibility,
    confirmLogout,
    handleLogout,
    forceLogout
  }
})
