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
        setUser(savedUser); // 优先使用保存的用户信息恢复会话
        try {
          // 验证token有效性，并获取最新用户信息
          const currentUserResponse = await getCurrentUser(); // 获取完整的ApiResponse
          if (currentUserResponse && currentUserResponse.success) {
            setUser(currentUserResponse.data); // 使用API返回的最新用户数据更新
          } else {
            console.error('获取当前用户失败:', currentUserResponse?.message || '未知错误');
            tokenStorage.remove(); // 仅清除token，不立即清除用户数据
          }
        } catch (error) {
          console.error('Token验证失败或网络错误:', error);
          tokenStorage.remove(); // 仅清除token，不立即清除用户数据
        }
      } else if (!token && savedUser) {
        // 如果没有token但有用户数据，则清除用户数据
        userStorage.remove();
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

