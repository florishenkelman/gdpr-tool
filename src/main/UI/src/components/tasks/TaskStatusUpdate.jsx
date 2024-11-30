import { useState } from 'react';
import { taskService } from '../../services/taskService';
import toast from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';

export default function TaskStatusUpdate({ isOpen, onClose, task, onUpdate }) {
  const { theme } = useTheme();
  const [status, setStatus] = useState(task.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === task.status) {
      toast.error('Please select a different status');
      return;
    }

    setIsUpdating(true);
    try {
      await taskService.updateTaskStatus(task.id, status);
      toast.success('Status updated successfully');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Status update error:', error);
      toast.error('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className={`relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="mt-3">
          <h3 className={`text-lg font-medium ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          }`}>Update Task Status</h3>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className={`block text-sm font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-gray-100' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="OPEN">Not Started</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="CLOSED">Completed</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-md ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating || status === task.status}
                className={`px-4 py-2 rounded-md ${
                  theme === 'dark'
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-800 disabled:text-gray-300'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300'
                } disabled:cursor-not-allowed`}
              >
                {isUpdating ? 'Updating...' : 'Update'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
