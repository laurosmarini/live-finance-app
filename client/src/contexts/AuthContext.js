import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Axios instance for API calls
const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000',
  withCredentials: true
});

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState({
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken')
  });

  // Set up axios interceptor for automatic token attachment
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (tokens.accessToken) {
          config.headers.Authorization = `Bearer ${tokens.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for automatic token refresh
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 &&
            error.response?.data?.code === 'TOKEN_EXPIRED' && 
            !originalRequest._retry && 
            tokens.refreshToken) {
          
          originalRequest._retry = true;
          
          try {
            const response = await axios.post(
              `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/auth/refresh`,
              { refreshToken: tokens.refreshToken }
            );
            
            const newTokens = response.data.tokens;
            setTokens(newTokens);
            localStorage.setItem('accessToken', newTokens.accessToken);
            localStorage.setItem('refreshToken', newTokens.refreshToken);
            
            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            // Refresh failed, logout user
            logout();
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [tokens]);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (tokens.accessToken) {
        try {
          const response = await api.get('/api/auth/me');
          setUser(response.data.user);
        } catch (error) {
          console.error('Auth check failed:', error);
          // Clear invalid tokens
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setTokens({ accessToken: null, refreshToken: null });
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', {
        email,
        password
      });

      const { user: userData, tokens: tokenData } = response.data;
      
      setUser(userData);
      setTokens(tokenData);
      localStorage.setItem('accessToken', tokenData.accessToken);
      localStorage.setItem('refreshToken', tokenData.refreshToken);

      return { success: true, user: userData };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      
      const { user: newUser, tokens: tokenData } = response.data;
      
      setUser(newUser);
      setTokens(tokenData);
      localStorage.setItem('accessToken', tokenData.accessToken);
      localStorage.setItem('refreshToken', tokenData.refreshToken);

      return { success: true, user: newUser };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      if (tokens.refreshToken) {
        await api.post('/api/auth/logout', {
          refreshToken: tokens.refreshToken
        });
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear local state regardless of API call success
      setUser(null);
      setTokens({ accessToken: null, refreshToken: null });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  };

  const updateUser = (updatedUser) => {
    setUser(prev => ({ ...prev, ...updatedUser }));
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    api // Export the configured axios instance
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
