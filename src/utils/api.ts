//api.ts

//api.ts
import type {AxiosRequestConfig} from "axios";
import axios from "axios";
import { getToken } from '../stores/auth'

const API_BASE: string = (import.meta as any).env?.VITE_API_BASE ?? 'http://localhost:3000'

const instance = axios.create({
    baseURL: API_BASE,
    timeout: 1000,
});

// Add a request interceptor
instance.interceptors.request.use(
    function (config) {
        // Attach JWT only for create-related endpoints (POST to propuestas/actividades/comunidades)
        try {
            const method = (config.method ?? 'get').toLowerCase()
            const url = config.url ?? ''
            const isCreate = method === 'post' && (/\/propuestas\b/.test(url) || /\/actividades\b/.test(url) || /\/comunidades\b/.test(url))
            if (isCreate) {
                const token = getToken()
                if (token) {
                    config.headers = {
                        ...(config.headers || {}),
                        Authorization: `Bearer ${token}`,
                    }
                }
            }
        } catch (e) {
            console.warn('Auth interceptor failed', e)
        }
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    },
);

// Add a response interceptor
instance.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        console.warn("Interceptor on response", response);

        return response;
    },
    function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error);
    },
);

const api = {
    get: async <T>(url: string, config?: AxiosRequestConfig) => {
        return await instance.get<T>(url, config);
    },

    post: async <T>(url: string, data: any, config?: AxiosRequestConfig) => {
        return await instance.post<T>(url, data, config);
    },

    put: async <T>(url: string, data: any, config?: AxiosRequestConfig) => {
        return await instance.put<T>(url, data, config);
    },
};

export default api;