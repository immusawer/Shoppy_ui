// app/login/login.service.ts
import axios from 'axios';
import Cookies from 'js-cookie';
import { API_URL } from "@/app/products/productList";

// app/login/login.service.ts
import api from '@/lib/api';

interface LoginResponse {
  success: boolean;
  message?: string;
  user?: any;
  access_token?: string;
}

export const loginUser = async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    console.log('Server response:', response.data); // Debug log
    
    // Store the token in both localStorage and cookies
    if (response.data.access_token) {
      // Store in localStorage
      localStorage.setItem('access_token', response.data.access_token);
      
      // Store in cookies
      Cookies.set('access_token', response.data.access_token, {
        expires: 1, // 1 day
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
      
      // Set the default Authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
    }

    // Return success if we have a user and token
    if (response.data.user && response.data.access_token) {
      return {
        success: true,
        user: response.data.user,
        access_token: response.data.access_token
      };
    }

    return {
      success: false,
      message: response.data.message || 'Login failed'
    };
  } catch (error: any) {
    console.error('Login error:', error.response?.data); // Debug log
    return {
      success: false,
      message: error.response?.data?.message || 'Login failed',
    };
  }
};

// Add auth check function
export const checkAuth = async () => {
  try {
    const token = localStorage.getItem('access_token') || Cookies.get('access_token');
    if (!token) return null;

    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

// Add logout function
export const logout = () => {
  localStorage.removeItem('access_token');
  Cookies.remove('access_token');
  delete axios.defaults.headers.common['Authorization'];
};