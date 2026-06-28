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
  conditional?: {
    showIfFieldId: string;
    showIfValue: string;
  };
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
      const res = await axios.get(`http://localhost:4000/api/submissions/${id}/public`);
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

    // Required fields check
    for (const field of form.fields) {
      if (field.required && shouldShowField(field) && !answers[field.id]) {
        alert(`"${field.label}" is required`);
        return;
      }
    }

    setSubmitting(true);
    try {
      await axios.post(`http://localhost:4000/api/submissions/${id}/submit`, {
        data: answers
      });
      setSubmitted(true);
    } catch {
      alert('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a0f0f] flex items-center justify-center">
      <div className="animate-spin w-6 h-6 border-2 border-teal-400 border-t-transparent rounded-full" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#0a0f0f] flex items-center justify-center">
      <p className="text-red-400">{error}</p>
    </div>
  );

  if (submitted) return (
    <div className="min-h-screen bg-[#0a0f0f] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-teal-400/10 border border-teal-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Submitted!</h2>
        <p className="text-gray-400 text-sm">Thanks for filling out the form.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0f0f] py-12 px-4">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="relative max-w-xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 rounded-md bg-teal-400 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-[#0a0f0f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-gray-400 text-sm">FormKraft</span>
          </div>
          <h1 className="text-3xl font-bold text-white">{form?.title}</h1>
        </div>

        {/* Fields */}
        <div className="space-y-5">
          {form?.fields.map((field) => {
            if (!shouldShowField(field)) return null;

            return (
              <div key={field.id} className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                <label className="block text-white text-sm font-medium mb-3">
                  {field.label}
                  {field.required && <span className="text-red-400 ml-1">*</span>}
                </label>

                {field.type === 'text' && (
                  <input
                    type="text"
                    value={answers[field.id] || ''}
                    onChange={(e) => setAnswers({ ...answers, [field.id]: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 px-4 py-3 rounded-xl text-sm outline-none focus:border-teal-500/50 transition-all"
                    placeholder="Your answer..."
                  />
                )}

                {field.type === 'mcq' && (
                  <div className="space-y-2">
                    {field.options?.map((opt) => (
                      <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${answers[field.id] === opt ? 'border-teal-400 bg-teal-400' : 'border-gray-600 group-hover:border-teal-400/50'}`}>
                          {answers[field.id] === opt && <div className="w-1.5 h-1.5 bg-[#0a0f0f] rounded-full" />}
                        </div>
                        <input
                          type="radio"
                          name={field.id}
                          value={opt}
                          checked={answers[field.id] === opt}
                          onChange={() => setAnswers({ ...answers, [field.id]: opt })}
                          className="hidden"
                        />
                        <span className="text-gray-300 text-sm">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}

                {field.type === 'rating' && (
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => setAnswers({ ...answers, [field.id]: n })}
                        className={`text-2xl transition-all ${answers[field.id] >= n ? 'text-yellow-400' : 'text-gray-700 hover:text-yellow-400/50'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                )}

                {field.type === 'file' && (
                  <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-teal-500/30 transition-all cursor-pointer">
                    <svg className="w-6 h-6 text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-gray-500 text-sm">Click to upload file</p>
                    <input
                      type="file"
                      onChange={(e) => setAnswers({ ...answers, [field.id]: e.target.files?.[0]?.name })}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full mt-6 bg-teal-400 hover:bg-teal-300 text-[#0a0f0f] font-semibold py-3 rounded-xl text-sm transition-all active:scale-95 disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Form'}
        </button>

        <p className="text-center text-xs text-gray-700 mt-6">Powered by FormKraft</p>
      </div>
    </div>
  );
}