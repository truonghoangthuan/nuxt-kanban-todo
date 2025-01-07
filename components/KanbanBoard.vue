<template>
  <div class="kanban-board">
    <div
      class="kanban-column"
      v-for="(column, columnIndex) in columns"
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
            <div class="assignee">Assignee: {{ element.assignee }}</div>
            <div v-if="isEditingTask(columnIndex, index)" class="edit-task-form">
              <input v-model="newTask.name" placeholder="Task name" />
              <span v-if="nameError" class="error-message">Task name cannot be empty</span>
              <input v-model="newTask.assignee" placeholder="Assignee" />
              <span v-if="assigneeError" class="error-message">Assignee cannot be empty</span>
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
        <span v-if="assigneeError" class="error-message">Assignee cannot be empty</span>
        <button @click="addTask">Confirm</button>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  components: {
    draggable,
  },
  data() {
    return {
      columns: [
        {
          title: 'To Do',
          tasks: [
            { name: 'Task 1', assignee: 'Alice', status: 'To Do' },
            { name: 'Task 2', assignee: 'Bob', status: 'To Do' },
            { name: 'Task 3', assignee: 'Charlie', status: 'To Do' },
          ],
        },
        {
          title: 'In Progress',
          tasks: [
            { name: 'Task 4', assignee: 'David', status: 'In Progress' },
            { name: 'Task 5', assignee: 'Eve', status: 'In Progress' },
          ],
        },
        {
          title: 'Done',
          tasks: [{ name: 'Task 6', assignee: 'Frank', status: 'Done' }],
        },
      ],
      newTask: { name: '', assignee: '', status: 'To Do' },
      showAddForm: false,
      assigneeError: false,
      nameError: false,
      dragging: false,
      editingTaskIndex: null,
      editingColumnIndex: null,
    };
  },
  methods: {
    addTask() {
      this.nameError = this.newTask.name.trim() === '';
      this.assigneeError = this.newTask.assignee.trim() === '';
      if (!this.nameError && !this.assigneeError) {
        this.columns[0].tasks.push({ ...this.newTask });
        this.newTask.name = '';
        this.newTask.assignee = '';
        this.newTask.status = 'To Do';
        this.showAddForm = false;
      }
    },
    deleteTask(columnIndex, taskIndex) {
      this.columns[columnIndex].tasks.splice(taskIndex, 1);
    },
    editTask(columnIndex, taskIndex) {
      const task = this.columns[columnIndex].tasks[taskIndex];
      this.newTask.name = task.name;
      this.newTask.assignee = task.assignee;
      this.showAddForm = false;
      this.editingTaskIndex = taskIndex;
      this.editingColumnIndex = columnIndex;
    },
    updateTask() {
      this.nameError = this.newTask.name.trim() === '';
      this.assigneeError = this.newTask.assignee.trim() === '';
      if (!this.nameError && !this.assigneeError) {
        this.columns[this.editingColumnIndex].tasks[this.editingTaskIndex] = { ...this.newTask };
        this.newTask.name = '';
        this.newTask.assignee = '';
        this.newTask.status = 'To Do';
        this.editingTaskIndex = null;
        this.editingColumnIndex = null;
      }
    },
    cancelEdit() {
      this.newTask.name = '';
      this.newTask.assignee = '';
      this.newTask.status = 'To Do';
      this.editingTaskIndex = null;
      this.editingColumnIndex = null;
    },
    cancelAddTask() {
      this.newTask.name = '';
      this.newTask.assignee = '';
      this.newTask.status = 'To Do';
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

<style scoped>
.kanban-board {
  display: flex;
  gap: 20px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.kanban-column {
  flex: 1;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.todo-column {
  background-color: #f38181c4;
}

.in-progress-column {
  background-color: #fce38ac5;
}

.done-column {
  background-color: #95e1d3c4;
}

.kanban-column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-family: 'JetBrains Mono', monospace;
}

.kanban-column h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.task-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.task-item {
  background-color: #f1f3f5;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.task-item:hover {
  background-color: #d8d8d8;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-name {
  font-size: 1rem;
}

.assignee {
  font-size: 0.8rem;
  color: #555;
  margin-top: 5px;
}

.delete-icon,
.edit-icon {
  color: #555;
  cursor: pointer;
  margin-left: 10px;
  font-size: 0.8rem;
}

.edit-icon {
  color: #555;
}

.status-select {
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.add-task-button {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}

.add-task-button button {
  width: 100%;
  padding: 10px 20px;
  background-color: transparent;
  color: #000000;
  border: 2px solid #000000;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.add-task-button button:hover {
  background-color: #f38181;
}

.add-task-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 15px;
  background-color: #f1f3f5;
  padding: 10px;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.add-task-form input {
  font-family: 'JetBrains Mono', monospace;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.add-task-form button {
  padding: 10px 20px;
  background-color: #212121;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-task-form button:hover {
  background-color: #484848;
}

.error-message {
  color: red;
  font-size: 0.85rem;
}

.ghost {
  opacity: 0.4;
}

.not-draggable {
  cursor: not-allowed;
}

.edit-task-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
  background-color: #f1f3f5;
  padding: 10px;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.edit-task-form input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.edit-task-form button {
  padding: 10px 20px;
  background-color: #212121;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.edit-task-form button:hover {
  background-color: #484848;
}
</style>
