import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (username, password) => {
        // Simulate login logic
        setUser({ id: '1', username: username });
        // Normally you would want to fetch these details from a server
    };

    const logout = () => {
        setUser(null);
    };

    // Optionally, handle authentication status when the app loads
    useEffect(() => {
        // Check local storage or API to validate current user
        // setUser(fetchedUser);
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
