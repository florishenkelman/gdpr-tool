import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, Sun, Moon } from 'lucide-react';
import Sidebar from './Sidebar';
import { useTheme } from '../../context/ThemeContext';

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
            {/* Theme toggle button */}
            <button
                onClick={toggleTheme}
                className="fixed top-4 right-4 z-50 p-2 rounded-md bg-white dark:bg-gray-800 shadow-lg
                          text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white
                          focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                aria-label="Toggle theme"
            >
                {theme === 'light' ? (
                    <Moon className="h-6 w-6" />
                ) : (
                    <Sun className="h-6 w-6" />
                )}
            </button>

            {/* Mobile menu button */}
            <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white dark:bg-gray-800 shadow-lg
                          text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white
                          focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
            >
                <Menu className="h-6 w-6" />
            </button>

            <div className="flex h-screen overflow-hidden">
                {/* Sidebar */}
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                {/* Main content area */}
                <main className="flex-1 overflow-y-auto relative">
                    <div className="p-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}