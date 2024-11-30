import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Initialize theme
const initializeTheme = () => {
    // Check if theme exists in localStorage
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        // Apply saved theme
        document.documentElement.classList.add(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Apply dark theme if user prefers dark mode
        document.documentElement.classList.add('dark');
    } else {
        // Default to light theme
        document.documentElement.classList.add('light');
    }
};

// Run theme initialization
initializeTheme();

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
