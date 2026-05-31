import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from '@/store';
import { supabase } from '@/lib/supabase';
import { setSession } from '@/store/authSlice';
import { fetchProfile } from '@/store/authSlice';
import AuthGuard from '@/components/layout/AuthGuard';
import AppShell from '@/components/layout/AppShell';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import TasksPage from '@/pages/TasksPage';
import SprintsPage from '@/pages/SprintsPage';
import SprintPage from '@/pages/SprintPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import GapsPage from '@/pages/GapsPage';
import ReportPage from '@/pages/ReportPage';

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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      store.dispatch(setSession(session));
      if (session) {
        store.dispatch(fetchProfile(session.user.id));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return null;
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
          {/* Catch-all → dashboard (AuthGuard redirects to /login if unauthenticated) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
