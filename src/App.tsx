import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from '@/store';
import { supabase } from '@/lib/supabase';
import { setSession, fetchProfile } from '@/store/authSlice';
import AuthGuard from '@/components/layout/AuthGuard';
import AppShell from '@/components/layout/AppShell';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { Spinner } from '@/components/shared/Spinner';

// Route-based code splitting — keeps the initial bundle small and loads heavy
// pages (e.g. Analytics with Recharts) only when first visited.
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const TasksPage = lazy(() => import('@/pages/TasksPage'));
const SprintsPage = lazy(() => import('@/pages/SprintsPage'));
const SprintPage = lazy(() => import('@/pages/SprintPage'));
const AnalyticsPage = lazy(() => import('@/pages/AnalyticsPage'));
const GapsPage = lazy(() => import('@/pages/GapsPage'));
const ReportPage = lazy(() => import('@/pages/ReportPage'));

/**
 * AuthListener lives inside the Provider so it can dispatch to the store,
 * but outside the Router so it runs regardless of the current route.
 */
function AuthListener() {
  useEffect(() => {
    // Hydrate session from existing local storage on first load
    supabase.auth.getSession().then(({ data: { session } }) => {
      store.dispatch(setSession(session));
      if (session) {
        store.dispatch(fetchProfile(session.user.id));
      }
    });

    // Keep the store in sync with Supabase auth state changes (sign in / sign out / token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      store.dispatch(setSession(session));
      if (session) {
        store.dispatch(fetchProfile(session.user.id));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return null;
}

function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AuthListener />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { borderRadius: '10px', fontSize: '14px' },
        }}
      />
      <BrowserRouter>
        <ErrorBoundary>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route element={<AuthGuard />}>
                <Route element={<AppShell />}>
                  <Route index element={<DashboardPage />} />
                  <Route path="tasks" element={<TasksPage />} />
                  <Route path="sprints" element={<SprintsPage />} />
                  <Route path="sprints/:sprintId" element={<SprintPage />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                  <Route path="gaps" element={<GapsPage />} />
                  <Route path="report" element={<ReportPage />} />
                </Route>
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>
  );
}
