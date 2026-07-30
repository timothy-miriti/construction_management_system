import { useEffect, useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Modal } from '../../components/Modal';
import { progressReportService } from '../../services/progressReportService';
import { projectService } from '../../services/projectService';
import { useAuth } from '../../context/AuthContext';
import { Plus } from 'lucide-react';

const EMPTY_FORM = { project_id: '', submitted_by: '', description: '', completion_percentage: '', photo_url: '' };

export default function ProgressReports() {
  const { user } = useAuth();
  const canLog = ['admin', 'project_manager', 'engineer', 'contractor'].includes(user?.role);

  const [reports, setReports] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectFilter, setProjectFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitError, setSubmitError] = useState('');

  function load() {
    setLoading(true);
    Promise.all([progressReportService.list(projectFilter || undefined), projectService.list()])
      .then(([r, p]) => { setReports(r); setProjects(p); })
      .catch(() => setError('Could not load progress reports.'))
      .finally(() => setLoading(false));
  }

  useEffect(load, [projectFilter]);

  async function handleCreate(e) {
    e.preventDefault();
    setSubmitError('');
    try {
      await progressReportService.create({
        ...form,
        project_id: Number(form.project_id),
        submitted_by: Number(form.submitted_by),
        completion_percentage: form.completion_percentage ? Number(form.completion_percentage) : 0,
      });
      setShowModal(false);
      setForm(EMPTY_FORM);
      load();
    } catch (err) {
      setSubmitError(err.response?.data?.error || 'Could not create report.');
    }
  }

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Progress Reports</h1>
          <p className="text-slate-500 text-sm">Site updates and completion tracking.</p>
        </div>
        {canLog && (
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium rounded-md px-4 py-2">
            <Plus size={16} /> New report
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
        <div className="space-y-3">
          {reports.map((r) => (
            <div key={r.id} className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-900">{r.submitter_name}</p>
                  <p className="text-xs text-slate-400">{r.date}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">
                  {r.completion_percentage}% complete
                </span>
              </div>
              {r.description && <p className="text-sm text-slate-600 mt-2">{r.description}</p>}
              {r.photo_url && (
                <img
                  src={r.photo_url}
                  alt="Site progress"
                  className="mt-3 rounded-md border border-slate-200 max-h-64 object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
            </div>
          ))}
          
          {reports.length === 0 && <p className="text-sm text-slate-400 text-center py-10">No reports yet.</p>}
        </div>
      )}

      {showModal && (
        <Modal title="New progress report" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreate} className="space-y-3">
            {submitError && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">{submitError}</div>}
            <select required value={form.project_id} onChange={(e) => setForm({ ...form, project_id: e.target.value })} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
              <option value="">Select project…</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <input required type="number" placeholder="Submitted by (user ID)" value={form.submitted_by} onChange={(e) => setForm({ ...form, submitted_by: e.target.value })} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" rows={3} />
            <input type="number" min="0" max="100" placeholder="Completion %" value={form.completion_percentage} onChange={(e) => setForm({ ...form, completion_percentage: e.target.value })} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            <input placeholder="Photo URL (optional)" value={form.photo_url} onChange={(e) => setForm({ ...form, photo_url: e.target.value })} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white rounded-md py-2 text-sm font-medium">Submit report</button>
          </form>
        </Modal>
      )}
    </AppLayout>
  );
}