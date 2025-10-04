// utils/api.js
import axios from 'axios';
// import { setCookie, getCookie, removeCookie } from './cookie';
import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Tạo axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Accept': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = Cookies.get('authToken');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Tự động set Content-Type cho JSON, bỏ qua cho FormData
        if (config.data && !(config.data instanceof FormData)) {
            config.headers['Content-Type'] = 'application/json';
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Xử lý response và error
apiClient.interceptors.response.use(
    (response) => {
        return { success: true, data: response.data };
    },
    (error) => {
        // outdated token, redirect to login
        if (error.response?.status === 401) {
            Cookies.remove('authToken');
            window.location.href = '/';
        }

        const errorMessage = error.response?.data?.message || error.message || 'Network Error';
        return { success: false, error: errorMessage };
    }
);

// API methods
export const api = {
    get: (endpoint) => apiClient.get(endpoint),

    post: (endpoint, data) => apiClient.post(endpoint, data),

    put: (endpoint, data) => apiClient.put(endpoint, data),

    delete: (endpoint, data = null) => {
        if (data) {
            return apiClient.delete(endpoint, { data });
        }
        return apiClient.delete(endpoint);
    },
};

export const setAuthToken = (token) => {
    Cookies.set('authToken', token, {
        expires: 7,
        path: '/',        // Khuyến nghị
    });
}
