import request from '@/utils/request';
import type { CommonResponse } from '@/types/commonType';
// 登录
export const login = (data: any) =>
  request.post('/api/user/login', {
    userName: data.userName,
    password: data.password,
    code: data.code,
    uuid: data.uuid,
  });

// 测试
export const test = () => request.get('/api/user/getLoginUser');

// 退出
export const logout = () => request.get('/api/user/logout');

// 获取用户信息
export const getUserInfo = () => request.get('/api/user/getUserInfo');

// 获取用户路由权限
export const getUserRoutes = (): Promise<CommonResponse<any[]>> => {
  return request.get('/api/user/getRoutes')
}
