import request from '@/utils/request'

// 登录
export const login = (data: any) => request.post('/api/user/login',
    {
        userName: data.userName,
        password: data.password,
        code: data.code,
        uuid: data.uuid
    }
)

// 测试
export const test = () => request.get('/api/user/getLoginUser')

// 退出
export const logout = () => request.get('/api/user/logout')

