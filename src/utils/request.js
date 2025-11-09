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
    // 如果返回的是非ApiResponse格式的数据，直接返回
    if (response.config.responseType === 'blob') {
      return response;
    }

    const res = response.data;

    // 检查响应数据是否存在（包括空字符串的情况）
    if (res === null || res === undefined || res === '') {
      console.error('Response data is empty:', response);
      console.error('Response headers:', response.headers);
      console.error('Response status:', response.status);
      message.error('服务器返回数据为空');
      return Promise.reject(new Error('服务器返回数据为空'));
    }

    // 统一处理ApiResponse格式
    // 如果响应不是ApiResponse格式（没有success字段），直接返回原数据
    if (typeof res.success === 'undefined') {
      return res;
    }

    // 处理失败的响应
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

    // 成功响应，返回data字段（如果有的话），否则返回整个响应对象
    return res; // 总是返回完整的响应对象
  },
  (error) => {
    console.error('Response Error:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response,
      request: error.request,
      config: error.config
    });

    if (error.response) {
      const { status, data } = error.response;

      // 尝试解析ApiResponse格式的错误响应
      if (data && typeof data === 'object' && data.message) {
        message.error(data.message);
        return Promise.reject(new Error(data.message));
      }

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
        message.error(data?.message || `请求失败 (${status})`);
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      console.error('No response received:', error.request);
      console.error('Request URL:', error.config?.url);
      console.error('Request method:', error.config?.method);
      message.error('网络连接失败，请检查网络');
    } else {
      // 请求配置错误或JSON解析错误
      console.error('Request setup error:', error.message);
      if (error.message && error.message.includes('JSON')) {
        message.error('响应数据格式错误，请检查服务器配置');
      } else {
        message.error('请求配置错误');
      }
    }

    return Promise.reject(error);
  }
);

export default request;

