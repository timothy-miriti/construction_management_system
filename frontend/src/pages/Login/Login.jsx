// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { HardHat } from 'lucide-react';
// import {Building2} from 'lucide-react';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [submitting, setSubmitting] = useState(false);

//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSubmitting(true);

//     try {
//       await login(email, password);
//       navigate('/dashboard');
//     } catch (err) {
//       const message = err.response?.data?.error || 'Login failed. Check your credentials.';
//       setError(message);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex bg-slate-50">
//       {/* Left branding panel */}
//       <div className="hidden lg:flex lg:w-1/2 bg-emerald-900 text-slate-100 flex-col justify-between p-12">
//         <div className="flex items-center gap-2 text-lg font-semibold tracking-tight">
//           <Building2 size={50} className="text-emerald-600" />
//           CLOCK IT! Weka Foundation
//         </div>
//         <div className="flex items-center gap-1 text-lg font-semibold tracking-tight">
//           Consruct Your Dream in live
//         </div>



//         <div className="relative">
//           <h1 className="text-3xl font-semibold leading-tight tracking-tight">
//             Every site ~<br />Misingi imara.
//           </h1>
//           <p className="mt-4 text-slate-200 text-sm max-w-xs">
//             Track projects, tasks, budgets, and crews from a single system built for
//             how construction actually runs.
//           </p>
//         </div>
//         <div className="relative text-xs text-slate-200">
//             &copy; {new Date().getFullYear()} CLOCK IT! Weka Foundation. All rights reserved.
//         </div>
//       </div>

//       {/* Right form panel */}
//       <div className="flex-1 flex items-center justify-center p-8">
//         <div className="w-full max-w-sm">
//           <div className="lg:hidden flex items-center gap-2 mb-8 text-slate-900 font-semibold text-lg">
//             <HardHat size={20} className="text-amber-500" />
//             Tujenge
//           </div>

//           <h2 className="text-2xl font-semibold text-slate-900">Sign in</h2>
//           <p className="mt-1 text-sm text-slate-500">
//             Enter your credentials to access your projects.
//           </p>

//           <form onSubmit={handleSubmit} className="mt-8 space-y-4">
//             {error && (
//               <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
//                 {error}
//               </div>
//             )}

//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
//                 Email
//               </label>
//               <input
//                 id="email"
//                 type="email"
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
//                 placeholder="you@example.com"
//               />
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
//                 Password
//               </label>
//               <input
//                 id="password"
//                 type="password"
//                 required
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
//                 placeholder="••••••••"
//               />
//             </div>

//             <button
//                 type="submit"
//                 disabled={submitting}
//                 className="w-full bg-emerald-700 text-white rounded-md py-2.5 text-sm font-medium hover:bg-emerald-800 transition-colors disabled:opacity-50"
//                 >
//                 {submitting ? 'Signing in...' : 'Sign in'}
//                 </button>
//           </form>

//           <p className="mt-6 text-center text-sm text-slate-500">
//             Don't have an account?{' '}
//             <Link to="/register" className="text-slate-900 font-medium hover:underline">
//               Register
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }







import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HardHat } from 'lucide-react';
import {Building2} from 'lucide-react';

import foundation2 from '../../assets/foundation2.jpeg';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.error || 'Login failed. Check your credentials.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left branding panel */}
      {/* <div className="hidden lg:flex lg:w-1/2 bg-emerald-900 text-slate-100 flex-col justify-between p-12"> */}
      <div
        className="hidden lg:flex lg:flex-col lg:w-1/2 relative bg-cover bg-center justify-between p-12 text-slate-100"
        style={{
          backgroundImage: `url(${foundation2})`,
        }}
      >
        {/* Dark overlay so text stays legible over the photo */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

        <div className="relative flex items-center gap-2 text-lg font-semibold tracking-tight drop-shadow-md">
          <Building2 size={50} className="text-emerald-600" />
          CLOCK IT! Weka Foundation
        </div>
        <div className="relative flex items-center gap-1 text-lg font-semibold tracking-tight drop-shadow-md">
          Consruct Your Dream in live
        </div>

        <div className="relative">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight drop-shadow-md">
            Every site ~<br />Misingi imara.
          </h1>
          <p className="mt-4 text-slate-200 text-sm max-w-xs drop-shadow-md">
            A unified platform for managing Kenya's infrastructure and real estate — from Nairobi's affordable housing estates to the Coast's road network and beyond.
          </p>
          <p className="mt-4 text-slate-200 text-sm max-w-xs drop-shadow-md">
            Track projects, tasks, budgets, and crews from a single system built for
            how construction actually runs.
          </p>
        </div>
        <div className="relative text-xs text-slate-200 drop-shadow-md">
            &copy; {new Date().getFullYear()} CLOCK IT! Weka Foundation. All rights reserved.
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8 text-slate-900 font-semibold text-lg">
            <HardHat size={20} className="text-amber-500" />
            Tujenge
          </div>

          <h2 className="text-2xl font-semibold text-slate-900">Sign in</h2>
          <p className="mt-1 text-sm text-slate-500">
            Enter your credentials to access your projects.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                placeholder="••••••••"
              />
            </div>

            <button
                type="submit"
                disabled={submitting}
                className="w-full bg-emerald-700 text-white rounded-md py-2.5 text-sm font-medium hover:bg-emerald-800 transition-colors disabled:opacity-50"
                >
                {submitting ? 'Signing in...' : 'Sign in'}
                </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-slate-900 font-medium hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}