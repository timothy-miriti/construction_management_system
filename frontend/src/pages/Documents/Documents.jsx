import { useEffect, useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Modal } from '../../components/Modal';
import { documentService } from '../../services/documentService';
import { projectService } from '../../services/projectService';
import { useAuth } from '../../context/AuthContext';
import { Plus, ExternalLink } from 'lucide-react';

const EMPTY_FORM = { project_id: '', uploaded_by: '', name: '', file_url: '', doc_type: 'other' };

export default function Documents() {
  const { user } = useAuth();
  const canManage = ['admin', 'project_manager', 'engineer'].includes(user?.role);

  const [documents, setDocuments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectFilter, setProjectFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitError, setSubmitError] = useState('');

  function load() {
    setLoading(true);
    Promise.all([documentService.list(projectFilter || undefined), projectService.list()])
      .then(([d, p]) => { setDocuments(d); setProjects(p); })
      .catch(() => setError('Could not load documents.'))
      .finally(() => setLoading(false));
  }

  useEffect(load, [projectFilter]);

  async function handleCreate(e) {
    e.preventDefault();
    setSubmitError('');
    try {
      await documentService.create({
        ...form,
        project_id: Number(form.project_id),
        uploaded_by: Number(form.uploaded_by),
      });
      setShowModal(false);
      setForm(EMPTY_FORM);
      load();
    } catch (err) {
      setSubmitError(err.response?.data?.error || 'Could not add document.');
    }
  }

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Documents</h1>
          <p className="text-slate-500 text-sm">Contracts, blueprints, and permits.</p>
        </div>
        {canManage && (
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium rounded-md px-4 py-2">
            <Plus size={16} /> Add document
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
                <th className="text-left px-4 py-3 font-medium">Type</th>
                <th className="text-left px-4 py-3 font-medium">Uploaded by</th>
                <th className="text-left px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {documents.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{d.name}</td>
                  <td className="px-4 py-3 text-slate-500 capitalize">{d.doc_type}</td>
                  <td className="px-4 py-3 text-slate-500">{d.uploader_name}</td>
                  <td className="px-4 py-3 text-right">
                    <a href={d.file_url} target="_blank" rel="noreferrer" className="text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 text-xs">
                      Open <ExternalLink size={12} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {documents.length === 0 && <p className="text-sm text-slate-400 text-center py-10">No documents yet.</p>}
        </div>
      )}

      {showModal && (
        <Modal title="Add document" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreate} className="space-y-3">
            {submitError && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">{submitError}</div>}
            <select required value={form.project_id} onChange={(e) => setForm({ ...form, project_id: e.target.value })} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
              <option value="">Select project…</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <input required type="number" placeholder="Uploaded by (user ID)" value={form.uploaded_by} onChange={(e) => setForm({ ...form, uploaded_by: e.target.value })} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            <input required placeholder="Document name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            <input required placeholder="File URL" value={form.file_url} onChange={(e) => setForm({ ...form, file_url: e.target.value })} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            <select value={form.doc_type} onChange={(e) => setForm({ ...form, doc_type: e.target.value })} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
              <option value="contract">Contract</option>
              <option value="blueprint">Blueprint</option>
              <option value="permit">Permit</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white rounded-md py-2 text-sm font-medium">Add document</button>
          </form>
        </Modal>
      )}
    </AppLayout>
  );
}