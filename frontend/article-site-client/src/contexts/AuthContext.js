import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (username, password) => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      await api.post('/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const userResponse = await api.get('/api/v1/user/status');
      setUser(userResponse.data);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/v1/user/logout');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const handleOAuthLogin = async (code) => {
    try {
      const response = await api.get(`/api/v1/user/oauth/kakao?code=${code}`);
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error('OAuth 로그인 처리 중 오류:', error);
      throw error;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking auth status...');
        const response = await api.get('/api/v1/user/status');
        console.log('Auth response:', response.data);
        if (response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const value = {
    user,
    login,
    logout,
    handleOAuthLogin,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 