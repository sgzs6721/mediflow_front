import React, { createContext, useState, useEffect, useContext } from 'react';
import { userStorage, tokenStorage } from '../utils/storage';
import { getCurrentUser } from '../services/auth';

/**
 * 认证Context
 */

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 初始化：从localStorage获取用户信息
  useEffect(() => {
    const initAuth = async () => {
      const token = tokenStorage.get();
      const savedUser = userStorage.get();

      if (token && savedUser) {
        try {
          // 验证token有效性
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          console.error('Token验证失败:', error);
          logout();
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  // 登录
  const login = (token, userData) => {
    tokenStorage.set(token);
    userStorage.set(userData);
    setUser(userData);
  };

  // 登出
  const logout = () => {
    tokenStorage.remove();
    userStorage.remove();
    setUser(null);
  };

  // 更新用户信息
  const updateUser = (userData) => {
    userStorage.set(userData);
    setUser(userData);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 自定义Hook：使用Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

