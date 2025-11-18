import request from '../utils/request';

/**
 * 预约相关API服务
 */

/**
 * 创建预约
 */
export const createAppointment = async (data) => {
  const response = await request.post('/business/appointments', data);
  return response;
};

/**
 * 获取所有预约列表
 */
export const getAppointments = async (params) => {
  const response = await request.get('/business/appointments', { params });
  return response;
};

/**
 * 获取客户的预约列表
 */
export const getCustomerAppointments = async (customerId) => {
  const response = await request.get(`/business/customers/${customerId}/appointments`);
  return response;
};

/**
 * 更新预约
 */
export const updateAppointment = async (id, data) => {
  const response = await request.put(`/business/appointments/${id}`, data);
  return response;
};

/**
 * 取消预约
 */
export const cancelAppointment = async (id) => {
  const response = await request.delete(`/business/appointments/${id}`);
  return response;
};

/**
 * 完成预约
 */
export const completeAppointment = async (id) => {
  const response = await request.post(`/business/appointments/${id}/complete`);
  return response;
};
