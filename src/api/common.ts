import request from '@/utils/request'

// 获取验证码 返回数据类型为ApiResponse<CaptchaResponse>
export const getCaptcha = () => request.get('/api/captchaImage')



