export const API_ENDPOINTS = {
  auth: {
    register: '/users/register',
    login: '/users/login',
    me: '/auth/me'
  },
  
  users: {
    base: '/users',
    register: '/users/register',
    getById: (id) => `/users/${id}`,
    getByEmail: (email) => `/users/email/${email}`,
    update: (id) => `/users/${id}`,
    updateRole: (id) => `/users/${id}/role`,
    getAll: '/users',
	deleteUser: (id) => `/users/${id}`,
	createUser: '/users/register',
  updateAvatar: (userId) => `/users/${userId}/avatar`,
  },

  tasks: {
    base: '/tasks',
    create: '/tasks',
    getById: (id) => `/tasks/${id}`,
    getByAssignee: (assigneeId) => `/tasks/assignee/${assigneeId}`,
    getByCreator: (creatorId) => `/tasks/creator/${creatorId}`,
    updateStatus: (id) => `/tasks/${id}/status`,
    search: '/tasks/search',
    comments: {
      add: (taskId) => `/tasks/${taskId}/comments`,
      getAll: (taskId) => `/tasks/${taskId}/comments`
    }
  },

  attachments: {
    upload: (taskId) => `/attachments/${taskId}`,
    download: (attachmentId) => `/attachments/${attachmentId}`,
    getForTask: (taskId) => `/attachments/task/${taskId}`,
    delete: (attachmentId) => `/attachments/${attachmentId}`
  },

  gdpr: {
    base: '/gdpr',
    getAll: '/gdpr',
    getById: (id) => `/gdpr/${id}`,
    search: '/gdpr/search',
    getByNumber: (number) => `/gdpr/number/${number}`,
    saved: {
      save: (articleId) => `/gdpr/saved/${articleId}`,
      getAll: '/gdpr/saved',
      delete: (savedArticleId) => `/gdpr/saved/${savedArticleId}`
    }
  }
};
