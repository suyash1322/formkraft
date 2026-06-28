import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#111111] flex flex-col">
      <nav className="border-b border-white/8 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-400 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-white font-semibold text-sm">FormKraft</span>
        </div>
        <div className="flex gap-3">
          <Link href="/login" className="text-sm text-zinc-400 hover:text-white transition px-4 py-2 rounded-xl hover:bg-white/5">
            Sign in
          </Link>
          <Link href="/register" className="text-sm bg-teal-400 hover:bg-teal-300 text-[#111111] font-semibold px-4 py-2 rounded-xl transition">
            Get started
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-xl text-center">
          <p className="text-zinc-500 text-sm mb-4">No-code form builder</p>
          <h1 className="text-5xl font-bold text-white mb-5 leading-tight">
            Build forms<br />that work.
          </h1>
          <p className="text-zinc-500 text-base mb-10 leading-relaxed max-w-sm mx-auto">
            Create, share, and collect responses — no code needed. Free plan includes 3 forms.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/register" className="bg-teal-400 hover:bg-teal-300 text-[#111111] font-semibold text-sm px-6 py-3 rounded-xl transition">
              Start for free
            </Link>
            <Link href="/login" className="text-sm text-zinc-400 border border-white/10 px-6 py-3 rounded-xl hover:bg-white/5 transition">
              Sign in
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-16 text-left">
            {[
              { title: 'Drag & Drop', desc: 'Reorder fields easily' },
              { title: 'Conditional Logic', desc: 'Show fields based on answers' },
              { title: 'Responses', desc: 'View all submissions' },
            ].map(f => (
              <div key={f.title} className="border border-white/8 rounded-xl p-4">
                <p className="text-white text-sm font-medium mb-1">{f.title}</p>
                <p className="text-zinc-500 text-xs">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}