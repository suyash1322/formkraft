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
    <div className="min-h-screen bg-[#111111] flex items-center justify-center">
      <div className="animate-spin w-5 h-5 border-2 border-teal-400 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#111111]">
      <nav className="sticky top-0 z-50 border-b border-white/8 px-6 py-4 flex justify-between items-center bg-[#111111]/90 backdrop-blur-sm">
        <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Dashboard
        </button>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-teal-400 flex items-center justify-center">
            <svg className="w-3 h-3 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-white font-semibold text-sm">FormKraft</span>
        </div>
        <div className="w-20" />
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-bold text-white">Responses</h2>
            <p className="text-zinc-500 text-sm mt-0.5">{submissions.length} submission{submissions.length !== 1 ? 's' : ''} total</p>
          </div>
          {submissions.length > 0 && (
            <div className="border border-white/8 rounded-xl px-4 py-2 text-center">
              <p className="text-teal-400 font-bold text-xl">{submissions.length}</p>
              <p className="text-zinc-600 text-xs">responses</p>
            </div>
          )}
        </div>

        {submissions.length === 0 ? (
          <div className="border border-dashed border-white/10 rounded-2xl py-20 text-center">
            <div className="w-12 h-12 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-zinc-500 text-sm">No responses yet</p>
            <p className="text-zinc-700 text-xs mt-1">Share your form to start collecting responses</p>
          </div>
        ) : (
          <div className="space-y-3">
            {submissions.map((sub, index) => (
              <div key={sub.id} className="border border-white/8 rounded-2xl p-5 hover:border-white/15 transition">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-teal-400/10 border border-teal-400/20 rounded-lg flex items-center justify-center">
                      <span className="text-teal-400 text-xs font-bold">{submissions.length - index}</span>
                    </div>
                    <span className="text-white text-sm font-medium">Response #{submissions.length - index}</span>
                  </div>
                  <span className="text-zinc-600 text-xs">{new Date(sub.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="space-y-2">
                  {Object.entries(sub.data).map(([key, value]) => (
                    <div key={key} className="flex flex-col gap-1">
                      <span className="text-zinc-500 text-xs uppercase tracking-wider">{key}</span>
                      <span className="text-white text-sm bg-white/5 border border-white/5 px-3 py-2 rounded-lg">
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