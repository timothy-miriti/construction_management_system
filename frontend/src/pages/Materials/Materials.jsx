import { useEffect, useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Modal } from '../../components/Modal';
import { materialService } from '../../services/materialService';
import { projectService } from '../../services/projectService';
import { useAuth } from '../../context/AuthContext';
import { Plus } from 'lucide-react';

const EMPTY_FORM = { project_id: '', name: '', quantity: '', unit_cost: '' };

export default function Materials() {
  const { user } = useAuth();
  const canManage = ['admin', 'project_manager'].includes(user?.role);

  const [materials, setMaterials] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectFilter, setProjectFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitError, setSubmitError] = useState('');

  function load() {
    setLoading(true);
    Promise.all([materialService.list(projectFilter || undefined), projectService.list()])
      .then(([m, p]) => { setMaterials(m); setProjects(p); })
      .catch(() => setError('Could not load materials.'))
      .finally(() => setLoading(false));
  }

  useEffect(load, [projectFilter]);

  async function handleCreate(e) {
    e.preventDefault();
    setSubmitError('');
    try {
      await materialService.create({
        ...form,
        project_id: Number(form.project_id),
        quantity: form.quantity ? Number(form.quantity) : 0,
        unit_cost: form.unit_cost ? Number(form.unit_cost) : 0,
      });
      setShowModal(false);
      setForm(EMPTY_FORM);
      load();
    } catch (err) {
      setSubmitError(err.response?.data?.error || 'Could not create material.');
    }
  }

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Materials</h1>
          <p className="text-slate-500 text-sm">Stock and cost per project.</p>
        </div>
        {canManage && (
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium rounded-md px-4 py-2">
            <Plus size={16} /> New material
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
                <th className="text-left px-4 py-3 font-medium">Quantity</th>
                <th className="text-left px-4 py-3 font-medium">Unit cost</th>
                <th className="text-left px-4 py-3 font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {materials.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{m.name}</td>
                  <td className="px-4 py-3 text-slate-600">{m.quantity}</td>
                  <td className="px-4 py-3 text-slate-600">{m.unit_cost.toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-900 font-medium">{m.total_cost.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {materials.length === 0 && <p className="text-sm text-slate-400 text-center py-10">No materials yet.</p>}
        </div>
      )}

      {showModal && (
        <Modal title="New material" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreate} className="space-y-3">
            {submitError && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">{submitError}</div>}
            <select required value={form.project_id} onChange={(e) => setForm({ ...form, project_id: e.target.value })} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
              <option value="">Select project…</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <input required placeholder="Material name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            <div className="flex gap-3">
              <input type="number" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
              <input type="number" placeholder="Unit cost" value={form.unit_cost} onChange={(e) => setForm({ ...form, unit_cost: e.target.value })} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            </div>
            <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white rounded-md py-2 text-sm font-medium">Create material</button>
          </form>
        </Modal>
      )}
    </AppLayout>
  );
}