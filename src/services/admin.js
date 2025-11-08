import request from '../utils/request';
import { API_ENDPOINTS } from '../config/api';

/**
 * 管理员相关API服务
 */

/**
 * 获取待审核的注册申请列表
 */
export const getRegistrationRequests = async () => {
  const response = await request.get(API_ENDPOINTS.ADMIN.REGISTRATION_REQUESTS);
  return response.data;
};

/**
 * 审核通过
 */
export const approveRequest = async (id) => {
  const response = await request.post(API_ENDPOINTS.ADMIN.APPROVE_REQUEST(id));
  return response.data;
};

/**
 * 审核拒绝
 */
export const rejectRequest = async (id, rejectReason) => {
  const response = await request.post(API_ENDPOINTS.ADMIN.REJECT_REQUEST(id), {
    rejectReason,
  });
  return response.data;
};

