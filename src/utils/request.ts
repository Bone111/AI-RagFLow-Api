import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
// import { ElMessage } from 'element-plus'; // 如需全局消息提示可解开

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：自动加 token
request.interceptors.request.use((config: AxiosRequestConfig) => {
  if (config.headers) {
    config.headers.Authorization = 'Bearer ragflow-RkYzIzOWJjOWNmZDExZjA4OTJkMzJiZj';
  }
  return config;
});

// 响应拦截器：区分 blob 和普通响应
request.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.config.responseType === 'blob') {
      return response;
    }
    return response.data;
  },
  (error: AxiosError) => {
    // 这里可以用 ElMessage 统一提示
    // ElMessage.error(error.response?.data?.msg || '请求失败');
    return Promise.reject(error);
  },
);

export default request;

export const post = request.post;
export const get = request.get;
export const put = request.put;
export const del = request.delete;
