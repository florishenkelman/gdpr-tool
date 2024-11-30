import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            authService.getCurrentUser()
                .then((response) => {
                    // Log the response to understand its structure

                    // Adjust this based on the actual response structure
                    const userData = response.data || response;
                    setUser(userData);
                })
                .catch((err) => {
                    console.error('Failed to fetch current user:', err);
                    localStorage.removeItem('token');
                    setUser(null);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (credentials) => {
        try {
            const response = await authService.login(credentials);

            // Adjust token and user extraction based on actual response structure
            const token = response.token || response.data?.token;
            const userData = response.user || response.data;

            if (token) {
                localStorage.setItem('token', token);
            }
            
            setUser(userData);
            return response;
        } catch (err) {
            console.error('Login failed:', err);
            throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            login,
            logout,
            loading, // Add loading to the context
        }}>
            {children} 
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
