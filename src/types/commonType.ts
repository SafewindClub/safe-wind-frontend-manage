// 通用返回类型
export interface CommonResponse<T> {
    code: number
    message: string
    data: T
    success: boolean
}

// 分页
// 角色列表分页数据
export interface PageResult<T> {
    pageNum: number;
    pageSize: number;
    totalSize: number;
    totalPages: number;
    data: T;
}
