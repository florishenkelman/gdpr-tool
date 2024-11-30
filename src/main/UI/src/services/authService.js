import api from '../utils/axios';
import { API_ENDPOINTS } from './apiConfig';

export const authService = {
  register: async (userData) => {
    try {
      const registrationData = {
        ...userData,
        role: userData.role || "VIEWER"
      };
      const response = await api.post(API_ENDPOINTS.users.register, registrationData);
      return response;
    } catch (error) {
      console.error('Error during user registration:', error);
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post(API_ENDPOINTS.auth.login, credentials);
      return response;
    } catch (error) {
      console.error('Error during user login:', error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.auth.me);
      return response;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(API_ENDPOINTS.users.update(userId), userData);
      return response;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },
  
  getAllUsers: async() => {
	  try {
		const response = await api.get(API_ENDPOINTS.users.getAll);
		return response;
	  } catch (error) {
		  console.error('Error fetching users: ', error);
		  throw error;
	  }
  },
  createUser: async (userData) => {
    try {
      const registrationData = {
        email: userData.email,
        username: userData.username,
        password: "DefaultPassword123!",
        jobTitle: userData.jobTitle,
        role: userData.role || "VIEWER" 
      };

      const response = await api.post(API_ENDPOINTS.users.createUser, registrationData);
      return response.data;
    } catch (error) {
      // Add more specific error handling
      if (error.response?.status === 400) {
        const message = error.response.data?.message || 'Invalid input data';
        throw new Error(message);
      }
      console.error('Error creating user:', error);
      throw error;
    }
  },


    deleteUser: async (userId) => {
    try {
      const response = await api.delete(API_ENDPOINTS.users.deleteUser(userId));
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  getUserById: async (userId) => {
    try {
      const response = await api.get(API_ENDPOINTS.users.getById(userId));
      return response;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  },

  updateAvatar: async (userId, file) => {
    // Validate file before upload
    const validateFile = (file) => {
        const maxSize = 35 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            throw new Error('File size must be less than 5MB');
        }
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            throw new Error('File must be JPEG, PNG, or GIF');
        }
    };
    try {
        validateFile(file);
        
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await api.post(
            API_ENDPOINTS.users.updateAvatar(userId), 
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json'
                },
            }
        );
        return response;
    } catch (error) {
        if (error.response?.status === 500) {
            throw new Error('Server error while uploading avatar. Please try again.');
        }
        throw error;
    }
   }
};
