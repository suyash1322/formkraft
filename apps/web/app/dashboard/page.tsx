'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';

interface Form {
  id: string;
  title: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetchForms();
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

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">FormKraft</h1>
        <button onClick={logout} className="text-sm text-gray-600 hover:text-red-500">Logout</button>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Forms</h2>
          <button
            onClick={createForm}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
          >
            + New Form
          </button>
        </div>

        {forms.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">Koi form nahi hai abhi</p>
            <p className="text-sm mt-2">New Form button se banao!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {forms.map(form => (
              <div key={form.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                <h3 className="font-semibold text-gray-800 mb-1">{form.title}</h3>
                <p className="text-xs text-gray-400 mb-4">{new Date(form.createdAt).toLocaleDateString()}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/forms/${form.id}`)}
                    className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg text-sm font-medium hover:bg-blue-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteForm(form.id)}
                    className="flex-1 bg-red-50 text-red-500 py-2 rounded-lg text-sm font-medium hover:bg-red-100"
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