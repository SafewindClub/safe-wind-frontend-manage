import { Modal } from '@opentiny/vue'

// 统一消息处理工具
export const showMessage = {
  // 成功消息
  success(message: string) {
    Modal.message({ 
      message, 
      status: 'success',
      duration: 2000
    })
  },

  // 错误消息
  error(message: string) {
    Modal.message({ 
      message, 
      status: 'error',
      duration: 2000
    })
  },

  // 警告消息
  warning(message: string) {
    Modal.message({ 
      message, 
      status: 'warning',
      duration: 2000
    })
  },

  // 信息消息
  info(message: string) {
    Modal.message({ 
      message, 
      status: 'info',
      duration: 2000
    })
  }
}