import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { taskService } from '../../services/taskService';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import { useTheme } from '../../context/ThemeContext';

export default function TaskList({ 
    searchTerm = '', 
    status = 'ALL', 
    priority = 'ALL' 
}) {
    const { theme } = useTheme();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    
    const { data: tasks, isLoading, refetch } = useQuery({
        queryKey: ['tasks', searchTerm, status, priority],
        queryFn: () => taskService.searchTasks(searchTerm, status, priority),
    });

    const handleTaskCreated = () => {
        refetch();
        setIsCreateModalOpen(false);
    };

    if (isLoading) {
        return (
            <div className={`flex justify-center items-center h-64 
                ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                Loading tasks...
            </div>
        );
    }

    return (
        <div className={`space-y-6 
            ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center">
                <h2 className={`text-2xl font-bold 
                    ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                    Tasks {searchTerm && `- Searching: "${searchTerm}"`}
                </h2>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className={`px-4 py-2 rounded-md 
                        ${theme === 'dark' 
                            ? 'bg-indigo-500 hover:bg-indigo-600 text-white' 
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                >
                    Create New Task
                </button>
            </div>

            {tasks?.length === 0 ? (
                <div className={`text-center py-10 
                    ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    No tasks found matching your search criteria.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks?.map((task) => (
                        <div key={task.id} 
                            className={`p-4 rounded-lg shadow-md
                                ${theme === 'dark' 
                                    ? 'bg-gray-700 text-gray-100' 
                                    : 'bg-white text-gray-900'
                                }`}>
                            <TaskCard task={task} onUpdate={refetch} />
                        </div>
                    ))}
                </div>
            )}

            {isCreateModalOpen && (
                <TaskForm
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSuccess={handleTaskCreated}
                />
            )}
        </div>
    );
}