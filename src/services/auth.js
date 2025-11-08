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
  return response.data;
};

/**
 * 用户注册申请
 */
export const register = async (data) => {
  const response = await request.post(API_ENDPOINTS.AUTH.REGISTER, data);
  return response.data;
};

/**
 * 获取当前用户信息
 */
export const getCurrentUser = async () => {
  const response = await request.get(API_ENDPOINTS.AUTH.CURRENT_USER);
  return response.data;
};

/**
 * 用户登出
 */
export const logout = async () => {
  const response = await request.post(API_ENDPOINTS.AUTH.LOGOUT);
  return response.data;
};

