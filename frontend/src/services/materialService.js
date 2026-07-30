import client from '../api/client';
export const materialService = {
  list: async (projectId) => (await client.get('/materials', { params: projectId ? { project_id: projectId } : {} })).data,
  create: async (data) => (await client.post('/materials', data)).data,
  update: async (id, data) => (await client.put(`/materials/${id}`, data)).data,
  remove: async (id) => { await client.delete(`/materials/${id}`); },
};