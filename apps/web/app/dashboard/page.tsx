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
            alert('🎉 Upgraded to Pro!');
          } catch {
            alert('Payment verification failed');
          }
        },
        theme: { color: '#14b8a6' },
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
    <div className="min-h-screen bg-[#0a0f0f] flex items-center justify-center text-white">Loading...</div>
  );

  return (
    <div className="min-h-screen bg-[#0a0f0f]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Navbar */}
      <nav className="relative border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
          <div className="w-6 h-6 rounded-md bg-teal-400 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-[#0a0f0f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="bg-teal-400 hover:bg-teal-300 text-[#0a0f0f] text-xs font-semibold px-3 py-1.5 rounded-lg transition-all active:scale-95 disabled:opacity-50"
            >
              {paying ? 'Processing...' : '⚡ Upgrade to Pro — ₹499'}
            </button>
          ) : (
            <span className="text-xs bg-teal-400/10 text-teal-400 border border-teal-400/20 px-3 py-1.5 rounded-lg font-medium">
              ✓ Pro Plan
            </span>
          )}
          <button onClick={logout} className="text-xs text-gray-500 hover:text-gray-300 transition">Logout</button>
        </div>
      </nav>

      <div className="relative max-w-4xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">My Forms</h2>
            <p className="text-gray-500 text-sm mt-1">
              {plan === 'FREE' ? `${forms.length}/3 forms used` : 'Unlimited forms ✓'}
            </p>
          </div>
          <button
            onClick={createForm}
            className="bg-teal-400 hover:bg-teal-300 text-[#0a0f0f] px-4 py-2 rounded-xl font-semibold text-sm transition-all active:scale-95"
          >
            + New Form
          </button>
        </div>

        {forms.length === 0 ? (
          <div className="text-center py-20 border border-white/5 rounded-2xl">
            <p className="text-gray-400">No forms yet</p>
            <p className="text-gray-600 text-sm mt-1">Click "New Form" to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {forms.map(form => (
              <div key={form.id} className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:border-teal-500/30 transition-all">
                <h3 className="font-semibold text-white mb-1">{form.title}</h3>
                <p className="text-xs text-gray-500 mb-4">{new Date(form.createdAt).toLocaleDateString()}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/forms/${form.id}`)}
                    className="flex-1 bg-teal-400/10 text-teal-400 py-2 rounded-lg text-sm font-medium hover:bg-teal-400/20 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteForm(form.id)}
                    className="flex-1 bg-red-400/10 text-red-400 py-2 rounded-lg text-sm font-medium hover:bg-red-400/20 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}