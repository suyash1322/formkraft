'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import api from '../../../lib/api';

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

const fieldTypeColors: Record<string, string> = {
  text: 'text-teal-400 bg-teal-400/10 border-teal-400/20',
  mcq: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  rating: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  file: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
};

// Sortable Field Component
function SortableField({
  field,
  index,
  fields,
  onUpdateLabel,
  onUpdateOptions,
  onAddOption,
  onToggleRequired,
  onUpdateConditional,
  onRemove,
}: {
  field: Field;
  index: number;
  fields: Field[];
  onUpdateLabel: (id: string, label: string) => void;
  onUpdateOptions: (id: string, options: string[]) => void;
  onAddOption: (id: string) => void;
  onToggleRequired: (id: string) => void;
  onUpdateConditional: (id: string, conditional: Field['conditional']) => void;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const otherFields = fields.filter(f => f.id !== field.id && f.type === 'mcq');

  return (
    <div ref={setNodeRef} style={style} className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:border-white/20 transition-all">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className="text-gray-600 hover:text-gray-400 cursor-grab active:cursor-grabbing transition"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 6a2 2 0 100-4 2 2 0 000 4zm0 8a2 2 0 100-4 2 2 0 000 4zm0 8a2 2 0 100-4 2 2 0 000 4zm8-16a2 2 0 100-4 2 2 0 000 4zm0 8a2 2 0 100-4 2 2 0 000 4zm0 8a2 2 0 100-4 2 2 0 000 4z"/>
            </svg>
          </button>
          <span className="text-xs text-gray-600">#{index + 1}</span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-md border ${fieldTypeColors[field.type]}`}>
            {field.type.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer">
            <input
              type="checkbox"
              checked={field.required || false}
              onChange={() => onToggleRequired(field.id)}
              className="accent-teal-400"
            />
            Required
          </label>
          <button onClick={() => onRemove(field.id)} className="text-gray-600 hover:text-red-400 transition text-xs">
            ✕ Remove
          </button>
        </div>
      </div>

      {/* Label */}
      <input
        value={field.label}
        onChange={(e) => onUpdateLabel(field.id, e.target.value)}
        className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 px-3 py-2.5 rounded-xl text-sm outline-none focus:border-teal-500/50 transition-all"
        placeholder="Question label"
      />

      {/* MCQ Options */}
      {field.type === 'mcq' && (
        <div className="mt-3 space-y-2">
          {field.options?.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border border-purple-400/40 shrink-0" />
              <input
                value={opt}
                onChange={(e) => {
                  const newOptions = [...(field.options || [])];
                  newOptions[i] = e.target.value;
                  onUpdateOptions(field.id, newOptions);
                }}
                className="flex-1 bg-white/5 border border-white/5 text-gray-300 placeholder-gray-600 px-3 py-2 rounded-lg text-sm outline-none focus:border-purple-500/40 transition-all"
                placeholder={`Option ${i + 1}`}
              />
              <button
                onClick={() => onUpdateOptions(field.id, field.options?.filter((_, idx) => idx !== i) || [])}
                className="text-gray-600 hover:text-red-400 text-xs transition"
              >✕</button>
            </div>
          ))}
          <button
            onClick={() => onAddOption(field.id)}
            className="text-xs text-purple-400 hover:text-purple-300 mt-1 transition"
          >
            + Add option
          </button>
        </div>
      )}

      {/* Rating Preview */}
      {field.type === 'rating' && (
        <div className="flex gap-1 mt-3">
          {[1, 2, 3, 4, 5].map(n => (
            <span key={n} className="text-yellow-400 text-xl">★</span>
          ))}
          <span className="text-gray-600 text-xs ml-2 self-center">1–5 scale</span>
        </div>
      )}

      {/* File Upload Preview */}
      {field.type === 'file' && (
        <div className="mt-3 border-2 border-dashed border-blue-400/20 rounded-xl p-4 text-center">
          <svg className="w-6 h-6 text-blue-400/50 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-xs text-blue-400/50">File upload field</p>
        </div>
      )}

      {/* Conditional Logic */}
      {otherFields.length > 0 && (
        <div className="mt-4 border-t border-white/5 pt-4">
          <p className="text-xs text-gray-500 mb-2">Conditional Logic</p>
          <div className="flex gap-2 items-center flex-wrap">
            <span className="text-xs text-gray-500">Show if</span>
            <select
              value={field.conditional?.showIfFieldId || ''}
              onChange={(e) => onUpdateConditional(field.id, e.target.value ? {
                showIfFieldId: e.target.value,
                showIfValue: field.conditional?.showIfValue || '',
              } : undefined)}
              className="bg-white/5 border border-white/10 text-gray-300 px-2 py-1 rounded-lg text-xs outline-none"
            >
              <option value="">-- No condition --</option>
              {otherFields.map(f => (
                <option key={f.id} value={f.id}>{f.label}</option>
              ))}
            </select>
            {field.conditional?.showIfFieldId && (
              <>
                <span className="text-xs text-gray-500">equals</span>
                <input
                  value={field.conditional?.showIfValue || ''}
                  onChange={(e) => onUpdateConditional(field.id, {
                    showIfFieldId: field.conditional!.showIfFieldId,
                    showIfValue: e.target.value,
                  })}
                  placeholder="value"
                  className="bg-white/5 border border-white/10 text-gray-300 px-2 py-1 rounded-lg text-xs outline-none w-24"
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Main Page
export default function FormBuilderPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState('');
  const [fields, setFields] = useState<Field[]>([]);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => { fetchForm(); }, []);

  const fetchForm = async () => {
    const res = await api.get(`/forms/${id}`);
    setTitle(res.data.title);
    setFields(res.data.fields || []);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addField = (type: Field['type']) => {
    setFields([...fields, {
      id: Date.now().toString(),
      type,
      label: type === 'text' ? 'Text Question' : type === 'mcq' ? 'MCQ Question' : type === 'rating' ? 'Rating Question' : 'File Upload',
      options: type === 'mcq' ? ['Option 1', 'Option 2'] : undefined,
    }]);
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
    <div className="min-h-screen bg-[#0a0f0f]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Navbar */}
      <nav className="relative border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition">
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
          {saving ? 'Saving...' : 'Save Form'}
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
        <div className="flex gap-2 mb-8 flex-wrap">
          {[
            { type: 'text' as const, label: '+ Text', color: 'border-teal-500/30 text-teal-400 hover:bg-teal-400/10' },
            { type: 'mcq' as const, label: '+ MCQ', color: 'border-purple-500/30 text-purple-400 hover:bg-purple-400/10' },
            { type: 'rating' as const, label: '+ Rating', color: 'border-yellow-500/30 text-yellow-400 hover:bg-yellow-400/10' },
            { type: 'file' as const, label: '+ File Upload', color: 'border-blue-500/30 text-blue-400 hover:bg-blue-400/10' },
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

        {/* Drag & Drop Fields */}
        {fields.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
            <p className="text-gray-500 text-sm">Add a field from above to get started</p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <SortableField
                    key={field.id}
                    field={field} 
                    index={index}
                    fields={fields}
                    onUpdateLabel={(id, label) => setFields(fields.map(f => f.id === id ? { ...f, label } : f))}
                    onUpdateOptions={(id, options) => setFields(fields.map(f => f.id === id ? { ...f, options } : f))}
                    onAddOption={(id) => setFields(fields.map(f => f.id === id ? { ...f, options: [...(f.options || []), `Option ${(f.options?.length || 0) + 1}`] } : f))}
                    onToggleRequired={(id) => setFields(fields.map(f => f.id === id ? { ...f, required: !f.required } : f))}
                    onUpdateConditional={(id, conditional) => setFields(fields.map(f => f.id === id ? { ...f, conditional } : f))}
                    onRemove={(id) => setFields(fields.filter(f => f.id !== id))}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}