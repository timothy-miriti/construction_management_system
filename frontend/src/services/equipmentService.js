import client from '../api/client';
export const equipmentService = {
  list: async (projectId) => (await client.get('/equipment', { params: projectId ? { project_id: projectId } : {} })).data,
  create: async (data) => (await client.post('/equipment', data)).data,
  update: async (id, data) => (await client.put(`/equipment/${id}`, data)).data,
  remove: async (id) => { await client.delete(`/equipment/${id}`); },
};