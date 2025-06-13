import tasks from '../mockData/tasks.json'

const taskData = [...tasks]

export const taskService = {
  // Get all tasks
  getAllTasks: () => {
    return Promise.resolve(taskData)
  },

  // Get task by ID
  getTaskById: (id) => {
    const task = taskData.find(t => t.id === id)
    return Promise.resolve(task)
  },

  // Create new task
  createTask: (taskInfo) => {
    const newTask = {
      id: Date.now().toString(),
      ...taskInfo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    taskData.push(newTask)
    return Promise.resolve(newTask)
  },

  // Update task
  updateTask: (id, updates) => {
    const index = taskData.findIndex(t => t.id === id)
    if (index !== -1) {
      taskData[index] = {
        ...taskData[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      return Promise.resolve(taskData[index])
    }
    return Promise.reject(new Error('Task not found'))
  },

  // Delete task
  deleteTask: (id) => {
    const index = taskData.findIndex(t => t.id === id)
    if (index !== -1) {
      const deleted = taskData.splice(index, 1)[0]
      return Promise.resolve(deleted)
    }
    return Promise.reject(new Error('Task not found'))
  }
}

export default taskService
    
    this.tasks[index] = updatedTask;
    return { ...updatedTask };
  }

  async delete(id) {
    await delay(250);
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    this.tasks.splice(index, 1);
    return { success: true };
  }
}

export default new TaskService();