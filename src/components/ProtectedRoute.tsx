import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireUser?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  requireAdmin = false, 
  requireUser = false,
  redirectTo 
}: ProtectedRouteProps) {
  const { isAdminAuthenticated, user } = useAuth();
  const location = useLocation();

  // Check admin authentication
  if (requireAdmin && !isAdminAuthenticated) {
    const redirectPath = redirectTo || '/admin/login';
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Check user authentication
  if (requireUser && !user) {
    const redirectPath = redirectTo || '/login';
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
