import request from '@/utils/request';
import type {
  RoleQuery,
  Role,
  RolePageResult,
  RoleApiResponse,
  CommonApiResponse,
} from '@/types/roletype';

// 查询角色列表
export const queryRoleApi = (params: RoleQuery): Promise<RoleApiResponse> => {
  return request.post('/api/role/queryRole', params);
};

// 添加角色
export const addRoleApi = (data: Role): Promise<CommonApiResponse> => {
  return request.post('/api/role/addRole', data);
};

// 编辑角色
export const updateRoleApi = (data: Role): Promise<CommonApiResponse> => {
  return request.post('/api/role/updateRole', data);
};

// 删除角色
export const deleteRoleApi = (roleId: number): Promise<CommonApiResponse> => {
  return request.post('/api/role/deleteRole', { roleId });
};
