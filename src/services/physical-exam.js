import request from '../utils/request';

/**
 * 体检数据API服务
 */

// 创建体检记录
export const createPhysicalExam = (data) => {
  return request.post('/doctor/physical-exams', data);
};

// 获取患者体检历史
export const getPatientExams = (customerId) => {
  return request.get(`/doctor/patients/${customerId}/physical-exams`);
};

// 获取患者最新体检数据
export const getLatestExam = (customerId) => {
  return request.get(`/doctor/patients/${customerId}/physical-exams/latest`);
};

