import { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { useTheme } from '../../context/ThemeContext';

export default function ArticleSearch({ onSearch }) {
    const { theme } = useTheme();
    const [searchInput, setSearchInput] = useState('');

    // Use useCallback to memoize the debounced function
    const debouncedSearch = useCallback(
        debounce((value) => {
            // Search even if the value is less than 2 characters
            onSearch(value);
        }, 1800), 
        []
    );

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchInput(value);
        debouncedSearch(value);
    };

    const handleClear = () => {
        setSearchInput('');
        onSearch('');
    };

    return (
        <div className="max-w-xl relative">
            <div className="relative">
                <input
                    type="text"
                    className={`w-full border ${
                        theme === 'dark' 
                            ? 'bg-gray-800 border-gray-600 text-gray-100 focus:ring-indigo-400 focus:border-indigo-400' 
                            : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
                    } rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-1`}
                    placeholder="Search articles..."
                    value={searchInput}
                    onChange={handleChange}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg 
                        className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                {searchInput && (
                    <button
                        onClick={handleClear}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}