'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../lib/api';

interface Field {
  id: string;
  type: 'text' | 'mcq' | 'rating';
  label: string;
  options?: string[];
}

export default function FormBuilderPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState('');
  const [fields, setFields] = useState<Field[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchForm(); }, []);

  const fetchForm = async () => {
    const res = await api.get(`/forms/${id}`);
    setTitle(res.data.title);
    setFields(res.data.fields || []);
  };

  const addField = (type: Field['type']) => {
    const newField: Field = {
      id: Date.now().toString(),
      type,
      label: type === 'text' ? 'Text Question' : type === 'mcq' ? 'MCQ Question' : 'Rating Question',
      options: type === 'mcq' ? ['Option 1', 'Option 2'] : undefined,
    };
    setFields([...fields, newField]);
  };

  const updateLabel = (id: string, label: string) => {
    setFields(fields.map(f => f.id === id ? { ...f, label } : f));
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const saveForm = async () => {
    setSaving(true);
    try {
      await api.put(`/forms/${id}`, { title, fields });
      alert('Form saved!');
    } catch {
      alert('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const fieldTypeColors: Record<string, string> = {
    text: 'text-teal-400 bg-teal-400/10 border-teal-400/20',
    mcq: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    rating: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  };

  return (
    <div className="min-h-screen bg-[#0a0f0f]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Navbar */}
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

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-teal-400 flex items-center justify-center">
            <svg className="w-3 h-3 text-[#0a0f0f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-white font-semibold text-sm">FormKraft</span>
        </div>

        <button
          onClick={saveForm}
          disabled={saving}
          className="bg-teal-400 hover:bg-teal-300 text-[#0a0f0f] px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 disabled:opacity-50"
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Saving...
            </span>
          ) : 'Save Form'}
        </button>
      </nav>

      <div className="relative max-w-2xl mx-auto px-6 py-10">

        {/* Title */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-3xl font-bold bg-transparent text-white border-b border-white/10 focus:border-teal-500/50 outline-none pb-3 mb-8 placeholder-gray-600 transition-all"
          placeholder="Untitled Form"
        />

        {/* Add Field Buttons */}
        <div className="flex gap-2 mb-8">
          {[
            { type: 'text' as const, label: '+ Text', color: 'border-teal-500/30 text-teal-400 hover:bg-teal-400/10' },
            { type: 'mcq' as const, label: '+ MCQ', color: 'border-purple-500/30 text-purple-400 hover:bg-purple-400/10' },
            { type: 'rating' as const, label: '+ Rating', color: 'border-yellow-500/30 text-yellow-400 hover:bg-yellow-400/10' },
          ].map(btn => (
            <button
              key={btn.type}
              onClick={() => addField(btn.type)}
              className={`bg-white/5 border ${btn.color} px-4 py-2 rounded-xl text-sm font-medium transition-all`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Fields */}
        {fields.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
            <p className="text-gray-500 text-sm">Add a field from above to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:border-white/20 transition-all">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">#{index + 1}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-md border ${fieldTypeColors[field.type]}`}>
                      {field.type.toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={() => removeField(field.id)}
                    className="text-gray-600 hover:text-red-400 transition text-xs"
                  >
                    ✕ Remove
                  </button>
                </div>

                <input
                  value={field.label}
                  onChange={(e) => updateLabel(field.id, e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 px-3 py-2.5 rounded-xl text-sm outline-none focus:border-teal-500/50 transition-all"
                  placeholder="Question label"
                />

                {field.type === 'mcq' && (
                  <div className="mt-3 space-y-2">
                    {field.options?.map((opt, i) => (
                      <input
                        key={i}
                        value={opt}
                        onChange={(e) => {
                          const newOptions = [...(field.options || [])];
                          newOptions[i] = e.target.value;
                          setFields(fields.map(f => f.id === field.id ? { ...f, options: newOptions } : f));
                        }}
                        className="w-full bg-white/5 border border-white/5 text-gray-300 placeholder-gray-600 px-3 py-2 rounded-lg text-sm outline-none focus:border-purple-500/40 transition-all"
                        placeholder={`Option ${i + 1}`}
                      />
                    ))}
                    <button
                      onClick={() => setFields(fields.map(f => f.id === field.id ? { ...f, options: [...(f.options || []), `Option ${(f.options?.length || 0) + 1}`] } : f))}
                      className="text-xs text-purple-400 hover:text-purple-300 mt-1 transition"
                    >
                      + Add option
                    </button>
                  </div>
                )}

                {field.type === 'rating' && (
                  <div className="flex gap-1 mt-3">
                    {[1, 2, 3, 4, 5].map(n => (
                      <span key={n} className="text-yellow-400 text-xl">★</span>
                    ))}
                    <span className="text-gray-600 text-xs ml-2 self-center">1–5 scale</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}