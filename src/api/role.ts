import request from '@/utils/request';
import type {
  RoleQuery,
  Role,
  RoleApiResponse,
  CommonApiResponse,
} from '@/types/roletype';
import type { CommonResponse,PageResult } from '@/types/commonType';


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

// 分配用户
export const assignUserApi = (data: any): Promise<CommonApiResponse> => {
  return request.post('/api/role/distributionRole', data);
};

// 分配单个用户
export const assignSingleUserApi = (data: any): Promise<CommonApiResponse> => {
  return request.post('/api/role/distributionSingleRole', data);
};

// 查询未分配用户
export const queryUnassignedUserApi = (data: any): Promise<CommonResponse<PageResult<any[]>>> => {
  return request.post('/api/role/queryUnDistributionRole', data);
};

// 查询已分配用户
export const queryAssignedUserApi = (data:any): Promise<CommonResponse<PageResult<any[]>>> => {
  return request.post('/api/role/queryDistributionRole', data);
};

// 批量取消分配用户
export const batchCancelAssignUserApi = (data: any): Promise<CommonApiResponse> => {
  return request.post('/api/role/batchCancelAuthorizeUser', data);
};
