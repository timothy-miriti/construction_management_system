import { useEffect, useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Modal } from '../../components/Modal';
import { equipmentService } from '../../services/equipmentService';
import { projectService } from '../../services/projectService';
import { useAuth } from '../../context/AuthContext';
import { Plus } from 'lucide-react';

const EMPTY_FORM = { project_id: '', name: '', status: 'available' };
const STATUS_STYLES = {
  available: 'bg-emerald-50 text-emerald-700',
  in_use: 'bg-amber-50 text-amber-700',
  maintenance: 'bg-red-50 text-red-700',
};

export default function Equipment() {
  const { user } = useAuth();
  const canManage = ['admin', 'project_manager'].includes(user?.role);

  const [items, setItems] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectFilter, setProjectFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitError, setSubmitError] = useState('');

  function load() {
    setLoading(true);
    Promise.all([equipmentService.list(projectFilter || undefined), projectService.list()])
      .then(([e, p]) => { setItems(e); setProjects(p); })
      .catch(() => setError('Could not load equipment.'))
      .finally(() => setLoading(false));
  }

  useEffect(load, [projectFilter]);

  async function handleCreate(e) {
    e.preventDefault();
    setSubmitError('');
    try {
      await equipmentService.create({ ...form, project_id: Number(form.project_id) });
      setShowModal(false);
      setForm(EMPTY_FORM);
      load();
    } catch (err) {
      setSubmitError(err.response?.data?.error || 'Could not create equipment.');
    }
  }

  async function cycleStatus(item) {
    const order = ['available', 'in_use', 'maintenance'];
    const next = order[(order.indexOf(item.status) + 1) % order.length];
    await equipmentService.update(item.id, { status: next });
    load();
  }

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Equipment</h1>
          <p className="text-slate-500 text-sm">Machinery and its current status.</p>
        </div>
        {canManage && (
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium rounded-md px-4 py-2">
            <Plus size={16} /> New equipment
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
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((it) => (
                <tr key={it.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{it.name}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => canManage && cycleStatus(it)} disabled={!canManage}
                      className={`text-xs px-2 py-1 rounded-full capitalize ${STATUS_STYLES[it.status]} ${canManage ? 'hover:opacity-75 cursor-pointer' : 'cursor-default'}`}>
                      {it.status.replace('_', ' ')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <p className="text-sm text-slate-400 text-center py-10">No equipment yet.</p>}
        </div>
      )}

      {showModal && (
        <Modal title="New equipment" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreate} className="space-y-3">
            {submitError && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">{submitError}</div>}
            <select required value={form.project_id} onChange={(e) => setForm({ ...form, project_id: e.target.value })} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
              <option value="">Select project…</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <input required placeholder="Equipment name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white rounded-md py-2 text-sm font-medium">Create equipment</button>
          </form>
        </Modal>
      )}
    </AppLayout>
  );
}