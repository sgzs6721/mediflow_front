import request from '../utils/request';

/**
 * 护士端API服务
 */

// 获取待接诊患者列表
export const getWaitingPatients = () => {
  return request.get('/nurse/waiting-patients');
};

// 分配医生
export const assignDoctor = (customerId, doctorId) => {
  return request.post(`/nurse/patients/${customerId}/assign-doctor?doctorId=${doctorId}`);
};

// 获取待执行医嘱列表
export const getPendingOrders = () => {
  return request.get('/nurse/medical-orders');
};

// 获取医嘱详情
export const getOrderDetail = (orderId) => {
  return request.get(`/nurse/medical-orders/${orderId}`);
};

// 添加执行记录
export const addExecutionRecord = (orderId, data) => {
  return request.post(`/nurse/medical-orders/${orderId}/execute`, data);
};

// 获取执行记录列表
export const getExecutionRecords = (orderId) => {
  return request.get(`/nurse/medical-orders/${orderId}/executions`);
};

// 标记医嘱完成
export const completeOrder = (orderId) => {
  return request.post(`/nurse/medical-orders/${orderId}/complete`);
};

// 标记医嘱异常
export const markOrderAbnormal = (orderId) => {
  return request.post(`/nurse/medical-orders/${orderId}/abnormal`);
};

