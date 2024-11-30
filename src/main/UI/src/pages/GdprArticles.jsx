import React from 'react';
import ArticleList from '../components/gdpr/ArticleList';
import SavedArticles from '../components/gdpr/SavedArticles';
import { useTheme } from '../context/ThemeContext';

const GdprArticles = () => {
  const { theme } = useTheme();

  return (
    <div className={`container mx-auto px-4 py-8 ${
      theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content area */}
        <div className="flex-1">
          <ArticleList />
        </div>
        
        {/* Sidebar */}
        <div className="lg:w-80">
          <div className={`rounded-lg p-6 ${
            theme === 'dark' 
              ? 'bg-gray-800 shadow-lg shadow-gray-900/50' 
              : 'bg-white shadow'
          }`}>
            <SavedArticles />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GdprArticles;