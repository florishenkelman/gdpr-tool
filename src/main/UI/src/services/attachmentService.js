import api from '../utils/axios';
import { API_ENDPOINTS } from './apiConfig';

export const attachmentService = {
  uploadFile: async (taskId, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post(API_ENDPOINTS.attachments.upload(taskId), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  downloadFile: async (attachmentId) => {
    try {
      const response = await api.get(API_ENDPOINTS.attachments.download(attachmentId), {
        responseType: 'blob',
        headers: {
          Accept: '*/*'  
        }
      });
      
      // Check if we have a successful response with data
      if (!response) {
        throw new Error('No data received from server');
      }

      const blob = new Blob([response], {
        type: response.headers['content-type'] || 'application/octet-stream'
      });

      return blob;
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  },

  getTaskAttachments: async (taskId) => {
    try {
      const response = await api.get(API_ENDPOINTS.attachments.getForTask(taskId));
      return response; 
    } catch (error) {
      console.error('Error getting task attachments:', error);
      throw error;
    }
  },

  deleteAttachment: async (attachmentId) => {
    try {
      const response = await api.delete(API_ENDPOINTS.attachments.delete(attachmentId));
      return response.data;
    } catch (error) {
      console.error('Error deleting attachment:', error);
      throw error;
    }
  },
};
