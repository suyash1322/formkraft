import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0f0f] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative text-center max-w-2xl">
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-teal-400 flex items-center justify-center">
            <svg className="w-5 h-5 text-[#0a0f0f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-white font-semibold text-lg">FormKraft</span>
        </div>

        <h1 className="text-5xl font-extrabold text-white leading-tight mb-4">
          Build forms,<br />
          <span className="text-teal-400">without code.</span>
        </h1>
        <p className="text-gray-400 text-lg mb-10 max-w-md mx-auto">
          Drag, drop, and publish beautiful forms in minutes. No coding required.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/register"
            className="bg-teal-400 hover:bg-teal-300 text-[#0a0f0f] font-semibold px-6 py-3 rounded-xl text-sm transition-all"
          >
            Get started free →
          </Link>
          <Link
            href="/login"
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium px-6 py-3 rounded-xl text-sm transition-all"
          >
            Sign in
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-16">
          {[
            { icon: '⚡', title: 'Fast', desc: 'Build forms in minutes' },
            { icon: '🎨', title: 'Beautiful', desc: 'Clean, modern design' },
            { icon: '🔒', title: 'Secure', desc: 'Your data is safe' },
          ].map((f) => (
            <div key={f.title} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left">
              <div className="text-2xl mb-2">{f.icon}</div>
              <div className="text-white font-semibold text-sm">{f.title}</div>
              <div className="text-gray-500 text-xs mt-1">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}