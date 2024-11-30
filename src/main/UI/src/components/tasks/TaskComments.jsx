import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { taskService } from '../../services/taskService';

const TaskComments = ({ taskId }) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading: isLoadingComments } = useQuery({
    queryKey: ['taskComments', taskId],
    queryFn: () => taskService.getTaskComments(taskId)
  });

  const addCommentMutation = useMutation({
    mutationFn: (content) => taskService.addComment(taskId, content),
    onSuccess: () => {
      queryClient.invalidateQueries(['taskComments', taskId]);
      setNewComment('');
      setIsSubmitting(false);
    },
    onError: () => {
      setIsSubmitting(false);
    }
  });

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    addCommentMutation.mutate(newComment);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const parseContent = (content) => {
    try {
      const parsed = JSON.parse(content);
      return parsed.content || 'Invalid content';
    } catch {
      return 'Invalid content';
    }
  };

  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
        Comments
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="space-y-3">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full px-3 py-2 border rounded-md dark:border-gray-600 
                   dark:bg-gray-700 dark:text-gray-200 focus:ring-2 
                   focus:ring-indigo-500 dark:focus:ring-indigo-400 
                   focus:border-transparent"
          rows="3"
        />
        <button
          type="submit"
          disabled={isSubmitting || !newComment.trim()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md 
                   hover:bg-indigo-700 dark:bg-indigo-500 
                   dark:hover:bg-indigo-600 disabled:opacity-50 
                   disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Posting...</span>
            </div>
          ) : (
            'Post Comment'
          )}
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {isLoadingComments ? (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-gray-500 dark:text-gray-400" />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div 
              key={comment.id} 
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2"
            >
              <div className="flex justify-between items-start">
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {comment.user.username || 'Unknown User'}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                {parseContent(comment.content)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskComments;
