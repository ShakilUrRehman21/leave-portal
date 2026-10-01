import axios from 'axios';

let rawBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
rawBaseURL = rawBaseURL.replace(/\/+$/, '');
if (!rawBaseURL.endsWith('/api')) {
    rawBaseURL = `${rawBaseURL}/api`;
}

const api = axios.create({
    baseURL: rawBaseURL,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token.trim()}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
