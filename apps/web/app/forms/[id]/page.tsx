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

  useEffect(() => {
    fetchForm();
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <button onClick={() => router.push('/dashboard')} className="text-blue-600 hover:underline text-sm">← Dashboard</button>
        <button onClick={saveForm} disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Form'}
        </button>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-2xl font-bold border-b-2 border-gray-200 focus:border-blue-500 outline-none pb-2 mb-6 bg-transparent"
          placeholder="Form Title"
        />

        {/* Field Buttons */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => addField('text')} className="bg-white border border-gray-200 px-3 py-2 rounded-lg text-sm hover:bg-gray-50">+ Text</button>
          <button onClick={() => addField('mcq')} className="bg-white border border-gray-200 px-3 py-2 rounded-lg text-sm hover:bg-gray-50">+ MCQ</button>
          <button onClick={() => addField('rating')} className="bg-white border border-gray-200 px-3 py-2 rounded-lg text-sm hover:bg-gray-50">+ Rating</button>
        </div>

        {/* Fields */}
        {fields.length === 0 ? (
          <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
            <p>Upar se field add karo</p>
          </div>
        ) : (
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-blue-500 font-medium uppercase">{field.type}</span>
                  <button onClick={() => removeField(field.id)} className="text-red-400 text-xs hover:text-red-600">Remove</button>
                </div>
                <input
                  value={field.label}
                  onChange={(e) => updateLabel(field.id, e.target.value)}
                  className="w-full border border-gray-200 p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Question label"
                />
                {field.type === 'mcq' && (
                  <div className="mt-2 space-y-1">
                    {field.options?.map((opt, i) => (
                      <input key={i} value={opt}
                        onChange={(e) => {
                          const newOptions = [...(field.options || [])];
                          newOptions[i] = e.target.value;
                          setFields(fields.map(f => f.id === field.id ? { ...f, options: newOptions } : f));
                        }}
                        className="w-full border border-gray-100 p-2 rounded text-sm outline-none"
                        placeholder={`Option ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
                {field.type === 'rating' && (
                  <div className="flex gap-1 mt-2">
                    {[1,2,3,4,5].map(n => <span key={n} className="text-yellow-400 text-xl">★</span>)}
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