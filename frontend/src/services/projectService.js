import client from '../api/client';

export const projectService = {
  list: async () => {
    const response = await client.get('/projects');
    return response.data;
  },
  create: async (data) => {
    const response = await client.post('/projects', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await client.put(`/projects/${id}`, data);
    return response.data;
  },
  remove: async (id) => {
    await client.delete(`/projects/${id}`);
  },
};