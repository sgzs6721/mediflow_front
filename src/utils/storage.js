/**
 * LocalStorage 封装工具
 */

const STORAGE_PREFIX = 'mediflow_';

export const storage = {
  /**
   * 设置存储
   */
  set(key, value) {
    try {
      const data = JSON.stringify(value);
      localStorage.setItem(STORAGE_PREFIX + key, data);
    } catch (error) {
      console.error('Storage set error:', error);
    }
  },

  /**
   * 获取存储
   */
  get(key) {
    try {
      const data = localStorage.getItem(STORAGE_PREFIX + key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },

  /**
   * 移除存储
   */
  remove(key) {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  },

  /**
   * 清空所有存储
   */
  clear() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  },
};

// Token相关
export const tokenStorage = {
  set(token) {
    localStorage.setItem('token', token);
  },
  get() {
    return localStorage.getItem('token');
  },
  remove() {
    localStorage.removeItem('token');
  },
};

// 用户信息相关
export const userStorage = {
  set(user) {
    storage.set('user', user);
  },
  get() {
    return storage.get('user');
  },
  remove() {
    storage.remove('user');
  },
};

