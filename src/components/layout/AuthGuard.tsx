import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/shared/Spinner';

/**
 * Wraps protected routes. Redirects to /login if there is no active session.
 * Shows a full-page spinner while the initial session check is in-flight.
 */
export default function AuthGuard() {
  const { session, status } = useAuth();

  if (status === 'loading' && !session) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
