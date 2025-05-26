// 用户状态，管理用户登录状态
import { defineStore } from 'pinia'
import { ref } from 'vue'

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

  return {
    token,
    isLoggedIn,
    setToken,
    clearToken
  }
})
