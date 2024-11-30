import api from '../utils/axios';
import { API_ENDPOINTS } from './apiConfig';

export const gdprService = {
  getAllArticles: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.gdpr.getAll);
      return response;
    } catch (error) {
      console.error('Error getting all GDPR articles:', error);
      throw error;
    }
  },

  getArticleById: async (id) => {
    try {
      const response = await api.get(API_ENDPOINTS.gdpr.getById(id));
      return response;
    } catch (error) {
      console.error('Error getting GDPR article by ID:', error);
      throw error;
    }
  },

  searchArticles: async (searchTerm) => {
      try {
        const response = await api.get(`${API_ENDPOINTS.gdpr.search}?searchTerm=${searchTerm}`);
        return response;
       } catch (error) {
        console.error('Error searching GDPR articles:', error.response?.data || error.message);
        throw error;
      }
    },

  saveArticle: async (articleId) => {
    try {
      const response = await api.post(API_ENDPOINTS.gdpr.saved.save(articleId));
      return response;
    } catch (error) {
      console.error('Error saving GDPR article:', error);
      throw error;
    }
  },

  getSavedArticles: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.gdpr.saved.getAll);
      return response;
    } catch (error) {
      console.error('Error getting saved GDPR articles:', error);
      throw error;
    }
  },

  removeSavedArticle: async (savedArticleId) => {
    try {
      const response = await api.delete(API_ENDPOINTS.gdpr.saved.delete(savedArticleId));
      return response;
    } catch (error) {
      console.error('Error removing saved GDPR article:', error);
      throw error;
    }
  },
};
