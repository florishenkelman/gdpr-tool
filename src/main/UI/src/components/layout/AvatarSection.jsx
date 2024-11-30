import { useState } from 'react';
import { Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';

const AvatarSection = () => {
    const { user, setUser } = useAuth();
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleAvatarUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError(null);

        try {
            const response = await authService.updateAvatar(user.id, file);
            setUser(response.data);
        } catch (error) {
            console.error('Error uploading avatar:', error);
            setError(error.message || 'Failed to upload avatar');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                    <img
                        src={`http://localhost:8080${user?.avatarUrl}`}
                        alt="User Avatar"
                        className="rounded-full w-10 h-10 object-cover"
                    />
                    <label 
                        className={`absolute -bottom-1 -right-1 p-1 bg-white dark:bg-gray-700 
                                   rounded-full cursor-pointer hover:bg-gray-100 
                                   dark:hover:bg-gray-600 transition-colors duration-200 
                                   shadow-sm ${isUploading ? 'opacity-50' : ''}`}
                    >
                        <input
                            type="file"
                            className="hidden"
                            accept="image/jpeg,image/png,image/gif"
                            onChange={handleAvatarUpload}
                            disabled={isUploading}
                        />
                        <Camera className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    </label>
                </div>
                <div className="ml-3">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {user?.username || 'Username'}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        {user?.email || 'user@example.com'}
                    </p>
                </div>
            </div>
            
            {error && (
                <div className="px-4 py-2 text-sm text-red-800 bg-red-100 rounded-md">
                    {error}
                </div>
            )}
        </div>
    );
};

export default AvatarSection;
