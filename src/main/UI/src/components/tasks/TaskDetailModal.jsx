import React from 'react';
import { X } from 'lucide-react';
import TaskDetails from './TaskDetails';
import { useTheme } from '../../context/ThemeContext';

export default function TaskDetailModal({ isOpen, onClose, taskId }) {
  const { theme } = useTheme();
  
  if (!isOpen) return null;

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-all"
      style={{
        backgroundColor: theme === 'dark' 
          ? 'rgba(0, 0, 0, 0.7)' 
          : 'rgba(0, 0, 0, 0.5)'
      }}
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto relative rounded-lg shadow-xl
          ${theme === 'dark' 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white'}`}
        onClick={handleModalClick} 
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors
            ${theme === 'dark'
              ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200'
              : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className={`p-1 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
          <TaskDetails taskId={taskId} />
        </div>
      </div>
    </div>
  );
}