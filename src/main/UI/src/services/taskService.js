import api from '../utils/axios';
import { API_ENDPOINTS } from './apiConfig';

// Validation constants
export const TASK_CONSTRAINTS = {
  VALID_PRIORITIES: ['LOW', 'MEDIUM', 'HIGH'],  
  VALID_STATUSES: ['OPEN', 'IN_PROGRESS', 'CLOSED']
};

// Helper function to format dates consistently
const formatDate = (date) => {
  if (!date) return null;
  try {
    const dateObj = new Date(date);
    return `${dateObj.toISOString().split('T')[0]}T00:00:00`;
  } catch (error) {
    console.error('Date formatting error:', error);
    return null;
  }
};

// Main task service
export const taskService = {
  // Create a new task
  createTask: async (taskData) => {
    try {
      const formattedData = {
        title: taskData.title?.trim(),
        description: taskData.description?.trim(),
        priority: taskData.priority?.toUpperCase(),
        assigneeId: taskData.assigneeId || null,
        dueDate: formatDate(taskData.dueDate)
      };
  
      // Enhanced validation
      const validation = validateTaskData(formattedData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }
  
      const response = await api.post(API_ENDPOINTS.tasks.create, formattedData);
      return response;
    } catch (error) {
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  // Get a single task by ID
  getTaskById: async (taskId) => {
    try {
      const response = await api.get(API_ENDPOINTS.tasks.getById(taskId));
      return response;
    } catch (error) {
      console.error('Error fetching task:', error.response?.data || error);
      throw error;
    }
  },

  // Get all tasks
  getAllTasks: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.tasks.base);
      return response;
    } catch (error) {
      console.error('Error fetching all tasks:', error.response?.data || error);
      throw error;
    }
  },

  // Get tasks by assignee
  getTasksByAssignee: async (assigneeId) => {
    try {
      const response = await api.get(API_ENDPOINTS.tasks.getByAssignee(assigneeId));
      return response;
    } catch (error) {
      console.error('Error fetching assignee tasks:', error.response?.data || error);
      throw error;
    }
  },

  // Get tasks by creator
  getTasksByCreator: async (creatorId) => {
    try {
      const response = await api.get(API_ENDPOINTS.tasks.getByCreator(creatorId));
      return response;
    } catch (error) {
      console.error('Error fetching creator tasks:', error.response?.data || error);
      throw error;
    }
  },

  // Update task status
  updateTaskStatus: async (taskId, status) => {
    try {
      const response = await api.put(
        API_ENDPOINTS.tasks.updateStatus(taskId),
        status.toUpperCase()
      );
      return response;
    } catch (error) {
      console.error('Error updating task status:', error.response?.data || error);
      throw error;
    }
  },

  // Update task
  updateTask: async (taskId, taskData) => {
    try {
      const formattedData = {
        ...taskData,
        dueDate: formatDate(taskData.dueDate),
        priority: taskData.priority?.toUpperCase()
      };

      const response = await api.put(
        API_ENDPOINTS.tasks.getById(taskId),
        formattedData
      );
      return response;
    } catch (error) {
      console.error('Error updating task:', error.response?.data || error);
      throw error;
    }
  },

  // Delete task
  deleteTask: async (taskId) => {
    try {
      const response = await api.delete(API_ENDPOINTS.tasks.getById(taskId));
      return response;
    } catch (error) {
      console.error('Error deleting task:', error.response?.data || error);
      throw error;
    }
  },

  // Search tasks
  searchTasks: async (searchTerm = '', status = 'ALL', priority = 'ALL') => {
    try {
      const response = await api.get(API_ENDPOINTS.tasks.search, {
        params: {
          searchTerm: searchTerm,
          status: status.toUpperCase(),
          priority: priority.toUpperCase()
        }
      });
      return response;
    } catch (error) {
      console.error('Error searching tasks:', error.response?.data || error);
      throw error;
    }
  },

  // Add comment to task
  addComment: async (taskId, content) => {
    try {
      const response = await api.post(
        API_ENDPOINTS.tasks.comments.add(taskId),
        { content }
      );
      return response;
    } catch (error) {
      console.error('Error adding comment:', error.response?.data || error);
      throw error;
    }
  },

  // Get task comments
  getTaskComments: async (taskId) => {
    try {
      const response = await api.get(API_ENDPOINTS.tasks.comments.getAll(taskId));
      console.log(response)
      return response;
    } catch (error) {
      console.error('Error fetching comments:', error.response?.data || error);
      throw error;
    }
  }
};

// Data validation helper
export const validateTaskData = (taskData) => {
  const errors = [];

  // Required fields
  if (!taskData.title?.trim()) {
    errors.push('Title is required');
  }

  if (!taskData.description?.trim()) {
    errors.push('Description is required');
  }

  // Priority validation
  if (!taskData.priority) {
    errors.push('Priority is required');
  } else if (!TASK_CONSTRAINTS.VALID_PRIORITIES.includes(taskData.priority)) {
    errors.push(`Priority must be one of: ${TASK_CONSTRAINTS.VALID_PRIORITIES.join(', ')}`);
  }

  // Date validation
  if (!taskData.dueDate) {
    errors.push('Due date is required');
  } else {
    const date = new Date(taskData.dueDate);
    if (isNaN(date.getTime())) {
      errors.push('Invalid due date format');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
