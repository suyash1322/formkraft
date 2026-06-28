'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';

interface Form {
  id: string;
  title: string;
  createdAt: string;
}

declare global {
  interface Window { Razorpay: any; }
}

export default function DashboardPage() {
  const router = useRouter();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState('FREE');
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetchForms();
    fetchPlan();
  }, []);

  const fetchForms = async () => {
    try {
      const res = await api.get('/forms');
      setForms(res.data);
    } catch {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlan = async () => {
    try {
      const res = await api.get('/auth/me');
      setPlan(res.data.plan);
    } catch {}
  };

  const createForm = async () => {
    try {
      const res = await api.post('/forms', { title: 'Untitled Form', fields: [] });
      router.push(`/forms/${res.data.id}`);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create form');
    }
  };

  const deleteForm = async (id: string) => {
    if (!confirm('Delete this form?')) return;
    await api.delete(`/forms/${id}`);
    setForms(forms.filter(f => f.id !== id));
  };

  const shareForm = (id: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/f/${id}`);
    alert('Link copied!');
  };

  const handleUpgrade = async () => {
    setPaying(true);
    try {
      const orderRes = await api.post('/payment/create-order');
      const order = orderRes.data;
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'FormKraft',
        description: 'Pro Plan — Unlimited Forms',
        order_id: order.id,
        handler: async (response: any) => {
          try {
            await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            setPlan('PRO');
            alert('Upgraded to Pro!');
          } catch {
            alert('Verification failed');
          }
        },
        theme: { color: '#2dd4bf' },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      alert('Failed to initiate payment');
    } finally {
      setPaying(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center">
      <div className="animate-spin w-5 h-5 border-2 border-teal-400 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#111111]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/8 px-6 py-4 flex justify-between items-center bg-[#111111]/90 backdrop-blur-sm">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
          <div className="w-6 h-6 rounded-md bg-teal-400 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-white font-semibold text-sm">FormKraft</span>
        </div>

        <div className="flex items-center gap-3">
          {plan === 'FREE' ? (
            <button
              onClick={handleUpgrade}
              disabled={paying}
              className="text-xs text-zinc-400 border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/5 transition disabled:opacity-50 flex items-center gap-1.5"
            >
              <svg className="w-3 h-3 text-teal-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {paying ? 'Processing...' : 'Upgrade to Pro — ₹499'}
            </button>
          ) : (
            <span className="text-xs text-teal-400 border border-teal-400/20 bg-teal-400/5 px-3 py-1.5 rounded-lg flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Pro
            </span>
          )}
          <button onClick={logout} className="text-xs text-zinc-500 hover:text-white transition">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Total Forms', value: forms.length },
            { label: 'Plan', value: plan === 'PRO' ? 'Pro' : 'Free' },
            { label: 'Forms Left', value: plan === 'PRO' ? '∞' : `${3 - forms.length}` },
          ].map(stat => (
            <div key={stat.label} className="border border-white/8 rounded-xl px-4 py-3">
              <p className="text-zinc-500 text-xs mb-1">{stat.label}</p>
              <p className="text-white font-semibold text-lg">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mb-5">
          <h1 className="text-lg font-semibold text-white">My Forms</h1>
          <button
            onClick={createForm}
            className="bg-teal-400 hover:bg-teal-300 text-[#111111] text-sm font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            New Form
          </button>
        </div>

        {forms.length === 0 ? (
          <div className="border border-dashed border-white/10 rounded-2xl py-20 text-center">
            <div className="w-12 h-12 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-zinc-500 text-sm">No forms yet</p>
            <p className="text-zinc-700 text-xs mt-1">Click "New Form" to get started</p>
          </div>
        ) : (
          <div className="space-y-2">
            {forms.map(form => (
              <div key={form.id} className="border border-white/8 rounded-xl px-5 py-4 flex items-center justify-between hover:border-white/15 transition group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-400/10 border border-teal-400/20 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{form.title}</p>
                    <p className="text-zinc-600 text-xs mt-0.5">{new Date(form.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-70 group-hover:opacity-100 transition">
                  <button onClick={() => router.push(`/forms/${form.id}`)} className="text-xs text-zinc-400 border border-white/8 px-3 py-1.5 rounded-lg hover:bg-white/5 hover:text-white transition">Edit</button>
                  <button onClick={() => shareForm(form.id)} className="text-xs text-zinc-400 border border-white/8 px-3 py-1.5 rounded-lg hover:bg-white/5 hover:text-white transition">Share</button>
                  <button onClick={() => router.push(`/forms/${form.id}/responses`)} className="text-xs text-zinc-400 border border-white/8 px-3 py-1.5 rounded-lg hover:bg-white/5 hover:text-white transition">Responses</button>
                  <button onClick={() => deleteForm(form.id)} className="text-xs text-red-500/60 border border-white/8 px-3 py-1.5 rounded-lg hover:bg-red-500/5 hover:text-red-400 transition">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}