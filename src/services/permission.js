import request from '../utils/request';

/**
 * 权限管理API服务
 */

// 获取所有权限配置
export const getAllPermissions = () => {
  return request.get('/admin/permissions');
};

// 获取指定角色的权限配置
export const getRolePermissions = (roleName) => {
  return request.get(`/admin/permissions/role/${roleName}`);
};

// 更新权限配置
export const updatePermission = (id, permissionType) => {
  return request.put(`/admin/permissions/${id}`, { permissionType });
};

// 清除权限缓存
export const clearCache = () => {
  return request.post('/admin/permissions/clear-cache');
};

// 检查字段权限
export const checkFieldPermission = (roleName, dataField) => {
  return request.get('/admin/permissions/check', {
    params: { roleName, dataField }
  });
};

