export const progressReportService = {
  list: async (projectId) => (await client.get('/progress-reports', { params: projectId ? { project_id: projectId } : {} })).data,
  create: async (data) => (await client.post('/progress-reports', data)).data,
  remove: async (id) => { await client.delete(`/progress-reports/${id}`); },
};