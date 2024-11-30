import { useState } from 'react';
import { attachmentService } from '../../services/attachmentService';
import toast from 'react-hot-toast';

export default function AttachmentUpload({ isOpen, onClose, taskId, onSuccess }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setIsUploading(true);
    try {
      await attachmentService.uploadFile(taskId, file);
      toast.success('Attachment uploaded successfully');
      setFile(null);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload attachment');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-50 
                    overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md 
                    bg-white dark:bg-gray-800 dark:border-gray-700">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Upload Attachment
          </h3>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                File
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-indigo-50 file:text-indigo-700
                          dark:file:bg-indigo-900 dark:file:text-indigo-200
                          hover:file:bg-indigo-100 dark:hover:file:bg-indigo-800"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-md 
                         text-gray-700 dark:text-gray-300
                         hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading || !file}
                className="bg-indigo-600 px-4 py-2 text-white rounded-md 
                         hover:bg-indigo-700 dark:hover:bg-indigo-500
                         disabled:bg-indigo-300 dark:disabled:bg-indigo-800 
                         disabled:cursor-not-allowed"
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
