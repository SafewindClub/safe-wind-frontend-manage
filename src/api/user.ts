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


