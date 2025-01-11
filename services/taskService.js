import axios from 'axios';

export const taskService = {
  async getAllTasks() {
    const config = useRuntimeConfig();
    const response = await axios.get(`${config.public.baseURL}/tasks`);
    return response.data;
  },
  async createTask(task) {
    const config = useRuntimeConfig();
    const response = await axios.post(`${config.public.baseURL}/tasks`, task);
    return response.data;
  },
  async updateTask(task) {
    const config = useRuntimeConfig();
    const response = await axios.put(`${config.public.baseURL}/tasks/${task.id}`, task);
    return response.data;
  },
  async deleteTask(taskId) {
    const config = useRuntimeConfig();
    await axios.delete(`${config.public.baseURL}/tasks/${taskId}`);
  },
};
