import axios from 'axios';
import { message } from 'antd';
import { API_BASE_URL } from '../config/api';

/**
 * Axios封装 - HTTP请求工具
 */

// 创建axios实例
const request = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data;

    // 如果返回的是非ApiResponse格式的数据，直接返回
    if (response.config.responseType === 'blob') {
      return response;
    }

    // 统一处理ApiResponse格式
    if (res.success === false) {
      message.error(res.message || '操作失败');
      
      // 401未授权，跳转到登录页
      if (res.code === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      return Promise.reject(new Error(res.message || '操作失败'));
    }

    return res;
  },
  (error) => {
    console.error('Response Error:', error);

    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        message.error('登录已过期，请重新登录');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else if (status === 403) {
        message.error('没有权限访问此资源');
      } else if (status === 404) {
        message.error('请求的资源不存在');
      } else if (status === 500) {
        message.error('服务器内部错误');
      } else {
        message.error(data?.message || '请求失败');
      }
    } else if (error.request) {
      message.error('网络连接失败，请检查网络');
    } else {
      message.error('请求配置错误');
    }

    return Promise.reject(error);
  }
);

export default request;

