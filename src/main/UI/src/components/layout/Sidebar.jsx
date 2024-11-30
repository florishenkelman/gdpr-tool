import { Link, useLocation } from 'react-router-dom';
import { Layout as LayoutIcon, FileText, Users, BookOpen, LogOut, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AvatarSection from './AvatarSection';

export default function Sidebar({ isOpen, onClose }) {
    const location = useLocation();
    const { user, logout } = useAuth();

    const navigationItems = [
        { name: 'Dashboard', path: '/', icon: LayoutIcon },
        { name: 'Tasks', path: '/tasks', icon: FileText },
        { name: 'GDPR Articles', path: '/gdpr-articles', icon: BookOpen },
        { name: 'Users', path: '/users', icon: Users },
    ];

    const sidebarClasses = `transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
    } lg:translate-x-0 fixed lg:static inset-y-0 left-0 w-64 
    bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out z-40 
    flex flex-col`;

    return (
        <>
            {/* Overlay for small screens */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity lg:hidden z-30"
                    onClick={onClose}
                />
            )}

            {/* Sidebar container */}
            <div className={sidebarClasses}>
                {/* Close button for small screens */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700 lg:hidden">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">Menu</span>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-md text-gray-400 dark:text-gray-300 hover:text-gray-500
                                 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* User Avatar Section */}
                <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
                    <AvatarSection />
                </div>

                {/* Navigation links */}
                <nav className="mt-5 px-2 space-y-1 flex-1">
                    {navigationItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                                    isActive
                                        ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                                }`}
                                onClick={onClose}
                            >
                                <Icon
                                    className={`mr-4 h-6 w-6 ${
                                        isActive
                                            ? 'text-indigo-600 dark:text-indigo-300'
                                            : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                                    }`}
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={logout}
                        className="flex items-center w-full text-gray-600 dark:text-gray-300
                                 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50
                                 dark:hover:bg-gray-700/50 p-2 rounded-md transition-colors duration-200"
                    >
                        <LogOut className="h-5 w-5 mr-3" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
}