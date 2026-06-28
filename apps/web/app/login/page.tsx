'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      router.push('/dashboard');
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex flex-col">
      <nav className="border-b border-white/8 px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-400 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-white font-semibold text-sm">FormKraft</span>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-zinc-500 text-sm mb-8">Sign in to your account.</p>

          {error && (
            <p className="text-red-400 text-xs border border-red-400/20 bg-red-400/5 px-3 py-2 rounded-lg mb-5">
              {error}
            </p>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 text-white placeholder-zinc-600 px-4 py-3 rounded-xl text-sm outline-none focus:border-white/25 transition"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 text-white placeholder-zinc-600 px-4 py-3 rounded-xl text-sm outline-none focus:border-white/25 transition"
              />
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full mt-5 bg-teal-400 hover:bg-teal-300 text-[#111111] font-semibold py-3 rounded-xl text-sm transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <p className="text-center text-xs text-zinc-600 mt-5">
            No account?{' '}
            <a href="/register" className="text-zinc-400 hover:text-white transition">Create one</a>
          </p>
        </div>
      </div>
    </div>
  );
}