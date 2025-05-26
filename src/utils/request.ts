import axios from 'axios'
import { Modal } from '@opentiny/vue'
import { useUserStore } from '@/stores/user'
import router from '@/router'

// 创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '', // 从环境变量获取基础URL
  timeout: 15000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    // 如果有token，添加到请求头
    if (userStore.token) {
      config.headers['Authorization'] = `Bearer ${userStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data
    console.log("信息",res)
    // 如果响应成功
    if (response.status === 200 && res.code===200) {
      return res
    }
    
    // 处理其他状态码
    handleError(res.status, res.message || '请求失败')
    return Promise.reject(new Error(res.message || '请求失败'))
  },
  (error) => {
    // 处理HTTP错误
    if (error.response) {
      const { status } = error.response
      
      // 处理401未授权
      if (status === 401) {
        const userStore = useUserStore()
        userStore.clearToken()
        router.push('/login')
        Modal.message({ message: '登录已过期，请重新登录', status: 'error' })
        return Promise.reject(error)
      }
      
      handleError(status, error.response.data?.message || '请求失败')
    } else {
      // 处理网络错误
      Modal.message({ message: '网络错误，请检查网络连接', status: 'error' })
    }
    return Promise.reject(error)
  }
)

// 统一错误处理
const handleError = (status: number, message: string) => {
  console.log("统一处理",status,message)
  switch (status) {
    case 400:
      Modal.message({ message: '请求参数错误', status: 'error' })
      break
    case 403:
      Modal.message({ message: '没有权限访问', status: 'error' })
      break
    case 404:
      Modal.message({ message: '请求的资源不存在', status: 'error' })
      break
    case 500:
      Modal.message({ message: '服务器错误', status: 'error' })
      break
    default:
      Modal.message({ message: message || '请求失败', status: 'error' })
  }
}

export default request