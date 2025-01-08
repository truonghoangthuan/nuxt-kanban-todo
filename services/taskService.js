import axios from 'axios';

export const taskService = {
  async getAllTasks() {
    const response = await axios.get('http://localhost:8080/tasks');
    return response.data;
  },
  async createTask(task) {
    const response = await axios.post('http://localhost:8080/tasks', task);
    return response.data;
  },
  async updateTask(task) {
    const response = await axios.put(`http://localhost:8080/tasks/${task.id}`, task);
    return response.data;
  },
  async deleteTask(taskId) {
    await axios.delete(`http://localhost:8080/tasks/${taskId}`);
  },
};
