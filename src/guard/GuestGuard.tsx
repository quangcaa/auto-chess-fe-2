import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const GuestGuard: React.FC = () => {
    const { isAuthenticated } = useAuth()

    if (isAuthenticated === undefined) {
        return <div>Loading...</div> // or a spinner/loading component
    }

    return isAuthenticated ? <Navigate to="/" /> : <Outlet />
}

export default GuestGuard