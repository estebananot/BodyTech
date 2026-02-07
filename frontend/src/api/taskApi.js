import api from './axios.config';

export const taskApi = {
  getTasks: (filter) => {
    const params = filter && filter !== 'all' ? { status: filter } : {};
    return api.get('/tasks', { params });
  },
  createTask: (taskData) => api.post('/tasks', taskData),
  updateTask: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  deleteTask: (id) => api.delete(`/tasks/${id}`)
};
