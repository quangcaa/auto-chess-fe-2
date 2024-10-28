import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const PublicRoute = () => {
  const { isAuthenticated } = useAuth()

  // nếu chưa đăng nhập, điều hướng đến log in
  return isAuthenticated ? <Navigate to="/homepage" /> : <Outlet />;
}

export default PublicRoute
