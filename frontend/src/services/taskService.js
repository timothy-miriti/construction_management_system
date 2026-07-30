import client from '../api/client';

export const taskService = {
  list: async (projectId) => {
    const response = await client.get('/tasks', {
      params: projectId ? { project_id: projectId } : {},
    });
    return response.data;
  },
  create: async (data) => {
    const response = await client.post('/tasks', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await client.put(`/tasks/${id}`, data);
    return response.data;
  },
  remove: async (id) => {
    await client.delete(`/tasks/${id}`);
  },
};