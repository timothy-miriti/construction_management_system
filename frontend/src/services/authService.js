import client from '../api/client';

export const authService = {
  login: async (email, password) => {
    const response = await client.post('/auth/login', { email, password });
    const { access_token, user } = response.data;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },

  register: async (userData) => {
    const response = await client.post('/auth/register', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },
};
