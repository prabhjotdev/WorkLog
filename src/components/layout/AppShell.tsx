import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

/**
 * Main authenticated layout: sidebar on the left, scrollable page content on the right.
 */
export default function AppShell() {
  return (
    <div className="flex h-full">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
