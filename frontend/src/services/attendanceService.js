import client from '../api/client';
export const attendanceService = {
  list: async (projectId) => (await client.get('/attendance', { params: projectId ? { project_id: projectId } : {} })).data,
  create: async (data) => (await client.post('/attendance', data)).data,
  remove: async (id) => { await client.delete(`/attendance/${id}`); },
};