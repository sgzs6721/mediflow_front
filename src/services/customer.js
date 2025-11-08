import request from '../utils/request';

/**
 * 客户相关API服务
 */

/**
 * 获取客户列表
 */
export const getCustomers = async (params) => {
  const response = await request.get('/business/customers', { params });
  return response.data;
};

/**
 * 获取客户详情
 */
export const getCustomerDetail = async (id) => {
  const response = await request.get(`/business/customers/${id}`);
  return response.data;
};

/**
 * 创建客户
 */
export const createCustomer = async (data) => {
  const response = await request.post('/business/customers', data);
  return response.data;
};

/**
 * 更新客户
 */
export const updateCustomer = async (id, data) => {
  const response = await request.put(`/business/customers/${id}`, data);
  return response.data;
};

/**
 * 删除客户
 */
export const deleteCustomer = async (id) => {
  const response = await request.delete(`/business/customers/${id}`);
  return response.data;
};

/**
 * 获取客户的订单列表
 */
export const getCustomerOrders = async (customerId) => {
  const response = await request.get(`/business/customers/${customerId}/orders`);
  return response.data;
};

/**
 * 创建订单
 */
export const createOrder = async (customerId, data) => {
  const response = await request.post(`/business/customers/${customerId}/orders`, data);
  return response.data;
};

/**
 * 确认收款
 */
export const confirmPayment = async (orderId, data) => {
  const response = await request.post(`/business/orders/${orderId}/confirm-payment`, data);
  return response.data;
};

/**
 * 获取客户的跟进记录
 */
export const getCustomerFollowUps = async (customerId) => {
  const response = await request.get(`/business/customers/${customerId}/follow-ups`);
  return response.data;
};

/**
 * 创建跟进记录
 */
export const createFollowUp = async (customerId, data) => {
  const response = await request.post(`/business/customers/${customerId}/follow-ups`, data);
  return response.data;
};

/**
 * 获取客户的预约列表
 */
export const getCustomerAppointments = async (customerId) => {
  const response = await request.get(`/business/customers/${customerId}/appointments`);
  return response.data;
};

/**
 * 创建预约
 */
export const createAppointment = async (data) => {
  const response = await request.post('/business/appointments', data);
  return response.data;
};

/**
 * 更新预约
 */
export const updateAppointment = async (id, data) => {
  const response = await request.put(`/business/appointments/${id}`, data);
  return response.data;
};

/**
 * 取消预约
 */
export const cancelAppointment = async (id) => {
  const response = await request.delete(`/business/appointments/${id}`);
  return response.data;
};

