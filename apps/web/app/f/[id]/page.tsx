'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

interface Field {
  id: string;
  type: 'text' | 'mcq' | 'rating' | 'file';
  label: string;
  options?: string[];
  required?: boolean;
  conditional?: { showIfFieldId: string; showIfValue: string; };
}

interface Form {
  id: string;
  title: string;
  fields: Field[];
}

export default function PublicFormPage() {
  const params = useParams();
  const id = params.id as string;

  const [form, setForm] = useState<Form | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchForm(); }, []);

  const fetchForm = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/submissions/${id}/public`);
      setForm(res.data);
    } catch {
      setError('Form not found');
    } finally {
      setLoading(false);
    }
  };

  const shouldShowField = (field: Field): boolean => {
    if (!field.conditional?.showIfFieldId) return true;
    return answers[field.conditional.showIfFieldId] === field.conditional.showIfValue;
  };

  const handleSubmit = async () => {
    if (!form) return;
    for (const field of form.fields) {
      if (field.required && shouldShowField(field) && !answers[field.id]) {
        alert(`"${field.label}" is required`);
        return;
      }
    }
    setSubmitting(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/submissions/${id}/submit`, { data: answers });
      setSubmitted(true);
    } catch {
      alert('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center">
      <div className="animate-spin w-5 h-5 border-2 border-teal-400 border-t-transparent rounded-full" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center">
      <div className="text-center">
        <p className="text-zinc-400 text-sm">{error}</p>
        <p className="text-zinc-600 text-xs mt-1">This form may have been deleted or doesn't exist.</p>
      </div>
    </div>
  );

  if (submitted) return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-14 h-14 bg-teal-400/10 border border-teal-400/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Response submitted!</h2>
        <p className="text-zinc-500 text-sm">Thanks for filling out this form.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#111111] py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 rounded-md bg-teal-400 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-zinc-500 text-xs">FormKraft</span>
          </div>
          <h1 className="text-2xl font-bold text-white">{form?.title}</h1>
          <div className="h-0.5 w-12 bg-teal-400 mt-3 rounded-full" />
        </div>

        {/* Fields */}
        <div className="space-y-4">
          {form?.fields.map((field) => {
            if (!shouldShowField(field)) return null;
            return (
              <div key={field.id} className="border border-white/8 rounded-2xl p-5 hover:border-white/12 transition">
                <label className="block text-white text-sm font-medium mb-3">
                  {field.label}
                  {field.required && <span className="text-red-400 ml-1">*</span>}
                </label>

                {field.type === 'text' && (
                  <input
                    type="text"
                    value={answers[field.id] || ''}
                    onChange={(e) => setAnswers({ ...answers, [field.id]: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-zinc-600 px-4 py-3 rounded-xl text-sm outline-none focus:border-teal-500/40 transition"
                    placeholder="Your answer..."
                  />
                )}

                {field.type === 'mcq' && (
                  <div className="space-y-2">
                    {field.options?.map((opt) => (
                      <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${answers[field.id] === opt ? 'border-teal-400 bg-teal-400' : 'border-zinc-600 group-hover:border-zinc-400'}`}>
                          {answers[field.id] === opt && <div className="w-1.5 h-1.5 bg-[#111111] rounded-full" />}
                        </div>
                        <input type="radio" name={field.id} value={opt} checked={answers[field.id] === opt} onChange={() => setAnswers({ ...answers, [field.id]: opt })} className="hidden" />
                        <span className="text-zinc-300 text-sm group-hover:text-white transition">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}

                {field.type === 'rating' && (
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button key={n} onClick={() => setAnswers({ ...answers, [field.id]: n })}
                        className={`text-2xl transition-all hover:scale-110 ${answers[field.id] >= n ? 'text-yellow-400' : 'text-zinc-700 hover:text-yellow-400/50'}`}>
                        ★
                      </button>
                    ))}
                    {answers[field.id] && <span className="text-zinc-500 text-xs self-center ml-1">{answers[field.id]}/5</span>}
                  </div>
                )}

                {field.type === 'file' && (
                  <label className="block border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-teal-500/30 transition cursor-pointer">
                    <svg className="w-6 h-6 text-zinc-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-zinc-500 text-sm">{answers[field.id] || 'Click to upload file'}</p>
                    <input type="file" className="hidden" onChange={(e) => setAnswers({ ...answers, [field.id]: e.target.files?.[0]?.name })} />
                  </label>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full mt-6 bg-teal-400 hover:bg-teal-300 text-[#111111] font-semibold py-3 rounded-xl text-sm transition disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit →'}
        </button>

        <p className="text-center text-xs text-zinc-700 mt-5">Powered by FormKraft</p>
      </div>
    </div>
  );
}