import client from '../api/client';

export const dashboardService = {
  getSummary: async () => {
    const response = await client.get('/dashboard');
    return response.data;
  },
};