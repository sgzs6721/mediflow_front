/**
 * API配置
 */

// API基础URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/mediflow/api';

// API端点
export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    CURRENT_USER: '/auth/current-user',
  },

  // 管理员相关
  ADMIN: {
    REGISTRATION_REQUESTS: '/admin/registration-requests',
    APPROVE_REQUEST: (id) => `/admin/registration-requests/${id}/approve`,
    REJECT_REQUEST: (id) => `/admin/registration-requests/${id}/reject`,
  },

  // 商务端相关
  BUSINESS: {
    CUSTOMERS: '/business/customers',
    CUSTOMER_DETAIL: (id) => `/business/customers/${id}`,
    FOLLOW_UPS: (id) => `/business/customers/${id}/follow-ups`,
    ORDERS: (id) => `/business/customers/${id}/orders`,
    CONFIRM_PAYMENT: (id) => `/business/orders/${id}/confirm-payment`,
  },

  // 医生端相关
  DOCTOR: {
    QUEUE: '/doctor/queue',
    PATIENTS: '/doctor/patients',
    PATIENT_DETAIL: (id) => `/doctor/patients/${id}`,
    MEDICAL_RECORDS: '/doctor/medical-records',
    MEDICAL_RECORD_DETAIL: (id) => `/doctor/medical-records/${id}`,
    SEND_ORDER: (id) => `/doctor/medical-records/${id}/send-order`,
  },

  // 护士端相关
  NURSE: {
    WAITING_PATIENTS: '/nurse/waiting-patients',
    ASSIGN_DOCTOR: (id) => `/nurse/patients/${id}/assign-doctor`,
    MEDICAL_ORDERS: '/nurse/medical-orders',
    MEDICAL_ORDER_DETAIL: (id) => `/nurse/medical-orders/${id}`,
    EXECUTE_ORDER: (id) => `/nurse/medical-orders/${id}/execute`,
    COMPLETE_ORDER: (id) => `/nurse/medical-orders/${id}/complete`,
  },

  // 预约相关
  APPOINTMENTS: '/appointments',
  CUSTOMER_APPOINTMENTS: (id) => `/customers/${id}/appointments`,
};

// 角色映射
export const ROLE_MAP = {
  BUSINESS: '普通商务',
  BUSINESS_ADMIN: '商务管理员',
  DOCTOR: '医生',
  NURSE: '护士',
};

// 角色首页路由
export const ROLE_HOME_ROUTES = {
  BUSINESS: '/business/customers',
  BUSINESS_ADMIN: '/admin/customers',
  DOCTOR: '/doctor/workbench',
  NURSE: '/nurse/workbench',
};

