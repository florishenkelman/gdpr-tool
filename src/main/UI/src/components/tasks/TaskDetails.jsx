import { useQuery } from '@tanstack/react-query';
import { taskService } from '../../services/taskService';
import { attachmentService } from '../../services/attachmentService';
import { authService } from '../../services/authService';
import TaskStatusUpdate from './TaskStatusUpdate';
import AttachmentUpload from './AttachmentUpload';
import TaskComments from './TaskComments';
import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Download, Loader2 } from 'lucide-react';
import TaskActions from './TaskActions';
import { useNavigate } from 'react-router-dom';

export default function TaskDetails({ taskId }) {
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const [assignedUser, setAssignedUser] = useState({
    username: 'Loading...',
    email: '',
    jobTitle: '',
    role: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const navigate = useNavigate();

  const { data: task, isLoading: isTaskLoading, refetch: refetchTask } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => taskService.getTaskById(taskId)
  });

  const { data: attachments, isLoading: isAttachmentsLoading, refetch: refetchAttachments } = useQuery({
    queryKey: ['taskAttachments', taskId],
    queryFn: () => attachmentService.getTaskAttachments(taskId)
  });

  useEffect(() => {
    const fetchAssignedUser = async () => {
      if (!task?.assigneeId) {
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

    if (task) {
      fetchAssignedUser();
    }
  }, [task]);

  const handleAttachmentSuccess = () => {
    refetchTask();
    refetchAttachments();
  };

  const handleDownload = async (attachment) => {
      try {
          setDownloadingId(attachment.id);
          const blob = await attachmentService.downloadFile(attachment.id);
    
         // Validate that we received a blob
         if (!(blob instanceof Blob)) {
             throw new Error('Invalid response format');
          }

         // Create object URL from blob
         const url = window.URL.createObjectURL(blob);
    
         // Create and trigger download
         const link = document.createElement('a');
         link.href = url;
         link.download = attachment.fileName;
    
         // Trigger download
         document.body.appendChild(link);
         link.click();
    
         // Cleanup
         document.body.removeChild(link);
         window.URL.revokeObjectURL(url);
       } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download file. Please try again.');
       } finally {
            setDownloadingId(null);
       }
  };
  
  const handleDelete = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      navigate('/tasks'); 
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  if (isTaskLoading || isAttachmentsLoading) {
    return (
      <div className="flex justify-center items-center h-64 dark:text-gray-200">
        Loading task details...
      </div>
    );
  }

  const statusColors = {
    NOT_STARTED: theme === 'dark' 
      ? 'bg-gray-800 text-gray-200' 
      : 'bg-gray-100 text-gray-800',
    IN_PROGRESS: theme === 'dark'
      ? 'bg-blue-900 text-blue-200'
      : 'bg-blue-100 text-blue-800',
    IN_REVIEW: theme === 'dark'
      ? 'bg-yellow-900 text-yellow-200'
      : 'bg-yellow-100 text-yellow-800',
    COMPLETED: theme === 'dark'
      ? 'bg-green-900 text-green-200'
      : 'bg-green-100 text-green-800'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {task.title}
          </h2>
          <TaskActions 
            task={task}
            onDelete={handleDelete}
            onUpdate={() => setIsStatusModalOpen(true)}
            theme={theme}
          />
          <span className={`px-3 py-1 rounded-full text-sm ${statusColors[task.status]}`}>
            {task.status.replace('_', ' ')}
          </span>
        </div>

        {/* Description */}
        <div className="prose max-w-none dark:prose-invert">
          <p className="text-gray-600 dark:text-gray-300">{task.description}</p>
        </div>

        {/* Meta Information */}
        <div className="grid grid-cols-2 gap-4 py-4 border-t border-b dark:border-gray-700">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Assigned to</p>
            <p className="font-medium dark:text-gray-200">
              {loading ? 'Loading...' : assignedUser.username}
              {error && <span className="text-red-500 ml-2">({error})</span>}
            </p>
            {assignedUser.jobTitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Role: {assignedUser.jobTitle}
              </p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Priority</p>
            <p className="font-medium dark:text-gray-200">{task.priority}</p>
          </div>
        </div>

        {/* Rest of the component remains the same */}
        <div className="flex space-x-4">
          <button
            onClick={() => setIsStatusModalOpen(true)}
            className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200 
                     px-4 py-2 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-800"
          >
            Update Status
          </button>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 
                     px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Add Attachment
          </button>
        </div>

        {/* Attachments Section */}
        {attachments?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
              Attachments
            </h3>
            <div className="space-y-2">
              {attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {attachment.fileName}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {(attachment.fileSize / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <button
                    onClick={() => handleDownload(attachment)}
                    disabled={downloadingId === attachment.id}
                    className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 
                             dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {downloadingId === attachment.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Downloading...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <TaskComments taskId={taskId} />
      </div>

      <TaskStatusUpdate
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        task={task}
        onUpdate={refetchTask}
      />

      <AttachmentUpload
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        taskId={task.id}
        onSuccess={handleAttachmentSuccess}
      />
    </div>
  );
}
