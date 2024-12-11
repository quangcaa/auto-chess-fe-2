import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated } = useAuth();
  const role = localStorage.getItem("role"); 


  if (!isAuthenticated) return <Navigate to="/login" />;

  if (!allowedRoles.includes(role) && role !== "admin") {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
