import { useEffect, useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Modal } from '../../components/Modal';
import { taskService } from '../../services/taskService';
import { projectService } from '../../services/projectService';
import { useAuth } from '../../context/AuthContext';
import { Plus } from 'lucide-react';

const EMPTY_FORM = { project_id: '', title: '', start_date: '', end_date: '', depends_on: '' };

const STATUS_STYLES = {
  not_started: 'bg-slate-100 text-slate-600',
  in_progress: 'bg-emerald-50 text-emerald-700',
  done: 'bg-emerald-100 text-emerald-800',
};

export default function Tasks() {
  const { user } = useAuth();
  const canManage = ['admin', 'project_manager'].includes(user?.role);

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectFilter, setProjectFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitError, setSubmitError] = useState('');

  function load() {
    setLoading(true);
    Promise.all([taskService.list(projectFilter || undefined), projectService.list()])
      .then(([t, p]) => {
        setTasks(t);
        setProjects(p);
      })
      .catch(() => setError('Could not load tasks.'))
      .finally(() => setLoading(false));
  }

  useEffect(load, [projectFilter]);

  async function handleCreate(e) {
    e.preventDefault();
    setSubmitError('');
    try {
      await taskService.create({
        ...form,
        project_id: Number(form.project_id),
        depends_on: form.depends_on ? Number(form.depends_on) : null,
      });
      setShowModal(false);
      setForm(EMPTY_FORM);
      load();
    } catch (err) {
      setSubmitError(err.response?.data?.error || 'Could not create task.');
    }
  }

  async function toggleStatus(task) {
    const next =
      task.status === 'not_started' ? 'in_progress' : task.status === 'in_progress' ? 'done' : 'not_started';
    await taskService.update(task.id, { status: next });
    load();
  }

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Tasks</h1>
          <p className="text-slate-500 text-sm">Work items across your projects.</p>
        </div>
        {canManage && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium rounded-md px-4 py-2"
          >
            <Plus size={16} />
            New task
          </button>
        )}
      </div>

      <div className="mb-4">
        <select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">All projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2 mb-4">
          {error}
        </div>
      )}

      {loading && <p className="text-slate-400 text-sm">Loading...</p>}

      {!loading && (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium">Dependency</th>
                <th className="text-left px-4 py-3 font-medium">Dates</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{t.title}</td>
                  <td className="px-4 py-3 text-slate-500">{t.depends_on_title || '—'}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {t.start_date || '—'} → {t.end_date || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => canManage && toggleStatus(t)}
                      disabled={!canManage}
                      className={`text-xs px-2 py-1 rounded-full capitalize ${STATUS_STYLES[t.status]} ${
                        canManage ? 'hover:opacity-75 cursor-pointer' : 'cursor-default'
                      }`}
                    >
                      {t.status.replace('_', ' ')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {tasks.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-10">No tasks yet.</p>
          )}
        </div>
      )}

      {showModal && (
        <Modal title="New task" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreate} className="space-y-3">
            {submitError && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {submitError}
              </div>
            )}
            <select
              required
              value={form.project_id}
              onChange={(e) => setForm({ ...form, project_id: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">Select project…</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <input
              required
              placeholder="Task title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
            <div className="flex gap-3">
              <input
                type="date"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                type="date"
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white rounded-md py-2 text-sm font-medium"
            >
              Create task
            </button>
          </form>
        </Modal>
      )}
    </AppLayout>
  );
}