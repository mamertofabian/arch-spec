import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !currentUser) {
      // Redirect to login if not authenticated
      navigate('/login', {
        state: { from: location.pathname },
        replace: true,
      });
    }
  }, [currentUser, loading, navigate, location]);

  // Show nothing while checking authentication status
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-600"></div>
      </div>
    );
  }

  // Only render children if authenticated
  return currentUser ? <>{children}</> : null;
};

export default ProtectedRoute;
