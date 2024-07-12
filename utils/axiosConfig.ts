import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const guestToken = localStorage.getItem('guestToken');
        if (guestToken) {
            config.headers['x-guest-token'] = guestToken;
        }

        const token = localStorage.getItem('token');
        if (token) {
            console.log('token', token)
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
