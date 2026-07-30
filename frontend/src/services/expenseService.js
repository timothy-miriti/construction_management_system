import client from '../api/client';
export const expenseService = {
  list: async (projectId) => (await client.get('/expenses', { params: projectId ? { project_id: projectId } : {} })).data,
  create: async (data) => (await client.post('/expenses', data)).data,
  update: async (id, data) => (await client.put(`/expenses/${id}`, data)).data,
  remove: async (id) => { await client.delete(`/expenses/${id}`); },
};