import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {Building2} from 'lucide-react';
import { HardHat, LayoutDashboard, FolderKanban, ListTodo, DollarSign, Package, Wrench, Clock, ClipboardList, FileText, LogOut } from 'lucide-react';
    

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/tasks', label: 'Tasks', icon: ListTodo },
  { to: '/expenses', label: 'Expenses', icon: DollarSign },
  { to: '/materials', label: 'Materials', icon: Package },
  { to: '/equipment', label: 'Equipment', icon: Wrench },
  { to: '/attendance', label: 'Attendance', icon: Clock },
  { to: '/progress-reports', label: 'Progress Reports', icon: ClipboardList },
  { to: '/documents', label: 'Documents', icon: FileText },
];

export function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-60 bg-emerald-900 text-slate-100 flex flex-col p-4">
        <div className="flex items-center gap-2 px-2 py-2 text-lg font-semibold tracking-tight">
          <Building2 size={50} className="text-emerald-600" />
            CLOCK IT! Weka Foundation
        </div>

        <nav className="mt-6 flex flex-col gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
            const active = location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  active
                    ? 'bg-emerald-700 text-white'
                    : 'text-emerald-100/80 hover:bg-emerald-800'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-emerald-800 pt-4 px-2">
          <p className="text-sm font-medium truncate">{user?.name}</p>
          <p className="text-xs text-emerald-300 capitalize">{user?.role?.replace('_', ' ')}</p>
          <button
            onClick={logout}
            className="mt-3 flex items-center gap-2 text-xs text-emerald-200/70 hover:text-white"
          >
            <LogOut size={14} />
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}