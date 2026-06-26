'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import api from '../../lib/api';

// Register Validation Schema
const registerSchema = z.object({
  email: z.string().trim().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
});

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Error states
  const [error, setError] = useState(''); 
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({}); 
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError('');
    setFieldErrors({});

    // Client-side validation
    const validation = registerSchema.safeParse({ email, password });
    
    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      setFieldErrors({
        email: errors.email?.[0],
        password: errors.password?.[0],
      });
      return; 
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/register', { email, password });
      localStorage.setItem('token', res.data.token);
      router.push('/dashboard');
    } catch {
      setError('Registration failed. Email already exists.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f0f] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-sm">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-7 h-7 rounded-lg bg-teal-400 flex items-center justify-center">
              <svg className="w-4 h-4 text-[#0a0f0f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-white font-semibold text-sm tracking-wide">FormKraft</span>
          </div>
          <h1 className="text-3xl font-bold text-white leading-tight">
            Create your<br />
            <span className="text-teal-400">account.</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2">Start building forms for free.</p>
        </div>

        <div className="space-y-4">
          {error && (
            <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 px-3 py-2 rounded-lg">{error}</p>
          )}
          
          <div>
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
              className={`mt-2 w-full bg-white/5 border text-white placeholder-gray-600 px-4 py-3 rounded-xl text-sm outline-none transition-all ${
                fieldErrors.email 
                  ? 'border-red-400/50 focus:border-red-400' 
                  : 'border-white/10 focus:border-teal-500/60 focus:bg-teal-500/5'
              }`}
            />
            {fieldErrors.email && (
              <p className="text-red-400 text-xs mt-1.5 ml-1">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
              className={`mt-2 w-full bg-white/5 border text-white placeholder-gray-600 px-4 py-3 rounded-xl text-sm outline-none transition-all ${
                fieldErrors.password 
                  ? 'border-red-400/50 focus:border-red-400' 
                  : 'border-white/10 focus:border-teal-500/60 focus:bg-teal-500/5'
              }`}
            />
            {fieldErrors.password && (
              <p className="text-red-400 text-xs mt-1.5 ml-1">{fieldErrors.password}</p>
            )}
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full mt-2 bg-teal-400 hover:bg-teal-300 text-[#0a0f0f] font-semibold py-3 rounded-xl text-sm transition-all active:scale-[0.98] disabled:opacity-40"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Creating account...
              </span>
            ) : 'Get started'}
          </button>
        </div>

        <p className="text-gray-600 text-xs text-center mt-8">
          Already have an account?{' '}
          <a href="/login" className="text-teal-400 hover:text-teal-300 transition">Sign in</a>
        </p>
      </div>
    </div>
  );
}