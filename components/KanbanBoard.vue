<template>
  <div class="kanban-board">
    <div
      class="kanban-column"
      v-for="(column, columnIndex) in columnsWithDefaults"
      :key="columnIndex"
      :class="getColumnClass(columnIndex)"
    >
      <div class="kanban-column-header">
        <h2>{{ column.title }}</h2>
      </div>
      <draggable
        :list="column.tasks"
        :group="{ name: 'tasks', pull: true, put: true }"
        item-key="name"
        class="task-list"
        ghost-class="ghost"
        @start="dragging = true"
        @end="dragging = false"
        @change="updateTaskStatus($event, columnIndex)"
      >
        <template #item="{ element, index }">
          <div class="task-item">
            <div class="task-header">
              <div class="task-name">{{ element.name }}</div>
              <div class="task-icons">
                <i class="fas fa-pen edit-icon" @click="editTask(columnIndex, index)"></i>
                <i class="fas fa-trash-alt delete-icon" @click="deleteTask(columnIndex, index)"></i>
              </div>
            </div>
            <div class="assignee">Assignee: {{ element.assignee === '' ? 'Undefined' : element.assignee }}</div>
            <div v-if="isEditingTask(columnIndex, index)" class="edit-task-form">
              <input v-model="newTask.name" placeholder="Task name" />
              <span v-if="nameError" class="error-message">Task name cannot be empty</span>
              <input v-model="newTask.assignee" placeholder="Assignee" />
              <button @click="updateTask">Confirm</button>
              <button @click="cancelEdit">Cancel</button>
            </div>
          </div>
        </template>
      </draggable>
      <div v-if="columnIndex === 0" class="add-task-button">
        <button @click="showAddForm ? cancelAddTask() : (cancelEdit(), (showAddForm = true))">
          {{ showAddForm ? 'Cancel' : 'Add Task' }}
        </button>
      </div>
      <div v-if="showAddForm && columnIndex === 0" class="add-task-form">
        <input v-model="newTask.name" placeholder="Task name" />
        <span v-if="nameError" class="error-message">Task name cannot be empty</span>
        <input v-model="newTask.assignee" placeholder="Assignee" />
        <button @click="addTask">Confirm</button>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import { taskService } from '@/services/taskService';

export default {
  components: { draggable },
  data() {
    return {
      columns: [
        { title: 'To Do', tasks: [] },
        { title: 'In Progress', tasks: [] },
        { title: 'Done', tasks: [] },
      ],
      newTask: { name: '', assignee: '', status: 'To Do' },
      showAddForm: false,
      nameError: false,
      dragging: false,
      editingTaskIndex: null,
      editingColumnIndex: null,
    };
  },
  async mounted() {
    this.loadTasks();
  },
  computed: {
    columnsWithDefaults() {
      return this.columns.length === 0
        ? [
            { title: 'To Do', tasks: [] },
            { title: 'In Progress', tasks: [] },
            { title: 'Done', tasks: [] },
          ]
        : this.columns;
    },
  },
  methods: {
    async loadTasks() {
      try {
        const tasks = await taskService.getAllTasks();
        this.columns = [
          { title: 'To Do', tasks: tasks.filter((task) => task.status === 'To Do') },
          { title: 'In Progress', tasks: tasks.filter((task) => task.status === 'In Progress') },
          { title: 'Done', tasks: tasks.filter((task) => task.status === 'Done') },
        ];
      } catch (error) {
        console.error('Failed to load tasks:', error);
      }
    },
    async addTask() {
      this.nameError = this.newTask.name.trim() === '';
      if (!this.nameError) {
        try {
          const task = await taskService.createTask(this.newTask);
          this.columns[0].tasks.push(task);
          this.showAddForm = false;
        } catch (error) {
          console.error('Failed to add task:', error);
        }
      }
    },
    async deleteTask(columnIndex, taskIndex) {
      const taskId = this.columns[columnIndex].tasks[taskIndex].id;
      try {
        await taskService.deleteTask(taskId);
        this.columns[columnIndex].tasks.splice(taskIndex, 1);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    },
    editTask(columnIndex, taskIndex) {
      const task = this.columns[columnIndex].tasks[taskIndex];
      this.newTask.id = task.id;
      this.newTask.name = task.name;
      this.newTask.assignee = task.assignee;
      this.newTask.status = task.status;
      this.showAddForm = false;
      this.editingTaskIndex = taskIndex;
      this.editingColumnIndex = columnIndex;
    },
    async updateTask() {
      this.nameError = this.newTask.name.trim() === '';
      if (!this.nameError) {
        try {
          const task = await taskService.updateTask(this.newTask);
          this.columns[this.editingColumnIndex].tasks[this.editingTaskIndex] = task;
          this.editingTaskIndex = null;
          this.editingColumnIndex = null;
        } catch (error) {
          console.error('Failed to update task:', error);
        }
      }
    },
    async updateTaskStatus(event, newColumnIndex) {
      if (event.added) {
        const task = event.added.element;
        const newStatus = this.columns[newColumnIndex].title;
        try {
          task.status = newStatus;
          await taskService.updateTask(task);
        } catch (error) {
          console.error('Failed to update task status:', error);
        }
      }
    },
    cancelEdit() {
      this.editingTaskIndex = null;
      this.editingColumnIndex = null;
      this.newTask.id = null;
      this.newTask.name = '';
      this.newTask.assignee = '';
      this.newTask.status = 'To Do';
    },
    cancelAddTask() {
      this.showAddForm = false;
    },
    getColumnClass(index) {
      switch (index) {
        case 0:
          return 'todo-column';
        case 1:
          return 'in-progress-column';
        case 2:
          return 'done-column';
        default:
          return '';
      }
    },
    isEditingTask(columnIndex, taskIndex) {
      return this.editingTaskIndex === taskIndex && this.editingColumnIndex === columnIndex;
    },
  },
};
</script>
