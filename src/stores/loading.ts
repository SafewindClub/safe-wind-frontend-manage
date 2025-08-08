import { ref } from 'vue'
import { TinyLoading } from '@opentiny/vue'

// 全局加载实例
const loadingInstance = ref<any>(null)
// 请求计数器，处理并发请求
let requestCount = 0

// 加载状态管理
export const loadingStore = {
  // 显示加载
  show() {
    // 如果已经有加载实例，先关闭
    requestCount++
    // 如果已经有加载实例，不需要重新创建
    if (loadingInstance.value) {
      return
    }
    // 创建新的加载实例
    loadingInstance.value = TinyLoading.service({
      text: '加载中...',
      size: 'large'
    })
  },
  // 隐藏加载
  hide() {
    requestCount--
    // 只有当所有请求都完成时才关闭加载
    if (requestCount <= 0) {
      requestCount = 0
      if (loadingInstance.value) {
        loadingInstance.value.close()
        loadingInstance.value = null
      }
    }
  }
}

// 为了兼容性，保留原有的函数
export function useLoading() {
  return loadingStore
}