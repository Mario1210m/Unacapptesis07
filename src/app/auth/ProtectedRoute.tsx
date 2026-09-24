import { Navigate, Outlet, useLocation } from 'react-router';
import { LoaderCircle } from 'lucide-react';
import { useAuth } from './AuthContext';

export function ProtectedRoute() {
  const location = useLocation();
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <div className="h-screen max-w-md mx-auto flex items-center justify-center bg-background">
        <LoaderCircle className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
