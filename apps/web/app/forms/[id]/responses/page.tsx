'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../../lib/api';

interface Submission {
  id: string;
  data: Record<string, any>;
  createdAt: string;
}

export default function ResponsesPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchResponses(); }, []);

  const fetchResponses = async () => {
    try {
      const res = await api.get(`/submissions/${id}/responses`);
      setSubmissions(res.data);
    } catch {
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a0f0f] flex items-center justify-center">
      <div className="animate-spin w-6 h-6 border-2 border-teal-400 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0f0f]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <nav className="relative border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Dashboard
        </button>
        <span className="text-white font-semibold text-sm">Responses</span>
        <div className="w-20" />
      </nav>

      <div className="relative max-w-3xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Responses</h2>
            <p className="text-gray-500 text-sm mt-1">{submissions.length} submission{submissions.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {submissions.length === 0 ? (
          <div className="text-center py-20 border border-white/5 rounded-2xl">
            <p className="text-gray-400">No responses yet</p>
            <p className="text-gray-600 text-sm mt-1">Share your form to get responses</p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((sub, index) => (
              <div key={sub.id} className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs text-teal-400 font-medium">Response #{submissions.length - index}</span>
                  <span className="text-xs text-gray-500">{new Date(sub.createdAt).toLocaleString()}</span>
                </div>
                <div className="space-y-3">
                  {Object.entries(sub.data).map(([key, value]) => (
                    <div key={key} className="flex flex-col gap-1">
                      <span className="text-xs text-gray-500 uppercase tracking-wider">{key}</span>
                      <span className="text-white text-sm bg-white/5 px-3 py-2 rounded-lg">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}