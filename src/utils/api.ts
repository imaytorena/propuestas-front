//api.ts

//api.ts
import type {AxiosRequestConfig} from "axios";
import axios from "axios";

const API_BASE: string = (import.meta as any).env?.VITE_API_BASE ?? 'http://localhost:3000'

const instance = axios.create({
    baseURL: API_BASE,
    timeout: 1000,
});

// Add a request interceptor
instance.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        console.warn("Interceptor on request");

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