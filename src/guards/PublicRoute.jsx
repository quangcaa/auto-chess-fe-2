import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const PublicRoute = () => {
  const { isAuthenticated } = useAuth()

  // nếu đăng nhập, điều hướng đến homepage
  return isAuthenticated ? <Navigate to="/" /> : <Outlet />;
}

export default PublicRoute
