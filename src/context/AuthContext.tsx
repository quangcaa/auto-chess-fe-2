import React, { createContext, useContext, useState, useEffect } from 'react'

interface AuthContextType {
    isAuthenticated: boolean
    login: (token: string, username: string) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        const token = localStorage.getItem('accessToken');
        return !!token;
    });

    useEffect(() => {
        const token = localStorage.getItem('accessToken')
        console.log('Token from localStorage:', token);
        if (token) {
            setIsAuthenticated(true)
        }
    }, [])

    const login = (token: string, username: string) => {
        localStorage.setItem('accessToken', token)
        localStorage.setItem('username', username)
        setIsAuthenticated(true)
    }

    const logout = () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('username')
        setIsAuthenticated(false)
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    console.log(context)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}