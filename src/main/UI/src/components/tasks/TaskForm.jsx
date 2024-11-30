import { useState, useEffect } from 'react';
import { taskService, validateTaskData } from '../../services/taskService';
import { authService } from '../../services/authService';

export default function TaskForm({ isOpen, onClose, onSuccess }) {
    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        priority: 'MEDIUM',
        assigneeId: '',
        dueDate: new Date().toISOString().split('T')[0]
    });

    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await authService.getAllUsers();
                // Directly use the response array since it's already in the correct format
                setUsers(response || []);
            } catch (err) {
                setError('Failed to fetch users');
                console.error('Error fetching users:', err);
            } finally {
                setIsLoading(false);
            }
        };

        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen]);

    const validateForm = () => {
        if (!taskData.title.trim()) {
            setError('Title is required');
            return false;
        }
        if (!taskData.description.trim()) {
            setError('Description is required');
            return false;
        }
        if (!taskData.dueDate) {
            setError('Due date is required');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
    
        const validation = validateTaskData(taskData);
        if (!validation.isValid) {
            setError(validation.errors.join(', '));
            return;
        }
    
        setIsSubmitting(true);
        try {
            await taskService.createTask(taskData);
            onSuccess();
            onClose();
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to create task';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    Create New Task
                </h3>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Title *
                        </label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                            value={taskData.title}
                            onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description *
                        </label>
                        <textarea
                            required
                            rows="3"
                            className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                            value={taskData.description}
                            onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Assigned User
                        </label>
                        <select
                            className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                            value={taskData.assigneeId}
                            onChange={(e) => setTaskData({ ...taskData, assigneeId: e.target.value })}
                        >
                            <option value="">Select a user</option>
                            {isLoading ? (
                                <option disabled>Loading users...</option>
                            ) : (
                                users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.username} ({user.email})
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Priority
                        </label>
                        <select
                            className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                            value={taskData.priority}
                            onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Due Date *
                        </label>
                        <input
                            type="date"
                            required
                            className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                            value={taskData.dueDate}
                            onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end space-x-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-indigo-600 px-4 py-2 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}