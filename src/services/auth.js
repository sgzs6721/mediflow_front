import request from '../utils/request';
import { API_ENDPOINTS } from '../config/api';

/**
 * 认证相关API服务
 */

/**
 * 用户登录
 */
export const login = async (username, password) => {
  const response = await request.post(API_ENDPOINTS.AUTH.LOGIN, {
    username,
    password,
  });
  // 响应拦截器已经返回了data字段，直接返回response即可
  return response;
};

/**
 * 用户注册申请
 */
export const register = async (data) => {
  const response = await request.post(API_ENDPOINTS.AUTH.REGISTER, data);
  // 响应拦截器已经返回了data字段，直接返回response即可
  return response;
};

/**
 * 获取当前用户信息
 */
export const getCurrentUser = async () => {
  const response = await request.get(API_ENDPOINTS.AUTH.CURRENT_USER);
  // 响应拦截器已经返回了data字段，直接返回response即可
  return response;
};

/**
 * 用户登出
 */
export const logout = async () => {
  const response = await request.post(API_ENDPOINTS.AUTH.LOGOUT);
  // 响应拦截器已经返回了data字段，直接返回response即可
  return response;
};

