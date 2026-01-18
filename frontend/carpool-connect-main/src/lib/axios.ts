import axios from 'axios';
import { supabase } from './supabase';

const api = axios.create({
    baseURL: 'http://localhost:3000/api', // Backend URL
});

// Add a request interceptor to attach the Token
api.interceptors.request.use(async (config) => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
    } else {
        // Fallback to mock token for dev testing
        const mockToken = localStorage.getItem('mock_token');
        if (mockToken) {
            config.headers.Authorization = `Bearer ${mockToken}`;
        }
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
