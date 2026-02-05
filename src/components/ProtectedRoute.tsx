import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    // Redirect to login page, saving the attempted location
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}
