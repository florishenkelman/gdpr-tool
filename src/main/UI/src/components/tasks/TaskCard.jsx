import { useState, useEffect } from 'react';
import { taskService } from '../../services/taskService';
import { authService } from '../../services/authService';
import TaskStatusUpdate from './TaskStatusUpdate';
import AttachmentUpload from './AttachmentUpload';
import TaskDetailModal from './TaskDetailModal';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import TaskActions from './TaskActions';

export default function TaskCard({ task, onUpdate }) {
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [assignedUser, setAssignedUser] = useState({
        username: 'Loading...',
        email: '',
        jobTitle: '',
        role: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useAuth();
    const { theme } = useTheme();

    useEffect(() => {
        const fetchAssignedUser = async () => {
            if (!task.assigneeId) {
                setAssignedUser({ username: 'Unassigned' });
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const userData = await authService.getUserById(task.assigneeId);
                if (userData && userData.username) {
                    setAssignedUser(userData);
                } else {
                    setError('Invalid user data received');
                    setAssignedUser({ username: 'Unknown User' });
                }
            } catch (error) {
                console.error('Failed to fetch user by ID: ', error);
                setError('Failed to load user data');
                setAssignedUser({ username: 'Unknown User' });
            } finally {
                setLoading(false);
            }
        };

        fetchAssignedUser();
    }, [task.assigneeId]);

    const statusColors = theme === 'dark' ? {
        NOT_STARTED: 'bg-gray-800 text-gray-300 border border-gray-700',
        IN_PROGRESS: 'bg-blue-900 text-blue-200 border border-blue-800',
        IN_REVIEW: 'bg-yellow-900 text-yellow-200 border border-yellow-800',
        COMPLETED: 'bg-green-900 text-green-200 border border-green-800'
    } : {
        NOT_STARTED: 'bg-gray-100 text-gray-800',
        IN_PROGRESS: 'bg-blue-100 text-blue-800',
        IN_REVIEW: 'bg-yellow-100 text-yellow-800',
        COMPLETED: 'bg-green-100 text-green-800'
    };
    
    const handleCardClick = (e) => {
        if (e.target.tagName.toLowerCase() === 'button') {
            return;
        }
        setIsDetailModalOpen(true);
    };
    
    const handleDelete = async (taskId) => {
        try {
            await taskService.deleteTask(taskId);
            onUpdate(); 
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

    return (
        <>
            <div 
                className={`rounded-lg shadow p-6 space-y-4 cursor-pointer transition-all hover:shadow-lg ${
                    theme === 'dark' ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
                }`}
                onClick={handleCardClick}
            >
                <div className="flex justify-between items-start">
                    <h3 className={`text-lg font-medium ${
                        theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                    }`}>{task.title}</h3>
                    <span className={`px-2 py-1 text-sm rounded-full ${statusColors[task.status]}`}>
                        {task.status.replace('_', ' ')}
                    </span>
                </div>
        
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    {task.description}
                </p>
        
                <div className={`border-t ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                } pt-4`}>
                    <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                        Assigned to: {loading ? 'Loading...' : assignedUser.username}
                        {error && <span className="text-red-500 ml-2">({error})</span>}
                    </p>
                    {assignedUser.jobTitle && (
                        <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                            Role: {assignedUser.jobTitle}
                        </p>
                    )}
                    <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                        Priority: {task.priority}
                    </p>
                </div>
        
                <div className="flex space-x-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsStatusModalOpen(true);
                        }}
                        className={`px-3 py-1 rounded-md text-sm ${
                            theme === 'dark'
                                ? 'bg-indigo-900 text-indigo-200 hover:bg-indigo-800'
                                : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                        }`}
                    >
                        Update Status
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsUploadModalOpen(true);
                        }}
                        className={`px-3 py-1 rounded-md text-sm ${
                            theme === 'dark'
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Add Attachment
                    </button>
                    <TaskActions 
                        task={task}
                        onDelete={handleDelete}
                        onUpdate={() => setIsDetailModalOpen(true)}
                        theme={theme}
                    />
                </div>
            </div>
            
            <TaskStatusUpdate
                isOpen={isStatusModalOpen}
                onClose={() => setIsStatusModalOpen(false)}
                task={task}
                onUpdate={onUpdate}
            />
    
            <AttachmentUpload
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                taskId={task.id}
                onSuccess={onUpdate}
            />

            <TaskDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                taskId={task.id}
            />
        </>
    );
}
