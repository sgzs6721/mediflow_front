// API配置文件 - 统一管理所有API相关配置

// 环境配置
const ENVIRONMENTS = {
  // 开发环境（本地调试代理模式，本地 http 使用代理到远程正式后端）
  development: {
    REMOTE_HOST: 'https://mediflow.devtesting.top', // 远端正式后端
    API_BASE_PATH: '/mediflow/api',
    USE_PROXY: true,
    PROTO: 'http', // 本地是 http
    PORT: '80',
  },
  // 生产环境（打包上线，用正式后端）
  production: {
    REMOTE_HOST: 'https://mediflow.devtesting.top',
    API_BASE_PATH: '/mediflow/api',
    USE_PROXY: false,
    PROTO: 'https',
    PORT: '443',
  }
};

// 当前环境 - 自动判断
let CURRENT_ENV = 'production';
if (
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
) {
  CURRENT_ENV = 'development';
}

// 获取当前环境配置
const getCurrentConfig = () => ENVIRONMENTS[CURRENT_ENV];

// API配置
export const API_CONFIG = {
  ...getCurrentConfig(),
  TIMEOUT: 60000,
  get HEADERS() {
    const c = getCurrentConfig();
    return {
      'Content-Type': 'application/json',
      'X-Forwarded-Proto': c.PROTO,
      'Cache-Control': 'no-cache',
      'X-Requested-With': 'XMLHttpRequest',
    };
  },
  get PROXY() {
    const c = getCurrentConfig();
    return {
      TIMEOUT: 30000,
      FOLLOW_REDIRECTS: false,
      HEADERS: {
        'X-Forwarded-Proto': c.PROTO,
        'X-Forwarded-Port': c.PORT,
        'X-Real-IP': '127.0.0.1',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    };
  },
};

// 获取API基础URL
export const getApiBaseUrl = () => {
  const config = getCurrentConfig();
  if (config.USE_PROXY) {
    return config.API_BASE_PATH; // 用代理
  }
  return config.REMOTE_HOST + config.API_BASE_PATH; // 直连正式环境
};

// 导出常用配置
export const REMOTE_HOST = getCurrentConfig().REMOTE_HOST;
export const API_BASE_PATH = getCurrentConfig().API_BASE_PATH;
export const API_BASE_URL = getApiBaseUrl();
export const TIMEOUT = API_CONFIG.TIMEOUT;
export const HEADERS = API_CONFIG.HEADERS;
export const PROXY = API_CONFIG.PROXY;

// API端点组件化导出
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    CURRENT_USER: '/auth/current-user',
  },
  ADMIN: {
    REGISTRATION_REQUESTS: '/admin/registration-requests',
    APPROVE_REQUEST: (id) => `/admin/registration-requests/${id}/approve`,
    REJECT_REQUEST: (id) => `/admin/registration-requests/${id}/reject`,
  },
  BUSINESS: {
    CUSTOMERS: '/business/customers',
    CUSTOMER_DETAIL: (id) => `/business/customers/${id}`,
    FOLLOW_UPS: (id) => `/business/customers/${id}/follow-ups`,
    ORDERS: (id) => `/business/customers/${id}/orders`,
    CONFIRM_PAYMENT: (id) => `/business/orders/${id}/confirm-payment`,
  },
  DOCTOR: {
    QUEUE: '/doctor/queue',
    PATIENTS: '/doctor/patients',
    PATIENT_DETAIL: (id) => `/doctor/patients/${id}`,
    MEDICAL_RECORDS: '/doctor/medical-records',
    MEDICAL_RECORD_DETAIL: (id) => `/doctor/medical-records/${id}`,
    SEND_ORDER: (id) => `/doctor/medical-records/${id}/send-order`,
  },
  NURSE: {
    WAITING_PATIENTS: '/nurse/waiting-patients',
    ASSIGN_DOCTOR: (id) => `/nurse/patients/${id}/assign-doctor`,
    MEDICAL_ORDERS: '/nurse/medical-orders',
    MEDICAL_ORDER_DETAIL: (id) => `/nurse/medical-orders/${id}`,
    EXECUTE_ORDER: (id) => `/nurse/medical-orders/${id}/execute`,
    COMPLETE_ORDER: (id) => `/nurse/medical-orders/${id}/complete`,
  },
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

// 环境切换辅助
export const switchEnvironment = (env) => {
  if (ENVIRONMENTS[env]) {
    return ENVIRONMENTS[env];
  }
  console.warn(`环境 ${env} 不存在`);
  return getCurrentConfig();
};

// 调试信息
console.log('当前API配置:', {
  环境: CURRENT_ENV,
  远程主机: REMOTE_HOST,
  API路径: API_BASE_PATH,
  使用代理: getCurrentConfig().USE_PROXY,
  完整API地址: getApiBaseUrl(),
});

