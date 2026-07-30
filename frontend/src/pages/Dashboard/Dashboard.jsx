import { useEffect, useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { dashboardService } from '../../services/dashboardService';
import { FolderKanban, CheckCircle2, DollarSign, ListTodo } from 'lucide-react';

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5">
      <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
        <Icon size={16} />
        {label}
      </div>
      <div className="text-2xl font-semibold text-slate-900">{value}</div>
      {sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    dashboardService
      .getSummary()
      .then(setSummary)
      .catch(() => setError('Could not load dashboard data.'));
  }, []);

  return (
    <AppLayout>
      <h1 className="text-2xl font-semibold text-slate-900 mb-1">Overview</h1>
      <p className="text-slate-500 text-sm mb-6">
        A summary across all active projects.
      </p>

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2 mb-4">
          {error}
        </div>
      )}

      {!summary && !error && <p className="text-slate-400 text-sm">Loading...</p>}

      {summary && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={FolderKanban}
              label="Projects"
              value={summary.total_projects}
              sub={`${summary.active_projects} active`}
            />
            <StatCard
              icon={CheckCircle2}
              label="Task completion"
              value={`${summary.task_completion_rate}%`}
              sub={`${summary.completed_tasks} of ${summary.total_tasks} done`}
            />
            <StatCard
              icon={DollarSign}
              label="Total budget"
              value={summary.total_budget.toLocaleString()}
              sub="across all projects"
            />
            <StatCard
              icon={ListTodo}
              label="Actual spend"
              value={summary.total_actual_expenses.toLocaleString()}
              sub={`planned: ${summary.total_planned_expenses.toLocaleString()}`}
            />
          </div>

          <h2 className="text-lg font-semibold text-slate-900 mb-3">Recent projects</h2>
          <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100">
            {summary.recent_projects.map((p) => (
              <div key={p.id} className="flex justify-between items-center px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">{p.name}</p>
                  <p className="text-xs text-slate-400">Managed by {p.manager_name}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 capitalize">
                  {p.status.replace('_', ' ')}
                </span>
              </div>
            ))}
            {summary.recent_projects.length === 0 && (
              <p className="text-sm text-slate-400 px-4 py-6 text-center">No projects yet.</p>
            )}
          </div>
        </>
      )}
    </AppLayout>
  );
}