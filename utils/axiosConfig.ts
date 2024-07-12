// utils/axiosConfig.ts

import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        // Add the guest token to the headers if it exists
        const guestToken = localStorage.getItem('guestToken');
        if (guestToken) {
            config.headers['x-guest-token'] = guestToken;
        }

        // Add the JWT token to the headers if it exists
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
        // Handle errors
        if (error.response && error.response.status === 401) {
            // Optionally handle unauthorized errors, e.g., redirect to login
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
