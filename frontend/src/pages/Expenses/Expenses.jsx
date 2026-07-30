import { useEffect, useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Modal } from '../../components/Modal';
import { expenseService } from '../../services/expenseService';
import { projectService } from '../../services/projectService';
import { useAuth } from '../../context/AuthContext';
import { Plus } from 'lucide-react';

const EMPTY_FORM = { project_id: '', category: '', planned_amount: '', actual_amount: '', date: '' };

export default function Expenses() {
  const { user } = useAuth();
  const canManage = ['admin', 'project_manager'].includes(user?.role);

  const [expenses, setExpenses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectFilter, setProjectFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitError, setSubmitError] = useState('');

  function load() {
    setLoading(true);
    Promise.all([expenseService.list(projectFilter || undefined), projectService.list()])
      .then(([e, p]) => { setExpenses(e); setProjects(p); })
      .catch(() => setError('Could not load expenses.'))
      .finally(() => setLoading(false));
  }

  useEffect(load, [projectFilter]);

  async function handleCreate(e) {
    e.preventDefault();
    setSubmitError('');
    try {
      await expenseService.create({
        ...form,
        project_id: Number(form.project_id),
        planned_amount: form.planned_amount ? Number(form.planned_amount) : 0,
        actual_amount: form.actual_amount ? Number(form.actual_amount) : 0,
      });
      setShowModal(false);
      setForm(EMPTY_FORM);
      load();
    } catch (err) {
      setSubmitError(err.response?.data?.error || 'Could not create expense.');
    }
  }

  const totalPlanned = expenses.reduce((sum, x) => sum + (x.planned_amount || 0), 0);
  const totalActual = expenses.reduce((sum, x) => sum + (x.actual_amount || 0), 0);

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Expenses</h1>
          <p className="text-slate-500 text-sm">Planned vs actual spend by category.</p>
        </div>
        {canManage && (
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium rounded-md px-4 py-2">
            <Plus size={16} /> New expense
          </button>
        )}
      </div>

      <div className="flex gap-4 mb-4">
        <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
          <option value="">All projects</option>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <div className="text-sm text-slate-500 flex items-center gap-4">
          <span>Planned: <strong className="text-slate-900">{totalPlanned.toLocaleString()}</strong></span>
          <span>Actual: <strong className="text-slate-900">{totalActual.toLocaleString()}</strong></span>
        </div>
      </div>

      {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2 mb-4">{error}</div>}
      {loading && <p className="text-slate-400 text-sm">Loading...</p>}

      {!loading && (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Category</th>
                <th className="text-left px-4 py-3 font-medium">Planned</th>
                <th className="text-left px-4 py-3 font-medium">Actual</th>
                <th className="text-left px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map((x) => (
                <tr key={x.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900 capitalize">{x.category}</td>
                  <td className="px-4 py-3 text-slate-600">{x.planned_amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-600">{x.actual_amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{x.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {expenses.length === 0 && <p className="text-sm text-slate-400 text-center py-10">No expenses yet.</p>}
        </div>
      )}

      {showModal && (
        <Modal title="New expense" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreate} className="space-y-3">
            {submitError && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">{submitError}</div>}
            <select required value={form.project_id} onChange={(e) => setForm({ ...form, project_id: e.target.value })} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
              <option value="">Select project…</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <input required placeholder="Category (e.g. materials, labor)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            <div className="flex gap-3">
              <input type="number" placeholder="Planned amount" value={form.planned_amount} onChange={(e) => setForm({ ...form, planned_amount: e.target.value })} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
              <input type="number" placeholder="Actual amount" value={form.actual_amount} onChange={(e) => setForm({ ...form, actual_amount: e.target.value })} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            </div>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white rounded-md py-2 text-sm font-medium">Create expense</button>
          </form>
        </Modal>
      )}
    </AppLayout>
  );
}