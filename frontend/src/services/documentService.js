import client from '../api/client';
export const documentService = {
  list: async (projectId) => (await client.get('/documents', { params: projectId ? { project_id: projectId } : {} })).data,
  create: async (data) => (await client.post('/documents', data)).data,
  remove: async (id) => { await client.delete(`/documents/${id}`); },
};