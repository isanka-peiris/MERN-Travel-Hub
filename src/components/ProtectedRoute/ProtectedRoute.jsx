import { useAuth } from '../../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  const hasToken = !!token || !!localStorage.getItem('token');
  const isAuthenticated = !!user || hasToken;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
