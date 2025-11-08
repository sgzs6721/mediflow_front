import request from '../utils/request';

/**
 * 医生端API服务
 */

// 获取待诊队列
export const getWaitingQueue = () => {
  return request.get('/doctor/queue');
};

// 获取我的患者
export const getMyPatients = () => {
  return request.get('/doctor/patients');
};

// 获取患者历史病历
export const getPatientHistory = (customerId) => {
  return request.get(`/doctor/patients/${customerId}/records`);
};

// 创建病历
export const createMedicalRecord = (data) => {
  return request.post('/doctor/medical-records', data);
};

// 更新病历
export const updateMedicalRecord = (id, data) => {
  return request.put(`/doctor/medical-records/${id}`, data);
};

// 添加处方
export const addPrescription = (data) => {
  return request.post('/doctor/prescriptions', data);
};

// 获取病历的处方列表
export const getPrescriptions = (medicalRecordId) => {
  return request.get(`/doctor/medical-records/${medicalRecordId}/prescriptions`);
};

// 发送医嘱（闸门2）
export const sendMedicalOrder = (medicalRecordId) => {
  return request.post(`/doctor/medical-records/${medicalRecordId}/send-order`);
};

