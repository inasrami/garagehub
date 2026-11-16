import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadState from './LoadState';

export function PrivateRoute() {
  const { user, loading, error } = useAuth();
  const location = useLocation();
  if (loading || error) return <div className="container page"><LoadState loading={loading} error={error} /></div>;
  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}

export function GuestRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div className="container page"><LoadState loading /></div>;
  return user ? <Navigate to="/my-garage" replace /> : <Outlet />;
}
