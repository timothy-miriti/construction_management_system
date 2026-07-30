import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { HardHat } from 'lucide-react';

const ROLES = ['admin', 'project_manager', 'engineer', 'contractor', 'worker', 'client'];

const EMPTY_FORM = { name: '', email: '', password: '', role: 'worker', phone: '' };

export default function Register() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await authService.register(form);
      navigate('/login');
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.errors || 'Registration failed.';
      setError(typeof message === 'string' ? message : JSON.stringify(message));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <div className="hidden lg:flex lg:w-1/2 bg-emerald-900 text-slate-100 flex-col justify-between p-12">
        <div className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <HardHat size={22} className="text-green-300" />
          CLOCK IT! Weka Foundation
        </div>
        <div>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight">
            Join the crew,<br />build the record.
          </h1>
          <p className="mt-4 text-slate-400 text-sm max-w-xs">
            Create an account to start tracking your work across every project.
          </p>
        </div>
        <div className="text-xs text-slate-500">
          © {new Date().getFullYear()} CLOCK IT! Weka Foundation. All rights reserved.
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8 text-slate-900 font-semibold text-lg">
            <HardHat size={20} className="text-green-500" />
            CLOCK IT!
          </div>

          <h2 className="text-2xl font-semibold text-slate-900">Create account</h2>
          <p className="mt-1 text-sm text-slate-500">Register to access the system.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                required
                type="password"
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 capitalize"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r} className="capitalize">{r.replace('_', ' ')}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone (optional)</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-700 text-white rounded-md py-2.5 text-sm font-medium hover:bg-emerald-800 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-700 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}