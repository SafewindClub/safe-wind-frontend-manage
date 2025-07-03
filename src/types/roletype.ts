// 角色查询参数
export interface RoleQuery {
  roleName: string;
  roleKey: string;
  status: string;
}

// 角色信息
export interface Role {
  roleId?: number;
  roleName: string;
  roleKey: string;
  roleSort: number;
  dataScope: string;
  status: string;
  delFlag: string;
  createBy: string | null;
  createTime: string;
  updateBy: string | null;
  updateTime: string | null;
  remark: string;
  menuIds: number[];
}

// 角色列表分页数据
export interface RolePageResult {
  pageNum: number;
  pageSize: number;
  totalSize: number;
  totalPages: number;
  data: Role[];
}

// 角色相关接口响应
export interface RoleApiResponse {
  code: number;
  message: string;
  data: RolePageResult | null;
  success: boolean;
}

// 通用响应（不包含数据）
export interface CommonApiResponse {
  code: number;
  message: string;
  data: null;
  success: boolean;
}
