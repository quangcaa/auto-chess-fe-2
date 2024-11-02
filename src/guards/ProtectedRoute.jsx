import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth()

  // nếu chưa đăng nhập, điều hướng đến log in
  return !isAuthenticated ? <Navigate to="/login" /> : <Outlet />;
}

export default ProtectedRoute
