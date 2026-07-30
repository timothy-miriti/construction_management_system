import { useEffect, useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Modal } from '../../components/Modal';
import { attendanceService } from '../../services/attendanceService';
import { projectService } from '../../services/projectService';
import { useAuth } from '../../context/AuthContext';
import { Plus } from 'lucide-react';

const EMPTY_FORM = { project_id: '', worker_id: '', date: '', hours_worked: '' };

export default function Attendance() {
  const { user } = useAuth();
  const canLog = ['admin', 'project_manager', 'contractor', 'worker'].includes(user?.role);

  const [records, setRecords] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectFilter, setProjectFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitError, setSubmitError] = useState('');

  function load() {
    setLoading(true);
    Promise.all([attendanceService.list(projectFilter || undefined), projectService.list()])
      .then(([a, p]) => { setRecords(a); setProjects(p); })
      .catch(() => setError('Could not load attendance.'))
      .finally(() => setLoading(false));
  }

  useEffect(load, [projectFilter]);

  async function handleCreate(e) {
    e.preventDefault();
    setSubmitError('');
    try {
      await attendanceService.create({
        ...form,
        project_id: Number(form.project_id),
        worker_id: Number(form.worker_id),
        hours_worked: Number(form.hours_worked),
      });
      setShowModal(false);
      setForm(EMPTY_FORM);
      load();
    } catch (err) {
      setSubmitError(err.response?.data?.error || 'Could not log attendance.');
    }
  }

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Attendance</h1>
          <p className="text-slate-500 text-sm">Hours logged by workers per project.</p>
        </div>
        {canLog && (
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium rounded-md px-4 py-2">
            <Plus size={16} /> Log attendance
          </button>
        )}
      </div>

      <div className="mb-4">
        <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
          <option value="">All projects</option>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2 mb-4">{error}</div>}
      {loading && <p className="text-slate-400 text-sm">Loading...</p>}

      {!loading && (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Worker</th>
                <th className="text-left px-4 py-3 font-medium">Date</th>
                <th className="text-left px-4 py-3 font-medium">Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{r.worker_name}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{r.date}</td>
                  <td className="px-4 py-3 text-slate-600">{r.hours_worked}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {records.length === 0 && <p className="text-sm text-slate-400 text-center py-10">No attendance logged yet.</p>}
        </div>
      )}

      {showModal && (
        <Modal title="Log attendance" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreate} className="space-y-3">
            {submitError && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">{submitError}</div>}
            <select required value={form.project_id} onChange={(e) => setForm({ ...form, project_id: e.target.value })} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
              <option value="">Select project…</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <input required type="number" placeholder="Worker user ID" value={form.worker_id} onChange={(e) => setForm({ ...form, worker_id: e.target.value })} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            <div className="flex gap-3">
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
              <input required type="number" step="0.5" max="24" placeholder="Hours worked" value={form.hours_worked} onChange={(e) => setForm({ ...form, hours_worked: e.target.value })} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            </div>
            <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white rounded-md py-2 text-sm font-medium">Log attendance</button>
          </form>
        </Modal>
      )}
    </AppLayout>
  );
}