import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function PrivateRoute() {
  const { user, token, isInitialized } = useAuthStore();
  const location = useLocation();

  // Show nothing while checking authentication
  if (!isInitialized) {
    return null;
  }

  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
} 